htmlToCanvas = require("../module/htmlToCanvas")()

class Main
    constructor: ->
        @$win = $(window)

        @$type_inner = $(".type_inner")

        # thumb
        @$t_c_c_i = $(".contents_column").filter("[data-type=\"thumb\"]").
                    find(".contents_column_inner")
        @$thumb = $(".thumb")
        @$t_s = $(".thumb_scrollBar")
        @$t_s_i = $(".thumb_scrollBar_inner")

        # detail
        @$d_c_c_i = $(".contents_column").filter("[data-type=\"detail\"]").
                    find(".contents_column_inner")
        @$d_c = $(".detail_container")
        @$d_s = $(".detail_scrollBar")
        @$d_s_i = $(".detail_scrollBar_inner")

        window.is_debug = true if location.href.match "localhost"

        @exec()

    slitAnim: (vec, cb) ->
        @$t_s.hide() # canvas内にスクロールバーが映らないようにする
        @$thumb.css opacity: 1
        @$thumb_container = $(".thumb_container")

        _clone_canvas = htmlToCanvas.exec @$thumb_container

        _canvas = document.createElement "canvas"
        _ctx = _canvas.getContext "2d"
        _canvas.width = _clone_canvas.width * 1.5
        _canvas.height = _clone_canvas.height
        _canvas.style.width = "#{_clone_canvas.width * 1.5 / 2}px"
        _canvas.style.height = "#{_clone_canvas.height / 2}px"

        if vec == "in"
            _canvas.style.left = @$thumb_container.get(0).
                                 getBoundingClientRect().left + "px"
        else # out
            _left_margin = @$thumb_container.get(0).
                           getBoundingClientRect().left * 2 # retina対応
            _canvas.style.left = "0px"

        @$t_c_c_i.append _canvas

        _slit_height = Math.floor(Math.random() * 3) + 4
        _slit_num = Math.ceil(_clone_canvas.height / _slit_height)
        _dur = 800
        _time_gap = []
        _time_gap_range = 300

        if vec == "in"
            for i in [0..._slit_num]
                _time_gap[i] =
                    Math.random() * _time_gap_range * 2 - _time_gap_range
        else # out
            for i in [0..._slit_num]
                _time_gap[i] = Math.random() * _time_gap_range * -2

        _scroll_top = @$t_c_c_i.scrollTop()
        _win_slit_height = @$win.height()
        _offset_top = _canvas.offsetTop

        createjs.Ticker.addEventListener "tick", (e) ->
            _ctx.clearRect(
                0, 0, _canvas.width, _canvas.height
            )

            for i in [0..._slit_num]
                if(_slit_height / 2 * (i + 1) + _offset_top < _scroll_top ||
                _slit_height / 2 * i + _offset_top >
                _scroll_top + _win_slit_height)
                    continue # 見えている領域以外は描画しない

                if e.runTime + _time_gap[i] < 0
                    _t = 0
                else if e.runTime + _time_gap[i] > _dur
                    _t = 1
                else
                    _t =
                        createjs.Ease.quartOut(
                            (e.runTime + _time_gap[i]) / _dur
                        )


                if vec == "in"
                    _left = _canvas.width - _t * _canvas.width
                else # out
                    _left = -_t * _canvas.width + _left_margin

                _ctx.drawImage(
                    _clone_canvas,
                    0, _slit_height * i,
                    _clone_canvas.width, _slit_height,
                    _left, _slit_height * i,
                    _clone_canvas.width, _slit_height
                )

        setTimeout =>
            createjs.Ticker.reset()
            @$thumb.css opacity: 1
            @$t_c_c_i.find("canvas").remove()
            @setScrollBarHeight()
            cb() if cb?
        , _time_gap_range + _dur

        @$thumb.css opacity: 0 # 本来のDOMはアニメーションの間見せない

    setScrollBarHeight: ->
        _type = ["t", "d"]

        for i in [0..._type.length]
            _t = _type[i]

            do (_t) =>
                @["$#{_t}_s"].show()
                @["$#{_t}_s_i"].height(
                    @["$#{_t}_c_c_i"].height() /
                    @["$#{_t}_c_c_i"].get(0).scrollHeight *
                    @["$#{_t}_s"].height()
                )

                @["#{_t}_s_rest_height"] =
                    @["$#{_t}_s"].height() - @["$#{_t}_s_i"].height()

    exec: ->
        ######################
        # EVENT LISTENER
        ######################

        @$win.on "resize", $.debounce(500, => @setScrollBarHeight())

        @$type_inner.on "click", (e) =>
            return if $(e.currentTarget).hasClass "is-prevent"
            @$type_inner.addClass "is-prevent"

            @slitAnim "out"

            @$thumb.hide()
            @$thumb.filter(
                "[data-type=\"#{$(e.currentTarget).attr "data-type"}\"]"
            ).show()

            @slitAnim "in", => @$type_inner.removeClass "is-prevent"

            @$type_inner.removeClass "not-selected"
            @$type_inner.not(
                "[data-type=\"#{$(e.currentTarget).attr "data-type"}\"]"
            ).addClass "not-selected"

        @$thumb.on "click", (e) =>
            @$d_c_c_i.filter("[data-type=\"about\"]").hide()
            @$d_c_c_i.filter("[data-type=\"works_detail\"]").show()

            _$e = $(e.currentTarget)

            _img = new Image()
            _img.src = "img/#{_$e.attr "data-type"}/#{_$e.attr "data-name"}.jpg"
            @$d_c.find(".detail_pic").empty().append _img

            @$d_c.find(".detail_ttl").html _$e.attr "data-ttl"
            @$d_c.find(".detail_role_inner").text _$e.attr "data-role"
            @$d_c.find(".detail_description").html _$e.attr "data-description"
            @$d_c.find(".detail_link a").attr href: _$e.attr "data-link"

            @onload_interval = setInterval =>
                if _img.width > 0
                    @setScrollBarHeight()
                    @$d_s_i.css top: 0
                    clearInterval @onload_interval
            , 100

        # scrollBar
        _type = ["t", "d"]
        for i in [0..._type.length]
            _t = _type[i]

            do (_t) =>
                @["$#{_t}_c_c_i"].on "scroll", $.throttle(20, =>
                    @["$#{_t}_s_i"].css(
                        top: @["#{_t}_s_rest_height"] *
                             @["$#{_t}_c_c_i"].scrollTop() /
                             (@["$#{_t}_c_c_i"].get(0).scrollHeight -
                             @["$#{_t}_c_c_i"].height())
                    )
                )

        ######################
        # INIT
        ######################

        # サムネイルをbase64化
        _loaded_count = 0
        for i in [0...@$thumb.size()]
            do (i) =>
                _img = new Image()
                _interval = setInterval =>
                    if _img.width > 0
                        _canvas = document.createElement "canvas"
                        _ctx = _canvas.getContext "2d"
                        _canvas.width = _img.width
                        _canvas.height = _img.height
                        _ctx.drawImage _img, 0, 0
                        @$thumb.eq(i).find(".thumb_pic").css
                            width: _img.width
                            height: _img.height
                            backgroundImage: "url(#{_canvas.toDataURL()})"
                        clearInterval _interval

                        _loaded_count += 1
                        @slitAnim "in" if _loaded_count == @$thumb.size()
                , 100

                _img.src =
                    "img/" +
                    @$thumb.eq(i).find(".thumb_pic").attr("data-type") +
                    "-thumb/" +
                    @$thumb.eq(i).find(".thumb_pic").attr("data-name") +
                    ".jpg"

new Main()
