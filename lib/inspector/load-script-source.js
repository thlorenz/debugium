'use strict';

var path = require('path')
  , fs = require('fs')
  , inspectorUrlToPath = require('./inspector-url').inspectorUrlToPath
  , scripts = require('./scripts')

var MODULE_HEADER = '(function (exports, require, module, __filename, __dirname) { '
  , MODULE_FOOTER = '\n});'

function removeShebang(s) {
  return s.replace(/^\#\!.*/, '')
}

exports = module.exports = function loadScriptSource(url, cb) {
  var p = inspectorUrlToPath(url)
  fromPath(p, cb)
}

var fromPath = exports.fromPath = function fromPath(p, cb) {
  if (scripts.byPath[p] && scripts.byPath[p].source) return cb(null, scripts.byPath[p].source)
  fs.readFile(p, 'utf8', function (err, src) {
    if (err) return cb(err);
    src = MODULE_HEADER +  removeShebang(src) + MODULE_FOOTER;
    scripts.addSource(p, src)
    cb(null, src)
  })
}
