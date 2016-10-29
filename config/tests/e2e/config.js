const chromedriver = require('chromedriver');
// const glob = require('glob');

module.exports = {
  src_folders: [], // use glob to search for all folders with e2e
  output_folder: 'reports',

  selenium: {
    start_process: false,
  },

  test_settings: {
    default: {
      selenium_port: 9515,
      selenium_host: 'localhost',
      default_path_prefix: '',

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
