'use strict';
var id = 0;

// Ports: https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/core/inspector/ScriptDebugListener.h1&l=48
//        without features we won't need
function Script(url, path) {
  if (!(this instanceof Script)) return new Script(url, path);

  this.startLine   = 0;
  this.endLine     = 0;
  this.url         = url;
  this.id          = id++;
  this.source      = undefined;
}

var proto = Script.prototype;

var scriptsByUrl = {}
  , scriptsByPath = {}
  , scriptsById = {}

// called from find-app-scripts
exports.add = function add(url, path) {
  var script = new Script(url, path);

  scriptsByUrl[url]      = script;
  scriptsByPath[path]    = script;
  scriptsById[script.id] = script;
}

// called from load-script-source
exports.addSource = function addSource(p, src) {
  var script = scriptsByPath[p];
  if (!script) throw new Error('Could not find script with path ' + p);
  script.source = src;
  script.endLine = src.split('\n').length;
}

exports.byUrl  = scriptsByUrl;
exports.byPath = scriptsByPath;
exports.byId   = scriptsById;
