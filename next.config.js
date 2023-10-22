/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['ohvoiqalxeiyxytqcsks.supabase.co'],
  },
}

module.exports = nextConfig
