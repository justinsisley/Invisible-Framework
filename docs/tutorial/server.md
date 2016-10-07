# Building the Server

Now that you have a world-class UI, let talk APIs.

IFrame uses both webpack-dev-server and Express.js during development. The Express.js server is also used in production mode to handle the serving and caching of static assets, and to handle any local APIs.

### API Configuration

IFrame provides two API configuration options:

1. A proxy API endpoint, located at __/proxy__, which will proxy all requests to a remote server of your choosing
2. A local API endpoint, located at __/api__, which is handled by the local Express server

This configuration provides flexibility, and allows you to make cross-origin requests to a remote API of your choosing, develop your own local API, or use a combination of the two.

For example, one might point the API proxy to https://some-web-service.com, so a call to `/proxy/users` would resolve to `https://some-web-service.com/users`.

You may also decide to create a new API independent of the API proxy, with a call to `/api/reports/dashboard` resolving to the local Express server, and being handled by your custom route handler.

Let's do both.

Take a look at your __.env__ file. Notice that the "REMOTE_API" key is set to "https://jsonplaceholder.typicode.com". This is our proxy endpoint. We can modify this value to suit our needs, but for demo purposes, we'll leave the default value.

The JSONPlaceholder service provides a mock API for testing purposes, and one of its endpoints is `https://jsonplaceholder.typicode.com/posts`, which returns a list of sample posts. Let's add some UI code to see if a call to `/proxy/posts` returns the same thing.

Using your editor, open __client/index.js__ and replace its contents with the following code:

```javascript
fetch('/proxy/posts')
.then(response => {
  response.json()
  .then(json => {
    console.log('I fetched data from my proxy API!');
    console.log(json);
  });
});
```

Save __client/index.js__, then go back to your browser, open the browser's developer tools to the "Console" view, and refresh the page. You should see your log message and a list of post objects returned from the JSONPlaceholder API.

Congratulations! Without any additional server-side work, you've established a connection to a remote API. No CORS to worry about, and any call that can be made to the remote API can be made to your `/proxy` endpoint.

Now, let's create our own API.

> __NOTE:__ If the `npm start` process is still running, stop it using ctrl+c.

Using the terminal, create a __server__ directory, and a __server/index.js__ file: `mkdir server && touch server/index.js`.

Using your editor, open __server/index.js__ and add the following code:

```javascript
const router = require('express').Router;

// Create a new router
const rootRouter = router();

// Handle GET requests to the /test path
rootRouter.get('/test', (req, res) => {
  const json = { name: 'Local API Test', passed: true };

  res.json(json);
});

module.exports = rootRouter;
```

Save __server/index.js__, then go back to your terminal and run `npm start`. Go back to your browser and refresh the page. Your application should be running.

Now, let's add another fetch to our UI to test our local API.

Using your editor, open __client/index.js__ and add the following code:

```javascript
fetch('/api/test')
.then(response => {
  response.json()
  .then(json => {
    console.log(json);
  });
});
```

Save __client/index.js__, then go back to your browser, open the browser's developer tools to the "Console" view, and refresh the page. You should see the response you hard-coded logged in the developer tools console.

Congratulations! With no server configuration or excess boilerplate, you've created a local API endpoint. You're now in complete control of your application's data sources.

> __NOTE:__ Just like the client, the server only requires one file: __server/index.js__. All other files and folders are up to you. Unlike the client, server files are not parsed by Babel, so your syntax is limited only by the version of Node.js that you're running.

### Status Monitor

IFRAME uses [express-status-monitor](https://github.com/RafalWilinski/express-status-monitor) when running in development mode to provide real-time server metrics. After starting your server with `npm start`, navigate to `http://localhost:3325/_status` to see the express-status-monitor dashboard.

See the [IFrame demo project](https://github.com/justinsisley/Invisible-Framework-demo) for more information.

---

Next: [Tests](https://github.com/justinsisley/Invisible-Framework/blob/master/docs/tutorial/tests.md)

Previous: [Building the Client](https://github.com/justinsisley/Invisible-Framework/blob/master/docs/tutorial/client.md)
