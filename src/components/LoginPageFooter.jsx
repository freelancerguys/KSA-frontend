import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Link as MuiLink, IconButton, Stack, Divider,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { colors } from '../theme/theme';
import { SITE_CONTACT, SITE_SOCIAL } from '../constants/siteContact';

const muted = 'rgba(255,255,255,0.62)';
const faint = 'rgba(255,255,255,0.42)';

function LegalLinks({ sx = {} }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, ...sx }}>
      <MuiLink
        component={RouterLink}
        to="/privacy-policy"
        underline="hover"
        variant="caption"
        sx={{ color: faint, fontSize: '0.75rem', fontWeight: 500, '&:hover': { color: colors.primary } }}
      >
        Privacy Policy
      </MuiLink>
      <Typography component="span" sx={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>
        ·
      </Typography>
      <MuiLink
        component={RouterLink}
        to="/terms-and-conditions"
        underline="hover"
        variant="caption"
        sx={{ color: faint, fontSize: '0.75rem', fontWeight: 500, '&:hover': { color: colors.primary } }}
      >
        Terms & Conditions
      </MuiLink>
    </Box>
  );
}

function ContactBlock({ align = 'center', compact = false }) {
  return (
    <Box sx={{ textAlign: align }}>
      <Typography
        variant="subtitle2"
        fontWeight={700}
        sx={{ color: colors.textOnDark, mb: compact ? 0.75 : 1.25, letterSpacing: '0.02em', fontSize: compact ? '0.8rem' : undefined }}
      >
        Contact
      </Typography>
      <Stack spacing={compact ? 0.5 : 0.75} alignItems={align === 'center' ? 'center' : 'flex-start'}>
        <MuiLink
          href={`tel:${SITE_CONTACT.phone.replace(/\s/g, '')}`}
          underline="hover"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            color: muted,
            fontSize: compact ? '0.75rem' : '0.8125rem',
            '&:hover': { color: colors.primary },
          }}
        >
          <PhoneOutlinedIcon sx={{ fontSize: compact ? 14 : 16, color: colors.primary }} />
          Phone: {SITE_CONTACT.phone}
        </MuiLink>
        <MuiLink
          href={`mailto:${SITE_CONTACT.email}`}
          underline="hover"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            color: muted,
            fontSize: compact ? '0.75rem' : '0.8125rem',
            wordBreak: 'break-all',
            '&:hover': { color: colors.primary },
          }}
        >
          <EmailOutlinedIcon sx={{ fontSize: compact ? 14 : 16, color: colors.primary }} />
          Email: {SITE_CONTACT.email}
        </MuiLink>
      </Stack>
    </Box>
  );
}

function SocialBlock({ align = 'center', compact = false }) {
  return (
    <Box sx={{ textAlign: align }}>
      <Typography
        variant="subtitle2"
        fontWeight={700}
        sx={{ color: colors.textOnDark, mb: compact ? 0.5 : 1, fontSize: compact ? '0.8rem' : undefined }}
      >
        Follow Us
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start', gap: 0.5 }}>
        <IconButton
          component={MuiLink}
          href={SITE_SOCIAL.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          size="small"
          sx={{
            color: colors.primary,
            border: '1px solid rgba(255,214,0,0.25)',
            p: compact ? 0.5 : 0.75,
            '&:hover': { bgcolor: 'rgba(255,214,0,0.12)' },
          }}
        >
          <FacebookIcon sx={{ fontSize: compact ? 18 : 20 }} />
        </IconButton>
        <IconButton
          component={MuiLink}
          href={SITE_SOCIAL.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          size="small"
          sx={{
            color: colors.primary,
            border: '1px solid rgba(255,214,0,0.25)',
            p: compact ? 0.5 : 0.75,
            '&:hover': { bgcolor: 'rgba(255,214,0,0.12)' },
          }}
        >
          <InstagramIcon sx={{ fontSize: compact ? 18 : 20 }} />
        </IconButton>
      </Box>
    </Box>
  );
}

function AffiliationBlock({ align = 'center', compact = false }) {
  return (
    <Box sx={{ maxWidth: compact ? 360 : 340, textAlign: align }}>
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          color: colors.primary,
          fontWeight: 700,
          letterSpacing: 0.4,
          lineHeight: 1.45,
          mb: 0.5,
          fontSize: compact ? '0.68rem' : undefined,
        }}
      >
        {SITE_CONTACT.affiliation}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: 'inline-flex',
          alignItems: 'flex-start',
          justifyContent: align === 'center' ? 'center' : 'flex-start',
          gap: 0.5,
          color: faint,
          lineHeight: 1.5,
          fontSize: compact ? '0.68rem' : undefined,
        }}
      >
        <PlaceOutlinedIcon sx={{ fontSize: compact ? 13 : 14, color: colors.primary, flexShrink: 0, mt: 0.15 }} />
        {SITE_CONTACT.address}
      </Typography>
    </Box>
  );
}

export default function LoginPageFooter({ variant = 'stack' }) {
  if (variant === 'sidebar') {
    return (
      <Box component="footer" sx={{ mt: 2.5 }}>
        <Stack spacing={2}>
          <AffiliationBlock align="left" compact />
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
          <ContactBlock align="left" compact />
          <SocialBlock align="left" compact />
          <LegalLinks sx={{ mt: 0.5 }} />
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      component="footer"
      sx={{
        mt: { xs: 3, sm: 4 },
        pt: { xs: 2.5, sm: 3 },
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Stack spacing={2.5} alignItems="center" textAlign="center">
        <LegalLinks sx={{ justifyContent: 'center' }} />
        <Divider flexItem sx={{ borderColor: 'rgba(255,255,255,0.08)', width: '100%', maxWidth: 320 }} />
        <ContactBlock align="center" />
        <SocialBlock align="center" />
        <AffiliationBlock align="center" />
      </Stack>
    </Box>
  );
}
