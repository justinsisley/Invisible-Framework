const chromedriver = require('chromedriver');

const cwd = process.cwd();

module.exports = {
  src_folders: `${cwd}/client`,
  output_folder: `${cwd}/reports`,

  selenium: {
    start_process: false,
  },

  test_settings: {
    default: {
      selenium_port: 9515,
      selenium_host: 'localhost',

      default_path_prefix: '',

      filter: '**/e2e.js',

      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['--no-sandbox'],
        },
        acceptSslCerts: true,
      },

      globals: {
        before(done) {
          chromedriver.start();

          done();
        },

        after(done) {
          chromedriver.stop();

          done();
        },
      },
    },
  },
};
