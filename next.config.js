/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        serverComponentsExternalPackages: ['@react-pdf/renderer'],
    },
    images: {
        domains: ["images.pexels.com", "images.unsplash.com", "plus.unsplash.com", "i0.wp.com", "img.freepik.com", "localhost","res.cloudinary.com", 'grand-occassion-be.onrender'],
    }
}

module.exports = nextConfig
