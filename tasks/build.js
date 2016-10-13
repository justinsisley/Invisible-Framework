const path = require('path');
const cp = require('child_process');

const cwd = process.cwd();
const configPath = path.join(__dirname, '../config');
const npmBin = path.join(cwd, './node_modules/.bin');

const build = () => {
  // Clean
  cp.execSync('rm -rf ./static');

  // Production build
  cp.execSync(`
    NODE_ENV=production "${npmBin}/webpack" \
      --display-error-details \
      --config \
      "${configPath}/webpack/production.js"
  `, { stdio: 'inherit' });
};

module.exports = build;
