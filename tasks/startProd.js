const path = require('path');
const cp = require('child_process');

const serverIndex = path.join(__dirname, '../server/index');

const prod = (options = { async: false }) => {
  let exec = cp.execSync;

  if (options.async) {
    exec = cp.exec;
  }

  exec(
    `NODE_ENV=production node "${serverIndex}" --env="production"`,
    { stdio: 'inherit' }
  );
};

module.exports = prod;
