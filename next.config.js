/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    async redirects() {
       // Deleted product pages — redirect to products listing
{ source: '/products/2',   destination: '/products', permanent: true },
{ source: '/products/6',   destination: '/products', permanent: true },
{ source: '/products/14',  destination: '/products', permanent: true },
{ source: '/products/19',  destination: '/products', permanent: true },
{ source: '/products/25',  destination: '/products', permanent: true },
{ source: '/products/29',  destination: '/products', permanent: true },
{ source: '/products/72',  destination: '/products', permanent: true },
{ source: '/products/129', destination: '/products', permanent: true },
{ source: '/products/159', destination: '/products', permanent: true },
{ source: '/products/180', destination: '/products', permanent: true },
    },
    experimental: {
        serverComponentsExternalPackages: ['@react-pdf/renderer'],
    },
    images: {
        domains: ["images.pexels.com", "images.unsplash.com", "plus.unsplash.com", "i0.wp.com", "img.freepik.com", "localhost","res.cloudinary.com", 'grand-occassion-be.onrender'],
    }
}

module.exports = nextConfig
