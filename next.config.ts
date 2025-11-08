import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Type checking habilitado em produção para maior segurança
    ignoreBuildErrors: false,
  },
  // React Strict Mode ativado para detectar problemas
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      // Desabilita hot reload do webpack (nodemon gerencia o reload completo)
      config.watchOptions = {
        ignored: ['**/*'], // Ignora mudanças de arquivo (nodemon cuida disso)
      };
    }
    return config;
  },
  eslint: {
    // ESLint habilitado em builds para garantir qualidade
    ignoreDuringBuilds: false,
  },
  images: {
    // Otimização de imagens
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
