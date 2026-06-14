import { Box, Typography, Avatar, Chip, Button, Grid, Stack } from '@mui/material';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import GlassCard from './GlassCard';
import { getUploadUrl } from '../../api/client';
import { colors } from '../../theme/theme';

const onDark = {
  title: colors.textOnDark,
  label: colors.textMutedOnDark,
  value: colors.textOnDark,
};

export default function ProfileHeroBanner({ profile, onChangePhoto, onDownloadIdCard, idCardLoading }) {
  if (!profile) return null;

  const meta = [
    { label: 'Student ID', value: profile.studentId },
    { label: 'Login Email', value: profile.user?.email },
    { label: 'Assigned Coach', value: profile.assignedCoach },
    { label: 'Member Since', value: profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : '—' },
  ];

  return (
    <GlassCard
      sx={{
        mb: 3,
        background: `linear-gradient(135deg, ${colors.secondary} 0%, #1a1a1a 100%)`,
        color: onDark.title,
        border: `1px solid rgba(255,214,0,0.2)`,
      }}
    >
      <Box sx={{ p: { xs: 2.5, md: 3 } }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md="auto">
            <Box display="flex" flexDirection="column" alignItems={{ xs: 'center', md: 'flex-start' }} gap={1.5}>
              <Avatar
                src={getUploadUrl(profile.photo)}
                sx={{
                  width: { xs: 96, md: 112 },
                  height: { xs: 96, md: 112 },
                  border: `3px solid ${colors.primary}`,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                }}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} width={{ xs: '100%', md: 'auto' }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PhotoCameraOutlinedIcon />}
                  onClick={onChangePhoto}
                  sx={{
                    borderColor: 'rgba(255,214,0,0.5)',
                    color: colors.primary,
                    '&:hover': {
                      borderColor: colors.primary,
                      bgcolor: 'rgba(255,214,0,0.08)',
                    },
                  }}
                >
                  Change Photo
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<BadgeOutlinedIcon />}
                  onClick={onDownloadIdCard}
                  disabled={idCardLoading}
                  sx={{
                    bgcolor: colors.primary,
                    color: colors.secondary,
                    fontWeight: 700,
                    '&:hover': { bgcolor: '#e6c200' },
                  }}
                >
                  {idCardLoading ? 'Preparing…' : 'Download ID Card'}
                </Button>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md>
            <Typography
              variant="h5"
              fontWeight={800}
              textAlign={{ xs: 'center', md: 'left' }}
              sx={{ color: onDark.title }}
            >
              {profile.fullName}
            </Typography>
            <Box
              display="flex"
              gap={1}
              flexWrap="wrap"
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              mt={1}
            >
              <Chip
                label={profile.user?.isActive ? 'Active Member' : 'Suspended'}
                size="small"
                sx={{
                  bgcolor: profile.user?.isActive ? colors.primary : 'error.main',
                  color: colors.secondary,
                  fontWeight: 700,
                }}
              />
              {profile.wbShooterId && (
                <Chip
                  label={`WB: ${profile.wbShooterId}`}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: onDark.value, fontWeight: 600 }}
                />
              )}
              {profile.nraiShooterId && (
                <Chip
                  label={`NRAI: ${profile.nraiShooterId}`}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: onDark.value, fontWeight: 600 }}
                />
              )}
            </Box>
            <Typography
              variant="body2"
              mt={1.5}
              textAlign={{ xs: 'center', md: 'left' }}
              sx={{ color: onDark.label }}
            >
              Keep your contact details up to date. Fees, shooter IDs, and academy settings are managed by admin.
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={{ xs: 2, md: 3 }}>
          {meta.map((item) => (
            <Grid item xs={6} md={3} key={item.label}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  height: '100%',
                }}
              >
                <Typography variant="caption" display="block" sx={{ color: onDark.label, mb: 0.5 }}>
                  {item.label}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{ color: onDark.value, wordBreak: 'break-word' }}
                >
                  {item.value || '—'}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </GlassCard>
  );
}
