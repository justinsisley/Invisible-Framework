const jsdom = require('jsdom');
const btoa = require('btoa');
const atob = require('atob');
const mocha = require('mocha');
const chai = require('chai');

// Configure fake DOM
global.navigator = { userAgent: 'node.js' };
global.document = jsdom.jsdom('<body></body>');
global.window = document.defaultView;

// Primitives that browser-side code may expect to exist
global.btoa = btoa;
global.atob = atob;

// Mock localStorage implementation
global.window.localStorage = {
  _data: {},
  getItem(key) {
    // eslint-disable-next-line
    return global.window.localStorage._data[key] || null;
  },
  setItem(key, value) {
    // eslint-disable-next-line
    global.window.localStorage._data[key] = value;
  },
};

// Global test helpers
global.describe = mocha.describe;
global.it = mocha.it;
global.assert = chai.assert;
