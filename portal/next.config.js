const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
};

module.exports = withNextIntl(nextConfig);
