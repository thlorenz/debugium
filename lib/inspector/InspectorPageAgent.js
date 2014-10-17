'use strict';

// Ports: https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/core/inspector/InspectorPageAgent.cpp

var findAppScripts     = require('./find-app-scripts.js')
  , pathToInspectorUrl = require('./inspector-url.js').pathToInspectorUrl
  , loadScriptSource   = require('./load-script-source')
  , scripts            = require('./scripts')
  , path               = require('path')
  , util               = require('util')
  , EE                 = require('events').EventEmitter

function ignore(cb) { cb() }

function toResource(script) {
  var url = pathToInspectorUrl(script);
  scripts.add(url, script);
  return {
      url      : url
    , type     : 'Script'
    , mimeType : 'application/javascript'
  }
}

function mapToResourceTree(id, loaderId, main, root, scripts) {
  var rootUrl = pathToInspectorUrl(root);
  return { 
    frameTree              : {
        frame              : {
            id             : id 
          , loaderId       : loaderId 
          , url            : pathToInspectorUrl(main)
          , mimeType       : 'application/javascript'
          , securityOrigin : pathToInspectorUrl(root)
        }
      , resources: scripts.map(toResource) 
    }
  }
}

function InspectorPageAgent() {
  if (!(this instanceof InspectorPageAgent)) return new InspectorPageAgent();

  this._enabled = false;
  this.frameId       = process.pid + '.1';
  this.frameLoaderId = process.pid + '.2';
}

util.inherits(InspectorPageAgent, EE);
module.exports = InspectorPageAgent;
var proto = InspectorPageAgent.prototype;

proto._Runtime_executionContextCreated = function _Runtime_executionContextCreated(id) {
  // https://code.google.com/p/chromium/codesearch#chromium/src/out/Debug/gen/blink/core/InspectorFrontend.cpp&l=223
  // sample message:
  // {"method":"Runtime.executionContextCreated","params":{"context":{"id":7,"isPageContext":true,"name":"","origin":"","frameId":"12468.1"}}}  
  this.emit('message', { 
      method: 'Runtime.executionContextCreated'
    , params: {
        context: {
            id: id
          , isPageContext: true
          , name: ''
          , origin: ''
          , frameId: this.frameId
        }
    }
  })
}

proto._Debugger_scriptParsed = function _Debugger_scriptParsed(script) {
  // https://code.google.com/p/chromium/codesearch#chromium/src/out/Debug/gen/blink/core/InspectorFrontend.cpp&l=808
  // sample message: 
  // {"method":"Debugger.scriptParsed","params":{"scriptId":"30","url":"http://thlorenz.github.io/debugium/main.js","startLine":0,"startColumn":0,"endLine":12,"endColumn":0}}

  this.emit('message', {
      method: 'Debugger.scriptParsed'
    , params: {
        scriptId    : script.id
      , url         : script.url
      , startLine   : script.startLine
      , startColumn : script.startColumn
      , endLine     : script.endLine
      , endColumn   : script.endColumn
    }
  })
}


proto.enable = function enable(cb) {
  this._enabled = true;
  cb()
}

proto.disable = function disable(cb) {
  this._enabled = false;
  cb()
}

proto.getResourceTree = function getResourceTree(msgId, cb) {
  var self = this;

  // TODO: include core modules here which we can only get by getting notified via v8DebugEvent
  // @see: https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/bindings/core/v8/ScriptDebugServer.cpp&rcl=1413174461&l=515
  
  findAppScripts(onFoundAppScripts)

  function onFoundAppScripts(err, app) {
    if (err) return cb(err);
    app.resourceTree = mapToResourceTree(self.frameId, self.frameLoaderId, app.main, app.root, app.scripts)

    self._app = app
    cb(null, app.resourceTree)
    self._Runtime_executionContextCreated(msgId);
  }
}

proto.getResourceContent = function getResourceContent(url, cb) {
  var self = this;
  loadScriptSource(url, onloaded)
  function onloaded(err, src) {
    if (err) return cb(err);
    cb(null, { content: src, base64Encoded: false })
    self._Debugger_scriptParsed(scripts.byUrl[url])
  }
}

proto.clearDeviceMetricsOverride     = ignore
proto.resetScrollAndPageScaleFactor  = ignore
proto.setPageScaleFactor             = ignore
proto.setShowPaintRects              = ignore
proto.setShowDebugBorders            = ignore
proto.setShowFPSCounter              = ignore
proto.setContinuousPaintingEnabled   = ignore
proto.setShowScrollBottleneckRects   = ignore
proto.clearGeolocationOverride       = ignore
proto.setDeviceOrientationOverride   = ignore
proto.clearDeviceOrientationOverride = ignore
proto.setTouchEmulationEnabled       = ignore
proto.setEmulatedMedia               = ignore
proto.setShowViewportSizeOnResize    = ignore
