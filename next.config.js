
/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        stackbitPreview: process.env.STACKBIT_PREVIEW
    },
    trailingSlash: true,
    reactStrictMode: true,
    compress: true,
    poweredByHeader: false,
    images: {
        unoptimized: false,
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
    },
    // Note: The 'optimization' configuration has been removed as it's not supported in Next.js 15.3.1
    webpack: (config, { isServer }) => {
        // If you need chunk optimization, you can customize webpack config here
        // For example, to achieve similar functionality to your previous optimization settings:
        config.optimization.splitChunks = {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                errorBoundary: {
                    test: /[\\/]components[\\/]ErrorBoundary\.tsx$/,
                    name: 'error-boundary',
                    chunks: 'all',
                    enforce: true,
                    priority: 30,
                }
            }
        };

        return config;
    }
};

module.exports = nextConfig;
