import type { NextConfig } from "next";


const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "plus.unsplash.com", // ✅ add this line
      "res.cloudinary.com", // (optional if you use Cloudinary later)
    ],
  },
};




export default nextConfig;
