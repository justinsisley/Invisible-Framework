const path = require('path');
const cp = require('child_process');
const build = require('./build');

const serverIndex = path.join(__dirname, '../server/index');

const prod = () => {
  build();

  cp.execSync(
    `NODE_ENV=production node "${serverIndex}" --env="production"`,
    { stdio: 'inherit' }
  );
};

module.exports = prod;
