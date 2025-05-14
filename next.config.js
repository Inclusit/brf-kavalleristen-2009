/** @type {import('next').NextConfig} */
const nextConfig = {
  
  productionBrowserSourceMaps: true,
  reactStrictMode: true,

  output: "standalone",

  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, 
    };
    return config;
  },
};

module.exports = nextConfig;
