'use strict';

// Ports: https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/core/inspector/InspectorPageAgent.cpp

var findAppScripts = require('./find-app-scripts.js')
  , inspectorUrl = require('./inspector-url.js')

function toResource(script) {
  return {
      url      : inspectorUrl(script)
    , type     : 'Script'
    , mimeType : 'application/javascript'
  }
}

function mapToResourceTree(main, scripts) {
  return {
      frame: {
          id       : 'debugium toplevel frame'
        , url      : inspectorUrl(main)
        , loaderId : process.pid
      }
    , resources: scripts.map(toResource) 
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

  findAppScripts(onFoundAppScripts)

  function onFoundAppScripts(err, app) {
    if (err) return cb(err);
    app.resourceTree = mapToResourceTree(app.main, app.scripts)

    self._app = app
    cb(null, app.resourceTree)
  }
}
