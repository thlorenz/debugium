'use strict';

// Ports: https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/core/inspector/InspectorDebuggerAgent.cpp

function ignore(cb) { cb() }

function InspectorDebuggerAgent() {
  if (!(this instanceof InspectorDebuggerAgent)) return new InspectorDebuggerAgent();
  this._enabled = false;
}

module.exports = InspectorDebuggerAgent;
var proto = InspectorDebuggerAgent.prototype;

proto.enable = function enable(cb) {
  this._enabled = true;
  cb()
}

proto.disable = function disable(cb) {
  this._enabled = false;
  cb()
}

proto.setBreakpointsActive   = ignore
proto.setSkipAllPauses       = ignore
proto.setBreakpointByUrl     = ignore
proto.setBreakpoint          = ignore
proto.removeBreakpoint       = ignore
proto.continueToLocation     = ignore
proto.stepOver               = ignore
proto.stepInto               = ignore
proto.stepOut                = ignore
proto.pause                  = ignore
proto.resume                 = ignore
proto.searchInContent        = ignore
proto.canSetScriptSource     = ignore
proto.setScriptSource        = ignore
proto.restartFrame           = ignore
proto.getScriptSource        = ignore
proto.getFunctionDetails     = ignore
proto.getCollectionEntries   = ignore
proto.setPauseOnExceptions   = ignore
proto.evaluateOnCallFrame    = ignore
proto.compileScript          = ignore
proto.runScript              = ignore
proto.setOverlayMessage      = ignore
proto.setVariableValue       = ignore
proto.getStepInPositions     = ignore
proto.getBacktrace           = ignore
proto.skipStackFrames        = ignore
proto.setAsyncCallStackDepth = ignore
proto.enablePromiseTracker   = ignore
proto.disablePromiseTracker  = ignore
proto.getPromises            = ignore
proto.getPromiseById         = ignore
