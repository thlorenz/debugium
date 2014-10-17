'use strict';

// adapted from node-inspector: https://github.com/node-inspector/node-inspector/blob/90d699202dc2d5dc44c9493e89da1bea3e1c3671/lib/ScriptFileStorage.js
var path       = require('path')
  , fs         = require('fs')
  , glob       = require('glob')
  , runnel     = require('runnel')
  , mothership = require('mothership')

var PROJECT_JS = '{*.js,lib/**/*.js,node_modules/**/*.js,test/**/*.js}'
  , ALL_JS = '**/*.js'

function firstPackageJsonIsGood() {
  return true
}

function addRootInfo(app, cb) {
  mothership(app.main, firstPackageJsonIsGood, function onPackageRoot(err, res) {
    if (err) {
      app.root = app.mainDir;
      app.hasPack = false;
    } else {
      app.root = path.dirname(res.path);
      app.hasPack = true;
    }
    cb(null, app)
  })        
}

function appInfo(cb) {
  var main = process.mainModule ? process.mainModule.filename : process.argv[1]
    , cwd = process.cwd()

  // it's null in REPL mode
  if (main === null) return cb(null, { cwd: cwd, main: main })

  // ensure it exists or find it
  fs.stat(main, function (err, stat) {
    if (err && path.extname(main) !== '.js') main += '.js' 
    cb(null, { cwd: process.cwd() , main: main, mainDir: path.dirname(main) })
  })
}

function findAllScripts(app, cb) {

  if (!app.main) return cb(null, []);
  var pattern = app.hasPack ? ALL_JS : PROJECT_JS;
  app.scripts = []

  var tasks = 2;
  glob(pattern, { cwd: app.root, strict: false }, onglobbed)
  glob(ALL_JS, { cwd: app.cwd, strict: false }, onglobbed)
  
  function generalizePath(p) {
    var rel = p.split('/').join(path.sep)
    return path.join(app.root, rel)
  }

  function onglobbed(err, res) {
    if (err) return cb(err);
    if (res) app.scripts = app.scripts.concat(res.map(generalizePath))
    if (!--tasks) cb(null, app)
  }
}

module.exports = function findAppScripts(cb) {
  runnel(appInfo, addRootInfo, findAllScripts, cb)
}
