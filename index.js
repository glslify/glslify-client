var detective = require('glslify-detective')
var equals    = require('shallow-equals')
var bundle    = require('glslify-bundle')
var Emitter   = require('events/')
var xhr       = require('xhr')

module.exports = Client

function Client(getTree) {
  var depsCache = []
  var treeCache = []
  var running

  return update

  function update(src, done) {
    var deps = detective(src)

    // Handle parallel requests by queuing them
    // up in the order that they're made. It's
    // recommended you throttle these requests
    // as much as possible first though :)
    if (running) {
      return running.once('ready', function() {
        setTimeout(function() {
          update(src, done)
        })
      })
    }

    // Reuse the local dependency tree if possible: this
    // saves us time making requests to the server, speeding
    // up rebuilds to ~10ms.
    if (treeCache.length && equals(deps, depsCache)) {
      treeCache[0].source = src
      return done(null, bundle(treeCache))
    }

    running = new Emitter
    running.setMaxListeners(Infinity)

    getTree(src, function(err, tree) {
      if (err) {
        running.emit('ready')
        running = null
        return done(err)
      }

      depsCache = deps
      treeCache = tree
      treeCache[0].source = src

      running.emit('ready')

      done(running = null, bundle(treeCache))
    })
  }
}
