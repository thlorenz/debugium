'use strict';

var path = require('path')
  , fs = require('fs')
  , inspectorUrlToPath = require('./inspector-url').inspectorUrlToPath

var MODULE_HEADER = '(function (exports, require, module, __filename, __dirname) { '
  , MODULE_FOOTER = '\n});'
  , cache = {}

function removeShebang(s) {
  return s.replace(/^\#\!.*/, '')
}

module.exports = function loadScriptSource(url, cb) {
  var p = inspectorUrlToPath(url)
  if (cache[p]) return cb(null, cache[p])

  fs.readFile(p, 'utf8', function (err, src) {
    if (err) return cb(err);
    src = MODULE_HEADER +  removeShebang(src) + MODULE_FOOTER;
    cache[p] = src;
    cb(null, src)
  })
}
