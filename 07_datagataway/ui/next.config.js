/** @type {import('next').NextConfig} */

const nextTranslate = require('next-translate');

const nextConfig = {
  reactStrictMode: true,
  styledComponents: true,
}

module.exports = nextTranslate(nextConfig);
