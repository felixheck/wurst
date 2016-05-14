# wurst
#### Directory based autoloader for hapi.js routes
---

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Example](#example)
5. [Testing](#testing)
6. [Contribution](#contribution)
7. [License](#license)

## Introduction
Just set up your desired directory structure, export your route files, register the plugin and get your final routes based on the provided directory structure.

This module is implemented in ECMAScript 6 (v2015). Therefore the development dependencies are based on `babel`.
Additionally `eslint` and `mocha` are used to grant a high quality implementation.

**wurst** is the German translation for "sausage" - just throw anything in a pot and in the end you'll be satisfied ;-)

## Installation
For installation use the [Node Package Manager](https://github.com/npm/npm):
```
// production version with ES5 syntax
$ npm install --save wurst
```

or clone the repository:
```
// development version with ES6 syntax
$ git clone https://github.com/felixheck/wurst
```

## Usage
#### Import
First you have to import the module:
``` js
// ES6 module syntax
import wurst from 'wurst';

// Node traditional syntax
const wurst = require('wurst');
```

#### Create hapi server
Afterwards create your api server + connection if not already done:
``` js
const server = new Hapi.Server();

server.connection({
  port: 8888,
  host: 'localhost',
});
```

#### Registration
Finally register the plugin and set the correct routes directory:
``` js
server.register({
  register: wurst,
  options: {
    dir: path.join(__dirname, 'routes'),
    ignore: 'foo/**/*.js'
  },
}, err => {
  if (err) {
    throw err;
  }
});
```

#### Options
**dir**: required
Type: `string`

The absolute path to the routes directory.

**ignore**: optional
Type: `string` / `array`

The [glomb](https://github.com/isaacs/node-glob#glob-primer) pattern or an array of patterns to exclude route files.


## Example
The following file structure is the base of this example:
```
src/
  routes/
    foo.js
    bar/
      foo.js
  index.js
```

The route files `src/routes/foo.js` and `src/routes/bar/foo.js` look like:
``` js
const fooRoutes = [
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

module.exports = fooRoutes;
```

It is important that these route files use `module.exports` to provide a single [route object](http://hapijs.com/api#route-configuration) or a list.
After starting the server the following routes are available:

```
/
/42

/bar
/bar/42
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

or to run the tests after each update, use:
```
$ npm tdd
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

Copyright (c) 2016 Felix Heck

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
