const jsdom = require('jsdom');
const mocha = require('mocha');
const chai = require('chai');
const localStorage = require('node-localstorage');

// Configure fake DOM
global.navigator = { userAgent: 'node.js' };
global.document = jsdom.jsdom('<body></body>');
global.window = document.defaultView;
global.window.localStorage = localStorage;

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = document.defaultView[property];
  }
});

// Global test helpers
global.describe = mocha.describe;
global.it = mocha.it;
global.assert = chai.assert;
