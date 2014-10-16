'use strict';
var protocolErrors      = require('./protocol-errors')
  , reportProtocolError = protocolErrors.reportProtocolError
  , commonErrors        = protocolErrors.commonErrors

//
// functions returning callbacks that wrap the passed callback
//
exports.success = function success(msg, cb) {
  return function onsuccess() { 
    cb(null, { id: msg.id, result: {} })
  }
}

exports.resultOrError = function resultOrError(msg, cb) {
  return function onresultOrError(err, result) {
    if (err) return reportProtocolError(msg.id, commonErrors.ServerError, err.toString(), err.data, cb)
    cb(null, { id: msg.id, result: result })
  }
}

//
// functions that invoke the passed callback
//
exports.notImplemented = function notImplemented(msg, cb) {
  cb(new Error('Not Implemented!'));
}

exports.cannot = function cannot(msg, cb) {
 cb(null, { id: msg.id, result: { result: false } })
}

exports.can = function can(msg, cb) {
  cb(null, { id: msg.id, result: { result: true } })
}
