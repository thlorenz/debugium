'use strict';

/* jshint -W079 */
var WebSocket = require('ws')
  , sortOutMessages = require('../common/sort-out-messages')
  
var PATH     = 'ws://localhost:9221/devtools/page/E17CB808-0D24-4EBD-A9CC-6232A2C3EEEA'
  , FILE     = 'click-me-init'
  , START    = 1
  , END      = 10
  , DELAY    = 200

function inspect(obj, depth) {
  return require('util').inspect(obj, false, depth || 5, true);
}

var go = module.exports = function (opts) {

  function log() {
    if (opts.debug) console.log.apply(this, arguments);
  }

  var messages = sortOutMessages(opts.file)
    , queue = []
    , lastSent


  opts.delay = opts.delay || DELAY;
  opts.start = opts.start || START;
  opts.end   = opts.end   || END;

  var ws = new WebSocket(opts.path);

  function sendMessage(msg) {
    if (!msg) return;

    log('sending:\t', inspect(msg))

    ws.send(JSON.stringify(msg), function onsent(err) {
      if (err) { 
        console.error('Error sending', msg)
        console.error(err)
      }     
      lastSent = msg.id;
    })
  }

  ws.on('open', function onopen() {
    log('websocket connected')
    for (var i = opts.start; i <= opts.end; i++) {
      queue.push(messages.outgoing[i]);
    }  
    sendMessage(queue.shift())
  })
  ws.on('error', function onerror(err) {
    console.error(err);  
  })

  ws.on('message', function onmessage(json) {
    var msg = JSON.parse(json)
    log('received:\t', inspect(msg, 10))
    if (msg.id === lastSent) sendMessage(queue.shift())
  })
}

go({ debug: true, file: FILE, path: PATH })
