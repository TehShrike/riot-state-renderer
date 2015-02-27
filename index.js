var riot = require('riot')
var xtend = require('xtend')

module.exports = function RactiveStateRouter(options) {
	var defaultOpts = xtend(options)

	return {
		render: function render(context, cb) {
			var element = context.element
			var template = context.template
			var content = context.content
			if (typeof element === 'string') {
				element = document.querySelector(element)
			}

			try {
				var tag = riot.mount(element, template, xtend(defaultOpts, content))

				if (!tag) {
					console.error('Error creating riot tag', template, 'on', element)
				}

				cb(null, tag)
			} catch (e) {
				cb(e)
			}
		},
		reset: function reset(context, cb) {
			var tag = context.domApi

			tag.trigger('reset')
			tag.opts = xtend(defaultOpts, context.content)
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
			defaultOpts.active = makeRiotPath.bind(null, stateIsActive)
		},
		handleStateRouter: function handleStateRouter(newStateRouter) {
			newStateRouter.on('stateChangeEnd', function() {
				riot.update()
			})
		}
	}
}

// Since I can't figure out how to use object literals in a Riot expressions
function makeRiotPath() {
	try {
		var args = Array.prototype.slice.call(arguments)
		var makePath = args.shift()
		var stateName = args.shift()
		var opts = {}
		for (var i = 0; i < args.length; i += 2) {
			opts[args[i]] = args[i + 1]
		}
		return makePath(stateName, opts)
	} catch (e) {
		console.log(e)
	}
}

function makeEmptyCopyAtSameLevel(element) {
	var parent = element.parentNode
	var elementPrime = element.cloneNode(false)
	parent.insertBefore(elementPrime, element)
	return elementPrime
}
