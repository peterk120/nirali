/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: true,
  transpilePackages: [
    '@nirali-sai/ui',
    '@nirali-sai/utils',
    '@nirali-sai/types',
    '@nirali-sai/api-client'
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
};

module.exports = nextConfig;