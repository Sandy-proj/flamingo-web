module.exports = {
    async rewrites() {
      return [
        {
          source: '/hopsapi/:path*',
          destination: 'http://localhost:3001/:path*',
        },
        {
          source: '/hopsapp/:path*',
          destination: 'http://localhost:3000/:path*',
        }
      ]
    }, 
   
  }