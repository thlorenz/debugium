'use strict';
/*jshint asi: true */

var test = require('tap').test

var ibd = require('../lib/InspectorBackendDispatcher/InspectorBackendDispatcher')()
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

test('\ndispatching messages for click-me-init one at a time', function (t) {
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
    inspect(msg)
    inspect(expectedMsg)
    t.deepEqual(msg, expectedMsg, 'result is as expected')
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
