import type { NextConfig } from "next";

function resolveBasePath(): string {
  if (process.env.BASE_PATH !== undefined) {
    return process.env.BASE_PATH;
  }

  const repo = process.env.GITHUB_REPOSITORY;
  if (repo) {
    const repoName = repo.split("/")[1] ?? "";
    if (repoName.endsWith(".github.io")) {
      return "";
    }
    return `/${repoName}`;
  }

  return "";
}

const basePath = resolveBasePath();

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.bib$/,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
