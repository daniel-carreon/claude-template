/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    domains: ['replicate.delivery', 'supabase.co', 'localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  // Configuración para API routes que se comunicarán con el backend Python
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'http://localhost:8000/:path*', // FastAPI backend
      },
    ];
  },
  // Variables de entorno que Next.js puede usar
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;