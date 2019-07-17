const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node',
  externals: [nodeExternals()],
  entry: path.join(__dirname, '..', 'src', 'index.js'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '..', 'dist')
  }
}
