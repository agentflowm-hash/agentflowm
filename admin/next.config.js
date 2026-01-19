/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ["@heroicons/react"],
  },

  // Bilder
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
