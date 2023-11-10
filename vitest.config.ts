// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
      extension: ['ts', 'tsx'],
      include: ['src'],
      all: true,
    },
  },
});
