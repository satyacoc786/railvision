/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/railvision',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig