var autoprefixer = require('autoprefixer');
var Visualizer = require('webpack-visualizer-plugin');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './app.js',
  output: {
    path: __dirname+'/build',
    filename: '[name].js',
    publicPath: '/', // this only applies to webpack-dev-server
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]" },
      // https://reactjsnews.com/isomorphic-react-in-real-life
      { test: /\.scss$/, loader: "style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass" },
      { test: /\.sass$/, loader: "style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?indentedSyntax" },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file" },
      { test: /\.html$/, loader: "html" },
      { test: /\.json$/, loader: "json"},
      { test: /\.png$/, loader: "url?limit=100000" },
      { test: /\.js(x)?$/, exclude: /node_modules/, loader: 'babel', query: { presets: ['es2015', 'stage-1', 'react', 'react-hmre'], plugins: ['transform-decorators-legacy', 'transform-runtime'] }},
      { test: /\.less$/, loader: "style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!less" },
      { test: /\.swf$/, loader: 'file?name=[path][name].[ext]'},
    ]
  },
  postcss: function() {
    return [autoprefixer];
  },
  plugins: [
    /*
    new Visualizer(),
    // https://gist.github.com/Couto/b29676dd1ab8714a818f
    new webpack.ProvidePlugin({
      'Promise': 'exports?global.Promise!es6-promise',
      'fetch': 'exports?self.fetch!whatwg-fetch'
    }),
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
    */
    // http://javascriptplayground.com/blog/2016/07/webpack-html-plugin/
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'body',
    })
  ],
  // sourcemaps can be slow on old computers
  devtool: "inline-source-map",
  //devtool: "inline-eval-cheap-source-map",
  devServer: {
    host: "0.0.0.0",
    port: 8009,
    historyApiFallback: true
  },
};
