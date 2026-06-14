import { useState } from 'react';
import { Outlet, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaymentIcon from '@mui/icons-material/Payment';
import BookIcon from '@mui/icons-material/Book';
import TargetIcon from '@mui/icons-material/GpsFixed';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { api, getUploadUrl } from '../api/client';
import { colors } from '../theme/theme';
import Logo from '../components/Logo';
import MobileBottomNav from '../components/student/MobileBottomNav';
import MobileScrollSpacer from '../components/student/MobileScrollSpacer';
import StudentNotificationBell from '../components/student/StudentNotificationBell';

const DRAWER_WIDTH = 248;

const navItems = [
  { to: '/student', label: 'Dashboard', icon: <DashboardIcon />, end: true },
  { to: '/student/fees', label: 'Fees & Payments', icon: <PaymentIcon /> },
  { to: '/student/diary', label: 'Diary', icon: <BookIcon /> },
  { to: '/student/scores', label: 'Scores', icon: <TargetIcon /> },
  { to: '/student/profile', label: 'Profile & Settings', icon: <ManageAccountsIcon /> },
];

const darkNavItemSx = {
  mx: 1,
  mb: 0.5,
  borderRadius: 2,
  color: colors.textOnDark,
  minHeight: 48,
  '& .MuiListItemIcon-root': { color: colors.primary, minWidth: 40 },
  '& .MuiListItemText-primary': { color: colors.textOnDark, fontWeight: 500 },
  '&:hover': {
    bgcolor: 'rgba(255,214,0,0.12)',
    '& .MuiListItemText-primary': { color: colors.textOnDark },
    '& .MuiListItemIcon-root': { color: colors.primary },
  },
  '&.active': {
    bgcolor: colors.primary,
    color: colors.secondary,
    fontWeight: 700,
    '& .MuiListItemIcon-root': { color: colors.secondary },
    '& .MuiListItemText-primary': { fontWeight: 700, color: colors.secondary },
  },
};

function SidebarNav({ onNavigate = () => {} }) {
  return (
    <Box
      component="nav"
      sx={{
        width: DRAWER_WIDTH,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: colors.secondary,
        color: colors.textOnDark,
        zIndex: (t) => t.zIndex.drawer,
        borderRight: `1px solid rgba(255,214,0,0.15)`,
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 2,
          borderBottom: `2px solid ${colors.primary}`,
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Logo to="/student" height={52} />
      </Box>

      <List dense disablePadding sx={{ py: 1, flex: 1, overflowY: 'auto' }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.label}
            component={NavLink}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            sx={darkNavItemSx}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500, color: 'inherit' }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

export default function StudentLayout() {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, logout, updateProfile, refreshToken } = useAuthStore();

  const { data: notifications = [] } = useQuery({
    queryKey: ['student-notifications'],
    queryFn: async () => (await api.get('/students/notifications')).data.data.notifications,
    staleTime: 60_000,
    refetchInterval: 120_000,
  });

  useQuery({
    queryKey: ['student-profile'],
    queryFn: async () => {
      const data = (await api.get('/students/profile')).data.data;
      updateProfile(data);
      return data;
    },
  });

  const iconColor = isMobile ? colors.textOnDark : colors.text;

  const confirmLogout = async () => {
    setLogoutOpen(false);
    try {
      await api.post('/auth/logout', { refreshToken });
    } catch {
      /* ignore */
    }
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ bgcolor: colors.surface }}>
      {!isMobile && <SidebarNav />}

      <Box
        sx={{
          ml: { md: `${DRAWER_WIDTH}px` },
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: { md: '100vh' },
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: isMobile ? colors.secondary : colors.background,
            color: isMobile ? colors.textOnDark : colors.text,
            borderBottom: isMobile ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar
            sx={{
              minHeight: { xs: 56, md: 60 },
              gap: 1,
              px: { xs: 1.5, md: 2 },
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {isMobile ? (
              <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <Logo to="/student" height={38} />
              </Box>
            ) : (
              <Box>
                <Typography variant="subtitle2" fontWeight={800} lineHeight={1.1} color={colors.text}>
                  Kalyani Shooting Academy
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Student Portal
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                ml: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.5, sm: 1.25 },
                flexShrink: 0,
              }}
            >
              <Box textAlign="right" sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography variant="body2" fontWeight={700} lineHeight={1.2} color={colors.text}>
                  {profile?.fullName || 'Student'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {profile?.studentId || '—'}
                </Typography>
              </Box>

              {isMobile && (
                <Box textAlign="right" sx={{ display: { xs: 'none', sm: 'block' }, mr: 0.5, maxWidth: 100 }}>
                  <Typography variant="caption" fontWeight={700} noWrap sx={{ color: colors.textOnDark }}>
                    {profile?.fullName?.split(' ')[0]}
                  </Typography>
                  <Typography variant="caption" display="block" noWrap sx={{ fontSize: '0.65rem', color: colors.primary }}>
                    {profile?.studentId}
                  </Typography>
                </Box>
              )}

              <Tooltip title="Profile & Settings">
                <IconButton onClick={() => navigate('/student/profile')} sx={{ p: 0.5 }}>
                  <Avatar
                    src={getUploadUrl(profile?.photo)}
                    sx={{
                      width: { xs: 34, md: 40 },
                      height: { xs: 34, md: 40 },
                      border: `2px solid ${colors.primary}`,
                    }}
                  />
                </IconButton>
              </Tooltip>

              <StudentNotificationBell notifications={notifications} iconColor={iconColor} />

              {isMobile ? (
                <Tooltip title="Logout">
                  <IconButton
                    onClick={() => setLogoutOpen(true)}
                    sx={{
                      color: colors.textOnDark,
                      border: `1px solid rgba(255,214,0,0.4)`,
                      borderRadius: 2,
                    }}
                  >
                    <LogoutIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<LogoutIcon />}
                  onClick={() => setLogoutOpen(true)}
                  sx={{
                    fontWeight: 600,
                    borderRadius: 2,
                    borderColor: colors.secondary,
                    color: colors.secondary,
                    '&:hover': {
                      bgcolor: colors.secondary,
                      color: colors.primary,
                      borderColor: colors.secondary,
                    },
                  }}
                >
                  Logout
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            px: { xs: 2, sm: 2.5, md: 3 },
            py: { xs: 2, md: 2.5 },
            pb: { xs: 0, md: 2.5 },
            minWidth: 0,
            overflow: 'visible',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'visible' }}
            >
              <Outlet />
              {isMobile && <MobileScrollSpacer />}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>

      {isMobile && <MobileBottomNav />}

      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText color="text.secondary">
            Are you sure you want to logout from your student portal?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setLogoutOpen(false)} sx={{ color: colors.textMuted }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmLogout}
            startIcon={<LogoutIcon />}
            sx={{ bgcolor: colors.secondary, color: colors.primary, '&:hover': { bgcolor: '#2a2a2a' } }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
