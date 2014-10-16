'use strict';
var format           = require('util').format
  , scripts          = require('./scripts')
  , loadScriptSource = require('./load-script-source')

// Ports: https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/core/inspector/InspectorDebuggerAgent.cpp

function ignore(cb) { cb() }

function InspectorDebuggerAgent() {
  if (!(this instanceof InspectorDebuggerAgent)) return new InspectorDebuggerAgent();
  this._enabled = false;
  this._breakpointsCookie = {}
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

// https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/core/inspector/InspectorDebuggerAgent.cpp&l=606
proto._resolveBreakpoint = function _resolveBreakpoint(breakpointId, script, breakpoint, cb) {
  var result = { breakpointId: breakpointId, locations: [ ] };

  // if a breakpoint registers on startup, the script's source may not have been loaded yet
  // in that case we load it, the script's source is set automatically during that step
  // should not be needed once other debugger methods are implemented
  if (script.source) onensuredSource();
  else loadScriptSource(script.url, onensuredSource)

  function onensuredSource(err) {
    if (err) return cb(err);
    
    if (breakpoint.lineNumber < script.startLine || script.endLine < breakpoint.lineNumber) return cb(null, result);

    // TODO:  scriptDebugServer().setBreakpoint(scriptId, breakpoint, &actualLineNumber, &actualColumnNumber, false);
    // https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/bindings/core/v8/ScriptDebugServer.cpp&l=89
    var debugServerBreakpointId = 'TBD'
    if (!debugServerBreakpointId) return cb(null, result);

    // will be returned from call to script debug server
    var actualLineNumber = breakpoint.lineNumber
      , actualColumnNumber = breakpoint.columnNumber
      
    result.locations.push({
        scriptId     : script.id
      , lineNumber   : actualLineNumber
      , columnNumber : actualColumnNumber
    })

    cb(null, result);
  }
}

// https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/core/inspector/InspectorDebuggerAgent.cpp&l=333
proto.setBreakpointByUrl = function setBreakpointByUrl(opts, cb) {
  if (opts.urlRegex) return cb(new Error('Not supporting setBreakpointByUrl with urlRegex'));

  var isAntibreakpoint = !!opts.isAntibreakpoint
    , url              = opts.url
    , condition        = opts.condition || ''
    , lineNumber       = opts.lineNumber
    , columnNumber

  if (typeof opts.columnNumber === Number) {
    columnNumber = opts.columnNumber;
    if (columnNumber < 0) return cb(new Error('Incorrect column number.'));
  } else {
    columnNumber = isAntibreakpoint ? -1 : 0;
  }

  var breakpointId = format('%s:%d:%d', url, lineNumber, columnNumber);
  if (this._breakpointsCookie[breakpointId]) return cb(new Error('Breakpoint at specified location already exists.'));

  this._breakpointsCookie[breakpointId] = { 
      url              : url
    , lineNumber       : lineNumber
    , columnNumber     : columnNumber
    , condition        : condition
    , isAntibreakpoint : isAntibreakpoint
  }

  if (isAntibreakpoint) return cb(null, { breakpointId:  breakpointId });

  var match = scripts.byUrl[url];
  if (!match) return cb(null, { breakpointId: breakpointId, locations: [] })

  var breakpoint = { lineNumber: lineNumber, columnNumber: columnNumber, condition: condition }
  this._resolveBreakpoint(breakpointId, match, breakpoint, cb)
}

proto._removeBreakpoint = function _removeBreakpoint(breakpointId, cb) {
  // todo
  cb()
}

// https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/core/inspector/InspectorDebuggerAgent.cpp&l=416
proto.removeBreakpoint = function removeBreakpoint(breakpointId, cb) {
  var breakpoint = this._breakpointsCookie[breakpointId];
  if (!breakpoint) return;
  this._breakpointsCookie[breakpointId] = undefined;
  if (!breakpoint.isAntibreakpoint) this._removeBreakpoint(breakpointId, cb);
  else cb()
}

proto.getScriptSource = function getScriptSource(id, cb) {
  var script = scripts.byId[id];
  if (!script) return cb(new Error('Script with id ' + id + 'was not found'))
  cb(null, { scriptSource: script.source })
}

proto.setBreakpointsActive   = ignore
proto.setSkipAllPauses       = ignore
proto.setBreakpoint          = ignore
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
