/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "raajsi-kohl.vercel.app"], 
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
