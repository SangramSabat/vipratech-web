import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig(({isSsrBuild}) => ({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // React changes far less often than app code, so giving it its own
        // chunk keeps it cached across deploys (spec S9.2). Client build only:
        // in the SSR build React is external, and naming it here fails the
        // build outright.
        manualChunks: isSsrBuild
          ? undefined
          : (id) =>
              /node_modules\/(react|react-dom|scheduler)\//.test(id) ? 'react' : undefined,
      },
    },
  },
}));
