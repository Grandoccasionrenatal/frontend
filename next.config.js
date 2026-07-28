/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    async redirects() {
        return [
            // Deleted product pages — redirect to products listing
            { source: '/products/72', destination: '/products', permanent: true },
            { source: '/products/14', destination: '/products', permanent: true },
            { source: '/products/180', destination: '/products', permanent: true },
        ];
    },
    experimental: {
        serverComponentsExternalPackages: ['@react-pdf/renderer'],
    },
    images: {
        domains: ["images.pexels.com", "images.unsplash.com", "plus.unsplash.com", "i0.wp.com", "img.freepik.com", "localhost","res.cloudinary.com", 'grand-occassion-be.onrender'],
    }
}

module.exports = nextConfig
