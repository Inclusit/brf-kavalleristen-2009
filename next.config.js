/** @type {import('next').NextConfig} */
const nextConfig = {
  
  experimental: {
    appDir: true,
  },
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
