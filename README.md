# glslify-client

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Convenience wrapper for handling [glslify](http://github.com/stackgl/glslify)
on the client, minimising the amount of requests to
[glslify-deps](http://github.com/stackgl/glslify-deps).

## Usage

[![NPM](https://nodei.co/npm/glslify-client.png)](https://nodei.co/npm/glslify-client/)

### `getSource = Client(getTree)`

Creates a new `getSource` function.

`getTree(source, done)` should be a function that takes a single GLSL `source`
string, and calls `done(err, deps)` with the dependency list retrieved from
[glslify-deps](http://github.com/stackgl/glslify-deps).

### `getSource(source, done)`

Given a single GLSL `source` string, retrieves the dependency tree (if required)
and calls `done(null, bundledSource)` with the resulting bundled GLSL file.

## Contributing

See [stackgl/contributing](https://github.com/stackgl/contributing) for details.

## License

MIT. See [LICENSE.md](http://github.com/stackgl/glslify-client/blob/master/LICENSE.md) for details.
