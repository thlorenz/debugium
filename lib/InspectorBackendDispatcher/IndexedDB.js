'use strict';
var protocolErrors      = require('./protocol-errors')
  , reportProtocolError = protocolErrors.reportProtocolError
  , commonErrors        = protocolErrors.commonErrors
  , invalidParams       = protocolErrors.invalidParams
  , callbacks           = require('./callbacks')

function InspectorBackendDispatcher_IndexedDB(indexedDBAgent) {
  if (!(this instanceof InspectorBackendDispatcher_IndexedDB)) return new InspectorBackendDispatcher_IndexedDB(indexedDBAgent);

  this._indexedDBAgent = indexedDBAgent;
}

module.exports = InspectorBackendDispatcher_IndexedDB;
var proto = InspectorBackendDispatcher_IndexedDB.prototype;

function reportAgentNotAvailable(callId, method, cb) {
  reportProtocolError(callId, commonErrors.InvalidParams, invalidParams(method), [ 'IndexedDB handler is not available.' ], cb);
}

proto.enable = function enable(msg, cb) {
  if (!this._indexedDBAgent) return reportAgentNotAvailable(msg.id, 'IndexedDB.enable', cb);
  this._indexedDBAgent.enable(callbacks.success(msg, cb)); 
}

proto.disable = function disable(msg, cb) {
  if (!this._indexedDBAgent) return reportAgentNotAvailable(msg.id, 'IndexedDB.disable', cb);
  this._indexedDBAgent.disable(callbacks.success(msg, cb)); 
}

proto.requestDatabaseNames = function requestDatabaseNames(msg, cb) {
  if (!this._indexedDBAgent) return reportAgentNotAvailable(msg.id, 'IndexedDB.requestDatabaseNames', cb);
  this._indexedDBAgent.requestDatabaseNames(callbacks.resultOrError(msg, cb)); 
}

proto.requestDatabase = function requestDatabase(msg, cb) {
  if (!this._indexedDBAgent) return reportAgentNotAvailable(msg.id, 'IndexedDB.requestDatabase', cb);
  this._indexedDBAgent.requestDatabase(callbacks.success(msg, cb)); 
}

proto.requestData = function requestData(msg, cb) {
  if (!this._indexedDBAgent) return reportAgentNotAvailable(msg.id, 'IndexedDB.requestData', cb);
  this._indexedDBAgent.requestData(callbacks.success(msg, cb)); 
}

proto.clearObjectStore = function clearObjectStore(msg, cb) {
  if (!this._indexedDBAgent) return reportAgentNotAvailable(msg.id, 'IndexedDB.clearObjectStore', cb);
  this._indexedDBAgent.clearObjectStore(callbacks.success(msg, cb)); 
}
