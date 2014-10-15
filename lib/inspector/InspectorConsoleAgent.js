'use strict';

// Ports: https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/core/inspector/InspectorConsoleAgent.cpp

function ignore(cb) { cb() }

function InspectorConsoleAgent() {
  if (!(this instanceof InspectorConsoleAgent)) return new InspectorConsoleAgent();
  this._enabled = false;
}

module.exports = InspectorConsoleAgent;
var proto = InspectorConsoleAgent.prototype;

proto.enable = function enable(cb) {
  this._enabled = true;
  cb()
}

proto.disable = function disable(cb) {
  this._enabled = false;
  cb()
}

proto.clearMessages           = ignore
proto.setMonitoringXHREnabled = ignore
proto.addInspectedNode        = ignore
proto.addInspectedHeapObject  = ignore
proto.setTracingBasedTimeline = ignore
