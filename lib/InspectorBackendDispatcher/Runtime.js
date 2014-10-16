'use strict';
var protocolErrors      = require('./protocol-errors')
  , reportProtocolError = protocolErrors.reportProtocolError
  , commonErrors        = protocolErrors.commonErrors
  , invalidParams       = protocolErrors.invalidParams

function successCallback(msg, cb) {
  return function onsuccess() { 
    cb(null, { id: msg.id, result: {} })
  }
}

function resultOrErrorCallback(msg, cb) {
  return function onresponse(err, result) {
    if (err) return reportProtocolError(msg.id, commonErrors.ServerError, err.toString(), err.data, cb)
    cb(null, { id: msg.id, result: result })
  }
}

function InspectorBackendDispatcher_Runtime(runtimeAgent) {
  if (!(this instanceof InspectorBackendDispatcher_Runtime)) return new InspectorBackendDispatcher_Runtime(runtimeAgent);

  this._runtimeAgent = runtimeAgent;
}

module.exports = InspectorBackendDispatcher_Runtime;
var proto = InspectorBackendDispatcher_Runtime.prototype;

function reportAgentNotAvailable(callId, method, cb) {
  reportProtocolError(callId, commonErrors.InvalidParams, invalidParams(method), [ 'Runtime handler is not available.' ], cb);
}

proto.enable = function enable(msg, cb) {
  if (!this._runtimeAgent) return reportAgentNotAvailable(msg.id, 'Runtime.enable', cb);
  this._runtimeAgent.enable(successCallback(msg, cb)); 
}

proto.disable = function disable(msg, cb) {
  if (!this._runtimeAgent) return reportAgentNotAvailable(msg.id, 'Runtime.disable', cb);
  this._runtimeAgent.disable(successCallback(msg, cb)); 
}

proto.evaluate = function evaluate(msg, cb) {
  if (!this._runtimeAgent) return reportAgentNotAvailable(msg.id, 'Runtime.evaluate', cb);
  this._runtimeAgent.evaluate(successCallback(msg, cb)); 
}

proto.callFunctionOn = function callFunctionOn(msg, cb) {
  if (!this._runtimeAgent) return reportAgentNotAvailable(msg.id, 'Runtime.callFunctionOn', cb);
  this._runtimeAgent.callFunctionOn(successCallback(msg, cb)); 
}

proto.getProperties = function getProperties(msg, cb) {
  if (!this._runtimeAgent) return reportAgentNotAvailable(msg.id, 'Runtime.getProperties', cb);
  this._runtimeAgent.getProperties(successCallback(msg, cb)); 
}

proto.releaseObject = function releaseObject(msg, cb) {
  if (!this._runtimeAgent) return reportAgentNotAvailable(msg.id, 'Runtime.releaseObject', cb);
  this._runtimeAgent.releaseObject(successCallback(msg, cb)); 
}

proto.releaseObjectGroup = function releaseObjectGroup(msg, cb) {
  if (!this._runtimeAgent) return reportAgentNotAvailable(msg.id, 'Runtime.releaseObjectGroup', cb);
  this._runtimeAgent.releaseObjectGroup(successCallback(msg, cb)); 
}

proto.run = function run(msg, cb) {
  if (!this._runtimeAgent) return reportAgentNotAvailable(msg.id, 'Runtime.run', cb);
  this._runtimeAgent.run(successCallback(msg, cb)); 
}

proto.isRunRequired = function isRunRequired(msg, cb) {
  if (!this._runtimeAgent) return reportAgentNotAvailable(msg.id, 'Runtime.isRunRequired', cb);
  this._runtimeAgent.isRunRequired(resultOrErrorCallback(msg, cb)); 
}
