var riot = require('riot')
var extend = require('extend')

module.exports = function RactiveStateRouter(options) {
	var stateRouter = null

	var defaultOpts = extend({}, options)

	return {
		render: function render(element, template, cb) {
			if (typeof element === 'string') {
				element = document.querySelector(element)
			}

			try {
				var tag = riot.mountTo(element, template, extend({}, defaultOpts))

				if (!tag) {
					console.error('Error creating riot tag', template, 'on', element)
				}

				cb(null, tag)
			} catch (e) {
				cb(e)
			}
		},
		reset: function reset(tag, cb) {
			tag.opts = extend({}, defaultOpts)
			tag.update()
			cb()
		},
		destroy: function destroy(tag, cb) {
			makeEmptyCopyAtSameLevel(tag.root) // unmount removes the original element, so we need to recreate it manually
			tag.unmount()
			cb()
		},
		getChildElement: function getChildElement(tag, cb) {
			try {
				var child = tag.root.querySelector('ui-view')
				cb(null, child)
			} catch (e) {
				cb(e)
			}
		},
		setUpMakePathFunction: function setUpMakePathFunction(makePath) {
			defaultOpts.makePath = makeRiotPath.bind(null, makePath)
		},
		setUpStateIsActiveFunction: function setUpStateIsActiveFunction(stateIsActive) {
			defaultOpts.active = function(stateName) {
				return stateIsActive(stateName) ? 'active' : ''
			}
		},
		handleStateRouter: function handleStateRouter(newStateRouter) {
			stateRouter = newStateRouter
		}
	}
}

// Since I can't figure out how to use object literals in Riot expressions
function makeRiotPath() {
	try {
		var args = Array.prototype.slice.apply(arguments)
		var makePath = args.shift()
		var stateName = args.shift()
		var opts = {}
		for (var i = 0; i < args.length; i += 2) {
			opts[args[i]] = args[i + 1]
		}
		makePath(stateName, opts)
	} catch (e) {
		console.log(e)
	}
	return makePath(stateName, opts)
}


function makeEmptyCopyAtSameLevel(element) {
	var parent = element.parentNode
	var elementPrime = element.cloneNode(false)
	parent.insertBefore(elementPrime, element)
	return elementPrime
}
