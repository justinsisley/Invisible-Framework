const cp = require('child_process');

const cwd = process.cwd();

// Clean up artifacts and re-install dependencies.
// Checks for new versions of dependencies after install.
const clean = () => {
  // Clean up the workspace
  cp.execSync(`rm -rf "${cwd}/node_modules"`);
  cp.execSync(`rm -rf "${cwd}/coverage"`);
  cp.execSync(`rm -rf "${cwd}/static"`);

  // Install fresh dependencies
  cp.execSync('npm install', { stdio: 'inherit' });
};

module.exports = clean;
