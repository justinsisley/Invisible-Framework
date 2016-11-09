const path = require('path');
const cp = require('child_process');
const fs = require('fs');
const arrayUniq = require('array-uniq');

const templatesDir = path.join(__dirname, '../templates');

let cwd = process.cwd();
try {
  // When run from npm scripts, this directory will resolve
  fs.readdirSync(path.join(cwd, '/.git'));
} catch (err) {
  // When we run the post-install, we need to traverse up several directories
  cwd = path.join(cwd, '../..');
}

const exec = (command) => {
  try {
    cp.execSync(command);
  } catch (err) {} // eslint-disable-line
};

const readFile = filepath => fs.readFileSync(filepath, { encoding: 'utf8' });

// Add pre-commit hook
const precommit = () => {
  exec(`
    echo "#!/bin/sh" > "${cwd}/.git/hooks/pre-commit" &&
    echo "npm test" >> "${cwd}/.git/hooks/pre-commit"
  `);
};

// Add .gitignore; modify if one exists; create if one doesn't
const gitignore = () => {
  try {
    const existingGitIgnoreData = readFile(`${cwd}/.gitignore`);
    const existingIgnores = existingGitIgnoreData.split('\n');

    const templateGitIgnoreData = readFile(`${templatesDir}/_gitignore`);
    const templateIgnores = templateGitIgnoreData.split('\n');

    const targetIgnores = arrayUniq(templateIgnores.concat(existingIgnores));
    const targetIgnoresData = targetIgnores.join('\n');
    fs.writeFileSync(`${cwd}/.gitignore`, targetIgnoresData);
  } catch (err) {
    exec(`cp "${templatesDir}/_gitignore" "${cwd}/.gitignore"`);
  }
};

// Add .eslintrc without overwriting existing
// TODO: need to be able to patch existing
const eslintrc = () => {
  try {
    readFile(`${cwd}/.eslintrc`);
  } catch (error) {
    exec(`cp "${templatesDir}/_eslintrc" "${cwd}/.eslintrc"`);
  }
};

// Add .stylelintrc without overwriting existing
// TODO: need to be able to patch existing
const stylelintrc = () => {
  try {
    readFile(`${cwd}/.stylelintrc`);
  } catch (error) {
    exec(`cp "${templatesDir}/_stylelintrc" "${cwd}/.stylelintrc"`);
  }
};

// Add .editorconfig without overwriting existing
// TODO: need to be able to patch existing
const editorconfig = () => {
  try {
    readFile(`${cwd}/.editorconfig`);
  } catch (error) {
    exec(`cp "${templatesDir}/_editorconfig" "${cwd}/.editorconfig"`);
  }
};

// Add config.js
const configFile = () => {
  var configJson = {}; // eslint-disable-line
  // If config.js already exists, don't overwrite it
  try {
    configJson = require(`${cwd}/config.js`); // eslint-disable-line
    // TODO: need to be able to patch existing config.js
  } catch (err) {
    // config.js doesn't exist; create it
    const templateConfig = readFile(`${templatesDir}/_config.js`);
    fs.writeFileSync(`${cwd}/config.js`, templateConfig);
  }
};

// Set up npm scripts
const npmScripts = () => {
  try {
    const packageJson = readFile(`${cwd}/package.json`);
    const parsedPackageJson = JSON.parse(packageJson);
    const packageJsonScripts = Object.assign({}, parsedPackageJson.scripts, {
      setup: 'infr --setup',
      clean: 'infr --clean',
      test: 'infr --test',
      'test:watch': 'infr --testWatch',
      e2e: 'infr --e2e',
      build: 'infr --build',
      start: 'infr --start',
      prod: 'infr --prod',
      docker: 'infr --docker',
    });

    parsedPackageJson.scripts = packageJsonScripts;

    fs.writeFileSync(
      `${cwd}/package.json`,
      JSON.stringify(parsedPackageJson, null, 2)
    );
  } catch (err) {} // eslint-disable-line
};

// Basic project setup
const setup = () => {
  precommit();
  gitignore();
  eslintrc();
  stylelintrc();
  editorconfig();
  configFile();
  npmScripts();
};

module.exports = setup;
