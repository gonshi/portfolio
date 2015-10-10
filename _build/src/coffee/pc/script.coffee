class Main
    constructor: ->
        @$win = $(window)

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

    htmlToCanvas: ($dom) ->
        _$dom = $dom.clone()

        _cssAttr = [ "font-family", "font-size", "font-weight", "font-style",
                     "color",  "text-transform", "text-decoration",
                     "letter-spacing", "word-spacing", "line-height",
                     "text-align", "vertical-align", "direction",
                     "background-color", "background-image",
                     "background-repeat","background-position",
                     "background-attachment", "opacity",
                     "width", "height", "top", "right", "bottom",
                     "left", "margin-top", "margin-right", "margin-bottom",
                     "margin-left", "padding-top", "padding-right",
                     "padding-bottom", "padding-left",
                     "border-top-width", "border-right-width",
                     "border-bottom-width","border-left-width",
                     "border-top-color", "border-right-color",
                     "border-bottom-color", "border-left-color",
                     "border-top-style","border-right-style",
                     "border-bottom-style", "border-left-style",
                     "position", "display", "visibility",
                     "z-index", "overflow-x","overflow-y", "white-space",
                     "clip", "float", "clear", "cursor",
                     "list-style-image", "list-style-position",
                     "list-style-type", "marker-offset" ]

        ### 対象DOM自体のcss
        _cssTxt = ""
        for j in [0..._cssAttr.length]
            _cssTxt += "#{_cssAttr[j]}: #{$.fn.css.call($dom, _cssAttr[j])}; "
        _$dom.attr style: _cssTxt
        ###

        $dom.find("*").each (i) ->
            _cssTxt = ""
            for j in [0..._cssAttr.length]
                _cssTxt +=
                    "#{_cssAttr[j]}: #{$.fn.css.call($(this), _cssAttr[j])}; "
            _$dom.find("*").eq(i).attr style: _cssTxt

        _canvas = document.createElement "canvas"
        _canvas.width = $dom.width() * 2
        _canvas.height = $dom.height() * 2
        _ctx = _canvas.getContext "2d"
        _data = "<svg xmlns='http://www.w3.org/2000/svg' " +
                "width='#{$dom.width()}' " +
                "height='#{$dom.height()}'>" +
                    "<foreignObject width='100%' height='100%'>" +
                        "<div xmlns='http://www.w3.org/1999/xhtml'>" +
                            _$dom.get(0).outerHTML.
                            replace(/data-(.*?)"\ |data-(.*?)">/g, "").
                            replace(/<br(.*?)>/g, "<br$1\/>").
                            replace(/<img(.*?)>/g, "<img$1\/>") +
                        "</div>" +
                    "</foreignObject>" +
                "</svg>"

        _DOMURL = self.URL || self.webkitURL || self
        _img = new Image()
        _svg = new Blob([_data], type: "image/svg+xml")
        _url = _DOMURL.createObjectURL _svg

        _img.onload = ->
            # retina対応
            _ctx.drawImage _img, 0, 0, _img.width * 2, _img.height * 2
            _canvas.style.width = "#{_img.width}px"
            _canvas.style.height = "#{_img.height}px"
            _DOMURL.revokeObjectURL _url
        _img.src = _url

        return _canvas

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

        #@setScrollBarHeight()
        @$t_s.hide()

        @$thumb_container = $(".thumb_container")
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
                        if _loaded_count == @$thumb.size()
                            _clone_canvas = @htmlToCanvas @$thumb_container

                            _canvas = document.createElement "canvas"
                            _ctx = _canvas.getContext "2d"
                            _canvas.width = _clone_canvas.width * 1.5
                            _canvas.height = _clone_canvas.height
                            _canvas.style.width =
                                "#{_clone_canvas.width * 1.5 / 2}px"
                            _canvas.style.height =
                                "#{_clone_canvas.height / 2}px"
                            _canvas.style.left =
                                @$thumb_container.get(0).
                                getBoundingClientRect().left + "px"
                            @$t_c_c_i.append _canvas

                            _height = Math.floor(Math.random() * 3) + 2
                            _block_num =
                                Math.ceil(_clone_canvas.height / _height)
                            _gap = []
                            _ease = []

                            for i in [0..._block_num]
                                _gap[i] = Math.random() * 1000 - 500

                            _interval = setInterval =>
                                _scroll_top = @$win.scrollTop()
                                _win_height = @$win.height()
                                _offset_top = _canvas.offsetTop

                                createjs.Ticker.addEventListener "tick", (e) ->
                                    _ctx.clearRect(
                                        0, 0, _canvas.width, _canvas.height
                                    )

                                    for i in [0..._block_num]
                                        # 見えている領域以外は描画しない
                                        if(_height / 2 * (i + 1) + _offset_top <
                                        _scroll_top ||
                                        _height / 2 * i + _offset_top >
                                        _scroll_top + _win_height)
                                            continue

                                        if e.runTime + _gap[i] < 0
                                            _t = 0
                                        else if e.runTime + _gap[i] > 800
                                            _t = 1
                                        else
                                            _t =
                                                createjs.Ease.quartOut(
                                                    (e.runTime + _gap[i]) / 800
                                                )

                                        _ctx.drawImage(
                                            _clone_canvas,
                                            0, _height * i,
                                            _clone_canvas.width, _height,
                                            _canvas.width - _t * _canvas.width,
                                            _height * i,
                                            _clone_canvas.width, _height
                                        )

                                setTimeout =>
                                    createjs.Ticker.reset()
                                    @$thumb.css opacity: 1
                                    @$t_c_c_i.find("canvas").remove()
                                    @setScrollBarHeight()
                                , 1300

                                clearInterval _interval
                            , 100
                            @$thumb.css opacity: 0
                            @$t_c_c_i.css zIndex: 1
                , 100

                _img.src =
                    "img/" +
                    @$thumb.eq(i).find(".thumb_pic").attr("data-type") +
                    "-thumb/" +
                    @$thumb.eq(i).find(".thumb_pic").attr("data-name") +
                    ".jpg"

new Main()
