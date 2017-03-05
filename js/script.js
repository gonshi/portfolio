(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Main, htmlToCanvas;

htmlToCanvas = require("../module/htmlToCanvas")();

Main = (function() {
  function Main() {
    this.$win = $(window);
    this.$body = $("body");
    this.$type_inner = $(".type_inner");
    this.$scrollBar = $(".scrollBar");
    this.$t_c_c_i = $(".contents_column").filter("[data-type=\"thumb\"]").find(".contents_column_inner");
    this.$thumb = $(".thumb");
    this.$t_s = $(".scrollBar").filter("[data-type=\"thumb\"]");
    this.$t_s_i = this.$t_s.find(".scrollBar_inner");
    this.$d_c_c = $(".contents_column").filter("[data-type=\"detail\"]");
    this.$d_c_c_i = $(".contents_column").filter("[data-type=\"detail\"]").find(".contents_column_inner");
    this.$d_c = $(".detail_container");
    this.$d_s = $(".scrollBar").filter("[data-type=\"detail\"]");
    this.$d_s_i = this.$d_s.find(".scrollBar_inner");
    this.$footer_about = $(".footer_about");
    if (location.href.match("localhost")) {
      window.is_debug = true;
    }
    window.VIEWPORT = 640;
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
    if (!$.browser.desktop) {
      this.setScrollBarHeight();
      this.$thumb.css({
        opacity: 1
      });
      if (cb != null) {
        cb();
      }
      return;
    }
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
    if (this.not_first_slit_anim != null) {
      if (vec === "out") {
        return setTimeout(((function(_this) {
          return function() {
            return _this.$thumb.css({
              opacity: 0
            });
          };
        })(this)), 50);
      } else {
        return this.$thumb.css({
          opacity: 0
        });
      }
    } else {
      this.not_first_slit_anim = true;
      return this.$thumb.css({
        opacity: 0
      });
    }
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

  Main.prototype.setDetailPosition = function(type) {
    var _$d_c;
    _$d_c = this.$d_c_c_i.filter("[data-type=\"" + type + "\"]").find(".detail_container");
    _$d_c.removeAttr("style");
    if ($.browser.desktop) {
      if (_$d_c.height() + parseInt(_$d_c.css("marginTop")) * 2 < this.$win.height()) {
        return _$d_c.css({
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          height: _$d_c.height(),
          margin: "auto"
        });
      }
    } else {
      if (_$d_c.height() + parseInt(_$d_c.css("marginTop")) * 2 < this.$win.height() - 200) {
        return _$d_c.css({
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          height: _$d_c.height(),
          margin: "auto"
        });
      } else {
        return _$d_c.css({
          position: "absolute",
          top: 150,
          right: 0,
          left: 0,
          paddingBottom: 100,
          margin: "auto"
        });
      }
    }
  };

  Main.prototype.exec = function() {
    var _loaded_count, _t, _type, fn, fn1, i, j, k, ref, ref1;
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
        setTimeout(function() {
          _this.$thumb.hide();
          _this.$thumb.filter("[data-type=\"" + ($(e.currentTarget).attr("data-type")) + "\"]").show();
          return _this.slitAnim("in", function() {
            return _this.$type_inner.removeClass("is-prevent");
          });
        }, 50);
        _this.$type_inner.removeClass("not-selected");
        return _this.$type_inner.not("[data-type=\"" + ($(e.currentTarget).attr("data-type")) + "\"]").addClass("not-selected");
      };
    })(this));
    this.$thumb.on("click", (function(_this) {
      return function(e) {
        var _$e, _canvas, _img, _imgloaded_func, _src;
        _this.$d_c_c_i.filter("[data-type=\"about\"]").hide();
        _this.$d_c_c_i.filter("[data-type=\"works_detail\"]").show();
        _this.$d_c_c.show();
        _$e = $(e.currentTarget);
        _imgloaded_func = function() {
          return _this.mosaicAnim(_this.$d_c.find(".detail_pic").get(0), _img, function() {
            _this.$d_c.find(".detail_info").css({
              opacity: 1
            });
            _this.setScrollBarHeight();
            _this.$d_c_c_i.prop({
              scrollTop: 0
            });
            return _this.$d_s_i.css({
              top: 0
            });
          });
        };
        _img = new Image();
        if (_img.width > 0) {
          _imgloaded_func();
        } else {
          _img.onload = function() {
            return _imgloaded_func();
          };
        }
        _img.src = "img/" + (_$e.attr("data-type")) + "/" + (_$e.attr("data-name")) + ".jpg";
        _this.$d_c.find(".detail_info").css({
          opacity: 0
        });
        _this.$d_c.find(".detail_ttl").html(_$e.attr("data-ttl"));
        _this.$d_c.find(".detail_role_inner").text(_$e.attr("data-role"));
        _this.$d_c.find(".detail_description").html(_$e.attr("data-description"));
        _this.$d_c.find(".detail_video").empty();
        _canvas = _this.$d_c.find(".detail_pic").get(0);
        _canvas.width = _this.$d_c.find(".detail_pic").width();
        _canvas.height = _this.$d_c.find(".detail_pic").height();
        _canvas.getContext("2d").clearRect(0, 0, _canvas.width, _canvas.height);
        if (_$e.attr("data-video-type") === "youtube") {
          _src = "https://www.youtube.com/embed/" + ((_$e.attr("data-video-id")) + "?rel=0");
        } else if (_$e.attr("data-video-type") === "vimeo") {
          _src = "https://player.vimeo.com/video/" + ("" + (_$e.attr("data-video-id")));
        }
        if (_$e.attr("data-video-type") !== "") {
          _this.$d_c.find(".detail_video").append($("<iframe>").attr({
            width: 580,
            height: 326,
            src: _src,
            frameborder: 0,
            allowfullscreen: "true"
          }));
        }
        _this.$d_c.find(".detail_link a").attr({
          href: _$e.attr("data-link")
        });
        return _this.setDetailPosition("works_detail");
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
    this.$d_c_c.find(".detail_container_close").on("click", (function(_this) {
      return function() {
        return _this.$d_c_c.hide();
      };
    })(this));
    this.$footer_about.on("click", (function(_this) {
      return function() {
        _this.$d_c_c_i.filter("[data-type=\"works_detail\"]").hide();
        _this.$d_c_c_i.filter("[data-type=\"about\"]").show();
        _this.$d_c_c.show();
        return _this.setDetailPosition("about");
      };
    })(this));
    this.$body.on("mousedown", (function(_this) {
      return function(e) {
        var _content_scroll_height, _from_client_y, _from_scroll_top, _scrollBar_whole_height, _type_short;
        if ($(e.target).hasClass("scrollBar_inner")) {
          _type = $(e.target).parent().attr("data-type");
          _type_short = _type[0];
          _from_client_y = e.clientY;
          _from_scroll_top = _this["$" + _type_short + "_c_c_i"].scrollTop();
          _scrollBar_whole_height = $(e.target).parent().height();
          _content_scroll_height = _this["$" + _type_short + "_c_c_i"].get(0).scrollHeight;
          _this.$body.on("mousemove", function(e) {
            return _this["$" + _type_short + "_c_c_i"].prop({
              scrollTop: (e.clientY - _from_client_y) * _content_scroll_height / _scrollBar_whole_height + _from_scroll_top
            });
          });
          return _this.$body.one("mouseup", function() {
            return _this.$body.off("mousemove");
          });
        }
      };
    })(this));
    if (!$.browser.desktop) {
      $("body").addClass("is-sp");
    }
    _loaded_count = 0;
    fn1 = (function(_this) {
      return function(i) {
        var _img, _imgloaded_func;
        _imgloaded_func = function() {
          var _canvas, _ctx;
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
          _loaded_count += 1;
          if (_loaded_count === _this.$thumb.size()) {
            _this.$t_c_c_i.prop({
              scrollTop: _this.$t_c_c_i.get(0).scrollHeight
            });
            _this.$scrollBar.find(".scrollBar_inner").css({
              opacity: 0
            });
            return _this.slitAnim("in", function() {
              _this.$t_c_c_i.animate({
                scrollTop: 0
              }, 1000);
              return setTimeout(function() {
                return _this.$scrollBar.find(".scrollBar_inner").css({
                  opacity: 1
                });
              }, 10);
            });
          }
        };
        _img = new Image();
        if (_img.width > 0) {
          _imgloaded_func();
        } else {
          _img.onload = function() {
            return _imgloaded_func();
          };
        }
        return _img.src = "img/" + _this.$thumb.eq(i).find(".thumb_pic").attr("data-type") + "-thumb/" + _this.$thumb.eq(i).find(".thumb_pic").attr("data-name") + ".jpg";
      };
    })(this);
    for (i = k = 0, ref1 = this.$thumb.size(); 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
      fn1(i);
    }
    this.setDetailPosition("about");
    if ($.browser.iphone || $.browser.ipod || $.browser.ipad) {
      return document.querySelector('meta[name="viewport"]').setAttribute("content", ("width=" + VIEWPORT + ", minimum-scale=0.25, ") + "maximum-scale=1.6, user-scalable=no");
    } else if ($.browser.android) {
      return window.onload = (function(_this) {
        return function() {
          return _this.$body.css({
            zoom: window.innerWidth / VIEWPORT
          });
        };
      })(this);
    }
  };

  return Main;

})();

new Main();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3RhamltYS1zaGluZ28vV29ya3MvcG9ydGZvbGlvL19idWlsZC9zcmMvY29mZmVlL3BjL3NjcmlwdC5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvdGFqaW1hLXNoaW5nby9Xb3Jrcy9wb3J0Zm9saW8vX2J1aWxkL3NyYy9jb2ZmZWUvcGMvc2NyaXB0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBOztBQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsd0JBQVIsQ0FBQSxDQUFBOztBQUVUO0VBQ1csY0FBQTtJQUNULElBQUMsQ0FBQSxJQUFELEdBQVEsQ0FBQSxDQUFFLE1BQUY7SUFDUixJQUFDLENBQUEsS0FBRCxHQUFTLENBQUEsQ0FBRSxNQUFGO0lBRVQsSUFBQyxDQUFBLFdBQUQsR0FBZSxDQUFBLENBQUUsYUFBRjtJQUNmLElBQUMsQ0FBQSxVQUFELEdBQWMsQ0FBQSxDQUFFLFlBQUY7SUFHZCxJQUFDLENBQUEsUUFBRCxHQUFZLENBQUEsQ0FBRSxrQkFBRixDQUFxQixDQUFDLE1BQXRCLENBQTZCLHVCQUE3QixDQUFxRCxDQUNyRCxJQURBLENBQ0ssd0JBREw7SUFFWixJQUFDLENBQUEsTUFBRCxHQUFVLENBQUEsQ0FBRSxRQUFGO0lBQ1YsSUFBQyxDQUFBLElBQUQsR0FBUSxDQUFBLENBQUUsWUFBRixDQUFlLENBQUMsTUFBaEIsQ0FBdUIsdUJBQXZCO0lBQ1IsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxrQkFBWDtJQUdWLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBQSxDQUFFLGtCQUFGLENBQXFCLENBQUMsTUFBdEIsQ0FBNkIsd0JBQTdCO0lBQ1YsSUFBQyxDQUFBLFFBQUQsR0FBWSxDQUFBLENBQUUsa0JBQUYsQ0FBcUIsQ0FBQyxNQUF0QixDQUE2Qix3QkFBN0IsQ0FBc0QsQ0FDdEQsSUFEQSxDQUNLLHdCQURMO0lBRVosSUFBQyxDQUFB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

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3RhamltYS1zaGluZ28vV29ya3MvcG9ydGZvbGlvL19idWlsZC9zcmMvY29mZmVlL21vZHVsZS9odG1sVG9DYW52YXMuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3RhamltYS1zaGluZ28vV29ya3MvcG9ydGZvbGlvL19idWlsZC9zcmMvY29mZmVlL21vZHVsZS9odG1sVG9DYW52YXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUE7O0FBQUEsUUFBQSxHQUFXOztBQUVMOzs7eUJBQ0YsSUFBQSxHQUFNLFNBQUMsSUFBRDtBQUNGLFFBQUE7SUFBQSxLQUFBLEdBQVEsSUFBSSxDQUFDLEtBQUwsQ0FBQTtJQUVSLFFBQUEsR0FBVyxDQUFFLGFBQUYsRUFBaUIsV0FBakIsRUFBOEIsYUFBOUIsRUFBNkMsWUFBN0MsRUFDRSxPQURGLEVBQ1ksZ0JBRFosRUFDOEIsaUJBRDlCLEVBRUUsZ0JBRkYsRUFFb0IsY0FGcEIsRUFFb0MsYUFGcEMsRUFHRSxZQUhGLEVBR2dCLGdCQUhoQixFQUdrQyxXQUhsQyxFQUlFLGtCQUpGLEVBSXNCLGtCQUp0QixFQUtFLG1CQUxGLEVBS3NCLHFCQUx0QixFQU1FLHVCQU5GLEVBTTJCLFNBTjNCLEVBT0UsT0FQRixFQU9XLFFBUFgsRUFPcUIsS0FQckIsRUFPNEIsT0FQNUIsRUFPcUMsUUFQckMsRUFRRSxNQVJGLEVBUVUsWUFSVixFQVF3QixjQVJ4QixFQVF3QyxlQVJ4QyxFQVNFLGFBVEYsRUFTaUIsYUFUakIsRUFTZ0MsZUFUaEMsRUFVRSxnQkFWRixFQVVvQixjQVZwQixFQVdFLGtCQVhGLEVBV3NCLG9CQVh0QixFQVlFLHFCQVpGLEVBWXdCLG1CQVp4QixFQWFFLGtCQWJGLEVBYXNCLG9CQWJ0QixFQWNFLHFCQWRGLEVBY3lCLG1CQWR6QixFQWVFLGtCQWZGLEVBZXFCLG9CQWZyQixFQWdCRSxxQkFoQkYsRUFnQnlCLG1CQWhCekIsRUFpQkUsVUFqQkYsRUFp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

},{}]},{},[1]);
