/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gera uma pasta 'out' com arquivos estáticos
  output: 'export',

  // IMPORTANTE: Substitua 'appnext' pelo nome exato do seu repositório no GitHub
  basePath: '/Nextjs',

  // Desativa a otimização de imagens, que não funciona no modo estático
  images: {
    unoptimized: true,
  },
};

export default nextConfig;