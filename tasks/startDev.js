const path = require('path');
const nodemon = require('nodemon');

const cwd = process.cwd();
const serverIndex = path.join(__dirname, '../server/index');

const start = () => {
  nodemon({
    script: serverIndex,
    watch: ['server/'],
    exec: 'node --inspect',
  });

  nodemon
  .on('quit', () => {
    process.exit(0);
  })
  .on('restart', (files) => {
    const fileList = files.map((file) => {
      const shortPath = file.replace(cwd, '');
      return `\n${shortPath}`;
    });

    // eslint-disable-next-line
    console.log(`\nApp restarted due to change in:${fileList}\n`);
  });
};

module.exports = start;
