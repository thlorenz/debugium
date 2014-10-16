'use strict';
var protocolErrors      = require('./protocol-errors')
  , reportProtocolError = protocolErrors.reportProtocolError
  , commonErrors        = protocolErrors.commonErrors
  , invalidParams       = protocolErrors.invalidParams
  , callbacks           = require('./callbacks')

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
  this._runtimeAgent.enable(callbacks.success(msg, cb)); 
}

proto.disable = function disable(msg, cb) {
  if (!this._runtimeAgent) return reportAgentNotAvailable(msg.id, 'Runtime.disable', cb);
  this._runtimeAgent.disable(callbacks.success(msg, cb)); 
}

proto.evaluate = function evaluate(msg, cb) {
  if (!this._runtimeAgent) return reportAgentNotAvailable(msg.id, 'Runtime.evaluate', cb);
  this._runtimeAgent.evaluate(callbacks.success(msg, cb)); 
}

proto.callFunctionOn = function callFunctionOn(msg, cb) {
  if (!this._runtimeAgent) return reportAgentNotAvailable(msg.id, 'Runtime.callFunctionOn', cb);
  this._runtimeAgent.callFunctionOn(callbacks.success(msg, cb)); 
}

proto.getProperties = function getProperties(msg, cb) {
  if (!this._runtimeAgent) return reportAgentNotAvailable(msg.id, 'Runtime.getProperties', cb);
  this._runtimeAgent.getProperties(callbacks.success(msg, cb)); 
}

proto.releaseObject = function releaseObject(msg, cb) {
  if (!this._runtimeAgent) return reportAgentNotAvailable(msg.id, 'Runtime.releaseObject', cb);
  this._runtimeAgent.releaseObject(callbacks.success(msg, cb)); 
}

proto.releaseObjectGroup = function releaseObjectGroup(msg, cb) {
  if (!this._runtimeAgent) return reportAgentNotAvailable(msg.id, 'Runtime.releaseObjectGroup', cb);
  this._runtimeAgent.releaseObjectGroup(callbacks.success(msg, cb)); 
}

proto.run = function run(msg, cb) {
  if (!this._runtimeAgent) return reportAgentNotAvailable(msg.id, 'Runtime.run', cb);
  this._runtimeAgent.run(callbacks.success(msg, cb)); 
}

proto.isRunRequired = function isRunRequired(msg, cb) {
  if (!this._runtimeAgent) return reportAgentNotAvailable(msg.id, 'Runtime.isRunRequired', cb);
  this._runtimeAgent.isRunRequired(callbacks.resultOrError(msg, cb)); 
}
