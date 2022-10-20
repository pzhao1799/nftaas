/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['@thumbtack/thumbprint-react']);

const nextConfig = {
  ...withTM({}),
  reactStrictMode: true,
  swcMinify: true,
};


module.exports = nextConfig
