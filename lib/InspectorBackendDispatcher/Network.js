'use strict';
var protocolErrors      = require('./protocol-errors')
  , reportProtocolError = protocolErrors.reportProtocolError
  , commonErrors        = protocolErrors.commonErrors
  , invalidParams       = protocolErrors.invalidParams

function cannot(msg, cb) {
 cb(null, { id: msg.id, result: { result: false } })
}

function notImplemented(msg, cb) {
  cb(new Error('We assumed to never have a network handler, therefore ' + msg.method + ' has not been implemented.'))
}

// https://code.google.com/p/chromium/codesearch#chromium/src/out/Debug/gen/blink/core/InspectorBackendDispatcher.cpp&l=1914
function InspectorBackendDispatcher_Network(networkAgent) {
  if (!(this instanceof InspectorBackendDispatcher_Network)) return new InspectorBackendDispatcher_Network(networkAgent);

  // We will most likely NEVER have a network agent
  this._networkAgent = networkAgent;
}
module.exports = InspectorBackendDispatcher_Network;

var proto = InspectorBackendDispatcher_Network.prototype;

function reportAgentNotAvailable(callId, method, cb) {
  reportProtocolError(callId, commonErrors.InvalidParams, invalidParams(method), [ 'Network handler is not available.' ], cb);
}

proto.enable = function enable(msg, cb) {
  if (!this._networkAgent) return reportAgentNotAvailable(msg.id, 'Network.enable', cb);
  notImplemented(msg, cb);
}

proto.disable = function disable(msg, cb) {
  if (!this._networkAgent) return reportAgentNotAvailable(msg.id, 'Network.disable', cb);
  notImplemented(msg, cb);
}

proto.setUserAgentOverride = function setUserAgentOverride(msg, cb) {
  if (!this._networkAgent) return reportAgentNotAvailable(msg.id, 'Network.setUserAgentOverride', cb);
  notImplemented(msg, cb);
}

proto.setExtraHTTPHeaders = function setExtraHTTPHeaders(msg, cb) {
  if (!this._networkAgent) return reportAgentNotAvailable(msg.id, 'Network.setExtraHTTPHeaders', cb);
  notImplemented(msg, cb);
}

proto.getResponseBody = function getResponseBody(msg, cb) {
  if (!this._networkAgent) return reportAgentNotAvailable(msg.id, 'Network.getResponseBody', cb);
  notImplemented(msg, cb);
}

proto.replayXHR = function replayXHR(msg, cb) {
  if (!this._networkAgent) return reportAgentNotAvailable(msg.id, 'Network.replayXHR', cb);
  notImplemented(msg, cb);
}

proto.canClearBrowserCache = cannot;
proto.canClearBrowserCookies = cannot;

proto.emulateNetworkConditions = function emulateNetworkConditions(msg, cb) {
  if (!this._networkAgent) return reportAgentNotAvailable(msg.id, 'Network.emulateNetworkConditions', cb);
  notImplemented(msg, cb);
}

proto.setCacheDisabled = function setCacheDisabled(msg, cb) {
  if (!this._networkAgent) return reportAgentNotAvailable(msg.id, 'Network.setCacheDisabled', cb);
  notImplemented(msg, cb);
}

proto.loadResourceForFrontend = function loadResourceForFrontend(msg, cb) {
  if (!this._networkAgent) return reportAgentNotAvailable(msg.id, 'Network.loadResourceForFrontend', cb);
  notImplemented(msg, cb);
}
