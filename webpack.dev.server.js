process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const webpackConfig = require('./webpack.config')

const host = 'localhost'
const devServerPort = 3001

new WebpackDevServer(webpack(webpackConfig), {
  headers: { 'Access-Control-Allow-Origin': '*' },
  historyApiFallback: true,
  hot: true,
  noInfo: false,
  publicPath: webpackConfig.output.publicPath
}).listen(devServerPort, host, function (err) {
  if (err) {
    console.log(err)
  }

  console.log('Webpack Dev Server running at ' + host + ':' + devServerPort)
})
