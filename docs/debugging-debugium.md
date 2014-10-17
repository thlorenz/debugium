## Launch

```sh
./Chromium.app/Contents/MacOS/Chromium --remote-debugging-port=9222 \
  --no-first-run --user-data-dir=~/temp/chrome-dev-profile http://thlorenz.github.io/debugium/
```

## DevTools

In order to dump all messages when debugging the devtools front end, type the following into the DevTools console (the one debugging devtools, not the devtools app itself)

```
InspectorBackendClass.Options.dumpInspectorProtocolMessages = true;
```

Alternatively edit `./front-end/sdk/InspectorBackend.js` to add this feature permanently.

**NOTE**: when running the server with the `--dev` flag or via `npm run dev` that flag is turned on for you already, so
none of the above changes are required

## Resources

- [Contributing to Chrome DevTools](https://developer.chrome.com/devtools/docs/contributing#step-2-running-an-edge-build-of-chromium)
- [remote debugging protocol](https://developer.chrome.com/devtools/docs/protocol/1.1/index)
