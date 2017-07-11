// https://github.com/tb/perfectly-simple-webpack-starter
// https://github.com/rokoroku/react-mobx-typescript-boilerplate/blob/master/webpack.config.js
// https://github.com/mhaagens/react-mobx-react-router4-boilerplate

const webpack = require('webpack')
const { resolve } = require('path')
const { getIfUtils, removeEmpty } = require('webpack-config-utils')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const autoprefixer = require('autoprefixer')
const Visualizer = require('webpack-visualizer-plugin')

const nodeEnv = process.env.NODE_ENV || 'development'
const { ifProd, ifNotProd } = getIfUtils(nodeEnv)

const port = '8000'
const buildPath = './build'
const outputPath = ifProd('/', '/')

const sassConfig = removeEmpty([
  ifNotProd({
    loader: 'style-loader',
  }),
  {
    loader: 'css-loader',
    query: {
      modules: true,
      sourceMap: true,
      importLoaders: 3,
      localIdentName: '[name]__[local]__[hash:base64:5]'
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: (loader) => [
        autoprefixer()
      ],
      sourceMap: true,
    }
  },
  {
    loader: 'resolve-url-loader',
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
    }
  }
])

const cssConfig = [
  ifNotProd({
    loader: 'style-loader',
  }),
  {
    loader: 'css-loader',
    query: {
      modules: true,
      sourceMap: ifProd(false, true),
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
  {
    loader: 'resolve-url-loader',
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
      ifNotProd('react-hot-loader/patch'),
      'mobx',
      'mobx-react',
      'mobx-react-devtools',
      'history',
      'jquery',
      ifProd('whatwg-fetch'),
    ]),
  },
  output: {
    filename: ifProd('[name]-bundle-[hash].js', '[name]-bundle.js'),
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
        loader: ifProd(ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: sassConfig,
        })),
        use: ifNotProd(sassConfig)
      }),
      removeEmpty({
        test: /\.css$/,
        loader: ifProd(ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: cssConfig,
        })),
        use: ifNotProd(cssConfig)
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
          ifProd(
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
  devtool: ifNotProd('source-map', 'source-map'),
  //devtool: ifNotProd('eval-source-map', 'source-map'),
  devServer: ifNotProd({
    host: '0.0.0.0',
    port: port,
    historyApiFallback: true,
    hot: true,
    contentBase: resolve(__dirname, buildPath),
    publicPath: outputPath,
  }),
  plugins: removeEmpty([
    ifNotProd(new webpack.HotModuleReplacementPlugin()),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
      minChunks: Infinity
    }),
    ifProd(new webpack.optimize.AggressiveMergingPlugin()),
    ifProd(
      new Visualizer({
        filename: './stats.html',
      })
    ),
    // https://gist.github.com/Couto/b29676dd1ab8714a818f
    ifProd(
      new webpack.ProvidePlugin({
        'fetch': 'exports-loader?self.fetch!whatwg-fetch'
      })
    ),
    // http://javascriptplayground.com/blog/2016/07/webpack-html-plugin/
    new HtmlWebpackPlugin({
      hash: ifProd(true, false),
      template: 'index.html',
      inject: 'body',
      environment: nodeEnv,
    }),
    ifProd(
      new ExtractTextPlugin('[name]-bundle-[hash].css')
    ),
    // apparently this breaks hot reload
    ifProd(
      new webpack.optimize.ModuleConcatenationPlugin()
    )
  ]),
}
