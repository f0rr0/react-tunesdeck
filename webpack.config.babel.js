var path = require('path');
var webpack = require('webpack');
var config = {
  path: {
    dist: path.join(__dirname, 'dist'),
    entry: './app/main.jsx'
  }
};
module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: ['webpack-hot-middleware/client',
    config.path.entry
  ],
  output: {
    path: config.path.dist,
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
    }, {
      test: /\.css$/,
      loader: 'radium!css'
    }]
  },
};
