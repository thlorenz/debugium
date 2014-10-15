'use strict';

function isFullPath(p) {
  return (/^\//).test(p)
}

function isWindowsPath(p) {
  return (/^[a-zA-Z]:\\/).test(p)
}

function startsWithDoubleBackslash(p) {
  return (/^\\\\/).test(p)
}

function isWindowsUNCPath(url) {
  return (/^file:\/\//).test(url)
}

exports.pathToInspectorUrl = function pathToInspectorUrl(p) {
  if (!p || p === 'repl') return '';
  if (isFullPath(p)) return 'file://' + p;
  if (isWindowsPath(p)) return p.replace(/\\/g, '/'); 
  if (startsWithDoubleBackslash(p)) return p.slice(2).replace(/\\/g, '/');
  return p;
}

exports.inspectorUrlToPath = function inspectorUrlToPath(url) {
  var p = url.replace(/^file:\/\//, '');
  if (isFullPath(p)) return p;
  if (isWindowsPath(p)) return p.slice(1).replace(/\//g, '\\');
  if (isWindowsUNCPath(url)) return '\\\\' + p.replace(/\//g, '\\') ;
}
