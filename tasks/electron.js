const path = require('path');
const cp = require('child_process');
const escapePath = require('../utils/escapePath');

const build = () => {
  const cwd = escapePath(process.cwd());
  const electronDir = escapePath(path.join(__dirname, '../electron'));
  const npmBin = path.join(cwd, './node_modules/.bin');

  // Build Electron app (prebuilt)
  cp.execSync(`
    ${npmBin}/electron \
      ${electronDir}/development.js
  `, { stdio: 'inherit' });
};

module.exports = build;
