const path = require('path')
const webpack = require('webpack')

const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/client/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, './dist/client/'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new Dotenv(),
  ],
  devtool: 'source-map',
  devServer: {
    contentBase: '.',
    port: 3030,
    hot: true,
    publicPath: '/dist/client',
    historyApiFallback: true,
  }
}
