// Escape spaces in a path
module.exports = path => path.replace(/([ ])/g, '\\$1');
