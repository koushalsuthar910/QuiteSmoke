require('node:dns').setDefaultResultOrder('ipv4first');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: { serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'] },
};
