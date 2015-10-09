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

  Main.prototype.setScrollBarHeight = function() {
    var _t, _type, i, j, ref, results;
    _type = ["t", "d"];
    results = [];
    for (i = j = 0, ref = _type.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      _t = _type[i];
      results.push((function(_this) {
        return function(_t) {
          _this["$" + _t + "_s_i"].height(_this["$" + _t + "_c_c_i"].height() / _this["$" + _t + "_c_c_i"].get(0).scrollHeight * _this["$" + _t + "_s"].height());
          return _this[_t + "_s_rest_height"] = _this["$" + _t + "_s"].height() - _this["$" + _t + "_s_i"].height();
        };
      })(this)(_t));
    }
    return results;
  };

  Main.prototype.exec = function() {
    var _t, _type, fn, i, j, ref;
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
    for (i = j = 0, ref = _type.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      _t = _type[i];
      fn(_t);
    }
    return this.setScrollBarHeight();
  };

  return Main;

})();

new Main();



},{}]},{},[1]);
