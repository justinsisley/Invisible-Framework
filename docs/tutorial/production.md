# Production

While IFrame does a lot to optimize the development experience, it also does a lot of heavy lifting to make deployment a breeze.

To run a local production build, just run `npm run prod`. This will use webpack to produce a directory of optimized static assets, and will run your Express.js server in production mode.

IFrame also supports deployment via Docker, and you can produce a __Dockerfile__ and __.dockerignore__ file by running: `npm run docker`.

From there you can build and run the docker container as usual. For example:

```bash
docker build -t my-app .
docker run -p 3325:3325 -d my-app
```

---

Next: [Electron](https://github.com/justinsisley/Invisible-Framework/blob/master/docs/tutorial/electron.md)

Previous: [Tests](https://github.com/justinsisley/Invisible-Framework/blob/master/docs/tutorial/tests.md)
