import { Box, Container, Grid, Typography, Chip } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { motion } from 'framer-motion';
import { colors } from '../theme/theme';

const coaches = [
  {
    name: 'Diganta Chattopadhyay',
    credential: 'NRAI Approved Coach',
    image: '/DIGANTA CHATTOPADHYAY.webp',
    Icon: VerifiedIcon,
  },
  {
    name: 'Dhiman Chattopadhyay',
    credential: 'National Record Holder',
    image: '/DHIMAN CHATTOPADHYAY.webp',
    Icon: EmojiEventsIcon,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function CoachSection() {
  return (
    <Box
      className="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 7, md: 10 },
        bgcolor: colors.secondary,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.12,
          pointerEvents: 'none',
          backgroundImage:
            'repeating-linear-gradient(45deg, #FFD600 0, #FFD600 1px, transparent 0, transparent 50%)',
          backgroundSize: '18px 18px',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.primary}33 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div {...fadeUp}>
          <Box textAlign="center" mb={{ xs: 4, md: 5 }}>
            <Typography
              variant="overline"
              sx={{ color: colors.primary, fontWeight: 700, letterSpacing: 3 }}
            >
              ELITE TEAM
            </Typography>
            <Typography
              variant="h3"
              fontWeight={800}
              mt={1}
              sx={{
                color: colors.textOnDark,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
              }}
            >
              Coach Details
            </Typography>
            <Box
              sx={{
                width: { xs: 72, md: 100 },
                height: 5,
                mx: 'auto',
                mt: 2,
                borderRadius: 2,
                bgcolor: colors.primary,
              }}
            />
            <Typography
              variant="body1"
              sx={{
                color: colors.textMutedOnDark,
                maxWidth: 560,
                mx: 'auto',
                mt: 2.5,
                lineHeight: 1.7,
                px: { xs: 1, md: 0 },
              }}
            >
              Train under certified expertise — our coaches bring national-level experience and
              proven results to every session.
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
          {coaches.map((coach, i) => {
            const Icon = coach.Icon;
            return (
              <Grid item xs={12} sm={10} md={6} key={coach.name}>
                <motion.div {...fadeUp} transition={{ delay: 0.1 + i * 0.12 }}>
                  <Box
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      border: `2px solid ${colors.primary}44`,
                      bgcolor: 'rgba(255,255,255,0.04)',
                      boxShadow: `0 20px 60px rgba(0,0,0,0.45)`,
                      transition: 'transform 0.35s, border-color 0.35s, box-shadow 0.35s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        borderColor: colors.primary,
                        boxShadow: `0 28px 72px ${colors.primary}33`,
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative', bgcolor: '#0a0a0a' }}>
                      <Box
                        component="img"
                        src={encodeURI(coach.image)}
                        alt={coach.name}
                        loading="lazy"
                        sx={{
                          display: 'block',
                          width: '100%',
                          height: { xs: 320, sm: 380, md: 420 },
                          objectFit: 'cover',
                          objectPosition: 'top center',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(180deg, transparent 45%, rgba(17,17,17,0.92) 100%)',
                          pointerEvents: 'none',
                        }}
                      />
                    </Box>

                    <Box sx={{ p: { xs: 2.5, md: 3 }, pt: { xs: 2, md: 2.5 } }}>
                      <Box display="flex" alignItems="flex-start" gap={1.5}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: colors.primary,
                            color: colors.secondary,
                          }}
                        >
                          <Icon fontSize="small" />
                        </Box>
                        <Box flex={1} minWidth={0}>
                          <Typography
                            variant="h5"
                            fontWeight={800}
                            sx={{
                              color: colors.textOnDark,
                              fontSize: { xs: '1.2rem', md: '1.35rem' },
                              lineHeight: 1.25,
                            }}
                          >
                            {coach.name}
                          </Typography>
                          <Chip
                            label={coach.credential}
                            size="small"
                            sx={{
                              mt: 1.25,
                              bgcolor: colors.primary,
                              color: colors.secondary,
                              fontWeight: 800,
                              letterSpacing: 0.5,
                              fontSize: '0.72rem',
                              height: 28,
                              '& .MuiChip-label': { px: 1.25 },
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
