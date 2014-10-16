'use strict';
var protocolErrors      = require('./protocol-errors')
  , callbacks           = require('./callbacks')
  , cannot              = callbacks.cannot
  , reportProtocolError = protocolErrors.reportProtocolError
  , commonErrors        = protocolErrors.commonErrors
  , invalidParams       = protocolErrors.invalidParams

// https://code.google.com/p/chromium/codesearch#chromium/src/out/Debug/gen/blink/core/InspectorBackendDispatcher.cpp&l=1914
function InspectorBackendDispatcher_Network(networkAgent) {
  if (!(this instanceof InspectorBackendDispatcher_Network)) return new InspectorBackendDispatcher_Network(networkAgent);

  this._networkAgent = networkAgent;
}
module.exports = InspectorBackendDispatcher_Network;

var proto = InspectorBackendDispatcher_Network.prototype;

function reportAgentNotAvailable(callId, method, cb) {
  reportProtocolError(callId, commonErrors.InvalidParams, invalidParams(method), [ 'Network handler is not available.' ], cb);
}

proto.enable = function enable(msg, cb) {
  if (!this._networkAgent) return reportAgentNotAvailable(msg.id, 'Network.enable', cb);
  this._networkAgent.enable(callbacks.success(msg, cb)); 
}

proto.disable = function disable(msg, cb) {
  if (!this._networkAgent) return reportAgentNotAvailable(msg.id, 'Network.disable', cb);
  this._networkAgent.enable(callbacks.success(msg, cb)); 
}

proto.setUserAgentOverride = function setUserAgentOverride(msg, cb) {
  if (!this._networkAgent) return reportAgentNotAvailable(msg.id, 'Network.setUserAgentOverride', cb);
  this._networkAgent.setUserAgentOverride(callbacks.success(msg, cb));
}

proto.setExtraHTTPHeaders = function setExtraHTTPHeaders(msg, cb) {
  if (!this._networkAgent) return reportAgentNotAvailable(msg.id, 'Network.setExtraHTTPHeaders', cb);
  this._networkAgent.setExtraHTTPHeaders(callbacks.success(msg, cb));
}

proto.getResponseBody = function getResponseBody(msg, cb) {
  if (!this._networkAgent) return reportAgentNotAvailable(msg.id, 'Network.getResponseBody', cb);
  this._networkAgent.getResponseBody(callbacks.success(msg, cb));
}

proto.replayXHR = function replayXHR(msg, cb) {
  if (!this._networkAgent) return reportAgentNotAvailable(msg.id, 'Network.replayXHR', cb);
  this._networkAgent.replayXHR(callbacks.success(msg, cb));
}

proto.canClearBrowserCache = cannot;
proto.canClearBrowserCookies = cannot;

proto.emulateNetworkConditions = function emulateNetworkConditions(msg, cb) {
  if (!this._networkAgent) return reportAgentNotAvailable(msg.id, 'Network.emulateNetworkConditions', cb);
  this._networkAgent.emulateNetworkConditions(callbacks.success(msg, cb));
}

proto.setCacheDisabled = function setCacheDisabled(msg, cb) {
  if (!this._networkAgent) return reportAgentNotAvailable(msg.id, 'Network.setCacheDisabled', cb);
  this._networkAgent.setCacheDisabled(callbacks.success(msg, cb));
}

proto.loadResourceForFrontend = function loadResourceForFrontend(msg, cb) {
  if (!this._networkAgent) return reportAgentNotAvailable(msg.id, 'Network.loadResourceForFrontend', cb);
  this._networkAgent.loadResourceForFrontend(callbacks.success(msg, cb));
}
