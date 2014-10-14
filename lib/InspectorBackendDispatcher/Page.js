'use strict';
var protocolErrors      = require('./protocol-errors')
  , reportProtocolError = protocolErrors.reportProtocolError
  , commonErrors        = protocolErrors.commonErrors
  , invalidParams       = protocolErrors.invalidParams

function cannot(msg, cb) {
 cb(null, { id: msg.id, result: { result: false } })
}

function notImplemented(msg, cb) {
  cb(new Error('Unfortunately ' + msg.method + ' has not been implemented.'))
}

function noop(msg, cb) {
  cb(null, { id: msg.id, result: {} })
}

function successCallback(msg, cb) {
  return function onsuccess() { 
    cb(null, { id: msg.id, result: {} })
  }
}

function resultOrErrorCallback(msg, cb) {
  return function onresponse(err, result) {
    if (err) return reportProtocolError(msg.id, commonErrors.ServerError, err.toString(), err.data)
    cb(null, { id: msg.id, result: result })
  }
}

function InspectorBackendDispatcher_Page(pageAgent) {
  if (!(this instanceof InspectorBackendDispatcher_Page)) return new InspectorBackendDispatcher_Page(pageAgent);

  // We will most likely NEVER have a console agent
  this._pageAgent = pageAgent;
}
module.exports = InspectorBackendDispatcher_Page;

var proto = InspectorBackendDispatcher_Page.prototype;

function reportAgentNotAvailable(callId, method, cb) {
  reportProtocolError(callId, commonErrors.InvalidParams, invalidParams(method), [ 'Page handler is not available.' ], cb);
}

proto.enable = function enable(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.enable', cb);
  this._pageAgent.enable(successCallback(msg, cb));
}

proto.disable = function disable(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.disable', cb);
  this._pageAgent.disable(successCallback(msg, cb));
}

proto.addScriptToEvaluateOnLoad = function addScriptToEvaluateOnLoad(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.addScriptToEvaluateOnLoad', cb);
  notImplemented(msg, cb);
}

proto.removeScriptToEvaluateOnLoad = function removeScriptToEvaluateOnLoad(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.removeScriptToEvaluateOnLoad', cb);
  notImplemented(msg, cb);
}

proto.reload = function reload(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.reload', cb);
  noop(msg, cb)
}

proto.navigate = function navigate(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.navigate', cb);
  noop(msg, cb)
}

proto.getCookies = function getCookies(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.getCookies', cb);
  notImplemented(msg, cb);
}

proto.deleteCookie = function deleteCookie(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.deleteCookie', cb);
  noop(msg, cb)
}

proto.getResourceTree = function getResourceTree(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.getResourceTree', cb);
  this._pageAgent.getResourceTree(resultOrErrorCallback(msg, cb))
}

proto.getResourceContent = function getResourceContent(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.getResourceContent', cb);
  notImplemented(msg, cb);
}

proto.searchInResource = function searchInResource(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.searchInResource', cb);
  notImplemented(msg, cb);
}

proto.setDocumentContent = function setDocumentContent(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setDocumentContent', cb);
  notImplemented(msg, cb);
}

proto.setDeviceMetricsOverride = function setDeviceMetricsOverride(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setDeviceMetricsOverride', cb);
  noop(msg, cb)
}

proto.clearDeviceMetricsOverride = function clearDeviceMetricsOverride(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.clearDeviceMetricsOverride', cb);
  noop(msg, cb)
}

proto.resetScrollAndPageScaleFactor = function resetScrollAndPageScaleFactor(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.resetScrollAndPageScaleFactor', cb);
  noop(msg, cb)
}

proto.setPageScaleFactor = function setPageScaleFactor(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setPageScaleFactor', cb);
  noop(msg, cb)
}

proto.setShowPaintRects = function setShowPaintRects(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setShowPaintRects', cb);
  noop(msg, cb)
}

proto.setShowDebugBorders = function setShowDebugBorders(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setShowDebugBorders', cb);
  noop(msg, cb)
}

proto.setShowFPSCounter = function setShowFPSCounter(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setShowFPSCounter', cb);
  noop(msg, cb)
}

proto.setContinuousPaintingEnabled = function setContinuousPaintingEnabled(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setContinuousPaintingEnabled', cb);
  noop(msg, cb)
}

proto.setShowScrollBottleneckRects = function setShowScrollBottleneckRects(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setShowScrollBottleneckRects', cb);
  noop(msg, cb)
}

proto.getScriptExecutionStatus = function getScriptExecutionStatus(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.getScriptExecutionStatus', cb);
  notImplemented(msg, cb);
}

proto.setScriptExecutionDisabled = function setScriptExecutionDisabled(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setScriptExecutionDisabled', cb);
  notImplemented(msg, cb);
}

proto.setGeolocationOverride = function setGeolocationOverride(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setGeolocationOverride', cb);
  noop(msg, cb)
}

proto.clearGeolocationOverride = function clearGeolocationOverride(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.clearGeolocationOverride', cb);
  noop(msg, cb)
}

proto.setDeviceOrientationOverride = function setDeviceOrientationOverride(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setDeviceOrientationOverride', cb);
  noop(msg, cb)
}

proto.clearDeviceOrientationOverride = function clearDeviceOrientationOverride(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.clearDeviceOrientationOverride', cb);
  noop(msg, cb)
}

proto.setTouchEmulationEnabled = function setTouchEmulationEnabled(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setTouchEmulationEnabled', cb);
  noop(msg, cb)
}

proto.setEmulatedMedia = function setEmulatedMedia(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setEmulatedMedia', cb);
  noop(msg, cb)
}

proto.startScreencast = function startScreencast(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.startScreencast', cb);
  notImplemented(msg, cb);
}

proto.stopScreencast = function stopScreencast(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.stopScreencast', cb);
  notImplemented(msg, cb);
}

proto.setShowViewportSizeOnResize = function setShowViewportSizeOnResize(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setShowViewportSizeOnResize', cb);
  noop(msg, cb)
}
