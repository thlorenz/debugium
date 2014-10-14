'use strict';
var protocolErrors      = require('./protocol-errors')
  , reportProtocolError = protocolErrors.reportProtocolError
  , commonErrors        = protocolErrors.commonErrors
  , invalidParams       = protocolErrors.invalidParams

function InspectorBackendDispatcher_Console(consoleAgent) {
  if (!(this instanceof InspectorBackendDispatcher_Console)) return new InspectorBackendDispatcher_Console(consoleAgent);

  // We will most likely NEVER have a console agent
  this._consoleAgent = consoleAgent;
}
module.exports = InspectorBackendDispatcher_Console;

var proto = InspectorBackendDispatcher_Console.prototype;

function reportAgentNotAvailable(callId, method, cb) {
  reportProtocolError(callId, commonErrors.InvalidParams, invalidParams(method), [ 'Console handler is not available.' ], cb);
}

proto.enable = function enable(msg, cb) {
  if (!this._consoleAgent) return reportAgentNotAvailable(msg.id, 'Console.enable', cb);
  this._consoleAgent.enable(msg.id, cb); 
}

proto.disable = function disable(msg, cb) {
  if (!this._consoleAgent) return reportAgentNotAvailable(msg.id, 'Console.disable', cb);
  this._consoleAgent.disable(msg.id, cb); 
}

proto.clearMessages = function clearMessages(msg, cb) {
  if (!this._consoleAgent) return reportAgentNotAvailable(msg.id, 'Console.clearMessages', cb);
  this._consoleAgent.clearMessages(msg.id, cb); 
}

proto.setMonitoringXHREnabled = function setMonitoringXHREnabled(msg, cb) {
  if (!this._consoleAgent) return reportAgentNotAvailable(msg.id, 'Console.setMonitoringXHREnabled', cb);
  this._consoleAgent.setMonitoringXHREnabled(msg.id, cb); 
}

proto.addInspectedNode = function addInspectedNode(msg, cb) {
  if (!this._consoleAgent) return reportAgentNotAvailable(msg.id, 'Console.addInspectedNode', cb);
  this._consoleAgent.addInspectedNode(msg.id, cb); 
}

proto.addInspectedHeapObject = function addInspectedHeapObject(msg, cb) {
  if (!this._consoleAgent) return reportAgentNotAvailable(msg.id, 'Console.addInspectedHeapObject', cb);
  this._consoleAgent.addInspectedHeapObject(msg.id, cb); 
}

proto.setTracingBasedTimeline = function setTracingBasedTimeline(msg, cb) {
  if (!this._consoleAgent) return reportAgentNotAvailable(msg.id, 'Console.setTracingBasedTimeline', cb);
  this._consoleAgent.setTracingBasedTimeline(msg.id, cb); 
}
