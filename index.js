'use strict';
var InspectorBackendDispatcher = require('./lib/InspectorBackendDispatcher/InspectorBackendDispatcher.js')
  , InspectorPageAgent = require('./lib/inspector/InspectorPageAgent.js')
  , InspectorConsoleAgent = require('./lib/inspector/InspectorConsoleAgent.js')
  , InspectorNetworkAgent = require('./lib/inspector/InspectorNetworkAgent.js')
  , InspectorHeapProfilerAgent = require('./lib/inspector/InspectorHeapProfilerAgent.js')

exports.inspectorBackendDispatcher = function inspectorBackendDispatcher() {
  return new InspectorBackendDispatcher({
      pageAgent         : new InspectorPageAgent()
    , consoleAgent      : new InspectorConsoleAgent()
    , networkAgent      : new InspectorNetworkAgent()
    , heapProfilerAgent : new InspectorHeapProfilerAgent()
  })
}
