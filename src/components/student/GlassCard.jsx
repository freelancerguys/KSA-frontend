import { Card } from '@mui/material';
import { motion } from 'framer-motion';
import { colors } from '../../theme/theme';

export default function GlassCard({ children, sx = {}, delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          bgcolor: colors.background,
          backdropFilter: 'blur(12px)',
          border: `1px solid ${colors.border}`,
          boxShadow: `0 8px 32px ${colors.shadow}`,
          ...sx,
        }}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
}

export const statCardSx = {
  borderLeft: `4px solid ${colors.primary}`,
  height: '100%',
};
