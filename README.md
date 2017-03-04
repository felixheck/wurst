![wurst logo](https://raw.githubusercontent.com/felixheck/wurst/master/wurst.png)
#### Directory based autoloader for hapi.js routes

[![Travis](https://img.shields.io/travis/felixheck/wurst.svg)](https://travis-ci.org/felixheck/wurst/builds/) ![node](https://img.shields.io/node/v/wurst.svg) ![npm](https://img.shields.io/npm/dt/wurst.svg) [![standard](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/) ![npm](https://img.shields.io/npm/l/wurst.svg)
---

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Example](#example)
5. [Testing](#testing)
6. [Contribution](#contribution)
7. [License](#license)

## Introduction
**wurst** is a directory based autoloader for [hapi.js](https://github.com/hapijs/hapi) routes. Just set up your desired directory structure, export your route files, register the plugin and get your final prefixed routes based on the provided directory structure. For example it is perfect for manage the various versions of your API. *wurst* is the German translation for *sausage* - just throw anything in a pot and in the end you'll be satisfied ;-)

This plugin is implemented in ECMAScript 6 without any transpilers like `babel`.<br>
Additionally `standard` and `tape` are used to grant a high quality implementation.

## Installation
For installation use the [Node Package Manager](https://github.com/npm/npm):
```
$ npm install --save wurst
```

or clone the repository:
```
$ git clone https://github.com/felixheck/wurst
```

Alternatively use the [Yarn Package Manager](https://yarnpkg.com):
```
$ yarn add wurst
```

## Usage
#### Import
First you have to import the module:
``` js
const wurst = require('wurst');
```

#### Create hapi server
Afterwards create your hapi server and the corresponding connection if not already done:
``` js
const server = new Hapi.Server();

server.connection({
  port: 8888,
  host: 'localhost',
});
```

#### Registration
Finally register the plugin and set the correct options:
``` js
server.register({
  register: wurst,
  options: {
    ignore: 'foo/**/*.js',
    cwd: path.join(__dirname, 'routes'),
    log: true
  },
}, function(err) {
  if (err) {
    throw err;
  }
});
```

It is possible to register the plugin many times, but it is suggested to use `options.cwd`/`options.routes` which are not nested in each other.

#### Options
- **routes**: `string`<br/>
Optional. Default: `**/*.js`<br/>
The [glob](https://github.com/isaacs/node-glob#glob-primer) pattern to select route files.

- **ignore**: `string | Array.<?string>`<br/>
Optional.<br/>
The [glob](https://github.com/isaacs/node-glob#glob-primer) pattern or an array of patterns to exclude route files.

- **cwd**: `string`<br/>
Optional. Default: `process.cwd()`<br/>
The absolute path to the current working directory in which to search. Subdirectories will be prefixes.

- **log**: `boolean`<br/>
Optional. Default: `false`<br/>
If `true`, the plugin logs the prefixed routes into console.<br/>
For example:

```
Wurst prefixed the following routes
  [GET]   /foo/bar/foobar
  [POST]  /foo/foo
```

## Example
The following file structure is the base of this example:
```
src/
..routes/
....routes.js
....bar/
......routes.js
......foo/
........routes.js
..index.js
```

The route files `**/routes.js` have to provide a single [route object](http://hapijs.com/api#route-configuration) or a list of route objects via `module.exports` and could look like:
``` js
const routes = [
  {
    method: 'GET',
    path: '/',
    handler(request, reply) {
        reply('foo');
    }
  },
  {
    method: 'GET',
    path: '/42',
    handler(request, reply) {
        reply('42');
    }
  }
];

module.exports = routes;
```

After starting the server the following routes are available. Trailing slashes - excepted at `/` - will be removed automatically.

```
[GET] /
[GET] /42

[GET] /bar
[GET] /bar/42

[GET] /bar/foo
[GET] /bar/foo/42
```

## Testing
First you have to install all dependencies:
```
$ npm install
```

To execute all unit tests once, use:
```
$ npm test
```

or to run tests based on file watcher, use:
```
$ npm start
```

To get information about the test coverage, use:
```
$ npm run coverage
```

## Contribution
Fork this repository and push in your ideas.

Do not forget to add corresponding tests to keep up 100% test coverage.

## License
The MIT License

Copyright (c) 2016-2017 Felix Heck

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
