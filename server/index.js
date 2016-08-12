const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const proxy = require('proxy-middleware');
const url = require('url');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const localtunnel = require('localtunnel');
const getIp = require('ip');
const serverConfig = require('../config');
const webpackConfig = require('../config/webpack/development');

const API = serverConfig.get('api');
const PORT = serverConfig.get('port');
const ENV = serverConfig.get('env');
const MAX_AGE = serverConfig.get('maxAge');
const LOCALTUNNEL_SUBDOMAIN = serverConfig.get('localtunnelSubdomain');

const devServerDomain = 'http://localhost';
const devServerPort = webpackConfig.webpackDevServerPort;
const devServerHost = `${devServerDomain}:${devServerPort}/`;

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

// Proxy requests to the remote API if one exists
if (API) {
  // Proxy requests to any remote API
  const proxyOptions = url.parse(API);
  proxyOptions.route = '/api/r';
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

// Proxy requests to the local API if one exists
if (localServerExists) {
  // eslint-disable-next-line
  const rootRouter = require(localServerIndex);
  app.use('/api/l', rootRouter);
}

if (ENV === 'development') {
  // Proxy static assets to webpack-dev-server
  app.use('/', proxy(url.parse(devServerHost)));

  const webpackDevServer = new WebpackDevServer(webpack(webpackConfig), {
    stats: 'minimal',
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
  });

  // Start the webpack-dev-server
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
  // Get local IP address
  const ip = getIp.address();

  // Variety is the spice of life
  const localhost = `http://localhost:${PORT}`;
  const localhostIP = `http://127.0.0.1:${PORT}`;
  const localhostNetworkIP = `http://${ip}:${PORT}`;

  // eslint-disable-next-line
  var message = `Application running at:\n${localhost}\n${localhostIP}\n${localhostNetworkIP}`;

  // If running in development mode, use localtunnel.me to create a publicly
  // accessible URL for debugging outside the local network
  if (ENV === 'development') {
    localtunnel(PORT, { subdomain: LOCALTUNNEL_SUBDOMAIN }, (err, tunnel) => {
      if (err) { console.log(`\n${err}\n\n`); } // eslint-disable-line
      if (!err) { message = `${message}\n${tunnel.url}\n`; }

      // eslint-disable-next-line
      console.log(message);
      // eslint-disable-next-line
      console.log(serverConfig.doc());
    });
  } else {
    // eslint-disable-next-line
    console.log(`\n${message}\n`);
    // eslint-disable-next-line
    console.log(serverConfig.doc());
  }
});
