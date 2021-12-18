const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;

module.exports = {
  mode: 'development',
  entry: './src/index.ts',

  plugins: [
    // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],

  watch: true,
  output: {
    path: path.resolve('./dist'),
    filename: "demo.js",
  },

  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },

    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', 'png'],
  }
};
