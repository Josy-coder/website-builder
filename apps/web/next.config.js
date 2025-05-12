/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ["ui"],
    images: {
        domains: ["avatars.githubusercontent.com"],
    },
    experimental: {
        serverComponentsExternalPackages: ["@prisma/client"],
    },
}

module.exports = nextConfig