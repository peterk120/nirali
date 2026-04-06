const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
  experimental: {
    typedRoutes: true,
    outputFileTracingExcludes: {
      '*': [
        '**/node_modules/@nirali-sai/boutique/**',
        '**/node_modules/sharp/**',
      ],
    },
  },
  transpilePackages: [
    '@nirali-sai/ui',
    '@nirali-sai/utils',
    '@nirali-sai/types',
    '@nirali-sai/api-client'
  ],
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com', 'via.placeholder.com'],
  },
};

module.exports = nextConfig;