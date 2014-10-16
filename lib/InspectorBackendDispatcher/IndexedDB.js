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
  this._indexedDBAgent.enable(successCallback(msg, cb)); 
}

proto.disable = function disable(msg, cb) {
  if (!this._indexedDBAgent) return reportAgentNotAvailable(msg.id, 'IndexedDB.disable', cb);
  this._indexedDBAgent.disable(successCallback(msg, cb)); 
}

proto.requestDatabaseNames = function requestDatabaseNames(msg, cb) {
  if (!this._indexedDBAgent) return reportAgentNotAvailable(msg.id, 'IndexedDB.requestDatabaseNames', cb);
  this._indexedDBAgent.requestDatabaseNames(resultOrErrorCallback(msg, cb)); 
}

proto.requestDatabase = function requestDatabase(msg, cb) {
  if (!this._indexedDBAgent) return reportAgentNotAvailable(msg.id, 'IndexedDB.requestDatabase', cb);
  this._indexedDBAgent.requestDatabase(successCallback(msg, cb)); 
}

proto.requestData = function requestData(msg, cb) {
  if (!this._indexedDBAgent) return reportAgentNotAvailable(msg.id, 'IndexedDB.requestData', cb);
  this._indexedDBAgent.requestData(successCallback(msg, cb)); 
}

proto.clearObjectStore = function clearObjectStore(msg, cb) {
  if (!this._indexedDBAgent) return reportAgentNotAvailable(msg.id, 'IndexedDB.clearObjectStore', cb);
  this._indexedDBAgent.clearObjectStore(successCallback(msg, cb)); 
}
