import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { colors } from '../theme/theme';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || '';

let scriptPromise = null;

const loadGoogleScript = () => {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load Google sign-in'));
    document.head.appendChild(script);
  });

  return scriptPromise;
};

/** Official Google "G" mark — optimized for 20–24px display */
function GoogleIcon({ size = 22 }) {
  return (
    <Box
      component="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      sx={{ display: 'block', flexShrink: 0 }}
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </Box>
  );
}

function CustomGoogleFace({ loading = false, compact = false }) {
  const h = compact ? 44 : { xs: 48, sm: 50 };

  return (
    <Box
      className="google-custom-face"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
        height: h,
        minHeight: h,
        pl: compact ? '52px' : { xs: '56px', sm: '58px' },
        pr: 2,
        borderRadius: 999,
        background: `linear-gradient(90deg, rgba(255,214,0,0.22) 0%, #fffef8 45%, #ffffff 100%)`,
        border: `1.5px solid rgba(255,214,0,0.55)`,
        boxShadow: '0 2px 10px rgba(255,214,0,0.2), inset 0 1px 0 rgba(255,255,255,0.9)',
        transition: 'background 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, transform 0.15s ease',
        userSelect: 'none',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: compact ? 10 : { xs: 12, sm: 14 },
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: compact ? 32 : 36,
          height: compact ? 32 : 36,
          borderRadius: '50%',
          bgcolor: '#fff',
          border: '1px solid rgba(17,17,17,0.08)',
          boxShadow: '0 1px 3px rgba(17,17,17,0.1)',
        }}
      >
        {loading ? (
          <CircularProgress size={compact ? 18 : 20} sx={{ color: colors.primary }} />
        ) : (
          <GoogleIcon size={compact ? 20 : 22} />
        )}
      </Box>

      <Typography
        component="span"
        sx={{
          fontFamily: '"Inter", "Roboto", sans-serif',
          fontWeight: 600,
          fontSize: compact ? '0.875rem' : { xs: '0.9375rem', sm: '0.95rem' },
          color: colors.secondary,
          letterSpacing: '0.01em',
          lineHeight: 1.2,
          textAlign: 'center',
        }}
      >
        Continue with Google
      </Typography>
    </Box>
  );
}

const wrapperSx = (disabled, compact) => ({
  position: 'relative',
  width: '100%',
  height: compact ? 44 : { xs: 48, sm: 50 },
  borderRadius: 999,
  opacity: disabled ? 0.55 : 1,
  pointerEvents: disabled ? 'none' : 'auto',
  cursor: disabled ? 'not-allowed' : 'pointer',
  outline: 'none',
  '&:hover .google-custom-face': disabled
    ? {}
    : {
      background: `linear-gradient(90deg, rgba(255,214,0,0.38) 0%, #fffce0 50%, #ffffff 100%)`,
      borderColor: colors.primary,
      boxShadow: '0 4px 16px rgba(255,214,0,0.35), inset 0 1px 0 rgba(255,255,255,0.95)',
      transform: 'translateY(-1px)',
    },
  '&:active .google-custom-face': disabled
    ? {}
    : {
      transform: 'translateY(0) scale(0.99)',
      boxShadow: '0 2px 8px rgba(255,214,0,0.25)',
    },
  '&:focus-visible .google-custom-face': {
    boxShadow: `0 0 0 3px ${colors.primaryMuted}, 0 2px 10px rgba(255,214,0,0.2)`,
  },
});

export const isGoogleLoginEnabled = () => Boolean(CLIENT_ID);

export default function GoogleSignInButton({
  onSuccess,
  onError,
  disabled,
  onNotConfigured,
  compact = false,
}) {
  const hiddenRef = useRef(null);
  const [ready, setReady] = useState(false);

  const triggerGoogleSignIn = useCallback(() => {
    if (disabled || !ready || !hiddenRef.current) return false;
    const root = hiddenRef.current;
    const btn = root.querySelector('[role="button"]') || root.firstElementChild;
    if (btn && typeof btn.click === 'function') {
      btn.click();
      return true;
    }
    return false;
  }, [disabled, ready]);

  useEffect(() => {
    if (!CLIENT_ID || !hiddenRef.current) return undefined;

    let cancelled = false;

    (async () => {
      try {
        await loadGoogleScript();
        if (cancelled || !hiddenRef.current) return;

        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (response) => onSuccess?.({ credential: response.credential }),
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        hiddenRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(hiddenRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          width: 400,
          logo_alignment: 'left',
        });

        if (!cancelled) setReady(true);
      } catch {
        if (!cancelled) onError?.();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [onSuccess, onError]);

  const handleClick = () => {
    if (disabled) return;
    if (!CLIENT_ID) {
      onNotConfigured?.();
      return;
    }
    if (!ready) return;
    if (!triggerGoogleSignIn()) onError?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <>
      {/* Hidden official Google button — triggered programmatically on custom button click */}
      <Box
        ref={hiddenRef}
        aria-hidden
        sx={{
          position: 'fixed',
          left: -9999,
          top: 0,
          width: 400,
          height: 50,
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      <Box
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Continue with Google"
        aria-disabled={disabled || !ready}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        sx={wrapperSx(disabled, compact)}
      >
        <CustomGoogleFace loading={!ready && Boolean(CLIENT_ID)} compact={compact} />
      </Box>
    </>
  );
}
