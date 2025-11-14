import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["pino", "pino-pretty", "thread-stream"],

  typescript: {
    ignoreBuildErrors: true,
  },

  webpack: (config) => {
    config.module.rules.push({
      test: /\/test\//,
      use: "ignore-loader",
    });

    config.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };

    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  },
};

export default withPayload(nextConfig);
