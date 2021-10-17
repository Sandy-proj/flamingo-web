module.exports = {
    async rewrites() {
      return [
        {
          source: '/hopsapi/:path*',
          destination: 'https://api.hopsquare.com/:path*',
        },
        {
          source: '/hopsapp/:path*',
          destination: 'https://hopsquare.com/:path*',
        }
      ]
    }, 
   
  }