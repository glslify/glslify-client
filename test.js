const deps     = require('glslify-deps')
const test     = require('tape')
const Client   = require('./')

const fixtures = [
  'void main(){}',
  '#pragma glslify: noise = require(glsl-noise/simplex/2d)',
  '#pragma glslify: fog = require(glsl-fog/exp2)',
  '#pragma glslify: fog = require(glsl-fog/exp2)',
  '#pragma glslify: fog = require(glsl-fog/linear)\n#pragma glslify: fog = require(glsl-smooth-min)',
  '#pragma glslify: fog = require(glsl-noise/simplex/2d)',
  '#pragma glslify: fog = require(glsl-smooth-min)\n#pragma glslify: fog = require(glsl-fog/exp2)'
]

const failures = [
  '#pragma glslify: noise = require(glsl-noise/simplex/d)'
]

test('parallel requests', function(t) {
  const client = Client(function(source, done) {
    setTimeout(function() {
      deps().inline(source, __dirname, done)
    }, Math.max(0, Math.random() * 1000 - 500))
  })

  var c = fixtures.length * 10
  var j = 0

  t.plan(c * 2)

  for (var i = 0; i < c; i++) (function(i) {
    client(fixtures[i % fixtures.length], function(err, source) {
      if (err) return t.fail(err.message || err)
      t.equal(i, j++, 'callbacks called in order')
      t.ok(typeof source === 'string', 'returns a string')
    })
  })(i)
})

test('error handling', function(t) {
  const client = Client(function(source, done) {
    setTimeout(function() {
      deps().inline(source, __dirname, done)
    }, Math.max(0, Math.random() * 1000 - 500))
  })

  client(fixtures[0], function(err, source) {
    if (err) return t.fail(err.message || err)

    client(failures[0], function(err, source) {
      t.ok(err, 'error returned')

      client(fixtures[0], function(err, source) {
        if (err) return t.fail(err.message || err)

        t.pass('result still available after an error!')
        t.end()
      })
    })
  })
})
