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

module.exports = function inspectorUrl(p) {
  if (!p || p === 'repl') return '';
  if (isFullPath(p)) return 'file://' + p;
  if (isWindowsPath(p)) return p.replace(/\\/g, '/'); 
  if (startsWithDoubleBackslash(p)) return p.slice(2).replace(/\\/g, '/');
  return p;
}
