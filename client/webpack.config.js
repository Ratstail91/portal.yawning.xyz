module.exports = {
	entry: "./src/index.jsx",
	output: {
		path: __dirname,
		filename: "app.bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				options: {
					presets: ["@babel/preset-env", "@babel/preset-react"]
				}
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				loader: ["style-loader", "css-loader"]
			}
		]
	}
};