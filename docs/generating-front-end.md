## Generating Debugium Frontend

The front-end comes straight from blink.

The current way to generate it is to do the following:

- [build chromium](https://github.com/thlorenz/debugium/blob/master/docs/building-chromium.md)
- copy front-end files over

```
cp -R ./path/to/chromium/src/out/Debug/resources/inspector ./front-end
cp ./path/to/chromium/src/./chrome/browser/devtools/frontend/devtools_discovery_page.html ./front-end/
```

### Developer Frontend

In order to ease front end debugging the original front end files [have been
included](https://github.com/thlorenz/debugium/tree/master/front-end-dev). In order to update those do the following:

- edit `./path/to/chromium/src/third_party/WebKit/Source/devtools/devtools.gypi` and change [`'debug_devtools% =
0'`](https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/devtools/devtools.gypi&l=35)  to `'debug_devtools% = '`
- repeat the same steps as above, in case you already fetched and built chromium before, a simple `gclient runhooks
&& ninja -C ./out/Debug` should do the trick
- copy front-end files over to dev dir

```
cp -R ./path/to/chromium/out/Debug/resources/inspector ./front-end-dev
cp ./path/to/chromium/src/./chrome/browser/devtools/frontend/devtools_discovery_page.html ./front-end-dev/
```
