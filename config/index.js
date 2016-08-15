const fs = require('fs');
const path = require('path');
const marshall = require('marshall/index');

// Handle .env overrides
const cwd = process.cwd();
const dotEnv = path.join(cwd, './.env');
var env = {}; // eslint-disable-line
try {
  const envContents = fs.readFileSync(dotEnv, { encoding: 'utf8' });
  env = JSON.parse(envContents);
} catch (err) {} // eslint-disable-line

// Configuration schema
const config = marshall({
  port: {
    doc: 'The port to bind',
    format: 'port',
    default: env.PORT || 3325,
    env: 'PORT',
    arg: 'port',
  },
  env: {
    doc: 'The environment',
    format: String,
    default: env.ENV || 'development',
    env: 'ENV',
    arg: 'env',
  },
  api: {
    doc: 'The remote proxy API',
    format: String,
    default: env.API || '',
    env: 'API',
    arg: 'api',
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
    default: env.HTML_TITLE || '',
    env: 'HTML_TITLE',
    arg: 'html-title',
  },
  htmlDescription: {
    doc: 'The title used in the client HTML template',
    format: String,
    default: env.HTML_DESCRIPTION || '',
    env: 'HTML_DESCRIPTION',
    arg: 'html-description',
  },
  favicon: {
    doc: 'The favicon used for the client application',
    format: String,
    default: env.FAVICON || '',
    env: 'FAVICON',
    arg: 'favicon',
  },
});

module.exports = config;
