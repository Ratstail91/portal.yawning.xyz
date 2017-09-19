module.exports = {
  entry: './src/index.jsx',
  output: {
    path: __dirname,
    filename: 'app.bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['env', 'react']
        }
      }
    ]
  }
};
