/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: "default",
    disableStaticImages: false,
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "vote-count-management-system-ui.onrender.com",
    //     port: "",
    //     pathname: "./public/**",
    //   },
    // ],
    // unoptimized: true,
    // domains: ["https://vote-count-management-system-ui.onrender.com"],
  },
  // output: "export",
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
};

export default nextConfig;
