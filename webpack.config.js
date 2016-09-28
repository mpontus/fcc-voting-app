module.exports = {
  entry: './src/client/index.js',
  module: {
    loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
    }],
  },
  output: {
    path: __dirname + '/public/js',
    publicPath: '/js/',
    filename: 'client.js'
  },
}
