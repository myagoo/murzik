var webpack = require('webpack');
var path = require('path');
var pathJoin = path.join.bind(path, __dirname);

module.exports = {
  target: 'web',
  cache: false,
  context: __dirname,
  devtool: false,
  entry: [
    pathJoin('src', 'client.js'),
    pathJoin('src', 'client.less')
  ],
  output: {
    path: pathJoin('static', 'dist'),
    publicPath: 'dist/',
    filename: "client.js",
    chunkFilename: "[name].[id].js"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader?optional=runtime'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.less$/,
      loader: 'style!raw!less'
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    modulesDirectories: [
      'node_modules',
      pathJoin('src', 'client'),
      pathJoin('src')
    ]
  },
  plugins: [
    //new webpack.optimize.DedupePlugin(),
    //new webpack.optimize.OccurenceOrderPlugin(),
    //new webpack.optimize.UglifyJsPlugin()
  ]
};
