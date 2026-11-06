/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['172.20.10.4', 'localhost'],
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
