const path = require('path');
const config = {
  path: {
    dist: './dist',
    entry: './app/main.jsx'
  }
};
module.exports = {
  entry: config.path.entry,
  output: {
    path: config.path.dist,
    filename: 'bundle.js',
  },
  module: {
  loaders: [
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
    },
    {
      test: /\.css$/,
      loader: 'radium!css'
    }
  ]
},
};
