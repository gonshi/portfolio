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

    setScrollBarHeight: ->
        _type = ["t", "d"]

        for i in [0..._type.length]
            _t = _type[i]

            do (_t) =>
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

        @setScrollBarHeight()

        if is_debug?
            $(".contents_column_inner[data-type=\"works_detail\"]").hide()

new Main()
