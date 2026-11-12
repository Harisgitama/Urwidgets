import type {NextConfig} from 'next';

function normalizeBasePath(value?: string): string {
  if (!value) return '';
  const trimmed = value.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) {
    return '';
  }
  const cleaned = trimmed.replace(/\/+$/, '');
  if (!cleaned || cleaned === '/') {
    return '';
  }
  if (!/^\/[a-zA-Z0-9._/-]+$/.test(cleaned)) {
    return '';
  }
  return cleaned;
}

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const configuredBasePath = isGithubActions
  ? normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH) || '/Urwidgets'
  : normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

process.env.NEXT_PUBLIC_BASE_PATH = configuredBasePath;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: configuredBasePath,
  },
  ...(configuredBasePath
    ? {
        basePath: configuredBasePath,
        assetPrefix: `${configuredBasePath}/`,
      }
    : {}),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
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
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;

