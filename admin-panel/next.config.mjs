/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Use Docker service name in container, localhost outside
    const backendUrl = process.env.GRAPHQL_BACKEND_URL || 'http://backend:3000/graphql';
    return [
      {
        source: '/api/graphql',
        destination: backendUrl,
      },
    ];
  },
};

export default nextConfig;
