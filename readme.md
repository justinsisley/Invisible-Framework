# The Invisible Framework

The best way to get started with the Invisible Framework is by trying out the [demo application](https://github.com/justinsisley/Invisible-Framework-demo).

## Introduction

The Invisible Framework and its cli (command line interface) are designed to get you from empty directory to production environment in a matter of seconds.

This tutorial will walk you through the creation, testing, and deployment of a new the Invisible Framework application.

The Invisible Framework requires __Node.js__ v6+ and __NPM__ v3+.

## Installation and Setup

In this step, you'll start with an empty directory, then create the basic files required for a the Invisible Framework application. You'll only need your terminal.

1. From a starting location of your choosing, create a new project directory: `mkdir my-project && cd my-project`
2. Initialize a Git repository: `git init`
2. Initialize an NPM repository: `npm init -y`
3. Install the the Invisible Framework cli: `npm i -D invisible-framework`

When the installation completes, take a look at the contents of your project directory. You should see the standard __node_modules__ directory, and you should see a few files that the Invisible Framework has generated for you: __.babelrc__, __.editorconfig__, __.eslintrc__, and __.gitignore__. These files represent the basic project configuration for Babel, ESLint, Git, and your editor.

> __NOTE:__ Do not manually edit __.babelrc__, __.editorconfig__, __.eslintrc__, or __.gitignore__ . These are managed by the Invisible Framework, and any local modifications will be overwritten. Changes to these configuration files should be done within the framework itself.

### Environment Configuration

A special environment configuration file named __config.js__ is also created.

When created for the first time, __config.js__ will contain default values for all of the Invisible Framework's configurable properties. The Invisible Framework is also capable of adding more configurable properties as they become available, and will non-destructively patch the local __config.js__ file as needed.

Now that the Invisible Framework is configured, it's time to build your application.

## Building the Client

With the Invisible Framework configured, let's start adding some UI code. In this tutorial, you'll need your terminal and a text editor.

1. Start by creating a __client__ directory at the root of your project: `mkdir client`. The Invisible Framework expects your UI code to live in this directory.
2. Create the only required file, __index.js__, which is the JavaScript entry point for your application: `touch client/index.js`

Before we modify __client/index.js__, let's start the webpack dev server and Express API server. From your terminal, run: `npm start`.

> __NOTE:__ If you haven't already, take a moment to look at your project's __package.json__ file. The Invisible Framework has automatically added its commands to your npm scripts.

With your webpack and Express servers running, let's open up the default application URL in your browser. Open a browser and navigate to http://localhost:3325. Behold the blank screen.

Now, using your editor, open __client/index.js__ and add the following code:

```javascript
console.log('I am alive');
```

Save __client/index.js__, then go back to your browser. You should see your logged message in the browser developer tools console. Congratulations! You just created a web application!

All files in the __client__ directory are processed by Babel via webpack, and supports ES6 (including modules), JSX, CSS, JSON, images, and fonts. The Invisible Framework doesn't care how you structure your files and folders within the __client__ directory. The only required file is your entry point: __client/index.js__.

See the [the Invisible Framework demo project](https://github.com/justinsisley/Invisible-Framework-demo) for more information.

## Building the Server

Now that you have a world-class UI, let talk APIs.

The Invisible Framework uses both webpack-dev-server and Express.js during development. The Express.js server is also used in production mode to handle the serving and caching of static assets, and to handle any local APIs.

### API Configuration

The Invisible Framework provides two API configuration options:

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

See the [the Invisible Framework demo project](https://github.com/justinsisley/Invisible-Framework-demo) for more information.

## Tests

One of the Invisible Framework's strengths is how easy it makes writing and running tests.

> __NOTE:__ If the `npm start` process is still running, stop it using ctrl+c.

### ESLint

Let's make ESLint do some work. Using your editor, open __client/index.js__ and add the following code:

```javascript
console.log('unexpected console statement');
```

Save __client/index.js__, then go back to your terminal and run: `npm test`. ESlint should complain, because your code is failing the code style check. Fix the problems and run `npm test` again, and you should see that ESLint no longer complains.

### Unit Tests

The Invisible Framework has support for Mocha, Chai, and Istanbul baked in, and it will find all files named __test.js__ and execute them.

Let's create a sample test. Using your terminal, create a test file: `touch client/test.js`.

Using your editor, open __client/test.js__ and add the following code:

```javascript
describe('test', () => {
  it('passes', () => {
    assert.isTrue(true);
  });

  it('fails', () => {
    assert.isTrue(false);
  });
});

```

Save __client/test.js__, then go back to your terminal and run: `npm test`. You should see the output of the test results. A __coverage__ directory will also be created, with test coverage reporting provided by Istanbul.

> Notice that you didn't need to import `describe`, `it`, or `assert`. Mocha's `describe` and `it`, and Chai's `assert` methods are globally available in all of your tests.

Congratulations! You've created your first unit test without having to worry about any configuration or complex setup.

## Production

While the Invisible Framework does a lot to optimize the development experience, it also does a lot of heavy lifting to make deployment a breeze.

To run a local production build, just run `npm run prod`. This will use webpack to produce a directory of optimized static assets, and will run your Express.js server in production mode.

The Invisible Framework also supports deployment via Docker, and you can produce a __Dockerfile__ and __.dockerignore__ file by running: `npm run docker`.

From there you can build and run the docker container as usual. For example:

```bash
docker build -t my-app .
docker run -p 3325:3325 -d my-app
```