import { Box, Container, Typography, Button, Grid, useMediaQuery, useTheme } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../theme/theme';

const HERO_BANNER = '/herobanner.webp';

const bannerImgSx = {
  height: 'auto',
  objectFit: 'contain',
  objectPosition: 'bottom center',
  filter: 'drop-shadow(0 16px 48px rgba(0,0,0,0.5))',
};

export default function Hero({ settings = {} }) {
  const ref = useRef(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <Box
      id="home"
      ref={ref}
      sx={{
        minHeight: { xs: '100svh', md: '100vh' },
        position: 'relative',
        overflow: 'hidden',
        bgcolor: colors.secondary,
        display: { xs: 'flex', md: 'block' },
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 20% 50%, ${colors.primary}33 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 40%),
            linear-gradient(135deg, #111 0%, #1a1a1a 50%, #111 100%)`,
        }}
      />

      <motion.div style={{ y, position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none' }}>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            backgroundImage:
              'repeating-linear-gradient(45deg, #FFD600 0, #FFD600 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px',
          }}
        />
      </motion.div>

      {/* Desktop: absolute banner on the right */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}
        >
          <Box
            component="img"
            src={HERO_BANNER}
            alt="Kalyani Shooting Academy — coaches and champions"
            sx={{
              ...bannerImgSx,
              position: 'absolute',
              bottom: 0,
              right: '0.5%',
              width: { md: '62vw', lg: '58vw' },
              maxWidth: { md: 920, lg: 1000 },
              minWidth: { md: 520 },
              maxHeight: { md: '88vh', lg: '92vh' },
            }}
          />
        </motion.div>
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
          minHeight: { xs: '100%', md: '100vh' },
          flex: { xs: 1, md: 'unset' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: { xs: 'flex-start', md: 'center' },
          pt: {
            xs: 'calc(56px + 5vh)',
            sm: 'calc(60px + 5vh)',
            md: 12,
          },
          pb: { xs: 0, md: 6 },
        }}
      >
        <Grid
          container
          spacing={{ xs: 1.5, md: 2 }}
          sx={{
            width: '100%',
            flex: { xs: 1, md: 'unset' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            minHeight: { xs: 'calc(100svh - 56px - 5vh)', md: 'auto' },
          }}
        >
          <Grid
            item
            xs={12}
            md={7}
            lg={6}
            sx={{
              flexShrink: 0,
              flex: { xs: 1, md: 'unset' },
              display: { xs: 'flex', md: 'block' },
              flexDirection: 'column',
              justifyContent: { xs: 'flex-start', md: 'flex-start' },
              minHeight: { xs: 0, md: 'auto' },
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: colors.primary,
                  fontWeight: 700,
                  letterSpacing: { xs: 2.5, md: 4 },
                  fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.8rem' },
                  display: 'block',
                  lineHeight: 1.3,
                }}
              >
                KALYANI SHOOTING ACADEMY
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontFamily: '"Bebas Neue", sans-serif',
                  fontSize: {
                    xs: 'clamp(3.75rem, 20vw, 5.25rem)',
                    sm: '4.75rem',
                    md: '5.5rem',
                    lg: '6rem',
                  },
                  color: colors.textOnDark,
                  lineHeight: { xs: 0.92, md: 1.05 },
                  mt: { xs: 0.75, md: 1 },
                  letterSpacing: { xs: 0.5, md: 1 },
                  width: '100%',
                  maxWidth: '100%',
                }}
              >
                {settings.heroTitle || 'AIM HIGHER. SHOOT STRONGER.'}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255,255,255,0.85)',
                  mt: { xs: 1.25, md: 2 },
                  maxWidth: 520,
                  fontWeight: 400,
                  fontSize: { xs: 'clamp(1.05rem, 4.2vw, 1.25rem)', sm: '1.15rem', md: '1.15rem' },
                  lineHeight: 1.45,
                }}
              >
                {settings.heroSubtitle || 'Train with elite coaches. Build champions.'}
              </Typography>
              <Box
                mt={{ xs: 2.5, md: 4 }}
                display="flex"
                gap={1.5}
                flexWrap="wrap"
                sx={{ '& .MuiButton-root': { flex: { xs: '1 1 140px', sm: '0 0 auto' } } }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size={isMobile ? 'medium' : 'large'}
                    href="#contact"
                    sx={{ px: { xs: 2, md: 3 }, py: 1.1, fontWeight: 700, borderRadius: 2, width: { xs: '100%', sm: 'auto' } }}
                  >
                    Join Academy
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outlined"
                    size={isMobile ? 'medium' : 'large'}
                    onClick={() => navigate('/login')}
                    sx={{
                      px: { xs: 2, md: 3 },
                      py: 1.1,
                      fontWeight: 600,
                      borderRadius: 2,
                      width: { xs: '100%', sm: 'auto' },
                      color: colors.textOnDark,
                      borderColor: colors.primary,
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: colors.primary,
                        borderWidth: 2,
                        bgcolor: 'rgba(255,214,0,0.12)',
                        color: colors.textOnDark,
                      },
                    }}
                  >
                    Student Login
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>

          {/* Mobile / tablet: image pinned to bottom */}
          <Grid
            item
            xs={12}
            sx={{
              display: { xs: 'flex', md: 'none' },
              flex: '0 0 auto',
              alignItems: 'flex-end',
              justifyContent: 'center',
              mt: { xs: 'auto', md: 0 },
              pt: { xs: 1.5, sm: 2 },
              pb: 0,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}
            >
              <Box
                component="img"
                src={HERO_BANNER}
                alt="Kalyani Shooting Academy — coaches and champions"
                sx={{
                  ...bannerImgSx,
                  display: 'block',
                  width: '100%',
                  maxWidth: 540,
                  maxHeight: { xs: 'min(40svh, 340px)', sm: 'min(46vh, 380px)' },
                  mb: 0,
                  verticalAlign: 'bottom',
                }}
              />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
