Use [Riot](https://muut.com/riotjs/) with [abstract-state-router](https://github.com/TehShrike/abstract-state-router)!

Warning: Muut has on several occasions broken backwards compatibility in the Riot API without bumping major or even minor version numbers.  If you get weird errors, make sure you're on at least 2.0.15.  If you are getting errors on a version greater than 2.0.15 please [open an issue](https://github.com/TehShrike/riot-state-renderer/issues) or pull request.

## Usage

```js
var StateRouter = require('abstract-state-router')
var riotRenderer = require('riot-state-renderer')()
var domready = require('domready')

var stateRouter = StateRouter(riotRenderer, 'body')

// add whatever states to the state router

domready(function() {
	stateRouter.evaluateCurrentRoute('login')
})
```

## riotRenderer([options])

`options` is an object that is passed into [riot.mount](https://muut.com/riotjs/api/#mount-tag) as the default opts object.

```js
var StateRouter = require('abstract-state-router')
var riotRenderer = require('riot-state-renderer')

var renderer = riotRenderer({
	hello: 'world'
})

var stateRouter = StateRouter(renderer, 'body')
```

## Working with states

All templates must be created as custom tags manually (or automatically with something like [riotify](https://github.com/jhthorsen/riotify)).

When you add a state to the state router, pass in the tag name as the "template".

For details on setting up states themselves, see the [abstract-state-router](https://github.com/TehShrike/abstract-state-router).
