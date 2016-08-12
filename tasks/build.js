const path = require('path');
const cp = require('child_process');

const build = () => {
  const cwd = process.cwd();
  const configDir = path.join(__dirname, '../config');
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
