const path = require('path');
const marshall = require('marshall/index');

// Handle config.js overrides
const cwd = process.cwd();
const projectConfigPath = path.join(cwd, './config.js');
const projectConfig = require(projectConfigPath); // eslint-disable-line

// Configuration schema
const config = marshall({
  port: {
    doc: 'The port to bind',
    format: 'port',
    default: (projectConfig.server && projectConfig.server.port) || 3325,
    env: 'PORT',
    arg: 'port',
  },
  webpackDevServerPort: {
    doc: 'The Webpack Dev Server port to bind',
    format: 'port',
    default: (projectConfig.webpack && projectConfig.webpack.devServerPort) || 3326,
    env: 'WEBPACK_DEV_SERVER_PORT',
    arg: 'webpackDevServerPort',
  },
  env: {
    doc: 'The environment',
    format: String,
    default: projectConfig.env || 'development',
    env: 'ENV',
    arg: 'env',
  },
  proxyApi: {
    doc: 'The remote API to proxy to',
    format: String,
    default: (projectConfig.server && projectConfig.server.proxyApi) || '',
    env: 'PROXY_API',
    arg: 'proxy-api',
  },
  maxAge: {
    doc: 'Length of time to cache static assets in production mode',
    format: 'nat',
    default: 1000 * 60 * 60 * 24 * 60, // 60 days
    env: 'CACHE_MAX_AGE',
    arg: 'cache-max-age',
  },
  htmlTitle: {
    doc: 'The title used in the client HTML template',
    format: String,
    default: projectConfig.htmlTemplate.title || '',
    env: 'HTML_TITLE',
    arg: 'html-title',
  },
  htmlDescription: {
    doc: 'The description used in the client HTML template',
    format: String,
    default: projectConfig.htmlTemplate.description || '',
    env: 'HTML_DESCRIPTION',
    arg: 'html-description',
  },
  favicon: {
    doc: 'The favicon used for the client application',
    format: String,
    default: projectConfig.htmlTemplate.favicon || '',
    env: 'FAVICON',
    arg: 'favicon',
  },
});

module.exports = config;
