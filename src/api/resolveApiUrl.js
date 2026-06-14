export const resolveApiUrl = () => {
  const fromEnv = import.meta.env.VITE_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  return '/api';
};

export const resolveUploadsUrl = () => {
  const fromEnv = import.meta.env.VITE_UPLOADS_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  if (import.meta.env.DEV) {
    return '/uploads';
  }
  return '/uploads';
};
