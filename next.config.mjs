import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TS type checking on build
  typescript: {
    ignoreBuildErrors: true, // 👈 add this
  },

  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
    ],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })

// import { withPayload } from '@payloadcms/next/withPayload'

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // Your Next.js config here
//   webpack: (webpackConfig) => {
//     webpackConfig.resolve.extensionAlias = {
//       '.cjs': ['.cts', '.cjs'],
//       '.js': ['.ts', '.tsx', '.js', '.jsx'],
//       '.mjs': ['.mts', '.mjs'],
//     }

//     return webpackConfig
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'github.com',
//       },
//     ],
//   },
// }

// export default withPayload(nextConfig, { devBundleServerPackages: false })
