<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Get depot tools and fetch chromium](#get-depot-tools-and-fetch-chromium)
    - [In a nutshell](#in-a-nutshell)
- [Building chromium](#building-chromium)
    - [Ensure to use clang that comes with chromium](#ensure-to-use-clang-that-comes-with-chromium)
    - [Build Steps](#build-steps)
      - [Build Chromium.app](#build-chromiumapp)
    - [Alternative](#alternative)
    - [Xcode](#xcode)
- [Ninja](#ninja)
  - [Ninja Extra Tools](#ninja-extra-tools)
    - [Open chrome dependency graph in default browser](#open-chrome-dependency-graph-in-default-browser)
    - [List all chromium build targets](#list-all-chromium-build-targets)
    - [List all commands that are run to build chrome.](#list-all-commands-that-are-run-to-build-chrome)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Get depot tools and fetch chromium

Basically follow [these steps](http://commondatastorage.googleapis.com/chrome-infra-docs/flat/depot_tools/docs/html/depot_tools_tutorial.html)

#### In a nutshell

```sh
git clone https://chromium.googlesource.com/chromium/tools/depot_tools
export PATH=$PATH:`pwd`/depot_tools
mkdir chromium && cd chromium
fetch chromium
gclient sync
```

## Building chromium

Mainly follow [these instructions](https://code.google.com/p/chromium/wiki/MacBuildInstructions) with one caveat.

#### Ensure to use clang that comes with chromium

I haven't found this documented anywhere, but when running the pre-commit hooks, chromium actually pulls and builds a specific **clang** version. It is important you use that when building, otherwise the build may (and did in my case) fail due to flags that your **clang** version doesn't understand.

So in order to build successfully do the following (assuming you are in `./chromium` root dir).

#### Build Steps

```sh
cd src

# prefer chromium's clang over the one in our path currently
export PATH=`pwd`/third_party/llvm-build/Release+Asserts/bin:$PATH
export CC=clang; export CXX=clang++;

ninja -C out/Debug
```

This will build multiple targets, but not the actual Chromium.app.

##### Build Chromium.app

Now we are ready to build the actual `Chromium.app`

```sh
ninja -C out/Debug chrome
```

Once that completes you should find a `Chromium.app` file in `out/Debug` which you can run via `open ./Chromium.app` or via `./Chromium.app/Content
Multiple processes will be created as a result and you can attach a debugger to either in order to start debugging chromium.

#### Alternative

In order to only build `chrome` we can boil the build steps down to one

```
export PATH=`pwd`/third_party/llvm-build/Release+Asserts/bin:$PATH
export CC=clang; export CXX=clang++;

ninja -C out/Debug chrome
```

I created a [script](https://github.com/thlorenz/chromium/blob/master/scripts/add-chromium-paths.sh) that does this for
you. It assumes that this `patches` project is a sibling of the `src` folder created during `fetch`.

Just source it to add the directories to your path: `source patches/scripts/add-chromium-paths.sh`.

#### Xcode

If you want to navigate/edit the code with Xcode you can create a [hybrid build](https://code.google.com/p/chromium/wiki/MacBuildInstructions#Using_Xcode-Ninja_Hybrid).

Basically do the following:

```sh
GYP_GENERATORS=ninja,xcode-ninja GYP_GENERATOR_FLAGS="xcode_ninja_main_gyp=src/build/ninja/all.ninja.gyp" gclient runhooks
```

## Ninja 

[ninja docs](http://martine.github.io/ninja/manual.html)

### Ninja Extra Tools

[ninja extra tools docs](http://martine.github.io/ninja/manual.html#_extra_tools)

#### Open chrome dependency graph in default browser

```
ninja -t browse chrome
```

#### List all chromium build targets

```
ninja -t targets
```

#### List all commands that are run to build chrome.

```
ninja -t commands chrome
```
