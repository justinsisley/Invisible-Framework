const path = require('path');
const cp = require('child_process');
const glob = require('glob');
const escapePath = require('../utils/escapePath');

// Run eslint and execute Mocha tests
// TODO: configurable test file glob
const test = () => {
  const cwd = escapePath(process.cwd());
  const configDir = escapePath(path.join(__dirname, '../config'));
  const npmBin = path.join(cwd, './node_modules/.bin');

  // Keep the output from eslint pure by catching errors thrown by execSync
  try {
    cp.execSync(`
      ${npmBin}/eslint \
        "${cwd}/client/**/*.js" \
        "${cwd}/server/**/*.js"
    `, { stdio: 'inherit' });
  // eslint-disable-next-line
  } catch (err) {
    process.exit(1);
  }

  // Check for existence of test files before attempting to execute
  glob(`${cwd}/?(client|server)/**/test.js`, (error, files) => {
    // No tests exist, we're done
    if (!files.length) { return; }

    // Keep the output from mocha pure by catching errors thrown by execSync
    try {
      cp.execSync(`
        NODE_ENV=test ${npmBin}/babel-istanbul \
          cover ${npmBin}/_mocha -- \
          --compilers .:${configDir}/tests/compiler.js \
          --require ${configDir}/tests/setup.js \
          "${cwd}/?(client|server)/**/test.js"
      `, { stdio: 'inherit' });
    // eslint-disable-next-line
    } catch (err) {
      process.exit(1);
    }
  });
};

module.exports = test;
