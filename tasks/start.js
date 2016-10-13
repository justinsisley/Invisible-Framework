const path = require('path');
const nodemon = require('nodemon');

const start = () => {
  const cwd = process.cwd();
  const serverIndex = path.join(__dirname, '../server/index');

  nodemon({
    script: serverIndex,
    watch: ['server/'],
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
