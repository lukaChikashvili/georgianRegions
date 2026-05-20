import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [
    "@clerk/nextjs", 
    "@clerk/shared",
    "three",
    "@react-three/fiber",
    "@react-three/drei"
  ],
};

export default nextConfig;