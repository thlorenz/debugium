'use strict';

/* jshint -W079 */
var debugium        = require('../../')
  , log             = require('npmlog')
  , WebSocketServer = require('ws').Server

function insp(obj, depth) {
  return require('util').inspect(obj, false, depth || 5, true);
}

function WebSocket(opts) {
  if (!(this instanceof WebSocket)) return new WebSocket(opts);

  opts = opts || {}
  this._port = opts.port;
  
  this._ws = new WebSocketServer({ port: this._port })
  this._ws.on('connection', this._onconnection.bind(this))

  this._ibd = debugium.inspectorBackendDispatcher()
  this._ibd.on('message', this._onibdmessage.bind(this))
           .on('error', this._onibderror.bind(this))

  this._socket = undefined
}

module.exports = WebSocket;
var proto = WebSocket.prototype;

proto._onconnection = function _onconnection(socket) {
  log.verbose('ws', 'connected')
  if (this._socket) this._socket.removeAllListeners();

  this._socket = socket;
  this._socket
    .on('message', this._onmessage.bind(this))
    .on('close', this._onclose.bind(this))
}

proto._onmessage = function _onmessage(msg) {
  log.silly('ws', 'received', insp(msg))
  this._ibd.dispatch(JSON.parse(msg))
}

proto._onclose = function _onclose() {
  this._socket.removeAllListeners()
  this._socket = undefined
  log.verbose('ws', 'closed')
}

proto._onibdmessage = function _onibdmessage(msg) {
  // todo only do this when we log at verbose or lower level
  var json = JSON.stringify(msg);
  if (json.length > 500) log.silly('ws', 'sending', json.slice(0, 500) + ' ... (Lenght: ' + json.length + ')')
  else                   log.silly('ws', 'sending', insp(msg))

  if (!this._socket) return log.warn('ws', 'Could not send message since there is no socket!')
  this._socket.send(JSON.stringify(msg))
}

proto._onibderror = function _onibderror(err) {
  log.error('ws', err)
}
