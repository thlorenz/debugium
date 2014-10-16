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

var dev = ~process.argv.indexOf('--dev')

var go = module.exports = function start(opts) {
  opts = opts || {}
  var port = opts.port || PORT
    , ws_port = opts.ws_port || PORT + 1

  var files = new StaticServer(path.join(__dirname, '..', '..', dev ? 'front-end-dev' : 'front-end'))
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

    log.http(req.method, req.url)


    if (req.url === '/json/list') return sendInspectablePages(req, res);
    if (req.url === '/') req.url = '/devtools_discovery_page.html';

    req.url = req.url.replace(/^\/devtools\//, '/')

    req.on('end', onend).resume()
    function onend() { files.serve(req, res) }
  }

  function onlistening() {
    var addr = this.address();
    log.info('init', 'Server listening on http://%s:%d', addr.address, addr.port)
  }

  /*
   * Todo(thlorenz) right now this is all part of the same app for development purposes.
   * The server will become separate app and websocket + dispatcher/handler code will run inside debugged process.
   *
   * - the websocket handles all protocol messages (speaks blink)
   *    - will be listening in debugged process on separate thread (run loop) created via v8 Isolate, creating a multi env
   *    - a uv thread may be used to start up that extra Isolate
   *    - no debugium code will be run inside node Isolate
   *    - no scripts are injected into the node Isolate either
   *    - no need to cross Isolates since thats supplied via v8's DebuggerContext
   *
   * - the server will be inside a separate process and receive the websocket port via cli arg
   *   - it serves all front end assets
   */
  require('./websocket')({ port: ws_port })
}


go()
