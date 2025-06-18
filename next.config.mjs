/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                hostname:"res.cloudinary.com", protocol:"https",port:""
            }
        ]
    },experimental: {
    turbo: false,
  }
};

export default nextConfig;
