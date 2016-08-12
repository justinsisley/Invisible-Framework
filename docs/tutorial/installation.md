# Installation and Setup

In this step, you'll start with an empty directory, then create the basic files required for a IFrame application. You'll only need your terminal.

1. From a starting location of your choosing, create a new project directory: `mkdir my-project && cd my-project`
2. Initialize a Git repository: `git init`
2. Initialize an NPM repository: `npm init -y`
3. Install the IFrame cli: `npm i -D invisible-framework`

When the installation completes, take a look at the contents of your project directory. You should see the standard __node_modules__ directory, and you should see a few files that IFrame has generated for you: __.babelrc__, __.editorconfig__, __.eslintrc__, and __.gitignore__. These files represent the basic project configuration for Babel, ESLint, Git, and your editor.

> __NOTE:__ Do not manually edit __.babelrc__, __.editorconfig__, __.eslintrc__, or __.gitignore__ . These are managed by IFrame, and any local modifications will be overwritten. Changes to these configuration files should be done within the framework itself.

### Environment Configuration

A special environment configuration file named __.env__ is also created. This file is ignored by Git, and allows you to customize your development environment.

When created for the first time, __.env__ will contain default values for all of IFrame's configurable properties. Local modifications to this file will *NOT* be overwritten. IFrame is capable of adding more configurable properties as they become available, and will non-destructively patch the local __.env__ as needed.

Now that IFrame is configured, it's time to build your application.

---

Next: [Building the Client](https://github.com/justinsisley/Invisible-Framework/blob/master/docs/tutorial/client.md)

Previous: [Introduction](https://github.com/justinsisley/Invisible-Framework/blob/master/docs/tutorial/introduction.md)
