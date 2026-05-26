import { Box } from '@mui/material';
import { MOBILE_BOTTOM_NAV_CLEARANCE } from '../../constants/studentLayout';

/** Ensures last content clears the fixed bottom navigation on mobile (all student tabs) */
export default function MobileScrollSpacer() {
  return (
    <Box
      aria-hidden
      sx={{
        display: { xs: 'block', md: 'none' },
        height: MOBILE_BOTTOM_NAV_CLEARANCE,
        minHeight: MOBILE_BOTTOM_NAV_CLEARANCE,
        flexShrink: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
