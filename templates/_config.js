module.exports = {
  env: 'development',

  server: {
    port: 3325,
    proxyApi: 'https://jsonplaceholder.typicode.com',
  },

  htmlTemplate: {
    title: 'The Invisible Framework',
    description: 'The Invisible Framework',
    favicon: '',
  },

  webpack: {
    devServerPort: 3326,
    globals: {},
  },
};
