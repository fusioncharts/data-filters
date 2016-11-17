'use strict';
import webpack from 'webpack';

export default {
  output: {
    filename: 'data-filter-es5.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/]
      }
    ]
  },
  resolve: {
    extensions: ['', '.js']
  },
  devtool: 'inline-source-map'
};
