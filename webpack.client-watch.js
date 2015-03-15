var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var config = require('./webpack.client.js');

var host = 'localhost';

if(process.env.npm_config_argv){
  var args = JSON.parse(process.env.npm_config_argv).remain;
  if(args && args.length){
    var hostMatcher = /^--host=(.+)$/, hostMatcherResult;
    while(args.length && !hostMatcherResult){
      hostMatcherResult = hostMatcher.exec(args.shift());
    }
    if(hostMatcherResult){
      host = hostMatcherResult[1];
    }
  }
}

config.cache = true;
config.debug = true;
config.devtool = 'eval';

config.entry.unshift(
	'webpack-dev-server/client?http://' + host + ':8080',
	'webpack/hot/only-dev-server'
);

config.output.publicPath = 'http://' + host + ':8080/dist/';
config.output.hotUpdateMainFilename = 'update/[hash]/update.json';
config.output.hotUpdateChunkFilename = 'update/[hash]/[id].update.js';

config.plugins = [
  new webpack.HotModuleReplacementPlugin(),
	new webpack.NoErrorsPlugin()
];

config.module = {
    loaders: [{
      test: /\.js$/,
      exclude:  /node_modules/,
      loader: 'react-hot!babel-loader?optional=runtime'
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
};

config.devServer = {
	publicPath:  'http://' + host + ':8080/dist/',
	contentBase: './static',
	hot:         true,
	inline:      true,
	quiet:       true,
	noInfo:      true,
	headers:     {'Access-Control-Allow-Origin': '*'},
	stats:       {colors: true}
};

module.exports = config;
