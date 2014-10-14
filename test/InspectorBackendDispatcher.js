'use strict';
/*jshint asi: true */

var test = require('tap').test

var ibd = require('../lib/InspectorBackendDispatcher')()
  , sortOutMessages = require('./common/sort-out-messages')

var messages = sortOutMessages('click-me-init')
  , outgoing = Object.keys(messages.outgoing).map(function (x) { return messages.outgoing[x] })
  , incoming = messages.incoming


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
    t.pass('handles msg  ' + insp(currentMsg))
    t.equal(currentMsg.id, msg.id, 'replies with correct id')
    t.deepEqual(msg, incoming[msg.id], 'result is as expected')
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
