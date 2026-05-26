import { Box, Typography, Avatar, Chip, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import { getUploadUrl } from '../../api/client';
import { colors } from '../../theme/theme';

const onDark = {
  title: colors.textOnDark,
  label: colors.textMutedOnDark,
  value: colors.textOnDark,
};

export default function StudentProfileCard({ profile, delay = 0 }) {
  if (!profile) return null;

  const ids = [
    { label: 'KSA ID', value: profile.studentId },
    { label: 'WB Shooter ID', value: profile.wbShooterId },
    { label: 'NRAI ID', value: profile.nraiShooterId },
  ];

  return (
    <GlassCard
      delay={delay}
      sx={{
        mb: 3,
        background: `linear-gradient(135deg, ${colors.secondary} 0%, #1a1a1a 100%)`,
        color: onDark.title,
        border: `1px solid rgba(255,214,0,0.2)`,
      }}
    >
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm="auto">
            <motion.div whileHover={{ scale: 1.03 }}>
              <Avatar
                src={getUploadUrl(profile.photo)}
                sx={{
                  width: { xs: 72, md: 88 },
                  height: { xs: 72, md: 88 },
                  mx: { xs: 'auto', sm: 0 },
                  display: { xs: 'flex', sm: 'block' },
                  border: `3px solid ${colors.primary}`,
                }}
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} sm>
            <Typography
              variant="h6"
              fontWeight={800}
              textAlign={{ xs: 'center', sm: 'left' }}
              sx={{ color: onDark.title }}
            >
              {profile.fullName}
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap" justifyContent={{ xs: 'center', sm: 'flex-start' }} mt={1}>
              <Chip
                label={profile.user?.isActive ? 'Active Member' : 'Suspended'}
                size="small"
                sx={{
                  bgcolor: profile.user?.isActive ? colors.primary : 'error.main',
                  color: colors.secondary,
                  fontWeight: 700,
                }}
              />
            </Box>
            <Grid container spacing={{ xs: 1.5, sm: 2 }} mt={2}>
              {ids.map((id) => (
                <Grid item xs={12} sm={4} key={id.label}>
                  <Typography variant="caption" display="block" sx={{ color: onDark.label, mb: 0.25 }}>
                    {id.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{
                      color: onDark.value,
                      wordBreak: 'break-all',
                      fontSize: { xs: '0.875rem', md: '0.95rem' },
                    }}
                  >
                    {id.value || '—'}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </GlassCard>
  );
}
