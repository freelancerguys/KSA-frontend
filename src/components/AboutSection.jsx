import { Box, Container, Grid, Card, CardContent, Typography } from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { motion } from 'framer-motion';
import { colors } from '../theme/theme';

const pillars = [
  {
    title: 'Precision Training',
    desc: 'Structured rifle and pistol programs focused on accuracy, safety, and match discipline.',
    icon: GpsFixedIcon,
    accent: colors.primary,
  },
  {
    title: 'Elite Coaching',
    desc: 'Learn from certified coaches who mentor shooters from beginner level to championship stage.',
    icon: SchoolIcon,
    accent: '#1a1a1a',
  },
  {
    title: 'Competition Ready',
    desc: 'Match simulations, mental conditioning, and exposure to state and national level events.',
    icon: EmojiEventsIcon,
    accent: colors.primary,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function AboutSection({ aboutText }) {
  return (
    <Box
      id="about"
      className="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 7, md: 10 },
        background: `linear-gradient(165deg, ${colors.primary}22 0%, ${colors.surface} 28%, ${colors.background} 72%)`,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -60,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.primary}55 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -80,
          left: -40,
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.secondary}18 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div {...fadeUp}>
          <Box textAlign="center" mb={{ xs: 3, md: 4 }}>
            <Typography
              variant="overline"
              sx={{ color: colors.primary, fontWeight: 700, letterSpacing: 3 }}
            >
              WHO WE ARE
            </Typography>
            <Typography
              variant="h3"
              fontWeight={800}
              mt={1}
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                color: colors.text,
              }}
            >
              About Kalyani Shooting Academy
            </Typography>
            <Box
              sx={{
                width: { xs: 72, md: 100 },
                height: 5,
                mx: 'auto',
                mt: 2,
                borderRadius: 2,
                background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              }}
            />
          </Box>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.08 }}>
          <Box
            sx={{
              maxWidth: 820,
              mx: 'auto',
              px: { xs: 2.5, md: 4 },
              py: { xs: 2.5, md: 3 },
              borderRadius: 3,
              bgcolor: colors.background,
              border: `1px solid ${colors.border}`,
              borderLeft: `5px solid ${colors.primary}`,
              boxShadow: `0 12px 40px ${colors.shadow}`,
            }}
          >
            <Typography
              variant="body1"
              textAlign="center"
              sx={{
                color: colors.textMuted,
                lineHeight: 1.85,
                fontSize: { xs: '0.95rem', md: '1.05rem' },
              }}
            >
              {aboutText ||
                'Kalyani Shooting Academy is a world-class training center for rifle and pistol shooting, dedicated to developing champions through structured training, mental conditioning, and competitive exposure.'}
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={3} mt={{ xs: 3, md: 5 }}>
          {pillars.map((item, i) => {
            const Icon = item.icon;
            return (
              <Grid item xs={12} md={4} key={item.title}>
                <motion.div {...fadeUp} transition={{ delay: 0.12 + i * 0.1 }}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      border: `1px solid ${colors.border}`,
                      background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.surface} 100%)`,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: `0 16px 48px ${colors.primary}44`,
                        borderColor: colors.primary,
                      },
                    }}
                  >
                    <Box sx={{ height: 5, bgcolor: item.accent }} />
                    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: colors.primary,
                          color: colors.secondary,
                          mb: 2,
                        }}
                      >
                        <Icon />
                      </Box>
                      <Typography variant="h6" fontWeight={800} color={colors.text}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={1.25} lineHeight={1.65}>
                        {item.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
