const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '/dist'), // the bundle output path
    filename: 'bundle.js', // the name of the bundle
    // publicPath: '/dist/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html', // to import index.html file inside public
      filename: 'index.html', // Name of the file in ./dist
      title: 'Cryptofolio',
    }),
    new webpack.ProvidePlugin({
      'window.@emotion/react': '@emotion/react',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './favicon.ico', to: 'favicon.ico' },
        { from: './src/avatars', to: 'avatars' },
        { from: './src/images', to: 'images' },
      ],
    }),
  ],
  devServer: {
    host: 'localhost',
    historyApiFallback: true,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3002',
        secure: false,
      },
      {
        context: ['/user'],
        target: 'http://localhost:3002',
        secure: false,
      },
    ],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // .js and .jsx files
        exclude: /node_modules/, // excluding the node_modules folder
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(sa|sc|c)ss$/, // styles files
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/, // to import images and fonts
        loader: 'url-loader',
        options: { limit: false },
      },
    ],
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
};
