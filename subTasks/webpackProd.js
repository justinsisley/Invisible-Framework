const path = require('path');
const cp = require('child_process');
const escapePath = require('../utils/escapePath');

const cwd = escapePath(process.cwd());
const configDir = escapePath(path.join(__dirname, '../config'));
const npmBin = path.join(cwd, './node_modules/.bin');

const build = () => {
  // Production build
  cp.execSync(`
    NODE_ENV=production ${npmBin}/webpack \
      --display-error-details \
      --config \
      ${configDir}/webpack/production.js
  `, { stdio: 'inherit' });
};

module.exports = build;
