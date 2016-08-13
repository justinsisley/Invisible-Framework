const path = require('path');
const cp = require('child_process');
const escapePath = require('../utils/escapePath');

const build = () => {
  const cwd = escapePath(process.cwd());
  const configDir = escapePath(path.join(__dirname, '../config'));
  const npmBin = path.join(cwd, './node_modules/.bin');

  // Clean
  cp.execSync('rm -rf ./static');

  // Production build
  cp.execSync(`
    NODE_ENV=production ${npmBin}/webpack \
      --display-error-details \
      --config \
      ${configDir}/webpack/production.js
  `, { stdio: 'inherit' });
};

module.exports = build;
