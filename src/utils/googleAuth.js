export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || '';

let scriptPromise = null;
let initialized = false;

const credentialCallbackRef = { current: null };

export const isGoogleLoginEnabled = () => Boolean(GOOGLE_CLIENT_ID);

export const loadGoogleScript = () => {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google sign-in'));
    document.head.appendChild(script);
  });

  return scriptPromise;
};

export const setGoogleCredentialCallback = (fn) => {
  credentialCallbackRef.current = fn;
};

export const ensureGoogleInitialized = async () => {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('Google client ID not configured');
  }

  await loadGoogleScript();

  if (!initialized) {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        if (response?.credential) {
          credentialCallbackRef.current?.({ credential: response.credential });
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
      itp_support: true,
    });
    initialized = true;
  }
};

export const renderGoogleButton = (container) => {
  if (!container || !window.google?.accounts?.id) return;

  container.innerHTML = '';
  const parentWidth = container.parentElement?.offsetWidth || container.offsetWidth || 400;
  const width = Math.min(Math.max(Math.floor(parentWidth), 200), 400);

  window.google.accounts.id.renderButton(container, {
    type: 'standard',
    theme: 'outline',
    size: 'large',
    text: 'continue_with',
    shape: 'pill',
    width,
    logo_alignment: 'left',
  });
};

/** Call on logout so the next visit shows the Google account picker again. */
export const clearGoogleSession = () => {
  try {
    window.google?.accounts?.id?.disableAutoSelect();
  } catch {
    /* non-blocking */
  }
};
