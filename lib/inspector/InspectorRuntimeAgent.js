'use strict';

// Ports: https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/core/inspector/InspectorRuntimeAgent.cpp

function ignore(cb) { cb() }

function InspectorRuntimeAgent() {
  if (!(this instanceof InspectorRuntimeAgent)) return new InspectorRuntimeAgent();
  this._enabled = false;
}

module.exports = InspectorRuntimeAgent;
var proto = InspectorRuntimeAgent.prototype;

proto.enable = function enable(cb) {
  this._enabled = true;
  cb()
}

proto.disable = function disable(cb) {
  this._enabled = false;
  cb()
}

proto.isRunRequired = function(cb) {
  cb(null, false)
}

proto.evaluate           = ignore
proto.callFunctionOn     = ignore
proto.getProperties      = ignore
proto.releaseObject      = ignore
proto.releaseObjectGroup = ignore
proto.run                = ignore
