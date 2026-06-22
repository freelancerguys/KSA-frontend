import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';
import { api } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/theme';
import Logo from '../components/Logo';
import GoogleSignInButton from '../components/GoogleSignInButton';
import LoginPageFooter from '../components/LoginPageFooter';

const schema = z.object({
  identifier: z.string().min(1, 'Email or phone required'),
  password: z.string().min(1, 'Password required'),
});

const fieldSx = (compact) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: compact ? 2 : 2.5,
    bgcolor: colors.surface,
    transition: 'box-shadow 0.2s ease, background-color 0.2s ease',
    '& fieldset': { borderColor: 'rgba(17,17,17,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(17,17,17,0.22)' },
    '&.Mui-focused': {
      bgcolor: colors.background,
      boxShadow: `0 0 0 3px ${colors.primaryMuted}`,
      '& fieldset': { borderColor: colors.primary },
    },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: colors.text },
  '& .MuiFormHelperText-root': { mt: 0.5 },
});

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isUltrawide = useMediaQuery('(min-aspect-ratio: 19/6) and (min-width: 768px)');
  const compact = !isMobile;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const completeLogin = (data) => {
    if (data.user.role !== 'student') {
      setError('Please use the admin panel for admin login.');
      return false;
    }
    login(data);
    navigate('/student');
    return true;
  };

  const onSubmit = async (values) => {
    setError('');
    try {
      const res = await api.post('/auth/login', { ...values, portal: 'student' });
      completeLogin(res.data.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleSuccess = useCallback(async (response) => {
    setError('');
    setGoogleLoading(true);
    try {
      const res = await api.post('/auth/google', {
        idToken: response.credential,
        portal: 'student',
      });
      if (res.data.data.user.role !== 'student') {
        setError('Please use the admin panel for admin login.');
        return;
      }
      login(res.data.data);
      navigate('/student');
    } catch (e) {
      setError(e.response?.data?.message || 'Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  }, [login, navigate]);

  const handleGoogleError = useCallback(() => {
    setError('Google sign-in was cancelled or could not start. Please try again.');
  }, []);

  const handleGoogleNotConfigured = useCallback(() => {
    setError('Google sign-in is not configured yet. Use email and password to log in.');
  }, []);

  const busy = isSubmitting || googleLoading;

  const loginCard = (
    <Paper
      elevation={0}
      className="login-paper"
      sx={{
        p: compact
          ? isUltrawide ? 2 : { md: 2.5, lg: 3 }
          : { xs: 3, sm: 4 },
        borderRadius: compact ? 3 : { xs: 3, sm: 4 },
        borderTop: `4px solid ${colors.primary}`,
        bgcolor: colors.background,
        boxShadow: `
          0 24px 64px rgba(0,0,0,0.42),
          0 0 0 1px rgba(255,255,255,0.06)
        `,
        width: '100%',
      }}
    >
      <Stack
        spacing={compact ? 0.25 : 0.5}
        alignItems="center"
        mb={compact ? (isUltrawide ? 1.5 : 2) : 3}
      >
        <Typography
          variant="h5"
          fontWeight={800}
          textAlign="center"
          sx={{
            fontSize: compact
              ? isUltrawide ? '1.15rem' : { md: '1.25rem', lg: '1.35rem' }
              : { xs: '1.35rem', sm: '1.5rem' },
            letterSpacing: '-0.02em',
          }}
        >
          Student Login
        </Typography>
        {!isUltrawide && (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{
              maxWidth: 280,
              lineHeight: 1.45,
              fontSize: compact ? '0.8rem' : undefined,
              display: { xs: 'block', md: compact ? 'none' : 'block' },
            }}
          >
            Sign in to access your portal, scores, and fee details
          </Typography>
        )}
      </Stack>

      {error && (
        <motion.div {...fadeUp}>
          <Alert
            severity="error"
            sx={{
              mb: compact ? 1.5 : 2.5,
              py: compact ? 0.25 : undefined,
              borderRadius: 2.5,
              '& .MuiAlert-message': { fontSize: compact ? '0.8rem' : '0.875rem' },
            }}
          >
            {error}
          </Alert>
        </motion.div>
      )}

      <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
              <GoogleSignInButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                onNotConfigured={handleGoogleNotConfigured}
                disabled={busy}
                compact={compact && isUltrawide}
              />
      </motion.div>

      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        className="login-divider"
        sx={{ my: compact ? (isUltrawide ? 1.25 : 1.75) : 3 }}
      >
        <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(17,17,17,0.1)' }} />
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap', px: 0.5, fontSize: compact ? '0.68rem' : undefined }}>
          or sign in with email
        </Typography>
        <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(17,17,17,0.1)' }} />
      </Stack>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={compact ? (isUltrawide ? 1 : 1.25) : 2}>
          <TextField
            fullWidth
            size={compact ? 'small' : 'medium'}
            label="Email or Phone"
            {...register('identifier')}
            error={!!errors.identifier}
            helperText={errors.identifier?.message}
            sx={fieldSx(compact)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon sx={{ color: colors.textMuted, fontSize: compact ? 18 : 20 }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            size={compact ? 'small' : 'medium'}
            label="Password"
            type={show ? 'text' : 'password'}
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={fieldSx(compact)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: colors.textMuted, fontSize: compact ? 18 : 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShow(!show)}
                    edge="end"
                    aria-label={show ? 'Hide password' : 'Show password'}
                    size="small"
                  >
                    {show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          size={compact ? 'medium' : 'large'}
          disabled={busy}
          sx={{
            mt: compact ? (isUltrawide ? 1.5 : 2) : 3,
            py: compact ? 1 : 1.5,
            borderRadius: 2.5,
            fontSize: compact ? '0.9rem' : '1rem',
            fontWeight: 700,
            boxShadow: '0 4px 16px rgba(255,214,0,0.35)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover:not(.Mui-disabled)': {
              transform: 'translateY(-1px)',
              boxShadow: '0 8px 24px rgba(255,214,0,0.45)',
            },
          }}
        >
          {isSubmitting ? 'Signing in...' : 'Login'}
        </Button>

        <Button
          fullWidth
          startIcon={<ArrowBackIcon sx={{ fontSize: compact ? 16 : 18 }} />}
          onClick={() => navigate('/')}
          sx={{
            mt: compact ? 1 : 1.5,
            py: compact ? 0.75 : 1.25,
            color: colors.textMuted,
            fontWeight: 500,
            fontSize: compact ? '0.85rem' : undefined,
            borderRadius: 2.5,
            '&:hover': {
              bgcolor: colors.primaryMuted,
              color: colors.text,
            },
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Paper>
  );

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        height: { md: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden',
        overflowY: { xs: 'auto', md: 'hidden' },
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, md: isUltrawide ? 1 : 2 },
        background: `
          radial-gradient(ellipse 90% 60% at 50% -15%, rgba(255,214,0,0.18) 0%, transparent 55%),
          radial-gradient(ellipse 50% 40% at 0% 100%, rgba(255,214,0,0.06) 0%, transparent 50%),
          radial-gradient(ellipse 40% 35% at 100% 80%, rgba(255,214,0,0.05) 0%, transparent 45%),
          ${colors.secondary}
        `,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: { xs: '-8%', md: '-15%' },
          right: { xs: '-25%', md: '-8%' },
          width: { xs: 220, md: 280 },
          height: { xs: 220, md: 280 },
          borderRadius: '50%',
          border: '1px solid rgba(255,214,0,0.12)',
          pointerEvents: 'none',
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          bottom: { xs: '-12%', md: '-15%' },
          left: { xs: '-20%', md: '-6%' },
          width: { xs: 180, md: 220 },
          height: { xs: 180, md: 220 },
          borderRadius: '50%',
          border: '1px solid rgba(255,214,0,0.08)',
          pointerEvents: 'none',
        }}
      />

      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          flex: 1,
          display: 'flex',
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'center',
          minHeight: 0,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%' }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { md: 'center' },
              justifyContent: 'center',
              gap: { md: isUltrawide ? 3 : 5, lg: 6 },
              maxHeight: { md: 'calc(100dvh - 32px)' },
            }}
          >
            {/* Desktop sidebar — logo + footer info */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'center',
                flex: '0 1 42%',
                maxWidth: 480,
                minWidth: 0,
                pr: { md: 1, lg: 2 },
              }}
            >
              <Box
                sx={{
                  bgcolor: 'rgba(0,0,0,0.35)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 3,
                  px: 2.5,
                  py: isUltrawide ? 1.25 : 1.75,
                  border: '1px solid rgba(255,214,0,0.15)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  alignSelf: 'flex-start',
                  mb: isUltrawide ? 1.5 : 2,
                }}
              >
                <Logo height={isUltrawide ? 48 : 56} />
              </Box>
              <LoginPageFooter variant="sidebar" />
            </Box>

            {/* Login card column */}
            <Box
              sx={{
                width: '100%',
                maxWidth: { xs: 440, md: isUltrawide ? 380 : 420 },
                mx: 'auto',
                flexShrink: 0,
              }}
            >
              {/* Mobile logo */}
              <Box
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  justifyContent: 'center',
                  mb: 2.5,
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'rgba(0,0,0,0.35)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 3,
                    px: 2.5,
                    py: 1.5,
                    border: '1px solid rgba(255,214,0,0.15)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  }}
                >
                  <Logo height={64} />
                </Box>
              </Box>

              {loginCard}
            </Box>
          </Box>

          {/* Mobile footer */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <LoginPageFooter variant="stack" />
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
