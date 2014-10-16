'use strict';

// Port of: https://code.google.com/p/chromium/codesearch#chromium/src/out/Debug/gen/blink/core/InspectorBackendDispatcher.cpp

var util         = require('util')
  , EE           = require('events').EventEmitter
  , Console      = require('./Console')
  , Network      = require('./Network')
  , Page         = require('./Page')
  , HeapProfiler = require('./HeapProfiler')
  , Debugger     = require('./Debugger')
  , Runtime      = require('./Runtime')
  , IndexedDB      = require('./IndexedDB')

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

  this._console      = new Console(opts.consoleAgent)
  this._network      = new Network(opts.networkAgent)
  this._page         = new Page(opts.pageAgent)
  this._heapProfiler = new HeapProfiler(opts.heapProfilerAgent)
  this._debugger     = new Debugger(opts.debuggerAgent)
  this._runtime      = new Runtime(opts.runtimeAgent)
  this._indexedDB      = new IndexedDB(opts.indexedDBAgent)

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
    if (err) {
      self.emit('error', { id: msg.id, error: err })
      // for now at least respond for unimplemented methods in order to keep devtools happy
      // todo: remove this hack once all methods we need should have been implemented
      if (err.message === 'Not Implemented!') self.emit('message', { id: msg.id, result: {} })
      return
    }
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

    , 'Page.enable'                                      : this._page.enable.bind(this._page)
    , 'Page.disable'                                     : this._page.disable.bind(this._page)
    , 'Page.addScriptToEvaluateOnLoad'                   : this._page.addScriptToEvaluateOnLoad.bind(this._page)
    , 'Page.removeScriptToEvaluateOnLoad'                : this._page.removeScriptToEvaluateOnLoad.bind(this._page)
    , 'Page.reload'                                      : this._page.reload.bind(this._page)
    , 'Page.navigate'                                    : this._page.navigate.bind(this._page)
    , 'Page.getCookies'                                  : this._page.getCookies.bind(this._page)
    , 'Page.deleteCookie'                                : this._page.deleteCookie.bind(this._page)
    , 'Page.getResourceTree'                             : this._page.getResourceTree.bind(this._page)
    , 'Page.getResourceContent'                          : this._page.getResourceContent.bind(this._page)
    , 'Page.searchInResource'                            : this._page.searchInResource.bind(this._page)
    , 'Page.setDocumentContent'                          : this._page.setDocumentContent.bind(this._page)
    , 'Page.setDeviceMetricsOverride'                    : this._page.setDeviceMetricsOverride.bind(this._page)
    , 'Page.clearDeviceMetricsOverride'                  : this._page.clearDeviceMetricsOverride.bind(this._page)
    , 'Page.resetScrollAndPageScaleFactor'               : this._page.resetScrollAndPageScaleFactor.bind(this._page)
    , 'Page.setPageScaleFactor'                          : this._page.setPageScaleFactor.bind(this._page)
    , 'Page.setShowPaintRects'                           : this._page.setShowPaintRects.bind(this._page)
    , 'Page.setShowDebugBorders'                         : this._page.setShowDebugBorders.bind(this._page)
    , 'Page.setShowFPSCounter'                           : this._page.setShowFPSCounter.bind(this._page)
    , 'Page.setContinuousPaintingEnabled'                : this._page.setContinuousPaintingEnabled.bind(this._page)
    , 'Page.setShowScrollBottleneckRects'                : this._page.setShowScrollBottleneckRects.bind(this._page)
    , 'Page.getScriptExecutionStatus'                    : this._page.getScriptExecutionStatus.bind(this._page)
    , 'Page.setScriptExecutionDisabled'                  : this._page.setScriptExecutionDisabled.bind(this._page)
    , 'Page.setGeolocationOverride'                      : this._page.setGeolocationOverride.bind(this._page)
    , 'Page.clearGeolocationOverride'                    : this._page.clearGeolocationOverride.bind(this._page)
    , 'Page.setDeviceOrientationOverride'                : this._page.setDeviceOrientationOverride.bind(this._page)
    , 'Page.clearDeviceOrientationOverride'              : this._page.clearDeviceOrientationOverride.bind(this._page)
    , 'Page.setTouchEmulationEnabled'                    : this._page.setTouchEmulationEnabled.bind(this._page)
    , 'Page.setEmulatedMedia'                            : this._page.setEmulatedMedia.bind(this._page)
    , 'Page.startScreencast'                             : this._page.startScreencast.bind(this._page)
    , 'Page.stopScreencast'                              : this._page.stopScreencast.bind(this._page)
    , 'Page.setShowViewportSizeOnResize'                 : this._page.setShowViewportSizeOnResize.bind(this._page)

    , 'Runtime.evaluate'                                 : this._runtime.evaluate.bind(this._runtime)
    , 'Runtime.callFunctionOn'                           : this._runtime.callFunctionOn.bind(this._runtime)
    , 'Runtime.getProperties'                            : this._runtime.getProperties.bind(this._runtime)
    , 'Runtime.releaseObject'                            : this._runtime.releaseObject.bind(this._runtime)
    , 'Runtime.releaseObjectGroup'                       : this._runtime.releaseObjectGroup.bind(this._runtime)
    , 'Runtime.run'                                      : this._runtime.run.bind(this._runtime)
    , 'Runtime.enable'                                   : this._runtime.enable.bind(this._runtime)
    , 'Runtime.disable'                                  : this._runtime.disable.bind(this._runtime)
    , 'Runtime.isRunRequired'                            : this._runtime.isRunRequired.bind(this._runtime)

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
    , 'Network.loadResourceForFrontend'                  : this._network.loadResourceForFrontend.bind(this._network)

    , 'Database.enable'                                  : notImplemented
    , 'Database.disable'                                 : notImplemented
    , 'Database.getDatabaseTableNames'                   : notImplemented
    , 'Database.executeSQL'                              : notImplemented

    , 'IndexedDB.enable'                                 : this._indexedDB.enable.bind(this._indexedDB)
    , 'IndexedDB.disable'                                : this._indexedDB.disable.bind(this._indexedDB)
    , 'IndexedDB.requestDatabaseNames'                   : this._indexedDB.requestDatabaseNames.bind(this._indexedDB)
    , 'IndexedDB.requestDatabase'                        : this._indexedDB.requestDatabase.bind(this._indexedDB)
    , 'IndexedDB.requestData'                            : this._indexedDB.requestData.bind(this._indexedDB)
    , 'IndexedDB.clearObjectStore'                       : this._indexedDB.clearObjectStore.bind(this._indexedDB)

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

    , 'Debugger.enable'                                  : this._debugger.enable.bind(this._debugger)
    , 'Debugger.disable'                                 : this._debugger.disable.bind(this._debugger)
    , 'Debugger.setBreakpointsActive'                    : this._debugger.setBreakpointsActive.bind(this._debugger)
    , 'Debugger.setSkipAllPauses'                        : this._debugger.setSkipAllPauses.bind(this._debugger)
    , 'Debugger.setBreakpointByUrl'                      : this._debugger.setBreakpointByUrl.bind(this._debugger)
    , 'Debugger.setBreakpoint'                           : this._debugger.setBreakpoint.bind(this._debugger)
    , 'Debugger.removeBreakpoint'                        : this._debugger.removeBreakpoint.bind(this._debugger)
    , 'Debugger.continueToLocation'                      : this._debugger.continueToLocation.bind(this._debugger)
    , 'Debugger.stepOver'                                : this._debugger.stepOver.bind(this._debugger)
    , 'Debugger.stepInto'                                : this._debugger.stepInto.bind(this._debugger)
    , 'Debugger.stepOut'                                 : this._debugger.stepOut.bind(this._debugger)
    , 'Debugger.pause'                                   : this._debugger.pause.bind(this._debugger)
    , 'Debugger.resume'                                  : this._debugger.resume.bind(this._debugger)
    , 'Debugger.searchInContent'                         : this._debugger.searchInContent.bind(this._debugger)
    , 'Debugger.canSetScriptSource'                      : this._debugger.canSetScriptSource.bind(this._debugger)
    , 'Debugger.setScriptSource'                         : this._debugger.setScriptSource.bind(this._debugger)
    , 'Debugger.restartFrame'                            : this._debugger.restartFrame.bind(this._debugger)
    , 'Debugger.getScriptSource'                         : this._debugger.getScriptSource.bind(this._debugger)
    , 'Debugger.getFunctionDetails'                      : this._debugger.getFunctionDetails.bind(this._debugger)
    , 'Debugger.getCollectionEntries'                    : this._debugger.getCollectionEntries.bind(this._debugger)
    , 'Debugger.setPauseOnExceptions'                    : this._debugger.setPauseOnExceptions.bind(this._debugger)
    , 'Debugger.evaluateOnCallFrame'                     : this._debugger.evaluateOnCallFrame.bind(this._debugger)
    , 'Debugger.compileScript'                           : this._debugger.compileScript.bind(this._debugger)
    , 'Debugger.runScript'                               : this._debugger.runScript.bind(this._debugger)
    , 'Debugger.setOverlayMessage'                       : this._debugger.setOverlayMessage.bind(this._debugger)
    , 'Debugger.setVariableValue'                        : this._debugger.setVariableValue.bind(this._debugger)
    , 'Debugger.getStepInPositions'                      : this._debugger.getStepInPositions.bind(this._debugger)
    , 'Debugger.getBacktrace'                            : this._debugger.getBacktrace.bind(this._debugger)
    , 'Debugger.skipStackFrames'                         : this._debugger.skipStackFrames.bind(this._debugger)
    , 'Debugger.setAsyncCallStackDepth'                  : this._debugger.setAsyncCallStackDepth.bind(this._debugger)
    , 'Debugger.enablePromiseTracker'                    : this._debugger.enablePromiseTracker.bind(this._debugger)
    , 'Debugger.disablePromiseTracker'                   : this._debugger.disablePromiseTracker.bind(this._debugger)
    , 'Debugger.getPromises'                             : this._debugger.getPromises.bind(this._debugger)
    , 'Debugger.getPromiseById'                          : this._debugger.getPromiseById.bind(this._debugger)

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

    , 'HeapProfiler.enable'                              : this._heapProfiler.enable.bind(this._heapProfiler)
    , 'HeapProfiler.disable'                             : this._heapProfiler.disable.bind(this._heapProfiler)
    , 'HeapProfiler.startTrackingHeapObjects'            : this._heapProfiler.startTrackingHeapObjects.bind(this._heapProfiler)
    , 'HeapProfiler.stopTrackingHeapObjects'             : this._heapProfiler.stopTrackingHeapObjects.bind(this._heapProfiler)
    , 'HeapProfiler.takeHeapSnapshot'                    : this._heapProfiler.takeHeapSnapshot.bind(this._heapProfiler)
    , 'HeapProfiler.collectGarbage'                      : this._heapProfiler.collectGarbage.bind(this._heapProfiler)
    , 'HeapProfiler.getObjectByHeapObjectId'             : this._heapProfiler.getObjectByHeapObjectId.bind(this._heapProfiler)
    , 'HeapProfiler.getHeapObjectId'                     : this._heapProfiler.getHeapObjectId.bind(this._heapProfiler)

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
