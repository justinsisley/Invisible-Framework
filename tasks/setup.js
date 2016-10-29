const path = require('path');
const cp = require('child_process');
const fs = require('fs');

const exec = (command) => {
  try {
    cp.execSync(command);
  } catch (err) {} // eslint-disable-line
};

const readFile = filepath => fs.readFileSync(filepath, { encoding: 'utf8' });

function unique(array) {
  var a = array.concat(); // eslint-disable-line

  // eslint-disable-next-line
  for (var i = 0; i < a.length; ++i) {
    // eslint-disable-next-line
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) {
        a.splice(j--, 1); // eslint-disable-line
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
    fs.readdirSync(path.join(cwd, '/.git'));
  } catch (err) {
    // When we run the post-install, we need to traverse up several directories
    cwd = path.join(cwd, '../..');
  }

  const templatesDir = path.join(__dirname, '../templates');

  // Add pre-commit hook
  exec(`
    echo "#!/bin/sh" > "${cwd}/.git/hooks/pre-commit" &&
    echo "npm test" >> "${cwd}/.git/hooks/pre-commit"
  `);

  // Add .gitignore; modify if one exists; create if one doesn't
  try {
    const existingGitIgnoreData = readFile(`${cwd}/.gitignore`);
    const existingIgnores = existingGitIgnoreData.split('\n');

    const templateGitIgnoreData = readFile(`${templatesDir}/_gitignore`);
    const templateIgnores = templateGitIgnoreData.split('\n');

    const targetIgnores = unique(templateIgnores.concat(existingIgnores));
    const targetIgnoresData = targetIgnores.join('\n');
    fs.writeFileSync(`${cwd}/.gitignore`, targetIgnoresData);
  } catch (err) {
    exec(`cp "${templatesDir}/_gitignore" "${cwd}/.gitignore"`);
  }

  // Add .eslintrc without overwriting existing
  // TODO: need to be able to patch existing
  try {
    readFile(`${cwd}/.eslintrc`);
  } catch (error) {
    exec(`cp "${templatesDir}/_eslintrc" "${cwd}/.eslintrc"`);
  }

  // Add .stylelintrc without overwriting existing
  // TODO: need to be able to patch existing
  try {
    readFile(`${cwd}/.stylelintrc`);
  } catch (error) {
    exec(`cp "${templatesDir}/_stylelintrc" "${cwd}/.stylelintrc"`);
  }

  // Add .editorconfig without overwriting existing
  // TODO: need to be able to patch existing
  try {
    readFile(`${cwd}/.editorconfig`);
  } catch (error) {
    exec(`cp "${templatesDir}/_editorconfig" "${cwd}/.editorconfig"`);
  }

  // Add config.js
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

  // Set up npm scripts
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

module.exports = setup;
