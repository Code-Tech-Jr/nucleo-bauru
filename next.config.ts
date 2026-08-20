import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Restrito à nossa conta: sem o pathname o otimizador serviria qualquer conta
    // do Cloudinary, e sem o search dava para multiplicar entradas de cache com
    // ?v=1, ?v=2... Precisa bater com CLOUDINARY_BASE em src/lib/site.ts.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/bu6xbdjg/image/upload/**',
        search: '',
      },
    ],
  },
}

export default nextConfig
