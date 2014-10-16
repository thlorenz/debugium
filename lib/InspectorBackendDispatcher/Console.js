'use strict';
var protocolErrors      = require('./protocol-errors')
  , callbacks           = require('./callbacks')
  , reportProtocolError = protocolErrors.reportProtocolError
  , commonErrors        = protocolErrors.commonErrors
  , invalidParams       = protocolErrors.invalidParams

function InspectorBackendDispatcher_Console(consoleAgent) {
  if (!(this instanceof InspectorBackendDispatcher_Console)) return new InspectorBackendDispatcher_Console(consoleAgent);

  // We will most likely NEVER have a console agent that does anything but ignore commands
  this._consoleAgent = consoleAgent;
}
module.exports = InspectorBackendDispatcher_Console;

var proto = InspectorBackendDispatcher_Console.prototype;

function reportAgentNotAvailable(callId, method, cb) {
  reportProtocolError(callId, commonErrors.InvalidParams, invalidParams(method), [ 'Console handler is not available.' ], cb);
}

proto.enable = function enable(msg, cb) {
  if (!this._consoleAgent) return reportAgentNotAvailable(msg.id, 'Console.enable', cb);
  this._consoleAgent.enable(callbacks.success(msg, cb)); 
}

proto.disable = function disable(msg, cb) {
  if (!this._consoleAgent) return reportAgentNotAvailable(msg.id, 'Console.disable', cb);
  this._consoleAgent.disable(callbacks.success(msg, cb)); 
}

proto.clearMessages = function clearMessages(msg, cb) {
  if (!this._consoleAgent) return reportAgentNotAvailable(msg.id, 'Console.clearMessages', cb);
  this._consoleAgent.clearMessages(callbacks.success(msg, cb)); 
}

proto.setMonitoringXHREnabled = function setMonitoringXHREnabled(msg, cb) {
  if (!this._consoleAgent) return reportAgentNotAvailable(msg.id, 'Console.setMonitoringXHREnabled', cb);
  this._consoleAgent.setMonitoringXHREnabled(callbacks.success(msg, cb)); 
}

proto.addInspectedNode = function addInspectedNode(msg, cb) {
  if (!this._consoleAgent) return reportAgentNotAvailable(msg.id, 'Console.addInspectedNode', cb);
  this._consoleAgent.addInspectedNode(callbacks.success(msg, cb)); 
}

proto.addInspectedHeapObject = function addInspectedHeapObject(msg, cb) {
  if (!this._consoleAgent) return reportAgentNotAvailable(msg.id, 'Console.addInspectedHeapObject', cb);
  this._consoleAgent.addInspectedHeapObject(callbacks.success(msg, cb)); 
}

proto.setTracingBasedTimeline = function setTracingBasedTimeline(msg, cb) {
  if (!this._consoleAgent) return reportAgentNotAvailable(msg.id, 'Console.setTracingBasedTimeline', cb);
  this._consoleAgent.setTracingBasedTimeline(callbacks.success(msg, cb)); 
}
