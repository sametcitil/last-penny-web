/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack'in mongoose haritalama hatasını tamamen çözer
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;