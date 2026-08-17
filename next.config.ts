import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // As imagens das notícias vêm da planilha, hospedadas no Cloudinary.
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },
}

export default nextConfig
