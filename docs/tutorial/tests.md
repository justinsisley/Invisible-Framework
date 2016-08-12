# Tests

One of IFrame's strengths is how easy it makes writing and running tests.

> __NOTE:__ If the `npm start` process is still running, stop it using ctrl+c.

### ESLint

Let's make ESLint do some work. Using your editor, open __client/index.js__ and add the following code:

```javascript
console.log('unexpected console statement');
```

Save __client/index.js__, then go back to your terminal and run: `npm test`. ESlint should complain, because your code is failing the code style check. Fix the problems and run `npm test` again, and you should see that ESLint no longer complains.

### Unit Tests

IFrame has support for Mocha, Chai, and Istanbul baked in, and it will find all files named __test.js__ and execute them.

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

---

Next: [Production Build](https://github.com/justinsisley/Invisible-Framework/blob/master/docs/tutorial/production.md)

Previous: [Building the Server](https://github.com/justinsisley/Invisible-Framework/blob/master/docs/tutorial/server.md)
