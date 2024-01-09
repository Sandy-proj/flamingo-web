module.exports = {
  async rewrites() {
    return [
      {
        source: '/hopsapi/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
      {
        source: '/socialapi/:path*',
       // destination: 'https://api.kandybag.com/:path*',
	destination: '/api/:path*', 
	      //destination:'http://localhost:3001/:path*',
      },
      {
        source: '/hopsapp/:path*',
        //destination: 'http://localhost:3000/:path*',
        destination: '/:path*'
      }
    ]
  }, 
 
}
