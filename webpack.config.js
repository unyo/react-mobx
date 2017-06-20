// https://github.com/tb/perfectly-simple-webpack-starter
// https://github.com/rokoroku/react-mobx-typescript-boilerplate/blob/master/webpack.config.js
// https://github.com/mhaagens/react-mobx-react-router4-boilerplate

const webpack = require('webpack')
const { resolve } = require('path')
const { getIfUtils, removeEmpty } = require('webpack-config-utils')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const autoprefixer = require('autoprefixer')
const Visualizer = require('webpack-visualizer-plugin')

const nodeEnv = process.env.NODE_ENV || 'development'
const { ifDevelopment, ifProduction } = getIfUtils(nodeEnv)

const port = '8000'
const buildPath = './build'
const outputPath = ifProduction('/', '/')

const sassConfig = [
  {
    loader: 'css-loader',
    query: {
      modules: true,
      sourceMap: ifProduction(false, true),
      importLoaders: 2,
      localIdentName: '[name]__[local]__[hash:base64:5]'
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: (loader) => [
        autoprefixer()
      ]
    }
  },
  'sass-loader'
]

const cssConfig = [
  {
    loader: 'css-loader',
    query: {
      modules: true,
      sourceMap: ifProduction(false, true),
      importLoaders: 1,
      localIdentName: '[name]__[local]__[hash:base64:5]'
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: (loader) => [
        autoprefixer()
      ]
    }
  },
]

module.exports = {
  entry: {
    app: 'index.js',
    vendor: removeEmpty([
      'react',
      'react-dom',
      'react-router-dom',
      'react-hot-loader',
      ifDevelopment('react-hot-loader/patch'),
      'mobx',
      'mobx-react',
      'mobx-react-devtools',
      'history',
      'jquery',
      ifProduction('whatwg-fetch'),
    ]),
  },
  output: {
    filename: ifProduction('[name]-bundle-[hash].js', '[name]-bundle.js'),
    path: resolve(__dirname, buildPath),
    publicPath: outputPath, // this only applies to webpack-dev-server
  },
  resolve: {
    modules: [ "node_modules", __dirname, ],
  },
  module: {
    rules: [
      removeEmpty({
        test: /\.(sass|scss)$/,
        loader: ifProduction(ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: sassConfig,
        })),
        use: ifDevelopment(sassConfig)
      }),
      removeEmpty({
        test: /\.css$/,
        loader: ifProduction(ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: cssConfig,
        })),
        use: ifDevelopment(cssConfig)
      }),
      {
        test: /\.js(x)?$/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              cacheDirectory: true,
            }
          }
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        use: [ 'json-loader' ]
      },
      {
        test: /\.(jpe?g|png|eot|svg|otf|woff2?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          ifProduction(
            {
              loader: 'url-loader',
              options: {
                limit: 100000
              }
            },
            'file-loader'
          )
        ]
      }
    ],
  },
  // sourcemaps can be slow on old computers
  devtool: ifDevelopment('source-map', 'source-map'),
  //devtool: ifDevelopment('eval-source-map', 'source-map'),
  devServer: ifDevelopment({
    host: "0.0.0.0",
    port: port,
    historyApiFallback: true,
    hot: true,
    contentBase: resolve(__dirname, buildPath),
    publicPath: outputPath,
  }),
  plugins: removeEmpty([
    ifDevelopment(new webpack.HotModuleReplacementPlugin()),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
      minChunks: Infinity
    }),
    ifProduction(new webpack.optimize.AggressiveMergingPlugin()),
    ifProduction(
      new Visualizer({
        filename: './stats.html',
      })
    ),
    // https://gist.github.com/Couto/b29676dd1ab8714a818f
    ifProduction(
      new webpack.ProvidePlugin({
        'fetch': 'exports-loader?self.fetch!whatwg-fetch'
      })
    ),
    // http://javascriptplayground.com/blog/2016/07/webpack-html-plugin/
    new HtmlWebpackPlugin({
      hash: ifProduction(true, false),
      template: 'index.html',
      inject: 'body',
      environment: nodeEnv,
    }),
    /*
    ifProduction(
      new CopyWebpackPlugin(
        [ { from: 'assets', to: 'assets' } ]
      )
    ),
    */
    ifProduction(
      new ExtractTextPlugin('[name]-bundle-[hash].css'),
      new ExtractTextPlugin('[name]-bundle.css')
    ),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]),
}
