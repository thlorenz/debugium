'use strict';

// Ports: https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/core/inspector/InspectorNetworkAgent.cpp

function ignore(cb) { cb() }

function InspectorNetworkAgent() {
  if (!(this instanceof InspectorNetworkAgent)) return new InspectorNetworkAgent();
  this._enabled = false;
}

module.exports = InspectorNetworkAgent;
var proto = InspectorNetworkAgent.prototype;

proto.enable = function enable(cb) {
  this._enabled = true;
  cb()
}

proto.disable = function disable(cb) {
  this._enabled = false;
  cb()
}

proto.setUserAgentOverride     = ignore
proto.setExtraHTTPHeaders      = ignore
proto.getResponseBody          = ignore
proto.replayXHR                = ignore
proto.emulateNetworkConditions = ignore
proto.setCacheDisabled         = ignore
