let userConfig = undefined;
try {
  userConfig = await import("./v0-user-next.config");
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {},
};

mergeConfig(nextConfig, userConfig);

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return;
  }

  const isVercel = process.env.VERCEL === "1";

  for (const key in userConfig) {
    if (key === "experimental" && isVercel) {
      continue; // Ignore experimental flags on Vercel
    }

    if (
      typeof nextConfig[key] === "object" &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }
}

export default nextConfig;
