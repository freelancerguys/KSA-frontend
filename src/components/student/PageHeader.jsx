import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export default function PageHeader({ title, subtitle }) {
  return (
    <Box component={motion.div} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} mb={{ xs: 2, md: 3 }}>
      <Typography variant="h5" fontWeight={800} sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
