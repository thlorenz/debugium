'use strict';
var protocolErrors      = require('./protocol-errors')
  , reportProtocolError = protocolErrors.reportProtocolError
  , commonErrors        = protocolErrors.commonErrors
  , invalidParams       = protocolErrors.invalidParams
  , callbacks           = require('./callbacks')
  , cannot              = callbacks.cannot
  , notImplemented      = callbacks.notImplemented

function InspectorBackendDispatcher_Page(pageAgent) {
  if (!(this instanceof InspectorBackendDispatcher_Page)) return new InspectorBackendDispatcher_Page(pageAgent);

  this._pageAgent = pageAgent;
}
module.exports = InspectorBackendDispatcher_Page;

var proto = InspectorBackendDispatcher_Page.prototype;

function reportAgentNotAvailable(callId, method, cb) {
  reportProtocolError(callId, commonErrors.InvalidParams, invalidParams(method), [ 'Page handler is not available.' ], cb);
}

proto.enable = function enable(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.enable', cb);
  this._pageAgent.enable(callbacks.success(msg, cb));
}

proto.disable = function disable(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.disable', cb);
  this._pageAgent.disable(callbacks.success(msg, cb));
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
  this._pageAgent.reload(callbacks.success(msg, cb));
}

proto.navigate = function navigate(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.navigate', cb);
  this._pageAgent.navigate(callbacks.success(msg, cb));
}

proto.getCookies = function getCookies(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.getCookies', cb);
  notImplemented(msg, cb);
}

proto.deleteCookie = function deleteCookie(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.deleteCookie', cb);
  this._pageAgent.deleteCookie(callbacks.success(msg, cb));
}

proto.getResourceTree = function getResourceTree(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.getResourceTree', cb);
  this._pageAgent.getResourceTree(msg.id, callbacks.resultOrError(msg, cb))
}

proto.getResourceContent = function getResourceContent(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.getResourceContent', cb);
  if (!msg.params || !msg.params.url) return reportProtocolError(msg.id, commonErrors.ServerError, 'Page.getResourceContent requires a msg.params.url field.')
  this._pageAgent.getResourceContent(msg.params.url, callbacks.resultOrError(msg, cb));
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
  this._pageAgent.setDeviceMetricsOverride(callbacks.success(msg, cb));
}

proto.clearDeviceMetricsOverride = function clearDeviceMetricsOverride(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.clearDeviceMetricsOverride', cb);
  this._pageAgent.clearDeviceMetricsOverride(callbacks.success(msg, cb));
}

proto.resetScrollAndPageScaleFactor = function resetScrollAndPageScaleFactor(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.resetScrollAndPageScaleFactor', cb);
  this._pageAgent.resetScrollAndPageScaleFactor(callbacks.success(msg, cb));
}

proto.setPageScaleFactor = function setPageScaleFactor(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setPageScaleFactor', cb);
  this._pageAgent.setPageScaleFactor(callbacks.success(msg, cb));
}

proto.setShowPaintRects = function setShowPaintRects(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setShowPaintRects', cb);
  this._pageAgent.setShowPaintRects(callbacks.success(msg, cb));
}

proto.setShowDebugBorders = function setShowDebugBorders(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setShowDebugBorders', cb);
  this._pageAgent.setShowDebugBorders(callbacks.success(msg, cb));
}

proto.setShowFPSCounter = function setShowFPSCounter(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setShowFPSCounter', cb);
  this._pageAgent.setShowFPSCounter(callbacks.success(msg, cb));
}

proto.setContinuousPaintingEnabled = function setContinuousPaintingEnabled(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setContinuousPaintingEnabled', cb);
  this._pageAgent.setContinuousPaintingEnabled(callbacks.success(msg, cb));
}

proto.setShowScrollBottleneckRects = function setShowScrollBottleneckRects(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setShowScrollBottleneckRects', cb);
  this._pageAgent.setShowScrollBottleneckRects(callbacks.success(msg, cb));
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
  this._pageAgent.setGeolocationOverride(callbacks.success(msg, cb));
}

proto.clearGeolocationOverride = function clearGeolocationOverride(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.clearGeolocationOverride', cb);
  this._pageAgent.clearGeolocationOverride(callbacks.success(msg, cb));
}

proto.setDeviceOrientationOverride = function setDeviceOrientationOverride(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setDeviceOrientationOverride', cb);
  this._pageAgent.setDeviceOrientationOverride(callbacks.success(msg, cb));
}

proto.clearDeviceOrientationOverride = function clearDeviceOrientationOverride(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.clearDeviceOrientationOverride', cb);
  this._pageAgent.clearDeviceOrientationOverride(callbacks.success(msg, cb));
}

proto.setTouchEmulationEnabled = function setTouchEmulationEnabled(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setTouchEmulationEnabled', cb);
  this._pageAgent.setTouchEmulationEnabled(callbacks.success(msg, cb));
}

proto.setEmulatedMedia = function setEmulatedMedia(msg, cb) {
  if (!this._pageAgent) return reportAgentNotAvailable(msg.id, 'Page.setEmulatedMedia', cb);
  this._pageAgent.setEmulatedMedia(callbacks.success(msg, cb));
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
  this._pageAgent.setShowViewportSizeOnResize(callbacks.success(msg, cb));
}
