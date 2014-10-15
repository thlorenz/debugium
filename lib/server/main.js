'use strict';

var StaticServer = require('node-static').Server
  , path         = require('path')
  , http         = require('http')
  , format       = require('util').format
  , log          = require('npmlog')
  , WS           = 'localhost'
  , processName  = (process.mainModule && path.basename(process.mainModule.filename)) || 'repl'

var PORT = 8222;
log.level = 'silly';

var go = module.exports = function start(opts) {
  opts = opts || {}
  var port = opts.port || PORT
    , ws_port = opts.ws_port || PORT + 1

  var files = new StaticServer(path.join(__dirname, '..', '..', 'front-end'))
  var server = http.createServer();

  function sendInspectablePages(req, res) {
    var json = JSON.stringify( [ 
        { description         : 'debugium process'
        , devtoolsFrontendUrl : format('/devtools/devtools.html?ws=%s:%d/devtools/node-process/%s', WS, ws_port, process.pid)
        , faviconUrl          : 'http://nodejs.org/favicon.ico'
        , title               : format('debugiumed node process %s (%d)', processName, process.pid)
        , type                : 'process'
        , url                 : process.versions
        , webSocketDebuggerUrl: format('ws://%s:%d/devtools/node-process/%s', WS, ws_port, process.pid)
        }
      ])
    res.writeHead(200, {
        'Content-Length': json.length
      , 'Content-Type': 'application/json'
    })
    res.end(json)
  }

  server
    .on('request', onrequest)
    .once('listening', onlistening)
    .listen(port)

  function onrequest(req, res) {

    console.log('%s %s', req.method, req.url)


    if (req.url === '/json/list') return sendInspectablePages(req, res);
    if (req.url === '/') req.url = '/devtools_discovery_page.html';

    req.url = req.url.replace(/^\/devtools\//, '/')

    req.on('end', onend).resume()
    function onend() { files.serve(req, res) }
  }

  function onlistening() {
    var addr = this.address();
    console.log('Listening on http://%s:%d', addr.address, addr.port)
  }

  // @todo: consider running main server in other process and only the websocket within the process being debugged
  require('./websocket')({ port: ws_port })
}


go()
