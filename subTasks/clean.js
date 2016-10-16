const cp = require('child_process');

const cwd = process.cwd();

const artifacts = [
  'node_modules',
  'coverage',
  'static',
];

// Clean up artifacts and re-install dependencies.
// Checks for new versions of dependencies after install.
const clean = () => {
  // Clean up the workspace
  artifacts.forEach((artifact) => {
    cp.execSync(`rm -rf "${cwd}/${artifact}"`);
  });
};

module.exports = clean;
