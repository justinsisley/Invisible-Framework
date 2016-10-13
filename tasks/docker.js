const path = require('path');
const cp = require('child_process');

const exec = (command) => {
  try {
    cp.execSync(command);
  } catch (err) {} // eslint-disable-line
};

// Add Docker-related files
const docker = () => {
  const cwd = process.cwd(); // eslint-disable-line
  const templatesDir = path.join(__dirname, '../templates');

  // Add Dockerfile and .dockerignore
  exec(`cp "${templatesDir}/_Dockerfile" "${cwd}/Dockerfile"`);
  exec(`cp "${templatesDir}/_dockerignore" "${cwd}/.dockerignore"`);
};

module.exports = docker;
