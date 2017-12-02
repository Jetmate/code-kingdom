const path = require('path')

const APP_DIR = path.resolve('src')
const BUILD_DIR = path.resolve('www')

const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: ['babel-polyfill', path.resolve(APP_DIR, 'index.js')],

  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'node_modules/monaco-editor/min/vs',
        to: 'vs',
      }
    ])
  ],

  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },

  devServer: {
    hot: true,
    contentBase: BUILD_DIR,
    historyApiFallback: true
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      src: APP_DIR
    }
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: APP_DIR,
        loader: 'babel-loader',
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|otf|svg)$/,
        include: APP_DIR,
        loader: 'url-loader'
      }
    ]
  }
}
