import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box, Container, Paper, TextField, Button, Typography, Alert, InputAdornment, IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { motion } from 'framer-motion';
import { api } from '../api/client';
import { fetchCsrfToken } from '../api/security';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/theme';
import Logo from '../components/Logo';

const schema = z.object({
  identifier: z.string().min(1, 'Email or phone required'),
  password: z.string().min(1, 'Password required'),
});

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values) => {
    setError('');
    try {
      await fetchCsrfToken();
      const res = await api.post('/auth/login', { ...values, portal: 'student' });
      const data = res.data.data;
      if (data.user.role !== 'student') {
        setError('Please use the admin panel for admin login.');
        return;
      }
      login(data);
      navigate('/student');
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" sx={{ bgcolor: colors.secondary }}>
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" mb={3}>
          <Logo height={80} />
        </Box>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Paper sx={{ p: 4, borderTop: `4px solid ${colors.primary}` }}>
            <Typography variant="h5" fontWeight={800} textAlign="center" mb={3}>
              Student Login
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField fullWidth label="Email or Phone" margin="normal" {...register('identifier')} error={!!errors.identifier} helperText={errors.identifier?.message} />
              <TextField
                fullWidth label="Password" type={show ? 'text' : 'password'} margin="normal"
                {...register('password')} error={!!errors.password} helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShow(!show)} edge="end">
                        {show ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button fullWidth type="submit" variant="contained" color="primary" size="large" disabled={isSubmitting} sx={{ mt: 3 }}>
                {isSubmitting ? 'Signing in...' : 'Login'}
              </Button>
              <Button fullWidth sx={{ mt: 1 }} onClick={() => navigate('/')}>Back to Home</Button>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
