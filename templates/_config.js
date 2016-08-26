module.exports = {
  env: 'development',
  port: 3325,

  remoteApi: 'https://jsonplaceholder.typicode.com',

  html: {
    title: 'The Invisible Framework',
    description: 'The Invisible Framework',
    favicon: '',
  },

  webpack: {
    globals: {
      $: 'jquery',
      jQuery: 'jquery',
    },
  },
};
