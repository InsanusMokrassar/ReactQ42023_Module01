import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json', 'html'],
      extension: ['ts', 'tsx'],
      include: ['src'],
      exclude: [
        'src/models', // exclude types ts files without any testable functional
        'src/vite-env.d.ts', // exclude vite env file
      ],
      all: true,
    },
  },
});
