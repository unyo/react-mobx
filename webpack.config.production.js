var autoprefixer = require('autoprefixer');
var Visualizer = require('webpack-visualizer-plugin');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    bundle: './app.js',
    // import the sdk so we can host the demo using the admin tool
    // we import it outside of the bundle because the bundle takes a while to
    // load and the client times out over VPN
    sdk: 'exm-sdk-client/src/index.js'
  },
  output: {
    path: __dirname+'/build',
    filename: '[name].js',
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]" },
      // https://reactjsnews.com/isomorphic-react-in-real-life
      { test: /\.scss$/, loader: "style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass" },
      { test: /\.sass$/, loader: "style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?indentedSyntax" },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url?mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file" },
      { test: /\.html$/, loader: "html" },
      { test: /\.json$/, loader: "json"},
      { test: /\.png$/, loader: "url?limit=100000" },
      { test: /\.js(x)?$/, exclude: /node_modules/, loader: 'babel', query: { presets: ['es2015', 'stage-1', 'react'], plugins: ['transform-decorators-legacy', 'transform-runtime'] }},
      { test: /\.less$/, loader: "style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!less" },
      { test: /\.swf$/, loader: 'file?name=[path][name].[ext]'},
    ]
  },
  postcss: function() {
    return [autoprefixer];
  },
  //devtool: "inline-source-map",
  plugins: [
    new Visualizer(),
    // https://gist.github.com/Couto/b29676dd1ab8714a818f
    new webpack.ProvidePlugin({
      'Promise': 'exports?global.Promise!es6-promise',
      'fetch': 'exports?self.fetch!whatwg-fetch'
    }),
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
    // http://javascriptplayground.com/blog/2016/07/webpack-html-plugin/
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'body',
    })
  ],
};
