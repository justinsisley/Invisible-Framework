const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const escapePath = require('../utils/escapePath');

const cwd = process.cwd();
const hostPackage = path.join(cwd, './package.json');

const packageRaw = fs.readFileSync(hostPackage, { encoding: 'utf8' });
const packageJSON = JSON.parse(packageRaw);
const iframeCmd = escapePath(path.join(__dirname, '../../../node_modules/.bin/iframe'));

// If the package.json file has an _id property, IFrame is being installed as a
// dependency, and we should run the postinstall script.
// eslint-disable-next-line
if (packageJSON._id) {
  cp.execSync(`${iframeCmd} --setup`);
}
