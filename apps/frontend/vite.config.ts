import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const apiTarget = env.VITE_API_URL || 'http://127.0.0.1:3000';

  return {
    plugins: [react()],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: {
      port: 4200,
      strictPort: true,
      proxy: { '^/(health|auth|users|roles|todos|validation-check)': { target: apiTarget, changeOrigin: true } },
    },
    preview: { port: 4300, strictPort: true },
  };
});
