# Le Serf

> Your trusty assistant in your Lacuna Expanse misadventures!

[![Build Status](https://travis-ci.org/le-serf/le-serf.svg)](https://travis-ci.org/le-serf/le-serf)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Dependency Status](https://david-dm.org/le-serf/le-serf.svg)](https://david-dm.org/le-serf/le-serf)
[![devDependency Status](https://david-dm.org/le-serf/le-serf/dev-status.svg)](https://david-dm.org/le-serf/le-serf#info=devDependencies)

# Notes

*A few notes on various oddities in the code.*

> Don't use ES6 Modules

Because I don't like them - CommonJS modules seem cleaner to me.

> Don't use ES6 Classes to define React Components

Because they [don't support mixins](https://facebook.github.io/react/docs/reusable-components.html#no-mixins). ES6 Classes are being used for other things, though.

> package.json

All dependencies for the web site are specified as `devDependencies` so that they don't get included in the published npm module.

# Changes

### 1.1.0
- Started keeping a changes log.
