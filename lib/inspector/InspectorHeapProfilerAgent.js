'use strict';

// Ports: https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/core/inspector/InspectorHeapProfilerAgent.cpp

function ignore(cb) { cb() }

function InspectorHeapProfilerAgent() {
  if (!(this instanceof InspectorHeapProfilerAgent)) return new InspectorHeapProfilerAgent();
  this._enabled = false;
}

module.exports = InspectorHeapProfilerAgent;
var proto = InspectorHeapProfilerAgent.prototype;

proto.enable = function enable(cb) {
  this._enabled = true;
  cb()
}

proto.disable = function disable(cb) {
  this._enabled = false;
  cb()
}

proto.startTrackingHeapObjects = ignore
proto.stopTrackingHeapObjects  = ignore
proto.takeHeapSnapshot         = ignore
proto.collectGarbage           = ignore
proto.getObjectByHeapObjectId  = ignore
proto.getHeapObjectId          = ignore
