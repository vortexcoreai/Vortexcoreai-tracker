import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactCompiler: true,
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},

	experimental: {
		turbo: false,
	},

	webpack: (webpackConfig) => {
		webpackConfig.resolve.extensionAlias = {
			".cjs": [".cts", ".cjs"],
			".js": [".ts", ".tsx", ".js", ".jsx"],
			".mjs": [".mts", ".mjs"],
		};

		webpackConfig.module.rules.push({
			test: /\.md$/,
			use: "ignore-loader",
		});

		return webpackConfig;
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
