const path = require('path');
const cp = require('child_process');

const cwd = process.cwd();
const configDir = path.join(__dirname, '../config');
const npmBin = path.join(cwd, './node_modules/.bin');

// Production build
const build = (config = { silent: false }) => {
  cp.execSync(`
    rm -rf ${cwd}/static &&
    NODE_ENV=production "${npmBin}/webpack" \
      --display-error-details \
      --config \
      "${configDir}/webpack/production.js"
  `, { stdio: config.silent ? 'ignore' : 'inherit' });
};

module.exports = build;
