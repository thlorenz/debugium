'use strict';

// Related to: https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/bindings/core/v8/PageScriptDebugServer.h

var util = require('util')
  , EE = require('events').EventEmitter
  , WebSocketServer = require('ws').Server

function DebugServer() {
  if (!(this instanceof DebugServer)) return new DebugServer();
}

util.inherits(EE, DebugServer);
var proto = DebugServer.prototype;

proto.start = function start() {
  // TODO: start http server and pass to WebSocket Server https://github.com/node-inspector/node-inspector/blob/master/lib/debug-server.js#L39
  this.ws = new WebSocketServer();
}


