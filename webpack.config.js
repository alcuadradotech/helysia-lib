const path = require('path');
const webpack = require('webpack');

const config = {
  mode: 'development',
  entry: ['@babel/polyfill', './app/index.js'],
  devtool: 'inline-source-map',
  output: {
    path: __dirname + '/build',
    filename: 'helysia.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  devServer:{
    watchContentBase: true,
    contentBase: __dirname + '/build',
    port: 9000,
    hot: true,
    compress: true
  }
}
module.exports = config;