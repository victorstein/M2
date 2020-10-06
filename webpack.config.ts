const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: {
    server: './_transpiled/server.js'
  },
  output: {
    filename: 'server.bundle.js',
    path: path.resolve(__dirname, 'dist/')
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: path.resolve(__dirname, 'node_modules')
    }]
  },
  mode: 'production',
  target: 'node',
  externals: [nodeExternals()]
}