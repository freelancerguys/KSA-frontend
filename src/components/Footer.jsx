import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, IconButton, Link as MuiLink } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import DirectionsIcon from '@mui/icons-material/Directions';
import { colors } from '../theme/theme';
import Logo from './Logo';

const SOCIAL = {
  facebook: 'https://www.facebook.com/profile.php?id=100092375982780',
  instagram: 'https://www.instagram.com/officialkalyanishootingacademy/',
};

const DEFAULT_DIRECTIONS_URL = 'https://share.google/b1hgEOB0LSIUXV7FQ';

const AFFILIATION = {
  wbraLogo: 'https://wbrashooting.com/wp-content/uploads/2019/10/wbra_logo.svg',
  wbraUrl: 'https://wbrashooting.com/',
  nraiLogo: 'https://thenrai.org/img/NRAIlogo.png',
  nraiUrl: 'https://thenrai.org/',
};

export default function Footer({ settings = {} }) {
  const social = settings.socialLinks || {};
  const facebookUrl = social.facebook || SOCIAL.facebook;
  const instagramUrl = social.instagram || SOCIAL.instagram;
  const address = settings.contactAddress || 'Block A, Kalyani, West Bengal, India';

  return (
    <Box component="footer" id="contact" sx={{ bgcolor: colors.secondary, color: colors.textOnDark, py: { xs: 5, md: 6 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'flex-start' },
            gap: { xs: 3, md: 2 },
            width: '100%',
          }}
        >
          <Box sx={{ flex: { md: '0 1 auto' }, maxWidth: { md: 380 } }}>
            <Typography
              variant="overline"
              sx={{
                color: colors.primary,
                fontWeight: 700,
                letterSpacing: 1.2,
                display: 'block',
                mb: 1,
              }}
            >
              Affiliated under West Bengal Rifle Association
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
                mb: 2,
                flexWrap: 'wrap',
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: colors.textMutedOnDark, lineHeight: 1.6, flex: '1 1 200px' }}
              >
                {address}
              </Typography>
              <MuiLink
                href={settings.directionsUrl || settings.mapsUrl || DEFAULT_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get directions to Kalyani Shooting Academy"
                underline="hover"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: colors.primary,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  flexShrink: 0,
                  mt: 0.25,
                  '&:hover': { color: '#fff' },
                }}
              >
                <DirectionsIcon sx={{ fontSize: 20 }} />
                Get directions
              </MuiLink>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: { xs: 2, sm: 2.5 },
              }}
            >
              <Logo height={52} />
              <MuiLink
                href={AFFILIATION.wbraUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="West Bengal Rifle Association"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'rgba(255,255,255,0.95)',
                  borderRadius: 1,
                  px: 1.25,
                  py: 0.75,
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 0.9 },
                }}
              >
                <Box
                  component="img"
                  src={AFFILIATION.wbraLogo}
                  alt="West Bengal Rifle Association"
                  sx={{ height: 44, width: 'auto', maxWidth: 120, objectFit: 'contain', display: 'block' }}
                />
              </MuiLink>
              <MuiLink
                href={AFFILIATION.nraiUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="National Rifle Association of India"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'rgba(255,255,255,0.95)',
                  borderRadius: 1,
                  px: 1.25,
                  py: 0.75,
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 0.9 },
                }}
              >
                <Box
                  component="img"
                  src={AFFILIATION.nraiLogo}
                  alt="National Rifle Association of India"
                  sx={{ height: 44, width: 'auto', maxWidth: 120, objectFit: 'contain', display: 'block' }}
                />
              </MuiLink>
            </Box>
          </Box>

          <Box sx={{ flex: { md: '0 1 auto' } }}>
            <Typography fontWeight={700} mb={1} sx={{ color: colors.textOnDark }}>
              Contact
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textMutedOnDark }}>
              Phone: {settings.contactPhone || '+91 70037 17476'}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textMutedOnDark, mt: 0.5 }}>
              Email: {settings.contactEmail || 'kalyanishooting@gmail.com'}
            </Typography>
          </Box>

          <Box
            sx={{
              flex: { md: '0 0 auto' },
              alignSelf: { xs: 'flex-start', md: 'flex-start' },
              textAlign: { xs: 'left', md: 'right' },
            }}
          >
            <Typography fontWeight={700} mb={1} sx={{ color: colors.textOnDark }}>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <IconButton
                component={MuiLink}
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                sx={{
                  color: colors.primary,
                  '&:hover': { bgcolor: 'rgba(255,214,0,0.12)' },
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                component={MuiLink}
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                sx={{
                  color: colors.primary,
                  '&:hover': { bgcolor: 'rgba(255,214,0,0.12)' },
                }}
              >
                <InstagramIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Typography
          variant="caption"
          component="div"
          sx={{ color: 'rgba(255,255,255,0.45)', textAlign: 'center', mt: { xs: 4, md: 5 } }}
        >
          © {new Date().getFullYear()} All rights reserved Developed by{' '}
          <MuiLink
            href="https://freelancerguys.com/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            variant="caption"
            sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 'inherit' }}
          >
            Freelancer Guys
          </MuiLink>{' '}
          for Kalyani Shooting Academy.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: { xs: 1.5, sm: 2.5 },
            mt: 1.25,
          }}
        >
          <MuiLink
            component={RouterLink}
            to="/privacy-policy"
            underline="hover"
            variant="caption"
            sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem' }}
          >
            Privacy Policy
          </MuiLink>
          <Typography component="span" variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>
            ·
          </Typography>
          <MuiLink
            component={RouterLink}
            to="/terms-and-conditions"
            underline="hover"
            variant="caption"
            sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem' }}
          >
            Terms & Conditions
          </MuiLink>
        </Box>
      </Container>
    </Box>
  );
}
