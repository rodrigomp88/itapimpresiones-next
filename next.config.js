/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silenciar la advertencia de workspace root
  turbopack: {
    root: __dirname,
  },

  // Optimizar webpack bundle splitting para mejor performance
  webpack: (config, { isServer }) => {
    // Code splitting para vendor chunks
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          ui: {
            test: /[\\/]node_modules[\\/](lucide-react|@heroicons|framer-motion)[\\/]/,
            name: 'ui',
            chunks: 'all',
            priority: 15,
          },
        },
      },
    };

    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      }
    ],
    formats: ['image/webp', 'image/avif'],
    // Optimizar tamaños de imagen para mejor LCP
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Habilitar optimización agresiva
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Optimizaciones adicionales para Core Web Vitals
    minimumCacheTTL: 86400, // 24 horas de cache
    unoptimized: false, // Asegurar optimización
  },

  // Experimental features para performance
  experimental: {
    // lucide-react retirado de optimizePackageImports: esa optimización
    // desglosa los imports a la ruta interna PascalCase
    // (dist/esm/icons/AlertCircle) que ya no existe en lucide-react 0.475
    // (los archivos son kebab-case: alert-circle.js). Al resolver desde el
    // bundle principal ESM, los imports nombrados funcionan y Turbopack
    // igual hace tree-shaking.
    optimizePackageImports: ['@heroicons/react', 'framer-motion'],
    scrollRestoration: true,
  },

  // Compression
  compress: true,

  // Minimizar el output en producción
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
