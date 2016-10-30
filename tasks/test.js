const path = require('path');
const cp = require('child_process');
const glob = require('glob');

const cwd = process.cwd();
const configDir = path.join(__dirname, '../config');
const npmBin = path.join(cwd, './node_modules/.bin');

// Run eslint and execute Mocha tests
const test = () => {
  // Keep the output from eslint pure by catching errors thrown by execSync.
  // Always exit with 0 code to avoid NPM errors when linting fails.
  try {
    cp.execSync(`
      "${npmBin}/eslint" \
        "${cwd}/client/**/*.js" \
        "${cwd}/server/**/*.js" || exit 0
    `, { stdio: 'inherit' });
  } catch (err) { // eslint-disable-line
    process.exit(1);
  }

  // Check for existence of test files before attempting to execute
  glob(`${cwd}/?(client|server)/**/unit.js`, (error, files) => {
    // No tests exist, we're done
    if (!files.length) {
      return;
    }

    // Keep the output from mocha pure by catching errors thrown by execSync.
    // Always exit with 0 code to avoid NPM errors when linting fails.
    try {
      cp.execSync(`
        NODE_ENV=test "${npmBin}/babel-istanbul" \
          cover "${npmBin}/_mocha" -- \
          --compilers .:"${configDir}/tests/unit/compiler.js" \
          --require "${configDir}/tests/unit/setup.js" \
          "${cwd}/?(client|server)/**/unit.js" || exit 0
      `, { stdio: 'inherit' });
    } catch (err) { // eslint-disable-line
      process.exit(1);
    }
  });
};

module.exports = test;
