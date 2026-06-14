import { Box, Typography, Divider, Grid } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { colors } from '../../theme/theme';

export function ProfileSectionCard({ title, subtitle, icon, action, children }) {
  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: colors.background,
        border: `1px solid ${colors.border}`,
        boxShadow: `0 8px 32px ${colors.shadow}`,
      }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 2,
          borderBottom: `1px solid ${colors.border}`,
          bgcolor: colors.surface,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="overline" color="text.secondary" letterSpacing={1.2} lineHeight={1.8}>
            Profile
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            {icon}
            <Typography variant="h6" fontWeight={800} lineHeight={1.3}>
              {title}
            </Typography>
          </Box>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Box>
      <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
    </Box>
  );
}

export function ProfileInfoRow({ label, value }) {
  return (
    <Box
      sx={{
        p: 1.75,
        borderRadius: 2,
        bgcolor: colors.surface,
        border: `1px solid ${colors.border}`,
        height: '100%',
      }}
    >
      <Box display="flex" alignItems="center" gap={0.75} mb={0.75}>
        <LockOutlinedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
        <Typography variant="caption" color="text.secondary" fontWeight={600} letterSpacing={0.3}>
          {label}
        </Typography>
      </Box>
      <Typography variant="body2" fontWeight={700} sx={{ wordBreak: 'break-word' }}>
        {value || '—'}
      </Typography>
    </Box>
  );
}

export function ProfileFormDivider({ label }) {
  return (
    <Grid item xs={12}>
      <Divider textAlign="left">
        <Typography variant="caption" color="text.secondary" fontWeight={700} letterSpacing={0.5}>
          {label}
        </Typography>
      </Divider>
    </Grid>
  );
}
