import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['json', 'lcov', 'text', 'clover', 'html'],
      include: [
        'src/app/**/*.{js,jsx,ts,tsx}',
        'src/components/**/*.{js,jsx,ts,tsx}',
        'src/lib/**/*.{js,jsx,ts,tsx}',
        'src/entities/**/*.{js,jsx,ts,tsx}',
      ],
      exclude: [
        '**/node_modules/**',
        '**/.next/**',
        '**/cypress/**',
        '**/*.test.ts',
        '**/*.test.tsx',
      ],
    },
    projects: [
      'vitest.client.config.ts',
      'vitest.api.config.ts',
    ],
  },
})
