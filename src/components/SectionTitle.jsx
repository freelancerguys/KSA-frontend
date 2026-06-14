import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { colors } from '../theme/theme';

export default function SectionTitle({ title, subtitle, count }) {
  const titleText = count != null ? `${title} (${count})` : title;
  return (
    <Box textAlign="center" mb={5}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <Typography variant="overline" sx={{ color: colors.primary, fontWeight: 700, letterSpacing: 3 }}>
          {subtitle}
        </Typography>
        <Typography variant="h3" fontWeight={800} mt={1}>
          {titleText}
        </Typography>
        <Box sx={{ width: 80, height: 4, bgcolor: colors.primary, mx: 'auto', mt: 2, borderRadius: 2 }} />
      </motion.div>
    </Box>
  );
}
