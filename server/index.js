const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const proxy = require('proxy-middleware');
const url = require('url');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const getIp = require('ip');
const config = require('../config');
const webpackConfig = require('../config/webpack/development');

// Configurable values
const ENV = config.get('env');
const PORT = config.get('port');
const PROXY_API = config.get('proxyApi');
const MAX_AGE = config.get('maxAge');

// Dev server hostname
const devServerDomain = 'http://localhost';
const devServerPort = webpackConfig.webpackDevServerPort;
const devServerHost = `${devServerDomain}:${devServerPort}/`;

// Get local IP address
const ip = getIp.address();

// Various references to this local server
const localhost = `http://localhost:${PORT}`;
const localhostIP = `http://127.0.0.1:${PORT}`;
const localhostNetworkIP = `http://${ip}:${PORT}`;

// References to important directories
const cwd = process.cwd();
const staticDir = path.join(cwd, './static');

// Create the Express server
const app = express();

// Logging middleware
app.use(morgan(ENV === 'development' ? 'dev' : 'combined'));
// Helmet middleware gives us some basic best-practice security
app.use(helmet());
// Gzip responses
app.use(compression());
// Parse JSON in request body
app.use(bodyParser.json());
// Validation/sanitization
app.use(expressValidator());

// Proxy requests to the remote API if one exists
if (PROXY_API) {
  // Proxy requests to any remote API
  const proxyOptions = url.parse(PROXY_API);
  proxyOptions.route = '/proxy';
  proxyOptions.rejectUnauthorized = false;
  app.use(proxy(proxyOptions));
}

// Determine if a local server exists
const localServerIndex = path.join(cwd, './server/index.js');
var localServerExists = false; // eslint-disable-line
try {
  fs.lstatSync(localServerIndex);
  localServerExists = true;
} catch (err) {} // eslint-disable-line

// Proxy requests to the local API if one exists. We're intentionally keeping
// our routes out of the try/catch, above, because we want developers' server
// code to throw errors as expected.
if (localServerExists) {
  // eslint-disable-next-line
  const rootRouter = require(localServerIndex);
  app.use('/api', rootRouter);
}

// Determine if a local middleware file exists
const localMiddleware = path.join(cwd, './server/middleware.js');
var localMiddlewareExists = false; // eslint-disable-line
try {
  fs.lstatSync(localMiddleware);
  localMiddlewareExists = true;
} catch (err) {} // eslint-disable-line

// Pass the Express app to the user's custom middleware function. This allows
// the user to apply any middleware they like without having to modify the
// server entry point. Again, we're keeping this out of the try/catch (above)
// so we can maintain standard error behavior.
if (localMiddlewareExists) {
  // eslint-disable-next-line
  const runMiddleware = require(localMiddleware);

  if (typeof runMiddleware === 'function') {
    runMiddleware(app);
  } else {
    throw new Error('Custom middleware file must export a single function.');
  }
}

if (ENV === 'development') {
  // Proxy static assets to webpack-dev-server
  app.use('/', proxy(url.parse(devServerHost)));

  // Create new webpack dev server with hot reloading enabled
  const webpackDevServer = new WebpackDevServer(webpack(webpackConfig), {
    stats: 'minimal',
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
  });

  // Start the webpack dev server
  webpackDevServer.listen(devServerPort);
} else {
  // Proxy static assets to the local static directory and cache them
  app.use('/', express.static(staticDir, {
    maxAge: MAX_AGE,
  }));

  // All unhandled routes are served the static index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.join(cwd, './static/index.html'));
  });
}

// Start the Express server
app.listen(PORT, () => {
  // eslint-disable-next-line
  var message = `\nApplication running at:\n${localhost}\n${localhostIP}\n${localhostNetworkIP}\n`;

  // eslint-disable-next-line
  console.log(message);
  // eslint-disable-next-line
  console.log(config.doc());
});
