/** @type {import('next').NextConfig} */

module.exports = {
    // accept images from these URL-patterns
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ipfs.poolpm.nftcdn.io",
                port: "",
                pathname: "/ipfs/**"
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                port: "",
                pathname: "/dj2tauktl/**"
            }
        ]
    },
    // add fetch-logs when running npm run dev
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    webpack(config, options) {
        // Add @svgr/webpack to handle SVG files
        config.module.rules.push({
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        });
    
        return config;
      },
    
}
