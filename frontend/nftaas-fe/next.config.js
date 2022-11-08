/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['@thumbtack/thumbprint-react']);

const nextConfig = {
  ...withTM({}),
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true
  }
};


module.exports = nextConfig
