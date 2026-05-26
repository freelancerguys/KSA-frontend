import { useLocation, useNavigate } from 'react-router-dom';
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaymentIcon from '@mui/icons-material/Payment';
import BookIcon from '@mui/icons-material/Book';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { colors } from '../../theme/theme';
import { MOBILE_BOTTOM_NAV_HEIGHT } from '../../constants/studentLayout';

const tabs = [
  { label: 'Home', to: '/student', icon: DashboardIcon },
  { label: 'Fees', to: '/student/fees', icon: PaymentIcon },
  { label: 'Diary', to: '/student/diary', icon: BookIcon },
  { label: 'Scores', to: '/student/scores', icon: GpsFixedIcon },
  { label: 'Profile', to: '/student/profile', icon: ManageAccountsIcon },
];

function pathToIndex(pathname) {
  if (pathname === '/student' || pathname === '/student/') return 0;
  if (pathname.startsWith('/student/fees')) return 1;
  if (pathname.startsWith('/student/diary')) return 2;
  if (pathname.startsWith('/student/scores')) return 3;
  if (pathname.startsWith('/student/profile')) return 4;
  return 0;
}

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const value = pathToIndex(location.pathname);

  return (
    <Paper
      elevation={12}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.drawer + 2,
        bgcolor: colors.secondary,
        borderTop: `3px solid ${colors.primary}`,
        borderRadius: 0,
        pb: 'max(8px, env(safe-area-inset-bottom))',
      }}
    >
      <BottomNavigation
        value={value}
        onChange={(_, newValue) => navigate(tabs[newValue].to)}
        showLabels
        sx={{
          bgcolor: 'transparent',
          height: MOBILE_BOTTOM_NAV_HEIGHT,
          '& .MuiBottomNavigationAction-root': {
            color: colors.textOnDark,
            minWidth: 0,
            maxWidth: 'none',
            flex: 1,
            py: 0.5,
            '& .MuiSvgIcon-root': { fontSize: 26, color: colors.textOnDark },
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.68rem',
            mt: 0.25,
            color: colors.textOnDark,
            '&.Mui-selected': {
              fontSize: '0.72rem',
              fontWeight: 700,
              color: colors.primary,
            },
          },
          '& .Mui-selected': {
            color: `${colors.primary} !important`,
            '& .MuiSvgIcon-root': { color: `${colors.primary} !important` },
          },
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <BottomNavigationAction
              key={tab.label}
              label={tab.label}
              icon={<Icon />}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
}
