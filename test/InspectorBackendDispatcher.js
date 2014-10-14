'use strict';
/*jshint asi: true */

var test = require('tap').test

var ibd = require('../').inspectorBackendDispatcher()
  , sortOutMessages = require('./common/sort-out-messages')

var messages = sortOutMessages('click-me-init')
  , outgoing = Object.keys(messages.outgoing).map(function (x) { return messages.outgoing[x] })
  , incoming = Object.keys(messages.incoming).map(function (x) { return messages.incoming[x] })


function incomingWithId(id) {
  for (var i = 0; i < incoming.length; i++) {
    if (incoming[i].id === id) return incoming[i]
  }
  throw new Error('Incoming message with id ' + id + ' was not found!')
}

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function insp(obj, depth) {
  return require('util').inspect(obj, false, depth || 5, true)
}

function writeMsg(msg, method) {
  require('fs').writeFileSync(__dirname + '/tmp/' + method + '.json',  JSON.stringify(msg, null, 2), 'utf8')
}


test('\ndispatching messages for click-me-init one at a time', function (t) {
  function assertResourceTree(msg) {
    var frame = msg.result.frame;
    var resources = msg.result.resources;
    t.ok(frame.url.indexOf(__filename), 'frame url is main file') 
    t.equal(frame.loaderId, process.pid, 'frame id is process pid')
    t.ok(resources.length > 9, 'has at least 10 resources')
    t.ok(resources[0].url, 'with url')
    t.equal(resources[0].type, 'Script', 'type Script')
    t.equal(resources[0].mimeType, 'application/javascript', 'mimeType application/javascript')
  }

  var currentMsg, idx = 0;

  ibd.on('message', onmessage)
  ibd.on('error', onerr)

  function dispatchNext() {
    currentMsg = outgoing[idx++];
    if (!currentMsg) return t.end()
    ibd.dispatch(currentMsg)
  }

  function onmessage(msg) {
    var expectedMsg = incomingWithId(msg.id)
    t.pass('handles msg  ' + insp(currentMsg))
    t.equal(currentMsg.id, msg.id, 'replies with correct id')
    if (currentMsg.method === 'Page.getResourceTree') assertResourceTree(msg);
    else                                              t.deepEqual(msg, expectedMsg, 'result is as expected')
    dispatchNext()
  }

  function onerr(err) {
    if (err) { 
      inspect(currentMsg);
      t.fail(insp(err)); 
      return t.end(); 
    }
  }

  dispatchNext()

})
