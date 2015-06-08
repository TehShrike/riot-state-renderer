var riot = require('riot')
var xtend = require('xtend')

module.exports = function RiotStateRenderer(options) {
    var defaultOpts = xtend(options)

    return function makeRenderer(stateRouter) {
        defaultOpts.makePath = makeRiotPath.bind(null, stateRouter.makePath)

        defaultOpts.active = makeRiotPath.bind(null, stateRouter.stateIsActive)

        stateRouter.on('stateChangeEnd', function() {
            riot.update()
        })

        return {
            render: function render(context, cb) {
                var element = context.element
                var template = context.template
                var content = context.content
                if (typeof element === 'string') {
                    element = document.querySelector(element)
                }

                try {
                    var tag = riot.mount(element, template, xtend(defaultOpts, content))[0]

                    if (!tag) {
                        console.error('Error creating riot tag', template, 'on', element)
                    }
                    if (tag.root.attributes['riot-tag'] && tag.root.attributes['riot-tag'].value !== template) {
                        tag.root.attributes['riot-tag'].value = template;
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
                tag.unmount(true)
                cb()
            },
            getChildElement: function getChildElement(tag, cb) {
                try {
                    var child = tag.root.querySelector('ui-view')
                    cb(null, child)
                } catch (e) {
                    cb(e)
                }
            }
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