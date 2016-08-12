const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('../index');

const cwd = process.cwd();
const clientDir = path.join(cwd, './client');
const staticDir = path.join(cwd, './static');
const templatesDir = path.join(__dirname, '../../templates');
const htmlTitle = config.get('htmlTitle');
const htmlDescription = config.get('htmlDescription');
const favicon = config.get('favicon');

module.exports = {
  // The entry point for the bundle
  entry: path.join(clientDir, '/index'),

  // Options affecting the output
  output: {
    // The output directory
    path: staticDir,
    // The filename of the entry chunk as relative path inside the output.path directory
    filename: 'js/[hash].js',
  },

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
        loader:
        ExtractTextPlugin.extract('style', 'css?modules!postcss'),
        include: [clientDir],
      },
      // Vendor CSS from NPM
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css'),
        exclude: [clientDir],
      },
      // Images
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'file-loader?name=images/[hash].[ext]',
      },
      // Fonts
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?v=[a-z0-9\.]+)?$/,
        loader: 'file-loader?name=fonts/[hash].[ext]',
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
    require('postcss-partial-import'), // eslint-disable-line
    // Allow Sass-like variables
    require('postcss-simple-vars'), // eslint-disable-line
  ],

  // Additional plugins for the compiler
  plugins: [
    // Set global vars
    new webpack.DefinePlugin({
      'process.env': {
        // Useful to reduce the size of client-side libraries, e.g. react
        NODE_ENV: JSON.stringify('production'),
      },
    }),

    // Provide global jQuery to libraries that need it
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),

    // Minify JavaScript
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compress: {
        warnings: false,
      },
      mangle: false,
    }),

    // Extract text from bundle into a file
    new ExtractTextPlugin('css/[hash].css'),

    // Generate the HTML entry
    new HtmlWebpackPlugin({
      filename: path.join(staticDir, '/index.html'),
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
