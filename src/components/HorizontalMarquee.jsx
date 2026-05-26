import { Box } from '@mui/material';

/**
 * Infinite right-to-left marquee. Children should be duplicated (e.g. [...items, ...items]).
 */
export default function HorizontalMarquee({ duration = 30, children, gap = 3 }) {
  return (
    <Box
      sx={{
        overflow: 'hidden',
        width: '100%',
        py: 0.5,
        maskImage: 'linear-gradient(90deg, transparent 0%, #000 3%, #000 97%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 3%, #000 97%, transparent 100%)',
        '@media (prefers-reduced-motion: reduce)': {
          maskImage: 'none',
          WebkitMaskImage: 'none',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap,
          width: 'max-content',
          px: { xs: 2, md: 3 },
          animation: `ksaMarquee ${duration}s linear infinite`,
          '@keyframes ksaMarquee': {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-50%)' },
          },
          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
            overflowX: 'auto',
            width: '100%',
            maxWidth: '100%',
            pb: 1,
          },
          '&:hover': {
            '@media (prefers-reduced-motion: no-preference)': {
              animationPlayState: 'paused',
            },
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
