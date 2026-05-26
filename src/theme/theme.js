import { createTheme } from '@mui/material/styles';

/** KSA brand palette — use these tokens everywhere for consistent colors */
export const colors = {
  primary: '#FFD600',
  secondary: '#111111',
  background: '#FFFFFF',
  surface: '#F7F7F5',
  surfaceAlt: '#EFEFEB',
  text: '#111111',
  textMuted: '#5C5C5C',
  textOnDark: '#FFFFFF',
  textMutedOnDark: 'rgba(255,255,255,0.72)',
  border: 'rgba(17,17,17,0.1)',
  primaryMuted: 'rgba(255,214,0,0.18)',
  shadow: 'rgba(17,17,17,0.08)',
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: colors.primary, contrastText: colors.secondary },
    secondary: { main: colors.secondary, contrastText: colors.textOnDark },
    background: { default: colors.surface, paper: colors.background },
    text: { primary: colors.text, secondary: colors.textMuted },
    divider: colors.border,
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: { fontFamily: '"Bebas Neue", sans-serif', letterSpacing: 2, color: colors.text },
    h2: { fontFamily: '"Bebas Neue", sans-serif', letterSpacing: 1.5, color: colors.text },
    h3: { fontWeight: 700, color: colors.text },
    h5: { color: colors.text },
    h6: { color: colors.text },
    body1: { color: colors.text },
    body2: { color: colors.textMuted },
    caption: { color: colors.textMuted },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 10 },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            backgroundColor: colors.primary,
            color: colors.secondary,
            fontWeight: 700,
            '&:hover': { backgroundColor: '#e6c200', color: colors.secondary },
            '&.Mui-disabled': {
              backgroundColor: colors.surfaceAlt,
              color: colors.textMuted,
            },
          },
        },
        {
          props: { variant: 'contained', color: 'secondary' },
          style: {
            backgroundColor: colors.secondary,
            color: colors.primary,
            fontWeight: 700,
            '&:hover': { backgroundColor: '#2a2a2a', color: colors.primary },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(17,17,17,0.08)',
              color: colors.textMuted,
            },
          },
        },
        {
          props: { variant: 'outlined' },
          style: {
            borderColor: colors.secondary,
            color: colors.secondary,
            '&:hover': {
              borderColor: colors.secondary,
              backgroundColor: colors.primaryMuted,
              color: colors.secondary,
            },
            '&.Mui-disabled': {
              borderColor: colors.border,
              color: colors.textMuted,
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 16, boxShadow: `0 8px 32px ${colors.shadow}` },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardInfo: {
          backgroundColor: colors.primaryMuted,
          color: colors.text,
          '& .MuiAlert-icon': { color: colors.secondary },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        colorPrimary: { backgroundColor: colors.primary, color: colors.secondary },
      },
    },
  },
});
