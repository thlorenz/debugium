'use strict';

var StaticServer = require('node-static').Server
  , path = require('path')
  , http = require('http')
  , format = require('util').format
  , WS = 'localhost'
  , processName = (process.mainModule && path.basename(process.mainModule.filename)) || 'repl'

var sample =  // /json/list
[ {
   "description": "",
   "devtoolsFrontendUrl": "/devtools/devtools.html?ws=localhost:9221/devtools/page/1044C73E-056D-44EF-A0D6-F0D5BEA7C830",
   "faviconUrl": "https://www.google.com/favicon.ico",
   "id": "1044C73E-056D-44EF-A0D6-F0D5BEA7C830",
   "title": "New Tab",
   "type": "page",
   "url": "chrome://newtab/",
   "webSocketDebuggerUrl": "ws://localhost:9221/devtools/page/1044C73E-056D-44EF-A0D6-F0D5BEA7C830"
} ]

var PORT = 8222;

var go = module.exports = function start(opts) {
  opts = opts || {}
  var port = opts.port || PORT;
  var files = new StaticServer(path.join(__dirname, '..', '..', 'front-end'))
  var server = http.createServer();

  function sendInspectablePages(req, res) {
    var json = JSON.stringify( [ 
        { description         : 'debugium process'
        , devtoolsFrontendUrl : format('/devtools/devtools.html?ws=%s:%d/devtools/node-process/%s', WS, port, process.pid)
        , faviconUrl          : 'http://nodejs.org/favicon.ico'
        , title               : format('debugiumed node process %s (%d)', processName, process.pid)
        , type                : 'process'
        , url                 : process.versions
        , webSocketDebuggerUrl: format('ws://%s:%d/devtools/node-process/%s', WS, port, process.pid)
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
    .on('listening', onlistening)
    .on('upgrade', onupgrade)
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
    console.log('Listening on ', port)
  }

  function onupgrade(req, socket, head) {
    console.log('upgrade')
  }
}

go()
