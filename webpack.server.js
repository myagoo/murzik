var webpack = require('webpack');
var path = require('path');
var pathJoin = path.join.bind(path, __dirname);

module.exports = {
  target: 'node',
  context: __dirname,
  entry: [pathJoin('src', 'server.js')],
  output: {
    path: pathJoin('dist'),
    filename: 'server.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader?optional=runtime'
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    modulesDirectories: [
      'node_modules',
      pathJoin('src', 'server'),
      pathJoin('src')
    ]
  },
  node: {
    console: false,
    process: false,
    global: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  output: {
    libraryTarget: 'commonjs'
  },
  externals: {
    'express': 'commonjs express',
    'serve-static': 'commonjs serve-static',
    'morgan': 'commonjs morgan',
    'socket.io': 'commonjs socket.io',
    'lodash': 'commonjs lodash',
    'rest': 'commonjs rest',
    'rest/interceptor/mime': 'commonjs rest/interceptor/mime'
  },
  plugins: [
    new webpack.DefinePlugin({
      __HOST__: '""',
    })
  ]
};
