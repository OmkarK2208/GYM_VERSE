/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '172.18.112.43',
    '10.79.200.43',
    '172.20.10.4',
    '*.local',
  ],
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
