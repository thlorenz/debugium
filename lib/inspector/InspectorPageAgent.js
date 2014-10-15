'use strict';

// Ports: https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/core/inspector/InspectorPageAgent.cpp

var findAppScripts = require('./find-app-scripts.js')
  , pathToInspectorUrl = require('./inspector-url.js').pathToInspectorUrl
  , loadScriptSource = require('./load-script-source')

function ignore(cb) { cb() }

function toResource(script) {
  return {
      url      : pathToInspectorUrl(script)
    , type     : 'Script'
    , mimeType : 'application/javascript'
  }
}

function mapToResourceTree(main, scripts) {
  return { 
    frameTree: {
        frame: {
            id       : 'debugium toplevel frame'
          , url      : pathToInspectorUrl(main)
          , loaderId : process.pid
        }
      , resources: scripts.map(toResource) 
    }
  }
}

function InspectorPageAgent() {
  if (!(this instanceof InspectorPageAgent)) return new InspectorPageAgent();
  this._enabled = false;
}

module.exports = InspectorPageAgent;
var proto = InspectorPageAgent.prototype;

proto.enable = function enable(cb) {
  this._enabled = true;
  cb()
}

proto.disable = function disable(cb) {
  this._enabled = false;
  cb()
}

proto.getResourceTree = function getResourceTree(cb) {
  var self = this;

  // TODO: include core modules here which we can only get by getting notified via v8DebugEvent
  // @see: https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/bindings/core/v8/ScriptDebugServer.cpp&rcl=1413174461&l=515
  
  findAppScripts(onFoundAppScripts)

  function onFoundAppScripts(err, app) {
    if (err) return cb(err);
    app.resourceTree = mapToResourceTree(app.main, app.scripts)

    self._app = app
    cb(null, app.resourceTree)
  }
}

proto.getResourceContent = function getResourceContent(url, cb) {
  loadScriptSource(url, onloaded)
  function onloaded(err, src) {
    if (err) return cb(err);
    cb(null, { content: src, base64Encoded: false })
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
