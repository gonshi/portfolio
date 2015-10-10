(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Main, htmlToCanvas;

htmlToCanvas = require("../module/htmlToCanvas")();

Main = (function() {
  function Main() {
    this.$win = $(window);
    this.$type_inner = $(".type_inner");
    this.$t_c_c_i = $(".contents_column").filter("[data-type=\"thumb\"]").find(".contents_column_inner");
    this.$thumb = $(".thumb");
    this.$t_s = $(".thumb_scrollBar");
    this.$t_s_i = $(".thumb_scrollBar_inner");
    this.$d_c_c_i = $(".contents_column").filter("[data-type=\"detail\"]").find(".contents_column_inner");
    this.$d_c = $(".detail_container");
    this.$d_s = $(".detail_scrollBar");
    this.$d_s_i = $(".detail_scrollBar_inner");
    if (location.href.match("localhost")) {
      window.is_debug = true;
    }
    this.exec();
  }

  Main.prototype.mosaicAnim = function(canvas, img, cb) {
    var _dur, _img_canvas, _img_ctx, _img_data, _mosaic_canvas, _mosaic_ctx, _mosaic_height, _mosaic_horizon_num, _mosaic_vertical_num, _mosaic_width, _pixel_i, canvas_ctx, j, k, ref, ref1, x, y;
    createjs.Ticker.reset();
    if (this.mosaic_timeout != null) {
      clearTimeout(this.mosaic_timeout);
    }
    canvas.width = img.width;
    canvas.height = img.height;
    canvas_ctx = canvas.getContext("2d");
    _img_canvas = document.createElement("canvas");
    _img_canvas.width = img.width;
    _img_canvas.height = img.height;
    _img_ctx = _img_canvas.getContext("2d");
    _img_ctx.drawImage(img, 0, 0, img.width, img.height);
    _img_data = _img_ctx.getImageData(0, 0, img.width, img.height).data;
    _mosaic_canvas = document.createElement("canvas");
    _mosaic_canvas.width = img.width;
    _mosaic_canvas.height = img.height;
    _mosaic_ctx = _mosaic_canvas.getContext("2d");
    _mosaic_width = 20;
    _mosaic_horizon_num = Math.ceil(img.width / _mosaic_width);
    _mosaic_height = 20;
    _mosaic_vertical_num = Math.ceil(img.height / _mosaic_height);
    for (x = j = 0, ref = _mosaic_horizon_num; 0 <= ref ? j < ref : j > ref; x = 0 <= ref ? ++j : --j) {
      for (y = k = 0, ref1 = _mosaic_vertical_num; 0 <= ref1 ? k < ref1 : k > ref1; y = 0 <= ref1 ? ++k : --k) {
        _pixel_i = ((x + 0.5) * _mosaic_width + img.width * ((y + 0.5) * _mosaic_height)) * 4;
        _mosaic_ctx.fillStyle = ("rgba(" + _img_data[_pixel_i] + ", ") + (_img_data[_pixel_i + 1] + ", ") + (_img_data[_pixel_i + 2] + ", ") + (_img_data[_pixel_i + 3] + ")");
        _mosaic_ctx.fillRect(x * _mosaic_width, y * _mosaic_height, _mosaic_width, _mosaic_height);
      }
    }
    _dur = 500;
    createjs.Ticker.addEventListener("tick", function(e) {
      var _t;
      canvas_ctx.clearRect(0, 0, img.width, img.height);
      if (e.runTime < _dur) {
        _t = createjs.Ease.quartOut(e.runTime / _dur);
        canvas_ctx.drawImage(_mosaic_canvas, 0, 0, _mosaic_canvas.width, _t * _mosaic_canvas.height, 0, 0, canvas.width, _t * canvas.height);
      } else {
        canvas_ctx.drawImage(_mosaic_canvas, 0, 0);
      }
      if (e.runTime > _dur * 0.6) {
        if (e.runTime < _dur * 1.6) {
          _t = createjs.Ease.quartOut((e.runTime - _dur * 0.6) / _dur);
          return canvas_ctx.drawImage(_img_canvas, 0, 0, _img_canvas.width, _t * _img_canvas.height, 0, 0, canvas.width, _t * canvas.height);
        } else {
          return canvas_ctx.drawImage(_img_canvas, 0, 0);
        }
      }
    });
    return this.mosaic_timeout = setTimeout(function() {
      canvas_ctx.globalCompositeOperation = "source-over";
      canvas_ctx.drawImage(_img_canvas, 0, 0);
      createjs.Ticker.reset();
      if (cb != null) {
        return cb();
      }
    }, _dur * 1.6);
  };

  Main.prototype.slitAnim = function(vec, cb) {
    var _canvas, _clone_canvas, _ctx, _dur, _left_margin, _offset_top, _scroll_top, _slit_height, _slit_num, _time_gap, _time_gap_range, _win_slit_height, i, j, k, ref, ref1;
    this.$t_s.hide();
    this.$thumb.css({
      opacity: 1
    });
    this.$thumb_container = $(".thumb_container");
    _clone_canvas = htmlToCanvas.exec(this.$thumb_container);
    _canvas = document.createElement("canvas");
    _ctx = _canvas.getContext("2d");
    _canvas.width = _clone_canvas.width * 1.5;
    _canvas.height = _clone_canvas.height;
    _canvas.style.width = (_clone_canvas.width * 1.5 / 2) + "px";
    _canvas.style.height = (_clone_canvas.height / 2) + "px";
    if (vec === "in") {
      _canvas.style.left = this.$thumb_container.get(0).getBoundingClientRect().left + "px";
    } else {
      _left_margin = this.$thumb_container.get(0).getBoundingClientRect().left * 2;
      _canvas.style.left = "0px";
    }
    this.$t_c_c_i.append(_canvas);
    _slit_height = Math.floor(Math.random() * 3) + 4;
    _slit_num = Math.ceil(_clone_canvas.height / _slit_height);
    _dur = 800;
    _time_gap = [];
    _time_gap_range = 300;
    if (vec === "in") {
      for (i = j = 0, ref = _slit_num; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        _time_gap[i] = Math.random() * _time_gap_range * 2 - _time_gap_range;
      }
    } else {
      for (i = k = 0, ref1 = _slit_num; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
        _time_gap[i] = Math.random() * _time_gap_range * -2;
      }
    }
    _scroll_top = this.$t_c_c_i.scrollTop();
    _win_slit_height = this.$win.height();
    _offset_top = _canvas.offsetTop;
    createjs.Ticker.addEventListener("tick", function(e) {
      var _left, _t, l, ref2, results;
      _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
      results = [];
      for (i = l = 0, ref2 = _slit_num; 0 <= ref2 ? l < ref2 : l > ref2; i = 0 <= ref2 ? ++l : --l) {
        if (_slit_height / 2 * (i + 1) + _offset_top < _scroll_top || _slit_height / 2 * i + _offset_top > _scroll_top + _win_slit_height) {
          continue;
        }
        if (e.runTime + _time_gap[i] < 0) {
          _t = 0;
        } else if (e.runTime + _time_gap[i] > _dur) {
          _t = 1;
        } else {
          _t = createjs.Ease.quartOut((e.runTime + _time_gap[i]) / _dur);
        }
        if (vec === "in") {
          _left = _canvas.width - _t * _canvas.width;
        } else {
          _left = -_t * _canvas.width + _left_margin;
        }
        results.push(_ctx.drawImage(_clone_canvas, 0, _slit_height * i, _clone_canvas.width, _slit_height, _left, _slit_height * i, _clone_canvas.width, _slit_height));
      }
      return results;
    });
    setTimeout((function(_this) {
      return function() {
        createjs.Ticker.reset();
        _this.$thumb.css({
          opacity: 1
        });
        _this.$t_c_c_i.find("canvas").remove();
        _this.setScrollBarHeight();
        if (cb != null) {
          return cb();
        }
      };
    })(this), _time_gap_range + _dur);
    return this.$thumb.css({
      opacity: 0
    });
  };

  Main.prototype.setScrollBarHeight = function() {
    var _t, _type, i, j, ref, results;
    _type = ["t", "d"];
    results = [];
    for (i = j = 0, ref = _type.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      _t = _type[i];
      results.push((function(_this) {
        return function(_t) {
          _this["$" + _t + "_s"].show();
          _this["$" + _t + "_s_i"].height(_this["$" + _t + "_c_c_i"].height() / _this["$" + _t + "_c_c_i"].get(0).scrollHeight * _this["$" + _t + "_s"].height());
          return _this[_t + "_s_rest_height"] = _this["$" + _t + "_s"].height() - _this["$" + _t + "_s_i"].height();
        };
      })(this)(_t));
    }
    return results;
  };

  Main.prototype.exec = function() {
    var _interval, _loaded_count, _t, _type, fn, i, j, k, ref, ref1, results;
    this.$win.on("resize", $.debounce(500, (function(_this) {
      return function() {
        return _this.setScrollBarHeight();
      };
    })(this)));
    this.$type_inner.on("click", (function(_this) {
      return function(e) {
        if ($(e.currentTarget).hasClass("is-prevent")) {
          return;
        }
        _this.$type_inner.addClass("is-prevent");
        _this.slitAnim("out");
        _this.$thumb.hide();
        _this.$thumb.filter("[data-type=\"" + ($(e.currentTarget).attr("data-type")) + "\"]").show();
        _this.slitAnim("in", function() {
          return _this.$type_inner.removeClass("is-prevent");
        });
        _this.$type_inner.removeClass("not-selected");
        return _this.$type_inner.not("[data-type=\"" + ($(e.currentTarget).attr("data-type")) + "\"]").addClass("not-selected");
      };
    })(this));
    this.$thumb.on("click", (function(_this) {
      return function(e) {
        var _$e, _img, _interval;
        _this.$d_c_c_i.filter("[data-type=\"about\"]").hide();
        _this.$d_c_c_i.filter("[data-type=\"works_detail\"]").show();
        _$e = $(e.currentTarget);
        _img = new Image();
        _interval = setInterval(function() {
          if (_img.width > 0) {
            _this.mosaicAnim(_this.$d_c.find(".detail_pic").get(0), _img, function() {
              return _this.$d_c.find(".detail_info").show();
            });
            return clearInterval(_interval);
          }
        }, 100);
        _img.src = "img/" + (_$e.attr("data-type")) + "/" + (_$e.attr("data-name")) + ".jpg";
        _this.$d_c.find(".detail_info").hide();
        _this.$d_c.find(".detail_ttl").html(_$e.attr("data-ttl"));
        _this.$d_c.find(".detail_role_inner").text(_$e.attr("data-role"));
        _this.$d_c.find(".detail_description").html(_$e.attr("data-description"));
        _this.$d_c.find(".detail_link a").attr({
          href: _$e.attr("data-link")
        });
        return _this.onload_interval = setInterval(function() {
          if (_img.width > 0) {
            _this.setScrollBarHeight();
            _this.$d_s_i.css({
              top: 0
            });
            return clearInterval(_this.onload_interval);
          }
        }, 100);
      };
    })(this));
    _type = ["t", "d"];
    fn = (function(_this) {
      return function(_t) {
        return _this["$" + _t + "_c_c_i"].on("scroll", $.throttle(20, function() {
          return _this["$" + _t + "_s_i"].css({
            top: _this[_t + "_s_rest_height"] * _this["$" + _t + "_c_c_i"].scrollTop() / (_this["$" + _t + "_c_c_i"].get(0).scrollHeight - _this["$" + _t + "_c_c_i"].height())
          });
        }));
      };
    })(this);
    for (i = j = 0, ref = _type.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      _t = _type[i];
      fn(_t);
    }
    _loaded_count = 0;
    _interval = [];
    results = [];
    for (i = k = 0, ref1 = this.$thumb.size(); 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
      results.push((function(_this) {
        return function(i) {
          var _img;
          _img = new Image();
          _interval[i] = setInterval(function() {
            var _canvas, _ctx;
            if (_img.width > 0) {
              _canvas = document.createElement("canvas");
              _ctx = _canvas.getContext("2d");
              _canvas.width = _img.width;
              _canvas.height = _img.height;
              _ctx.drawImage(_img, 0, 0);
              _this.$thumb.eq(i).find(".thumb_pic").css({
                width: _img.width,
                height: _img.height,
                backgroundImage: "url(" + (_canvas.toDataURL()) + ")"
              });
              clearInterval(_interval[i]);
              _loaded_count += 1;
              if (_loaded_count === _this.$thumb.size()) {
                return _this.slitAnim("in");
              }
            }
          }, 100);
          return _img.src = "img/" + _this.$thumb.eq(i).find(".thumb_pic").attr("data-type") + "-thumb/" + _this.$thumb.eq(i).find(".thumb_pic").attr("data-name") + ".jpg";
        };
      })(this)(i));
    }
    return results;
  };

  return Main;

})();

new Main();



},{"../module/htmlToCanvas":2}],2:[function(require,module,exports){
var HtmlToCanvas, getInstance, instance;

instance = null;

HtmlToCanvas = (function() {
  function HtmlToCanvas() {}

  HtmlToCanvas.prototype.exec = function($dom) {
    var _$dom, _DOMURL, _canvas, _cssAttr, _ctx, _data, _img, _svg, _url;
    _$dom = $dom.clone();
    _cssAttr = ["font-family", "font-size", "font-weight", "font-style", "color", "text-transform", "text-decoration", "letter-spacing", "word-spacing", "line-height", "text-align", "vertical-align", "direction", "background-color", "background-image", "background-repeat", "background-position", "background-attachment", "opacity", "width", "height", "top", "right", "bottom", "left", "margin-top", "margin-right", "margin-bottom", "margin-left", "padding-top", "padding-right", "padding-bottom", "padding-left", "border-top-width", "border-right-width", "border-bottom-width", "border-left-width", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color", "border-top-style", "border-right-style", "border-bottom-style", "border-left-style", "position", "display", "visibility", "z-index", "overflow-x", "overflow-y", "white-space", "clip", "float", "clear", "cursor", "list-style-image", "list-style-position", "list-style-type", "marker-offset"];

    /* 対象DOM自体のcss
    _cssTxt = ""
    for j in [0..._cssAttr.length]
        _cssTxt += "#{_cssAttr[j]}: #{$.fn.css.call($dom, _cssAttr[j])}; "
    _$dom.attr style: _cssTxt
     */
    $dom.find("*").each(function(i) {
      var _cssTxt, j, k, ref;
      _cssTxt = "";
      for (j = k = 0, ref = _cssAttr.length; 0 <= ref ? k < ref : k > ref; j = 0 <= ref ? ++k : --k) {
        _cssTxt += _cssAttr[j] + ": " + ($.fn.css.call($(this), _cssAttr[j])) + "; ";
      }
      return _$dom.find("*").eq(i).attr({
        style: _cssTxt
      });
    });
    _canvas = document.createElement("canvas");
    _canvas.width = $dom.width() * 2;
    _canvas.height = $dom.height() * 2;
    _ctx = _canvas.getContext("2d");
    _data = "<svg xmlns='http://www.w3.org/2000/svg' " + ("width='" + ($dom.width()) + "' ") + ("height='" + ($dom.height()) + "'>") + "<foreignObject width='100%' height='100%'>" + "<div xmlns='http://www.w3.org/1999/xhtml'>" + _$dom.get(0).outerHTML.replace(/data-(.*?)"\ |data-(.*?)">/g, "").replace(/<br(.*?)>/g, "<br$1\/>").replace(/<img(.*?)>/g, "<img$1\/>") + "</div>" + "</foreignObject>" + "</svg>";
    _DOMURL = self.URL || self.webkitURL || self;
    _img = new Image();
    _svg = new Blob([_data], {
      type: "image/svg+xml"
    });
    _url = _DOMURL.createObjectURL(_svg);
    _img.onload = function() {
      _ctx.drawImage(_img, 0, 0, _img.width * 2, _img.height * 2);
      _canvas.style.width = _img.width + "px";
      _canvas.style.height = _img.height + "px";
      return _DOMURL.revokeObjectURL(_url);
    };
    _img.src = _url;
    return _canvas;
  };

  return HtmlToCanvas;

})();

getInstance = function() {
  if (!instance) {
    instance = new HtmlToCanvas();
  }
  return instance;
};

module.exports = getInstance;



},{}]},{},[1]);
