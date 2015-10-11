htmlToCanvas = require("../module/htmlToCanvas")()

class Main
    constructor: ->
        @$win = $(window)
        @$body = $("body")

        @$type_inner = $(".type_inner")
        @$scrollBar = $(".scrollBar")

        # thumb
        @$t_c_c_i = $(".contents_column").filter("[data-type=\"thumb\"]").
                    find(".contents_column_inner")
        @$thumb = $(".thumb")
        @$t_s = $(".scrollBar").filter("[data-type=\"thumb\"]")
        @$t_s_i = @$t_s.find(".scrollBar_inner")

        # detail
        @$d_c_c_i = $(".contents_column").filter("[data-type=\"detail\"]").
                    find(".contents_column_inner")
        @$d_c = $(".detail_container")
        @$d_s = $(".scrollBar").filter("[data-type=\"detail\"]")
        @$d_s_i = @$d_s.find(".scrollBar_inner")

        @$footer_about = $(".footer_about")

        window.is_debug = true if location.href.match "localhost"

        @exec()

    mosaicAnim: (canvas, img, cb) ->
        createjs.Ticker.reset()
        clearTimeout @mosaic_timeout if @mosaic_timeout?

        canvas.width = img.width
        canvas.height = img.height
        canvas_ctx = canvas.getContext "2d"

        _img_canvas = document.createElement "canvas"
        _img_canvas.width = img.width
        _img_canvas.height = img.height
        _img_ctx = _img_canvas.getContext "2d"
        _img_ctx.drawImage img, 0, 0, img.width, img.height
        _img_data = _img_ctx.getImageData(0, 0, img.width, img.height).data

        _mosaic_canvas = document.createElement "canvas"
        _mosaic_canvas.width = img.width
        _mosaic_canvas.height = img.height
        _mosaic_ctx = _mosaic_canvas.getContext "2d"
        _mosaic_width = 20
        _mosaic_horizon_num = Math.ceil(img.width / _mosaic_width)
        _mosaic_height = 20
        _mosaic_vertical_num = Math.ceil(img.height / _mosaic_height)

        # モザイク画像の生成
        for x in [0..._mosaic_horizon_num]
            for y in [0..._mosaic_vertical_num]
                _pixel_i = ((x + 0.5) * _mosaic_width +
                           img.width * ((y + 0.5) * _mosaic_height)) * 4

                _mosaic_ctx.fillStyle = "rgba(#{_img_data[_pixel_i]}, " +
                                         "#{_img_data[_pixel_i + 1]}, " +
                                         "#{_img_data[_pixel_i + 2]}, " +
                                         "#{_img_data[_pixel_i + 3]})"

                _mosaic_ctx.fillRect(
                    x * _mosaic_width, y * _mosaic_height,
                    _mosaic_width, _mosaic_height
                )

        _dur = 500
        createjs.Ticker.addEventListener "tick", (e) ->
            canvas_ctx.clearRect 0, 0, img.width, img.height

            if e.runTime < _dur
                _t = createjs.Ease.quartOut e.runTime / _dur
                canvas_ctx.drawImage(
                    _mosaic_canvas, 0, 0,
                    _mosaic_canvas.width, _t * _mosaic_canvas.height,
                    0, 0, canvas.width, _t * canvas.height
                )
            else
                canvas_ctx.drawImage _mosaic_canvas, 0, 0

            if e.runTime > _dur * 0.6
                if e.runTime < _dur * 1.6
                    _t = createjs.Ease.quartOut (e.runTime - _dur * 0.6) / _dur
                    canvas_ctx.drawImage(
                        _img_canvas, 0, 0,
                        _img_canvas.width, _t * _img_canvas.height,
                        0, 0, canvas.width, _t * canvas.height
                    )
                else
                    canvas_ctx.drawImage _img_canvas, 0, 0

        @mosaic_timeout = setTimeout ->
            canvas_ctx.globalCompositeOperation = "source-over"
            canvas_ctx.drawImage _img_canvas, 0, 0
            createjs.Ticker.reset()
            cb() if cb?
        , _dur * 1.6

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

        if @not_first_slit_anim?
            if vec == "out"
                setTimeout ( => @$thumb.css opacity: 0), 50
            else
                @$thumb.css opacity: 0
        else
            @not_first_slit_anim = true
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

    setDetailPosition: (type) ->
        _$d_c =
            @$d_c_c_i.filter("[data-type=\"#{type}\"]").
            find(".detail_container")

        _$d_c.removeAttr "style"
        if(_$d_c.height() +
        parseInt(_$d_c.css "marginTop") * 2 < @$win.height())
            _$d_c.css
                position: "absolute"
                top: 0
                right: 0
                bottom: 0
                left: 0
                height: _$d_c.height()
                margin: "auto"

    exec: ->
        ######################
        # EVENT LISTENER
        ######################

        @$win.on "resize", $.debounce(500, => @setScrollBarHeight())

        @$type_inner.on "click", (e) =>
            return if $(e.currentTarget).hasClass "is-prevent"
            @$type_inner.addClass "is-prevent"

            @slitAnim "out"

            setTimeout => # wait svg load
                @$thumb.hide()
                @$thumb.filter(
                    "[data-type=\"#{$(e.currentTarget).attr "data-type"}\"]"
                ).show()

                @slitAnim "in", => @$type_inner.removeClass "is-prevent"
            , 50

            @$type_inner.removeClass "not-selected"
            @$type_inner.not(
                "[data-type=\"#{$(e.currentTarget).attr "data-type"}\"]"
            ).addClass "not-selected"

        @$thumb.on "click", (e) =>
            @$d_c_c_i.filter("[data-type=\"about\"]").hide()
            @$d_c_c_i.filter("[data-type=\"works_detail\"]").show()

            _$e = $(e.currentTarget)

            _imgloaded_func = =>
                @mosaicAnim(
                    @$d_c.find(".detail_pic").get(0), _img,
                    =>
                        @$d_c.find(".detail_info").css opacity: 1
                        @setScrollBarHeight()
                        @$d_s_i.css top: 0
                )

            _img = new Image()
            if _img.width > 0
                _imgloaded_func()
            else
                _img.onload = -> _imgloaded_func()
            _img.src = "img/#{_$e.attr "data-type"}/#{_$e.attr "data-name"}.jpg"

            @$d_c.find(".detail_info").css opacity: 0
            @$d_c.find(".detail_ttl").html _$e.attr "data-ttl"
            @$d_c.find(".detail_role_inner").text _$e.attr "data-role"
            @$d_c.find(".detail_description").html _$e.attr "data-description"
            @$d_c.find(".detail_video").empty()

            if _$e.attr("data-video-type") == "youtube"
                _src = "https://www.youtube.com/embed/" +
                       "#{_$e.attr "data-video-id"}?rel=0"
            else if _$e.attr("data-video-type") == "vimeo"
                _src = "https://player.vimeo.com/video/" +
                       "#{_$e.attr "data-video-id"}"

            if _$e.attr("data-video-type") != ""
                @$d_c.find(".detail_video").append(
                    $("<iframe>").attr
                        width: 580
                        height: 326
                        src: _src
                        frameborder: 0
                        allowfullscreen: "true"
                )

            @$d_c.find(".detail_link a").attr href: _$e.attr "data-link"

            @setDetailPosition "works_detail"

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

        @$footer_about.on "click", =>
            @$d_c_c_i.filter("[data-type=\"works_detail\"]").hide()
            @$d_c_c_i.filter("[data-type=\"about\"]").show()
            @setDetailPosition "about"

        @$body.on "mousedown", (e) =>
            if $(e.target).hasClass "scrollBar_inner"
                _type = $(e.target).parent().attr "data-type"
                _type_short = _type[0]

                _from_client_y = e.clientY
                _from_scroll_top = @["$#{_type_short}_c_c_i"].scrollTop()

                _scrollBar_whole_height = $(e.target).parent().height()
                _content_scroll_height =
                    @["$#{_type_short}_c_c_i"].get(0).scrollHeight

                @$body.on "mousemove", (e) =>
                    @["$#{_type_short}_c_c_i"].prop(
                        scrollTop: (e.clientY - _from_client_y) *
                                   _content_scroll_height /
                                   _scrollBar_whole_height +
                                   _from_scroll_top
                    )

                @$body.one "mouseup", => @$body.off "mousemove"

        ######################
        # INIT
        ######################

        # サムネイルをbase64化
        _loaded_count = 0
        for i in [0...@$thumb.size()]
            do (i) =>
                _imgloaded_func = =>
                    _canvas = document.createElement "canvas"
                    _ctx = _canvas.getContext "2d"
                    _canvas.width = _img.width
                    _canvas.height = _img.height
                    _ctx.drawImage _img, 0, 0
                    @$thumb.eq(i).find(".thumb_pic").css
                        width: _img.width
                        height: _img.height
                        backgroundImage: "url(#{_canvas.toDataURL()})"

                    _loaded_count += 1

                    if _loaded_count == @$thumb.size()
                        @$t_c_c_i.prop(
                            scrollTop: @$t_c_c_i.get(0).scrollHeight
                        )
                        @$scrollBar.find(".scrollBar_inner").css opacity: 0

                        @slitAnim("in",
                            =>
                                @$t_c_c_i.animate scrollTop: 0, 1000
                                # スクロールバーが一瞬上部に見えるのを防ぐ
                                setTimeout =>
                                    @$scrollBar.find(".scrollBar_inner").
                                    css opacity: 1
                                , 10
                        )

                _img = new Image()

                if _img.width > 0
                    _imgloaded_func()
                else
                    _img.onload = -> _imgloaded_func()

                _img.src =
                    "img/" +
                    @$thumb.eq(i).find(".thumb_pic").attr("data-type") +
                    "-thumb/" +
                    @$thumb.eq(i).find(".thumb_pic").attr("data-name") +
                    ".jpg"

        @setDetailPosition "about"

new Main()
