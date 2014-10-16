'use strict';
var protocolErrors      = require('./protocol-errors')
  , reportProtocolError = protocolErrors.reportProtocolError
  , commonErrors        = protocolErrors.commonErrors
  , invalidParams       = protocolErrors.invalidParams
  , callbacks           = require('./callbacks')

function InspectorBackendDispatcher_HeapProfiler(heapProfilerAgent) {
  if (!(this instanceof InspectorBackendDispatcher_HeapProfiler)) return new InspectorBackendDispatcher_HeapProfiler(heapProfilerAgent);

  this._heapProfilerAgent = heapProfilerAgent;
}
module.exports = InspectorBackendDispatcher_HeapProfiler;

var proto = InspectorBackendDispatcher_HeapProfiler.prototype;

function reportAgentNotAvailable(callId, method, cb) {
  reportProtocolError(callId, commonErrors.InvalidParams, invalidParams(method), [ 'HeapProfiler handler is not available.' ], cb);
}

proto.enable = function enable(msg, cb) {
  if (!this._heapProfilerAgent) return reportAgentNotAvailable(msg.id, 'HeapProfiler.enable', cb);
  this._heapProfilerAgent.enable(callbacks.success(msg, cb)); 
}

proto.disable = function disable(msg, cb) {
  if (!this._heapProfilerAgent) return reportAgentNotAvailable(msg.id, 'HeapProfiler.disable', cb);
  this._heapProfilerAgent.disable(callbacks.success(msg, cb)); 
}

proto.startTrackingHeapObjects = function startTrackingHeapObjects(msg, cb) {
  if (!this._heapProfilerAgent) return reportAgentNotAvailable(msg.id, 'HeapProfiler.startTrackingHeapObjects', cb);
  this._heapProfilerAgent.startTrackingHeapObjects(callbacks.success(msg, cb)); 
}

proto.stopTrackingHeapObjects = function stopTrackingHeapObjects(msg, cb) {
  if (!this._heapProfilerAgent) return reportAgentNotAvailable(msg.id, 'HeapProfiler.stopTrackingHeapObjects', cb);
  this._heapProfilerAgent.stopTrackingHeapObjects(callbacks.success(msg, cb)); 
}

proto.takeHeapSnapshot = function takeHeapSnapshot(msg, cb) {
  if (!this._heapProfilerAgent) return reportAgentNotAvailable(msg.id, 'HeapProfiler.takeHeapSnapshot', cb);
  this._heapProfilerAgent.takeHeapSnapshot(callbacks.success(msg, cb)); 
}

proto.collectGarbage = function collectGarbage(msg, cb) {
  if (!this._heapProfilerAgent) return reportAgentNotAvailable(msg.id, 'HeapProfiler.collectGarbage', cb);
  this._heapProfilerAgent.collectGarbage(callbacks.success(msg, cb)); 
}

proto.getObjectByHeapObjectId = function getObjectByHeapObjectId(msg, cb) {
  if (!this._heapProfilerAgent) return reportAgentNotAvailable(msg.id, 'HeapProfiler.getObjectByHeapObjectId', cb);
  this._heapProfilerAgent.getObjectByHeapObjectId(callbacks.success(msg, cb)); 

}

proto.getHeapObjectId = function getHeapObjectId(msg, cb) {
  if (!this._heapProfilerAgent) return reportAgentNotAvailable(msg.id, 'HeapProfiler.getHeapObjectId', cb);
  this._heapProfilerAgent.getHeapObjectId(callbacks.success(msg, cb)); 
}
