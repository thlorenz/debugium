'use strict';

// https://code.google.com/p/chromium/codesearch#chromium/src/out/Debug/gen/blink/core/InspectorBackendDispatcher.cpp&l=6361
exports.commonErrors = {
    ParseError     : -32700
  , InvalidRequest : -32600
  , MethodNotFound : -32601
  , InvalidParams  : -32602
  , InternalError  : -32603
  , ServerError    : -32000
}

exports.invalidParams = function invalidParams(method) {
  return 'Some arguments of method \'' + method + '\' can\'t be processed'
}

// https://code.google.com/p/chromium/codesearch#chromium/src/out/Debug/gen/blink/core/InspectorBackendDispatcher.cpp&l=6358
exports.reportProtocolError = function reportProtocolError(callId, code, errorMessage, data, cb) {
  var error = {
      code: code
    , message: errorMessage
  }
  if (data) error.data = data;

  var message = {
      id    : callId
    , error : error
  }
  cb(null, message)  
}


