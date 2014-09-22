(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
global.isLocalTest = false;

global.serverURL = "http://test1-sirolabo.rhcloud.com/";

require("cssEditor");

require("event/com").init();



}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"cssEditor":11,"event/com":20}],2:[function(require,module,exports){
module.exports = {
  obj: require("./lib/obj"),
  array: require("./lib/array"),
  file: require("./lib/file"),
  calc: require("./lib/calc"),
  str: require("./lib/str"),
  time: require("./lib/time")
};



},{"./lib/array":3,"./lib/calc":4,"./lib/file":5,"./lib/obj":6,"./lib/str":7,"./lib/time":8}],3:[function(require,module,exports){

/**
  @class core.array
  配列を操作します。
 */
var core_obj;

core_obj = require("./obj");


/**
  @method repFilter
  配列の重複する要素を一つにまとめます。
  @param {array} target 対象の配列
 */

exports.repFilter = function(array) {
  return array.filter(function(x, i, self) {
    return self.indexOf(x) === i;
  });
};


/**
  @method getPopClone
  指定した配列のポップされたクローンを取得します。
  @param {array} target 対象の配列
  @return {array} return.popClone ポップした配列のクローン
 */

exports.getPopClone = function(array) {
  var clone;
  clone = core_obj.clone(array);
  clone.shift();
  return clone;
};



},{"./obj":6}],4:[function(require,module,exports){

/**
  @class core.calc
    演算を主体としたクラスです。
 */
var core_obj;

core_obj = require("./obj");


/**
  @method hslToRGB
  HSLをRGBに変換した値を返します。
  @param {Object} argHSL 変換するHSL値
  @return {Array} 変換したRGB値
 */

exports.hslToRGB = function(argHSL) {
  var HSL, b, g, hslToRGB_calc, max, min, r;
  HSL = core_obj.clone(argHSL);
  HSL["L"] /= 100;
  HSL["S"] /= 100;
  if (HSL["L"] <= 0.5) {
    max = HSL["L"] * (1 + HSL["S"]);
  } else {
    max = HSL["L"] + HSL["S"] - HSL["L"] * HSL["S"];
  }
  min = 2 * HSL["L"] - max;
  hslToRGB_calc = function(n1, n2, hue) {
    hue = (hue + 180) % 360;
    if (hue < 60) {
      return n1 + (n2 - n1) * hue / 60;
    } else if (hue < 180) {
      return n2;
    } else if (hue < 240) {
      return n1 + (n2 - n1) * (240 - hue) / 60;
    } else {
      return n1;
    }
  };
  r = Math.floor(hslToRGB_calc(max, min, HSL["H"] + 120) * 255).toString(16);
  g = Math.floor(hslToRGB_calc(max, min, HSL["H"]) * 255).toString(16);
  b = Math.floor(hslToRGB_calc(max, min, HSL["H"] - 120) * 255).toString(16);
  if (r.length < 2) {
    r = "0" + r;
  }
  if (g.length < 2) {
    g = "0" + g;
  }
  if (b.length < 2) {
    b = "0" + b;
  }
  HSL = null;
  return "#" + r + g + b;
};



},{"./obj":6}],5:[function(require,module,exports){

/**
  @class core.file
  ファイルを操作します。
 */

/**
  @method downloadData
  データをファイルとしてダウンロードさせます。
  @param {object} content データ
  @param {string} fileName ファイル名
 */
exports.downloadData = function(content, fileName) {
  var a, blob, contentType;
  contentType = 'application/octet-stream';
  blob = new Blob([content], {
    'type': contentType
  });
  a = document.createElement('a');
  a.href = window.URL.createObjectURL(blob);
  a.download = fileName;
  return a.click();
};


/**
  @method registFileAPI
  file apiとidを紐付けし、load実行時に指定したメソッドを呼び出します。
  @param {string} id id名
  @param {function} callback 呼び出すメソッド(e:イベント、parent:呼び出し元インスタンス が渡される。)
  @param {object} parent このメソッドを実行したインスタンス
 */

exports.registFileAPI = (function(_this) {
  return function(id, callback, parent) {
    return $(id).bind("change", function(e) {
      var file, fr;
      file = e.target.files[0];
      fr = new FileReader();
      fr.onload = function(e) {
        return callback(e, parent);
      };
      return fr.readAsText(file);
    });
  };
})(this);


/**
  @method getJSONFile
  JSONファイルを読み込み、指定したメソッドを呼び出します。
  @param {string} id id名
  @param {function} callback 呼び出すメソッド(data:読み込んだファイルデータ が渡される。)
 */

exports.getJSONFile = (function(_this) {
  return function(fileName, callback) {
    return $.getJSON(fileName, function(data) {
      return callback(data);
    });
  };
})(this);


/**
  @method getFileList
  指定したディレクトリのファイル名リストを取得します。
  @param {string} dir ディレクトリ名
  @param {function} ファイル名リスト
 */



},{}],6:[function(require,module,exports){

/**
  @class core.obj
    オブジェクトを操作します。
 */
var core_array;

core_array = require("./array");


/**
  @method setMapVal
  オブジェクトの構造を指定して一度に値を設定します。
  @param {Object} target 初期化する連想配列
  @param {Array} mapList 構造を記述したマップ配列
  @param {Object} values 設定する値のセット
 */

exports.setMapVal = function(target, mapList, values) {
  var init, setChildMapVal, setInitVal;
  init = (function(_this) {
    return function(target, map) {
      var key, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = map.length; _i < _len; _i++) {
        key = map[_i];
        if (!_this.check(target[key])) {
          _results.push(target[key] = {});
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
  })(this);
  setChildMapVal = (function(_this) {
    return function(target, mapList, values) {
      var childMapList, key, _i, _len, _ref, _results;
      childMapList = core_array.getPopClone(mapList);
      _ref = mapList[0];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        _results.push(_this.setMapVal(target[key], childMapList, values));
      }
      return _results;
    };
  })(this);
  setInitVal = (function(_this) {
    return function(target, values) {
      var key, val, _results;
      _results = [];
      for (key in values) {
        val = values[key];
        if (_this.check(val)) {
          target[key] = {};
          _results.push(setInitVal(target[key], val));
        } else {
          _results.push(target[key] = val);
        }
      }
      return _results;
    };
  })(this);
  if (mapList.length > 0) {
    init(target, mapList[0]);
    return setChildMapVal(target, mapList, values);
  } else {
    return setInitVal(target, values);
  }
};


/**
  @method check
  Objectか判定します。
  @param {Object} obj 判定対象のデータ
  @return {boolean} 判定結果
 */

exports.check = function(obj) {
  return obj && typeof obj === "object" && !Array.isArray(obj);
};


/**
  @method clone
  オブジェクトのクローンを生成します。
  @param {Object} obj クローン元のデータ
  @return {Object} クローンデータ
 */

exports.clone = function(obj) {
  var f;
  f = function() {};
  f.prototype = obj;
  return new f;
};


/**
  @method deepClone
  オブジェクトのディープクローンを生成します。
  @param {Object} obj クローン元のデータ
  @return {Object} クローンデータ
 */

exports.deepClone = function(obj) {
  var object;
  return object = $.extend(true, {}, obj);
};


/**
  @method selectArray
  オブジェクトの配列で指定した要素を選択して返します。
  @param {Object} obj オブジェクト
  @param {array} array 配列
  @return {Object} 配列で選択したオブジェクト
 */

exports.selectArray = function(obj, array) {
  var key, objTemp, _i, _len;
  objTemp = obj;
  for (_i = 0, _len = array.length; _i < _len; _i++) {
    key = array[_i];
    objTemp = objTemp[key];
  }
  return objTemp;
};


/**
  @method parallelLoop
  オブジェクトを配列の指定された数までの要素で検索し、検出されたオブジェクト全要素に大して残りの配列要素で検索をかける
  @param {Object} obj オブジェクト
  @param {Array} key_array キー配列
  @param {Number} parallelNum 検索の継ぎ目となる番号
  @param {Function} objList 検索された要素
 */

exports.parallelLoop = (function(_this) {
  return function(obj, key_array, parallelNum) {
    var index_head, index_tail, key, objList, param, tempId, tempId2;
    objList = {};
    tempId = "";
    index_head = 0;
    while (index_head < parallelNum) {
      tempId += key_array[index_head] + "-";
      obj = obj[key_array[index_head]];
      index_head++;
    }
    for (key in obj) {
      param = obj[key];
      index_tail = index_head + 1;
      tempId2 = "";
      while (index_tail < key_array.length) {
        param = param[key_array[index_tail]];
        tempId2 += "-" + key_array[index_tail];
        index_tail++;
      }
      objList[tempId + key + tempId2] = param;
    }
    return objList;
  };
})(this);


/**
  @method marge
  オブジェクトを対象のオブジェクトに上書きでマージする
  @param {Object} target 対象のオブジェクト
  @param {Object} obj 上書きするオブジェクト
  @return {Object} マージしたオブジェクト
 */

exports.marge = function(target, obj) {
  var key, param, _results;
  _results = [];
  for (key in obj) {
    param = obj[key];
    if (target[key] === void 0) {
      target[key] = {};
    }
    if (this.check(param)) {
      _results.push(this.marge(target[key], param));
    } else {
      _results.push(target[key] = param);
    }
  }
  return _results;
};


/**
  @method keySeekAlg
  オブジェクト内の指定したkeyを持つオブジェクトに対して、callbackを実行します。
  @param {Object} obj 対象のオブジェクト
  @param {String} targetKey key
  @param {Object} callback callback(対象のオブジェクト)
 */

exports.keySeekAlg = function(obj, targetKey, callback) {
  var key, param, _results;
  _results = [];
  for (key in obj) {
    param = obj[key];
    if (this.check(param)) {
      _results.push(this.keySeekAlg(param, targetKey, callback));
    } else {
      if (key === targetKey) {
        _results.push(callback(obj));
      } else {
        _results.push(void 0);
      }
    }
  }
  return _results;
};


/**
  @method allCall
  オブジェクトに存在する指定したkeyのメソッドをすべて呼び出します。
  @param {Object} obj 対象のオブジェクト
  @callback {Object} callback key:メソッドkey, arg:可変長引数
 */

exports.allCall = function(obj, callback) {
  var call;
  call = function(target) {
    return target[callback.key].apply(target, callback.arg);
  };
  return this.keySeekAlg(obj, callback.key, call);
};


/**
  @method allDelete
  オブジェクトに存在する指定したkeyデータをすべて削除します。
  @param {Object} obj 対象のオブジェクト
  @param {String} key 削除データのkey
 */

exports.allDelete = function(obj, key) {
  var call;
  call = function(target) {
    return delete target[key];
  };
  return this.keySeekAlg(obj, key, call);
};



},{"./array":3}],7:[function(require,module,exports){

/**
  @class core.str
    文字列を操作します。
 */

/**
  @method addDQ
  前後にダブルクォーテーションを付与した文字列を返します。
  @param {String} 付与する文字列
  @return {String} 付与した文字列
 */
exports.addDQ = function(str) {
  return "\"" + str + "\"";
};


/**
  @method addSQ
  前後にシングルクォーテーションを付与した文字列を返します。
  @param {String} 付与する文字列
  @return {String} 付与した文字列
 */

exports.addSQ = function(str) {
  return "\'" + str + "\'";
};


/**
  @method getIndent
  指定した数のインデントを取得します。
  @param {Number} num インデント数
  @return {String} インデント
 */

exports.getIndent = function(num) {
  var index, str, _i;
  str = "";
  for (index = _i = 0; 0 <= num ? _i < num : _i > num; index = 0 <= num ? ++_i : --_i) {
    str += "\t";
  }
  return str;
};



},{}],8:[function(require,module,exports){

/**
  @class core.time
    時間データを操作します。
 */
var timer;

timer = {};


/**
  @method startTimer
  タイマーを開始します。
  @param {String} id タイマーID
 */

exports.startTimer = function(id) {
  var date;
  date = new Date();
  return timer[id] = date.getTime();
};


/**
  @method endTimer
  タイマーを終了し、経過時間を取得します。
  @param {String} id タイマーID
  @return {Number} 計測時間
 */

exports.endTimer = function(id) {
  var date, time;
  date = new Date();
  time = date.getTime() - timer[id];
  delete timer[id];
  return time;
};

exports.getNowTime = function() {
  var date;
  date = new Date();
  return String(date.getFullYear()) + String(date.getMonth() + 1) + String(date.getDate()) + String(date.getHours()) + String(date.getMinutes()) + String(date.getSeconds());
};



},{}],9:[function(require,module,exports){
var allCSS, animationSelect, core, css, data, debug, event_trans, loadFromFile, responsiveName, responsiveSelect, setCSS, setData, setGuiData, setTransOption, web, webeleSelect;

debug = require("debug");

core = require("core");

web = require("web");

data = require('./data');

css = require("css");

event_trans = require("event/trans");

webeleSelect = "BG";

responsiveName = web.size.chooseResponsiveMax(web.size.getResponsiveName(), data.responsiveMax);

responsiveSelect = "small";

animationSelect = "start";

allCSS = "";

exports.init = function() {
  var init_colorPicker;
  init_colorPicker = function() {
    $('#colorpicker_webCustomizer').farbtastic('#colorInput_webCustomizer');
    $.farbtastic('#colorpicker_webCustomizer').setColor(core.calc.hslToRGB(data.HSL));
    return data.colorList = web.color.getColorList(data.HSL);
  };
  init_colorPicker();
  setTransOption();
  $("#responsiveMax_select").val(data.responsiveMax);
  return $(window).trigger("resize");
};

setTransOption = function(id, val) {
  event_trans.option.method = data.gui_option.trans.method.val;
  event_trans.option.time = data.gui_option.trans.time.val;
  data.gui_option.trans.method.setGuiVal();
  return data.gui_option.trans.time.setGuiVal();
};

setGuiData = function(id, val) {
  var animeData, idList, index, key, key_anime, key_res, param, resData, webeleData, _i, _j, _k, _len, _len1, _len2, _ref;
  resData = [responsiveSelect];
  animeData = [animationSelect];
  if ($("#resAll_checked:checked").val()) {
    resData = data.responsiveList;
  }
  if ($("#animAll_checked:checked").val()) {
    animeData = data.animationState;
  }
  idList = id.split("_");
  for (_i = 0, _len = resData.length; _i < _len; _i++) {
    key_res = resData[_i];
    for (_j = 0, _len1 = animeData.length; _j < _len1; _j++) {
      key_anime = animeData[_j];
      webeleData = data.webele[key_res][webeleSelect][key_anime];
      if (idList.indexOf("all") === -1) {
        for (_k = 0, _len2 = idList.length; _k < _len2; _k++) {
          key = idList[_k];
          webeleData = webeleData[key];
        }
        webeleData.val = val;
      } else {
        _ref = core.obj.parallelLoop(webeleData, idList, idList.indexOf("all"));
        for (index in _ref) {
          param = _ref[index];
          param.val = val;
          param.setGuiVal();
        }
      }
    }
  }
  return setCSS();
};

core.obj.allCall(data.gui_css, {
  key: "initEvent",
  arg: [
    {
      method: setGuiData,
      arg: []
    }
  ]
});

core.obj.allCall(data.gui_option, {
  key: "initEvent",
  arg: [
    {
      method: setTransOption,
      arg: []
    }
  ]
});

$('*').bind('contextmenu', (function(_this) {
  return function(e) {
    if ($(e.currentTarget).data(data.name)) {
      webeleSelect = $(e.currentTarget).data(data.name);
    } else {
      webeleSelect = $(e.currentTarget).parents("[data-" + data.name + "]").data(data.name);
    }
    setData();
    return false;
  };
})(this));

$(window).resize((function(_this) {
  return function(e) {
    responsiveSelect = web.size.chooseResponsiveMax(web.size.getResponsiveName(), data.responsiveMax);
    $("#responsive_input").val(responsiveSelect);
    setData();
    return setCSS();
  };
})(this));

$("#webeleName_input").change((function(_this) {
  return function(e) {
    webeleSelect = $(e.currentTarget).val();
    return setData();
  };
})(this));

$("#animationState_select").change((function(_this) {
  return function(e) {
    animationSelect = $(e.currentTarget).val();
    return setData();
  };
})(this));

$("#responsiveMax_select").change((function(_this) {
  return function(e) {
    data.responsiveMax = $(e.currentTarget).val();
    return $(window).trigger("resize");
  };
})(this));

$('#colorInput_webCustomizer').bind('change', (function(_this) {
  return function(event) {
    var getHSL;
    getHSL = function() {
      var hslSprit;
      hslSprit = $("#colorInput_webCustomizer").val().split("_")[0].split(":");
      if (hslSprit[0] === "NaN" || hslSprit[1] === "NaN" || hslSprit[2] === "NaN") {
        return;
      }
      return {
        H: Number(hslSprit[0]),
        S: Number(hslSprit[1]),
        L: Number(hslSprit[2])
      };
    };
    data.HSL = getHSL();
    data.colorList = web.color.getColorList(data.HSL);
    return setCSS();
  };
})(this));

$("#page_save").click((function(_this) {
  return function(event) {
    data.setCookie();
    return alert("ページキャッシュに保存しました。");
  };
})(this));

$("#page_clear").click((function(_this) {
  return function(event) {
    data.clearCookie();
    return alert("ページキャッシュをクリアしました。");
  };
})(this));

$("#global_save").click((function(_this) {
  return function(event) {
    data.setCookie_G();
    return alert("グローバルキャッシュに保存しました。");
  };
})(this));

$("#global_clear").click((function(_this) {
  return function(event) {
    data.clearCookie_G();
    return alert("グローバルキャッシュをクリアしました。");
  };
})(this));

$("#generateCodes").click((function(_this) {
  return function(event) {
    console.log(allCSS);
    return alert("コンソールにコードを出力しました。");
  };
})(this));

$("#saveAsFile").click((function(_this) {
  return function(event) {
    return data.saveFile();
  };
})(this));

$("#loadFromFile").click((function(_this) {
  return function(event) {
    console.log("サーバデータをロードします。");
    return data.loadFile();
  };
})(this));

$("#commonSave").click((function(_this) {
  return function(event) {
    data.commonSave();
    return alert("共通データを保存しました。");
  };
})(this));

$("#commonLoad").click((function(_this) {
  return function(event) {
    data.commonLoad();
    return alert("共通データをロードしました。");
  };
})(this));

$("#saveBKFile").click((function(_this) {
  return function(event) {
    return data.saveBKFile();
  };
})(this));

$("#loadBKFile").click((function(_this) {
  return function(event) {
    return $("#loader").click();
  };
})(this));

loadFromFile = (function(_this) {
  return function(e, parent) {
    var JsonObj;
    JsonObj = JSON.parse(e.target.result);
    data.gui_css = JsonObj.gui_css;
    data.webele = JsonObj.webele;
    data.HSL = JsonObj.HSL;
    data.gui_option = JsonObj.gui_option;
    data.optionData = JsonObj.optionData;
    data.responsiveMax = JsonObj.responsiveMax;
    return _this.init();
  };
})(this);

core.file.registFileAPI("#loader", loadFromFile, this);

setData = function() {
  $("#webeleName_input").val(webeleSelect);
  core.obj.allCall(data.webele[responsiveSelect][webeleSelect][animationSelect], {
    key: "setGuiVal",
    arg: []
  });
  return core.obj.allCall(data.optionData, {
    key: "setGuiVal",
    arg: []
  });
};

setCSS = function() {
  var anime, cssData, getColor, getUnitVal, getVal, getValPX, key_res, section, setCSSStr, webele, webeleData, _i, _len, _ref, _results;
  getVal = function(valData) {
    if (valData) {
      return valData;
    } else {
      return "";
    }
  };
  getValPX = function(valData) {
    if (valData) {
      return valData + "px";
    } else {
      return "";
    }
  };
  getColor = function(colorData) {
    if (colorData.colorName.val && colorData.tone.val) {
      return data.colorList[colorData.colorName.val][colorData.tone.val];
    } else {
      return "";
    }
  };
  getUnitVal = function(unitData) {
    if (unitData.unit.val) {
      if (unitData.unit.val !== "%" && unitData.unit.val !== "px") {
        return unitData.unit.val;
      } else {
        if (unitData.num.val) {
          return unitData.num.val + unitData.unit.val;
        }
      }
    }
    return "";
  };
  setCSSStr = function(cssData) {
    var cssStr;
    cssStr = cssData.make();
    if (cssStr !== "") {
      css.core.setRule(cssStr);
    }
    return allCSS += cssStr;
  };
  css.core.deleteAllRule();
  allCSS = "";
  _ref = data.responsiveList;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    key_res = _ref[_i];
    _results.push((function() {
      var _j, _len1, _ref1, _results1;
      _ref1 = data.webeleList;
      _results1 = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        webele = _ref1[_j];
        if (web.size.chooseResponsiveMax(key_res, data.responsiveMax) !== key_res) {
          continue;
        }
        _results1.push((function() {
          var _k, _l, _len2, _len3, _len4, _len5, _m, _n, _ref2, _ref3, _ref4, _ref5, _results2;
          _ref2 = data.animationState;
          _results2 = [];
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            anime = _ref2[_k];
            cssData = data.css[key_res][webele][anime].main;
            webeleData = data.webele[key_res][webele][anime];
            if (anime === "end" && !webeleData.animation.trigger.val) {
              continue;
            }
            if (anime === "start") {
              cssData.animation.time = getVal(webeleData.animation.time.val);
            }
            if (anime !== "start") {
              cssData.animation.trigger = getVal(webeleData.animation.trigger.val);
            }
            cssData.background.color = getColor(webeleData.background.color);
            if (getVal(webeleData.background.image.val)) {
              cssData.background.image = "../img/imageList/" + getVal(webeleData.background.image.val);
            } else {
              cssData.background.image = "";
            }
            cssData.background.repeat = getVal(webeleData.background.repeat.val);
            cssData.background.attachment = getVal(webeleData.background.attachment.val);
            if (webeleData.background.grdDirection.val) {
              if (webeleData.background.grdDirection.val === "circle") {
                cssData.background.gradation = "radial-gradient(";
              } else {
                cssData.background.gradation = "linear-gradient(to ";
              }
              cssData.background.gradation += webeleData.background.grdDirection.val + ", " + getColor(webeleData.background.grdColor[1]) + " " + webeleData.background.grdPercent.val[0] + "%, " + getColor(webeleData.background.grdColor[2]) + " " + webeleData.background.grdPercent.val[1] + "%, " + getColor(webeleData.background.grdColor[3]) + " 100%)";
            } else {
              cssData.background.gradation = "";
            }
            switch (webeleData.background.size.x.unit.val) {
              case "contain":
              case "cover":
                cssData.background.size = webeleData.background.size.x.unit.val;
                break;
              default:
                if (webeleData.background.size.x.num.val) {
                  cssData.background.size = getUnitVal(webeleData.background.size.x) + " " + getUnitVal(webeleData.background.size.y);
                } else {
                  cssData.background.size = "";
                }
            }
            if (webeleData.background.direction.x.val) {
              cssData.background.position = webeleData.background.direction.x.val + " " + getUnitVal(webeleData.background.coord.x) + " " + webeleData.background.direction.y.val + " " + getUnitVal(webeleData.background.coord.y);
            } else {
              cssData.background.position = "";
            }
            _ref3 = ["left", "top", "right", "bottom"];
            for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
              section = _ref3[_l];
              if (webeleData.border[section].style.val) {
                cssData.border[section] = webeleData.border[section].style.val + " " + webeleData.border[section].width.val + "px " + getColor(webeleData.border[section].color);
              } else {
                cssData.border[section] = "";
              }
            }
            cssData.rule.important = getVal(webeleData.rule.important.val);
            if (webeleData.borderRadius.topLeft.val !== 0 || webeleData.borderRadius.topRight.val !== 0 || webeleData.borderRadius.bottomLeft.val !== 0 || webeleData.borderRadius.bottomRight.val !== 0) {
              cssData.radius.radius = webeleData.borderRadius.topLeft.val + "px " + webeleData.borderRadius.topRight.val + "px " + webeleData.borderRadius.bottomLeft.val + "px " + webeleData.borderRadius.bottomRight.val + "px";
            } else {
              cssData.radius.radius = "";
            }
            cssData.font.family = getVal(webeleData.font.family.val);
            cssData.font.size = getValPX(webeleData.font.size.val);
            cssData.font.lineHeight = getUnitVal(webeleData.font.lineHeight);
            cssData.font.weight = getVal(webeleData.font.weight.val);
            cssData.font.align = getVal(webeleData.font.align.val);
            cssData.font.color = getColor(webeleData.font.fontColor);
            cssData.font.decoration = getVal(webeleData.font.decoration.val);
            if (webeleData.font.shadow1.x.val !== 0 || webeleData.font.shadow1.y.val !== 0 || webeleData.font.shadow1.shade.val !== 0) {
              cssData.font.shadow = webeleData.font.shadow1.x.val + "px " + webeleData.font.shadow1.y.val + "px " + webeleData.font.shadow1.shade.val + "px " + getColor(webeleData.font.shadow1.color) + ", " + webeleData.font.shadow2.x.val + "px " + webeleData.font.shadow2.y.val + "px " + webeleData.font.shadow2.shade.val + "px " + getColor(webeleData.font.shadow2.color) + ", " + webeleData.font.shadow3.x.val + "px " + webeleData.font.shadow3.y.val + "px " + webeleData.font.shadow3.shade.val + "px " + getColor(webeleData.font.shadow3.color) + ", " + webeleData.font.shadow4.x.val + "px " + webeleData.font.shadow4.y.val + "px " + webeleData.font.shadow4.shade.val + "px " + getColor(webeleData.font.shadow4.color);
            }
            cssData.opacity.opacity = getVal(webeleData.opacity.opacity.val);
            cssData.position.position = getVal(webeleData.position.position.val);
            cssData.position.display = getVal(webeleData.position.display.val);
            cssData.position.zIndex = getVal(webeleData.position.zIndex.val);
            cssData.position.float = getVal(webeleData.position.float.val);
            cssData.position.clear = getVal(webeleData.position.clear.val);
            cssData.position.whiteSpace = getVal(webeleData.position.whiteSpace.val);
            cssData.position.overflow.x = getVal(webeleData.position.overflow.x.val);
            cssData.position.overflow.y = getVal(webeleData.position.overflow.y.val);
            cssData.position.top = getUnitVal(webeleData.position.top);
            cssData.position.left = getUnitVal(webeleData.position.left);
            cssData.position.bottom = getUnitVal(webeleData.position.bottom);
            cssData.position.right = getUnitVal(webeleData.position.right);
            if (webeleData.boxShadow.x.val !== 0 || webeleData.boxShadow.y.val !== 0 || webeleData.boxShadow.shade.val !== 0 || webeleData.boxShadow.size.val !== 0) {
              cssData.boxShadow.boxShadow = webeleData.boxShadow.x.val + "px " + webeleData.boxShadow.y.val + "px " + webeleData.boxShadow.shade.val + "px " + webeleData.boxShadow.size.val + "px " + getColor(webeleData.boxShadow.color) + " " + webeleData.boxShadow.inset.val;
            } else {
              cssData.boxShadow.boxShadow = "";
            }
            _ref4 = ["normal", "min", "max"];
            for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
              section = _ref4[_m];
              cssData.size[section].width = getUnitVal(webeleData.size[section].width);
              cssData.size[section].height = getUnitVal(webeleData.size[section].height);
            }
            _ref5 = ["left", "top", "right", "bottom"];
            for (_n = 0, _len5 = _ref5.length; _n < _len5; _n++) {
              section = _ref5[_n];
              cssData.space[section].margin = getUnitVal(webeleData.space[section].margin);
              cssData.space[section].padding = getUnitVal(webeleData.space[section].padding);
            }
            if (webeleData.transform.rotate.x.val || webeleData.transform.rotate.y.val || webeleData.transform.rotate.z.val || webeleData.transform.scale.val !== 1 || webeleData.transform.skew.x.val || webeleData.transform.skew.y.val || webeleData.transform.translate.x.val || webeleData.transform.translate.y.val) {
              cssData.transform.transform = "rotate3d(1,0,0," + webeleData.transform.rotate.x.val + "deg) " + "rotate3d(0,1,0," + webeleData.transform.rotate.y.val + "deg) " + "rotate3d(0,0,1," + webeleData.transform.rotate.z.val + "deg) " + "scale(" + webeleData.transform.scale.val + ") " + "skew(" + webeleData.transform.skew.x.val + "deg, " + webeleData.transform.skew.y.val + "deg) " + "translate(" + webeleData.transform.translate.x.val + "px, " + webeleData.transform.translate.y.val + "px)";
            } else {
              cssData.transform.transform = "";
            }
            if (webeleData.transform.origin.x.val || webeleData.transform.origin.y.val) {
              cssData.transform.origin = webeleData.transform.origin.x.val + "% " + webeleData.transform.origin.y.val + "%";
            } else {
              cssData.transform.origin = "";
            }
            setCSSStr(cssData);
            if (getColor(webeleData.font.linkColor.normal)) {
              cssData = data.css[key_res][webele][anime].link;
              cssData.animation.time = getVal(webeleData.animation.time.val);
              cssData.animation.trigger = "";
              cssData.font.color = getColor(webeleData.font.linkColor.normal);
              setCSSStr(cssData);
              cssData.animation.time = "";
              cssData.animation.trigger = "hover";
              cssData.font.color = getColor(webeleData.font.linkColor.hover);
              _results2.push(setCSSStr(cssData));
            } else {
              _results2.push(void 0);
            }
          }
          return _results2;
        })());
      }
      return _results1;
    })());
  }
  return _results;
};



},{"./data":10,"core":2,"css":13,"debug":16,"event/trans":21,"web":25}],10:[function(require,module,exports){
(function (global){
var anime, colorNameList, core, css, debug, ele, getColorGuiData, getJsonData, getUnitSliderGuiData, io, map, propData, res, setID, setJSONData, setLocalData, socketIO, web, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;

debug = require("debug");

core = require("core");

web = require("web");

css = require("css");

socketIO = require('socket.io-client');

exports.name = "webele";

exports.webeleList = web.data.getValues(this.name);

exports.HSL = {
  H: "0",
  S: "50",
  L: "50"
};

exports.colorList = web.color.getColorList(this.HSL);

colorNameList = web.color.getColorName();

colorNameList.color.unshift("");

colorNameList.tone.unshift("");

debug.data.imageList.unshift("");

exports.responsiveMax = "small";

exports.responsiveList = ["exSmall", "small"];

exports.animationState = ["start", "end"];


/*
  通信
 */

if (isLocalTest) {
  io = socketIO.connect('http://localhost:1234', {
    secure: true
  });
} else {
  io = socketIO.connect(global.serverURL);
}

getColorGuiData = function() {
  return {
    name: "color",
    colorName: new web.gui.selectBox({
      option: colorNameList.color
    }),
    tone: new web.gui.selectBox({
      val: "normal",
      option: colorNameList.tone
    })
  };
};

getUnitSliderGuiData = function(sliderData, unitData) {
  return {
    name: "unitSlider",
    num: new web.gui.slider(sliderData),
    unit: new web.gui.selectBox(unitData)
  };
};

setID = function(guiObj) {
  var key, param, set, _results;
  set = function(argKey, argParam) {
    var id, key, param, subKey, subParam, _results;
    _results = [];
    for (key in argParam) {
      param = argParam[key];
      id = argKey + "_" + key;
      if (!param.name) {
        _results.push(set(id, param));
      } else {
        if (param.name === "unitSlider" || param.name === "color") {
          _results.push((function() {
            var _results1;
            _results1 = [];
            for (subKey in param) {
              subParam = param[subKey];
              _results1.push(subParam.id = id + "_" + subKey);
            }
            return _results1;
          })());
        } else {
          _results.push(param.id = id);
        }
      }
    }
    return _results;
  };
  _results = [];
  for (key in guiObj) {
    param = guiObj[key];
    _results.push(set(key, param));
  }
  return _results;
};

exports.webele = {};

exports.gui_css = {
  animation: {
    init: function() {
      this.trigger = new web.gui.selectBox({
        option: ["", "hover", "active", "target", "focus", "checkd"]
      });
      return this.time = new web.gui.slider({
        param: {
          step: 0.01
        }
      });
    }
  },
  background: {
    init: function() {
      var section, _i, _j, _k, _len, _len1, _ref, _ref1;
      this.color = getColorGuiData();
      this.image = new web.gui.selectBox({
        option: debug.data.imageList
      });
      this.repeat = new web.gui.selectBox({
        option: ["", "repeat", "repeat-x", "repeat-y", "no-repeat"]
      });
      this.attachment = new web.gui.selectBox({
        option: ["", "scroll", "fixed"]
      });
      this.grdDirection = new web.gui.selectBox({
        option: ["", "left", "left top", "left bottom", "right", "right top", "right bottom", "top", "bottom", "circle"]
      });
      this.grdPercent = new web.gui.slider({
        val: [0, 0],
        option: ["", "left", "left top", "left bottom", "right", "right top", "right bottom", "top", "bottom", "circle"],
        param: {
          range: true
        }
      });
      this.grdColor = {};
      for (section = _i = 1; _i <= 3; section = ++_i) {
        this.grdColor[section] = getColorGuiData();
      }
      this.size = {};
      _ref = ["x", "y"];
      for (_j = 0, _len = _ref.length; _j < _len; _j++) {
        section = _ref[_j];
        this.size[section] = getUnitSliderGuiData({
          param: {
            max: 2000,
            min: -2000
          }
        }, {
          val: "auto",
          option: ["auto", "contain", "cover", "px", "%"]
        });
      }
      this.coord = {};
      _ref1 = ["x", "y"];
      for (_k = 0, _len1 = _ref1.length; _k < _len1; _k++) {
        section = _ref1[_k];
        this.coord[section] = getUnitSliderGuiData({
          param: {
            max: 2000,
            min: -2000
          }
        }, {
          val: "auto",
          option: ["auto", "px", "%"]
        });
      }
      return this.direction = {
        x: new web.gui.selectBox({
          option: ["", "left", "right"]
        }),
        y: new web.gui.selectBox({
          option: ["", "top", "bottom"]
        })
      };
    }
  },
  border: {
    init: function() {
      var section, _i, _len, _ref, _results;
      _ref = ["all", "left", "top", "right", "bottom"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        _results.push(this[section] = {
          width: new web.gui.slider({
            param: {
              max: 1000
            }
          }),
          style: new web.gui.selectBox({
            option: ["", "none", "hidden", "solid", "double", "groove", "ridge", "inset", "outset", "dashed", "dotted"]
          }),
          color: getColorGuiData()
        });
      }
      return _results;
    }
  },
  borderRadius: {
    init: function() {
      var section, _i, _len, _ref, _results;
      _ref = ["all", "topLeft", "topRight", "bottomLeft", "bottomRight"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        _results.push(this[section] = new web.gui.slider({
          param: {
            max: 500
          }
        }));
      }
      return _results;
    }
  },
  font: {
    init: function() {
      var section, _i, _len, _ref, _results;
      this.family = new web.gui.selectBox({
        option: ["", "Andale Mono", "Arial", "Arial Black", "Comic Sans MS", "Courier", "FixedSys", "Georgia", "Helvetica", "Impact", "Lucida", "ＭＳ Ｐゴシック", "ＭＳ Ｐ明朝", "ＭＳ ゴシック", "ＭＳ 明朝", "MS UI Gothic", "Small Fonts", "Symbol", "System", "Terminal", "Times New Roman", "Trebuchet MS", "Verdana", "Webdings"]
      });
      this.size = new web.gui.slider({
        param: {
          max: 300
        }
      });
      this.lineHeight = getUnitSliderGuiData({
        param: {
          max: 1000
        }
      }, {
        val: "",
        option: ["", "normal", "%", "px"]
      });
      this.weight = new web.gui.slider({
        param: {
          max: 900,
          min: 100,
          step: 100
        }
      });
      this.align = new web.gui.selectBox({
        option: ["", "left", "right", "center"]
      });
      this.decoration = new web.gui.selectBox({
        option: ["", "none", "underline", "overline", "line-through", "blink"]
      });
      this.fontColor = getColorGuiData();
      this.linkColor = {
        normal: getColorGuiData(),
        hover: getColorGuiData()
      };
      _ref = ["shadow1", "shadow2", "shadow3", "shadow4"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        _results.push(this[section] = {
          x: new web.gui.slider({
            param: {
              max: 1000,
              min: -1000
            }
          }),
          y: new web.gui.slider({
            param: {
              max: 1000,
              min: -1000
            }
          }),
          shade: new web.gui.slider({
            param: {
              max: 500
            }
          }),
          color: getColorGuiData()
        });
      }
      return _results;
    }
  },
  opacity: {
    init: function() {
      return this.opacity = new web.gui.slider({
        param: {
          max: 1,
          step: 0.01
        }
      });
    }
  },
  position: {
    init: function() {
      var section, _i, _j, _len, _len1, _ref, _ref1, _results;
      this.position = new web.gui.selectBox({
        option: ["", "static", "absolute", "relative", "fixed"]
      });
      this.display = new web.gui.selectBox({
        option: ["", "inline", "block", "list-item", "run-in", "inline-block", "table", "inline-table", "table-row-group", "table-header-group", "table-footer-group", "table-row", "table-column-group", "table-column", "table-cell", "table-caption", "none", "inherit"]
      });
      this.zIndex = new web.gui.slider({
        param: {
          max: 1000,
          min: -1000
        }
      });
      this.float = new web.gui.selectBox({
        option: ["", "left", "right"]
      });
      this.clear = new web.gui.selectBox({
        option: ["", "left", "right", "both"]
      });
      this.whiteSpace = new web.gui.selectBox({
        option: ["", "normal", "nowrap", "pre"]
      });
      _ref = ["top", "left", "bottom", "right"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        this[section] = getUnitSliderGuiData({
          param: {
            max: 2000,
            min: -2000
          }
        }, {
          val: "",
          option: ["", "auto", "px", "%"]
        });
      }
      this.overflow = {};
      _ref1 = ["x", "y"];
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        section = _ref1[_j];
        _results.push(this.overflow[section] = new web.gui.selectBox({
          option: ["", "visible", "scroll", "hidden", "auto"]
        }));
      }
      return _results;
    }
  },
  boxShadow: {
    init: function() {
      var section, _i, _len, _ref;
      _ref = ["x", "y"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        this[section] = new web.gui.slider({
          param: {
            max: 1000,
            min: -1000
          }
        });
      }
      this.shade = new web.gui.slider({
        param: {
          max: 500
        }
      });
      this.size = new web.gui.slider({
        param: {
          max: 1000,
          min: -1000
        }
      });
      this.color = getColorGuiData();
      return this.inset = new web.gui.selectBox({
        option: ["", "inset"]
      });
    }
  },
  size: {
    init: function() {
      var section, _i, _len, _ref, _results;
      _ref = ["normal", "max", "min"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        _results.push(this[section] = {
          width: getUnitSliderGuiData({
            param: {
              max: 2000
            }
          }, {
            val: "",
            option: ["", "auto", "%", "px", "none"]
          }),
          height: getUnitSliderGuiData({
            param: {
              max: 2000
            }
          }, {
            val: "",
            option: ["", "auto", "%", "px", "none"]
          })
        });
      }
      return _results;
    }
  },
  space: {
    init: function() {
      var section, _i, _len, _ref, _results;
      _ref = ["all", "left", "top", "right", "bottom"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        _results.push(this[section] = {
          margin: getUnitSliderGuiData({
            param: {
              max: 1000,
              min: -1000
            }
          }, {
            val: "",
            option: ["", "auto", "%", "px"]
          }),
          padding: getUnitSliderGuiData({
            param: {
              max: 1000,
              min: -1000
            }
          }, {
            val: "",
            option: ["", "auto", "%", "px"]
          })
        });
      }
      return _results;
    }
  },
  transform: {
    init: function() {
      var section, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _results;
      this.scale = new web.gui.slider({
        val: 1,
        param: {
          max: 10,
          step: 0.01
        }
      });
      this.rotate = {};
      _ref = ["x", "y", "z"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        this.rotate[section] = new web.gui.slider({
          param: {
            max: 180,
            min: -180
          }
        });
      }
      this.skew = {};
      _ref1 = ["x", "y"];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        section = _ref1[_j];
        this.skew[section] = new web.gui.slider({
          param: {
            max: 180,
            min: -180
          }
        });
      }
      this.translate = {};
      _ref2 = ["x", "y"];
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        section = _ref2[_k];
        this.translate[section] = new web.gui.slider({
          param: {
            max: 2000,
            min: -2000
          }
        });
      }
      this.origin = {};
      _ref3 = ["x", "y"];
      _results = [];
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        section = _ref3[_l];
        _results.push(this.origin[section] = new web.gui.slider({}));
      }
      return _results;
    }
  },
  rule: {
    init: function() {
      return this.important = new web.gui.selectBox({
        option: ["", "true"]
      });
    }
  }
};

core.obj.allCall(this.gui_css, {
  key: "init",
  arg: []
});

core.obj.allDelete(this.gui_css, "init");

setID(this.gui_css);

map = [this.responsiveList, this.webeleList, this.animationState];

core.obj.setMapVal(this.webele, map, this.gui_css);

exports.css = {};

_ref = this.responsiveList;
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  res = _ref[_i];
  this.css[res] = {};
  _ref1 = this.webeleList;
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    ele = _ref1[_j];
    this.css[res][ele] = {};
    _ref2 = this.animationState;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      anime = _ref2[_k];
      this.css[res][ele][anime] = {};
      propData = {
        id: res + "_" + ele + "_" + anime,
        selector: ["[data-webele=\"" + ele + "\"]"],
        media: {
          name: "min-width",
          val: web.size.getResponsiveMinWidth(res)
        }
      };
      this.css[res][ele][anime].main = new css.prop(propData);
      propData.selector = [propData.selector[0] + " a"];
      this.css[res][ele][anime].link = new css.prop(propData);
    }
  }
}

core.obj.allCall(this.css, {
  key: "init",
  arg: []
});

core.obj.allDelete(this.css, "init");

exports.optionData = {};

exports.gui_option = {
  trans: {
    init: function() {
      this.time = new web.gui.slider({
        param: {
          max: 10000,
          step: 100
        }
      });
      return this.method = new web.gui.selectBox({
        val: "none",
        option: ["none", "fade", "ver_blind", "hor_blind", "clip", "drop_up", "drop_down", "drop_left", "drop_right", "ver_slide", "hor_slide", "fold", "puff_on", "puff_off"]
      });
    }
  }
};

core.obj.allCall(this.gui_option, {
  key: "init",
  arg: []
});

core.obj.allDelete(this.gui_option, "init");

setID(this.gui_option);

core.obj.setMapVal(this.optionData, [], this.gui_option);

getJsonData = (function(_this) {
  return function() {
    return {
      webele: _this.webele,
      gui_css: _this.gui_css,
      gui_option: _this.gui_option,
      HSL: _this.HSL,
      optionData: _this.optionData,
      responsiveMax: _this.responsiveMax
    };
  };
})(this);

setJSONData = (function(_this) {
  return function(data) {
    var deleteExWebele, fix;
    fix = function() {
      console.log(_this.webele);
      return console.log("json fixed");
    };
    deleteExWebele = function() {
      var key, param, resParam, _ref3, _results;
      _ref3 = _this.webele;
      _results = [];
      for (key in _ref3) {
        resParam = _ref3[key];
        _results.push((function() {
          var _results1;
          _results1 = [];
          for (key in resParam) {
            param = resParam[key];
            if (this.webeleList.indexOf(key) === -1) {
              _results1.push(delete resParam[key]);
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }).call(_this));
      }
      return _results;
    };
    core.obj.marge(_this.gui_css, data.gui_css);
    core.obj.marge(_this.gui_option, data.gui_option);
    core.obj.marge(_this.webele, data.webele);
    _this.HSL = data.HSL;
    _this.optionData = data.optionData;
    _this.responsiveMax = data.responsiveMax;
    return deleteExWebele();
  };
})(this);

setLocalData = (function(_this) {
  return function() {
    if (localStorage.getItem(web.url.getPageName())) {
      setJSONData(JSON.parse(localStorage.getItem(web.url.getPageName())));
      return alert("ページキャッシュをロードしました。");
    } else if (localStorage.getItem(_this.name)) {
      setJSONData(JSON.parse(localStorage.getItem(_this.name)));
      return alert("グローバルキャッシュをロードしました。");
    } else {
      return _this.loadFile();
    }
  };
})(this);

exports.setCookie_G = function() {
  return localStorage.setItem(this.name, JSON.stringify(getJsonData()));
};

exports.clearCookie_G = function() {
  return localStorage.removeItem(this.name);
};

exports.setCookie = function() {
  return localStorage.setItem(web.url.getPageName() + this.name, JSON.stringify(getJsonData()));
};

exports.clearCookie = function() {
  return localStorage.removeItem(web.url.getPageName() + this.name);
};

exports.saveFile = function() {
  io.emit('fs_write', {
    fileName: "./webroot/public/css/cssEditor/" + web.url.getPageName() + ".json",
    data: JSON.stringify(getJsonData())
  });
  return alert("サーバデータを保存しました。");
};

exports.loadFile = function() {
  return io.emit('fs_read', {
    fileName: "./webroot/public/css/cssEditor/" + web.url.getPageName() + ".json",
    id: "cssEditor_load"
  });
};

exports.saveBKFile = function() {
  return core.file.downloadData(JSON.stringify(getJsonData()), this.name + "_" + web.url.getPageName() + "_" + core.time.getNowTime() + ".json");
};

exports.commonSave = function() {
  return io.emit('fs_write', {
    fileName: "./webroot/public/css/cssEditor/common.json",
    data: JSON.stringify(getJsonData())
  });
};

exports.commonLoad = function() {
  return io.emit('fs_read', {
    fileName: "./webroot/public/css/cssEditor/common.json",
    id: "cssEditor_load"
  });
};

io.on('cssEditor_load_end', (function(_this) {
  return function(loadData) {
    var ctr;
    setJSONData(loadData);
    ctr = require("./ctr");
    return ctr.init();
  };
})(this));

io.on('cssEditor_load_common_end', (function(_this) {
  return function(loadData) {
    var ctr;
    setJSONData(loadData);
    ctr = require("./ctr");
    return ctr.init();
  };
})(this));

setLocalData();



}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./ctr":9,"core":2,"css":13,"debug":16,"socket.io-client":32,"web":25}],11:[function(require,module,exports){
var ctr_css;

require("./data");

require('./view');

ctr_css = require('./ctr');

ctr_css.init();



},{"./ctr":9,"./data":10,"./view":12}],12:[function(require,module,exports){
var data, getChanger, getHeader, html, makeGui, web;

data = require('./data');

html = require('html');

web = require('web');

getHeader = function(id, iconName, domList) {
  var dom;
  dom = [
    [
      "div", {
        id: id,
        "class": "webCustomizer box_accordion draggable"
      }
    ], [
      [
        "div", {
          "class": "trigger fixed"
        }
      ], [html.dom.icon(id + "Icon", iconName, "fa-2x")], [
        "div", {
          "class": "contents"
        }
      ], domList
    ]
  ];
  return dom;
};

makeGui = function(guiObj) {
  var dom, key, makeContents, param;
  makeContents = function(dataParam) {
    var dom, dom_gui, getGuiDom, key, param, subKey, subParam;
    dom = [];
    for (key in dataParam) {
      param = dataParam[key];
      if (!param.name) {
        dom.push.apply(dom, [
          [
            "td", {
              "class": "sub",
              colspan: "3"
            }, key
          ], makeContents(param)
        ]);
      } else {
        getGuiDom = function(param, attr) {
          var slider, tempDom;
          if (attr == null) {
            attr = {};
          }
          tempDom = [];
          switch (param.name) {
            case "slider":
              slider = param.makeDom();
              tempDom = [[slider.slider, ["span"], slider.input]];
              break;
            case "selectBox":
              tempDom = [param.makeDom()];
          }
          return tempDom;
        };
        dom_gui = [["td"]];
        if (param.name === "unitSlider" || param.name === "color") {
          for (subKey in param) {
            subParam = param[subKey];
            dom_gui.push.apply(dom_gui, getGuiDom(subParam));
          }
        } else {
          dom_gui.push.apply(dom_gui, getGuiDom(param));
        }
        dom.push.apply(dom, [["tr"], [["td", {}, key]], dom_gui]);
      }
    }
    return dom;
  };
  dom = [];
  for (key in guiObj) {
    param = guiObj[key];
    dom.push.apply(dom, [
      [
        "div", {
          id: key + "Setter",
          "class": "setterArea box_accordion"
        }
      ], [
        [
          "div", {
            "class": "trigger"
          }, key
        ], [
          "div", {
            "class": "contents"
          }
        ], [["table"], makeContents(param)]
      ]
    ]);
  }
  return dom;
};

getChanger = function() {
  var dom, getCSS, getColorScheme, getData, getOption;
  getCSS = function() {
    return getHeader("cssChanger", "edit", [
      [
        "div", {
          "class": "headerArea"
        }
      ], [
        [
          "div", {
            "class": "headerFunction"
          }
        ], [["span", {}, "element"], html.dom.input("webeleName_input", 10, "none", "webeleName"), ["span", {}, "anime"], html.dom.selectBox("animationState_select", data.animationState), ["span", {}, "all"], html.dom.checkbox("animAll_checked", "false")], [
          "div", {
            "class": "headerFunction"
          }
        ], [["span", {}, "responsive"], html.dom.input("responsive_input", 7, "exSmall"), ["span", {}, "all"], html.dom.checkbox("resAll_checked", "true"), ["span", {}, "max"], html.dom.selectBox("responsiveMax_select", data.responsiveList)]
      ], [
        "div", {
          "class": "contentsArea css"
        }
      ], makeGui(data.gui_css)
    ]);
  };
  getColorScheme = function() {
    return getHeader("colorSchemeChanger", "tint", [
      [
        "div", {
          "class": "headerArea"
        }
      ], [
        "div", {
          "class": "contentsArea"
        }
      ], [
        [
          "div", {
            id: "colorpicker_webCustomizer"
          }
        ], [
          "input", {
            id: "colorInput_webCustomizer",
            type: "text",
            value: "0:0:0_#000000"
          }
        ]
      ]
    ]);
  };
  getOption = function() {
    return getHeader("optionChanger", "gear", [
      [
        "div", {
          "class": "headerArea"
        }
      ], [
        "div", {
          "class": "contentsArea option"
        }
      ], makeGui(data.gui_option)
    ]);
  };
  getData = function() {
    return getHeader("dataChanger", "save", [
      [
        "div", {
          "class": "headerArea"
        }
      ], [
        "div", {
          "class": "contentsArea"
        }
      ], [
        ["table"], [
          ["tr"], [
            ["td", {}, "serverData:"], ["td"], [
              [
                "button", {
                  id: "saveAsFile",
                  type: "button"
                }, "Save"
              ]
            ], ["td"], [
              [
                "button", {
                  id: "loadFromFile",
                  type: "button"
                }, "Load"
              ]
            ]
          ], ["tr"], [
            ["td", {}, "commonData:"], ["td"], [
              [
                "button", {
                  id: "commonSave",
                  type: "button"
                }, "Save"
              ]
            ], ["td"], [
              [
                "button", {
                  id: "commonLoad",
                  type: "button"
                }, "Load"
              ]
            ]
          ], ["tr"], [
            ["td", {}, "pageChash:"], ["td"], [
              [
                "button", {
                  id: "page_save",
                  type: "button"
                }, "Save"
              ]
            ], ["td"], [
              [
                "button", {
                  id: "page_clear",
                  type: "button"
                }, "Clear"
              ]
            ]
          ], ["tr"], [
            ["td", {}, "globalChash:"], ["td"], [
              [
                "button", {
                  id: "global_save",
                  type: "button",
                  href: "data:test.txt"
                }, "Save"
              ]
            ], ["td"], [
              [
                "button", {
                  id: "global_clear",
                  type: "button"
                }, "Clear"
              ]
            ]
          ], ["tr"], [
            ["td", {}, "code:"], ["td"], [
              [
                "button", {
                  id: "generateCodes",
                  type: "button"
                }, "Generate"
              ]
            ]
          ], ["tr"], [
            ["td", {}, "backup:"], ["td"], [
              [
                "button", {
                  id: "saveBKFile",
                  type: "button"
                }, "Save"
              ]
            ], ["td"], [
              [
                "input", {
                  id: "loader",
                  "class": "displayNone",
                  type: "file"
                }
              ], [
                "button", {
                  id: "loadBKFile",
                  type: "button"
                }, "Load"
              ]
            ]
          ]
        ]
      ]
    ]);
  };
  dom = [];
  dom.push.apply(dom, getCSS());
  dom.push.apply(dom, getColorScheme());
  dom.push.apply(dom, getOption());
  dom.push.apply(dom, getData());
  return dom;
};

$("#webCustomizerArea").append(html.core.make(getChanger()));



},{"./data":10,"html":22,"web":25}],13:[function(require,module,exports){
module.exports = {
  core: require('./lib/core'),
  prop: require('./lib/prop').prop
};



},{"./lib/core":14,"./lib/prop":15}],14:[function(require,module,exports){

/**
  @class css.core
  基本となるメソッドを扱います。
 */
var core, cssRulesNumber, styleSheet;

core = require('core');

styleSheet = document.styleSheets[document.styleSheets.length - 2];

cssRulesNumber = styleSheet.cssRules.length;


/**
  @method getVender
  vender名一覧を取得します。
  @return {Array} vender一覧
 */

exports.getVendor = function() {
  return ["", "-webkit-", "-moz-", "-o-", "-ms-"];
};


/**
  @method make
  css構造データからcssを生成します。
  @param {Object} cssData css構造データ
  @return 生成したcss
 */

exports.make = function(cssData, selectorParentList, level) {
  var css, key, param_css, setMedia, setSelector, setTag;
  if (selectorParentList == null) {
    selectorParentList = [];
  }
  if (level == null) {
    level = 0;
  }
  setTag = (function(_this) {
    return function(tag) {
      var getName, key, name, nameList, param, str, _i, _len;
      getName = function(name) {
        var nameList, vender, _i, _len, _ref;
        nameList = [];
        switch (name) {
          case "transform":
          case "transform-origin":
          case "transition":
            _ref = _this.getVendor();
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              vender = _ref[_i];
              nameList.push(vender + name);
            }
            break;
          default:
            nameList.push(name);
        }
        return nameList;
      };
      str = "";
      for (key in tag) {
        param = tag[key];
        nameList = getName(key);
        for (_i = 0, _len = nameList.length; _i < _len; _i++) {
          name = nameList[_i];
          str += core.str.getIndent(level + 1) + name + ": " + param + ";\n";
        }
      }
      return str;
    };
  })(this);
  setSelector = function(selector, selectorParentList) {
    var getParentNameList, getVal, index, index_parent, name, parentName, str, _ref, _ref1;
    getParentNameList = function(selectorParentList) {
      var parentName, selectorParent, str, strList, _i, _j, _len, _len1, _ref;
      strList = [];
      for (_i = 0, _len = selectorParentList.length; _i < _len; _i++) {
        selectorParent = selectorParentList[_i];
        str = "";
        _ref = selectorParent.name;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          parentName = _ref[_j];
          str += parentName;
          if (selectorParent.event) {
            str += ":" + selectorParent.event;
          }
          str += " ";
          strList.push(str);
        }
      }
      return strList;
    };
    getVal = function(name, selector) {
      var str;
      str = "";
      str += name;
      if (selector.event) {
        str += ":" + selector.event;
      }
      return str;
    };
    str = core.str.getIndent(level);
    _ref = selector.name;
    for (index in _ref) {
      name = _ref[index];
      if (index > 0) {
        str += ", ";
      }
      if (selectorParentList.length > 0) {
        _ref1 = getParentNameList(selectorParentList);
        for (index_parent in _ref1) {
          parentName = _ref1[index_parent];
          if (index_parent > 0) {
            str += ", ";
          }
          str += getVal(parentName + name, selector);
        }
      } else {
        str += getVal(name, selector);
      }
    }
    str += " {\n";
    return str;
  };
  setMedia = function(media) {
    var str;
    str = core.str.getIndent(level);
    switch (media.type) {
      case "min-width":
        str += "@media screen and (min-width:" + media.val + "px){ \n";
    }
    return str;
  };
  css = "";
  for (key in cssData) {
    param_css = cssData[key];
    if (param_css.media) {
      css += setMedia(param_css.media);
      if (param_css.child) {
        css += this.make(param_css.child, selectorParentList, level + 1);
      }
      css += core.str.getIndent(level) + "}\n";
    } else {
      css += setSelector(param_css.selector, selectorParentList);
      css += setTag(param_css.tag);
      css += core.str.getIndent(level) + "}\n";
      if (param_css.child) {
        selectorParentList.push(param_css.selector);
        css += this.make(param_css.child, selectorParentList, level);
        selectorParentList.pop();
      }
    }
  }
  return css;
};

exports.setRule = function(cssStr, num) {
  var styleNum;
  if (num) {
    styleNum = cssRulesNumber + num - 1;
  } else {
    styleNum = styleSheet.cssRules.length;
  }
  return styleSheet.insertRule(cssStr, styleNum);
};

exports.deleteRule = function(num) {
  var styleNum;
  if (num) {
    styleNum = cssRulesNumber + num - 2;
  } else {
    styleNum = styleSheet.cssRules.length - 1;
  }
  return styleSheet.deleteRule(styleNum);
};

exports.deleteAllRule = function() {
  var len, _results;
  len = styleSheet.cssRules.length;
  _results = [];
  while (len > cssRulesNumber) {
    styleSheet.deleteRule(styleSheet.cssRules.length - 1);
    _results.push(len = styleSheet.cssRules.length);
  }
  return _results;
};



},{"core":2}],15:[function(require,module,exports){
var core, css_core, prop;

core = require('core');

css_core = require("./core");


/**
  @class css.prop
  プロパティを制御します。
 */

prop = (function() {
  function prop(param) {
    if (param.id) {
      this.id = param.id;
    }
    if (param.selector) {
      this.selector = param.selector;
    }
    if (param.media) {
      this.media = {
        name: param.media.name,
        val: param.media.val
      };
    }
    this.animation = {
      init: function(param) {
        this.trigger = "";
        return this.time = 0;
      }
    };
    this.background = {
      init: function(param) {
        this.color = "";
        this.image = "";
        this.gradation = "";
        this.size = "";
        this.repeat = "";
        this.attachment = "";
        return this.position = "";
      }
    };
    this.border = {
      init: function(param) {
        var section, _i, _len, _ref, _results;
        _ref = ["left", "top", "right", "bottom"];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          section = _ref[_i];
          _results.push(this[section] = "");
        }
        return _results;
      }
    };
    this.radius = {
      init: function(param) {
        return this.radius = "";
      }
    };
    this.rule = {
      init: function(param) {
        return this.important = "";
      }
    };
    this.font = {
      init: function(param) {
        this.family = "";
        this.size = "";
        this.lineHeight = "";
        this.weight = "";
        this.color = "";
        this.align = "";
        this.decoration = "";
        return this.shadow = "";
      }
    };
    this.opacity = {
      init: function(param) {
        return this.opacity = "";
      }
    };
    this.position = {
      init: function(param) {
        this.position = "";
        this.display = "";
        this.overflow = {
          x: "",
          y: ""
        };
        this.zIndex = "";
        this.float = "";
        this.whiteSpace = "";
        this.clear = "";
        this.top = "";
        this.left = "";
        this.bottom = "";
        return this.right = "";
      }
    };
    this.boxShadow = {
      init: function(param) {
        return this.boxShadow = "";
      }
    };
    this.size = {
      init: function(param) {
        var type, _i, _len, _ref, _results;
        _ref = ["normal", "min", "max"];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          type = _ref[_i];
          _results.push(this[type] = {
            width: "",
            height: ""
          });
        }
        return _results;
      }
    };
    this.space = {
      init: function(param) {
        var section, _i, _len, _ref, _results;
        _ref = ["left", "top", "right", "bottom"];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          section = _ref[_i];
          _results.push(this[section] = {
            margin: "",
            padding: ""
          });
        }
        return _results;
      }
    };
    this.transform = {
      init: function(param) {
        this.transform = "";
        return this.origin = "";
      }
    };
  }

  prop.prototype.make = function() {
    var cssData, key, param, section, tagData, _i, _j, _len, _len1, _ref, _ref1;
    cssData = {
      1: {
        media: {
          type: "min-width",
          val: this.media.val
        },
        child: {
          1: {
            selector: {
              name: this.selector,
              event: this.animation.trigger ? this.animation.trigger : void 0
            },
            tag: {},
            child: {}
          }
        }
      }
    };
    tagData = cssData["1"].child["1"].tag;
    if (this.animation.time) {
      tagData.transition = "all " + this.animation.time + "s linear";
    }
    if (this.background.color) {
      tagData["background-color"] = this.background.color;
    }
    if (this.background.image && this.background.gradation) {
      tagData["background-image"] = "url(\"" + this.background.image + "\"), " + this.background.gradation;
    } else if (this.background.image) {
      tagData["background-image"] = "url(\"" + this.background.image + "\")";
    } else if (this.background.gradation) {
      tagData["background-image"] = this.background.gradation;
    }
    if (this.background.size) {
      tagData["background-size"] = this.background.size;
    }
    if (this.background.repeat) {
      tagData["background-repeat"] = this.background.repeat;
    }
    if (this.background.attachment) {
      tagData["background-attachment"] = this.background.attachment;
    }
    if (this.background.position) {
      tagData["background-position"] = this.background.position;
    }
    _ref = ["left", "top", "right", "bottom"];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      section = _ref[_i];
      if (this.border[section]) {
        tagData["border-" + section] = this.border[section];
      }
    }
    if (this.radius.radius) {
      tagData["border-radius"] = this.radius.radius;
    }
    if (this.font.family) {
      tagData["font-family"] = this.font.family;
    }
    if (this.font.size) {
      tagData["font-size"] = this.font.size;
    }
    if (this.font.lineHeight) {
      tagData["line-height"] = this.font.lineHeight;
    }
    if (this.font.weight) {
      tagData["font-weight"] = this.font.weight;
    }
    if (this.font.color) {
      tagData["color"] = this.font.color;
    }
    if (this.font.align) {
      tagData["text-align"] = this.font.align;
    }
    if (this.font.decoration) {
      tagData["text-decoration"] = this.font.decoration;
    }
    if (this.font.shadow) {
      tagData["text-shadow"] = this.font.shadow;
    }
    if (this.opacity.opacity) {
      tagData["opacity"] = this.opacity.opacity;
    }
    if (this.position.position) {
      tagData["position"] = this.position.position;
    }
    if (this.position.display) {
      tagData["display"] = this.position.display;
    }
    if (this.position.overflow.x) {
      tagData["overflow-x"] = this.position.overflow.x;
    }
    if (this.position.overflow.y) {
      tagData["overflow-y"] = this.position.overflow.y;
    }
    if (this.position.zIndex) {
      tagData["z-index"] = this.position.zIndex;
    }
    if (this.position.float) {
      tagData["float"] = this.position.float;
    }
    if (this.position.clear) {
      tagData["clear"] = this.position.clear;
    }
    if (this.position.whiteSpace) {
      tagData["white-space"] = this.position.whiteSpace;
    }
    if (this.position.top) {
      tagData["top"] = this.position.top;
    }
    if (this.position.left) {
      tagData["left"] = this.position.left;
    }
    if (this.position.bottom) {
      tagData["bottom"] = this.position.bottom;
    }
    if (this.position.right) {
      tagData["right"] = this.position.right;
    }
    if (this.boxShadow.boxShadow) {
      tagData["box-shadow"] = this.boxShadow.boxShadow;
    }
    if (this.size.normal.width) {
      tagData["width"] = this.size.normal.width;
    }
    if (this.size.normal.height) {
      tagData["height"] = this.size.normal.height;
    }
    if (this.size.max.width) {
      tagData["max-width"] = this.size.max.width;
    }
    if (this.size.max.height) {
      tagData["max-height"] = this.size.max.height;
    }
    if (this.size.min.width) {
      tagData["min-width"] = this.size.min.width;
    }
    if (this.size.min.height) {
      tagData["min-height"] = this.size.min.height;
    }
    _ref1 = ["left", "top", "right", "bottom"];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      section = _ref1[_j];
      if (this.space[section].margin) {
        tagData["margin-" + section] = this.space[section].margin;
      }
      if (this.space[section].padding) {
        tagData["padding-" + section] = this.space[section].padding;
      }
    }
    if (this.transform.transform) {
      tagData["transform"] = this.transform.transform;
    }
    if (this.transform.origin) {
      tagData["transform-origin"] = this.transform.origin;
    }
    if (Object.keys(tagData).length !== 0) {
      if (this.rule.important) {
        for (key in tagData) {
          param = tagData[key];
          tagData[key] = tagData[key] + " !important";
        }
      }
      return css_core.make(cssData);
    } else {
      return "";
    }
  };

  return prop;

})();

module.exports = {
  prop: prop
};



},{"./core":14,"core":2}],16:[function(require,module,exports){
module.exports = {
  test: require("./lib/test"),
  data: require("./lib/data")
};



},{"./lib/data":17,"./lib/test":18}],17:[function(require,module,exports){
exports.imageList = ["none.png", "bg1.png", "bg2.png", "contents.png", "button.png", "char_A.jpg", "char_B.jpg", "gallery.jpg", "h_char.jpg", "h_dl.jpg", "h_garallery.jpg", "h_story.jpg", "main.jpg", "room.jpg", "story.jpg"];



},{}],18:[function(require,module,exports){

/**
  @class debug.test
    テストを行います。
 */
var core;

core = require("core");


/**
  @method startTimer
  時間計測を開始します。
  @param {String} testID テストID
 */

exports.startTimer = function(testID) {
  return core.time.startTimer(testID);
};


/**
  @method endTimer
  時間計測を終了します。
  @param {String} testID テストID
 */

exports.endTimer = function(testID) {
  return console.log(testID + "_time:" + core.time.endTimer(testID) + "ms");
};



},{"core":2}],19:[function(require,module,exports){
exports.fadein = function(target, time) {
  return $(target).animate({
    opacity: "show"
  }, {
    duration: time,
    easing: 'linear'
  });
};

exports.fadeout = function(target, time) {
  return $(target).animate({
    opacity: "hide"
  }, {
    duration: time,
    easing: 'linear'
  });
};

exports.blind = function(target, time, dir) {
  return $(target).toggle("blind", {
    "direction": dir
  }, time);
};

exports.clip = function(target, time, dir) {
  return $(target).toggle("clip", {
    "direction": dir
  }, time);
};

exports.drop = function(target, time, dir) {
  return $(target).toggle("drop", {
    "direction": dir
  }, time);
};

exports.slide = function(target, time, dir, distance) {
  return $(target).toggle("slide", {
    "direction": dir,
    "distance": distance
  }, time);
};

exports.explode = function(target, time, pieces) {
  return $(target).toggle("explode", {
    "pieces": pieces
  }, time);
};

exports.fold = function(target, time, horizFirst, size) {
  return $(target).toggle("fold", {
    "horizFirst": horizFirst,
    "size": size
  }, time);
};

exports.puff = function(target, time, per) {
  return $(target).toggle("puff", {
    "percent": per
  }, time);
};

exports.scale = function(target, time, dir, origin, per, scale) {
  return $(target).toggle("scale", {
    "direction": dir,
    "origin": origin,
    "percent": per,
    "scale": scale
  }, time);
};



},{}],20:[function(require,module,exports){
exports.init = function() {
  $('.tooltipEle').tooltip();
  $(".draggable").draggable({
    connectToSortable: false
  });
  $(".slider").slider({
    range: "max",
    slide: function(e, ui) {
      return $(this).next().val(ui.value);
    }
  });
  return $(".box_accordion .trigger").click(function() {
    return $(this).next().slideToggle();
  });
};



},{}],21:[function(require,module,exports){
var effect, effect_anim;

effect_anim = require("effect/anim");

exports.option = {
  target: "#transition",
  method: "none",
  time: 500
};

exports["in"] = function() {
  return effect("in");
};

exports.out = function(url) {
  effect("out");
  setTimeout(function() {
    return window.location.href = url;
  }, this.option.time);
  return false;
};

effect = (function(_this) {
  return function(state) {
    switch (_this.option.method) {
      case "none":
        if (state === "in") {
          return $(_this.option.target).css("display", "block");
        }
        break;
      case "fade":
        if (state === "in") {
          return effect_anim.fadein(_this.option.target, _this.option.time);
        } else {
          return effect_anim.fadeout(_this.option.target, _this.option.time);
        }
        break;
      case "ver_blind":
        return effect_anim.blind(_this.option.target, _this.option.time, "up");
      case "hor_blind":
        if (state === "in") {
          return effect_anim.blind(_this.option.target, _this.option.time, "left");
        } else {
          return effect_anim.blind(_this.option.target, _this.option.time, "right");
        }
        break;
      case "ver_clip":
        return effect_anim.clip(_this.option.target, _this.option.time, "vertical");
      case "clip":
        return effect_anim.clip(_this.option.target, _this.option.time, "horizontal");
      case "drop_up":
        return effect_anim.drop(_this.option.target, _this.option.time, "up");
      case "drop_down":
        return effect_anim.drop(_this.option.target, _this.option.time, "down");
      case "drop_left":
        return effect_anim.drop(_this.option.target, _this.option.time, "left");
      case "drop_right":
        if (state === "in") {
          return effect_anim.drop(_this.option.target, _this.option.time, "left");
        } else {
          return effect_anim.drop(_this.option.target, _this.option.time, "right");
        }
        break;
      case "ver_slide":
        if (state === "in") {
          return effect_anim.slide(_this.option.target, _this.option.time, "up", 1000);
        } else {
          return effect_anim.slide(_this.option.target, _this.option.time, "down", 1000);
        }
        break;
      case "hor_slide":
        if (state === "in") {
          return effect_anim.slide(_this.option.target, _this.option.time, "left");
        } else {
          return effect_anim.slide(_this.option.target, _this.option.time, "right");
        }
        break;
      case "fold":
        return effect_anim.fold(_this.option.target, _this.option.time, true, 700);
      case "puff_on":
        return effect_anim.puff(_this.option.target, _this.option.time, 150);
      case "puff_off":
        return effect_anim.puff(_this.option.target, _this.option.time, 50);
    }
  };
})(this);

exports.check_access = function() {
  return $.cookie('access');
};

exports.check_anker = function(a) {
  return $(a).attr('href').indexOf("#") === -1;
};

exports.preLoading = function(preImageList, callback_trans) {
  var list, loaded, persent, persentCnt, _i, _len, _results;
  $("#loading").css("display", "block");
  loaded = 0;
  persentCnt = 0;
  persent = Math.ceil(100 / preImageList.length);
  _results = [];
  for (_i = 0, _len = preImageList.length; _i < _len; _i++) {
    list = preImageList[_i];
    _results.push($('<img>').attr('src', "./src/img/" + list).load((function(_this) {
      return function() {
        var timer;
        loaded++;
        return timer = setInterval(function() {
          if (persentCnt >= 100) {
            clearTimeout(timer);
            $("#loading").fadeOut();
            $.cookie('access', 'true');
            return callback_trans();
          } else {
            if (persentCnt <= loaded * persent) {
              persentCnt += loaded * persent;
            }
            return $('#load_count').text(persentCnt + '%');
          }
        }, 10);
      };
    })(this)));
  }
  return _results;
};



},{"effect/anim":19}],22:[function(require,module,exports){
module.exports = {
  core: require('./lib/core'),
  dom: require('./lib/dom')
};



},{"./lib/core":23,"./lib/dom":24}],23:[function(require,module,exports){

/**
  @class html.core
  基本となるメソッドを扱います。
 */
var core;

core = require('core');


/**
  @method make
  dom配列データをhtmlに変換します。
  @param {Array} dom 変換するdomデータ
  @param {Number} [level=0] インデントレベル
  @return {String} htmlコード
 */

exports.make = function(dom, level) {
  var addHtmlLine, closedTag, formatTag, getClosedTag, html, htmlLine, _i, _len;
  if (level == null) {
    level = 0;
  }
  addHtmlLine = function(htmlLine, level) {
    return level + htmlLine + "\n";
  };
  getClosedTag = function(htmlLine, level) {
    var tag, tagName;
    tagName = htmlLine.split(">")[0].split(" ")[0].substr(1);
    tag = "";
    if (tagName !== "br") {
      tag = level + "</" + tagName + ">" + "\n";
    }
    return tag;
  };
  formatTag = function(tag, attrList, val) {
    var closeOpenedTag, getAttr, getOpenedTag, getValue, str;
    getOpenedTag = function(tag) {
      return "<" + tag;
    };
    getAttr = function(attrList) {
      var attr, key, str;
      str = "";
      for (key in attrList) {
        attr = attrList[key];
        if (key === "checked" && attr === "false") {
          continue;
        }
        str += " " + key + "=" + core.str.addDQ(attr);
      }
      return str;
    };
    closeOpenedTag = function() {
      return ">";
    };
    getValue = function(val) {
      if (val !== void 0) {
        return val;
      } else {
        return "";
      }
    };
    str = getOpenedTag(tag);
    str += getAttr(attrList);
    str += closeOpenedTag();
    return str += getValue(val);
  };
  html = closedTag = "";
  for (_i = 0, _len = dom.length; _i < _len; _i++) {
    htmlLine = dom[_i];
    if (htmlLine[0] instanceof Array) {
      html += this.make(htmlLine, level + 1);
    } else {
      htmlLine = formatTag(htmlLine[0], htmlLine[1], htmlLine[2]);
      if (closedTag !== "") {
        html += closedTag;
      }
      closedTag = getClosedTag(htmlLine, core.str.getIndent(level));
      html += addHtmlLine(htmlLine, core.str.getIndent(level));
    }
  }
  return html += closedTag;
};



},{"core":2}],24:[function(require,module,exports){

/**
  @class html.dom
  dom配列を生成します。
 */

/**
  @method selectBox
  selectBoxを生成します。
  @param {String} id id
  @param {Array} optionList option配列
  @param {String} [className=""] クラス名
  @return {Array} dom配列
 */
exports.selectBox = function(id, optionList, className) {
  var html_selectBoxOption, option, _i, _len;
  if (className == null) {
    className = "";
  }
  html_selectBoxOption = [];
  for (_i = 0, _len = optionList.length; _i < _len; _i++) {
    option = optionList[_i];
    html_selectBoxOption.push([
      "option", {
        value: option
      }, option
    ]);
  }
  return [
    [
      "select", {
        id: id,
        "class": className + " select"
      }
    ], html_selectBoxOption
  ];
};


/**
  @method slider
  sliderを生成します。
  @param {String} id id
  @param {String} [className=""] クラス名
  @param {Number} [size=4] inputサイズ
  @return {Array} dom配列
 */

exports.slider = function(id, className, size) {
  if (className == null) {
    className = "";
  }
  if (size == null) {
    size = 4;
  }
  return {
    slider: [
      "div", {
        id: id,
        "class": className + " slider"
      }
    ],
    input: this.input(id + "_input", 4, "", className + " sliderInput")
  };
};


/**
  @method icon
  iconを生成します。
  @param {String} id id
  @param {String} iconName icon名
  @param {String} [className=""] クラス名
  @return {Array} dom配列
 */

exports.icon = function(id, iconName, className) {
  if (className == null) {
    className = "";
  }
  return [
    "i", {
      id: id,
      "class": className + " fa fa-" + iconName
    }
  ];
};


/**
  @method input
  inputを生成します。
  @param {String} id id
  @param {Number} [size=5] inputサイズ
  @param {String} val inputの値
  @param {String} [className=""] クラス名
  @return {Array} dom配列
 */

exports.input = function(id, size, val, className) {
  if (size == null) {
    size = "5";
  }
  if (val == null) {
    val = "";
  }
  if (className == null) {
    className = "";
  }
  return [
    "input", {
      id: id,
      "class": className,
      type: "text",
      size: size,
      value: val
    }
  ];
};


/**
  @method checkbox
  checkboxを生成します。
  @param {String} id id
  @param {String} checked checked
  @param {String} [className=""] クラス名
  @return {Array} dom配列
 */

exports.checkbox = function(id, checked, className) {
  if (className == null) {
    className = "";
  }
  return [
    "input", {
      id: id,
      "class": className,
      type: "checkbox",
      checked: checked
    }
  ];
};


/**
  @method button
  buttonを生成します。
  @param {String} id id
  @param {String} text ボタンテキスト
  @param {String} [className=""] クラス名
  @return {Array} dom配列
 */

exports.button = function(id, text, className) {
  if (className == null) {
    className = "";
  }
  return [
    "button", {
      id: id,
      type: "button",
      "class": className
    }, text
  ];
};



},{}],25:[function(require,module,exports){
module.exports = {
  data: require("./lib/data"),
  color: require("./lib/color"),
  size: require("./lib/size"),
  gui: require("./lib/gui"),
  core: require("./lib/core"),
  url: require("./lib/url")
};



},{"./lib/color":26,"./lib/core":27,"./lib/data":28,"./lib/gui":29,"./lib/size":30,"./lib/url":31}],26:[function(require,module,exports){

/**
  @class web.color
    web上で使用する色情報を扱います。
 */
var core;

core = require("core");


/**
  @method getColorList
  指定したHSLからカラーリストを取得します
  @param {object} HSL HSLデータ
  @return {object} カラーリスト
 */

exports.getColorList = function(HSL) {
  var addColorList, baseColor, baseColorList　, monoHSL, name, reverseMonoHSL, toneColorList, triadColorList;
  monoHSL = core.obj.clone(HSL);
  monoHSL["S"] = 0;
  reverseMonoHSL = core.obj.clone(HSL);
  reverseMonoHSL["S"] = 0;
  reverseMonoHSL["L"] = 100 - HSL["L"];
  baseColorList　 = {
    base: core.calc.hslToRGB(HSL),
    reverse: $.xcolor.complementary(core.calc.hslToRGB(HSL)),
    sepia: $.xcolor.sepia(core.calc.hslToRGB(HSL)),
    black: "#000",
    white: "#fff",
    blue: "#11c",
    mono: core.calc.hslToRGB(monoHSL),
    reverseMono: core.calc.hslToRGB(reverseMonoHSL)
  };
  addColorList = function(list, name, xColor) {
    list[name] = {};
    list[name]["normal"] = xColor;
    list[name]["dim"] = $.xcolor.subtractive("#eeeeee", xColor);
    list[name]["dark"] = $.xcolor.darken(xColor);
    list[name]["moreDark"] = $.xcolor.darken($.xcolor.darken(xColor));
    list[name]["light"] = $.xcolor.lighten(xColor);
    list[name]["moreLight"] = $.xcolor.lighten($.xcolor.lighten(xColor));
    return list[name]["webSafe"] = $.xcolor.webround(xColor);
  };
  toneColorList = {};
  for (name in baseColorList) {
    baseColor = baseColorList[name];
    triadColorList = $.xcolor.triad(baseColor);
    addColorList(toneColorList, name, triadColorList[0]);
    if (name === "base" || name === "reverse") {
      addColorList(toneColorList, name + "Second", triadColorList[1]);
      addColorList(toneColorList, name + "Third", triadColorList[2]);
    }
  }
  return toneColorList;
};


/**
  @method getColorName
  getColorListで取得できる色の名前一覧を取得します。
  @return {object} 名前一覧
 */

exports.getColorName = function() {
  var colorList, colorNameList, data, key, _ref;
  colorNameList = {
    color: [],
    tone: []
  };
  colorList = this.getColorList({
    H: "0",
    S: "0",
    L: "0"
  });
  for (key in colorList) {
    data = colorList[key];
    colorNameList.color.push(key);
  }
  _ref = colorList.base;
  for (key in _ref) {
    data = _ref[key];
    colorNameList.tone.push(key);
  }
  colorNameList.color = core.array.repFilter(colorNameList.color);
  colorNameList.tone = core.array.repFilter(colorNameList.tone);
  return colorNameList;
};



},{"core":2}],27:[function(require,module,exports){

/**
  @class web.core
    web操作の基本となるメソッドを管理します。
 */
var core;

core = require("core");


/**
  @method getDataValList
  指定したデータ属性の値を配列として重複なく習得します。
  @param {string} dataName データ属性名
  @return {array} データ属性の値一覧
 */

exports.getDataValList = function(dataName) {
  var array;
  array = $("*").map(function() {
    return $(this).data(dataName);
  }).get();
  return core.array.repFilter(array);
};


/**
  @method getIdList
  セレクタで指定した要素のIDを配列として重複なく習得します。
  @param {string} selector セレクタ
  @return {array} IDリスト
 */

exports.getEleIDList = function(selector) {
  var array;
  array = $(selector).map(function() {
    return $(this).attr("id");
  }).get();
  return core.array.repFilter(array);
};



},{"core":2}],28:[function(require,module,exports){

/**
  @class web.data
    data属性値を操作します。
 */
var core, getValues;

core = require("core");


/**
  @method getValues
  指定したデータ属性の値を配列として重複なく習得します。
  @param {string} dataName データ属性名
  @return {array} データ属性の値一覧
 */

getValues = function(dataName) {
  var array;
  array = $("*").map(function() {
    return $(this).data(dataName);
  }).get();
  return core.array.repFilter(array);
};

module.exports = {
  getValues: getValues
};



},{"core":2}],29:[function(require,module,exports){
var button, color, colorPicker, core, gui, html, input, selectBox, slider,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

core = require("core");

html = require('html');

color = require("./color");


/**
  @class web.gui
    guiをコントロールします。
 */

gui = (function() {
  function gui() {
    this.id = "";
  }

  return gui;

})();


/**
  @class web.gui.slider
    スライダーをコントロールします。
 */

slider = (function(_super) {
  __extends(slider, _super);

  function slider(arg) {
    slider.__super__.constructor.call(this);
    this.val = 0;
    this.name = "slider";
    this.param = {
      max: 100,
      min: 0,
      step: 1,
      range: false
    };
    if (arg) {
      core.obj.marge(this, arg);
    }
  }

  slider.prototype.makeDom = function() {
    return html.dom.slider(this.id + "-slider");
  };

  slider.prototype.initEvent = function(callback) {
    $("#" + this.id + "-slider").slider({
      max: this.param.max,
      min: this.param.min,
      step: this.param.step
    }, !this.param.range ? {
      value: this.val
    } : void 0, this.param.range ? {
      values: this.val
    } : void 0, this.param.range ? {
      range: this.param.range
    } : void 0);
    $("#" + this.id + "-slider").bind('slide', (function(_this) {
      return function(e, ui) {
        _this.val = ui.value;
        if (ui.values) {
          _this.val = ui.values;
        }
        _this.setGuiVal();
        callback.arg.unshift(_this.val);
        callback.arg.unshift(_this.id);
        if (callback) {
          return callback.method.apply(callback, callback.arg);
        }
      };
    })(this));
    return $("#" + this.id + "-slider_input").bind('change', (function(_this) {
      return function(e) {
        _this.val = $(e.currentTarget).val();
        _this.setGuiVal();
        callback.arg.unshift(_this.val);
        callback.arg.unshift(_this.id);
        if (callback) {
          return callback.method.apply(callback, callback.arg);
        }
      };
    })(this));
  };

  slider.prototype.setGuiVal = function() {
    if (this.param.range) {
      if (!Array.isArray(this.val)) {
        this.val = this.val.split(",");
      }
      $("#" + this.id + "-slider").slider({
        values: this.val
      });
    } else {
      $("#" + this.id + "-slider").slider({
        value: this.val
      });
    }
    return $("#" + this.id + "-slider_input").val(this.val);
  };

  return slider;

})(gui);


/**
  @class web.gui.selectBox
    セレクトボックスをコントロールします。
 */

selectBox = (function(_super) {
  __extends(selectBox, _super);

  function selectBox(arg) {
    selectBox.__super__.constructor.call(this);
    this.val = "";
    this.name = "selectBox";
    this.option = [];
    if (arg) {
      core.obj.marge(this, arg);
    }
  }

  selectBox.prototype.makeDom = function() {
    return html.dom.selectBox(this.id + "-selectBox", this.option);
  };

  selectBox.prototype.initEvent = function(callback) {
    return $("#" + this.id + "-selectBox").change((function(_this) {
      return function(e) {
        _this.val = $(e.currentTarget).val();
        _this.setGuiVal();
        callback.arg.unshift(_this.val);
        callback.arg.unshift(_this.id);
        if (callback) {
          return callback.method.apply(callback, callback.arg);
        }
      };
    })(this));
  };

  selectBox.prototype.setGuiVal = function() {
    return $("#" + this.id + "-selectBox").val(this.val);
  };

  return selectBox;

})(gui);


/**
  @class web.gui.colorPicker
    colorPickerをコントロールします。
 */

colorPicker = (function(_super) {
  __extends(colorPicker, _super);

  function colorPicker(arg) {
    this.initEvent = __bind(this.initEvent, this);
    colorPicker.__super__.constructor.call(this);
    this.val = {
      H: 0,
      S: 50,
      L: 50
    };
    this.name = "colorPicker";
    if (arg) {
      core.obj.marge(this, arg);
    }
  }

  colorPicker.prototype.initEvent = function(callback) {
    $('#' + this.id).farbtastic('#' + this.id + "_input");
    $.farbtastic('#' + this.id).setColor(core.calc.hslToRGB(this.val));
    return $("#" + this.id + "_input").bind('change', (function(_this) {
      return function(e) {
        var getHSL;
        getHSL = function() {
          var hslSprit;
          hslSprit = $(e.currentTarget).val().split("_")[0].split(":");
          if (hslSprit[0] === "NaN" || hslSprit[1] === "NaN" || hslSprit[2] === "NaN") {
            return;
          }
          return {
            H: Number(hslSprit[0]),
            S: Number(hslSprit[1]),
            L: Number(hslSprit[2])
          };
        };
        _this.val = getHSL();
        callback.arg.unshift(_this.val);
        callback.arg.unshift(_this.id);
        if (callback) {
          return callback.method.apply(callback, callback.arg);
        }
      };
    })(this));
  };

  colorPicker.prototype.setGuiVal = function() {
    return $.farbtastic('#' + this.id).setColor(core.calc.hslToRGB(this.val));
  };

  return colorPicker;

})(gui);


/**
  @class web.gui.input
    inputをコントロールします。
 */

input = (function(_super) {
  __extends(input, _super);

  function input(arg) {
    input.__super__.constructor.call(this);
    this.val = "";
    this.name = "input";
    this.colorList = {};
    this.event = true;
    if (arg) {
      core.obj.marge(this, arg);
    }
  }

  input.prototype.makeDom = function() {
    return html.dom.input(this.id + "-input", "10");
  };

  input.prototype.initEvent = function(callback) {
    if (this.event) {
      return $("#" + this.id + "-input").bind('change', (function(_this) {
        return function(e) {
          _this.val = $(e.currentTarget).val();
          callback.arg.unshift(_this.val);
          callback.arg.unshift(_this.id);
          if (callback) {
            return callback.method.apply(callback, callback.arg);
          }
        };
      })(this));
    }
  };

  return input;

})(gui);


/**
  @class web.gui.button
    inputをコントロールします。
 */

button = (function(_super) {
  __extends(button, _super);

  function button(arg) {
    button.__super__.constructor.call(this);
    this.val = "";
    this.text = "";
    this.name = "button";
    this.callback = "";
    if (arg) {
      core.obj.marge(this, arg);
    }
  }

  button.prototype.makeDom = function() {
    return html.dom.button(this.id + "-button", this.text);
  };

  button.prototype.initEvent = function() {
    return $("#" + this.id + "-button").click((function(_this) {
      return function(event) {
        return _this.callback(_this);
      };
    })(this));
  };

  return button;

})(gui);

module.exports = {
  gui: gui,
  slider: slider,
  selectBox: selectBox,
  colorPicker: colorPicker,
  input: input,
  button: button
};



},{"./color":26,"core":2,"html":22}],30:[function(require,module,exports){

/**
  @class web.size
    ブラウザ周りのサイズを操作します。
 */

/**
  @method getResponsiveName
  現在のinnnerWidthに対応したレスポンシブ名を取得します。
  @return {String} サイズ名
 */
exports.getResponsiveName = function() {
  var width, widthName;
  widthName = "";
  width = $(window).innerWidth();
  switch (false) {
    case !(width > 1280):
      widthName = "large";
      break;
    case !(width > 768):
      widthName = "middle";
      break;
    case !(width > 480):
      widthName = "small";
      break;
    default:
      widthName = "exSmall";
  }
  return widthName;
};


/**
  @method getResponsiveMaxWidth
  指定したレスポンシブ名の最大width値取得します。
  @param {String} name レスポンシブ名
  @return {Number} innerWidth最大値
 */

exports.getResponsiveMaxWidth = function(name) {
  var width;
  width = 0;
  switch (name) {
    case "large":
      width = 1920;
      break;
    case "middle":
      width = 1280;
      break;
    case "small":
      width = 768;
      break;
    case "exSmall":
      width = 480;
  }
  return width;
};


/**
  @method getResponsiveMinWidth
  指定したレスポンシブ名の最小width値取得します。
  @param {String} name レスポンシブ名
  @return {Number} innerWidth最小値
 */

exports.getResponsiveMinWidth = function(name) {
  var width;
  width = 0;
  switch (name) {
    case "large":
      width = 1281;
      break;
    case "middle":
      width = 769;
      break;
    case "small":
      width = 481;
      break;
    case "exSmall":
      width = 0;
  }
  return width;
};


/**
  @method chooseResponsiveMax
  レスポンシブ名と最大値名を比較し、最大値以下の最小値である値を取得します。
  @param {String} resNameレスポンシブ名
  @param {String} resMax 最大値名
  @return {Number} 選択された最大値以下の最小レスポンシブ名
 */

exports.chooseResponsiveMax = function(resName, resMax) {
  var getVal, maxResVal, nowResVal;
  getVal = function(name) {
    var val;
    val = 0;
    switch (name) {
      case "exSmall":
        val = 0;
        break;
      case "small":
        val = 1;
        break;
      case "middle":
        val = 2;
        break;
      case "large":
        val = 3;
        break;
      case "all":
        val = 4;
    }
    return val;
  };
  nowResVal = getVal(resName);
  maxResVal = getVal(resMax);
  if (nowResVal > maxResVal) {
    return resMax;
  }
  return resName;
};



},{}],31:[function(require,module,exports){

/**
  @class web.url
    url関連の操作を行います。
 */
var core;

core = require("core");


/**
  @method getPageName
  urlからページ名を取得します。
 */

exports.getPageName = function() {
  var name;
  name = location.href.split("/")[location.href.split("/").length - 1].split(".")[0].split("#")[0];
  if (name === "") {
    name = "index";
  }
  return name;
};



},{"core":2}],32:[function(require,module,exports){

module.exports = require('./lib/');

},{"./lib/":33}],33:[function(require,module,exports){

/**
 * Module dependencies.
 */

var url = require('./url');
var parser = require('socket.io-parser');
var Manager = require('./manager');
var debug = require('debug')('socket.io-client');

/**
 * Module exports.
 */

module.exports = exports = lookup;

/**
 * Managers cache.
 */

var cache = exports.managers = {};

/**
 * Looks up an existing `Manager` for multiplexing.
 * If the user summons:
 *
 *   `io('http://localhost/a');`
 *   `io('http://localhost/b');`
 *
 * We reuse the existing instance based on same scheme/port/host,
 * and we initialize sockets for each namespace.
 *
 * @api public
 */

function lookup(uri, opts) {
  if (typeof uri == 'object') {
    opts = uri;
    uri = undefined;
  }

  opts = opts || {};

  var parsed = url(uri);
  var source = parsed.source;
  var id = parsed.id;
  var io;

  if (opts.forceNew || opts['force new connection'] || false === opts.multiplex) {
    debug('ignoring socket cache for %s', source);
    io = Manager(source, opts);
  } else {
    if (!cache[id]) {
      debug('new io instance for %s', source);
      cache[id] = Manager(source, opts);
    }
    io = cache[id];
  }

  return io.socket(parsed.path);
}

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = parser.protocol;

/**
 * `connect`.
 *
 * @param {String} uri
 * @api public
 */

exports.connect = lookup;

/**
 * Expose constructors for standalone build.
 *
 * @api public
 */

exports.Manager = require('./manager');
exports.Socket = require('./socket');

},{"./manager":34,"./socket":36,"./url":37,"debug":40,"socket.io-parser":71}],34:[function(require,module,exports){

/**
 * Module dependencies.
 */

var url = require('./url');
var eio = require('engine.io-client');
var Socket = require('./socket');
var Emitter = require('component-emitter');
var parser = require('socket.io-parser');
var on = require('./on');
var bind = require('component-bind');
var object = require('object-component');
var debug = require('debug')('socket.io-client:manager');

/**
 * Module exports
 */

module.exports = Manager;

/**
 * `Manager` constructor.
 *
 * @param {String} engine instance or engine uri/opts
 * @param {Object} options
 * @api public
 */

function Manager(uri, opts){
  if (!(this instanceof Manager)) return new Manager(uri, opts);
  if (uri && ('object' == typeof uri)) {
    opts = uri;
    uri = undefined;
  }
  opts = opts || {};

  opts.path = opts.path || '/socket.io';
  this.nsps = {};
  this.subs = [];
  this.opts = opts;
  this.reconnection(opts.reconnection !== false);
  this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
  this.reconnectionDelay(opts.reconnectionDelay || 1000);
  this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
  this.timeout(null == opts.timeout ? 20000 : opts.timeout);
  this.readyState = 'closed';
  this.uri = uri;
  this.connected = 0;
  this.attempts = 0;
  this.encoding = false;
  this.packetBuffer = [];
  this.encoder = new parser.Encoder();
  this.decoder = new parser.Decoder();
  this.autoConnect = opts.autoConnect !== false;
  if (this.autoConnect) this.open();
}

/**
 * Propagate given event to sockets and emit on `this`
 *
 * @api private
 */

Manager.prototype.emitAll = function() {
  this.emit.apply(this, arguments);
  for (var nsp in this.nsps) {
    this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
  }
};

/**
 * Mix in `Emitter`.
 */

Emitter(Manager.prototype);

/**
 * Sets the `reconnection` config.
 *
 * @param {Boolean} true/false if it should automatically reconnect
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnection = function(v){
  if (!arguments.length) return this._reconnection;
  this._reconnection = !!v;
  return this;
};

/**
 * Sets the reconnection attempts config.
 *
 * @param {Number} max reconnection attempts before giving up
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionAttempts = function(v){
  if (!arguments.length) return this._reconnectionAttempts;
  this._reconnectionAttempts = v;
  return this;
};

/**
 * Sets the delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelay = function(v){
  if (!arguments.length) return this._reconnectionDelay;
  this._reconnectionDelay = v;
  return this;
};

/**
 * Sets the maximum delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelayMax = function(v){
  if (!arguments.length) return this._reconnectionDelayMax;
  this._reconnectionDelayMax = v;
  return this;
};

/**
 * Sets the connection timeout. `false` to disable
 *
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.timeout = function(v){
  if (!arguments.length) return this._timeout;
  this._timeout = v;
  return this;
};

/**
 * Starts trying to reconnect if reconnection is enabled and we have not
 * started reconnecting yet
 *
 * @api private
 */

Manager.prototype.maybeReconnectOnOpen = function() {
  // Only try to reconnect if it's the first time we're connecting
  if (!this.openReconnect && !this.reconnecting && this._reconnection && this.attempts === 0) {
    // keeps reconnection from firing twice for the same reconnection loop
    this.openReconnect = true;
    this.reconnect();
  }
};


/**
 * Sets the current transport `socket`.
 *
 * @param {Function} optional, callback
 * @return {Manager} self
 * @api public
 */

Manager.prototype.open =
Manager.prototype.connect = function(fn){
  debug('readyState %s', this.readyState);
  if (~this.readyState.indexOf('open')) return this;

  debug('opening %s', this.uri);
  this.engine = eio(this.uri, this.opts);
  var socket = this.engine;
  var self = this;
  this.readyState = 'opening';

  // emit `open`
  var openSub = on(socket, 'open', function() {
    self.onopen();
    fn && fn();
  });

  // emit `connect_error`
  var errorSub = on(socket, 'error', function(data){
    debug('connect_error');
    self.cleanup();
    self.readyState = 'closed';
    self.emitAll('connect_error', data);
    if (fn) {
      var err = new Error('Connection error');
      err.data = data;
      fn(err);
    }

    self.maybeReconnectOnOpen();
  });

  // emit `connect_timeout`
  if (false !== this._timeout) {
    var timeout = this._timeout;
    debug('connect attempt will timeout after %d', timeout);

    // set timer
    var timer = setTimeout(function(){
      debug('connect attempt timed out after %d', timeout);
      openSub.destroy();
      socket.close();
      socket.emit('error', 'timeout');
      self.emitAll('connect_timeout', timeout);
    }, timeout);

    this.subs.push({
      destroy: function(){
        clearTimeout(timer);
      }
    });
  }

  this.subs.push(openSub);
  this.subs.push(errorSub);

  return this;
};

/**
 * Called upon transport open.
 *
 * @api private
 */

Manager.prototype.onopen = function(){
  debug('open');

  // clear old subs
  this.cleanup();

  // mark as open
  this.readyState = 'open';
  this.emit('open');

  // add new subs
  var socket = this.engine;
  this.subs.push(on(socket, 'data', bind(this, 'ondata')));
  this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
  this.subs.push(on(socket, 'error', bind(this, 'onerror')));
  this.subs.push(on(socket, 'close', bind(this, 'onclose')));
};

/**
 * Called with data.
 *
 * @api private
 */

Manager.prototype.ondata = function(data){
  this.decoder.add(data);
};

/**
 * Called when parser fully decodes a packet.
 *
 * @api private
 */

Manager.prototype.ondecoded = function(packet) {
  this.emit('packet', packet);
};

/**
 * Called upon socket error.
 *
 * @api private
 */

Manager.prototype.onerror = function(err){
  debug('error', err);
  this.emitAll('error', err);
};

/**
 * Creates a new socket for the given `nsp`.
 *
 * @return {Socket}
 * @api public
 */

Manager.prototype.socket = function(nsp){
  var socket = this.nsps[nsp];
  if (!socket) {
    socket = new Socket(this, nsp);
    this.nsps[nsp] = socket;
    var self = this;
    socket.on('connect', function(){
      self.connected++;
    });
  }
  return socket;
};

/**
 * Called upon a socket close.
 *
 * @param {Socket} socket
 */

Manager.prototype.destroy = function(socket){
  --this.connected || this.close();
};

/**
 * Writes a packet.
 *
 * @param {Object} packet
 * @api private
 */

Manager.prototype.packet = function(packet){
  debug('writing packet %j', packet);
  var self = this;

  if (!self.encoding) {
    // encode, then write to engine with result
    self.encoding = true;
    this.encoder.encode(packet, function(encodedPackets) {
      for (var i = 0; i < encodedPackets.length; i++) {
        self.engine.write(encodedPackets[i]);
      }
      self.encoding = false;
      self.processPacketQueue();
    });
  } else { // add packet to the queue
    self.packetBuffer.push(packet);
  }
};

/**
 * If packet buffer is non-empty, begins encoding the
 * next packet in line.
 *
 * @api private
 */

Manager.prototype.processPacketQueue = function() {
  if (this.packetBuffer.length > 0 && !this.encoding) {
    var pack = this.packetBuffer.shift();
    this.packet(pack);
  }
};

/**
 * Clean up transport subscriptions and packet buffer.
 *
 * @api private
 */

Manager.prototype.cleanup = function(){
  var sub;
  while (sub = this.subs.shift()) sub.destroy();

  this.packetBuffer = [];
  this.encoding = false;

  this.decoder.destroy();
};

/**
 * Close the current socket.
 *
 * @api private
 */

Manager.prototype.close =
Manager.prototype.disconnect = function(){
  this.skipReconnect = true;
  this.engine.close();
};

/**
 * Called upon engine close.
 *
 * @api private
 */

Manager.prototype.onclose = function(reason){
  debug('close');
  this.cleanup();
  this.readyState = 'closed';
  this.emit('close', reason);
  if (this._reconnection && !this.skipReconnect) {
    this.reconnect();
  }
};

/**
 * Attempt a reconnection.
 *
 * @api private
 */

Manager.prototype.reconnect = function(){
  if (this.reconnecting) return this;

  var self = this;
  this.attempts++;

  if (this.attempts > this._reconnectionAttempts) {
    debug('reconnect failed');
    this.emitAll('reconnect_failed');
    this.reconnecting = false;
  } else {
    var delay = this.attempts * this.reconnectionDelay();
    delay = Math.min(delay, this.reconnectionDelayMax());
    debug('will wait %dms before reconnect attempt', delay);

    this.reconnecting = true;
    var timer = setTimeout(function(){
      debug('attempting reconnect');
      self.emitAll('reconnect_attempt', self.attempts);
      self.emitAll('reconnecting', self.attempts);
      self.open(function(err){
        if (err) {
          debug('reconnect attempt error');
          self.reconnecting = false;
          self.reconnect();
          self.emitAll('reconnect_error', err.data);
        } else {
          debug('reconnect success');
          self.onreconnect();
        }
      });
    }, delay);

    this.subs.push({
      destroy: function(){
        clearTimeout(timer);
      }
    });
  }
};

/**
 * Called upon successful reconnect.
 *
 * @api private
 */

Manager.prototype.onreconnect = function(){
  var attempt = this.attempts;
  this.attempts = 0;
  this.reconnecting = false;
  this.emitAll('reconnect', attempt);
};

},{"./on":35,"./socket":36,"./url":37,"component-bind":38,"component-emitter":39,"debug":40,"engine.io-client":41,"object-component":68,"socket.io-parser":71}],35:[function(require,module,exports){

/**
 * Module exports.
 */

module.exports = on;

/**
 * Helper for subscriptions.
 *
 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
 * @param {String} event name
 * @param {Function} callback
 * @api public
 */

function on(obj, ev, fn) {
  obj.on(ev, fn);
  return {
    destroy: function(){
      obj.removeListener(ev, fn);
    }
  };
}

},{}],36:[function(require,module,exports){

/**
 * Module dependencies.
 */

var parser = require('socket.io-parser');
var Emitter = require('component-emitter');
var toArray = require('to-array');
var on = require('./on');
var bind = require('component-bind');
var debug = require('debug')('socket.io-client:socket');
var hasBin = require('has-binary');
var indexOf = require('indexof');

/**
 * Module exports.
 */

module.exports = exports = Socket;

/**
 * Internal events (blacklisted).
 * These events can't be emitted by the user.
 *
 * @api private
 */

var events = {
  connect: 1,
  connect_error: 1,
  connect_timeout: 1,
  disconnect: 1,
  error: 1,
  reconnect: 1,
  reconnect_attempt: 1,
  reconnect_failed: 1,
  reconnect_error: 1,
  reconnecting: 1
};

/**
 * Shortcut to `Emitter#emit`.
 */

var emit = Emitter.prototype.emit;

/**
 * `Socket` constructor.
 *
 * @api public
 */

function Socket(io, nsp){
  this.io = io;
  this.nsp = nsp;
  this.json = this; // compat
  this.ids = 0;
  this.acks = {};
  if (this.io.autoConnect) this.open();
  this.receiveBuffer = [];
  this.sendBuffer = [];
  this.connected = false;
  this.disconnected = true;
  this.subEvents();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Subscribe to open, close and packet events
 *
 * @api private
 */

Socket.prototype.subEvents = function() {
  var io = this.io;
  this.subs = [
    on(io, 'open', bind(this, 'onopen')),
    on(io, 'packet', bind(this, 'onpacket')),
    on(io, 'close', bind(this, 'onclose'))
  ];
};

/**
 * Called upon engine `open`.
 *
 * @api private
 */

Socket.prototype.open =
Socket.prototype.connect = function(){
  if (this.connected) return this;

  this.io.open(); // ensure open
  if ('open' == this.io.readyState) this.onopen();
  return this;
};

/**
 * Sends a `message` event.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.send = function(){
  var args = toArray(arguments);
  args.unshift('message');
  this.emit.apply(this, args);
  return this;
};

/**
 * Override `emit`.
 * If the event is in `events`, it's emitted normally.
 *
 * @param {String} event name
 * @return {Socket} self
 * @api public
 */

Socket.prototype.emit = function(ev){
  if (events.hasOwnProperty(ev)) {
    emit.apply(this, arguments);
    return this;
  }

  var args = toArray(arguments);
  var parserType = parser.EVENT; // default
  if (hasBin(args)) { parserType = parser.BINARY_EVENT; } // binary
  var packet = { type: parserType, data: args };

  // event ack callback
  if ('function' == typeof args[args.length - 1]) {
    debug('emitting packet with ack id %d', this.ids);
    this.acks[this.ids] = args.pop();
    packet.id = this.ids++;
  }

  if (this.connected) {
    this.packet(packet);
  } else {
    this.sendBuffer.push(packet);
  }

  return this;
};

/**
 * Sends a packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.packet = function(packet){
  packet.nsp = this.nsp;
  this.io.packet(packet);
};

/**
 * "Opens" the socket.
 *
 * @api private
 */

Socket.prototype.onopen = function(){
  debug('transport is open - connecting');

  // write connect packet if necessary
  if ('/' != this.nsp) {
    this.packet({ type: parser.CONNECT });
  }
};

/**
 * Called upon engine `close`.
 *
 * @param {String} reason
 * @api private
 */

Socket.prototype.onclose = function(reason){
  debug('close (%s)', reason);
  this.connected = false;
  this.disconnected = true;
  this.emit('disconnect', reason);
};

/**
 * Called with socket packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onpacket = function(packet){
  if (packet.nsp != this.nsp) return;

  switch (packet.type) {
    case parser.CONNECT:
      this.onconnect();
      break;

    case parser.EVENT:
      this.onevent(packet);
      break;

    case parser.BINARY_EVENT:
      this.onevent(packet);
      break;

    case parser.ACK:
      this.onack(packet);
      break;

    case parser.BINARY_ACK:
      this.onack(packet);
      break;

    case parser.DISCONNECT:
      this.ondisconnect();
      break;

    case parser.ERROR:
      this.emit('error', packet.data);
      break;
  }
};

/**
 * Called upon a server event.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onevent = function(packet){
  var args = packet.data || [];
  debug('emitting event %j', args);

  if (null != packet.id) {
    debug('attaching ack callback to event');
    args.push(this.ack(packet.id));
  }

  if (this.connected) {
    emit.apply(this, args);
  } else {
    this.receiveBuffer.push(args);
  }
};

/**
 * Produces an ack callback to emit with an event.
 *
 * @api private
 */

Socket.prototype.ack = function(id){
  var self = this;
  var sent = false;
  return function(){
    // prevent double callbacks
    if (sent) return;
    sent = true;
    var args = toArray(arguments);
    debug('sending ack %j', args);

    var type = hasBin(args) ? parser.BINARY_ACK : parser.ACK;
    self.packet({
      type: type,
      id: id,
      data: args
    });
  };
};

/**
 * Called upon a server acknowlegement.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onack = function(packet){
  debug('calling ack %s with %j', packet.id, packet.data);
  var fn = this.acks[packet.id];
  fn.apply(this, packet.data);
  delete this.acks[packet.id];
};

/**
 * Called upon server connect.
 *
 * @api private
 */

Socket.prototype.onconnect = function(){
  this.connected = true;
  this.disconnected = false;
  this.emit('connect');
  this.emitBuffered();
};

/**
 * Emit buffered events (received and emitted).
 *
 * @api private
 */

Socket.prototype.emitBuffered = function(){
  var i;
  for (i = 0; i < this.receiveBuffer.length; i++) {
    emit.apply(this, this.receiveBuffer[i]);
  }
  this.receiveBuffer = [];

  for (i = 0; i < this.sendBuffer.length; i++) {
    this.packet(this.sendBuffer[i]);
  }
  this.sendBuffer = [];
};

/**
 * Called upon server disconnect.
 *
 * @api private
 */

Socket.prototype.ondisconnect = function(){
  debug('server disconnect (%s)', this.nsp);
  this.destroy();
  this.onclose('io server disconnect');
};

/**
 * Called upon forced client/server side disconnections,
 * this method ensures the manager stops tracking us and
 * that reconnections don't get triggered for this.
 *
 * @api private.
 */

Socket.prototype.destroy = function(){
  // clean subscriptions to avoid reconnections
  for (var i = 0; i < this.subs.length; i++) {
    this.subs[i].destroy();
  }

  this.io.destroy(this);
};

/**
 * Disconnects the socket manually.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.close =
Socket.prototype.disconnect = function(){
  if (!this.connected) return this;

  debug('performing disconnect (%s)', this.nsp);
  this.packet({ type: parser.DISCONNECT });

  // remove socket from pool
  this.destroy();

  // fire events
  this.onclose('io client disconnect');
  return this;
};

},{"./on":35,"component-bind":38,"component-emitter":39,"debug":40,"has-binary":65,"indexof":67,"socket.io-parser":71,"to-array":75}],37:[function(require,module,exports){
(function (global){

/**
 * Module dependencies.
 */

var parseuri = require('parseuri');
var debug = require('debug')('socket.io-client:url');

/**
 * Module exports.
 */

module.exports = url;

/**
 * URL parser.
 *
 * @param {String} url
 * @param {Object} An object meant to mimic window.location.
 *                 Defaults to window.location.
 * @api public
 */

function url(uri, loc){
  var obj = uri;

  // default to window.location
  var loc = loc || global.location;
  if (null == uri) uri = loc.protocol + '//' + loc.hostname;

  // relative path support
  if ('string' == typeof uri) {
    if ('/' == uri.charAt(0)) {
      if ('undefined' != typeof loc) {
        uri = loc.hostname + uri;
      }
    }

    if (!/^(https?|wss?):\/\//.test(uri)) {
      debug('protocol-less url %s', uri);
      if ('undefined' != typeof loc) {
        uri = loc.protocol + '//' + uri;
      } else {
        uri = 'https://' + uri;
      }
    }

    // parse
    debug('parse %s', uri);
    obj = parseuri(uri);
  }

  // make sure we treat `localhost:80` and `localhost` equally
  if (!obj.port) {
    if (/^(http|ws)$/.test(obj.protocol)) {
      obj.port = '80';
    }
    else if (/^(http|ws)s$/.test(obj.protocol)) {
      obj.port = '443';
    }
  }

  obj.path = obj.path || '/';

  // define unique id
  obj.id = obj.protocol + '://' + obj.host + ':' + obj.port;
  // define href
  obj.href = obj.protocol + '://' + obj.host + (loc && loc.port == obj.port ? '' : (':' + obj.port));

  return obj;
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"debug":40,"parseuri":69}],38:[function(require,module,exports){
/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};

},{}],39:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],40:[function(require,module,exports){

/**
 * Expose `debug()` as the module.
 */

module.exports = debug;

/**
 * Create a debugger with the given `name`.
 *
 * @param {String} name
 * @return {Type}
 * @api public
 */

function debug(name) {
  if (!debug.enabled(name)) return function(){};

  return function(fmt){
    fmt = coerce(fmt);

    var curr = new Date;
    var ms = curr - (debug[name] || curr);
    debug[name] = curr;

    fmt = name
      + ' '
      + fmt
      + ' +' + debug.humanize(ms);

    // This hackery is required for IE8
    // where `console.log` doesn't have 'apply'
    window.console
      && console.log
      && Function.prototype.apply.call(console.log, console, arguments);
  }
}

/**
 * The currently active debug mode names.
 */

debug.names = [];
debug.skips = [];

/**
 * Enables a debug mode by name. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} name
 * @api public
 */

debug.enable = function(name) {
  try {
    localStorage.debug = name;
  } catch(e){}

  var split = (name || '').split(/[\s,]+/)
    , len = split.length;

  for (var i = 0; i < len; i++) {
    name = split[i].replace('*', '.*?');
    if (name[0] === '-') {
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
    }
    else {
      debug.names.push(new RegExp('^' + name + '$'));
    }
  }
};

/**
 * Disable debug output.
 *
 * @api public
 */

debug.disable = function(){
  debug.enable('');
};

/**
 * Humanize the given `ms`.
 *
 * @param {Number} m
 * @return {String}
 * @api private
 */

debug.humanize = function(ms) {
  var sec = 1000
    , min = 60 * 1000
    , hour = 60 * min;

  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
  if (ms >= min) return (ms / min).toFixed(1) + 'm';
  if (ms >= sec) return (ms / sec | 0) + 's';
  return ms + 'ms';
};

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

debug.enabled = function(name) {
  for (var i = 0, len = debug.skips.length; i < len; i++) {
    if (debug.skips[i].test(name)) {
      return false;
    }
  }
  for (var i = 0, len = debug.names.length; i < len; i++) {
    if (debug.names[i].test(name)) {
      return true;
    }
  }
  return false;
};

/**
 * Coerce `val`.
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

// persist

try {
  if (window.localStorage) debug.enable(localStorage.debug);
} catch(e){}

},{}],41:[function(require,module,exports){

module.exports =  require('./lib/');

},{"./lib/":42}],42:[function(require,module,exports){

module.exports = require('./socket');

/**
 * Exports parser
 *
 * @api public
 *
 */
module.exports.parser = require('engine.io-parser');

},{"./socket":43,"engine.io-parser":52}],43:[function(require,module,exports){
(function (global){
/**
 * Module dependencies.
 */

var transports = require('./transports');
var Emitter = require('component-emitter');
var debug = require('debug')('engine.io-client:socket');
var index = require('indexof');
var parser = require('engine.io-parser');
var parseuri = require('parseuri');
var parsejson = require('parsejson');
var parseqs = require('parseqs');

/**
 * Module exports.
 */

module.exports = Socket;

/**
 * Noop function.
 *
 * @api private
 */

function noop(){}

/**
 * Socket constructor.
 *
 * @param {String|Object} uri or options
 * @param {Object} options
 * @api public
 */

function Socket(uri, opts){
  if (!(this instanceof Socket)) return new Socket(uri, opts);

  opts = opts || {};

  if (uri && 'object' == typeof uri) {
    opts = uri;
    uri = null;
  }

  if (uri) {
    uri = parseuri(uri);
    opts.host = uri.host;
    opts.secure = uri.protocol == 'https' || uri.protocol == 'wss';
    opts.port = uri.port;
    if (uri.query) opts.query = uri.query;
  }

  this.secure = null != opts.secure ? opts.secure :
    (global.location && 'https:' == location.protocol);

  if (opts.host) {
    var pieces = opts.host.split(':');
    opts.hostname = pieces.shift();
    if (pieces.length) opts.port = pieces.pop();
  }

  this.agent = opts.agent || false;
  this.hostname = opts.hostname ||
    (global.location ? location.hostname : 'localhost');
  this.port = opts.port || (global.location && location.port ?
       location.port :
       (this.secure ? 443 : 80));
  this.query = opts.query || {};
  if ('string' == typeof this.query) this.query = parseqs.decode(this.query);
  this.upgrade = false !== opts.upgrade;
  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
  this.forceJSONP = !!opts.forceJSONP;
  this.jsonp = false !== opts.jsonp;
  this.forceBase64 = !!opts.forceBase64;
  this.enablesXDR = !!opts.enablesXDR;
  this.timestampParam = opts.timestampParam || 't';
  this.timestampRequests = opts.timestampRequests;
  this.transports = opts.transports || ['polling', 'websocket'];
  this.readyState = '';
  this.writeBuffer = [];
  this.callbackBuffer = [];
  this.policyPort = opts.policyPort || 843;
  this.rememberUpgrade = opts.rememberUpgrade || false;
  this.open();
  this.binaryType = null;
  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
}

Socket.priorWebsocketSuccess = false;

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Protocol version.
 *
 * @api public
 */

Socket.protocol = parser.protocol; // this is an int

/**
 * Expose deps for legacy compatibility
 * and standalone browser access.
 */

Socket.Socket = Socket;
Socket.Transport = require('./transport');
Socket.transports = require('./transports');
Socket.parser = require('engine.io-parser');

/**
 * Creates transport of the given type.
 *
 * @param {String} transport name
 * @return {Transport}
 * @api private
 */

Socket.prototype.createTransport = function (name) {
  debug('creating transport "%s"', name);
  var query = clone(this.query);

  // append engine.io protocol identifier
  query.EIO = parser.protocol;

  // transport name
  query.transport = name;

  // session id if we already have one
  if (this.id) query.sid = this.id;

  var transport = new transports[name]({
    agent: this.agent,
    hostname: this.hostname,
    port: this.port,
    secure: this.secure,
    path: this.path,
    query: query,
    forceJSONP: this.forceJSONP,
    jsonp: this.jsonp,
    forceBase64: this.forceBase64,
    enablesXDR: this.enablesXDR,
    timestampRequests: this.timestampRequests,
    timestampParam: this.timestampParam,
    policyPort: this.policyPort,
    socket: this
  });

  return transport;
};

function clone (obj) {
  var o = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = obj[i];
    }
  }
  return o;
}

/**
 * Initializes transport to use and starts probe.
 *
 * @api private
 */
Socket.prototype.open = function () {
  var transport;
  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') != -1) {
    transport = 'websocket';
  } else if (0 == this.transports.length) {
    // Emit error on next tick so it can be listened to
    var self = this;
    setTimeout(function() {
      self.emit('error', 'No transports available');
    }, 0);
    return;
  } else {
    transport = this.transports[0];
  }
  this.readyState = 'opening';

  // Retry with the next transport if the transport is disabled (jsonp: false)
  var transport;
  try {
    transport = this.createTransport(transport);
  } catch (e) {
    this.transports.shift();
    this.open();
    return;
  }

  transport.open();
  this.setTransport(transport);
};

/**
 * Sets the current transport. Disables the existing one (if any).
 *
 * @api private
 */

Socket.prototype.setTransport = function(transport){
  debug('setting transport %s', transport.name);
  var self = this;

  if (this.transport) {
    debug('clearing existing transport %s', this.transport.name);
    this.transport.removeAllListeners();
  }

  // set up transport
  this.transport = transport;

  // set up transport listeners
  transport
  .on('drain', function(){
    self.onDrain();
  })
  .on('packet', function(packet){
    self.onPacket(packet);
  })
  .on('error', function(e){
    self.onError(e);
  })
  .on('close', function(){
    self.onClose('transport close');
  });
};

/**
 * Probes a transport.
 *
 * @param {String} transport name
 * @api private
 */

Socket.prototype.probe = function (name) {
  debug('probing transport "%s"', name);
  var transport = this.createTransport(name, { probe: 1 })
    , failed = false
    , self = this;

  Socket.priorWebsocketSuccess = false;

  function onTransportOpen(){
    if (self.onlyBinaryUpgrades) {
      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
      failed = failed || upgradeLosesBinary;
    }
    if (failed) return;

    debug('probe transport "%s" opened', name);
    transport.send([{ type: 'ping', data: 'probe' }]);
    transport.once('packet', function (msg) {
      if (failed) return;
      if ('pong' == msg.type && 'probe' == msg.data) {
        debug('probe transport "%s" pong', name);
        self.upgrading = true;
        self.emit('upgrading', transport);
        Socket.priorWebsocketSuccess = 'websocket' == transport.name;

        debug('pausing current transport "%s"', self.transport.name);
        self.transport.pause(function () {
          if (failed) return;
          if ('closed' == self.readyState || 'closing' == self.readyState) {
            return;
          }
          debug('changing transport and sending upgrade packet');

          cleanup();

          self.setTransport(transport);
          transport.send([{ type: 'upgrade' }]);
          self.emit('upgrade', transport);
          transport = null;
          self.upgrading = false;
          self.flush();
        });
      } else {
        debug('probe transport "%s" failed', name);
        var err = new Error('probe error');
        err.transport = transport.name;
        self.emit('upgradeError', err);
      }
    });
  }

  function freezeTransport() {
    if (failed) return;

    // Any callback called by transport should be ignored since now
    failed = true;

    cleanup();

    transport.close();
    transport = null;
  }

  //Handle any error that happens while probing
  function onerror(err) {
    var error = new Error('probe error: ' + err);
    error.transport = transport.name;

    freezeTransport();

    debug('probe transport "%s" failed because of error: %s', name, err);

    self.emit('upgradeError', error);
  }

  function onTransportClose(){
    onerror("transport closed");
  }

  //When the socket is closed while we're probing
  function onclose(){
    onerror("socket closed");
  }

  //When the socket is upgraded while we're probing
  function onupgrade(to){
    if (transport && to.name != transport.name) {
      debug('"%s" works - aborting "%s"', to.name, transport.name);
      freezeTransport();
    }
  }

  //Remove all listeners on the transport and on self
  function cleanup(){
    transport.removeListener('open', onTransportOpen);
    transport.removeListener('error', onerror);
    transport.removeListener('close', onTransportClose);
    self.removeListener('close', onclose);
    self.removeListener('upgrading', onupgrade);
  }

  transport.once('open', onTransportOpen);
  transport.once('error', onerror);
  transport.once('close', onTransportClose);

  this.once('close', onclose);
  this.once('upgrading', onupgrade);

  transport.open();

};

/**
 * Called when connection is deemed open.
 *
 * @api public
 */

Socket.prototype.onOpen = function () {
  debug('socket open');
  this.readyState = 'open';
  Socket.priorWebsocketSuccess = 'websocket' == this.transport.name;
  this.emit('open');
  this.flush();

  // we check for `readyState` in case an `open`
  // listener already closed the socket
  if ('open' == this.readyState && this.upgrade && this.transport.pause) {
    debug('starting upgrade probes');
    for (var i = 0, l = this.upgrades.length; i < l; i++) {
      this.probe(this.upgrades[i]);
    }
  }
};

/**
 * Handles a packet.
 *
 * @api private
 */

Socket.prototype.onPacket = function (packet) {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

    this.emit('packet', packet);

    // Socket is live - any packet counts
    this.emit('heartbeat');

    switch (packet.type) {
      case 'open':
        this.onHandshake(parsejson(packet.data));
        break;

      case 'pong':
        this.setPing();
        break;

      case 'error':
        var err = new Error('server error');
        err.code = packet.data;
        this.emit('error', err);
        break;

      case 'message':
        this.emit('data', packet.data);
        this.emit('message', packet.data);
        break;
    }
  } else {
    debug('packet received with socket readyState "%s"', this.readyState);
  }
};

/**
 * Called upon handshake completion.
 *
 * @param {Object} handshake obj
 * @api private
 */

Socket.prototype.onHandshake = function (data) {
  this.emit('handshake', data);
  this.id = data.sid;
  this.transport.query.sid = data.sid;
  this.upgrades = this.filterUpgrades(data.upgrades);
  this.pingInterval = data.pingInterval;
  this.pingTimeout = data.pingTimeout;
  this.onOpen();
  // In case open handler closes socket
  if  ('closed' == this.readyState) return;
  this.setPing();

  // Prolong liveness of socket on heartbeat
  this.removeListener('heartbeat', this.onHeartbeat);
  this.on('heartbeat', this.onHeartbeat);
};

/**
 * Resets ping timeout.
 *
 * @api private
 */

Socket.prototype.onHeartbeat = function (timeout) {
  clearTimeout(this.pingTimeoutTimer);
  var self = this;
  self.pingTimeoutTimer = setTimeout(function () {
    if ('closed' == self.readyState) return;
    self.onClose('ping timeout');
  }, timeout || (self.pingInterval + self.pingTimeout));
};

/**
 * Pings server every `this.pingInterval` and expects response
 * within `this.pingTimeout` or closes connection.
 *
 * @api private
 */

Socket.prototype.setPing = function () {
  var self = this;
  clearTimeout(self.pingIntervalTimer);
  self.pingIntervalTimer = setTimeout(function () {
    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
    self.ping();
    self.onHeartbeat(self.pingTimeout);
  }, self.pingInterval);
};

/**
* Sends a ping packet.
*
* @api public
*/

Socket.prototype.ping = function () {
  this.sendPacket('ping');
};

/**
 * Called on `drain` event
 *
 * @api private
 */

Socket.prototype.onDrain = function() {
  for (var i = 0; i < this.prevBufferLen; i++) {
    if (this.callbackBuffer[i]) {
      this.callbackBuffer[i]();
    }
  }

  this.writeBuffer.splice(0, this.prevBufferLen);
  this.callbackBuffer.splice(0, this.prevBufferLen);

  // setting prevBufferLen = 0 is very important
  // for example, when upgrading, upgrade packet is sent over,
  // and a nonzero prevBufferLen could cause problems on `drain`
  this.prevBufferLen = 0;

  if (this.writeBuffer.length == 0) {
    this.emit('drain');
  } else {
    this.flush();
  }
};

/**
 * Flush write buffers.
 *
 * @api private
 */

Socket.prototype.flush = function () {
  if ('closed' != this.readyState && this.transport.writable &&
    !this.upgrading && this.writeBuffer.length) {
    debug('flushing %d packets in socket', this.writeBuffer.length);
    this.transport.send(this.writeBuffer);
    // keep track of current length of writeBuffer
    // splice writeBuffer and callbackBuffer on `drain`
    this.prevBufferLen = this.writeBuffer.length;
    this.emit('flush');
  }
};

/**
 * Sends a message.
 *
 * @param {String} message.
 * @param {Function} callback function.
 * @return {Socket} for chaining.
 * @api public
 */

Socket.prototype.write =
Socket.prototype.send = function (msg, fn) {
  this.sendPacket('message', msg, fn);
  return this;
};

/**
 * Sends a packet.
 *
 * @param {String} packet type.
 * @param {String} data.
 * @param {Function} callback function.
 * @api private
 */

Socket.prototype.sendPacket = function (type, data, fn) {
  var packet = { type: type, data: data };
  this.emit('packetCreate', packet);
  this.writeBuffer.push(packet);
  this.callbackBuffer.push(fn);
  this.flush();
};

/**
 * Closes the connection.
 *
 * @api private
 */

Socket.prototype.close = function () {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    this.onClose('forced close');
    debug('socket closing - telling transport to close');
    this.transport.close();
  }

  return this;
};

/**
 * Called upon transport error
 *
 * @api private
 */

Socket.prototype.onError = function (err) {
  debug('socket error %j', err);
  Socket.priorWebsocketSuccess = false;
  this.emit('error', err);
  this.onClose('transport error', err);
};

/**
 * Called upon transport close.
 *
 * @api private
 */

Socket.prototype.onClose = function (reason, desc) {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    debug('socket close with reason: "%s"', reason);
    var self = this;

    // clear timers
    clearTimeout(this.pingIntervalTimer);
    clearTimeout(this.pingTimeoutTimer);

    // clean buffers in next tick, so developers can still
    // grab the buffers on `close` event
    setTimeout(function() {
      self.writeBuffer = [];
      self.callbackBuffer = [];
      self.prevBufferLen = 0;
    }, 0);

    // stop event from firing again for transport
    this.transport.removeAllListeners('close');

    // ensure transport won't stay open
    this.transport.close();

    // ignore further transport communication
    this.transport.removeAllListeners();

    // set ready state
    this.readyState = 'closed';

    // clear session id
    this.id = null;

    // emit close event
    this.emit('close', reason, desc);
  }
};

/**
 * Filters upgrades, returning only those matching client transports.
 *
 * @param {Array} server upgrades
 * @api private
 *
 */

Socket.prototype.filterUpgrades = function (upgrades) {
  var filteredUpgrades = [];
  for (var i = 0, j = upgrades.length; i<j; i++) {
    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
  }
  return filteredUpgrades;
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./transport":44,"./transports":45,"component-emitter":39,"debug":40,"engine.io-parser":52,"indexof":67,"parsejson":61,"parseqs":62,"parseuri":63}],44:[function(require,module,exports){
/**
 * Module dependencies.
 */

var parser = require('engine.io-parser');
var Emitter = require('component-emitter');

/**
 * Module exports.
 */

module.exports = Transport;

/**
 * Transport abstract constructor.
 *
 * @param {Object} options.
 * @api private
 */

function Transport (opts) {
  this.path = opts.path;
  this.hostname = opts.hostname;
  this.port = opts.port;
  this.secure = opts.secure;
  this.query = opts.query;
  this.timestampParam = opts.timestampParam;
  this.timestampRequests = opts.timestampRequests;
  this.readyState = '';
  this.agent = opts.agent || false;
  this.socket = opts.socket;
  this.enablesXDR = opts.enablesXDR;
}

/**
 * Mix in `Emitter`.
 */

Emitter(Transport.prototype);

/**
 * A counter used to prevent collisions in the timestamps used
 * for cache busting.
 */

Transport.timestamps = 0;

/**
 * Emits an error.
 *
 * @param {String} str
 * @return {Transport} for chaining
 * @api public
 */

Transport.prototype.onError = function (msg, desc) {
  var err = new Error(msg);
  err.type = 'TransportError';
  err.description = desc;
  this.emit('error', err);
  return this;
};

/**
 * Opens the transport.
 *
 * @api public
 */

Transport.prototype.open = function () {
  if ('closed' == this.readyState || '' == this.readyState) {
    this.readyState = 'opening';
    this.doOpen();
  }

  return this;
};

/**
 * Closes the transport.
 *
 * @api private
 */

Transport.prototype.close = function () {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    this.doClose();
    this.onClose();
  }

  return this;
};

/**
 * Sends multiple packets.
 *
 * @param {Array} packets
 * @api private
 */

Transport.prototype.send = function(packets){
  if ('open' == this.readyState) {
    this.write(packets);
  } else {
    throw new Error('Transport not open');
  }
};

/**
 * Called upon open
 *
 * @api private
 */

Transport.prototype.onOpen = function () {
  this.readyState = 'open';
  this.writable = true;
  this.emit('open');
};

/**
 * Called with data.
 *
 * @param {String} data
 * @api private
 */

Transport.prototype.onData = function(data){
  var packet = parser.decodePacket(data, this.socket.binaryType);
  this.onPacket(packet);
};

/**
 * Called with a decoded packet.
 */

Transport.prototype.onPacket = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon close.
 *
 * @api private
 */

Transport.prototype.onClose = function () {
  this.readyState = 'closed';
  this.emit('close');
};

},{"component-emitter":39,"engine.io-parser":52}],45:[function(require,module,exports){
(function (global){
/**
 * Module dependencies
 */

var XMLHttpRequest = require('xmlhttprequest');
var XHR = require('./polling-xhr');
var JSONP = require('./polling-jsonp');
var websocket = require('./websocket');

/**
 * Export transports.
 */

exports.polling = polling;
exports.websocket = websocket;

/**
 * Polling transport polymorphic constructor.
 * Decides on xhr vs jsonp based on feature detection.
 *
 * @api private
 */

function polling(opts){
  var xhr;
  var xd = false;
  var xs = false;
  var jsonp = false !== opts.jsonp;

  if (global.location) {
    var isSSL = 'https:' == location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    xd = opts.hostname != location.hostname || port != opts.port;
    xs = opts.secure != isSSL;
  }

  opts.xdomain = xd;
  opts.xscheme = xs;
  xhr = new XMLHttpRequest(opts);

  if ('open' in xhr && !opts.forceJSONP) {
    return new XHR(opts);
  } else {
    if (!jsonp) throw new Error('JSONP disabled');
    return new JSONP(opts);
  }
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./polling-jsonp":46,"./polling-xhr":47,"./websocket":49,"xmlhttprequest":50}],46:[function(require,module,exports){
(function (global){

/**
 * Module requirements.
 */

var Polling = require('./polling');
var inherit = require('component-inherit');

/**
 * Module exports.
 */

module.exports = JSONPPolling;

/**
 * Cached regular expressions.
 */

var rNewline = /\n/g;
var rEscapedNewline = /\\n/g;

/**
 * Global JSONP callbacks.
 */

var callbacks;

/**
 * Callbacks count.
 */

var index = 0;

/**
 * Noop.
 */

function empty () { }

/**
 * JSONP Polling constructor.
 *
 * @param {Object} opts.
 * @api public
 */

function JSONPPolling (opts) {
  Polling.call(this, opts);

  this.query = this.query || {};

  // define global callbacks array if not present
  // we do this here (lazily) to avoid unneeded global pollution
  if (!callbacks) {
    // we need to consider multiple engines in the same page
    if (!global.___eio) global.___eio = [];
    callbacks = global.___eio;
  }

  // callback identifier
  this.index = callbacks.length;

  // add callback to jsonp global
  var self = this;
  callbacks.push(function (msg) {
    self.onData(msg);
  });

  // append to query string
  this.query.j = this.index;

  // prevent spurious errors from being emitted when the window is unloaded
  if (global.document && global.addEventListener) {
    global.addEventListener('beforeunload', function () {
      if (self.script) self.script.onerror = empty;
    });
  }
}

/**
 * Inherits from Polling.
 */

inherit(JSONPPolling, Polling);

/*
 * JSONP only supports binary as base64 encoded strings
 */

JSONPPolling.prototype.supportsBinary = false;

/**
 * Closes the socket.
 *
 * @api private
 */

JSONPPolling.prototype.doClose = function () {
  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  if (this.form) {
    this.form.parentNode.removeChild(this.form);
    this.form = null;
  }

  Polling.prototype.doClose.call(this);
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

JSONPPolling.prototype.doPoll = function () {
  var self = this;
  var script = document.createElement('script');

  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  script.async = true;
  script.src = this.uri();
  script.onerror = function(e){
    self.onError('jsonp poll error',e);
  };

  var insertAt = document.getElementsByTagName('script')[0];
  insertAt.parentNode.insertBefore(script, insertAt);
  this.script = script;

  var isUAgecko = 'undefined' != typeof navigator && /gecko/i.test(navigator.userAgent);
  
  if (isUAgecko) {
    setTimeout(function () {
      var iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      document.body.removeChild(iframe);
    }, 100);
  }
};

/**
 * Writes with a hidden iframe.
 *
 * @param {String} data to send
 * @param {Function} called upon flush.
 * @api private
 */

JSONPPolling.prototype.doWrite = function (data, fn) {
  var self = this;

  if (!this.form) {
    var form = document.createElement('form');
    var area = document.createElement('textarea');
    var id = this.iframeId = 'eio_iframe_' + this.index;
    var iframe;

    form.className = 'socketio';
    form.style.position = 'absolute';
    form.style.top = '-1000px';
    form.style.left = '-1000px';
    form.target = id;
    form.method = 'POST';
    form.setAttribute('accept-charset', 'utf-8');
    area.name = 'd';
    form.appendChild(area);
    document.body.appendChild(form);

    this.form = form;
    this.area = area;
  }

  this.form.action = this.uri();

  function complete () {
    initIframe();
    fn();
  }

  function initIframe () {
    if (self.iframe) {
      try {
        self.form.removeChild(self.iframe);
      } catch (e) {
        self.onError('jsonp polling iframe removal error', e);
      }
    }

    try {
      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
      var html = '<iframe src="javascript:0" name="'+ self.iframeId +'">';
      iframe = document.createElement(html);
    } catch (e) {
      iframe = document.createElement('iframe');
      iframe.name = self.iframeId;
      iframe.src = 'javascript:0';
    }

    iframe.id = self.iframeId;

    self.form.appendChild(iframe);
    self.iframe = iframe;
  }

  initIframe();

  // escape \n to prevent it from being converted into \r\n by some UAs
  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
  data = data.replace(rEscapedNewline, '\\\n');
  this.area.value = data.replace(rNewline, '\\n');

  try {
    this.form.submit();
  } catch(e) {}

  if (this.iframe.attachEvent) {
    this.iframe.onreadystatechange = function(){
      if (self.iframe.readyState == 'complete') {
        complete();
      }
    };
  } else {
    this.iframe.onload = complete;
  }
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./polling":48,"component-inherit":51}],47:[function(require,module,exports){
(function (global){
/**
 * Module requirements.
 */

var XMLHttpRequest = require('xmlhttprequest');
var Polling = require('./polling');
var Emitter = require('component-emitter');
var inherit = require('component-inherit');
var debug = require('debug')('engine.io-client:polling-xhr');

/**
 * Module exports.
 */

module.exports = XHR;
module.exports.Request = Request;

/**
 * Empty function
 */

function empty(){}

/**
 * XHR Polling constructor.
 *
 * @param {Object} opts
 * @api public
 */

function XHR(opts){
  Polling.call(this, opts);

  if (global.location) {
    var isSSL = 'https:' == location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    this.xd = opts.hostname != global.location.hostname ||
      port != opts.port;
    this.xs = opts.secure != isSSL;
  }
}

/**
 * Inherits from Polling.
 */

inherit(XHR, Polling);

/**
 * XHR supports binary
 */

XHR.prototype.supportsBinary = true;

/**
 * Creates a request.
 *
 * @param {String} method
 * @api private
 */

XHR.prototype.request = function(opts){
  opts = opts || {};
  opts.uri = this.uri();
  opts.xd = this.xd;
  opts.xs = this.xs;
  opts.agent = this.agent || false;
  opts.supportsBinary = this.supportsBinary;
  opts.enablesXDR = this.enablesXDR;
  return new Request(opts);
};

/**
 * Sends data.
 *
 * @param {String} data to send.
 * @param {Function} called upon flush.
 * @api private
 */

XHR.prototype.doWrite = function(data, fn){
  var isBinary = typeof data !== 'string' && data !== undefined;
  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
  var self = this;
  req.on('success', fn);
  req.on('error', function(err){
    self.onError('xhr post error', err);
  });
  this.sendXhr = req;
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

XHR.prototype.doPoll = function(){
  debug('xhr poll');
  var req = this.request();
  var self = this;
  req.on('data', function(data){
    self.onData(data);
  });
  req.on('error', function(err){
    self.onError('xhr poll error', err);
  });
  this.pollXhr = req;
};

/**
 * Request constructor
 *
 * @param {Object} options
 * @api public
 */

function Request(opts){
  this.method = opts.method || 'GET';
  this.uri = opts.uri;
  this.xd = !!opts.xd;
  this.xs = !!opts.xs;
  this.async = false !== opts.async;
  this.data = undefined != opts.data ? opts.data : null;
  this.agent = opts.agent;
  this.isBinary = opts.isBinary;
  this.supportsBinary = opts.supportsBinary;
  this.enablesXDR = opts.enablesXDR;
  this.create();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Creates the XHR object and sends the request.
 *
 * @api private
 */

Request.prototype.create = function(){
  var xhr = this.xhr = new XMLHttpRequest({ agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR });
  var self = this;

  try {
    debug('xhr open %s: %s', this.method, this.uri);
    xhr.open(this.method, this.uri, this.async);
    if (this.supportsBinary) {
      // This has to be done after open because Firefox is stupid
      // http://stackoverflow.com/questions/13216903/get-binary-data-with-xmlhttprequest-in-a-firefox-extension
      xhr.responseType = 'arraybuffer';
    }

    if ('POST' == this.method) {
      try {
        if (this.isBinary) {
          xhr.setRequestHeader('Content-type', 'application/octet-stream');
        } else {
          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
        }
      } catch (e) {}
    }

    // ie6 check
    if ('withCredentials' in xhr) {
      xhr.withCredentials = true;
    }

    if (this.hasXDR()) {
      xhr.onload = function(){
        self.onLoad();
      };
      xhr.onerror = function(){
        self.onError(xhr.responseText);
      };
    } else {
      xhr.onreadystatechange = function(){
        if (4 != xhr.readyState) return;
        if (200 == xhr.status || 1223 == xhr.status) {
          self.onLoad();
        } else {
          // make sure the `error` event handler that's user-set
          // does not throw in the same tick and gets caught here
          setTimeout(function(){
            self.onError(xhr.status);
          }, 0);
        }
      };
    }

    debug('xhr data %s', this.data);
    xhr.send(this.data);
  } catch (e) {
    // Need to defer since .create() is called directly fhrom the constructor
    // and thus the 'error' event can only be only bound *after* this exception
    // occurs.  Therefore, also, we cannot throw here at all.
    setTimeout(function() {
      self.onError(e);
    }, 0);
    return;
  }

  if (global.document) {
    this.index = Request.requestsCount++;
    Request.requests[this.index] = this;
  }
};

/**
 * Called upon successful response.
 *
 * @api private
 */

Request.prototype.onSuccess = function(){
  this.emit('success');
  this.cleanup();
};

/**
 * Called if we have data.
 *
 * @api private
 */

Request.prototype.onData = function(data){
  this.emit('data', data);
  this.onSuccess();
};

/**
 * Called upon error.
 *
 * @api private
 */

Request.prototype.onError = function(err){
  this.emit('error', err);
  this.cleanup();
};

/**
 * Cleans up house.
 *
 * @api private
 */

Request.prototype.cleanup = function(){
  if ('undefined' == typeof this.xhr || null === this.xhr) {
    return;
  }
  // xmlhttprequest
  if (this.hasXDR()) {
    this.xhr.onload = this.xhr.onerror = empty;
  } else {
    this.xhr.onreadystatechange = empty;
  }

  try {
    this.xhr.abort();
  } catch(e) {}

  if (global.document) {
    delete Request.requests[this.index];
  }

  this.xhr = null;
};

/**
 * Called upon load.
 *
 * @api private
 */

Request.prototype.onLoad = function(){
  var data;
  try {
    var contentType;
    try {
      contentType = this.xhr.getResponseHeader('Content-Type');
    } catch (e) {}
    if (contentType === 'application/octet-stream') {
      data = this.xhr.response;
    } else {
      if (!this.supportsBinary) {
        data = this.xhr.responseText;
      } else {
        data = 'ok';
      }
    }
  } catch (e) {
    this.onError(e);
  }
  if (null != data) {
    this.onData(data);
  }
};

/**
 * Check if it has XDomainRequest.
 *
 * @api private
 */

Request.prototype.hasXDR = function(){
  return 'undefined' !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;
};

/**
 * Aborts the request.
 *
 * @api public
 */

Request.prototype.abort = function(){
  this.cleanup();
};

/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */

if (global.document) {
  Request.requestsCount = 0;
  Request.requests = {};
  if (global.attachEvent) {
    global.attachEvent('onunload', unloadHandler);
  } else if (global.addEventListener) {
    global.addEventListener('beforeunload', unloadHandler);
  }
}

function unloadHandler() {
  for (var i in Request.requests) {
    if (Request.requests.hasOwnProperty(i)) {
      Request.requests[i].abort();
    }
  }
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./polling":48,"component-emitter":39,"component-inherit":51,"debug":40,"xmlhttprequest":50}],48:[function(require,module,exports){
/**
 * Module dependencies.
 */

var Transport = require('../transport');
var parseqs = require('parseqs');
var parser = require('engine.io-parser');
var inherit = require('component-inherit');
var debug = require('debug')('engine.io-client:polling');

/**
 * Module exports.
 */

module.exports = Polling;

/**
 * Is XHR2 supported?
 */

var hasXHR2 = (function() {
  var XMLHttpRequest = require('xmlhttprequest');
  var xhr = new XMLHttpRequest({ agent: this.agent, xdomain: false });
  return null != xhr.responseType;
})();

/**
 * Polling interface.
 *
 * @param {Object} opts
 * @api private
 */

function Polling(opts){
  var forceBase64 = (opts && opts.forceBase64);
  if (!hasXHR2 || forceBase64) {
    this.supportsBinary = false;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(Polling, Transport);

/**
 * Transport name.
 */

Polling.prototype.name = 'polling';

/**
 * Opens the socket (triggers polling). We write a PING message to determine
 * when the transport is open.
 *
 * @api private
 */

Polling.prototype.doOpen = function(){
  this.poll();
};

/**
 * Pauses polling.
 *
 * @param {Function} callback upon buffers are flushed and transport is paused
 * @api private
 */

Polling.prototype.pause = function(onPause){
  var pending = 0;
  var self = this;

  this.readyState = 'pausing';

  function pause(){
    debug('paused');
    self.readyState = 'paused';
    onPause();
  }

  if (this.polling || !this.writable) {
    var total = 0;

    if (this.polling) {
      debug('we are currently polling - waiting to pause');
      total++;
      this.once('pollComplete', function(){
        debug('pre-pause polling complete');
        --total || pause();
      });
    }

    if (!this.writable) {
      debug('we are currently writing - waiting to pause');
      total++;
      this.once('drain', function(){
        debug('pre-pause writing complete');
        --total || pause();
      });
    }
  } else {
    pause();
  }
};

/**
 * Starts polling cycle.
 *
 * @api public
 */

Polling.prototype.poll = function(){
  debug('polling');
  this.polling = true;
  this.doPoll();
  this.emit('poll');
};

/**
 * Overloads onData to detect payloads.
 *
 * @api private
 */

Polling.prototype.onData = function(data){
  var self = this;
  debug('polling got data %s', data);
  var callback = function(packet, index, total) {
    // if its the first message we consider the transport open
    if ('opening' == self.readyState) {
      self.onOpen();
    }

    // if its a close packet, we close the ongoing requests
    if ('close' == packet.type) {
      self.onClose();
      return false;
    }

    // otherwise bypass onData and handle the message
    self.onPacket(packet);
  };

  // decode payload
  parser.decodePayload(data, this.socket.binaryType, callback);

  // if an event did not trigger closing
  if ('closed' != this.readyState) {
    // if we got data we're not polling
    this.polling = false;
    this.emit('pollComplete');

    if ('open' == this.readyState) {
      this.poll();
    } else {
      debug('ignoring poll - transport state "%s"', this.readyState);
    }
  }
};

/**
 * For polling, send a close packet.
 *
 * @api private
 */

Polling.prototype.doClose = function(){
  var self = this;

  function close(){
    debug('writing close packet');
    self.write([{ type: 'close' }]);
  }

  if ('open' == this.readyState) {
    debug('transport open - closing');
    close();
  } else {
    // in case we're trying to close while
    // handshaking is in progress (GH-164)
    debug('transport not open - deferring close');
    this.once('open', close);
  }
};

/**
 * Writes a packets payload.
 *
 * @param {Array} data packets
 * @param {Function} drain callback
 * @api private
 */

Polling.prototype.write = function(packets){
  var self = this;
  this.writable = false;
  var callbackfn = function() {
    self.writable = true;
    self.emit('drain');
  };

  var self = this;
  parser.encodePayload(packets, this.supportsBinary, function(data) {
    self.doWrite(data, callbackfn);
  });
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

Polling.prototype.uri = function(){
  var query = this.query || {};
  var schema = this.secure ? 'https' : 'http';
  var port = '';

  // cache busting is forced
  if (false !== this.timestampRequests) {
    query[this.timestampParam] = +new Date + '-' + Transport.timestamps++;
  }

  if (!this.supportsBinary && !query.sid) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // avoid port if default for schema
  if (this.port && (('https' == schema && this.port != 443) ||
     ('http' == schema && this.port != 80))) {
    port = ':' + this.port;
  }

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  return schema + '://' + this.hostname + port + this.path + query;
};

},{"../transport":44,"component-inherit":51,"debug":40,"engine.io-parser":52,"parseqs":62,"xmlhttprequest":50}],49:[function(require,module,exports){
/**
 * Module dependencies.
 */

var Transport = require('../transport');
var parser = require('engine.io-parser');
var parseqs = require('parseqs');
var inherit = require('component-inherit');
var debug = require('debug')('engine.io-client:websocket');

/**
 * `ws` exposes a WebSocket-compatible interface in
 * Node, or the `WebSocket` or `MozWebSocket` globals
 * in the browser.
 */

var WebSocket = require('ws');

/**
 * Module exports.
 */

module.exports = WS;

/**
 * WebSocket transport constructor.
 *
 * @api {Object} connection options
 * @api public
 */

function WS(opts){
  var forceBase64 = (opts && opts.forceBase64);
  if (forceBase64) {
    this.supportsBinary = false;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(WS, Transport);

/**
 * Transport name.
 *
 * @api public
 */

WS.prototype.name = 'websocket';

/*
 * WebSockets support binary
 */

WS.prototype.supportsBinary = true;

/**
 * Opens socket.
 *
 * @api private
 */

WS.prototype.doOpen = function(){
  if (!this.check()) {
    // let probe timeout
    return;
  }

  var self = this;
  var uri = this.uri();
  var protocols = void(0);
  var opts = { agent: this.agent };

  this.ws = new WebSocket(uri, protocols, opts);

  if (this.ws.binaryType === undefined) {
    this.supportsBinary = false;
  }

  this.ws.binaryType = 'arraybuffer';
  this.addEventListeners();
};

/**
 * Adds event listeners to the socket
 *
 * @api private
 */

WS.prototype.addEventListeners = function(){
  var self = this;

  this.ws.onopen = function(){
    self.onOpen();
  };
  this.ws.onclose = function(){
    self.onClose();
  };
  this.ws.onmessage = function(ev){
    self.onData(ev.data);
  };
  this.ws.onerror = function(e){
    self.onError('websocket error', e);
  };
};

/**
 * Override `onData` to use a timer on iOS.
 * See: https://gist.github.com/mloughran/2052006
 *
 * @api private
 */

if ('undefined' != typeof navigator
  && /iPad|iPhone|iPod/i.test(navigator.userAgent)) {
  WS.prototype.onData = function(data){
    var self = this;
    setTimeout(function(){
      Transport.prototype.onData.call(self, data);
    }, 0);
  };
}

/**
 * Writes data to socket.
 *
 * @param {Array} array of packets.
 * @api private
 */

WS.prototype.write = function(packets){
  var self = this;
  this.writable = false;
  // encodePacket efficient as it uses WS framing
  // no need for encodePayload
  for (var i = 0, l = packets.length; i < l; i++) {
    parser.encodePacket(packets[i], this.supportsBinary, function(data) {
      //Sometimes the websocket has already been closed but the browser didn't
      //have a chance of informing us about it yet, in that case send will
      //throw an error
      try {
        self.ws.send(data);
      } catch (e){
        debug('websocket closed before onclose event');
      }
    });
  }

  function ondrain() {
    self.writable = true;
    self.emit('drain');
  }
  // fake drain
  // defer to next tick to allow Socket to clear writeBuffer
  setTimeout(ondrain, 0);
};

/**
 * Called upon close
 *
 * @api private
 */

WS.prototype.onClose = function(){
  Transport.prototype.onClose.call(this);
};

/**
 * Closes socket.
 *
 * @api private
 */

WS.prototype.doClose = function(){
  if (typeof this.ws !== 'undefined') {
    this.ws.close();
  }
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

WS.prototype.uri = function(){
  var query = this.query || {};
  var schema = this.secure ? 'wss' : 'ws';
  var port = '';

  // avoid port if default for schema
  if (this.port && (('wss' == schema && this.port != 443)
    || ('ws' == schema && this.port != 80))) {
    port = ':' + this.port;
  }

  // append timestamp to URI
  if (this.timestampRequests) {
    query[this.timestampParam] = +new Date;
  }

  // communicate binary support capabilities
  if (!this.supportsBinary) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  return schema + '://' + this.hostname + port + this.path + query;
};

/**
 * Feature detection for WebSocket.
 *
 * @return {Boolean} whether this transport is available.
 * @api public
 */

WS.prototype.check = function(){
  return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name);
};

},{"../transport":44,"component-inherit":51,"debug":40,"engine.io-parser":52,"parseqs":62,"ws":64}],50:[function(require,module,exports){
// browser shim for xmlhttprequest module
var hasCORS = require('has-cors');

module.exports = function(opts) {
  var xdomain = opts.xdomain;

  // scheme must be same when usign XDomainRequest
  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
  var xscheme = opts.xscheme;

  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
  // https://github.com/Automattic/engine.io-client/pull/217
  var enablesXDR = opts.enablesXDR;

  // Use XDomainRequest for IE8 if enablesXDR is true
  // because loading bar keeps flashing when using jsonp-polling
  // https://github.com/yujiosaka/socke.io-ie8-loading-example
  try {
    if ('undefined' != typeof XDomainRequest && !xscheme && enablesXDR) {
      return new XDomainRequest();
    }
  } catch (e) { }

  // XMLHttpRequest can be disabled on IE
  try {
    if ('undefined' != typeof XMLHttpRequest && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e) { }

  if (!xdomain) {
    try {
      return new ActiveXObject('Microsoft.XMLHTTP');
    } catch(e) { }
  }
}

},{"has-cors":59}],51:[function(require,module,exports){

module.exports = function(a, b){
  var fn = function(){};
  fn.prototype = b.prototype;
  a.prototype = new fn;
  a.prototype.constructor = a;
};
},{}],52:[function(require,module,exports){
(function (global){
/**
 * Module dependencies.
 */

var keys = require('./keys');
var sliceBuffer = require('arraybuffer.slice');
var base64encoder = require('base64-arraybuffer');
var after = require('after');
var utf8 = require('utf8');

/**
 * Check if we are running an android browser. That requires us to use
 * ArrayBuffer with polling transports...
 *
 * http://ghinda.net/jpeg-blob-ajax-android/
 */

var isAndroid = navigator.userAgent.match(/Android/i);

/**
 * Current protocol version.
 */

exports.protocol = 3;

/**
 * Packet types.
 */

var packets = exports.packets = {
    open:     0    // non-ws
  , close:    1    // non-ws
  , ping:     2
  , pong:     3
  , message:  4
  , upgrade:  5
  , noop:     6
};

var packetslist = keys(packets);

/**
 * Premade error packet.
 */

var err = { type: 'error', data: 'parser error' };

/**
 * Create a blob api even for blob builder when vendor prefixes exist
 */

var Blob = require('blob');

/**
 * Encodes a packet.
 *
 *     <packet type id> [ <data> ]
 *
 * Example:
 *
 *     5hello world
 *     3
 *     4
 *
 * Binary is encoded in an identical principle
 *
 * @api private
 */

exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
  if ('function' == typeof supportsBinary) {
    callback = supportsBinary;
    supportsBinary = false;
  }

  if ('function' == typeof utf8encode) {
    callback = utf8encode;
    utf8encode = null;
  }

  var data = (packet.data === undefined)
    ? undefined
    : packet.data.buffer || packet.data;

  if (global.ArrayBuffer && data instanceof ArrayBuffer) {
    return encodeArrayBuffer(packet, supportsBinary, callback);
  } else if (Blob && data instanceof global.Blob) {
    return encodeBlob(packet, supportsBinary, callback);
  }

  // Sending data as a utf-8 string
  var encoded = packets[packet.type];

  // data fragment is optional
  if (undefined !== packet.data) {
    encoded += utf8encode ? utf8.encode(String(packet.data)) : String(packet.data);
  }

  return callback('' + encoded);

};

/**
 * Encode packet helpers for binary types
 */

function encodeArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var data = packet.data;
  var contentArray = new Uint8Array(data);
  var resultBuffer = new Uint8Array(1 + data.byteLength);

  resultBuffer[0] = packets[packet.type];
  for (var i = 0; i < contentArray.length; i++) {
    resultBuffer[i+1] = contentArray[i];
  }

  return callback(resultBuffer.buffer);
}

function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var fr = new FileReader();
  fr.onload = function() {
    packet.data = fr.result;
    exports.encodePacket(packet, supportsBinary, true, callback);
  };
  return fr.readAsArrayBuffer(packet.data);
}

function encodeBlob(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  if (isAndroid) {
    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
  }

  var length = new Uint8Array(1);
  length[0] = packets[packet.type];
  var blob = new Blob([length.buffer, packet.data]);

  return callback(blob);
}

/**
 * Encodes a packet with binary data in a base64 string
 *
 * @param {Object} packet, has `type` and `data`
 * @return {String} base64 encoded message
 */

exports.encodeBase64Packet = function(packet, callback) {
  var message = 'b' + exports.packets[packet.type];
  if (Blob && packet.data instanceof Blob) {
    var fr = new FileReader();
    fr.onload = function() {
      var b64 = fr.result.split(',')[1];
      callback(message + b64);
    };
    return fr.readAsDataURL(packet.data);
  }

  var b64data;
  try {
    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
  } catch (e) {
    // iPhone Safari doesn't let you apply with typed arrays
    var typed = new Uint8Array(packet.data);
    var basic = new Array(typed.length);
    for (var i = 0; i < typed.length; i++) {
      basic[i] = typed[i];
    }
    b64data = String.fromCharCode.apply(null, basic);
  }
  message += global.btoa(b64data);
  return callback(message);
};

/**
 * Decodes a packet. Changes format to Blob if requested.
 *
 * @return {Object} with `type` and `data` (if any)
 * @api private
 */

exports.decodePacket = function (data, binaryType, utf8decode) {
  // String data
  if (typeof data == 'string' || data === undefined) {
    if (data.charAt(0) == 'b') {
      return exports.decodeBase64Packet(data.substr(1), binaryType);
    }

    if (utf8decode) {
      try {
        data = utf8.decode(data);
      } catch (e) {
        return err;
      }
    }
    var type = data.charAt(0);

    if (Number(type) != type || !packetslist[type]) {
      return err;
    }

    if (data.length > 1) {
      return { type: packetslist[type], data: data.substring(1) };
    } else {
      return { type: packetslist[type] };
    }
  }

  var asArray = new Uint8Array(data);
  var type = asArray[0];
  var rest = sliceBuffer(data, 1);
  if (Blob && binaryType === 'blob') {
    rest = new Blob([rest]);
  }
  return { type: packetslist[type], data: rest };
};

/**
 * Decodes a packet encoded in a base64 string
 *
 * @param {String} base64 encoded message
 * @return {Object} with `type` and `data` (if any)
 */

exports.decodeBase64Packet = function(msg, binaryType) {
  var type = packetslist[msg.charAt(0)];
  if (!global.ArrayBuffer) {
    return { type: type, data: { base64: true, data: msg.substr(1) } };
  }

  var data = base64encoder.decode(msg.substr(1));

  if (binaryType === 'blob' && Blob) {
    data = new Blob([data]);
  }

  return { type: type, data: data };
};

/**
 * Encodes multiple messages (payload).
 *
 *     <length>:data
 *
 * Example:
 *
 *     11:hello world2:hi
 *
 * If any contents are binary, they will be encoded as base64 strings. Base64
 * encoded strings are marked with a b before the length specifier
 *
 * @param {Array} packets
 * @api private
 */

exports.encodePayload = function (packets, supportsBinary, callback) {
  if (typeof supportsBinary == 'function') {
    callback = supportsBinary;
    supportsBinary = null;
  }

  if (supportsBinary) {
    if (Blob && !isAndroid) {
      return exports.encodePayloadAsBlob(packets, callback);
    }

    return exports.encodePayloadAsArrayBuffer(packets, callback);
  }

  if (!packets.length) {
    return callback('0:');
  }

  function setLengthHeader(message) {
    return message.length + ':' + message;
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, supportsBinary, true, function(message) {
      doneCallback(null, setLengthHeader(message));
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(results.join(''));
  });
};

/**
 * Async array map using after
 */

function map(ary, each, done) {
  var result = new Array(ary.length);
  var next = after(ary.length, done);

  var eachWithIndex = function(i, el, cb) {
    each(el, function(error, msg) {
      result[i] = msg;
      cb(error, result);
    });
  };

  for (var i = 0; i < ary.length; i++) {
    eachWithIndex(i, ary[i], next);
  }
}

/*
 * Decodes data when a payload is maybe expected. Possible binary contents are
 * decoded from their base64 representation
 *
 * @param {String} data, callback method
 * @api public
 */

exports.decodePayload = function (data, binaryType, callback) {
  if (typeof data != 'string') {
    return exports.decodePayloadAsBinary(data, binaryType, callback);
  }

  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var packet;
  if (data == '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

  var length = ''
    , n, msg;

  for (var i = 0, l = data.length; i < l; i++) {
    var chr = data.charAt(i);

    if (':' != chr) {
      length += chr;
    } else {
      if ('' == length || (length != (n = Number(length)))) {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

      msg = data.substr(i + 1, n);

      if (length != msg.length) {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

      if (msg.length) {
        packet = exports.decodePacket(msg, binaryType, true);

        if (err.type == packet.type && err.data == packet.data) {
          // parser error in individual packet - ignoring payload
          return callback(err, 0, 1);
        }

        var ret = callback(packet, i + n, l);
        if (false === ret) return;
      }

      // advance cursor
      i += n;
      length = '';
    }
  }

  if (length != '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

};

/**
 * Encodes multiple messages (payload) as binary.
 *
 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
 * 255><data>
 *
 * Example:
 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
 *
 * @param {Array} packets
 * @return {ArrayBuffer} encoded payload
 * @api private
 */

exports.encodePayloadAsArrayBuffer = function(packets, callback) {
  if (!packets.length) {
    return callback(new ArrayBuffer(0));
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(data) {
      return doneCallback(null, data);
    });
  }

  map(packets, encodeOne, function(err, encodedPackets) {
    var totalLength = encodedPackets.reduce(function(acc, p) {
      var len;
      if (typeof p === 'string'){
        len = p.length;
      } else {
        len = p.byteLength;
      }
      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
    }, 0);

    var resultArray = new Uint8Array(totalLength);

    var bufferIndex = 0;
    encodedPackets.forEach(function(p) {
      var isString = typeof p === 'string';
      var ab = p;
      if (isString) {
        var view = new Uint8Array(p.length);
        for (var i = 0; i < p.length; i++) {
          view[i] = p.charCodeAt(i);
        }
        ab = view.buffer;
      }

      if (isString) { // not true binary
        resultArray[bufferIndex++] = 0;
      } else { // true binary
        resultArray[bufferIndex++] = 1;
      }

      var lenStr = ab.byteLength.toString();
      for (var i = 0; i < lenStr.length; i++) {
        resultArray[bufferIndex++] = parseInt(lenStr[i]);
      }
      resultArray[bufferIndex++] = 255;

      var view = new Uint8Array(ab);
      for (var i = 0; i < view.length; i++) {
        resultArray[bufferIndex++] = view[i];
      }
    });

    return callback(resultArray.buffer);
  });
};

/**
 * Encode as Blob
 */

exports.encodePayloadAsBlob = function(packets, callback) {
  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(encoded) {
      var binaryIdentifier = new Uint8Array(1);
      binaryIdentifier[0] = 1;
      if (typeof encoded === 'string') {
        var view = new Uint8Array(encoded.length);
        for (var i = 0; i < encoded.length; i++) {
          view[i] = encoded.charCodeAt(i);
        }
        encoded = view.buffer;
        binaryIdentifier[0] = 0;
      }

      var len = (encoded instanceof ArrayBuffer)
        ? encoded.byteLength
        : encoded.size;

      var lenStr = len.toString();
      var lengthAry = new Uint8Array(lenStr.length + 1);
      for (var i = 0; i < lenStr.length; i++) {
        lengthAry[i] = parseInt(lenStr[i]);
      }
      lengthAry[lenStr.length] = 255;

      if (Blob) {
        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
        doneCallback(null, blob);
      }
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(new Blob(results));
  });
};

/*
 * Decodes data when a payload is maybe expected. Strings are decoded by
 * interpreting each byte as a key code for entries marked to start with 0. See
 * description of encodePayloadAsBinary
 *
 * @param {ArrayBuffer} data, callback method
 * @api public
 */

exports.decodePayloadAsBinary = function (data, binaryType, callback) {
  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var bufferTail = data;
  var buffers = [];

  var numberTooLong = false;
  while (bufferTail.byteLength > 0) {
    var tailArray = new Uint8Array(bufferTail);
    var isString = tailArray[0] === 0;
    var msgLength = '';

    for (var i = 1; ; i++) {
      if (tailArray[i] == 255) break;

      if (msgLength.length > 310) {
        numberTooLong = true;
        break;
      }

      msgLength += tailArray[i];
    }

    if(numberTooLong) return callback(err, 0, 1);

    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
    msgLength = parseInt(msgLength);

    var msg = sliceBuffer(bufferTail, 0, msgLength);
    if (isString) {
      try {
        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
      } catch (e) {
        // iPhone Safari doesn't let you apply to typed arrays
        var typed = new Uint8Array(msg);
        msg = '';
        for (var i = 0; i < typed.length; i++) {
          msg += String.fromCharCode(typed[i]);
        }
      }
    }

    buffers.push(msg);
    bufferTail = sliceBuffer(bufferTail, msgLength);
  }

  var total = buffers.length;
  buffers.forEach(function(buffer, i) {
    callback(exports.decodePacket(buffer, binaryType, true), i, total);
  });
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./keys":53,"after":54,"arraybuffer.slice":55,"base64-arraybuffer":56,"blob":57,"utf8":58}],53:[function(require,module,exports){

/**
 * Gets the keys for an object.
 *
 * @return {Array} keys
 * @api private
 */

module.exports = Object.keys || function keys (obj){
  var arr = [];
  var has = Object.prototype.hasOwnProperty;

  for (var i in obj) {
    if (has.call(obj, i)) {
      arr.push(i);
    }
  }
  return arr;
};

},{}],54:[function(require,module,exports){
module.exports = after

function after(count, callback, err_cb) {
    var bail = false
    err_cb = err_cb || noop
    proxy.count = count

    return (count === 0) ? callback() : proxy

    function proxy(err, result) {
        if (proxy.count <= 0) {
            throw new Error('after called too many times')
        }
        --proxy.count

        // after first error, rest are passed to err_cb
        if (err) {
            bail = true
            callback(err)
            // future error callbacks will go to error handler
            callback = err_cb
        } else if (proxy.count === 0 && !bail) {
            callback(null, result)
        }
    }
}

function noop() {}

},{}],55:[function(require,module,exports){
/**
 * An abstraction for slicing an arraybuffer even when
 * ArrayBuffer.prototype.slice is not supported
 *
 * @api public
 */

module.exports = function(arraybuffer, start, end) {
  var bytes = arraybuffer.byteLength;
  start = start || 0;
  end = end || bytes;

  if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

  if (start < 0) { start += bytes; }
  if (end < 0) { end += bytes; }
  if (end > bytes) { end = bytes; }

  if (start >= bytes || start >= end || bytes === 0) {
    return new ArrayBuffer(0);
  }

  var abv = new Uint8Array(arraybuffer);
  var result = new Uint8Array(end - start);
  for (var i = start, ii = 0; i < end; i++, ii++) {
    result[ii] = abv[i];
  }
  return result.buffer;
};

},{}],56:[function(require,module,exports){
/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function(chars){
  "use strict";

  exports.encode = function(arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
    i, len = bytes.length, base64 = "";

    for (i = 0; i < len; i+=3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  exports.decode =  function(base64) {
    var bufferLength = base64.length * 0.75,
    len = base64.length, i, p = 0,
    encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i+=4) {
      encoded1 = chars.indexOf(base64[i]);
      encoded2 = chars.indexOf(base64[i+1]);
      encoded3 = chars.indexOf(base64[i+2]);
      encoded4 = chars.indexOf(base64[i+3]);

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };
})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");

},{}],57:[function(require,module,exports){
(function (global){
/**
 * Create a blob builder even when vendor prefixes exist
 */

var BlobBuilder = global.BlobBuilder
  || global.WebKitBlobBuilder
  || global.MSBlobBuilder
  || global.MozBlobBuilder;

/**
 * Check if Blob constructor is supported
 */

var blobSupported = (function() {
  try {
    var b = new Blob(['hi']);
    return b.size == 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if BlobBuilder is supported
 */

var blobBuilderSupported = BlobBuilder
  && BlobBuilder.prototype.append
  && BlobBuilder.prototype.getBlob;

function BlobBuilderConstructor(ary, options) {
  options = options || {};

  var bb = new BlobBuilder();
  for (var i = 0; i < ary.length; i++) {
    bb.append(ary[i]);
  }
  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
};

module.exports = (function() {
  if (blobSupported) {
    return global.Blob;
  } else if (blobBuilderSupported) {
    return BlobBuilderConstructor;
  } else {
    return undefined;
  }
})();

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],58:[function(require,module,exports){
(function (global){
/*! http://mths.be/utf8js v2.0.0 by @mathias */
;(function(root) {

	// Detect free variables `exports`
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	// Taken from http://mths.be/punycode
	function ucs2decode(string) {
		var output = [];
		var counter = 0;
		var length = string.length;
		var value;
		var extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	// Taken from http://mths.be/punycode
	function ucs2encode(array) {
		var length = array.length;
		var index = -1;
		var value;
		var output = '';
		while (++index < length) {
			value = array[index];
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
		}
		return output;
	}

	/*--------------------------------------------------------------------------*/

	function createByte(codePoint, shift) {
		return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
	}

	function encodeCodePoint(codePoint) {
		if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
			return stringFromCharCode(codePoint);
		}
		var symbol = '';
		if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
			symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
		}
		else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
			symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
			symbol += createByte(codePoint, 6);
		}
		else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
			symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
			symbol += createByte(codePoint, 12);
			symbol += createByte(codePoint, 6);
		}
		symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
		return symbol;
	}

	function utf8encode(string) {
		var codePoints = ucs2decode(string);

		// console.log(JSON.stringify(codePoints.map(function(x) {
		// 	return 'U+' + x.toString(16).toUpperCase();
		// })));

		var length = codePoints.length;
		var index = -1;
		var codePoint;
		var byteString = '';
		while (++index < length) {
			codePoint = codePoints[index];
			byteString += encodeCodePoint(codePoint);
		}
		return byteString;
	}

	/*--------------------------------------------------------------------------*/

	function readContinuationByte() {
		if (byteIndex >= byteCount) {
			throw Error('Invalid byte index');
		}

		var continuationByte = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		if ((continuationByte & 0xC0) == 0x80) {
			return continuationByte & 0x3F;
		}

		// If we end up here, it’s not a continuation byte
		throw Error('Invalid continuation byte');
	}

	function decodeSymbol() {
		var byte1;
		var byte2;
		var byte3;
		var byte4;
		var codePoint;

		if (byteIndex > byteCount) {
			throw Error('Invalid byte index');
		}

		if (byteIndex == byteCount) {
			return false;
		}

		// Read first byte
		byte1 = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		// 1-byte sequence (no continuation bytes)
		if ((byte1 & 0x80) == 0) {
			return byte1;
		}

		// 2-byte sequence
		if ((byte1 & 0xE0) == 0xC0) {
			var byte2 = readContinuationByte();
			codePoint = ((byte1 & 0x1F) << 6) | byte2;
			if (codePoint >= 0x80) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 3-byte sequence (may include unpaired surrogates)
		if ((byte1 & 0xF0) == 0xE0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
			if (codePoint >= 0x0800) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 4-byte sequence
		if ((byte1 & 0xF8) == 0xF0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			byte4 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
				(byte3 << 0x06) | byte4;
			if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
				return codePoint;
			}
		}

		throw Error('Invalid UTF-8 detected');
	}

	var byteArray;
	var byteCount;
	var byteIndex;
	function utf8decode(byteString) {
		byteArray = ucs2decode(byteString);
		byteCount = byteArray.length;
		byteIndex = 0;
		var codePoints = [];
		var tmp;
		while ((tmp = decodeSymbol()) !== false) {
			codePoints.push(tmp);
		}
		return ucs2encode(codePoints);
	}

	/*--------------------------------------------------------------------------*/

	var utf8 = {
		'version': '2.0.0',
		'encode': utf8encode,
		'decode': utf8decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return utf8;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = utf8;
		} else { // in Narwhal or RingoJS v0.7.0-
			var object = {};
			var hasOwnProperty = object.hasOwnProperty;
			for (var key in utf8) {
				hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.utf8 = utf8;
	}

}(this));

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],59:[function(require,module,exports){

/**
 * Module dependencies.
 */

var global = require('global');

/**
 * Module exports.
 *
 * Logic borrowed from Modernizr:
 *
 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
 */

try {
  module.exports = 'XMLHttpRequest' in global &&
    'withCredentials' in new global.XMLHttpRequest();
} catch (err) {
  // if XMLHttp support is disabled in IE then it will throw
  // when trying to create
  module.exports = false;
}

},{"global":60}],60:[function(require,module,exports){

/**
 * Returns `this`. Execute this without a "context" (i.e. without it being
 * attached to an object of the left-hand side), and `this` points to the
 * "global" scope of the current JS execution.
 */

module.exports = (function () { return this; })();

},{}],61:[function(require,module,exports){
(function (global){
/**
 * JSON parse.
 *
 * @see Based on jQuery#parseJSON (MIT) and JSON2
 * @api private
 */

var rvalidchars = /^[\],:{}\s]*$/;
var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
var rtrimLeft = /^\s+/;
var rtrimRight = /\s+$/;

module.exports = function parsejson(data) {
  if ('string' != typeof data || !data) {
    return null;
  }

  data = data.replace(rtrimLeft, '').replace(rtrimRight, '');

  // Attempt to parse using the native JSON parser first
  if (global.JSON && JSON.parse) {
    return JSON.parse(data);
  }

  if (rvalidchars.test(data.replace(rvalidescape, '@')
      .replace(rvalidtokens, ']')
      .replace(rvalidbraces, ''))) {
    return (new Function('return ' + data))();
  }
};
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],62:[function(require,module,exports){
/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */

exports.encode = function (obj) {
  var str = '';

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (str.length) str += '&';
      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
    }
  }

  return str;
};

/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */

exports.decode = function(qs){
  var qry = {};
  var pairs = qs.split('&');
  for (var i = 0, l = pairs.length; i < l; i++) {
    var pair = pairs[i].split('=');
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
};

},{}],63:[function(require,module,exports){
/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */

var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

var parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];

module.exports = function parseuri(str) {
    var src = str,
        b = str.indexOf('['),
        e = str.indexOf(']');

    if (b != -1 && e != -1) {
        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
    }

    var m = re.exec(str || ''),
        uri = {},
        i = 14;

    while (i--) {
        uri[parts[i]] = m[i] || '';
    }

    if (b != -1 && e != -1) {
        uri.source = src;
        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
        uri.ipv6uri = true;
    }

    return uri;
};

},{}],64:[function(require,module,exports){

/**
 * Module dependencies.
 */

var global = (function() { return this; })();

/**
 * WebSocket constructor.
 */

var WebSocket = global.WebSocket || global.MozWebSocket;

/**
 * Module exports.
 */

module.exports = WebSocket ? ws : null;

/**
 * WebSocket constructor.
 *
 * The third `opts` options object gets ignored in web browsers, since it's
 * non-standard, and throws a TypeError if passed to the constructor.
 * See: https://github.com/einaros/ws/issues/227
 *
 * @param {String} uri
 * @param {Array} protocols (optional)
 * @param {Object) opts (optional)
 * @api public
 */

function ws(uri, protocols, opts) {
  var instance;
  if (protocols) {
    instance = new WebSocket(uri, protocols);
  } else {
    instance = new WebSocket(uri);
  }
  return instance;
}

if (WebSocket) ws.prototype = WebSocket.prototype;

},{}],65:[function(require,module,exports){
(function (global){

/*
 * Module requirements.
 */

var isArray = require('isarray');

/**
 * Module exports.
 */

module.exports = hasBinary;

/**
 * Checks for binary data.
 *
 * Right now only Buffer and ArrayBuffer are supported..
 *
 * @param {Object} anything
 * @api public
 */

function hasBinary(data) {

  function _hasBinary(obj) {
    if (!obj) return false;

    if ( (global.Buffer && global.Buffer.isBuffer(obj)) ||
         (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
         (global.Blob && obj instanceof Blob) ||
         (global.File && obj instanceof File)
        ) {
      return true;
    }

    if (isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
          if (_hasBinary(obj[i])) {
              return true;
          }
      }
    } else if (obj && 'object' == typeof obj) {
      if (obj.toJSON) {
        obj = obj.toJSON();
      }

      for (var key in obj) {
        if (obj.hasOwnProperty(key) && _hasBinary(obj[key])) {
          return true;
        }
      }
    }

    return false;
  }

  return _hasBinary(data);
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"isarray":66}],66:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],67:[function(require,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],68:[function(require,module,exports){

/**
 * HOP ref.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Return own keys in `obj`.
 *
 * @param {Object} obj
 * @return {Array}
 * @api public
 */

exports.keys = Object.keys || function(obj){
  var keys = [];
  for (var key in obj) {
    if (has.call(obj, key)) {
      keys.push(key);
    }
  }
  return keys;
};

/**
 * Return own values in `obj`.
 *
 * @param {Object} obj
 * @return {Array}
 * @api public
 */

exports.values = function(obj){
  var vals = [];
  for (var key in obj) {
    if (has.call(obj, key)) {
      vals.push(obj[key]);
    }
  }
  return vals;
};

/**
 * Merge `b` into `a`.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api public
 */

exports.merge = function(a, b){
  for (var key in b) {
    if (has.call(b, key)) {
      a[key] = b[key];
    }
  }
  return a;
};

/**
 * Return length of `obj`.
 *
 * @param {Object} obj
 * @return {Number}
 * @api public
 */

exports.length = function(obj){
  return exports.keys(obj).length;
};

/**
 * Check if `obj` is empty.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api public
 */

exports.isEmpty = function(obj){
  return 0 == exports.length(obj);
};
},{}],69:[function(require,module,exports){
/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */

var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

var parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host'
  , 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];

module.exports = function parseuri(str) {
  var m = re.exec(str || '')
    , uri = {}
    , i = 14;

  while (i--) {
    uri[parts[i]] = m[i] || '';
  }

  return uri;
};

},{}],70:[function(require,module,exports){
(function (global){
/*global Blob,File*/

/**
 * Module requirements
 */

var isArray = require('isarray');
var isBuf = require('./is-buffer');

/**
 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
 * Anything with blobs or files should be fed through removeBlobs before coming
 * here.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @api public
 */

exports.deconstructPacket = function(packet){
  var buffers = [];
  var packetData = packet.data;

  function _deconstructPacket(data) {
    if (!data) return data;

    if (isBuf(data)) {
      var placeholder = { _placeholder: true, num: buffers.length };
      buffers.push(data);
      return placeholder;
    } else if (isArray(data)) {
      var newData = new Array(data.length);
      for (var i = 0; i < data.length; i++) {
        newData[i] = _deconstructPacket(data[i]);
      }
      return newData;
    } else if ('object' == typeof data && !(data instanceof Date)) {
      var newData = {};
      for (var key in data) {
        newData[key] = _deconstructPacket(data[key]);
      }
      return newData;
    }
    return data;
  }

  var pack = packet;
  pack.data = _deconstructPacket(packetData);
  pack.attachments = buffers.length; // number of binary 'attachments'
  return {packet: pack, buffers: buffers};
};

/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @api public
 */

exports.reconstructPacket = function(packet, buffers) {
  var curPlaceHolder = 0;

  function _reconstructPacket(data) {
    if (data && data._placeholder) {
      var buf = buffers[data.num]; // appropriate buffer (should be natural order anyway)
      return buf;
    } else if (isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        data[i] = _reconstructPacket(data[i]);
      }
      return data;
    } else if (data && 'object' == typeof data) {
      for (var key in data) {
        data[key] = _reconstructPacket(data[key]);
      }
      return data;
    }
    return data;
  }

  packet.data = _reconstructPacket(packet.data);
  packet.attachments = undefined; // no longer useful
  return packet;
};

/**
 * Asynchronously removes Blobs or Files from data via
 * FileReader's readAsArrayBuffer method. Used before encoding
 * data as msgpack. Calls callback with the blobless data.
 *
 * @param {Object} data
 * @param {Function} callback
 * @api private
 */

exports.removeBlobs = function(data, callback) {
  function _removeBlobs(obj, curKey, containingObject) {
    if (!obj) return obj;

    // convert any blob
    if ((global.Blob && obj instanceof Blob) ||
        (global.File && obj instanceof File)) {
      pendingBlobs++;

      // async filereader
      var fileReader = new FileReader();
      fileReader.onload = function() { // this.result == arraybuffer
        if (containingObject) {
          containingObject[curKey] = this.result;
        }
        else {
          bloblessData = this.result;
        }

        // if nothing pending its callback time
        if(! --pendingBlobs) {
          callback(bloblessData);
        }
      };

      fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
    } else if (isArray(obj)) { // handle array
      for (var i = 0; i < obj.length; i++) {
        _removeBlobs(obj[i], i, obj);
      }
    } else if (obj && 'object' == typeof obj && !isBuf(obj)) { // and object
      for (var key in obj) {
        _removeBlobs(obj[key], key, obj);
      }
    }
  }

  var pendingBlobs = 0;
  var bloblessData = data;
  _removeBlobs(bloblessData);
  if (!pendingBlobs) {
    callback(bloblessData);
  }
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./is-buffer":72,"isarray":73}],71:[function(require,module,exports){

/**
 * Module dependencies.
 */

var debug = require('debug')('socket.io-parser');
var json = require('json3');
var isArray = require('isarray');
var Emitter = require('component-emitter');
var binary = require('./binary');
var isBuf = require('./is-buffer');

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = 4;

/**
 * Packet types.
 *
 * @api public
 */

exports.types = [
  'CONNECT',
  'DISCONNECT',
  'EVENT',
  'BINARY_EVENT',
  'ACK',
  'BINARY_ACK',
  'ERROR'
];

/**
 * Packet type `connect`.
 *
 * @api public
 */

exports.CONNECT = 0;

/**
 * Packet type `disconnect`.
 *
 * @api public
 */

exports.DISCONNECT = 1;

/**
 * Packet type `event`.
 *
 * @api public
 */

exports.EVENT = 2;

/**
 * Packet type `ack`.
 *
 * @api public
 */

exports.ACK = 3;

/**
 * Packet type `error`.
 *
 * @api public
 */

exports.ERROR = 4;

/**
 * Packet type 'binary event'
 *
 * @api public
 */

exports.BINARY_EVENT = 5;

/**
 * Packet type `binary ack`. For acks with binary arguments.
 *
 * @api public
 */

exports.BINARY_ACK = 6;

/**
 * Encoder constructor.
 *
 * @api public
 */

exports.Encoder = Encoder;

/**
 * Decoder constructor.
 *
 * @api public
 */

exports.Decoder = Decoder;

/**
 * A socket.io Encoder instance
 *
 * @api public
 */

function Encoder() {}

/**
 * Encode a packet as a single string if non-binary, or as a
 * buffer sequence, depending on packet type.
 *
 * @param {Object} obj - packet object
 * @param {Function} callback - function to handle encodings (likely engine.write)
 * @return Calls callback with Array of encodings
 * @api public
 */

Encoder.prototype.encode = function(obj, callback){
  debug('encoding packet %j', obj);

  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
    encodeAsBinary(obj, callback);
  }
  else {
    var encoding = encodeAsString(obj);
    callback([encoding]);
  }
};

/**
 * Encode packet as string.
 *
 * @param {Object} packet
 * @return {String} encoded
 * @api private
 */

function encodeAsString(obj) {
  var str = '';
  var nsp = false;

  // first is type
  str += obj.type;

  // attachments if we have them
  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
    str += obj.attachments;
    str += '-';
  }

  // if we have a namespace other than `/`
  // we append it followed by a comma `,`
  if (obj.nsp && '/' != obj.nsp) {
    nsp = true;
    str += obj.nsp;
  }

  // immediately followed by the id
  if (null != obj.id) {
    if (nsp) {
      str += ',';
      nsp = false;
    }
    str += obj.id;
  }

  // json data
  if (null != obj.data) {
    if (nsp) str += ',';
    str += json.stringify(obj.data);
  }

  debug('encoded %j as %s', obj, str);
  return str;
}

/**
 * Encode packet as 'buffer sequence' by removing blobs, and
 * deconstructing packet into object with placeholders and
 * a list of buffers.
 *
 * @param {Object} packet
 * @return {Buffer} encoded
 * @api private
 */

function encodeAsBinary(obj, callback) {

  function writeEncoding(bloblessData) {
    var deconstruction = binary.deconstructPacket(bloblessData);
    var pack = encodeAsString(deconstruction.packet);
    var buffers = deconstruction.buffers;

    buffers.unshift(pack); // add packet info to beginning of data list
    callback(buffers); // write all the buffers
  }

  binary.removeBlobs(obj, writeEncoding);
}

/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 * @api public
 */

function Decoder() {
  this.reconstructor = null;
}

/**
 * Mix in `Emitter` with Decoder.
 */

Emitter(Decoder.prototype);

/**
 * Decodes an ecoded packet string into packet JSON.
 *
 * @param {String} obj - encoded packet
 * @return {Object} packet
 * @api public
 */

Decoder.prototype.add = function(obj) {
  var packet;
  if ('string' == typeof obj) {
    packet = decodeString(obj);
    if (exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type) { // binary packet's json
      this.reconstructor = new BinaryReconstructor(packet);

      // no attachments, labeled binary but no binary data to follow
      if (this.reconstructor.reconPack.attachments == 0) {
        this.emit('decoded', packet);
      }
    } else { // non-binary full packet
      this.emit('decoded', packet);
    }
  }
  else if (isBuf(obj) || obj.base64) { // raw binary data
    if (!this.reconstructor) {
      throw new Error('got binary data when not reconstructing a packet');
    } else {
      packet = this.reconstructor.takeBinaryData(obj);
      if (packet) { // received final buffer
        this.reconstructor = null;
        this.emit('decoded', packet);
      }
    }
  }
  else {
    throw new Error('Unknown type: ' + obj);
  }
};

/**
 * Decode a packet String (JSON data)
 *
 * @param {String} str
 * @return {Object} packet
 * @api private
 */

function decodeString(str) {
  var p = {};
  var i = 0;

  // look up type
  p.type = Number(str.charAt(0));
  if (null == exports.types[p.type]) return error();

  // look up attachments if type binary
  if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
    p.attachments = '';
    while (str.charAt(++i) != '-') {
      p.attachments += str.charAt(i);
    }
    p.attachments = Number(p.attachments);
  }

  // look up namespace (if any)
  if ('/' == str.charAt(i + 1)) {
    p.nsp = '';
    while (++i) {
      var c = str.charAt(i);
      if (',' == c) break;
      p.nsp += c;
      if (i + 1 == str.length) break;
    }
  } else {
    p.nsp = '/';
  }

  // look up id
  var next = str.charAt(i + 1);
  if ('' != next && Number(next) == next) {
    p.id = '';
    while (++i) {
      var c = str.charAt(i);
      if (null == c || Number(c) != c) {
        --i;
        break;
      }
      p.id += str.charAt(i);
      if (i + 1 == str.length) break;
    }
    p.id = Number(p.id);
  }

  // look up json data
  if (str.charAt(++i)) {
    try {
      p.data = json.parse(str.substr(i));
    } catch(e){
      return error();
    }
  }

  debug('decoded %s as %j', str, p);
  return p;
}

/**
 * Deallocates a parser's resources
 *
 * @api public
 */

Decoder.prototype.destroy = function() {
  if (this.reconstructor) {
    this.reconstructor.finishedReconstruction();
  }
};

/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 * @api private
 */

function BinaryReconstructor(packet) {
  this.reconPack = packet;
  this.buffers = [];
}

/**
 * Method to be called when binary data received from connection
 * after a BINARY_EVENT packet.
 *
 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
 * @return {null | Object} returns null if more binary data is expected or
 *   a reconstructed packet object if all buffers have been received.
 * @api private
 */

BinaryReconstructor.prototype.takeBinaryData = function(binData) {
  this.buffers.push(binData);
  if (this.buffers.length == this.reconPack.attachments) { // done with buffer list
    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
    this.finishedReconstruction();
    return packet;
  }
  return null;
};

/**
 * Cleans up binary packet reconstruction variables.
 *
 * @api private
 */

BinaryReconstructor.prototype.finishedReconstruction = function() {
  this.reconPack = null;
  this.buffers = [];
};

function error(data){
  return {
    type: exports.ERROR,
    data: 'parser error'
  };
}

},{"./binary":70,"./is-buffer":72,"component-emitter":39,"debug":40,"isarray":73,"json3":74}],72:[function(require,module,exports){
(function (global){

module.exports = isBuf;

/**
 * Returns true if obj is a buffer or an arraybuffer.
 *
 * @api private
 */

function isBuf(obj) {
  return (global.Buffer && global.Buffer.isBuffer(obj)) ||
         (global.ArrayBuffer && obj instanceof ArrayBuffer);
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],73:[function(require,module,exports){
module.exports=require(66)
},{}],74:[function(require,module,exports){
/*! JSON v3.2.6 | http://bestiejs.github.io/json3 | Copyright 2012-2013, Kit Cambridge | http://kit.mit-license.org */
;(function (window) {
  // Convenience aliases.
  var getClass = {}.toString, isProperty, forEach, undef;

  // Detect the `define` function exposed by asynchronous module loaders. The
  // strict `define` check is necessary for compatibility with `r.js`.
  var isLoader = typeof define === "function" && define.amd;

  // Detect native implementations.
  var nativeJSON = typeof JSON == "object" && JSON;

  // Set up the JSON 3 namespace, preferring the CommonJS `exports` object if
  // available.
  var JSON3 = typeof exports == "object" && exports && !exports.nodeType && exports;

  if (JSON3 && nativeJSON) {
    // Explicitly delegate to the native `stringify` and `parse`
    // implementations in CommonJS environments.
    JSON3.stringify = nativeJSON.stringify;
    JSON3.parse = nativeJSON.parse;
  } else {
    // Export for web browsers, JavaScript engines, and asynchronous module
    // loaders, using the global `JSON` object if available.
    JSON3 = window.JSON = nativeJSON || {};
  }

  // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
  var isExtended = new Date(-3509827334573292);
  try {
    // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
    // results for certain dates in Opera >= 10.53.
    isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
      // Safari < 2.0.2 stores the internal millisecond time value correctly,
      // but clips the values returned by the date methods to the range of
      // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
      isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
  } catch (exception) {}

  // Internal: Determines whether the native `JSON.stringify` and `parse`
  // implementations are spec-compliant. Based on work by Ken Snyder.
  function has(name) {
    if (has[name] !== undef) {
      // Return cached feature test result.
      return has[name];
    }

    var isSupported;
    if (name == "bug-string-char-index") {
      // IE <= 7 doesn't support accessing string characters using square
      // bracket notation. IE 8 only supports this for primitives.
      isSupported = "a"[0] != "a";
    } else if (name == "json") {
      // Indicates whether both `JSON.stringify` and `JSON.parse` are
      // supported.
      isSupported = has("json-stringify") && has("json-parse");
    } else {
      var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
      // Test `JSON.stringify`.
      if (name == "json-stringify") {
        var stringify = JSON3.stringify, stringifySupported = typeof stringify == "function" && isExtended;
        if (stringifySupported) {
          // A test function object with a custom `toJSON` method.
          (value = function () {
            return 1;
          }).toJSON = value;
          try {
            stringifySupported =
              // Firefox 3.1b1 and b2 serialize string, number, and boolean
              // primitives as object literals.
              stringify(0) === "0" &&
              // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
              // literals.
              stringify(new Number()) === "0" &&
              stringify(new String()) == '""' &&
              // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
              // does not define a canonical JSON representation (this applies to
              // objects with `toJSON` properties as well, *unless* they are nested
              // within an object or array).
              stringify(getClass) === undef &&
              // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
              // FF 3.1b3 pass this test.
              stringify(undef) === undef &&
              // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
              // respectively, if the value is omitted entirely.
              stringify() === undef &&
              // FF 3.1b1, 2 throw an error if the given value is not a number,
              // string, array, object, Boolean, or `null` literal. This applies to
              // objects with custom `toJSON` methods as well, unless they are nested
              // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
              // methods entirely.
              stringify(value) === "1" &&
              stringify([value]) == "[1]" &&
              // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
              // `"[null]"`.
              stringify([undef]) == "[null]" &&
              // YUI 3.0.0b1 fails to serialize `null` literals.
              stringify(null) == "null" &&
              // FF 3.1b1, 2 halts serialization if an array contains a function:
              // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
              // elides non-JSON values from objects and arrays, unless they
              // define custom `toJSON` methods.
              stringify([undef, getClass, null]) == "[null,null,null]" &&
              // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
              // where character escape codes are expected (e.g., `\b` => `\u0008`).
              stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
              // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
              stringify(null, value) === "1" &&
              stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
              // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
              // serialize extended years.
              stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
              // The milliseconds are optional in ES 5, but required in 5.1.
              stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
              // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
              // four-digit years instead of six-digit years. Credits: @Yaffle.
              stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
              // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
              // values less than 1000. Credits: @Yaffle.
              stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
          } catch (exception) {
            stringifySupported = false;
          }
        }
        isSupported = stringifySupported;
      }
      // Test `JSON.parse`.
      if (name == "json-parse") {
        var parse = JSON3.parse;
        if (typeof parse == "function") {
          try {
            // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
            // Conforming implementations should also coerce the initial argument to
            // a string prior to parsing.
            if (parse("0") === 0 && !parse(false)) {
              // Simple parsing test.
              value = parse(serialized);
              var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
              if (parseSupported) {
                try {
                  // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                  parseSupported = !parse('"\t"');
                } catch (exception) {}
                if (parseSupported) {
                  try {
                    // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                    // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                    // certain octal literals.
                    parseSupported = parse("01") !== 1;
                  } catch (exception) {}
                }
                if (parseSupported) {
                  try {
                    // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                    // points. These environments, along with FF 3.1b1 and 2,
                    // also allow trailing commas in JSON objects and arrays.
                    parseSupported = parse("1.") !== 1;
                  } catch (exception) {}
                }
              }
            }
          } catch (exception) {
            parseSupported = false;
          }
        }
        isSupported = parseSupported;
      }
    }
    return has[name] = !!isSupported;
  }

  if (!has("json")) {
    // Common `[[Class]]` name aliases.
    var functionClass = "[object Function]";
    var dateClass = "[object Date]";
    var numberClass = "[object Number]";
    var stringClass = "[object String]";
    var arrayClass = "[object Array]";
    var booleanClass = "[object Boolean]";

    // Detect incomplete support for accessing string characters by index.
    var charIndexBuggy = has("bug-string-char-index");

    // Define additional utility methods if the `Date` methods are buggy.
    if (!isExtended) {
      var floor = Math.floor;
      // A mapping between the months of the year and the number of days between
      // January 1st and the first of the respective month.
      var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
      // Internal: Calculates the number of days between the Unix epoch and the
      // first day of the given month.
      var getDay = function (year, month) {
        return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
      };
    }

    // Internal: Determines if a property is a direct property of the given
    // object. Delegates to the native `Object#hasOwnProperty` method.
    if (!(isProperty = {}.hasOwnProperty)) {
      isProperty = function (property) {
        var members = {}, constructor;
        if ((members.__proto__ = null, members.__proto__ = {
          // The *proto* property cannot be set multiple times in recent
          // versions of Firefox and SeaMonkey.
          "toString": 1
        }, members).toString != getClass) {
          // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
          // supports the mutable *proto* property.
          isProperty = function (property) {
            // Capture and break the object's prototype chain (see section 8.6.2
            // of the ES 5.1 spec). The parenthesized expression prevents an
            // unsafe transformation by the Closure Compiler.
            var original = this.__proto__, result = property in (this.__proto__ = null, this);
            // Restore the original prototype chain.
            this.__proto__ = original;
            return result;
          };
        } else {
          // Capture a reference to the top-level `Object` constructor.
          constructor = members.constructor;
          // Use the `constructor` property to simulate `Object#hasOwnProperty` in
          // other environments.
          isProperty = function (property) {
            var parent = (this.constructor || constructor).prototype;
            return property in this && !(property in parent && this[property] === parent[property]);
          };
        }
        members = null;
        return isProperty.call(this, property);
      };
    }

    // Internal: A set of primitive types used by `isHostType`.
    var PrimitiveTypes = {
      'boolean': 1,
      'number': 1,
      'string': 1,
      'undefined': 1
    };

    // Internal: Determines if the given object `property` value is a
    // non-primitive.
    var isHostType = function (object, property) {
      var type = typeof object[property];
      return type == 'object' ? !!object[property] : !PrimitiveTypes[type];
    };

    // Internal: Normalizes the `for...in` iteration algorithm across
    // environments. Each enumerated key is yielded to a `callback` function.
    forEach = function (object, callback) {
      var size = 0, Properties, members, property;

      // Tests for bugs in the current environment's `for...in` algorithm. The
      // `valueOf` property inherits the non-enumerable flag from
      // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
      (Properties = function () {
        this.valueOf = 0;
      }).prototype.valueOf = 0;

      // Iterate over a new instance of the `Properties` class.
      members = new Properties();
      for (property in members) {
        // Ignore all properties inherited from `Object.prototype`.
        if (isProperty.call(members, property)) {
          size++;
        }
      }
      Properties = members = null;

      // Normalize the iteration algorithm.
      if (!size) {
        // A list of non-enumerable properties inherited from `Object.prototype`.
        members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
        // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
        // properties.
        forEach = function (object, callback) {
          var isFunction = getClass.call(object) == functionClass, property, length;
          var hasProperty = !isFunction && typeof object.constructor != 'function' && isHostType(object, 'hasOwnProperty') ? object.hasOwnProperty : isProperty;
          for (property in object) {
            // Gecko <= 1.0 enumerates the `prototype` property of functions under
            // certain conditions; IE does not.
            if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
              callback(property);
            }
          }
          // Manually invoke the callback for each non-enumerable property.
          for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
        };
      } else if (size == 2) {
        // Safari <= 2.0.4 enumerates shadowed properties twice.
        forEach = function (object, callback) {
          // Create a set of iterated properties.
          var members = {}, isFunction = getClass.call(object) == functionClass, property;
          for (property in object) {
            // Store each property name to prevent double enumeration. The
            // `prototype` property of functions is not enumerated due to cross-
            // environment inconsistencies.
            if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
              callback(property);
            }
          }
        };
      } else {
        // No bugs detected; use the standard `for...in` algorithm.
        forEach = function (object, callback) {
          var isFunction = getClass.call(object) == functionClass, property, isConstructor;
          for (property in object) {
            if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
              callback(property);
            }
          }
          // Manually invoke the callback for the `constructor` property due to
          // cross-environment inconsistencies.
          if (isConstructor || isProperty.call(object, (property = "constructor"))) {
            callback(property);
          }
        };
      }
      return forEach(object, callback);
    };

    // Public: Serializes a JavaScript `value` as a JSON string. The optional
    // `filter` argument may specify either a function that alters how object and
    // array members are serialized, or an array of strings and numbers that
    // indicates which properties should be serialized. The optional `width`
    // argument may be either a string or number that specifies the indentation
    // level of the output.
    if (!has("json-stringify")) {
      // Internal: A map of control characters and their escaped equivalents.
      var Escapes = {
        92: "\\\\",
        34: '\\"',
        8: "\\b",
        12: "\\f",
        10: "\\n",
        13: "\\r",
        9: "\\t"
      };

      // Internal: Converts `value` into a zero-padded string such that its
      // length is at least equal to `width`. The `width` must be <= 6.
      var leadingZeroes = "000000";
      var toPaddedString = function (width, value) {
        // The `|| 0` expression is necessary to work around a bug in
        // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
        return (leadingZeroes + (value || 0)).slice(-width);
      };

      // Internal: Double-quotes a string `value`, replacing all ASCII control
      // characters (characters with code unit values between 0 and 31) with
      // their escaped equivalents. This is an implementation of the
      // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
      var unicodePrefix = "\\u00";
      var quote = function (value) {
        var result = '"', index = 0, length = value.length, isLarge = length > 10 && charIndexBuggy, symbols;
        if (isLarge) {
          symbols = value.split("");
        }
        for (; index < length; index++) {
          var charCode = value.charCodeAt(index);
          // If the character is a control character, append its Unicode or
          // shorthand escape sequence; otherwise, append the character as-is.
          switch (charCode) {
            case 8: case 9: case 10: case 12: case 13: case 34: case 92:
              result += Escapes[charCode];
              break;
            default:
              if (charCode < 32) {
                result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                break;
              }
              result += isLarge ? symbols[index] : charIndexBuggy ? value.charAt(index) : value[index];
          }
        }
        return result + '"';
      };

      // Internal: Recursively serializes an object. Implements the
      // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
      var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
        var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
        try {
          // Necessary for host object support.
          value = object[property];
        } catch (exception) {}
        if (typeof value == "object" && value) {
          className = getClass.call(value);
          if (className == dateClass && !isProperty.call(value, "toJSON")) {
            if (value > -1 / 0 && value < 1 / 0) {
              // Dates are serialized according to the `Date#toJSON` method
              // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
              // for the ISO 8601 date time string format.
              if (getDay) {
                // Manually compute the year, month, date, hours, minutes,
                // seconds, and milliseconds if the `getUTC*` methods are
                // buggy. Adapted from @Yaffle's `date-shim` project.
                date = floor(value / 864e5);
                for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                date = 1 + date - getDay(year, month);
                // The `time` value specifies the time within the day (see ES
                // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                // to compute `A modulo B`, as the `%` operator does not
                // correspond to the `modulo` operation for negative numbers.
                time = (value % 864e5 + 864e5) % 864e5;
                // The hours, minutes, seconds, and milliseconds are obtained by
                // decomposing the time within the day. See section 15.9.1.10.
                hours = floor(time / 36e5) % 24;
                minutes = floor(time / 6e4) % 60;
                seconds = floor(time / 1e3) % 60;
                milliseconds = time % 1e3;
              } else {
                year = value.getUTCFullYear();
                month = value.getUTCMonth();
                date = value.getUTCDate();
                hours = value.getUTCHours();
                minutes = value.getUTCMinutes();
                seconds = value.getUTCSeconds();
                milliseconds = value.getUTCMilliseconds();
              }
              // Serialize extended years correctly.
              value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                // Months, dates, hours, minutes, and seconds should have two
                // digits; milliseconds should have three.
                "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                // Milliseconds are optional in ES 5.0, but required in 5.1.
                "." + toPaddedString(3, milliseconds) + "Z";
            } else {
              value = null;
            }
          } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
            // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
            // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
            // ignores all `toJSON` methods on these objects unless they are
            // defined directly on an instance.
            value = value.toJSON(property);
          }
        }
        if (callback) {
          // If a replacement function was provided, call it to obtain the value
          // for serialization.
          value = callback.call(object, property, value);
        }
        if (value === null) {
          return "null";
        }
        className = getClass.call(value);
        if (className == booleanClass) {
          // Booleans are represented literally.
          return "" + value;
        } else if (className == numberClass) {
          // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
          // `"null"`.
          return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
        } else if (className == stringClass) {
          // Strings are double-quoted and escaped.
          return quote("" + value);
        }
        // Recursively serialize objects and arrays.
        if (typeof value == "object") {
          // Check for cyclic structures. This is a linear search; performance
          // is inversely proportional to the number of unique nested objects.
          for (length = stack.length; length--;) {
            if (stack[length] === value) {
              // Cyclic structures cannot be serialized by `JSON.stringify`.
              throw TypeError();
            }
          }
          // Add the object to the stack of traversed objects.
          stack.push(value);
          results = [];
          // Save the current indentation level and indent one additional level.
          prefix = indentation;
          indentation += whitespace;
          if (className == arrayClass) {
            // Recursively serialize array elements.
            for (index = 0, length = value.length; index < length; index++) {
              element = serialize(index, value, callback, properties, whitespace, indentation, stack);
              results.push(element === undef ? "null" : element);
            }
            result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
          } else {
            // Recursively serialize object members. Members are selected from
            // either a user-specified list of property names, or the object
            // itself.
            forEach(properties || value, function (property) {
              var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
              if (element !== undef) {
                // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                // is not the empty string, let `member` {quote(property) + ":"}
                // be the concatenation of `member` and the `space` character."
                // The "`space` character" refers to the literal space
                // character, not the `space` {width} argument provided to
                // `JSON.stringify`.
                results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
              }
            });
            result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
          }
          // Remove the object from the traversed object stack.
          stack.pop();
          return result;
        }
      };

      // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
      JSON3.stringify = function (source, filter, width) {
        var whitespace, callback, properties, className;
        if (typeof filter == "function" || typeof filter == "object" && filter) {
          if ((className = getClass.call(filter)) == functionClass) {
            callback = filter;
          } else if (className == arrayClass) {
            // Convert the property names array into a makeshift set.
            properties = {};
            for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
          }
        }
        if (width) {
          if ((className = getClass.call(width)) == numberClass) {
            // Convert the `width` to an integer and create a string containing
            // `width` number of space characters.
            if ((width -= width % 1) > 0) {
              for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
            }
          } else if (className == stringClass) {
            whitespace = width.length <= 10 ? width : width.slice(0, 10);
          }
        }
        // Opera <= 7.54u2 discards the values associated with empty string keys
        // (`""`) only if they are used directly within an object member list
        // (e.g., `!("" in { "": 1})`).
        return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
      };
    }

    // Public: Parses a JSON source string.
    if (!has("json-parse")) {
      var fromCharCode = String.fromCharCode;

      // Internal: A map of escaped control characters and their unescaped
      // equivalents.
      var Unescapes = {
        92: "\\",
        34: '"',
        47: "/",
        98: "\b",
        116: "\t",
        110: "\n",
        102: "\f",
        114: "\r"
      };

      // Internal: Stores the parser state.
      var Index, Source;

      // Internal: Resets the parser state and throws a `SyntaxError`.
      var abort = function() {
        Index = Source = null;
        throw SyntaxError();
      };

      // Internal: Returns the next token, or `"$"` if the parser has reached
      // the end of the source string. A token may be a string, number, `null`
      // literal, or Boolean literal.
      var lex = function () {
        var source = Source, length = source.length, value, begin, position, isSigned, charCode;
        while (Index < length) {
          charCode = source.charCodeAt(Index);
          switch (charCode) {
            case 9: case 10: case 13: case 32:
              // Skip whitespace tokens, including tabs, carriage returns, line
              // feeds, and space characters.
              Index++;
              break;
            case 123: case 125: case 91: case 93: case 58: case 44:
              // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
              // the current position.
              value = charIndexBuggy ? source.charAt(Index) : source[Index];
              Index++;
              return value;
            case 34:
              // `"` delimits a JSON string; advance to the next character and
              // begin parsing the string. String tokens are prefixed with the
              // sentinel `@` character to distinguish them from punctuators and
              // end-of-string tokens.
              for (value = "@", Index++; Index < length;) {
                charCode = source.charCodeAt(Index);
                if (charCode < 32) {
                  // Unescaped ASCII control characters (those with a code unit
                  // less than the space character) are not permitted.
                  abort();
                } else if (charCode == 92) {
                  // A reverse solidus (`\`) marks the beginning of an escaped
                  // control character (including `"`, `\`, and `/`) or Unicode
                  // escape sequence.
                  charCode = source.charCodeAt(++Index);
                  switch (charCode) {
                    case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
                      // Revive escaped control characters.
                      value += Unescapes[charCode];
                      Index++;
                      break;
                    case 117:
                      // `\u` marks the beginning of a Unicode escape sequence.
                      // Advance to the first character and validate the
                      // four-digit code point.
                      begin = ++Index;
                      for (position = Index + 4; Index < position; Index++) {
                        charCode = source.charCodeAt(Index);
                        // A valid sequence comprises four hexdigits (case-
                        // insensitive) that form a single hexadecimal value.
                        if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                          // Invalid Unicode escape sequence.
                          abort();
                        }
                      }
                      // Revive the escaped character.
                      value += fromCharCode("0x" + source.slice(begin, Index));
                      break;
                    default:
                      // Invalid escape sequence.
                      abort();
                  }
                } else {
                  if (charCode == 34) {
                    // An unescaped double-quote character marks the end of the
                    // string.
                    break;
                  }
                  charCode = source.charCodeAt(Index);
                  begin = Index;
                  // Optimize for the common case where a string is valid.
                  while (charCode >= 32 && charCode != 92 && charCode != 34) {
                    charCode = source.charCodeAt(++Index);
                  }
                  // Append the string as-is.
                  value += source.slice(begin, Index);
                }
              }
              if (source.charCodeAt(Index) == 34) {
                // Advance to the next character and return the revived string.
                Index++;
                return value;
              }
              // Unterminated string.
              abort();
            default:
              // Parse numbers and literals.
              begin = Index;
              // Advance past the negative sign, if one is specified.
              if (charCode == 45) {
                isSigned = true;
                charCode = source.charCodeAt(++Index);
              }
              // Parse an integer or floating-point value.
              if (charCode >= 48 && charCode <= 57) {
                // Leading zeroes are interpreted as octal literals.
                if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                  // Illegal octal literal.
                  abort();
                }
                isSigned = false;
                // Parse the integer component.
                for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                // Floats cannot contain a leading decimal point; however, this
                // case is already accounted for by the parser.
                if (source.charCodeAt(Index) == 46) {
                  position = ++Index;
                  // Parse the decimal component.
                  for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                  if (position == Index) {
                    // Illegal trailing decimal.
                    abort();
                  }
                  Index = position;
                }
                // Parse exponents. The `e` denoting the exponent is
                // case-insensitive.
                charCode = source.charCodeAt(Index);
                if (charCode == 101 || charCode == 69) {
                  charCode = source.charCodeAt(++Index);
                  // Skip past the sign following the exponent, if one is
                  // specified.
                  if (charCode == 43 || charCode == 45) {
                    Index++;
                  }
                  // Parse the exponential component.
                  for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                  if (position == Index) {
                    // Illegal empty exponent.
                    abort();
                  }
                  Index = position;
                }
                // Coerce the parsed value to a JavaScript number.
                return +source.slice(begin, Index);
              }
              // A negative sign may only precede numbers.
              if (isSigned) {
                abort();
              }
              // `true`, `false`, and `null` literals.
              if (source.slice(Index, Index + 4) == "true") {
                Index += 4;
                return true;
              } else if (source.slice(Index, Index + 5) == "false") {
                Index += 5;
                return false;
              } else if (source.slice(Index, Index + 4) == "null") {
                Index += 4;
                return null;
              }
              // Unrecognized token.
              abort();
          }
        }
        // Return the sentinel `$` character if the parser has reached the end
        // of the source string.
        return "$";
      };

      // Internal: Parses a JSON `value` token.
      var get = function (value) {
        var results, hasMembers;
        if (value == "$") {
          // Unexpected end of input.
          abort();
        }
        if (typeof value == "string") {
          if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
            // Remove the sentinel `@` character.
            return value.slice(1);
          }
          // Parse object and array literals.
          if (value == "[") {
            // Parses a JSON array, returning a new JavaScript array.
            results = [];
            for (;; hasMembers || (hasMembers = true)) {
              value = lex();
              // A closing square bracket marks the end of the array literal.
              if (value == "]") {
                break;
              }
              // If the array literal contains elements, the current token
              // should be a comma separating the previous element from the
              // next.
              if (hasMembers) {
                if (value == ",") {
                  value = lex();
                  if (value == "]") {
                    // Unexpected trailing `,` in array literal.
                    abort();
                  }
                } else {
                  // A `,` must separate each array element.
                  abort();
                }
              }
              // Elisions and leading commas are not permitted.
              if (value == ",") {
                abort();
              }
              results.push(get(value));
            }
            return results;
          } else if (value == "{") {
            // Parses a JSON object, returning a new JavaScript object.
            results = {};
            for (;; hasMembers || (hasMembers = true)) {
              value = lex();
              // A closing curly brace marks the end of the object literal.
              if (value == "}") {
                break;
              }
              // If the object literal contains members, the current token
              // should be a comma separator.
              if (hasMembers) {
                if (value == ",") {
                  value = lex();
                  if (value == "}") {
                    // Unexpected trailing `,` in object literal.
                    abort();
                  }
                } else {
                  // A `,` must separate each object member.
                  abort();
                }
              }
              // Leading commas are not permitted, object property names must be
              // double-quoted strings, and a `:` must separate each property
              // name and value.
              if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                abort();
              }
              results[value.slice(1)] = get(lex());
            }
            return results;
          }
          // Unexpected token encountered.
          abort();
        }
        return value;
      };

      // Internal: Updates a traversed object member.
      var update = function(source, property, callback) {
        var element = walk(source, property, callback);
        if (element === undef) {
          delete source[property];
        } else {
          source[property] = element;
        }
      };

      // Internal: Recursively traverses a parsed JSON object, invoking the
      // `callback` function for each value. This is an implementation of the
      // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
      var walk = function (source, property, callback) {
        var value = source[property], length;
        if (typeof value == "object" && value) {
          // `forEach` can't be used to traverse an array in Opera <= 8.54
          // because its `Object#hasOwnProperty` implementation returns `false`
          // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
          if (getClass.call(value) == arrayClass) {
            for (length = value.length; length--;) {
              update(value, length, callback);
            }
          } else {
            forEach(value, function (property) {
              update(value, property, callback);
            });
          }
        }
        return callback.call(source, property, value);
      };

      // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
      JSON3.parse = function (source, callback) {
        var result, value;
        Index = 0;
        Source = "" + source;
        result = get(lex());
        // If a JSON string contains multiple tokens, it is invalid.
        if (lex() != "$") {
          abort();
        }
        // Reset the parser state.
        Index = Source = null;
        return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
      };
    }
  }

  // Export for asynchronous module loaders.
  if (isLoader) {
    define(function () {
      return JSON3;
    });
  }
}(this));

},{}],75:[function(require,module,exports){
module.exports = toArray

function toArray(list, index) {
    var array = []

    index = index || 0

    for (var i = index || 0; i < list.length; i++) {
        array[i - index] = list[i]
    }

    return array
}

},{}]},{},[1])