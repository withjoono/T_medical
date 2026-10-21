/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@tskool/satellite-header'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  webpack(config, { dev }) {
    // Rotate static URLs once to recover crawlers holding a failed chunk fetch.
    // Keep this stable across builds; old hashed assets are retained at deploy.
    if (!dev) config.output.hashSalt = 'tmedi-static-recovery-20261021'
    return config
  },
}

export default nextConfig
