/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vitest/config';

export default defineConfig(({isSsrBuild}) => ({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    // 'hidden' emits .map files without the //# sourceMappingURL comment, so
    // browsers never fetch them but the bundle can still be attributed to its
    // sources. That attribution is what caught tailwind-merge at 29.6% of app
    // JS, and design-recon RUBRIC.md G2 scores 0 without it — a dependency
    // budget you cannot attribute is not a budget.
    //
    // No exposure tradeoff here: the repository is public, so the maps reveal
    // nothing the source does not already.
    sourcemap: 'hidden',
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
  test: {
    // Unit tests only. The Playwright specs in e2e/ are driven by
    // `bun run test:e2e` and cannot run under vitest.
    include: ['src/**/*.test.{ts,tsx}'],
  },
}));
