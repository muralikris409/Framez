import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
        bodySizeLimit: '10mb',
    }
},
  images: {
    domains: ["framez-bucket.s3.ap-southeast-2.amazonaws.com","avatars.githubusercontent.com","www.flaticon.com","img.freepik.com","example.com","lh3.googleusercontent.com"],
  
  },
};

export default nextConfig;
