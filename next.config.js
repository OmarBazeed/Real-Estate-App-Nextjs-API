const path = require('path');
module.exports = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['images.pexels.com']
  },
  webpack: (config) => {
    config.resolve.alias['next/image'] = path.resolve(__dirname, 'utils/NextImage.js');
    return config;
  },
}
