import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://giselamateu.github.io',
  base: '/portfolio',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
