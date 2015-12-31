# Le Serf

> Your trusty assistant in your Lacuna Expanse misadventures!

[![Build Status](https://travis-ci.org/le-serf/le-serf.svg)](https://travis-ci.org/le-serf/le-serf)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Dependency Status](https://david-dm.org/le-serf/le-serf.svg)](https://david-dm.org/le-serf/le-serf)
[![devDependency Status](https://david-dm.org/le-serf/le-serf/dev-status.svg)](https://david-dm.org/le-serf/le-serf#info=devDependencies)

# Notes

**Don't use ES6 Modules**

Because I don't like them - CommonJS modules seem cleaner to me.

**Don't use ES6 Classes to define React Components**

Because they [don't support mixins](https://facebook.github.io/react/docs/reusable-components.html#no-mixins). ES6 Classes are being used for other things, though.

**package.json**

All dependencies for the web site are specified as `devDependencies` so that they don't get included in the published npm module.

# Changes

### 1.2.0

**Bugs**
- `upgrade-buildings` now upgrades groups of the same type of building in order of level (lowest to highest).

**CLI**
- Rationalized all the different means of specifying a planet. Now there's only one: `--planet`.

**General**
- Tasks handle invalid arguments properly.
- Implemented handling of Captchas all round.

**Tasks**
- Implemented new `build-ships` task.
- Implemented new `push-buildings-up` task.
- Implemented new `spy-trainer` task.
- Implemented new `view-laws` task.

**Technical**
- Started using [Greenkeeper](http://greenkeeper.io/) to keep dependencies up-to-date.
- Lots of refactoring.
- Started documenting the project using [JSDoc](http://usejsdoc.org/).
- Handle session IDs better by not logging into the game every time a task is run.
- Travis CI now tests on Node `5.0`

### 1.1.2 (2015-11-27)
- Fixed `.npmignore`

### 1.1.1 (2015-11-27)
- Messed up the `package.json`.

### 1.1.0 (2015-11-27)
- Started keeping a changes log.

### 1.0.0
- Collected all the code from all the different repositories into this one repository.
