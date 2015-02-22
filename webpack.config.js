var path = require('path');

module.exports = {
	entry: {
		'script': path.join(__dirname, 'src', 'main.js'),
		'style': path.join(__dirname, 'src', 'main.less'),
	},
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: "http://localhost:9090/",
		filename: "[name].bundle.js",
		chunkFilename: "[id].bundle.js"
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude:  /node_modules/,
			loader: 'babel-loader'
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
		modulesDirectories: ['node_modules', 'bower_components', 'src']
	}
};
