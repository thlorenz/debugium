'use strict';
var protocolErrors      = require('./protocol-errors')
  , reportProtocolError = protocolErrors.reportProtocolError
  , commonErrors        = protocolErrors.commonErrors
  , invalidParams       = protocolErrors.invalidParams

function successCallback(msg, cb) {
  return function onsuccess() {
    cb(null, { id: msg.id, result: {} })
  }
}

function resultOrErrorCallback(msg, cb) {
  return function onresponse(err, result) {
    if (err) return reportProtocolError(msg.id, commonErrors.ServerError, err.toString(), err.data, cb)
    cb(null, { id: msg.id, result: result })
  }
}

function InspectorBackendDispatcher_Debugger(debuggerAgent) {
  if (!(this instanceof InspectorBackendDispatcher_Debugger)) return new InspectorBackendDispatcher_Debugger(debuggerAgent);

  this._debuggerAgent = debuggerAgent;
}

module.exports = InspectorBackendDispatcher_Debugger;
var proto = InspectorBackendDispatcher_Debugger.prototype;

function reportAgentNotAvailable(callId, method, cb) {
  reportProtocolError(callId, commonErrors.InvalidParams, invalidParams(method), [ 'Debugger handler is not available.' ], cb);
}

proto.enable = function enable(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.enable', cb);
  this._debuggerAgent.enable(successCallback(msg, cb));
}

proto.disable = function disable(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.disable', cb);
  this._debuggerAgent.disable(successCallback(msg, cb));
}

proto.setBreakpointsActive = function setBreakpointsActive(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.setBreakpointsActive', cb);
  this._debuggerAgent.setBreakpointsActive(successCallback(msg, cb));
}

proto.setSkipAllPauses = function setSkipAllPauses(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.setSkipAllPauses', cb);
  this._debuggerAgent.setSkipAllPauses(successCallback(msg, cb));
}

// https://code.google.com/p/chromium/codesearch#chromium/src/out/Debug/gen/blink/core/InspectorBackendDispatcher.cpp&l=4132
proto.setBreakpointByUrl = function setBreakpointByUrl(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.setBreakpointByUrl', cb);

  var p = msg.params
  // todo: check for needed params if we ever don't trust the frontend
  this._debuggerAgent.setBreakpointByUrl(
      { lineNumber       : p.lineNumber
      , url              : p.url
      , urlRegex         : p.urlRegex         // either url or urlRegex need to be supplied
      , columnNumber     : p.columnNumber
      , condition        : p.condition        // empty in most cases
      , isAntibreakpoint : p.isAntibreakpoint // optional
      }
    , resultOrErrorCallback(msg, cb)
  );
}

proto.setBreakpoint = function setBreakpoint(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.setBreakpoint', cb);
  this._debuggerAgent.setBreakpoint(successCallback(msg, cb));
}

proto.removeBreakpoint = function removeBreakpoint(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.removeBreakpoint', cb);
  var p = msg.params
  this._debuggerAgent.removeBreakpoint(p.breakpointId, successCallback(msg, cb));
}

proto.continueToLocation = function continueToLocation(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.continueToLocation', cb);
  this._debuggerAgent.continueToLocation(successCallback(msg, cb));
}

proto.stepOver = function stepOver(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.stepOver', cb);
  this._debuggerAgent.stepOver(successCallback(msg, cb));
}

proto.stepInto = function stepInto(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.stepInto', cb);
  this._debuggerAgent.stepInto(successCallback(msg, cb));
}

proto.stepOut = function stepOut(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.stepOut', cb);
  this._debuggerAgent.stepOut(successCallback(msg, cb));
}

proto.pause = function pause(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.pause', cb);
  this._debuggerAgent.pause(successCallback(msg, cb));
}

proto.resume = function resume(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.resume', cb);
  this._debuggerAgent.resume(successCallback(msg, cb));
}

proto.searchInContent = function searchInContent(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.searchInContent', cb);
  this._debuggerAgent.searchInContent(successCallback(msg, cb));
}

proto.canSetScriptSource = function canSetScriptSource(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.canSetScriptSource', cb);
  this._debuggerAgent.canSetScriptSource(successCallback(msg, cb));
}

proto.setScriptSource = function setScriptSource(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.setScriptSource', cb);
  this._debuggerAgent.setScriptSource(successCallback(msg, cb));
}

proto.restartFrame = function restartFrame(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.restartFrame', cb);
  this._debuggerAgent.restartFrame(successCallback(msg, cb));
}

proto.getScriptSource = function getScriptSource(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.getScriptSource', cb);
  var p = msg.params;
  this._debuggerAgent.getScriptSource(p.scriptId, resultOrErrorCallback(msg, cb));
}

proto.getFunctionDetails = function getFunctionDetails(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.getFunctionDetails', cb);
  this._debuggerAgent.getFunctionDetails(successCallback(msg, cb));
}

proto.getCollectionEntries = function getCollectionEntries(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.getCollectionEntries', cb);
  this._debuggerAgent.getCollectionEntries(successCallback(msg, cb));
}

proto.setPauseOnExceptions = function setPauseOnExceptions(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.setPauseOnExceptions', cb);
  this._debuggerAgent.setPauseOnExceptions(successCallback(msg, cb));
}

proto.evaluateOnCallFrame = function evaluateOnCallFrame(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.evaluateOnCallFrame', cb);
  this._debuggerAgent.evaluateOnCallFrame(successCallback(msg, cb));
}

proto.compileScript = function compileScript(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.compileScript', cb);
  this._debuggerAgent.compileScript(successCallback(msg, cb));
}

proto.runScript = function runScript(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.runScript', cb);
  this._debuggerAgent.runScript(successCallback(msg, cb));
}

proto.setOverlayMessage = function setOverlayMessage(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.setOverlayMessage', cb);
  this._debuggerAgent.setOverlayMessage(successCallback(msg, cb));
}

proto.setVariableValue = function setVariableValue(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.setVariableValue', cb);
  this._debuggerAgent.setVariableValue(successCallback(msg, cb));
}

proto.getStepInPositions = function getStepInPositions(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.getStepInPositions', cb);
  this._debuggerAgent.getStepInPositions(successCallback(msg, cb));
}

proto.getBacktrace = function getBacktrace(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.getBacktrace', cb);
  this._debuggerAgent.getBacktrace(successCallback(msg, cb));
}

proto.skipStackFrames = function skipStackFrames(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.skipStackFrames', cb);
  this._debuggerAgent.skipStackFrames(successCallback(msg, cb));
}

proto.setAsyncCallStackDepth = function setAsyncCallStackDepth(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.setAsyncCallStackDepth', cb);
  this._debuggerAgent.setAsyncCallStackDepth(successCallback(msg, cb));
}

proto.enablePromiseTracker = function enablePromiseTracker(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.enablePromiseTracker', cb);
  this._debuggerAgent.enablePromiseTracker(successCallback(msg, cb));
}

proto.disablePromiseTracker = function disablePromiseTracker(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.disablePromiseTracker', cb);
  this._debuggerAgent.disablePromiseTracker(successCallback(msg, cb));
}

proto.getPromises = function getPromises(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.getPromises', cb);
  this._debuggerAgent.getPromises(successCallback(msg, cb));
}

proto.getPromiseById = function getPromiseById(msg, cb) {
  if (!this._debuggerAgent) return reportAgentNotAvailable(msg.id, 'Debugger.getPromiseById', cb);
  this._debuggerAgent.getPromiseById(successCallback(msg, cb));
}
