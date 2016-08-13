const path = require('path');
const cp = require('child_process');
const escapePath = require('../utils/escapePath');

const exec = command => {
  // eslint-disable-next-line
  try { cp.execSync(command); } catch (err) {}
};

// Add Docker-related files
const docker = () => {
  const cwd = escapePath(process.cwd()); // eslint-disable-line
  const templatesDir = escapePath(path.join(__dirname, '../templates'));

  // Add Dockerfile and .dockerignore
  exec(`cp ${templatesDir}/_Dockerfile ${cwd}/Dockerfile`);
  exec(`cp ${templatesDir}/_dockerignore ${cwd}/.dockerignore`);
};

module.exports = docker;
