var webpack = require('webpack');
var path = require('path');
var pathJoin = path.join.bind(path, __dirname);
var fs = require('fs');
var _ = require('lodash');

var dependencies = JSON.parse(fs.readFileSync(pathJoin('package.json'))).dependencies;
if('rest' in dependencies){
    dependencies['rest/interceptor/mime'] = true;
}

var nodeModules = _.chain(dependencies)
.transform(function(result, version, module) {
    result[module] = 'commonjs ' + module;
}).value();

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
  externals: nodeModules,
  plugins: [
    new webpack.IgnorePlugin(/vertx/),
    new webpack.DefinePlugin({
      __HOST__: '""',
    })
  ]
};
