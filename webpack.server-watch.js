var webpack = require('webpack');
var config = require('./webpack.server.js');

var host = 'localhost';

if (process.env.npm_config_argv) {
  var args = JSON.parse(process.env.npm_config_argv).remain;
  if (args && args.length) {
    var hostMatcher = /^--host=(.+)$/,
      hostMatcherResult;
    while (args.length && !hostMatcherResult) {
      hostMatcherResult = hostMatcher.exec(args.shift());
    }
    if (hostMatcherResult) {
      host = hostMatcherResult[1];
    }
  }
}

config.cache = true;
config.debug = true;
config.devtool = 'source-map';

config.plugins = [
  new webpack.DefinePlugin({
    __HOST__: '"//' + host + ':8080"',
  })
];

module.exports = config;
