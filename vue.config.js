module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/dev_ar/'
    : '/',
  devServer: {
    socket: 'socket'
  },
}
