instance = null

class HtmlToCanvas
    exec: ($dom)->
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

getInstance = ->
  if !instance
    instance = new HtmlToCanvas()
  return instance

module.exports = getInstance
