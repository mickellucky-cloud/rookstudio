/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@remotion/player", "remotion"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
