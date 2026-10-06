const isProd = process.env.NODE_ENV === 'production';

// Static files in /public keep their names between deploys, so they can't be
// "immutable". Cache them for a day and let browsers/CDNs serve stale copies
// for a week while they revalidate in the background. (Production only: in dev
// this would pin stale images in the browser while files are being edited.)
const PUBLIC_ASSET_CACHE = 'public, max-age=86400, stale-while-revalidate=604800';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Keep optimized images for 30 days (Next's default is 4 hours).
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  compress: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  compiler: {
    // Strip console.log/info/debug from production bundles but keep
    // console.error/warn so failures still show up in server and browser logs.
    removeConsole: isProd ? { exclude: ['error', 'warn'] } : false,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Performance headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      ...(isProd
        ? [
            // /_next/static/** is content-hashed; Next already serves it as
            // `public, max-age=31536000, immutable`, so it needs no rule here.

            // Un-hashed public images and icons.
            { source: '/images/:path*', headers: [{ key: 'Cache-Control', value: PUBLIC_ASSET_CACHE }] },
            { source: '/icons/:path*', headers: [{ key: 'Cache-Control', value: PUBLIC_ASSET_CACHE }] },
            { source: '/favicon.ico', headers: [{ key: 'Cache-Control', value: PUBLIC_ASSET_CACHE }] },
            { source: '/og-thumbnail.png', headers: [{ key: 'Cache-Control', value: PUBLIC_ASSET_CACHE }] },
            // Poppins TTFs: fallback font for the generated share images; these files never change.
            {
              source: '/font/:path*',
              headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            },
            // Share images are prerendered by app/**/opengraph-image.tsx and cached by Next itself.
          ]
        : []),
      // Note: /api/revalidate sets its own `Cache-Control: no-store`.
    ];
  },
};

export default nextConfig;
