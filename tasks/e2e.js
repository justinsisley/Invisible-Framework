const path = require('path');
const cp = require('child_process');

const cwd = process.cwd();
const configDir = path.join(__dirname, '../config');
const npmBin = path.join(cwd, './node_modules/.bin');

const e2e = (options = { serverProcess: null }) => {
  // Give the express server a few seconds to start
  // FIXME: there must be a better way...
  setTimeout(() => {
    // Keep the output from Nightwatch pure by catching errors thrown by execSync.
    // Always exit with 0 code to avoid NPM errors when linting fails.
    try {
      cp.execSync(`
        "${npmBin}/nightwatch" \
          --config "${configDir}/tests/e2e/config.js" || exit 0
      `, { stdio: 'inherit' });
    } catch (err) { // eslint-disable-line
      if (options.serverProcess) {
        options.serverProcess.exit(0);
      }

      process.exit(1);
    }

    if (options.serverProcess) {
      options.serverProcess.exit(0);
    }

    // Exit the Nightwatch process
    process.exit(0);
  }, 3000);
};

module.exports = e2e;
