import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Navbar from './Navbar';
import Footer from './Footer';
import { colors } from '../theme/theme';

export default function LegalPageLayout({ title, effectiveDate, children }) {
  return (
    <Box sx={{ bgcolor: colors.surface, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Container maxWidth="md" sx={{ flex: 1, py: { xs: 10, md: 12 } }}>
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3, color: colors.text, fontWeight: 600 }}
        >
          Back to Home
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            border: `1px solid ${colors.border}`,
            bgcolor: colors.background,
            boxShadow: `0 12px 40px ${colors.shadow}`,
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: colors.primary, fontWeight: 700, letterSpacing: 2 }}
          >
            KALYANI SHOOTING ACADEMY
          </Typography>
          <Typography variant="h3" fontWeight={800} mt={1} sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
            {title}
          </Typography>
          {effectiveDate && (
            <Typography variant="body2" color="text.secondary" mt={1}>
              Effective date: {effectiveDate}
            </Typography>
          )}
          <Box
            sx={{
              mt: 4,
              '& h6': {
                fontWeight: 800,
                color: colors.text,
                mt: 3,
                mb: 1,
                fontSize: '1.05rem',
              },
              '& p': {
                color: colors.textMuted,
                lineHeight: 1.75,
                mb: 1.5,
              },
            }}
          >
            {children}
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
}
