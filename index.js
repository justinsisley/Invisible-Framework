#!/usr/bin/env node

const argv = require('yargs').argv;
const setup = require('./tasks/setup');
const test = require('./tasks/test');
const clean = require('./tasks/clean');
const build = require('./tasks/build');
const start = require('./tasks/start');
const prod = require('./tasks/prod');
const docker = require('./tasks/docker');

if (argv.setup) { setup(); }
if (argv.test) { test(); }
if (argv.clean) { clean(); }
if (argv.build) { build(); }
if (argv.start) { start(); }
if (argv.prod) { prod(); }
if (argv.docker) { docker(); }
