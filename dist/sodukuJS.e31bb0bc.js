// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
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

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
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
  return newRequire;
})({"core/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeMatrix = makeMatrix;
exports.shuffle = shuffle;

//create a matrix representing the soduku
function makeMatrix() {
  var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return Array.from({
    length: 9
  }, function () {
    return Array(9).fill(v);
  });
}
/**
 * Fisher Yates shuffle algorithm
 * The Fisher-Yates algorithm works by picking one random element for each
 * original array element
 * @param {array} array
 * @returns {array} shuffled array
 */


function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var _ref = [array[j], array[i]];
    array[i] = _ref[0];
    array[j] = _ref[1];
  }

  return array;
}
},{}],"core/sodukuGenerator.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateSoduku = generateSoduku;
exports.getBoxCells = getBoxCells;
exports.convertToMatrixIndex = convertToMatrixIndex;

var _utils = require("./utils");

/**
 * Function for generating the soduku with number filled
 *
 */
function generateSoduku() {
  var matrix;
  var randomColumnIndex;
  /**
   * Entry point for generating the soduku
   *
   */

  function generate() {
    while (!generateSodu()) {
      console.log('try again');
    }

    return matrix;
  }

  function generateSodu() {
    matrix = (0, _utils.makeMatrix)();
    randomColumnIndex = (0, _utils.makeMatrix)().map(function (row) {
      return row.map(function (v, i) {
        return i;
      });
    }).map(function (row) {
      return (0, _utils.shuffle)(row);
    });

    for (var n = 1; n <= 9; n++) {
      if (!fillNumber(n)) {
        return false;
      }
    }

    return true;
  }
  /**
   * fill the empty soduku with correct number, we fill the number for each row
   * with a certain number till the final row.
   *
   * @param {Number} n number to be filled
   */


  function fillNumber(n) {
    return fillRow(n, 0);
  }
  /**
   * Fill the number in a correct place in a row without repeating(in a row ,in
   * a column and in a box)
   *
   * @param {Number} n number to fit in
   * @param {Number} rowIndex the index of the row to be filled
   */


  function fillRow(n, rowIndex) {
    // base case, we fill all the box successfully
    if (rowIndex > 8) {
      return true;
    }

    var row = matrix[rowIndex];
    var columns = randomColumnIndex[rowIndex];

    for (var i = 0; i < 9; i++) {
      var colIndex = columns[i]; // if this column already has a number filled

      if (row[colIndex]) {
        continue;
      }
      /**
       * check if we could fill n in this cell, we could fill the number in if
       * there is no same number in this row,in this column and in this box
       */


      if (!fillable(matrix, n, rowIndex, colIndex)) {
        continue;
      } //we could fill n in


      row[colIndex] = n; // if we could not fill n in the next row, we need take one step back

      if (!fillRow(n, rowIndex + 1)) {
        //reset the
        row[colIndex] = 0;
        continue;
      }

      return true;
    }

    return false;
  }

  function fillable(matrix, num, rowIndex, colIndex) {
    var row = matrix[rowIndex];
    var column = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (v) {
      return matrix[v][colIndex];
    });

    var _convertToBoxIndex = convertToBoxIndex(rowIndex, colIndex),
        boxIndex = _convertToBoxIndex.boxIndex;

    var boxNumbers = getBoxCells(matrix, boxIndex);

    for (var i = 0; i < 9; i++) {
      if (row[i] === num || column[i] === num || boxNumbers[i] === num) {
        return false;
      }
    }

    return true;
  }

  return {
    matrix: matrix,
    generate: generate
  };
}

function convertToBoxIndex(rowIndex, colIndex) {
  return {
    boxIndex: Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3),
    cellIndex: rowIndex % 3 * 3 + colIndex % 3
  };
}

function convertToMatrixIndex(boxIndex, cellIndex) {
  return {
    rowIndex: Math.floor(boxIndex / 3) * 3 + Math.floor(cellIndex / 3),
    colIndex: boxIndex % 3 * 3 + cellIndex % 3
  };
}

function getBoxCells(matrix, boxIndex) {
  var boxStartRow = Math.floor(boxIndex / 3) * 3;
  var boxStartCol = boxIndex % 3 * 3;
  var result = [];

  for (var i = 0; i < 9; i++) {
    var rowIndex = boxStartRow + Math.floor(i / 3);
    var colIndex = boxStartCol + i % 3;
    result.push(matrix[rowIndex][colIndex]);
  }

  return result;
}
},{"./utils":"core/utils.js"}],"core/soduku.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sodukuFactory = sodukuFactory;

var _sodukuGenerator = require("./sodukuGenerator");

function sodukuFactory() {
  var solutionMatrix = (0, _sodukuGenerator.generateSoduku)().generate();
  var puzzleMatrix;

  function produce() {
    var difficulty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
    puzzleMatrix = solutionMatrix.map(function (row) {
      return row.map(function (cell) {
        return Math.random() * 9 < difficulty ? 0 : cell;
      });
    });
    return puzzleMatrix;
  }

  return {
    produce: produce
  };
}
},{"./sodukuGenerator":"core/sodukuGenerator.js"}],"core/check.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checker = checker;
exports.checkArray = checkArray;

var _utils = require("./utils");

var _sodukuGenerator = require("./sodukuGenerator");

//check if the result is valid
function checkArray(array) {
  var length = array.length;
  var marks = Array(9).fill(true);

  for (var i = 0; i < length; i++) {
    if (!marks[i]) continue;
    var value = array[i];

    if (!value) {
      marks[i] = false;
      continue;
    }

    for (var j = i + 1; j < length; j++) {
      if (value === array[j]) {
        marks[i] = marks[j] = false;
      }
    }
  }

  return marks;
}

function checker(matrix) {
  var matrixMarks = (0, _utils.makeMatrix)(true);
  var success;

  function check() {
    checkRows();
    checkCols();
    checkBoxes();
    success = matrixMarks.every(function (row) {
      return row.every(function (mark) {
        return mark;
      });
    });
    return success;
  }

  function checkRows() {
    for (var i = 0; i < 9; i++) {
      var row = matrix[i];
      var marks = checkArray(row);

      for (var j = 0; j < 9; j++) {
        if (!marks[j]) {
          matrixMarks[i][j] = false;
        }
      }
    }
  }

  function checkCols() {
    for (var colIndex = 0; colIndex < 9; colIndex++) {
      var cols = [];

      for (var rowIndex = 0; rowIndex < 9; rowIndex++) {
        cols[rowIndex] = matrix[rowIndex][colIndex];
      }

      var marks = checkArray(cols);

      for (var _rowIndex = 0; _rowIndex < 9; _rowIndex++) {
        if (!marks[_rowIndex]) {
          matrixMarks[_rowIndex][colIndex] = false;
        }
      }
    }
  }

  function checkBoxes() {
    for (var boxIndex = 0; boxIndex < 9; boxIndex++) {
      var box = (0, _sodukuGenerator.getBoxCells)(matrix, boxIndex);
      var marks = checkArray(box);

      for (var cellIndex = 0; cellIndex < 9; cellIndex++) {
        if (!marks[cellIndex]) {
          var _convertToMatrixIndex = (0, _sodukuGenerator.convertToMatrixIndex)(boxIndex, cellIndex),
              rowIndex = _convertToMatrixIndex.rowIndex,
              colIndex = _convertToMatrixIndex.colIndex;

          matrixMarks[rowIndex][colIndex] = false;
        }
      }
    }
  }

  return {
    check: check,
    matrixMarks: matrixMarks
  };
}
},{"./utils":"core/utils.js","./sodukuGenerator":"core/sodukuGenerator.js"}],"layout/grid.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adjustLayout = exports.grid = void 0;

var _soduku = require("../core/soduku");

var _check = require("../core/check");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * Function to create the soduku grid
 *
 * @param {*} container container for the soduku
 * @return {object}
 */
var grid = function grid(container) {
  function build() {
    var matrix = (0, _soduku.sodukuFactory)().produce();
    var rowClass = ['row-top', 'row-middle', 'row-bottom'];
    var colClass = ['col-top', 'col-middle', 'col-right'];
    var cells = matrix.map(function (row, rowIndex) {
      var rowContainer = document.createElement('div');
      rowContainer.classList.add('row');
      rowContainer.classList.add(rowClass[rowIndex % 3]);
      row.forEach(function (cell, cellIndex) {
        var cellSpan = document.createElement('span');
        cellSpan.classList.add(colClass[cellIndex % 3]);
        cell ? cellSpan.classList.add('hint') : cellSpan.classList.add('empty');
        cellSpan.innerHTML = cell;
        rowContainer.appendChild(cellSpan);
      });
      return rowContainer;
    });
    cells.map(function (row) {
      container.appendChild(row);
    });
  }

  function clear() {
    container.querySelectorAll('span.error').forEach(function (cell) {
      return cell.classList.remove('error');
    });
  }

  function handleShowPop(e, popUp) {
    var cell = e.target;

    if (cell.classList.contains('hint')) {
      return;
    }

    cell.classList.add('active');
    popUp.show(cell);
  }

  function bindPopUp(popUp) {
    container.addEventListener('click', function (e) {
      return handleShowPop(e, popUp);
    });
  }

  function reset() {
    var resetSpans = container.querySelectorAll('span:not(.hint)');
    resetSpans.forEach(function (span) {
      span.classList.remove('error', 'mark-unsure', 'mark-good');
      span.textContent = 0;
      span.classList.add('empty');
    });
  }

  function check() {
    var nodeList = _toConsumableArray(container.children).map(function (row) {
      return _toConsumableArray(row.children);
    });

    var data = nodeList.map(function (row) {
      return row.map(function (cell) {
        return parseInt(cell.textContent);
      }) || 0;
    });
    var check = (0, _check.checker)(data);

    if (check.check()) {
      return true;
    }

    var checkMatrix = check.matrixMarks; //mark the wrong cell

    nodeList.forEach(function (row, rowIndex) {
      return row.forEach(function (cell, colIndex) {
        if (cell.classList.contains('hint') || checkMatrix[rowIndex][colIndex]) {
          cell.classList.remove('error');
        } else {
          cell.classList.add('error');
        }
      });
    });
  }

  return {
    reset: reset,
    check: check,
    build: build,
    bindPopUp: bindPopUp,
    clear: clear
  };
};
/**
 * adjust the grid layout based on the actual screen
 *
 */


exports.grid = grid;

var adjustLayout = function adjustLayout() {
  var container = document.querySelector('#container');
  var width = container.querySelector('span').offsetWidth;
  var allSpans = container.querySelectorAll('span');
  allSpans.forEach(function (span) {
    span.style.height = width + 'px';
    span.style.lineHeight = width + 'px';
  });
};

exports.adjustLayout = adjustLayout;
},{"../core/soduku":"core/soduku.js","../core/check":"core/check.js"}],"layout/popUp.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = popUp;

function popUp(popUp) {
  var _cell;

  function show(cell) {
    popUp.classList.remove('hidden');
    _cell = cell;
  }

  function handleFillIn(e) {
    var popUpCell = e.target;

    var unsureCell = _cell.classList.contains('mark-unsure');

    var goodCell = _cell.classList.contains('mark-good');

    var markUnsure = popUpCell.classList.contains('mark-unsure');
    var markGood = popUpCell.classList.contains('mark-good');
    var markEmpty = popUpCell.classList.contains('mark-empty'); //when you want to mark an cell unsure

    if (markUnsure) {
      if (unsureCell) {
        _cell.classList.remove('mark-unsure');
      } else {
        goodCell && _cell.classList.remove('mark-good');

        _cell.classList.add('mark-unsure');
      }
    } // when you want to mark an cell good
    else if (markGood) {
        if (goodCell) {
          _cell.classList.remove('mark-good');
        } else {
          unsureCell && _cell.classList.remove('mark-unsure');

          _cell.classList.add('mark-good');
        }
      } //clear out the content
      else if (markEmpty) {
          unsureCell && _cell.classList.remove('mark-unsure');
          goodCell && _cell.classList.remove('mark-good');
          _cell.textContent = 0;

          _cell.classList.add('empty');
        } //fill in the number
        else {
            _cell.textContent = popUpCell.textContent;

            _cell.classList.remove('empty');
          }

    popUp.classList.add('hidden');

    _cell.classList.remove('active');
  }

  function bindClicks() {
    popUp.addEventListener('click', handleFillIn);
  }

  return {
    show: show,
    bindClicks: bindClicks
  };
}
},{}],"index.js":[function(require,module,exports) {
"use strict";

var _grid = require("./layout/grid");

var _popUp = _interopRequireDefault(require("./layout/popUp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gridContainer = document.getElementById('container');
var popUpElem = document.getElementById('popUp');
var startGame = document.querySelector('.start-button');
var sodukuBoard;
var popUp = (0, _popUp.default)(popUpElem);
var restartBtn = document.getElementById('restart');
var checkBtn = document.getElementById('check');
var resetBtn = document.getElementById('reset');
var clearBtn = document.getElementById('clear');

function startPlay(e) {
  var restart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!e.isTrusted) {
    alert("Don't cheat dude!");
    return;
  }

  if (restart) gridContainer.innerHTML = null;
  startGame.classList.add('hidden');
  sodukuBoard = (0, _grid.grid)(gridContainer);
  sodukuBoard.build();
  (0, _grid.adjustLayout)();
  sodukuBoard.bindPopUp(popUp);
  popUp.bindClicks();
}

startGame.addEventListener('click', startPlay); //bind events to the control btn

restartBtn.addEventListener('click', function (e) {
  return startPlay(e, true);
});
checkBtn.addEventListener('click', function () {
  if (sodukuBoard.check()) {
    alert('You are so great');
  }

  sodukuBoard.check();
});
resetBtn.addEventListener('click', function () {
  sodukuBoard.reset();
});
clearBtn.addEventListener('click', function () {
  return sodukuBoard.clear();
});
},{"./layout/grid":"layout/grid.js","./layout/popUp":"layout/popUp.js"}],"C:/Users/Osito/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "2838" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
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

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

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

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["C:/Users/Osito/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/sodukuJS.e31bb0bc.map