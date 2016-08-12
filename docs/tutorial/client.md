# Building the Client

With IFrame configured, let's start adding some UI code. In this tutorial, you'll need your terminal and a text editor.

1. Start by creating a __client__ directory at the root of your project: `mkdir client`. IFrame expects your UI code to live in this directory.
2. Create the only required file, __index.js__, which is the JavaScript entry point for your application: `touch client/index.js`

Before we modify __client/index.js__, let's start the webpack dev server and Express API server. From your terminal, run: `npm start`.

> __NOTE:__ If you haven't already, take a moment to look at your project's __package.json__ file. IFrame has automatically added its commands to your npm scripts.

With your webpack and Express servers running, let's open up the default application URL in your browser. Open a browser and navigate to http://localhost:3325. Behold the blank screen.

Now, using your editor, open __client/index.js__ and add the following code:

```javascript
alert('I am alive');
```

Save __client/index.js__, then go back to your browser and refresh the page. You should see your alert. Congratulations! You just created a web application!

All files in the __client__ directory are processed by Babel via webpack, and supports ES6 (including modules), JSX, CSS, JSON, images, and fonts. IFrame doesn't care how you structure your files and folders within the __client__ directory. The only required file is your entry point: __client/index.js__.

See the [IFrame demo project](https://github.com/justinsisley/Invisible-Framework-demo) for more information.

---

Next: [Building the Server](https://github.com/justinsisley/Invisible-Framework/blob/master/docs/tutorial/server.md)

Previous: [Installation and Setup](https://github.com/justinsisley/Invisible-Framework/blob/master/docs/tutorial/installation.md)
