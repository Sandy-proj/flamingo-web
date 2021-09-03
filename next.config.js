module.exports = {
    async rewrites() {
      return [
        {
          source: '/hopsapi/:path*',
          destination: 'http://localhost:3001/:path*',
        },
      ]
    },
  }