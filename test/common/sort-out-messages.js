'use strict';

var fs = require('fs')

function byIdThenDirection(a, b) {
  var aid = parseInt(a.id)
    , bid = parseInt(b.id)

  if (aid < bid) return -1;

  if (aid === bid && a.direction === '=>') return -1;
  return 1;
}

module.exports = function sortOutMessages(file) {
  var json = '[\n' + fs.readFileSync(__dirname + '/../messages/' + file + '.json', 'utf8').slice(0, -2) + ']'
  var messages = JSON.parse(json).sort(byIdThenDirection);

  var outgoing = {}
    , incoming = {} 

  messages.forEach(function (msg) {
    var direction = msg.direction;
    delete msg.direction;
    if (direction === '=>') outgoing[msg.id] = msg;
    else                    incoming[msg.id] = msg;
  })

  return { outgoing: outgoing, incoming: incoming };
}

