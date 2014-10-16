'use strict';

// Ports: https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/core/inspector/InspectorIndexedDBAgent.cpp

function ignore(cb) { cb() }

function InspectorIndexedDBAgent() {
  if (!(this instanceof InspectorIndexedDBAgent)) return new InspectorIndexedDBAgent();
  this._enabled = false;
}

module.exports = InspectorIndexedDBAgent;
var proto = InspectorIndexedDBAgent.prototype;

proto.enable = function enable(cb) {
  this._enabled = true;
  cb()
}

proto.disable = function disable(cb) {
  this._enabled = false;
  cb()
}

proto.requestDatabaseNames = function requestDatabaseNames(cb) {
  cb(null, { databaseNames: [] })
}

proto.requestDatabase  = ignore
proto.requestData      = ignore
proto.clearObjectStore = ignore
