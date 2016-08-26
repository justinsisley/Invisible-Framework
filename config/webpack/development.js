const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const precss = require('precss');
const config = require('../index');

const webpackDevServerPort = 3326;

const htmlTitle = config.get('htmlTitle');
const htmlDescription = config.get('htmlDescription');
const favicon = config.get('favicon');

const cwd = process.cwd();
const templatesDir = path.join(__dirname, '../../templates');
const javascriptEntryPoint = path.join(cwd, './client/index');

// Globals for webpack
const env = path.join(cwd, './.env');
const envData = fs.readFileSync(env, { encoding: 'utf8' });
const envJSON = JSON.parse(envData);
const webpackGlobalsEnv = envJSON.WEBPACK_GLOBALS;
const javaScriptGlobals = new webpack.ProvidePlugin(webpackGlobalsEnv);

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
  devtool: 'cheap-module-eval-source-map',

  // Options affecting the normal modules
  module: {
    // A array of automatically applied loaders
    loaders: [
      // JavaScript and JSX
      {
        test: /\.jsx?$/,
        include: [/client/, /server/],
        loader: 'babel',
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
        test: /\.(jpe?g|png|gif|svg(2)?)(\?v=[a-z0-9\.]+)?$/,
        include: /client/,
        loader: 'file?name=images/[name].[ext]',
      },
      // Fonts
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?v=[a-z0-9\.]+)?$/,
        include: /node_modules/,
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
