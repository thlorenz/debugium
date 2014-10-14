'use strict';
var InspectorBackendDispatcher = require('./lib/InspectorBackendDispatcher/InspectorBackendDispatcher.js')
  , InspectorPageAgent = require('./lib/inspector/InspectorPageAgent.js')

exports.inspectorBackendDispatcher = function inspectorBackendDispatcher() {
  return new InspectorBackendDispatcher({
    pageAgent: new InspectorPageAgent()
  })
}
