(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Main;

Main = (function() {
  function Main() {
    this.$win = $(window);
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

  Main.prototype.htmlToCanvas = function($dom) {
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

  Main.prototype.setScrollBarHeight = function() {
    var _t, _type, i, k, ref, results;
    _type = ["t", "d"];
    results = [];
    for (i = k = 0, ref = _type.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
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
    var _loaded_count, _t, _type, fn, i, k, l, ref, ref1, results;
    this.$win.on("resize", $.debounce(500, (function(_this) {
      return function() {
        return _this.setScrollBarHeight();
      };
    })(this)));
    this.$thumb.on("click", (function(_this) {
      return function(e) {
        var _$e, _img;
        _this.$d_c_c_i.filter("[data-type=\"about\"]").hide();
        _this.$d_c_c_i.filter("[data-type=\"works_detail\"]").show();
        _$e = $(e.currentTarget);
        _img = new Image();
        _img.src = "img/" + (_$e.attr("data-type")) + "/" + (_$e.attr("data-name")) + ".jpg";
        _this.$d_c.find(".detail_pic").empty().append(_img);
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
    for (i = k = 0, ref = _type.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      _t = _type[i];
      fn(_t);
    }
    this.$t_s.hide();
    this.$thumb_container = $(".thumb_container");
    _loaded_count = 0;
    results = [];
    for (i = l = 0, ref1 = this.$thumb.size(); 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
      results.push((function(_this) {
        return function(i) {
          var _img, _interval;
          _img = new Image();
          _interval = setInterval(function() {
            var _block_num, _canvas, _clone_canvas, _ctx, _ease, _gap, _height, m, ref2;
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
              clearInterval(_interval);
              _loaded_count += 1;
              if (_loaded_count === _this.$thumb.size()) {
                _clone_canvas = _this.htmlToCanvas(_this.$thumb_container);
                _canvas = document.createElement("canvas");
                _ctx = _canvas.getContext("2d");
                _canvas.width = _clone_canvas.width * 1.5;
                _canvas.height = _clone_canvas.height;
                _canvas.style.width = (_clone_canvas.width * 1.5 / 2) + "px";
                _canvas.style.height = (_clone_canvas.height / 2) + "px";
                _canvas.style.left = _this.$thumb_container.get(0).getBoundingClientRect().left + "px";
                _this.$t_c_c_i.append(_canvas);
                _height = Math.floor(Math.random() * 3) + 2;
                _block_num = Math.ceil(_clone_canvas.height / _height);
                _gap = [];
                _ease = [];
                for (i = m = 0, ref2 = _block_num; 0 <= ref2 ? m < ref2 : m > ref2; i = 0 <= ref2 ? ++m : --m) {
                  _gap[i] = Math.random() * 1000 - 500;
                }
                _interval = setInterval(function() {
                  var _offset_top, _scroll_top, _win_height;
                  _scroll_top = _this.$win.scrollTop();
                  _win_height = _this.$win.height();
                  _offset_top = _canvas.offsetTop;
                  createjs.Ticker.addEventListener("tick", function(e) {
                    var n, ref3, results1;
                    _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
                    results1 = [];
                    for (i = n = 0, ref3 = _block_num; 0 <= ref3 ? n < ref3 : n > ref3; i = 0 <= ref3 ? ++n : --n) {
                      if (_height / 2 * (i + 1) + _offset_top < _scroll_top || _height / 2 * i + _offset_top > _scroll_top + _win_height) {
                        continue;
                      }
                      if (e.runTime + _gap[i] < 0) {
                        _t = 0;
                      } else if (e.runTime + _gap[i] > 800) {
                        _t = 1;
                      } else {
                        _t = createjs.Ease.quartOut((e.runTime + _gap[i]) / 800);
                      }
                      results1.push(_ctx.drawImage(_clone_canvas, 0, _height * i, _clone_canvas.width, _height, _canvas.width - _t * _canvas.width, _height * i, _clone_canvas.width, _height));
                    }
                    return results1;
                  });
                  setTimeout(function() {
                    createjs.Ticker.reset();
                    _this.$thumb.css({
                      opacity: 1
                    });
                    _this.$t_c_c_i.find("canvas").remove();
                    return _this.setScrollBarHeight();
                  }, 1300);
                  return clearInterval(_interval);
                }, 100);
                _this.$thumb.css({
                  opacity: 0
                });
                return _this.$t_c_c_i.css({
                  zIndex: 1
                });
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



},{}]},{},[1]);
