const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const precss = require('precss');
const eslintFormatter = require('eslint/lib/formatters/stylish');
const config = require('../index');

const webpackDevServerPort = config.get('webpackDevServerPort');
const htmlTitle = config.get('htmlTitle');
const htmlDescription = config.get('htmlDescription');
const favicon = config.get('favicon');

// Directories of interest
const cwd = process.cwd();
const templatesDir = path.join(__dirname, '../../templates');

// Files of interest
const javascriptEntryPoint = path.join(cwd, './client/index');
const eslintConfig = path.join(cwd, './.eslintrc');

// Developers' custom config.js
const projectConfigPath = path.join(cwd, './config.js');
const projectConfig = require(projectConfigPath); // eslint-disable-line

// Globals for webpack
var javaScriptGlobals = null; // eslint-disable-line
if (projectConfig.webpack && projectConfig.webpack.globals) {
  javaScriptGlobals = new webpack.ProvidePlugin(projectConfig.webpack.globals);
}

// Webpack-generated HTML file
const htmlEntryPoint = new HtmlWebpackPlugin({
  template: path.join(templatesDir, '/_index.html'),
  title: htmlTitle,
  description: htmlDescription,
  mountId: 'root',
  favicon,
});

module.exports = {
  // The entry point for the bundle
  entry: [
    `webpack-dev-server/client?http://localhost:${webpackDevServerPort}`,
    'webpack/hot/only-dev-server',
    javascriptEntryPoint,
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
  devtool: 'inline-source-map',

  // Configure eslint for terminal output during development
  eslint: {
    configFile: eslintConfig,
    formatter: eslintFormatter,
  },

  // Options affecting the normal modules
  module: {
    preLoaders: [
      // eslint preloader
      {
        test: /\.jsx?$/,
        include: /client/,
        loader: 'eslint-loader',
      },
    ],

    // A array of automatically applied loaders
    loaders: [
      // JavaScript and JSX
      {
        test: /\.jsx?$/,
        include: [/client/, /server/],
        loader: 'babel',
        query: {
          presets: [
            ['env', {
              targets: {
                browsers: ['last 2 versions', 'safari >= 7'],
              },
            }],
            'stage-0',
            'react',
            'react-hmre',
          ],
          plugins: ['transform-class-properties'],
        },
      },
      // CSS modules
      {
        test: /\.css$/,
        include: /client/,
        loader: 'style!css?modules&sourceMap&localIdentName=[local]___[hash:base64:7]!postcss',
      },
      // Vendor CSS from NPM
      {
        test: /\.css$/,
        include: /node_modules/,
        loader: 'style!css',
      },
      // Images
      {
        test: /\.(jpe?g|png|gif|svg(2)?)(\?v=[a-z0-9.]+)?$/,
        include: [/node_modules/, /clients/],
        loader: 'file?name=images/[name].[ext]',
      },
      // Fonts
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?v=[a-z0-9.]+)?$/,
        include: [/node_modules/, /clients/],
        loader: 'file?name=fonts/[name].[ext]',
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
    precss(),
  ],

  // Additional plugins for the compiler
  plugins: [
    // Enables Hot Module Replacement
    new webpack.HotModuleReplacementPlugin(),
    // Skips the emitting phase when there are errors during compilation
    new webpack.NoErrorsPlugin(),

    // Add entry point and globals
    htmlEntryPoint,
    javaScriptGlobals,
  ],

  // Make web variables accessible to webpack, e.g. window
  target: 'web',

  // Non-standard property to expose the port the webpack dev server runs on
  webpackDevServerPort,
};
