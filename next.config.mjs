/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], 
  },
  turbopack: {
    resolveExtensions: [
      ".mdx",
      ".tsx",
      ".ts",
      ".jsx",
      ".js",
      ".mjs",
      ".json",
    ],
  },
};

export default nextConfig;
