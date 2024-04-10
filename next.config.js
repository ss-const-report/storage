// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Set the size limit to 10MB or whatever size fits your needs
    },
  },
};

module.exports = nextConfig;
