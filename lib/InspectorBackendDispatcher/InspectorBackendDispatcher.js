'use strict';

// Port of: https://code.google.com/p/chromium/codesearch#chromium/src/out/Debug/gen/blink/core/InspectorBackendDispatcher.cpp

var util    = require('util')
  , EE      = require('events').EventEmitter
  , Console = require('./Console')
  , Network = require('./Network')

function notImplemented(msg, cb) {
  cb(new Error('Not Implemented!'));
}

function cannot(msg, cb) {
 cb(null, { id: msg.id, result: { result: false } })
}

function can(msg, cb) {
  cb(null, { id: msg.id, result: { result: true } })
}

function InspectorBackendDispatcher(opts) {
  if (!(this instanceof InspectorBackendDispatcher)) return new InspectorBackendDispatcher(opts);
  opts = opts || {}

  this._console = new Console(opts.consoleAgent)
  this._network = new Network(opts.networkAgent)

  this._registerMethods()
}

util.inherits(InspectorBackendDispatcher, EE)
var proto = InspectorBackendDispatcher.prototype;

module.exports = InspectorBackendDispatcher;

proto.dispatch = function dispatch(msg) {
  var self = this;

  var fn = this._methods[msg.method] || this._registeredMethods[msg.method]
  if (!fn) return this.emit('error', { id: msg.id, error: 'Unknown method: ' + msg.method });

  function onMsgProcessed(err, resultMsg) {
    if (err) return self.emit('error', { id: msg.id, error: err })
    self.emit('message', resultMsg)
  }

  fn(msg, onMsgProcessed) 
}

proto._registerMethods = function _registerMethods() {
  // https://code.google.com/p/chromium/codesearch#chromium/src/out/Debug/gen/blink/core/InspectorBackendDispatcher.cpp&l=19
  this._methods = {
      'Inspector.enable'                                 : notImplemented
    , 'Inspector.disable'                                : notImplemented
    , 'Inspector.reset'                                  : notImplemented
    , 'Memory.getDOMCounters'                            : notImplemented
    , 'Page.enable'                                      : notImplemented
    , 'Page.disable'                                     : notImplemented
    , 'Page.addScriptToEvaluateOnLoad'                   : notImplemented
    , 'Page.removeScriptToEvaluateOnLoad'                : notImplemented
    , 'Page.reload'                                      : notImplemented
    , 'Page.navigate'                                    : notImplemented
    , 'Page.getCookies'                                  : notImplemented
    , 'Page.deleteCookie'                                : notImplemented
    , 'Page.getResourceTree'                             : notImplemented
    , 'Page.getResourceContent'                          : notImplemented
    , 'Page.searchInResource'                            : notImplemented
    , 'Page.setDocumentContent'                          : notImplemented
    , 'Page.setDeviceMetricsOverride'                    : notImplemented
    , 'Page.clearDeviceMetricsOverride'                  : notImplemented
    , 'Page.resetScrollAndPageScaleFactor'               : notImplemented
    , 'Page.setPageScaleFactor'                          : notImplemented
    , 'Page.setShowPaintRects'                           : notImplemented
    , 'Page.setShowDebugBorders'                         : notImplemented
    , 'Page.setShowFPSCounter'                           : notImplemented
    , 'Page.setContinuousPaintingEnabled'                : notImplemented
    , 'Page.setShowScrollBottleneckRects'                : notImplemented
    , 'Page.getScriptExecutionStatus'                    : notImplemented
    , 'Page.setScriptExecutionDisabled'                  : notImplemented
    , 'Page.setGeolocationOverride'                      : notImplemented
    , 'Page.clearGeolocationOverride'                    : notImplemented
    , 'Page.setDeviceOrientationOverride'                : notImplemented
    , 'Page.clearDeviceOrientationOverride'              : notImplemented
    , 'Page.setTouchEmulationEnabled'                    : notImplemented
    , 'Page.setEmulatedMedia'                            : notImplemented
    , 'Page.startScreencast'                             : notImplemented
    , 'Page.stopScreencast'                              : notImplemented
    , 'Page.setShowViewportSizeOnResize'                 : notImplemented
    , 'Runtime.evaluate'                                 : notImplemented
    , 'Runtime.callFunctionOn'                           : notImplemented
    , 'Runtime.getProperties'                            : notImplemented
    , 'Runtime.releaseObject'                            : notImplemented
    , 'Runtime.releaseObjectGroup'                       : notImplemented
    , 'Runtime.run'                                      : notImplemented
    , 'Runtime.enable'                                   : notImplemented
    , 'Runtime.disable'                                  : notImplemented
    , 'Runtime.isRunRequired'                            : notImplemented
    , 'Console.enable'                                   : this._console.enable.bind(this._console)
    , 'Console.disable'                                  : this._console.disable.bind(this._console)
    , 'Console.clearMessages'                            : this._console.clearMessages.bind(this._console)
    , 'Console.setMonitoringXHREnabled'                  : this._console.setMonitoringXHREnabled.bind(this._console)
    , 'Console.addInspectedNode'                         : this._console.addInspectedNode.bind(this._console)
    , 'Console.addInspectedHeapObject'                   : this._console.addInspectedHeapObject.bind(this._console)
    , 'Console.setTracingBasedTimeline'                  : this._console.setTracingBasedTimeline.bind(this._console)
    , 'Network.enable'                                   : this._network.enable.bind(this._network)
    , 'Network.disable'                                  : this._network.disable.bind(this._network)
    , 'Network.setUserAgentOverride'                     : this._network.setUserAgentOverride.bind(this._network)
    , 'Network.setExtraHTTPHeaders'                      : this._network.setExtraHTTPHeaders.bind(this._network)
    , 'Network.getResponseBody'                          : this._network.getResponseBody.bind(this._network)
    , 'Network.replayXHR'                                : this._network.replayXHR.bind(this._network)
    , 'Network.canClearBrowserCache'                     : this._network.canClearBrowserCache.bind(this._network)
    , 'Network.canClearBrowserCookies'                   : this._network.canClearBrowserCookies.bind(this._network)
    , 'Network.emulateNetworkConditions'                 : this._network.emulateNetworkConditions.bind(this._network)
    , 'Network.setCacheDisabled'                         : this._network.setCacheDisabled.bind(this._network)
    , 'Network.loadResourceForFrontend'                  : notImplemented
    , 'Database.enable'                                  : notImplemented
    , 'Database.disable'                                 : notImplemented
    , 'Database.getDatabaseTableNames'                   : notImplemented
    , 'Database.executeSQL'                              : notImplemented
    , 'IndexedDB.enable'                                 : notImplemented
    , 'IndexedDB.disable'                                : notImplemented
    , 'IndexedDB.requestDatabaseNames'                   : notImplemented
    , 'IndexedDB.requestDatabase'                        : notImplemented
    , 'IndexedDB.requestData'                            : notImplemented
    , 'IndexedDB.clearObjectStore'                       : notImplemented
    , 'DOMStorage.enable'                                : notImplemented
    , 'DOMStorage.disable'                               : notImplemented
    , 'DOMStorage.getDOMStorageItems'                    : notImplemented
    , 'DOMStorage.setDOMStorageItem'                     : notImplemented
    , 'DOMStorage.removeDOMStorageItem'                  : notImplemented
    , 'ApplicationCache.getFramesWithManifests'          : notImplemented
    , 'ApplicationCache.enable'                          : notImplemented
    , 'ApplicationCache.getManifestForFrame'             : notImplemented
    , 'ApplicationCache.getApplicationCacheForFrame'     : notImplemented
    , 'FileSystem.enable'                                : notImplemented
    , 'FileSystem.disable'                               : notImplemented
    , 'FileSystem.requestFileSystemRoot'                 : notImplemented
    , 'FileSystem.requestDirectoryContent'               : notImplemented
    , 'FileSystem.requestMetadata'                       : notImplemented
    , 'FileSystem.requestFileContent'                    : notImplemented
    , 'FileSystem.deleteEntry'                           : notImplemented
    , 'DOM.enable'                                       : notImplemented
    , 'DOM.disable'                                      : notImplemented
    , 'DOM.getDocument'                                  : notImplemented
    , 'DOM.requestChildNodes'                            : notImplemented
    , 'DOM.querySelector'                                : notImplemented
    , 'DOM.querySelectorAll'                             : notImplemented
    , 'DOM.setNodeName'                                  : notImplemented
    , 'DOM.setNodeValue'                                 : notImplemented
    , 'DOM.removeNode'                                   : notImplemented
    , 'DOM.setAttributeValue'                            : notImplemented
    , 'DOM.setAttributesAsText'                          : notImplemented
    , 'DOM.removeAttribute'                              : notImplemented
    , 'DOM.getEventListenersForNode'                     : notImplemented
    , 'DOM.getOuterHTML'                                 : notImplemented
    , 'DOM.setOuterHTML'                                 : notImplemented
    , 'DOM.performSearch'                                : notImplemented
    , 'DOM.getSearchResults'                             : notImplemented
    , 'DOM.discardSearchResults'                         : notImplemented
    , 'DOM.requestNode'                                  : notImplemented
    , 'DOM.setInspectModeEnabled'                        : notImplemented
    , 'DOM.highlightRect'                                : notImplemented
    , 'DOM.highlightQuad'                                : notImplemented
    , 'DOM.highlightNode'                                : notImplemented
    , 'DOM.hideHighlight'                                : notImplemented
    , 'DOM.highlightFrame'                               : notImplemented
    , 'DOM.pushNodeByPathToFrontend'                     : notImplemented
    , 'DOM.pushNodesByBackendIdsToFrontend'              : notImplemented
    , 'DOM.resolveNode'                                  : notImplemented
    , 'DOM.getAttributes'                                : notImplemented
    , 'DOM.copyTo'                                       : notImplemented
    , 'DOM.moveTo'                                       : notImplemented
    , 'DOM.undo'                                         : notImplemented
    , 'DOM.redo'                                         : notImplemented
    , 'DOM.markUndoableState'                            : notImplemented
    , 'DOM.focus'                                        : notImplemented
    , 'DOM.setFileInputFiles'                            : notImplemented
    , 'DOM.getBoxModel'                                  : notImplemented
    , 'DOM.getNodeForLocation'                           : notImplemented
    , 'DOM.getRelayoutBoundary'                          : notImplemented
    , 'CSS.enable'                                       : notImplemented
    , 'CSS.disable'                                      : notImplemented
    , 'CSS.getMatchedStylesForNode'                      : notImplemented
    , 'CSS.getInlineStylesForNode'                       : notImplemented
    , 'CSS.getComputedStyleForNode'                      : notImplemented
    , 'CSS.getPlatformFontsForNode'                      : notImplemented
    , 'CSS.getStyleSheetText'                            : notImplemented
    , 'CSS.setStyleSheetText'                            : notImplemented
    , 'CSS.setPropertyText'                              : notImplemented
    , 'CSS.setRuleSelector'                              : notImplemented
    , 'CSS.createStyleSheet'                             : notImplemented
    , 'CSS.addRule'                                      : notImplemented
    , 'CSS.forcePseudoState'                             : notImplemented
    , 'CSS.getMediaQueries'                              : notImplemented
    , 'Timeline.enable'                                  : notImplemented
    , 'Timeline.disable'                                 : notImplemented
    , 'Timeline.start'                                   : notImplemented
    , 'Timeline.stop'                                    : notImplemented
    , 'Debugger.enable'                                  : notImplemented
    , 'Debugger.disable'                                 : notImplemented
    , 'Debugger.setBreakpointsActive'                    : notImplemented
    , 'Debugger.setSkipAllPauses'                        : notImplemented
    , 'Debugger.setBreakpointByUrl'                      : notImplemented
    , 'Debugger.setBreakpoint'                           : notImplemented
    , 'Debugger.removeBreakpoint'                        : notImplemented
    , 'Debugger.continueToLocation'                      : notImplemented
    , 'Debugger.stepOver'                                : notImplemented
    , 'Debugger.stepInto'                                : notImplemented
    , 'Debugger.stepOut'                                 : notImplemented
    , 'Debugger.pause'                                   : notImplemented
    , 'Debugger.resume'                                  : notImplemented
    , 'Debugger.searchInContent'                         : notImplemented
    , 'Debugger.canSetScriptSource'                      : notImplemented
    , 'Debugger.setScriptSource'                         : notImplemented
    , 'Debugger.restartFrame'                            : notImplemented
    , 'Debugger.getScriptSource'                         : notImplemented
    , 'Debugger.getFunctionDetails'                      : notImplemented
    , 'Debugger.getCollectionEntries'                    : notImplemented
    , 'Debugger.setPauseOnExceptions'                    : notImplemented
    , 'Debugger.evaluateOnCallFrame'                     : notImplemented
    , 'Debugger.compileScript'                           : notImplemented
    , 'Debugger.runScript'                               : notImplemented
    , 'Debugger.setOverlayMessage'                       : notImplemented
    , 'Debugger.setVariableValue'                        : notImplemented
    , 'Debugger.getStepInPositions'                      : notImplemented
    , 'Debugger.getBacktrace'                            : notImplemented
    , 'Debugger.skipStackFrames'                         : notImplemented
    , 'Debugger.setAsyncCallStackDepth'                  : notImplemented
    , 'Debugger.enablePromiseTracker'                    : notImplemented
    , 'Debugger.disablePromiseTracker'                   : notImplemented
    , 'Debugger.getPromises'                             : notImplemented
    , 'Debugger.getPromiseById'                          : notImplemented
    , 'DOMDebugger.setDOMBreakpoint'                     : notImplemented
    , 'DOMDebugger.removeDOMBreakpoint'                  : notImplemented
    , 'DOMDebugger.setEventListenerBreakpoint'           : notImplemented
    , 'DOMDebugger.removeEventListenerBreakpoint'        : notImplemented
    , 'DOMDebugger.setInstrumentationBreakpoint'         : notImplemented
    , 'DOMDebugger.removeInstrumentationBreakpoint'      : notImplemented
    , 'DOMDebugger.setXHRBreakpoint'                     : notImplemented
    , 'DOMDebugger.removeXHRBreakpoint'                  : notImplemented
    , 'Profiler.enable'                                  : notImplemented
    , 'Profiler.disable'                                 : notImplemented
    , 'Profiler.setSamplingInterval'                     : notImplemented
    , 'Profiler.start'                                   : notImplemented
    , 'Profiler.stop'                                    : notImplemented
    , 'HeapProfiler.enable'                              : notImplemented
    , 'HeapProfiler.disable'                             : notImplemented
    , 'HeapProfiler.startTrackingHeapObjects'            : notImplemented
    , 'HeapProfiler.stopTrackingHeapObjects'             : notImplemented
    , 'HeapProfiler.takeHeapSnapshot'                    : notImplemented
    , 'HeapProfiler.collectGarbage'                      : notImplemented
    , 'HeapProfiler.getObjectByHeapObjectId'             : notImplemented
    , 'HeapProfiler.getHeapObjectId'                     : notImplemented
    , 'Worker.enable'                                    : notImplemented
    , 'Worker.disable'                                   : notImplemented
    , 'Worker.sendMessageToWorker'                       : notImplemented
    , 'Worker.canInspectWorkers'                         : cannot
    , 'Worker.connectToWorker'                           : notImplemented
    , 'Worker.disconnectFromWorker'                      : notImplemented
    , 'Worker.setAutoconnectToWorkers'                   : notImplemented
    , 'Canvas.enable'                                    : notImplemented
    , 'Canvas.disable'                                   : notImplemented
    , 'Canvas.dropTraceLog'                              : notImplemented
    , 'Canvas.hasUninstrumentedCanvases'                 : notImplemented
    , 'Canvas.captureFrame'                              : notImplemented
    , 'Canvas.startCapturing'                            : notImplemented
    , 'Canvas.stopCapturing'                             : notImplemented
    , 'Canvas.getTraceLog'                               : notImplemented
    , 'Canvas.replayTraceLog'                            : notImplemented
    , 'Canvas.getResourceState'                          : notImplemented
    , 'Canvas.evaluateTraceLogCallArgument'              : notImplemented
    , 'Input.dispatchKeyEvent'                           : notImplemented
    , 'Input.dispatchMouseEvent'                         : notImplemented
    , 'Input.dispatchTouchEvent'                         : notImplemented
    , 'LayerTree.enable'                                 : notImplemented
    , 'LayerTree.disable'                                : notImplemented
    , 'LayerTree.compositingReasons'                     : notImplemented
    , 'LayerTree.makeSnapshot'                           : notImplemented
    , 'LayerTree.loadSnapshot'                           : notImplemented
    , 'LayerTree.releaseSnapshot'                        : notImplemented
    , 'LayerTree.profileSnapshot'                        : notImplemented
    , 'LayerTree.replaySnapshot'                         : notImplemented
    , 'LayerTree.snapshotCommandLog'                     : notImplemented
    , 'Geolocation.setGeolocationOverride'               : notImplemented
    , 'Geolocation.clearGeolocationOverride'             : notImplemented
    , 'DeviceOrientation.setDeviceOrientationOverride'   : notImplemented
    , 'DeviceOrientation.clearDeviceOrientationOverride' : notImplemented
    , 'Tracing.start'                                    : notImplemented
    , 'Tracing.end'                                      : notImplemented
  }

  // Registered here: https://code.google.com/p/chromium/codesearch#chromium/src/out/Debug/gen/content/browser/devtools/protocol/devtools_protocol_handler_impl.cc
  this._registeredMethods = {

    // DevToolsProtocolHandlerImpl::SetPageHandler
    // https://code.google.com/p/chromium/codesearch#chromium/src/out/Debug/gen/content/browser/devtools/protocol/devtools_protocol_handler_impl.cc&l=548
      'Page.canScreencast': cannot
    , 'Page.canEmulate': cannot
  }

}
