const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  devtool: 'inline-source-map',
  entry: {
    background: './src/js/background.js',
    action: './src/js/action.js',
    bundle: './src/index.js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'src', 'static'),
      to: path.resolve(__dirname, 'dist')
    }])
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist', 'js')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  performance: { hints: false }
}
