const path = require('path');
const cp = require('child_process');
const glob = require('glob');

const cwd = process.cwd();
const configDir = path.join(__dirname, '../config');
const npmBin = path.join(cwd, './node_modules/.bin');

// Run Mocha tests on every code change
// TODO: configurable test file glob
const testWatch = () => {
  // Check for existence of test files before attempting to execute
  glob(`${cwd}/?(client|server)/**/unit.js`, (error, files) => {
    // No tests exist, we're done
    if (!files.length) { return; }

    // Keep the output from mocha pure by catching errors thrown by execSync
    try {
      cp.execSync(`
        NODE_ENV=test "${npmBin}/_mocha" \
          --watch \
          --compilers .:"${configDir}/tests/unit/compiler.js" \
          --require "${configDir}/tests/unit/setup.js" \
          "${cwd}/?(client|server)/**/unit.js"
      `, { stdio: 'inherit' });
    // eslint-disable-next-line
    } catch (err) {
      process.exit(1);
    }
  });
};

module.exports = testWatch;
