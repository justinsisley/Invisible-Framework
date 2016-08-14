const path = require('path');
const cp = require('child_process');
const fs = require('fs');
const escapePath = require('../utils/escapePath');

const exec = command => {
  // eslint-disable-next-line
  try { cp.execSync(command); } catch (err) {}
};

const readFile = filepath => fs.readFileSync(filepath, { encoding: 'utf8' });

function unique(array) {
  var a = array.concat(); // eslint-disable-line

  // eslint-disable-next-line
  for (var i = 0; i < a.length; ++i) {
    // eslint-disable-next-line
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) {
        a.splice(j--, 1);
      }
    }
  }

  return a;
}

// Basic project setup
const setup = () => {
  var cwd = process.cwd(); // eslint-disable-line
  try {
    // When run from npm scripts, this directory will resolve
    fs.readdirSync(escapePath(path.join(cwd, '/.git')));
  } catch (err) {
    // When we run the post-install, we need to traverse up several directories
    cwd = path.join(cwd, '../..');
  }

  const templatesDir = path.join(__dirname, '../templates');

  // Add pre-commit hook
  exec(`
    echo "#!/bin/sh" > ${escapePath(cwd)}/.git/hooks/pre-commit &&
    echo "npm test" >> ${escapePath(cwd)}/.git/hooks/pre-commit
  `);

  // Add .gitignore; modify if one exists; create if one doesn't
  try {
    const existingGitIgnoreData = readFile(`${escapePath(cwd)}/.gitignore`);
    const existingIgnores = existingGitIgnoreData.split('\n');

    const templateGitIgnoreData = readFile(`${templatesDir}/_gitignore`);
    const templateIgnores = templateGitIgnoreData.split('\n');

    const targetIgnores = unique(templateIgnores.concat(existingIgnores));
    const targetIgnoresData = targetIgnores.join('\n');
    fs.writeFileSync(`${escapePath(cwd)}/.gitignore`, targetIgnoresData);
  } catch (err) {
    exec(`cp ${escapePath(templatesDir)}/_gitignore ${escapePath(cwd)}/.gitignore`);
  }

  // Add .eslintrc
  exec(`cp ${escapePath(templatesDir)}/_eslintrc ${escapePath(cwd)}/.eslintrc`);

  // Add .editorconfig
  exec(`cp ${escapePath(templatesDir)}/_editorconfig ${escapePath(cwd)}/.editorconfig`);

  // Add .env
  var envJson = {}; // eslint-disable-line
  var envTemplateJson = {}; // eslint-disable-line
  var shouldWriteEnv = true; // eslint-disable-line
  try {
    const existingEnv = readFile(`${cwd}/.env`);
    envJson = JSON.parse(existingEnv);
  } catch (err) {
    if (!err.code) {
      shouldWriteEnv = false;
      console.log('Malformed .env\n'); // eslint-disable-line
    }
  } // eslint-disable-line

  try {
    const templateEnv = readFile(`${templatesDir}/_env`);
    envTemplateJson = JSON.parse(templateEnv);
  } catch (err) {} // eslint-disable-line

  if (shouldWriteEnv) {
    fs.writeFileSync(`${cwd}/.env`, JSON.stringify(
      Object.assign({}, envTemplateJson, envJson),
      null,
      2
    ));
  }

  // Set up npm scripts
  try {
    const packageJson = readFile(`${escapePath(cwd)}/package.json`);
    const parsedPackageJson = JSON.parse(packageJson);
    const packageJsonScripts = Object.assign({}, parsedPackageJson.scripts, {
      setup: 'iframe --setup',
      clean: 'iframe --clean',
      test: 'iframe --test',
      build: 'iframe --build',
      start: 'iframe --start',
      prod: 'iframe --prod',
      docker: 'iframe --docker',
      electron: 'iframe --electron',
    });

    parsedPackageJson.scripts = packageJsonScripts;

    fs.writeFileSync(
      `${cwd}/package.json`,
      JSON.stringify(parsedPackageJson, null, 2)
    );
  } catch (err) {} // eslint-disable-line
};

module.exports = setup;
