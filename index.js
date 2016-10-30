#!/usr/bin/env node

const argv = require('yargs').argv;
const setup = require('./tasks/setup');
const test = require('./tasks/test');
const testWatch = require('./tasks/testWatch');
const e2e = require('./tasks/e2e');
const clean = require('./tasks/clean');
const install = require('./tasks/install');
const build = require('./tasks/build');
const startDev = require('./tasks/startDev');
const startProd = require('./tasks/startProd');
const docker = require('./tasks/docker');

if (argv.setup) {
  setup();
}

if (argv.test) {
  test();
}

if (argv.testWatch) {
  testWatch();
}

if (argv.e2e) {
  build({ silent: true });
  const prod = startProd({ async: true });
  e2e({ serverProcess: prod });
}

if (argv.clean) {
  clean();
  install();
}

if (argv.build) {
  build();
}

if (argv.start) {
  startDev();
}

if (argv.prod) {
  build();
  startProd();
}

if (argv.docker) {
  docker();
}
