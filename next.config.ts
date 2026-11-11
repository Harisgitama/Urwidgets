
import type { NextConfig } from 'next';

// GitHub Pages project URL:
// https://harisgitama.github.io/Urwidgets/
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  // Generate static HTML, CSS, and JavaScript.
  output: 'export',

  // Prefix URLs when deployed under the repository path.
  basePath: isGitHubPages ? '/Urwidgets' : '',

  // Generate routes as directories with index.html.
  trailingSlash: true,

  images: {
    // Disable the Next.js image optimization server.
    unoptimized: true,

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },

  transpilePackages: ['motion'],

  webpack: (config, { dev }) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify this behavior.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }

    return config;
  },
};

export default nextConfig;
