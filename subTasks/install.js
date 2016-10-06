const cp = require('child_process');

const install = () => {
  // Install fresh dependencies
  cp.execSync('npm install', { stdio: 'inherit' });
};

module.exports = install;
