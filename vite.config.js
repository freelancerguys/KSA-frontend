import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Kalyani Shooting Academy',
        short_name: 'KSA',
        theme_color: '#FFD600',
        background_color: '#111111',
        display: 'standalone',
        icons: [
          { src: '/ksalogo.png', sizes: '192x192', type: 'image/png' },
          { src: '/ksalogo.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  server: { port: 5173, proxy: { '/api': 'http://localhost:5000', '/uploads': 'http://localhost:5000' } },
});
