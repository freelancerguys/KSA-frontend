import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { api } from '../api/client';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user, refreshToken, setSession, logout } = useAuthStore();
  const [checking, setChecking] = useState(!isAuthenticated || !!refreshToken);

  useEffect(() => {
    const bootstrap = async () => {
      if (!refreshToken && !isAuthenticated) {
        setChecking(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setSession({
          user: {
            id: res.data.data.user._id,
            email: res.data.data.user.email,
            phone: res.data.data.user.phone,
            role: res.data.data.user.role,
          },
          profile: res.data.data.student,
        });
      } catch {
        logout();
      } finally {
        setChecking(false);
      }
    };
    bootstrap();
  }, []);

  if (checking) {
    return (
      <Box minHeight="40vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || user?.role !== 'student') {
    return <Navigate to="/login" replace />;
  }
  return children;
}
