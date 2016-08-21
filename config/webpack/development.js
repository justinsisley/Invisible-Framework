const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('../index');

const cwd = process.cwd();
const clientDir = path.join(cwd, './client');
const templatesDir = path.join(__dirname, '../../templates');
const webpackDevServerPort = 3326;
const htmlTitle = config.get('htmlTitle');
const htmlDescription = config.get('htmlDescription');
const favicon = config.get('favicon');

module.exports = {
  // Non-standard property to control the port the webpack dev server runs on
  webpackDevServerPort,

  // The entry point for the bundle
  entry: [
    `webpack-dev-server/client?http://localhost:${webpackDevServerPort}`,
    'webpack/hot/only-dev-server',
    path.join(clientDir, '/index'),
  ],

  // Options affecting the output
  output: {
    // The output directory
    path: path.join(__dirname, 'static'),
    // The filename of the entry chunk as relative path inside the
    // output.path directory
    filename: 'js/app.js',
    // The output.path from the view of the Javascript / HTML page
    publicPath: '/',
  },

  // Generate a source map
  devtool: 'cheap-module-eval-source-map',

  // Options affecting the normal modules
  module: {
    // A array of automatically applied loaders
    loaders: [
      // JavaScript and JSX
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: [clientDir],
        query: {
          presets: ['es2015', 'react'],
          env: {
            development: {
              presets: ['react-hmre'],
            },
          },
        },
      },
      // CSS modules
      {
        test: /\.css$/,
        loader: 'style-loader?sourceMap!css-loader?modules&sourceMap&localIdentName=[local]___[hash:base64:5]!postcss-loader?sourceMap', // eslint-disable-line
        include: [clientDir],
      },
      // Vendor CSS from NPM
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        exclude: [clientDir],
      },
      // Images
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'file-loader?name=images/[name].[ext]',
      },
      // Fonts
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?v=[a-z0-9\.]+)?$/,
        loader: 'file-loader?name=fonts/[name].[ext]',
      },
      // JSON
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },

  // PostCSS plugins
  postcss: [
    // Allow @imports
    require('postcss-import'), // eslint-disable-line
    // Allow sass-style prefixed partial imports
    // require('postcss-partial-import'), // eslint-disable-line
    // Allow Sass-like variables
    require('postcss-simple-vars'), // eslint-disable-line
    // Process URLs found in stylesheets
    require('postcss-url')({ // eslint-disable-line
      // During development, replace relative protocols with
      // HTTP to avoid issues with generated CSS blobs
      url: function url(URL) {
        return URL.replace(/^\/\//, 'http://');
      },
    }),
  ],

  // Additional plugins for the compiler
  plugins: [
    // Provide global jQuery to libraries that need it
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    // Enables Hot Module Replacement
    new webpack.HotModuleReplacementPlugin(),
    // Skips the emitting phase when there are errors during compilation
    new webpack.NoErrorsPlugin(),

    // Generate the HTML entry
    new HtmlWebpackPlugin({
      template: path.join(templatesDir, '/_index.html'),
      title: htmlTitle,
      description: htmlDescription,
      mountId: 'root',
      favicon,
    }),
  ],

  // Options affecting the resolving of modules
  resolve: {
    // An array of extensions that should be used to resolve modules
    extensions: ['', '.js', '.jsx'],
  },

  // Make web variables accessible to webpack, e.g. window
  target: 'web',
};
