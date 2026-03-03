/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
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