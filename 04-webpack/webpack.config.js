const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	mode: 'production',
	entry: './src/index.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	},
	plugins: [
		new htmlWebpackPlugin({template: './src/template.html'}),
	],
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.html$/i,
				use: "html-loader",
			}
		]
	}
}