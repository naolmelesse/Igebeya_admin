/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://igebeyamarch2025.onrender.com/api/:path*'
      }
    ];
  },
  images: {
    domains: ['localhost', 'igebeyamarch2025.onrender.com'],
  },
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here if needed
  },
};

module.exports = nextConfig;