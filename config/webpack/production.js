const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const config = require('../index');

const htmlTitle = config.get('htmlTitle');
const htmlDescription = config.get('htmlDescription');
const favicon = config.get('favicon');

const cwd = process.cwd();
const clientDir = path.join(cwd, './client');
const staticDir = path.join(cwd, './static');
const templatesDir = path.join(__dirname, '../../templates');

// Set global vars
const environment = new webpack.DefinePlugin({
  'process.env': {
    // Useful to reduce the size of client-side libraries, e.g. react
    NODE_ENV: JSON.stringify('production'),
  },
});

// Globals for webpack
const javaScriptGlobals = new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery',
});

// Minify JavaScript
const uglify = new webpack.optimize.UglifyJsPlugin({
  comments: false,
  compress: {
    warnings: false,
  },
  mangle: true,
});

// Webpack-generated HTML file
const htmlEntryPoint = new HtmlWebpackPlugin({
  filename: path.join(staticDir, '/index.html'),
  template: path.join(templatesDir, '/_index.html'),
  title: htmlTitle,
  description: htmlDescription,
  mountId: 'root',
  favicon,
});

module.exports = {
  // The entry point for the bundle
  entry: path.join(clientDir, '/index'),

  // Options affecting the output
  output: {
    // The output directory
    path: staticDir,
    // The filename of the entry chunk as relative path inside the output.path directory
    filename: '/js/[hash].js',
  },

  // Options affecting the normal modules
  module: {
    // A array of automatically applied loaders
    loaders: [
      // JavaScript and JSX
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: [/client/, /server/],
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
        include: /client/,
      },
      // Vendor CSS from NPM
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css'),
        include: /node_modules/,
      },
      // Images
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'file?name=images/[hash].[ext]',
      },
      // Fonts
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?v=[a-z0-9\.]+)?$/,
        loader: 'file?name=fonts/[hash].[ext]',
      },
      // JSON
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },

  // PostCSS plugins
  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] }),
    precss(),
  ],

  // Additional plugins for the compiler
  plugins: [
    environment,
    javaScriptGlobals,
    uglify,
    // Extract text from bundle into a file
    new ExtractTextPlugin('/css/[hash].css'),
    htmlEntryPoint,
  ],

  // Make web variables accessible to webpack, e.g. window
  target: 'web',
};
