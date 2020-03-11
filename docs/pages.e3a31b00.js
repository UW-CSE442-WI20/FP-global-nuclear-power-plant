// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"pages.js":[function(require,module,exports) {
var introTitles = ['<h3>What is nuclear power?</h3></br>', '<h3>Where does the energy come from?</h3></br>', '<h3>How did we develop to use nuclear energy?</h3></br>'];
var introContents = ['<p>Nuclear power is a clean and efficient energy that comes from splitting atoms in a reactor to heat water ' + 'into steam, turn a turbine and generate electricity. About 440 power reactors around the world produce 12 ' + 'percent of the energy produced by nuclear power. It is the second largest source of low-carbon power.</p></br>', '<p>The energy comes from an element called uranium. Uranium-235 is a stable type of uranium that consists of ' + '92 protons and 143 neutrons in its nucleus. When we fire a neutron to an uranium-235, it becomes uranium-236 ' + 'and that’s an unstable that would want to react and split up into smaller atoms, barium (56 protons and 81 ' + 'neutrons in the nucleus), krypton (36 protons and 45 neutrons in the nucleus) and a neutron. <u>The process of ' + 'splitting up the nucleus of uranium-236 releases energy that was used to connect the protons and neutrons.</u> ' + 'The neutron from the reaction will also collide with other uranium-235 and trigger more reactions to create more ' + 'energy.</p></br>', '<p>    <u>Bombardment of neutrons:</u> In 1935, physicist Enrico Fermi conducted experiments in Rome that showed ' + 'neutrons could split atoms. He also bombarded uranium and concluded that he created new elements. ' + '</br>    <u>Discovery of Fission:</u> In 1938, German scientist Otto Hahn and Fritz Strassmann fired neutrons at uranium and ' + 'found that the elements they get are weighted much less than uranium. Later Lise Meitner figured that the split must ' + 'have converted to energy following Albert Einstein’s E=mc^2 equation. </br>    <u>Chain Reaction:</u> Frédéric Joliot, H. Von Halban ' + 'and L. Kowarski in Paris discovered neutron multiplication in uranium, proving that a nuclear chain reaction by this ' + 'mechanism was indeed possible. First nuclear reactor: In 1942, Fermi and a group of scientists gathered at the ' + 'University of Chicago to develop their theories about self-sustaining reactions. The reactor they built was later ' + 'known as Chicago Pile-1.</p></br>'];
var usaContent = ['<p>Nuclear power in the USA is provided by 98 commercial reactors with a net capacity of 100,350 megawatts.</p></br>', '<p>    <u>Development:</u><b>  In 1953, President Dwight D Eisenhower announced Atoms for Peace </b>and in 1958 the first ' + 'commercial nuclear power plant was built in the US. The industry continued to grow throughout the 1960s ever since. Price-Anderson ' + 'Act in 1975 then was introduced to protect private companies from liabilities of these accidents to encourage the development of nuclear power.</p></br>', '<p>    <u>Emergence:</u><b> In the 1970s, the growth of the nuclear industry occured in the US as the environmental movement was being formed ' + '</b>was being formed and people saw the advantage of nuclear power in reducing air pollution.</p></br>', '<p>    <u>Opposition:</u><b> In 1979  three Mile Island Accident that caused radiation leak </b><b> The protests then preceded the shutdown of over ' + 'a dozen nuclear power plants in the states.</b> that further leads to almost 200 thousands of people attending protests against nuclear power.</p></br>', '<p>    <u>Overcommitments to Nuclear Power:</u><b> From 1953 to 2008, 48 percent of the ordered nuclear plants were canceled. </b> By 1983, cost overruns ' + 'and delays along with slowing of electricity demand growth. <b> In 1985 the Atomic Energy Act encouraged private corporations to build nuclear reactors </b> ' + 'and a significant learning phase followed with many early partial nuclear reactor accidents at experimental reactors and research facilities. </p></br>'];
var japan = '    Prior to the 2011 Tohoku earthquake, Japan had generated 30% of its electrical power' + ' from nuclear reactors from 9 reactors. In 1954, Japan budgeted 230 million yen for nuclear energy, marking the beginning of Japan\'s ' + 'nuclear program. Three Mile Island accident or the Chernobyl disaster did not hit Japan as hard as it did in other countries. ' + 'Constructions of new nuclear plants continued to be strong through 1980s, 1990s and up to today. Despite the Bombing of Hiroshima ' + 'and Nagasaki and Fukushima disaster, Japan recognized nuclear power as the country’s most important power source as it aims for a ' + 'realistic and balanced energy structure.';
var france = '    France derives about 75% of its electricity from nuclear energy. As a direct result of the 1973 oil crisis,' + ' Prime Minister Pierre Messmer announced Messmer Plan to reach 170 plants by 2000 as a response to the lack of oil sources.  In 2018, based on energy security, ' + 'the government policy is to reduce this to 50% by 2035 and increase its wind, biomass and solar power electricity output.';
var france = '    China is one of the largest producers of nuclear power in the world. Nuclear power contributed 4.9% of the total chinese ' + 'electricity production in 2019 with 45 reactors. Most of the nuclear plants are on the coast and use seawater for cooling. In 1955, the China National Nuclear ' + 'Corporation was established. In 1970, China issued its first nuclear power plan. Since then, it has Energy Development Strategy Action Plan 2014-2020 to have a ' + '58 GWe capacity by 2020 with 30 GWe more under construction.';
var australia = '    Australia has never had a nuclear power station. In the meantime, Australia hosts 33% of the world’s uranium ' + 'deposits and is the world’s largest producer of uranium after Kazakhstan and Canada. With its low-cost coal and natural gas reserves, Australia has been able ' + 'to avoid nuclear power. Since the 1950s, the Liberty Party has advocated for the development of nuclear power. And since the 1970s, anti-nuclear movements ' + 'developed in Australia. ';
var speed = 50;

function typeWriter(id, text) {
  for (var i = 0; i < text.length; i++) {
    console.log("Hello");
    document.getElementById(id).innerHTML += text.charAt(i);
    setTimeout(typeWriter, speed);
  }
}
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57863" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","pages.js"], null)
//# sourceMappingURL=/pages.e3a31b00.js.map