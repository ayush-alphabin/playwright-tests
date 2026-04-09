import { defineConfig } from 'vite';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
  root: __dirname,
  plugins: [
    istanbul({
      include: 'src/**/*.ts',
      exclude: ['node_modules'],
      extension: ['.ts'],
      requireEnv: false,
    }),
  ],
  server: {
    port: 5199,
    strictPort: true,
  },
});
