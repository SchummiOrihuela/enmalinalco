/** @type {import('next').NextConfig} */
const nextConfig = {
  // 301 permanente de www -> apex para evitar contenido duplicado en Google.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.enmalinalco.com' }],
        destination: 'https://enmalinalco.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
