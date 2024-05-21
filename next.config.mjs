/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["https://vote-count-management-system-ui.onrender.com"],
  },
  // output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
