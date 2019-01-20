![wurst logo](https://raw.githubusercontent.com/felixheck/wurst/master/assets/wurst.png)
#### Directory based autoloader for hapi.js routes

[![Travis](https://img.shields.io/travis/felixheck/wurst.svg)](https://travis-ci.org/felixheck/wurst/builds/) ![node](https://img.shields.io/node/v/wurst.svg) ![npm](https://img.shields.io/npm/dt/wurst.svg) [![standard](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/) ![npm](https://img.shields.io/npm/l/wurst.svg)
---

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Example](#example)
5. [Testing](#testing)
6. [Contribution](#contribution)

## Introduction
**wurst** is a directory based autoloader for [hapi.js](https://github.com/hapijs/hapi) routes. Just set up your desired directory structure, export your route files, register the plugin and get your final prefixed routes based on the provided directory structure. For example it is perfect for manage the various versions of your API. *wurst* is the German translation for *sausage* - just throw anything in a pot and in the end you'll be satisfied ;-)

The modules `standard` and `tape` are used to grant a high quality implementation.

#### Compatibility
| Major Release | [hapi.js](https://github.com/hapijs/hapi) version | node version |
| --- | --- | --- |
| `v4` | `>=18` | `>=8` |
| `v3` | `>=17` | `>=8` |
| `v2` | `>=13` | `>=6` |

## Installation
For installation use the [Node Package Manager](https://github.com/npm/npm):
```
$ npm install --save wurst
```

or clone the repository:
```
$ git clone https://github.com/felixheck/wurst
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
const hapi = require('hapi');
const server = hapi.server({
  port: 8888,
  host: 'localhost',
});
```

#### Registration
Finally register the plugin and set the correct options:
``` js
(async () => {
  await server.register({
    plugin: wurst,
    options: {
      ignore: 'foo/**/*.js',
      cwd: path.join(__dirname, 'routes'),
      log: true
    },
  })
})();
```

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
    handler() {
      return 'foo';
    }
  },
  {
    method: 'GET',
    path: '/42',
    handler() {
      return '42';
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
