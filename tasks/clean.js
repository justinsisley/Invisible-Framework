const path = require('path');
const cp = require('child_process');
const escapePath = require('../utils/escapePath');

// Clean up artifacts and re-install dependencies.
// Checks for new versions of dependencies after install.
const clean = () => {
  const cwd = escapePath(process.cwd());
  const npmBin = escapePath(path.join(cwd, './node_modules/.bin'));

  // Clean up the workspace
  cp.execSync(`rm -rf ${cwd}/node_modules`);
  cp.execSync(`rm -rf ${cwd}/coverage`);
  cp.execSync(`rm -rf ${cwd}/static`);

  // Install fresh dependencies
  cp.execSync('npm install', { stdio: 'inherit' });

  // Check for dependency updates
  cp.execSync(
    `${npmBin}/ncu --packageFile ./package.json`,
    { stdio: 'inherit' }
  );
};

module.exports = clean;
