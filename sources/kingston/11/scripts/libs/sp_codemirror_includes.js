/*! RESOURCE: /scripts/libs/sp_codemirror_includes.js */
/*! RESOURCE: /scripts/snc-code-editor/codemirror-bundle.min.js */
! function(e) {
  if ("object" == typeof exports && "object" == typeof module) module.exports = e();
  else {
    if ("function" == typeof define && define.amd) return define([], e);
    this.CodeMirror = e()
  }
}(function() {
  "use strict";

  function e(n, r) {
    if (!(this instanceof e)) return new e(n, r);
    this.options = r = r ? Di(r) : {}, Di(Xo, r, !1), h(r);
    var i = r.value;
    "string" == typeof i && (i = new yl(i, r.mode, null, r.lineSeparator)), this.doc = i;
    var o = new e.inputStyles[r.inputStyle](this),
      l = this.display = new t(n, i, o);
    l.wrapper.CodeMirror = this, c(this), s(this), r.lineWrapping && (this.display.wrapper.className += " CodeMirror-wrap"), r.autofocus && !Lo && l.input.focus(), v(this), this.state = {
      keyMaps: [],
      overlays: [],
      modeGen: 0,
      overwrite: !1,
      delayingBlurEvent: !1,
      focused: !1,
      suppressEdits: !1,
      pasteIncoming: !1,
      cutIncoming: !1,
      draggingText: !1,
      highlight: new Ti,
      keySeq: null,
      specialChars: null
    };
    var a = this;
    po && 11 > go && setTimeout(function() {
      a.display.input.reset(!0)
    }, 20), jt(this), Ki(), bt(this), this.curOp.forceUpdate = !0, _r(this, i), r.autofocus && !Lo || a.hasFocus() ? setTimeout(Ei(pn, this), 20) : gn(this);
    for (var u in Yo) Yo.hasOwnProperty(u) && Yo[u](this, r[u], $o);
    w(this), r.finishInit && r.finishInit(this);
    for (var f = 0; f < el.length; ++f) el[f](this);
    Ct(this), mo && r.lineWrapping && "optimizelegibility" == getComputedStyle(l.lineDiv).textRendering && (l.lineDiv.style.textRendering = "auto")
  }

  function t(e, t, n) {
    var r = this;
    this.input = n, r.scrollbarFiller = Ri("div", null, "CodeMirror-scrollbar-filler"), r.scrollbarFiller.setAttribute("cm-not-content", "true"), r.gutterFiller = Ri("div", null, "CodeMirror-gutter-filler"), r.gutterFiller.setAttribute("cm-not-content", "true"), r.lineDiv = Ri("div", null, "CodeMirror-code"), r.selectionDiv = Ri("div", null, null, "position: relative; z-index: 1"), r.cursorDiv = Ri("div", null, "CodeMirror-cursors"), r.measure = Ri("div", null, "CodeMirror-measure"), r.lineMeasure = Ri("div", null, "CodeMirror-measure"), r.lineSpace = Ri("div", [r.measure, r.lineMeasure, r.selectionDiv, r.cursorDiv, r.lineDiv], null, "position: relative; outline: none"), r.mover = Ri("div", [Ri("div", [r.lineSpace], "CodeMirror-lines")], null, "position: relative"), r.sizer = Ri("div", [r.mover], "CodeMirror-sizer"), r.sizerWidth = null, r.heightForcer = Ri("div", null, null, "position: absolute; height: " + Al + "px; width: 1px;"), r.gutters = Ri("div", null, "CodeMirror-gutters"), r.lineGutter = null, r.scroller = Ri("div", [r.sizer, r.heightForcer, r.gutters], "CodeMirror-scroll"), r.scroller.setAttribute("tabIndex", "-1"), r.wrapper = Ri("div", [r.scrollbarFiller, r.gutterFiller, r.scroller], "CodeMirror"), po && 8 > go && (r.gutters.style.zIndex = -1, r.scroller.style.paddingRight = 0), mo || uo && Lo || (r.scroller.draggable = !0), e && (e.appendChild ? e.appendChild(r.wrapper) : e(r.wrapper)), r.viewFrom = r.viewTo = t.first, r.reportedViewFrom = r.reportedViewTo = t.first, r.view = [], r.renderedView = null, r.externalMeasured = null, r.viewOffset = 0, r.lastWrapHeight = r.lastWrapWidth = 0, r.updateLineNumbers = null, r.nativeBarWidth = r.barHeight = r.barWidth = 0, r.scrollbarsClipped = !1, r.lineNumWidth = r.lineNumInnerWidth = r.lineNumChars = null, r.alignWidgets = !1, r.cachedCharWidth = r.cachedTextHeight = r.cachedPaddingH = null, r.maxLine = null, r.maxLineLength = 0, r.maxLineChanged = !1, r.wheelDX = r.wheelDY = r.wheelStartX = r.wheelStartY = null, r.shift = !1, r.selForContextMenu = null, r.activeTouch = null, n.init(r)
  }

  function n(t) {
    t.doc.mode = e.getMode(t.options, t.doc.modeOption), r(t)
  }

  function r(e) {
    e.doc.iter(function(e) {
      e.stateAfter && (e.stateAfter = null), e.styles && (e.styles = null)
    }), e.doc.frontier = e.doc.first, ze(e, 100), e.state.modeGen++, e.curOp && Dt(e)
  }

  function i(e) {
    e.options.lineWrapping ? (Ul(e.display.wrapper, "CodeMirror-wrap"), e.display.sizer.style.minWidth = "", e.display.sizerWidth = null) : (ql(e.display.wrapper, "CodeMirror-wrap"), d(e)), l(e), Dt(e), lt(e), setTimeout(function() {
      y(e)
    }, 100)
  }

  function o(e) {
    var t = vt(e.display),
      n = e.options.lineWrapping,
      r = n && Math.max(5, e.display.scroller.clientWidth / yt(e.display) - 3);
    return function(i) {
      if (br(e.doc, i)) return 0;
      var o = 0;
      if (i.widgets)
        for (var l = 0; l < i.widgets.length; l++) i.widgets[l].height && (o += i.widgets[l].height);
      return n ? o + (Math.ceil(i.text.length / r) || 1) * t : o + t
    }
  }

  function l(e) {
    var t = e.doc,
      n = o(e);
    t.iter(function(e) {
      var t = n(e);
      t != e.height && Qr(e, t)
    })
  }

  function s(e) {
    e.display.wrapper.className = e.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + e.options.theme.replace(/(^|\s)\s*/g, " cm-s-"), lt(e)
  }

  function a(e) {
    c(e), Dt(e), setTimeout(function() {
      C(e)
    }, 20)
  }

  function c(e) {
    var t = e.display.gutters,
      n = e.options.gutters;
    Bi(t);
    for (var r = 0; r < n.length; ++r) {
      var i = n[r],
        o = t.appendChild(Ri("div", null, "CodeMirror-gutter " + i));
      "CodeMirror-linenumbers" == i && (e.display.lineGutter = o, o.style.width = (e.display.lineNumWidth || 1) + "px")
    }
    t.style.display = r ? "" : "none", u(e)
  }

  function u(e) {
    var t = e.display.gutters.offsetWidth;
    e.display.sizer.style.marginLeft = t + "px"
  }

  function f(e) {
    if (0 == e.height) return 0;
    for (var t, n = e.text.length, r = e; t = dr(r);) {
      var i = t.find(0, !0);
      r = i.from.line, n += i.from.ch - i.to.ch
    }
    for (r = e; t = hr(r);) {
      var i = t.find(0, !0);
      n -= r.text.length - i.from.ch, r = i.to.line, n += r.text.length - i.to.ch
    }
    return n
  }

  function d(e) {
    var t = e.display,
      n = e.doc;
    t.maxLine = Xr(n, n.first), t.maxLineLength = f(t.maxLine), t.maxLineChanged = !0, n.iter(function(e) {
      var n = f(e);
      n > t.maxLineLength && (t.maxLineLength = n, t.maxLine = e)
    })
  }

  function h(e) {
    var t = Ni(e.gutters, "CodeMirror-linenumbers"); - 1 == t && e.lineNumbers ? e.gutters = e.gutters.concat(["CodeMirror-linenumbers"]) : t > -1 && !e.lineNumbers && (e.gutters = e.gutters.slice(0), e.gutters.splice(t, 1))
  }

  function p(e) {
    var t = e.display,
      n = t.gutters.offsetWidth,
      r = Math.round(e.doc.height + qe(e.display));
    return {
      clientHeight: t.scroller.clientHeight,
      viewHeight: t.wrapper.clientHeight,
      scrollWidth: t.scroller.scrollWidth,
      clientWidth: t.scroller.clientWidth,
      viewWidth: t.wrapper.clientWidth,
      barLeft: e.options.fixedGutter ? n : 0,
      docHeight: r,
      scrollHeight: r + Ve(e) + t.barHeight,
      nativeBarWidth: t.nativeBarWidth,
      gutterWidth: n
    }
  }

  function g(e, t, n) {
    this.cm = n;
    var r = this.vert = Ri("div", [Ri("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar"),
      i = this.horiz = Ri("div", [Ri("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
    e(r), e(i), Ll(r, "scroll", function() {
      r.clientHeight && t(r.scrollTop, "vertical")
    }), Ll(i, "scroll", function() {
      i.clientWidth && t(i.scrollLeft, "horizontal")
    }), this.checkedOverlay = !1, po && 8 > go && (this.horiz.style.minHeight = this.vert.style.minWidth = "18px")
  }

  function m() {}

  function v(t) {
    t.display.scrollbars && (t.display.scrollbars.clear(), t.display.scrollbars.addClass && ql(t.display.wrapper, t.display.scrollbars.addClass)), t.display.scrollbars = new e.scrollbarModel[t.options.scrollbarStyle](function(e) {
      t.display.wrapper.insertBefore(e, t.display.scrollbarFiller), Ll(e, "mousedown", function() {
        t.state.focused && setTimeout(function() {
          t.display.input.focus()
        }, 0)
      }), e.setAttribute("cm-not-content", "true")
    }, function(e, n) {
      "horizontal" == n ? tn(t, e) : en(t, e)
    }, t), t.display.scrollbars.addClass && Ul(t.display.wrapper, t.display.scrollbars.addClass)
  }

  function y(e, t) {
    t || (t = p(e));
    var n = e.display.barWidth,
      r = e.display.barHeight;
    b(e, t);
    for (var i = 0; 4 > i && n != e.display.barWidth || r != e.display.barHeight; i++) n != e.display.barWidth && e.options.lineWrapping && H(e), b(e, p(e)), n = e.display.barWidth, r = e.display.barHeight
  }

  function b(e, t) {
    var n = e.display,
      r = n.scrollbars.update(t);
    n.sizer.style.paddingRight = (n.barWidth = r.right) + "px", n.sizer.style.paddingBottom = (n.barHeight = r.bottom) + "px", r.right && r.bottom ? (n.scrollbarFiller.style.display = "block", n.scrollbarFiller.style.height = r.bottom + "px", n.scrollbarFiller.style.width = r.right + "px") : n.scrollbarFiller.style.display = "", r.bottom && e.options.coverGutterNextToScrollbar && e.options.fixedGutter ? (n.gutterFiller.style.display = "block", n.gutterFiller.style.height = r.bottom + "px", n.gutterFiller.style.width = t.gutterWidth + "px") : n.gutterFiller.style.display = ""
  }

  function x(e, t, n) {
    var r = n && null != n.top ? Math.max(0, n.top) : e.scroller.scrollTop;
    r = Math.floor(r - Ge(e));
    var i = n && null != n.bottom ? n.bottom : r + e.wrapper.clientHeight,
      o = Jr(t, r),
      l = Jr(t, i);
    if (n && n.ensure) {
      var s = n.ensure.from.line,
        a = n.ensure.to.line;
      o > s ? (o = s, l = Jr(t, ei(Xr(t, s)) + e.wrapper.clientHeight)) : Math.min(a, t.lastLine()) >= l && (o = Jr(t, ei(Xr(t, a)) - e.wrapper.clientHeight), l = a)
    }
    return {
      from: o,
      to: Math.max(l, o + 1)
    }
  }

  function C(e) {
    var t = e.display,
      n = t.view;
    if (t.alignWidgets || t.gutters.firstChild && e.options.fixedGutter) {
      for (var r = L(t) - t.scroller.scrollLeft + e.doc.scrollLeft, i = t.gutters.offsetWidth, o = r + "px", l = 0; l < n.length; l++)
        if (!n[l].hidden) {
          e.options.fixedGutter && n[l].gutter && (n[l].gutter.style.left = o);
          var s = n[l].alignable;
          if (s)
            for (var a = 0; a < s.length; a++) s[a].style.left = o
        }
      e.options.fixedGutter && (t.gutters.style.left = r + i + "px")
    }
  }

  function w(e) {
    if (!e.options.lineNumbers) return !1;
    var t = e.doc,
      n = S(e.options, t.first + t.size - 1),
      r = e.display;
    if (n.length != r.lineNumChars) {
      var i = r.measure.appendChild(Ri("div", [Ri("div", n)], "CodeMirror-linenumber CodeMirror-gutter-elt")),
        o = i.firstChild.offsetWidth,
        l = i.offsetWidth - o;
      return r.lineGutter.style.width = "", r.lineNumInnerWidth = Math.max(o, r.lineGutter.offsetWidth - l) + 1, r.lineNumWidth = r.lineNumInnerWidth + l, r.lineNumChars = r.lineNumInnerWidth ? n.length : -1, r.lineGutter.style.width = r.lineNumWidth + "px", u(e), !0
    }
    return !1
  }

  function S(e, t) {
    return String(e.lineNumberFormatter(t + e.firstLineNumber))
  }

  function L(e) {
    return e.scroller.getBoundingClientRect().left - e.sizer.getBoundingClientRect().left
  }

  function k(e, t, n) {
    var r = e.display;
    this.viewport = t, this.visible = x(r, e.doc, t), this.editorIsHidden = !r.wrapper.offsetWidth, this.wrapperHeight = r.wrapper.clientHeight, this.wrapperWidth = r.wrapper.clientWidth, this.oldDisplayWidth = Ke(e), this.force = n, this.dims = W(e), this.events = []
  }

  function T(e) {
    var t = e.display;
    !t.scrollbarsClipped && t.scroller.offsetWidth && (t.nativeBarWidth = t.scroller.offsetWidth - t.scroller.clientWidth, t.heightForcer.style.height = Ve(e) + "px", t.sizer.style.marginBottom = -t.nativeBarWidth + "px", t.sizer.style.borderRightWidth = Ve(e) + "px", t.scrollbarsClipped = !0)
  }

  function M(e, t) {
    var n = e.display,
      r = e.doc;
    if (t.editorIsHidden) return Ft(e), !1;
    if (!t.force && t.visible.from >= n.viewFrom && t.visible.to <= n.viewTo && (null == n.updateLineNumbers || n.updateLineNumbers >= n.viewTo) && n.renderedView == n.view && 0 == Bt(e)) return !1;
    w(e) && (Ft(e), t.dims = W(e));
    var i = r.first + r.size,
      o = Math.max(t.visible.from - e.options.viewportMargin, r.first),
      l = Math.min(i, t.visible.to + e.options.viewportMargin);
    n.viewFrom < o && o - n.viewFrom < 20 && (o = Math.max(r.first, n.viewFrom)), n.viewTo > l && n.viewTo - l < 20 && (l = Math.min(i, n.viewTo)), Ho && (o = vr(e.doc, o), l = yr(e.doc, l));
    var s = o != n.viewFrom || l != n.viewTo || n.lastWrapHeight != t.wrapperHeight || n.lastWrapWidth != t.wrapperWidth;
    Rt(e, o, l), n.viewOffset = ei(Xr(e.doc, n.viewFrom)), e.display.mover.style.top = n.viewOffset + "px";
    var a = Bt(e);
    if (!s && 0 == a && !t.force && n.renderedView == n.view && (null == n.updateLineNumbers || n.updateLineNumbers >= n.viewTo)) return !1;
    var c = Gi();
    return a > 4 && (n.lineDiv.style.display = "none"), D(e, n.updateLineNumbers, t.dims), a > 4 && (n.lineDiv.style.display = ""), n.renderedView = n.view, c && Gi() != c && c.offsetHeight && c.focus(), Bi(n.cursorDiv), Bi(n.selectionDiv), n.gutters.style.height = n.sizer.style.minHeight = 0, s && (n.lastWrapHeight = t.wrapperHeight, n.lastWrapWidth = t.wrapperWidth, ze(e, 400)), n.updateLineNumbers = null, !0
  }

  function A(e, t) {
    for (var n = t.viewport, r = !0;
      (r && e.options.lineWrapping && t.oldDisplayWidth != Ke(e) || (n && null != n.top && (n = {
        top: Math.min(e.doc.height + qe(e.display) - _e(e), n.top)
      }), t.visible = x(e.display, e.doc, n), !(t.visible.from >= e.display.viewFrom && t.visible.to <= e.display.viewTo))) && M(e, t); r = !1) {
      H(e);
      var i = p(e);
      We(e), N(e, i), y(e, i)
    }
    t.signal(e, "update", e), (e.display.viewFrom != e.display.reportedViewFrom || e.display.viewTo != e.display.reportedViewTo) && (t.signal(e, "viewportChange", e, e.display.viewFrom, e.display.viewTo), e.display.reportedViewFrom = e.display.viewFrom, e.display.reportedViewTo = e.display.viewTo)
  }

  function O(e, t) {
    var n = new k(e, t);
    if (M(e, n)) {
      H(e), A(e, n);
      var r = p(e);
      We(e), N(e, r), y(e, r), n.finish()
    }
  }

  function N(e, t) {
    e.display.sizer.style.minHeight = t.docHeight + "px";
    var n = t.docHeight + e.display.barHeight;
    e.display.heightForcer.style.top = n + "px", e.display.gutters.style.height = Math.max(n + Ve(e), t.clientHeight) + "px"
  }

  function H(e) {
    for (var t = e.display, n = t.lineDiv.offsetTop, r = 0; r < t.view.length; r++) {
      var i, o = t.view[r];
      if (!o.hidden) {
        if (po && 8 > go) {
          var l = o.node.offsetTop + o.node.offsetHeight;
          i = l - n, n = l
        } else {
          var s = o.node.getBoundingClientRect();
          i = s.bottom - s.top
        }
        var a = o.line.height - i;
        if (2 > i && (i = vt(t)), (a > .001 || -.001 > a) && (Qr(o.line, i), P(o.line), o.rest))
          for (var c = 0; c < o.rest.length; c++) P(o.rest[c])
      }
    }
  }

  function P(e) {
    if (e.widgets)
      for (var t = 0; t < e.widgets.length; ++t) e.widgets[t].height = e.widgets[t].node.offsetHeight
  }

  function W(e) {
    for (var t = e.display, n = {}, r = {}, i = t.gutters.clientLeft, o = t.gutters.firstChild, l = 0; o; o = o.nextSibling, ++l) n[e.options.gutters[l]] = o.offsetLeft + o.clientLeft + i, r[e.options.gutters[l]] = o.clientWidth;
    return {
      fixedPos: L(t),
      gutterTotalWidth: t.gutters.offsetWidth,
      gutterLeft: n,
      gutterWidth: r,
      wrapperWidth: t.wrapper.clientWidth
    }
  }

  function D(e, t, n) {
    function r(t) {
      var n = t.nextSibling;
      return mo && ko && e.display.currentWheelTarget == t ? t.style.display = "none" : t.parentNode.removeChild(t), n
    }
    for (var i = e.display, o = e.options.lineNumbers, l = i.lineDiv, s = l.firstChild, a = i.view, c = i.viewFrom, u = 0; u < a.length; u++) {
      var f = a[u];
      if (f.hidden);
      else if (f.node && f.node.parentNode == l) {
        for (; s != f.node;) s = r(s);
        var d = o && null != t && c >= t && f.lineNumber;
        f.changes && (Ni(f.changes, "gutter") > -1 && (d = !1), E(e, f, c, n)), d && (Bi(f.lineNumber), f.lineNumber.appendChild(document.createTextNode(S(e.options, c)))), s = f.node.nextSibling
      } else {
        var h = q(e, f, c, n);
        l.insertBefore(h, s)
      }
      c += f.size
    }
    for (; s;) s = r(s)
  }

  function E(e, t, n, r) {
    for (var i = 0; i < t.changes.length; i++) {
      var o = t.changes[i];
      "text" == o ? R(e, t) : "gutter" == o ? j(e, t, n, r) : "class" == o ? B(t) : "widget" == o && G(e, t, r)
    }
    t.changes = null
  }

  function F(e) {
    return e.node == e.text && (e.node = Ri("div", null, null, "position: relative"), e.text.parentNode && e.text.parentNode.replaceChild(e.node, e.text), e.node.appendChild(e.text), po && 8 > go && (e.node.style.zIndex = 2)), e.node
  }

  function I(e) {
    var t = e.bgClass ? e.bgClass + " " + (e.line.bgClass || "") : e.line.bgClass;
    if (t && (t += " CodeMirror-linebackground"), e.background) t ? e.background.className = t : (e.background.parentNode.removeChild(e.background), e.background = null);
    else if (t) {
      var n = F(e);
      e.background = n.insertBefore(Ri("div", null, t), n.firstChild)
    }
  }

  function z(e, t) {
    var n = e.display.externalMeasured;
    return n && n.line == t.line ? (e.display.externalMeasured = null, t.measure = n.measure, n.built) : Er(e, t)
  }

  function R(e, t) {
    var n = t.text.className,
      r = z(e, t);
    t.text == t.node && (t.node = r.pre), t.text.parentNode.replaceChild(r.pre, t.text), t.text = r.pre, r.bgClass != t.bgClass || r.textClass != t.textClass ? (t.bgClass = r.bgClass, t.textClass = r.textClass, B(t)) : n && (t.text.className = n)
  }

  function B(e) {
    I(e), e.line.wrapClass ? F(e).className = e.line.wrapClass : e.node != e.text && (e.node.className = "");
    var t = e.textClass ? e.textClass + " " + (e.line.textClass || "") : e.line.textClass;
    e.text.className = t || ""
  }

  function j(e, t, n, r) {
    if (t.gutter && (t.node.removeChild(t.gutter), t.gutter = null), t.gutterBackground && (t.node.removeChild(t.gutterBackground), t.gutterBackground = null), t.line.gutterClass) {
      var i = F(t);
      t.gutterBackground = Ri("div", null, "CodeMirror-gutter-background " + t.line.gutterClass, "left: " + (e.options.fixedGutter ? r.fixedPos : -r.gutterTotalWidth) + "px; width: " + r.gutterTotalWidth + "px"), i.insertBefore(t.gutterBackground, t.text)
    }
    var o = t.line.gutterMarkers;
    if (e.options.lineNumbers || o) {
      var i = F(t),
        l = t.gutter = Ri("div", null, "CodeMirror-gutter-wrapper", "left: " + (e.options.fixedGutter ? r.fixedPos : -r.gutterTotalWidth) + "px");
      if (e.display.input.setUneditable(l), i.insertBefore(l, t.text), t.line.gutterClass && (l.className += " " + t.line.gutterClass), !e.options.lineNumbers || o && o["CodeMirror-linenumbers"] || (t.lineNumber = l.appendChild(Ri("div", S(e.options, n), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + r.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + e.display.lineNumInnerWidth + "px"))), o)
        for (var s = 0; s < e.options.gutters.length; ++s) {
          var a = e.options.gutters[s],
            c = o.hasOwnProperty(a) && o[a];
          c && l.appendChild(Ri("div", [c], "CodeMirror-gutter-elt", "left: " + r.gutterLeft[a] + "px; width: " + r.gutterWidth[a] + "px"))
        }
    }
  }

  function G(e, t, n) {
    t.alignable && (t.alignable = null);
    for (var r, i = t.node.firstChild; i; i = r) {
      var r = i.nextSibling;
      "CodeMirror-linewidget" == i.className && t.node.removeChild(i)
    }
    U(e, t, n)
  }

  function q(e, t, n, r) {
    var i = z(e, t);
    return t.text = t.node = i.pre, i.bgClass && (t.bgClass = i.bgClass), i.textClass && (t.textClass = i.textClass), B(t), j(e, t, n, r), U(e, t, r), t.node
  }

  function U(e, t, n) {
    if (V(e, t.line, t, n, !0), t.rest)
      for (var r = 0; r < t.rest.length; r++) V(e, t.rest[r], t, n, !1)
  }

  function V(e, t, n, r, i) {
    if (t.widgets)
      for (var o = F(n), l = 0, s = t.widgets; l < s.length; ++l) {
        var a = s[l],
          c = Ri("div", [a.node], "CodeMirror-linewidget");
        a.handleMouseEvents || c.setAttribute("cm-ignore-events", "true"), K(a, c, n, r), e.display.input.setUneditable(c), i && a.above ? o.insertBefore(c, n.gutter || n.text) : o.appendChild(c), xi(a, "redraw")
      }
  }

  function K(e, t, n, r) {
    if (e.noHScroll) {
      (n.alignable || (n.alignable = [])).push(t);
      var i = r.wrapperWidth;
      t.style.left = r.fixedPos + "px", e.coverGutter || (i -= r.gutterTotalWidth, t.style.paddingLeft = r.gutterTotalWidth + "px"), t.style.width = i + "px"
    }
    e.coverGutter && (t.style.zIndex = 5, t.style.position = "relative", e.noHScroll || (t.style.marginLeft = -r.gutterTotalWidth + "px"))
  }

  function _(e) {
    return Po(e.line, e.ch)
  }

  function X(e, t) {
    return Wo(e, t) < 0 ? t : e
  }

  function Y(e, t) {
    return Wo(e, t) < 0 ? e : t
  }

  function $(e) {
    e.state.focused || (e.display.input.focus(), pn(e))
  }

  function Q(e) {
    return e.options.readOnly || e.doc.cantEdit
  }

  function Z(e, t, n, r, i) {
    var o = e.doc;
    e.display.shift = !1, r || (r = o.sel);
    var l = e.state.pasteIncoming || "paste" == i,
      s = o.splitLines(t),
      a = null;
    if (l && r.ranges.length > 1)
      if (Do && Do.join("\n") == t) {
        if (r.ranges.length % Do.length == 0) {
          a = [];
          for (var c = 0; c < Do.length; c++) a.push(o.splitLines(Do[c]))
        }
      } else s.length == r.ranges.length && (a = Hi(s, function(e) {
        return [e]
      }));
    for (var c = r.ranges.length - 1; c >= 0; c--) {
      var u = r.ranges[c],
        f = u.from(),
        d = u.to();
      u.empty() && (n && n > 0 ? f = Po(f.line, f.ch - n) : e.state.overwrite && !l && (d = Po(d.line, Math.min(Xr(o, d.line).text.length, d.ch + Oi(s).length))));
      var h = e.curOp.updateInput,
        p = {
          from: f,
          to: d,
          text: a ? a[c % a.length] : s,
          origin: i || (l ? "paste" : e.state.cutIncoming ? "cut" : "+input")
        };
      Sn(e.doc, p), xi(e, "inputRead", e, p)
    }
    t && !l && ee(e, t), En(e), e.curOp.updateInput = h, e.curOp.typing = !0, e.state.pasteIncoming = e.state.cutIncoming = !1
  }

  function J(e, t) {
    var n = e.clipboardData && e.clipboardData.getData("text/plain");
    return n ? (e.preventDefault(), At(t, function() {
      Z(t, n, 0, null, "paste")
    }), !0) : void 0
  }

  function ee(e, t) {
    if (e.options.electricChars && e.options.smartIndent)
      for (var n = e.doc.sel, r = n.ranges.length - 1; r >= 0; r--) {
        var i = n.ranges[r];
        if (!(i.head.ch > 100 || r && n.ranges[r - 1].head.line == i.head.line)) {
          var o = e.getModeAt(i.head),
            l = !1;
          if (o.electricChars) {
            for (var s = 0; s < o.electricChars.length; s++)
              if (t.indexOf(o.electricChars.charAt(s)) > -1) {
                l = In(e, i.head.line, "smart");
                break
              }
          } else o.electricInput && o.electricInput.test(Xr(e.doc, i.head.line).text.slice(0, i.head.ch)) && (l = In(e, i.head.line, "smart"));
          l && xi(e, "electricInput", e, i.head.line)
        }
      }
  }

  function te(e) {
    for (var t = [], n = [], r = 0; r < e.doc.sel.ranges.length; r++) {
      var i = e.doc.sel.ranges[r].head.line,
        o = {
          anchor: Po(i, 0),
          head: Po(i + 1, 0)
        };
      n.push(o), t.push(e.getRange(o.anchor, o.head))
    }
    return {
      text: t,
      ranges: n
    }
  }

  function ne(e) {
    e.setAttribute("autocorrect", "off"), e.setAttribute("autocapitalize", "off"), e.setAttribute("spellcheck", "false")
  }

  function re(e) {
    this.cm = e, this.prevInput = "", this.pollingFast = !1, this.polling = new Ti, this.inaccurateSelection = !1, this.hasSelection = !1, this.composing = null
  }

  function ie() {
    var e = Ri("textarea", null, null, "position: absolute; padding: 0; width: 1px; height: 1em; outline: none"),
      t = Ri("div", [e], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
    return mo ? e.style.width = "1000px" : e.setAttribute("wrap", "off"), So && (e.style.border = "1px solid black"), ne(e), t
  }

  function oe(e) {
    this.cm = e, this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null, this.polling = new Ti, this.gracePeriod = !1
  }

  function le(e, t) {
    var n = Ze(e, t.line);
    if (!n || n.hidden) return null;
    var r = Xr(e.doc, t.line),
      i = Ye(n, r, t.line),
      o = ti(r),
      l = "left";
    if (o) {
      var s = lo(o, t.ch);
      l = s % 2 ? "right" : "left"
    }
    var a = tt(i.map, t.ch, l);
    return a.offset = "right" == a.collapse ? a.end : a.start, a
  }

  function se(e, t) {
    return t && (e.bad = !0), e
  }

  function ae(e, t, n) {
    var r;
    if (t == e.display.lineDiv) {
      if (r = e.display.lineDiv.childNodes[n], !r) return se(e.clipPos(Po(e.display.viewTo - 1)), !0);
      t = null, n = 0
    } else
      for (r = t;; r = r.parentNode) {
        if (!r || r == e.display.lineDiv) return null;
        if (r.parentNode && r.parentNode == e.display.lineDiv) break
      }
    for (var i = 0; i < e.display.view.length; i++) {
      var o = e.display.view[i];
      if (o.node == r) return ce(o, t, n)
    }
  }

  function ce(e, t, n) {
    function r(t, n, r) {
      for (var i = -1; i < (u ? u.length : 0); i++)
        for (var o = 0 > i ? c.map : u[i], l = 0; l < o.length; l += 3) {
          var s = o[l + 2];
          if (s == t || s == n) {
            var a = Zr(0 > i ? e.line : e.rest[i]),
              f = o[l] + r;
            return (0 > r || s != t) && (f = o[l + (r ? 1 : 0)]), Po(a, f)
          }
        }
    }
    var i = e.text.firstChild,
      o = !1;
    if (!t || !Bl(i, t)) return se(Po(Zr(e.line), 0), !0);
    if (t == i && (o = !0, t = i.childNodes[n], n = 0, !t)) {
      var l = e.rest ? Oi(e.rest) : e.line;
      return se(Po(Zr(l), l.text.length), o)
    }
    var s = 3 == t.nodeType ? t : null,
      a = t;
    for (s || 1 != t.childNodes.length || 3 != t.firstChild.nodeType || (s = t.firstChild, n && (n = s.nodeValue.length)); a.parentNode != i;) a = a.parentNode;
    var c = e.measure,
      u = c.maps,
      f = r(s, a, n);
    if (f) return se(f, o);
    for (var d = a.nextSibling, h = s ? s.nodeValue.length - n : 0; d; d = d.nextSibling) {
      if (f = r(d, d.firstChild, 0)) return se(Po(f.line, f.ch - h), o);
      h += d.textContent.length
    }
    for (var p = a.previousSibling, h = n; p; p = p.previousSibling) {
      if (f = r(p, p.firstChild, -1)) return se(Po(f.line, f.ch + h), o);
      h += d.textContent.length
    }
  }

  function ue(e, t, n, r, i) {
    function o(e) {
      return function(t) {
        return t.id == e
      }
    }

    function l(t) {
      if (1 == t.nodeType) {
        var n = t.getAttribute("cm-text");
        if (null != n) return "" == n && (n = t.textContent.replace(/\u200b/g, "")), void(s += n);
        var u, f = t.getAttribute("cm-marker");
        if (f) {
          var d = e.findMarks(Po(r, 0), Po(i + 1, 0), o(+f));
          return void(d.length && (u = d[0].find()) && (s += Yr(e.doc, u.from, u.to).join(c)))
        }
        if ("false" == t.getAttribute("contenteditable")) return;
        for (var h = 0; h < t.childNodes.length; h++) l(t.childNodes[h]);
        /^(pre|div|p)$/i.test(t.nodeName) && (a = !0)
      } else if (3 == t.nodeType) {
        var p = t.nodeValue;
        if (!p) return;
        a && (s += c, a = !1), s += p
      }
    }
    for (var s = "", a = !1, c = e.doc.lineSeparator(); l(t), t != n;) t = t.nextSibling;
    return s
  }

  function fe(e, t) {
    this.ranges = e, this.primIndex = t
  }

  function de(e, t) {
    this.anchor = e, this.head = t
  }

  function he(e, t) {
    var n = e[t];
    e.sort(function(e, t) {
      return Wo(e.from(), t.from())
    }), t = Ni(e, n);
    for (var r = 1; r < e.length; r++) {
      var i = e[r],
        o = e[r - 1];
      if (Wo(o.to(), i.from()) >= 0) {
        var l = Y(o.from(), i.from()),
          s = X(o.to(), i.to()),
          a = o.empty() ? i.from() == i.head : o.from() == o.head;
        t >= r && --t, e.splice(--r, 2, new de(a ? s : l, a ? l : s))
      }
    }
    return new fe(e, t)
  }

  function pe(e, t) {
    return new fe([new de(e, t || e)], 0)
  }

  function ge(e, t) {
    return Math.max(e.first, Math.min(t, e.first + e.size - 1))
  }

  function me(e, t) {
    if (t.line < e.first) return Po(e.first, 0);
    var n = e.first + e.size - 1;
    return t.line > n ? Po(n, Xr(e, n).text.length) : ve(t, Xr(e, t.line).text.length)
  }

  function ve(e, t) {
    var n = e.ch;
    return null == n || n > t ? Po(e.line, t) : 0 > n ? Po(e.line, 0) : e
  }

  function ye(e, t) {
    return t >= e.first && t < e.first + e.size
  }

  function be(e, t) {
    for (var n = [], r = 0; r < t.length; r++) n[r] = me(e, t[r]);
    return n
  }

  function xe(e, t, n, r) {
    if (e.cm && e.cm.display.shift || e.extend) {
      var i = t.anchor;
      if (r) {
        var o = Wo(n, i) < 0;
        o != Wo(r, i) < 0 ? (i = n, n = r) : o != Wo(n, r) < 0 && (n = r)
      }
      return new de(i, n)
    }
    return new de(r || n, n)
  }

  function Ce(e, t, n, r) {
    Me(e, new fe([xe(e, e.sel.primary(), t, n)], 0), r)
  }

  function we(e, t, n) {
    for (var r = [], i = 0; i < e.sel.ranges.length; i++) r[i] = xe(e, e.sel.ranges[i], t[i], null);
    var o = he(r, e.sel.primIndex);
    Me(e, o, n)
  }

  function Se(e, t, n, r) {
    var i = e.sel.ranges.slice(0);
    i[t] = n, Me(e, he(i, e.sel.primIndex), r)
  }

  function Le(e, t, n, r) {
    Me(e, pe(t, n), r)
  }

  function ke(e, t) {
    var n = {
      ranges: t.ranges,
      update: function(t) {
        this.ranges = [];
        for (var n = 0; n < t.length; n++) this.ranges[n] = new de(me(e, t[n].anchor), me(e, t[n].head))
      }
    };
    return Tl(e, "beforeSelectionChange", e, n), e.cm && Tl(e.cm, "beforeSelectionChange", e.cm, n), n.ranges != t.ranges ? he(n.ranges, n.ranges.length - 1) : t
  }

  function Te(e, t, n) {
    var r = e.history.done,
      i = Oi(r);
    i && i.ranges ? (r[r.length - 1] = t, Ae(e, t, n)) : Me(e, t, n)
  }

  function Me(e, t, n) {
    Ae(e, t, n), ai(e, e.sel, e.cm ? e.cm.curOp.id : 0 / 0, n)
  }

  function Ae(e, t, n) {
    (Li(e, "beforeSelectionChange") || e.cm && Li(e.cm, "beforeSelectionChange")) && (t = ke(e, t));
    var r = n && n.bias || (Wo(t.primary().head, e.sel.primary().head) < 0 ? -1 : 1);
    Oe(e, He(e, t, r, !0)), n && n.scroll === !1 || !e.cm || En(e.cm)
  }

  function Oe(e, t) {
    t.equals(e.sel) || (e.sel = t, e.cm && (e.cm.curOp.updateInput = e.cm.curOp.selectionChanged = !0, Si(e.cm)), xi(e, "cursorActivity", e))
  }

  function Ne(e) {
    Oe(e, He(e, e.sel, null, !1), Nl)
  }

  function He(e, t, n, r) {
    for (var i, o = 0; o < t.ranges.length; o++) {
      var l = t.ranges[o],
        s = Pe(e, l.anchor, n, r),
        a = Pe(e, l.head, n, r);
      (i || s != l.anchor || a != l.head) && (i || (i = t.ranges.slice(0, o)), i[o] = new de(s, a))
    }
    return i ? he(i, t.primIndex) : t
  }

  function Pe(e, t, n, r) {
    var i = !1,
      o = t,
      l = n || 1;
    e.cantEdit = !1;
    e: for (;;) {
      var s = Xr(e, o.line);
      if (s.markedSpans)
        for (var a = 0; a < s.markedSpans.length; ++a) {
          var c = s.markedSpans[a],
            u = c.marker;
          if ((null == c.from || (u.inclusiveLeft ? c.from <= o.ch : c.from < o.ch)) && (null == c.to || (u.inclusiveRight ? c.to >= o.ch : c.to > o.ch))) {
            if (r && (Tl(u, "beforeCursorEnter"), u.explicitlyCleared)) {
              if (s.markedSpans) {
                --a;
                continue
              }
              break
            }
            if (!u.atomic) continue;
            var f = u.find(0 > l ? -1 : 1);
            if (0 == Wo(f, o) && (f.ch += l, f.ch < 0 ? f = f.line > e.first ? me(e, Po(f.line - 1)) : null : f.ch > s.text.length && (f = f.line < e.first + e.size - 1 ? Po(f.line + 1, 0) : null), !f)) {
              if (i) return r ? (e.cantEdit = !0, Po(e.first, 0)) : Pe(e, t, n, !0);
              i = !0, f = t, l = -l
            }
            o = f;
            continue e
          }
        }
      return o
    }
  }

  function We(e) {
    e.display.input.showSelection(e.display.input.prepareSelection())
  }

  function De(e, t) {
    for (var n = e.doc, r = {}, i = r.cursors = document.createDocumentFragment(), o = r.selection = document.createDocumentFragment(), l = 0; l < n.sel.ranges.length; l++)
      if (t !== !1 || l != n.sel.primIndex) {
        var s = n.sel.ranges[l],
          a = s.empty();
        (a || e.options.showCursorWhenSelecting) && Ee(e, s, i), a || Fe(e, s, o)
      }
    return r
  }

  function Ee(e, t, n) {
    var r = dt(e, t.head, "div", null, null, !e.options.singleCursorHeightPerLine),
      i = n.appendChild(Ri("div", " ", "CodeMirror-cursor"));
    if (i.style.left = r.left + "px", i.style.top = r.top + "px", i.style.height = Math.max(0, r.bottom - r.top) * e.options.cursorHeight + "px", r.other) {
      var o = n.appendChild(Ri("div", " ", "CodeMirror-cursor CodeMirror-secondarycursor"));
      o.style.display = "", o.style.left = r.other.left + "px", o.style.top = r.other.top + "px", o.style.height = .85 * (r.other.bottom - r.other.top) + "px"
    }
  }

  function Fe(e, t, n) {
    function r(e, t, n, r) {
      0 > t && (t = 0), t = Math.round(t), r = Math.round(r), s.appendChild(Ri("div", null, "CodeMirror-selected", "position: absolute; left: " + e + "px; top: " + t + "px; width: " + (null == n ? u - e : n) + "px; height: " + (r - t) + "px"))
    }

    function i(t, n, i) {
      function o(n, r) {
        return ft(e, Po(t, n), "div", f, r)
      }
      var s, a, f = Xr(l, t),
        d = f.text.length;
      return Qi(ti(f), n || 0, null == i ? d : i, function(e, t, l) {
        var f, h, p, g = o(e, "left");
        if (e == t) f = g, h = p = g.left;
        else {
          if (f = o(t - 1, "right"), "rtl" == l) {
            var m = g;
            g = f, f = m
          }
          h = g.left, p = f.right
        }
        null == n && 0 == e && (h = c), f.top - g.top > 3 && (r(h, g.top, null, g.bottom), h = c, g.bottom < f.top && r(h, g.bottom, null, f.top)), null == i && t == d && (p = u), (!s || g.top < s.top || g.top == s.top && g.left < s.left) && (s = g), (!a || f.bottom > a.bottom || f.bottom == a.bottom && f.right > a.right) && (a = f), c + 1 > h && (h = c), r(h, f.top, p - h, f.bottom)
      }), {
        start: s,
        end: a
      }
    }
    var o = e.display,
      l = e.doc,
      s = document.createDocumentFragment(),
      a = Ue(e.display),
      c = a.left,
      u = Math.max(o.sizerWidth, Ke(e) - o.sizer.offsetLeft) - a.right,
      f = t.from(),
      d = t.to();
    if (f.line == d.line) i(f.line, f.ch, d.ch);
    else {
      var h = Xr(l, f.line),
        p = Xr(l, d.line),
        g = gr(h) == gr(p),
        m = i(f.line, f.ch, g ? h.text.length + 1 : null).end,
        v = i(d.line, g ? 0 : null, d.ch).start;
      g && (m.top < v.top - 2 ? (r(m.right, m.top, null, m.bottom), r(c, v.top, v.left, v.bottom)) : r(m.right, m.top, v.left - m.right, m.bottom)), m.bottom < v.top && r(c, m.bottom, null, v.top)
    }
    n.appendChild(s)
  }

  function Ie(e) {
    if (e.state.focused) {
      var t = e.display;
      clearInterval(t.blinker);
      var n = !0;
      t.cursorDiv.style.visibility = "", e.options.cursorBlinkRate > 0 ? t.blinker = setInterval(function() {
        t.cursorDiv.style.visibility = (n = !n) ? "" : "hidden"
      }, e.options.cursorBlinkRate) : e.options.cursorBlinkRate < 0 && (t.cursorDiv.style.visibility = "hidden")
    }
  }

  function ze(e, t) {
    e.doc.mode.startState && e.doc.frontier < e.display.viewTo && e.state.highlight.set(t, Ei(Re, e))
  }

  function Re(e) {
    var t = e.doc;
    if (t.frontier < t.first && (t.frontier = t.first), !(t.frontier >= e.display.viewTo)) {
      var n = +new Date + e.options.workTime,
        r = nl(t.mode, je(e, t.frontier)),
        i = [];
      t.iter(t.frontier, Math.min(t.first + t.size, e.display.viewTo + 500), function(o) {
        if (t.frontier >= e.display.viewFrom) {
          var l = o.styles,
            s = Hr(e, o, r, !0);
          o.styles = s.styles;
          var a = o.styleClasses,
            c = s.classes;
          c ? o.styleClasses = c : a && (o.styleClasses = null);
          for (var u = !l || l.length != o.styles.length || a != c && (!a || !c || a.bgClass != c.bgClass || a.textClass != c.textClass), f = 0; !u && f < l.length; ++f) u = l[f] != o.styles[f];
          u && i.push(t.frontier), o.stateAfter = nl(t.mode, r)
        } else Wr(e, o.text, r), o.stateAfter = t.frontier % 5 == 0 ? nl(t.mode, r) : null;
        return ++t.frontier, +new Date > n ? (ze(e, e.options.workDelay), !0) : void 0
      }), i.length && At(e, function() {
        for (var t = 0; t < i.length; t++) Et(e, i[t], "text")
      })
    }
  }

  function Be(e, t, n) {
    for (var r, i, o = e.doc, l = n ? -1 : t - (e.doc.mode.innerMode ? 1e3 : 100), s = t; s > l; --s) {
      if (s <= o.first) return o.first;
      var a = Xr(o, s - 1);
      if (a.stateAfter && (!n || s <= o.frontier)) return s;
      var c = Wl(a.text, null, e.options.tabSize);
      (null == i || r > c) && (i = s - 1, r = c)
    }
    return i
  }

  function je(e, t, n) {
    var r = e.doc,
      i = e.display;
    if (!r.mode.startState) return !0;
    var o = Be(e, t, n),
      l = o > r.first && Xr(r, o - 1).stateAfter;
    return l = l ? nl(r.mode, l) : rl(r.mode), r.iter(o, t, function(n) {
      Wr(e, n.text, l);
      var s = o == t - 1 || o % 5 == 0 || o >= i.viewFrom && o < i.viewTo;
      n.stateAfter = s ? nl(r.mode, l) : null, ++o
    }), n && (r.frontier = o), l
  }

  function Ge(e) {
    return e.lineSpace.offsetTop
  }

  function qe(e) {
    return e.mover.offsetHeight - e.lineSpace.offsetHeight
  }

  function Ue(e) {
    if (e.cachedPaddingH) return e.cachedPaddingH;
    var t = ji(e.measure, Ri("pre", "x")),
      n = window.getComputedStyle ? window.getComputedStyle(t) : t.currentStyle,
      r = {
        left: parseInt(n.paddingLeft),
        right: parseInt(n.paddingRight)
      };
    return isNaN(r.left) || isNaN(r.right) || (e.cachedPaddingH = r), r
  }

  function Ve(e) {
    return Al - e.display.nativeBarWidth
  }

  function Ke(e) {
    return e.display.scroller.clientWidth - Ve(e) - e.display.barWidth
  }

  function _e(e) {
    return e.display.scroller.clientHeight - Ve(e) - e.display.barHeight
  }

  function Xe(e, t, n) {
    var r = e.options.lineWrapping,
      i = r && Ke(e);
    if (!t.measure.heights || r && t.measure.width != i) {
      var o = t.measure.heights = [];
      if (r) {
        t.measure.width = i;
        for (var l = t.text.firstChild.getClientRects(), s = 0; s < l.length - 1; s++) {
          var a = l[s],
            c = l[s + 1];
          Math.abs(a.bottom - c.bottom) > 2 && o.push((a.bottom + c.top) / 2 - n.top)
        }
      }
      o.push(n.bottom - n.top)
    }
  }

  function Ye(e, t, n) {
    if (e.line == t) return {
      map: e.measure.map,
      cache: e.measure.cache
    };
    for (var r = 0; r < e.rest.length; r++)
      if (e.rest[r] == t) return {
        map: e.measure.maps[r],
        cache: e.measure.caches[r]
      };
    for (var r = 0; r < e.rest.length; r++)
      if (Zr(e.rest[r]) > n) return {
        map: e.measure.maps[r],
        cache: e.measure.caches[r],
        before: !0
      }
  }

  function $e(e, t) {
    t = gr(t);
    var n = Zr(t),
      r = e.display.externalMeasured = new Pt(e.doc, t, n);
    r.lineN = n;
    var i = r.built = Er(e, r);
    return r.text = i.pre, ji(e.display.lineMeasure, i.pre), r
  }

  function Qe(e, t, n, r) {
    return et(e, Je(e, t), n, r)
  }

  function Ze(e, t) {
    if (t >= e.display.viewFrom && t < e.display.viewTo) return e.display.view[It(e, t)];
    var n = e.display.externalMeasured;
    return n && t >= n.lineN && t < n.lineN + n.size ? n : void 0
  }

  function Je(e, t) {
    var n = Zr(t),
      r = Ze(e, n);
    r && !r.text ? r = null : r && r.changes && (E(e, r, n, W(e)), e.curOp.forceUpdate = !0), r || (r = $e(e, t));
    var i = Ye(r, t, n);
    return {
      line: t,
      view: r,
      rect: null,
      map: i.map,
      cache: i.cache,
      before: i.before,
      hasHeights: !1
    }
  }

  function et(e, t, n, r, i) {
    t.before && (n = -1);
    var o, l = n + (r || "");
    return t.cache.hasOwnProperty(l) ? o = t.cache[l] : (t.rect || (t.rect = t.view.text.getBoundingClientRect()), t.hasHeights || (Xe(e, t.view, t.rect), t.hasHeights = !0), o = nt(e, t, n, r), o.bogus || (t.cache[l] = o)), {
      left: o.left,
      right: o.right,
      top: i ? o.rtop : o.top,
      bottom: i ? o.rbottom : o.bottom
    }
  }

  function tt(e, t, n) {
    for (var r, i, o, l, s = 0; s < e.length; s += 3) {
      var a = e[s],
        c = e[s + 1];
      if (a > t ? (i = 0, o = 1, l = "left") : c > t ? (i = t - a, o = i + 1) : (s == e.length - 3 || t == c && e[s + 3] > t) && (o = c - a, i = o - 1, t >= c && (l = "right")), null != i) {
        if (r = e[s + 2], a == c && n == (r.insertLeft ? "left" : "right") && (l = n), "left" == n && 0 == i)
          for (; s && e[s - 2] == e[s - 3] && e[s - 1].insertLeft;) r = e[(s -= 3) + 2], l = "left";
        if ("right" == n && i == c - a)
          for (; s < e.length - 3 && e[s + 3] == e[s + 4] && !e[s + 5].insertLeft;) r = e[(s += 3) + 2], l = "right";
        break
      }
    }
    return {
      node: r,
      start: i,
      end: o,
      collapse: l,
      coverStart: a,
      coverEnd: c
    }
  }

  function nt(e, t, n, r) {
    var i, o = tt(t.map, n, r),
      l = o.node,
      s = o.start,
      a = o.end,
      c = o.collapse;
    if (3 == l.nodeType) {
      for (var u = 0; 4 > u; u++) {
        for (; s && zi(t.line.text.charAt(o.coverStart + s));) --s;
        for (; o.coverStart + a < o.coverEnd && zi(t.line.text.charAt(o.coverStart + a));) ++a;
        if (po && 9 > go && 0 == s && a == o.coverEnd - o.coverStart) i = l.parentNode.getBoundingClientRect();
        else if (po && e.options.lineWrapping) {
          var f = Fl(l, s, a).getClientRects();

          i = f.length ? f["right" == r ? f.length - 1 : 0] : zo
        } else i = Fl(l, s, a).getBoundingClientRect() || zo;
        if (i.left || i.right || 0 == s) break;
        a = s, s -= 1, c = "right"
      }
      po && 11 > go && (i = rt(e.display.measure, i))
    } else {
      s > 0 && (c = r = "right");
      var f;
      i = e.options.lineWrapping && (f = l.getClientRects()).length > 1 ? f["right" == r ? f.length - 1 : 0] : l.getBoundingClientRect()
    }
    if (po && 9 > go && !s && (!i || !i.left && !i.right)) {
      var d = l.parentNode.getClientRects()[0];
      i = d ? {
        left: d.left,
        right: d.left + yt(e.display),
        top: d.top,
        bottom: d.bottom
      } : zo
    }
    for (var h = i.top - t.rect.top, p = i.bottom - t.rect.top, g = (h + p) / 2, m = t.view.measure.heights, u = 0; u < m.length - 1 && !(g < m[u]); u++);
    var v = u ? m[u - 1] : 0,
      y = m[u],
      b = {
        left: ("right" == c ? i.right : i.left) - t.rect.left,
        right: ("left" == c ? i.left : i.right) - t.rect.left,
        top: v,
        bottom: y
      };
    return i.left || i.right || (b.bogus = !0), e.options.singleCursorHeightPerLine || (b.rtop = h, b.rbottom = p), b
  }

  function rt(e, t) {
    if (!window.screen || null == screen.logicalXDPI || screen.logicalXDPI == screen.deviceXDPI || !$i(e)) return t;
    var n = screen.logicalXDPI / screen.deviceXDPI,
      r = screen.logicalYDPI / screen.deviceYDPI;
    return {
      left: t.left * n,
      right: t.right * n,
      top: t.top * r,
      bottom: t.bottom * r
    }
  }

  function it(e) {
    if (e.measure && (e.measure.cache = {}, e.measure.heights = null, e.rest))
      for (var t = 0; t < e.rest.length; t++) e.measure.caches[t] = {}
  }

  function ot(e) {
    e.display.externalMeasure = null, Bi(e.display.lineMeasure);
    for (var t = 0; t < e.display.view.length; t++) it(e.display.view[t])
  }

  function lt(e) {
    ot(e), e.display.cachedCharWidth = e.display.cachedTextHeight = e.display.cachedPaddingH = null, e.options.lineWrapping || (e.display.maxLineChanged = !0), e.display.lineNumChars = null
  }

  function st() {
    return window.pageXOffset || (document.documentElement || document.body).scrollLeft
  }

  function at() {
    return window.pageYOffset || (document.documentElement || document.body).scrollTop
  }

  function ct(e, t, n, r) {
    if (t.widgets)
      for (var i = 0; i < t.widgets.length; ++i)
        if (t.widgets[i].above) {
          var o = wr(t.widgets[i]);
          n.top += o, n.bottom += o
        }
    if ("line" == r) return n;
    r || (r = "local");
    var l = ei(t);
    if ("local" == r ? l += Ge(e.display) : l -= e.display.viewOffset, "page" == r || "window" == r) {
      var s = e.display.lineSpace.getBoundingClientRect();
      l += s.top + ("window" == r ? 0 : at());
      var a = s.left + ("window" == r ? 0 : st());
      n.left += a, n.right += a
    }
    return n.top += l, n.bottom += l, n
  }

  function ut(e, t, n) {
    if ("div" == n) return t;
    var r = t.left,
      i = t.top;
    if ("page" == n) r -= st(), i -= at();
    else if ("local" == n || !n) {
      var o = e.display.sizer.getBoundingClientRect();
      r += o.left, i += o.top
    }
    var l = e.display.lineSpace.getBoundingClientRect();
    return {
      left: r - l.left,
      top: i - l.top
    }
  }

  function ft(e, t, n, r, i) {
    return r || (r = Xr(e.doc, t.line)), ct(e, r, Qe(e, r, t.ch, i), n)
  }

  function dt(e, t, n, r, i, o) {
    function l(t, l) {
      var s = et(e, i, t, l ? "right" : "left", o);
      return l ? s.left = s.right : s.right = s.left, ct(e, r, s, n)
    }

    function s(e, t) {
      var n = a[t],
        r = n.level % 2;
      return e == Zi(n) && t && n.level < a[t - 1].level ? (n = a[--t], e = Ji(n) - (n.level % 2 ? 0 : 1), r = !0) : e == Ji(n) && t < a.length - 1 && n.level < a[t + 1].level && (n = a[++t], e = Zi(n) - n.level % 2, r = !1), r && e == n.to && e > n.from ? l(e - 1) : l(e, r)
    }
    r = r || Xr(e.doc, t.line), i || (i = Je(e, r));
    var a = ti(r),
      c = t.ch;
    if (!a) return l(c);
    var u = lo(a, c),
      f = s(c, u);
    return null != Zl && (f.other = s(c, Zl)), f
  }

  function ht(e, t) {
    var n = 0,
      t = me(e.doc, t);
    e.options.lineWrapping || (n = yt(e.display) * t.ch);
    var r = Xr(e.doc, t.line),
      i = ei(r) + Ge(e.display);
    return {
      left: n,
      right: n,
      top: i,
      bottom: i + r.height
    }
  }

  function pt(e, t, n, r) {
    var i = Po(e, t);
    return i.xRel = r, n && (i.outside = !0), i
  }

  function gt(e, t, n) {
    var r = e.doc;
    if (n += e.display.viewOffset, 0 > n) return pt(r.first, 0, !0, -1);
    var i = Jr(r, n),
      o = r.first + r.size - 1;
    if (i > o) return pt(r.first + r.size - 1, Xr(r, o).text.length, !0, 1);
    0 > t && (t = 0);
    for (var l = Xr(r, i);;) {
      var s = mt(e, l, i, t, n),
        a = hr(l),
        c = a && a.find(0, !0);
      if (!a || !(s.ch > c.from.ch || s.ch == c.from.ch && s.xRel > 0)) return s;
      i = Zr(l = c.to.line)
    }
  }

  function mt(e, t, n, r, i) {
    function o(r) {
      var i = dt(e, Po(n, r), "line", t, c);
      return s = !0, l > i.bottom ? i.left - a : l < i.top ? i.left + a : (s = !1, i.left)
    }
    var l = i - ei(t),
      s = !1,
      a = 2 * e.display.wrapper.clientWidth,
      c = Je(e, t),
      u = ti(t),
      f = t.text.length,
      d = eo(t),
      h = to(t),
      p = o(d),
      g = s,
      m = o(h),
      v = s;
    if (r > m) return pt(n, h, v, 1);
    for (;;) {
      if (u ? h == d || h == ao(t, d, 1) : 1 >= h - d) {
        for (var y = p > r || m - r >= r - p ? d : h, b = r - (y == d ? p : m); zi(t.text.charAt(y));) ++y;
        var x = pt(n, y, y == d ? g : v, -1 > b ? -1 : b > 1 ? 1 : 0);
        return x
      }
      var C = Math.ceil(f / 2),
        w = d + C;
      if (u) {
        w = d;
        for (var S = 0; C > S; ++S) w = ao(t, w, 1)
      }
      var L = o(w);
      L > r ? (h = w, m = L, (v = s) && (m += 1e3), f = C) : (d = w, p = L, g = s, f -= C)
    }
  }

  function vt(e) {
    if (null != e.cachedTextHeight) return e.cachedTextHeight;
    if (null == Eo) {
      Eo = Ri("pre");
      for (var t = 0; 49 > t; ++t) Eo.appendChild(document.createTextNode("x")), Eo.appendChild(Ri("br"));
      Eo.appendChild(document.createTextNode("x"))
    }
    ji(e.measure, Eo);
    var n = Eo.offsetHeight / 50;
    return n > 3 && (e.cachedTextHeight = n), Bi(e.measure), n || 1
  }

  function yt(e) {
    if (null != e.cachedCharWidth) return e.cachedCharWidth;
    var t = Ri("span", "xxxxxxxxxx"),
      n = Ri("pre", [t]);
    ji(e.measure, n);
    var r = t.getBoundingClientRect(),
      i = (r.right - r.left) / 10;
    return i > 2 && (e.cachedCharWidth = i), i || 10
  }

  function bt(e) {
    e.curOp = {
      cm: e,
      viewChanged: !1,
      startHeight: e.doc.height,
      forceUpdate: !1,
      updateInput: null,
      typing: !1,
      changeObjs: null,
      cursorActivityHandlers: null,
      cursorActivityCalled: 0,
      selectionChanged: !1,
      updateMaxLine: !1,
      scrollLeft: null,
      scrollTop: null,
      scrollToPos: null,
      focus: !1,
      id: ++Bo
    }, Ro ? Ro.ops.push(e.curOp) : e.curOp.ownsGroup = Ro = {
      ops: [e.curOp],
      delayedCallbacks: []
    }
  }

  function xt(e) {
    var t = e.delayedCallbacks,
      n = 0;
    do {
      for (; n < t.length; n++) t[n]();
      for (var r = 0; r < e.ops.length; r++) {
        var i = e.ops[r];
        if (i.cursorActivityHandlers)
          for (; i.cursorActivityCalled < i.cursorActivityHandlers.length;) i.cursorActivityHandlers[i.cursorActivityCalled++](i.cm)
      }
    } while (n < t.length)
  }

  function Ct(e) {
    var t = e.curOp,
      n = t.ownsGroup;
    if (n) try {
      xt(n)
    } finally {
      Ro = null;
      for (var r = 0; r < n.ops.length; r++) n.ops[r].cm.curOp = null;
      wt(n)
    }
  }

  function wt(e) {
    for (var t = e.ops, n = 0; n < t.length; n++) St(t[n]);
    for (var n = 0; n < t.length; n++) Lt(t[n]);
    for (var n = 0; n < t.length; n++) kt(t[n]);
    for (var n = 0; n < t.length; n++) Tt(t[n]);
    for (var n = 0; n < t.length; n++) Mt(t[n])
  }

  function St(e) {
    var t = e.cm,
      n = t.display;
    T(t), e.updateMaxLine && d(t), e.mustUpdate = e.viewChanged || e.forceUpdate || null != e.scrollTop || e.scrollToPos && (e.scrollToPos.from.line < n.viewFrom || e.scrollToPos.to.line >= n.viewTo) || n.maxLineChanged && t.options.lineWrapping, e.update = e.mustUpdate && new k(t, e.mustUpdate && {
      top: e.scrollTop,
      ensure: e.scrollToPos
    }, e.forceUpdate)
  }

  function Lt(e) {
    e.updatedDisplay = e.mustUpdate && M(e.cm, e.update)
  }

  function kt(e) {
    var t = e.cm,
      n = t.display;
    e.updatedDisplay && H(t), e.barMeasure = p(t), n.maxLineChanged && !t.options.lineWrapping && (e.adjustWidthTo = Qe(t, n.maxLine, n.maxLine.text.length).left + 3, t.display.sizerWidth = e.adjustWidthTo, e.barMeasure.scrollWidth = Math.max(n.scroller.clientWidth, n.sizer.offsetLeft + e.adjustWidthTo + Ve(t) + t.display.barWidth), e.maxScrollLeft = Math.max(0, n.sizer.offsetLeft + e.adjustWidthTo - Ke(t))), (e.updatedDisplay || e.selectionChanged) && (e.preparedSelection = n.input.prepareSelection())
  }

  function Tt(e) {
    var t = e.cm;
    null != e.adjustWidthTo && (t.display.sizer.style.minWidth = e.adjustWidthTo + "px", e.maxScrollLeft < t.doc.scrollLeft && tn(t, Math.min(t.display.scroller.scrollLeft, e.maxScrollLeft), !0), t.display.maxLineChanged = !1), e.preparedSelection && t.display.input.showSelection(e.preparedSelection), e.updatedDisplay && N(t, e.barMeasure), (e.updatedDisplay || e.startHeight != t.doc.height) && y(t, e.barMeasure), e.selectionChanged && Ie(t), t.state.focused && e.updateInput && t.display.input.reset(e.typing), e.focus && e.focus == Gi() && $(e.cm)
  }

  function Mt(e) {
    var t = e.cm,
      n = t.display,
      r = t.doc;
    if (e.updatedDisplay && A(t, e.update), null == n.wheelStartX || null == e.scrollTop && null == e.scrollLeft && !e.scrollToPos || (n.wheelStartX = n.wheelStartY = null), null == e.scrollTop || n.scroller.scrollTop == e.scrollTop && !e.forceScroll || (r.scrollTop = Math.max(0, Math.min(n.scroller.scrollHeight - n.scroller.clientHeight, e.scrollTop)), n.scrollbars.setScrollTop(r.scrollTop), n.scroller.scrollTop = r.scrollTop), null == e.scrollLeft || n.scroller.scrollLeft == e.scrollLeft && !e.forceScroll || (r.scrollLeft = Math.max(0, Math.min(n.scroller.scrollWidth - Ke(t), e.scrollLeft)), n.scrollbars.setScrollLeft(r.scrollLeft), n.scroller.scrollLeft = r.scrollLeft, C(t)), e.scrollToPos) {
      var i = Hn(t, me(r, e.scrollToPos.from), me(r, e.scrollToPos.to), e.scrollToPos.margin);
      e.scrollToPos.isCursor && t.state.focused && Nn(t, i)
    }
    var o = e.maybeHiddenMarkers,
      l = e.maybeUnhiddenMarkers;
    if (o)
      for (var s = 0; s < o.length; ++s) o[s].lines.length || Tl(o[s], "hide");
    if (l)
      for (var s = 0; s < l.length; ++s) l[s].lines.length && Tl(l[s], "unhide");
    n.wrapper.offsetHeight && (r.scrollTop = t.display.scroller.scrollTop), e.changeObjs && Tl(t, "changes", t, e.changeObjs), e.update && e.update.finish()
  }

  function At(e, t) {
    if (e.curOp) return t();
    bt(e);
    try {
      return t()
    } finally {
      Ct(e)
    }
  }

  function Ot(e, t) {
    return function() {
      if (e.curOp) return t.apply(e, arguments);
      bt(e);
      try {
        return t.apply(e, arguments)
      } finally {
        Ct(e)
      }
    }
  }

  function Nt(e) {
    return function() {
      if (this.curOp) return e.apply(this, arguments);
      bt(this);
      try {
        return e.apply(this, arguments)
      } finally {
        Ct(this)
      }
    }
  }

  function Ht(e) {
    return function() {
      var t = this.cm;
      if (!t || t.curOp) return e.apply(this, arguments);
      bt(t);
      try {
        return e.apply(this, arguments)
      } finally {
        Ct(t)
      }
    }
  }

  function Pt(e, t, n) {
    this.line = t, this.rest = mr(t), this.size = this.rest ? Zr(Oi(this.rest)) - n + 1 : 1, this.node = this.text = null, this.hidden = br(e, t)
  }

  function Wt(e, t, n) {
    for (var r, i = [], o = t; n > o; o = r) {
      var l = new Pt(e.doc, Xr(e.doc, o), o);
      r = o + l.size, i.push(l)
    }
    return i
  }

  function Dt(e, t, n, r) {
    null == t && (t = e.doc.first), null == n && (n = e.doc.first + e.doc.size), r || (r = 0);
    var i = e.display;
    if (r && n < i.viewTo && (null == i.updateLineNumbers || i.updateLineNumbers > t) && (i.updateLineNumbers = t), e.curOp.viewChanged = !0, t >= i.viewTo) Ho && vr(e.doc, t) < i.viewTo && Ft(e);
    else if (n <= i.viewFrom) Ho && yr(e.doc, n + r) > i.viewFrom ? Ft(e) : (i.viewFrom += r, i.viewTo += r);
    else if (t <= i.viewFrom && n >= i.viewTo) Ft(e);
    else if (t <= i.viewFrom) {
      var o = zt(e, n, n + r, 1);
      o ? (i.view = i.view.slice(o.index), i.viewFrom = o.lineN, i.viewTo += r) : Ft(e)
    } else if (n >= i.viewTo) {
      var o = zt(e, t, t, -1);
      o ? (i.view = i.view.slice(0, o.index), i.viewTo = o.lineN) : Ft(e)
    } else {
      var l = zt(e, t, t, -1),
        s = zt(e, n, n + r, 1);
      l && s ? (i.view = i.view.slice(0, l.index).concat(Wt(e, l.lineN, s.lineN)).concat(i.view.slice(s.index)), i.viewTo += r) : Ft(e)
    }
    var a = i.externalMeasured;
    a && (n < a.lineN ? a.lineN += r : t < a.lineN + a.size && (i.externalMeasured = null))
  }

  function Et(e, t, n) {
    e.curOp.viewChanged = !0;
    var r = e.display,
      i = e.display.externalMeasured;
    if (i && t >= i.lineN && t < i.lineN + i.size && (r.externalMeasured = null), !(t < r.viewFrom || t >= r.viewTo)) {
      var o = r.view[It(e, t)];
      if (null != o.node) {
        var l = o.changes || (o.changes = []); - 1 == Ni(l, n) && l.push(n)
      }
    }
  }

  function Ft(e) {
    e.display.viewFrom = e.display.viewTo = e.doc.first, e.display.view = [], e.display.viewOffset = 0
  }

  function It(e, t) {
    if (t >= e.display.viewTo) return null;
    if (t -= e.display.viewFrom, 0 > t) return null;
    for (var n = e.display.view, r = 0; r < n.length; r++)
      if (t -= n[r].size, 0 > t) return r
  }

  function zt(e, t, n, r) {
    var i, o = It(e, t),
      l = e.display.view;
    if (!Ho || n == e.doc.first + e.doc.size) return {
      index: o,
      lineN: n
    };
    for (var s = 0, a = e.display.viewFrom; o > s; s++) a += l[s].size;
    if (a != t) {
      if (r > 0) {
        if (o == l.length - 1) return null;
        i = a + l[o].size - t, o++
      } else i = a - t;
      t += i, n += i
    }
    for (; vr(e.doc, n) != n;) {
      if (o == (0 > r ? 0 : l.length - 1)) return null;
      n += r * l[o - (0 > r ? 1 : 0)].size, o += r
    }
    return {
      index: o,
      lineN: n
    }
  }

  function Rt(e, t, n) {
    var r = e.display,
      i = r.view;
    0 == i.length || t >= r.viewTo || n <= r.viewFrom ? (r.view = Wt(e, t, n), r.viewFrom = t) : (r.viewFrom > t ? r.view = Wt(e, t, r.viewFrom).concat(r.view) : r.viewFrom < t && (r.view = r.view.slice(It(e, t))), r.viewFrom = t, r.viewTo < n ? r.view = r.view.concat(Wt(e, r.viewTo, n)) : r.viewTo > n && (r.view = r.view.slice(0, It(e, n)))), r.viewTo = n
  }

  function Bt(e) {
    for (var t = e.display.view, n = 0, r = 0; r < t.length; r++) {
      var i = t[r];
      i.hidden || i.node && !i.changes || ++n
    }
    return n
  }

  function jt(e) {
    function t() {
      i.activeTouch && (o = setTimeout(function() {
        i.activeTouch = null
      }, 1e3), l = i.activeTouch, l.end = +new Date)
    }

    function n(e) {
      if (1 != e.touches.length) return !1;
      var t = e.touches[0];
      return t.radiusX <= 1 && t.radiusY <= 1
    }

    function r(e, t) {
      if (null == t.left) return !0;
      var n = t.left - e.left,
        r = t.top - e.top;
      return n * n + r * r > 400
    }
    var i = e.display;
    Ll(i.scroller, "mousedown", Ot(e, Kt)), po && 11 > go ? Ll(i.scroller, "dblclick", Ot(e, function(t) {
      if (!wi(e, t)) {
        var n = Vt(e, t);
        if (n && !Qt(e, t) && !Ut(e.display, t)) {
          Cl(t);
          var r = e.findWordAt(n);
          Ce(e.doc, r.anchor, r.head)
        }
      }
    })) : Ll(i.scroller, "dblclick", function(t) {
      wi(e, t) || Cl(t)
    }), Oo || Ll(i.scroller, "contextmenu", function(t) {
      mn(e, t)
    });
    var o, l = {
      end: 0
    };
    Ll(i.scroller, "touchstart", function(e) {
      if (!n(e)) {
        clearTimeout(o);
        var t = +new Date;
        i.activeTouch = {
          start: t,
          moved: !1,
          prev: t - l.end <= 300 ? l : null
        }, 1 == e.touches.length && (i.activeTouch.left = e.touches[0].pageX, i.activeTouch.top = e.touches[0].pageY)
      }
    }), Ll(i.scroller, "touchmove", function() {
      i.activeTouch && (i.activeTouch.moved = !0)
    }), Ll(i.scroller, "touchend", function(n) {
      var o = i.activeTouch;
      if (o && !Ut(i, n) && null != o.left && !o.moved && new Date - o.start < 300) {
        var l, s = e.coordsChar(i.activeTouch, "page");
        l = !o.prev || r(o, o.prev) ? new de(s, s) : !o.prev.prev || r(o, o.prev.prev) ? e.findWordAt(s) : new de(Po(s.line, 0), me(e.doc, Po(s.line + 1, 0))), e.setSelection(l.anchor, l.head), e.focus(), Cl(n)
      }
      t()
    }), Ll(i.scroller, "touchcancel", t), Ll(i.scroller, "scroll", function() {
      i.scroller.clientHeight && (en(e, i.scroller.scrollTop), tn(e, i.scroller.scrollLeft, !0), Tl(e, "scroll", e))
    }), Ll(i.scroller, "mousewheel", function(t) {
      nn(e, t)
    }), Ll(i.scroller, "DOMMouseScroll", function(t) {
      nn(e, t)
    }), Ll(i.wrapper, "scroll", function() {
      i.wrapper.scrollTop = i.wrapper.scrollLeft = 0
    }), i.dragFunctions = {
      simple: function(t) {
        wi(e, t) || Sl(t)
      },
      start: function(t) {
        Jt(e, t)
      },
      drop: Ot(e, Zt)
    };
    var s = i.input.getField();
    Ll(s, "keyup", function(t) {
      fn.call(e, t)
    }), Ll(s, "keydown", Ot(e, cn)), Ll(s, "keypress", Ot(e, dn)), Ll(s, "focus", Ei(pn, e)), Ll(s, "blur", Ei(gn, e))
  }

  function Gt(t, n, r) {
    var i = r && r != e.Init;
    if (!n != !i) {
      var o = t.display.dragFunctions,
        l = n ? Ll : kl;
      l(t.display.scroller, "dragstart", o.start), l(t.display.scroller, "dragenter", o.simple), l(t.display.scroller, "dragover", o.simple), l(t.display.scroller, "drop", o.drop)
    }
  }

  function qt(e) {
    var t = e.display;
    (t.lastWrapHeight != t.wrapper.clientHeight || t.lastWrapWidth != t.wrapper.clientWidth) && (t.cachedCharWidth = t.cachedTextHeight = t.cachedPaddingH = null, t.scrollbarsClipped = !1, e.setSize())
  }

  function Ut(e, t) {
    for (var n = yi(t); n != e.wrapper; n = n.parentNode)
      if (!n || 1 == n.nodeType && "true" == n.getAttribute("cm-ignore-events") || n.parentNode == e.sizer && n != e.mover) return !0
  }

  function Vt(e, t, n, r) {
    var i = e.display;
    if (!n && "true" == yi(t).getAttribute("cm-not-content")) return null;
    var o, l, s = i.lineSpace.getBoundingClientRect();
    try {
      o = t.clientX - s.left, l = t.clientY - s.top
    } catch (t) {
      return null
    }
    var a, c = gt(e, o, l);
    if (r && 1 == c.xRel && (a = Xr(e.doc, c.line).text).length == c.ch) {
      var u = Wl(a, a.length, e.options.tabSize) - a.length;
      c = Po(c.line, Math.max(0, Math.round((o - Ue(e.display).left) / yt(e.display)) - u))
    }
    return c
  }

  function Kt(e) {
    var t = this,
      n = t.display;
    if (!(n.activeTouch && n.input.supportsTouch() || wi(t, e))) {
      if (n.shift = e.shiftKey, Ut(n, e)) return void(mo || (n.scroller.draggable = !1, setTimeout(function() {
        n.scroller.draggable = !0
      }, 100)));
      if (!Qt(t, e)) {
        var r = Vt(t, e);
        switch (window.focus(), bi(e)) {
          case 1:
            r ? _t(t, e, r) : yi(e) == n.scroller && Cl(e);
            break;
          case 2:
            mo && (t.state.lastMiddleDown = +new Date), r && Ce(t.doc, r), setTimeout(function() {
              n.input.focus()
            }, 20), Cl(e);
            break;
          case 3:
            Oo ? mn(t, e) : hn(t)
        }
      }
    }
  }

  function _t(e, t, n) {
    po ? setTimeout(Ei($, e), 0) : e.curOp.focus = Gi();
    var r, i = +new Date;
    Io && Io.time > i - 400 && 0 == Wo(Io.pos, n) ? r = "triple" : Fo && Fo.time > i - 400 && 0 == Wo(Fo.pos, n) ? (r = "double", Io = {
      time: i,
      pos: n
    }) : (r = "single", Fo = {
      time: i,
      pos: n
    });
    var o, l = e.doc.sel,
      s = ko ? t.metaKey : t.ctrlKey;
    e.options.dragDrop && Kl && !Q(e) && "single" == r && (o = l.contains(n)) > -1 && (Wo((o = l.ranges[o]).from(), n) < 0 || n.xRel > 0) && (Wo(o.to(), n) > 0 || n.xRel < 0) ? Xt(e, t, n, s) : Yt(e, t, n, r, s)
  }

  function Xt(e, t, n, r) {
    var i = e.display,
      o = +new Date,
      l = Ot(e, function(s) {
        mo && (i.scroller.draggable = !1), e.state.draggingText = !1, kl(document, "mouseup", l), kl(i.scroller, "drop", l), Math.abs(t.clientX - s.clientX) + Math.abs(t.clientY - s.clientY) < 10 && (Cl(s), !r && +new Date - 200 < o && Ce(e.doc, n), mo || po && 9 == go ? setTimeout(function() {
          document.body.focus(), i.input.focus()
        }, 20) : i.input.focus())
      });
    mo && (i.scroller.draggable = !0), e.state.draggingText = l, i.scroller.dragDrop && i.scroller.dragDrop(), Ll(document, "mouseup", l), Ll(i.scroller, "drop", l)
  }

  function Yt(e, t, n, r, i) {
    function o(t) {
      if (0 != Wo(m, t))
        if (m = t, "rect" == r) {
          for (var i = [], o = e.options.tabSize, l = Wl(Xr(c, n.line).text, n.ch, o), s = Wl(Xr(c, t.line).text, t.ch, o), a = Math.min(l, s), h = Math.max(l, s), p = Math.min(n.line, t.line), g = Math.min(e.lastLine(), Math.max(n.line, t.line)); g >= p; p++) {
            var v = Xr(c, p).text,
              y = Mi(v, a, o);
            a == h ? i.push(new de(Po(p, y), Po(p, y))) : v.length > y && i.push(new de(Po(p, y), Po(p, Mi(v, h, o))))
          }
          i.length || i.push(new de(n, n)), Me(c, he(d.ranges.slice(0, f).concat(i), f), {
            origin: "*mouse",
            scroll: !1
          }), e.scrollIntoView(t)
        } else {
          var b = u,
            x = b.anchor,
            C = t;
          if ("single" != r) {
            if ("double" == r) var w = e.findWordAt(t);
            else var w = new de(Po(t.line, 0), me(c, Po(t.line + 1, 0)));
            Wo(w.anchor, x) > 0 ? (C = w.head, x = Y(b.from(), w.anchor)) : (C = w.anchor, x = X(b.to(), w.head))
          }
          var i = d.ranges.slice(0);
          i[f] = new de(me(c, x), C), Me(c, he(i, f), Hl)
        }
    }

    function l(t) {
      var n = ++y,
        i = Vt(e, t, !0, "rect" == r);
      if (i)
        if (0 != Wo(i, m)) {
          e.curOp.focus = Gi(), o(i);
          var s = x(a, c);
          (i.line >= s.to || i.line < s.from) && setTimeout(Ot(e, function() {
            y == n && l(t)
          }), 150)
        } else {
          var u = t.clientY < v.top ? -20 : t.clientY > v.bottom ? 20 : 0;
          u && setTimeout(Ot(e, function() {
            y == n && (a.scroller.scrollTop += u, l(t))
          }), 50)
        }
    }

    function s(e) {
      y = 1 / 0, Cl(e), a.input.focus(), kl(document, "mousemove", b), kl(document, "mouseup", C), c.history.lastSelOrigin = null
    }
    var a = e.display,
      c = e.doc;
    Cl(t);
    var u, f, d = c.sel,
      h = d.ranges;
    if (i && !t.shiftKey ? (f = c.sel.contains(n), u = f > -1 ? h[f] : new de(n, n)) : (u = c.sel.primary(), f = c.sel.primIndex), t.altKey) r = "rect", i || (u = new de(n, n)), n = Vt(e, t, !0, !0), f = -1;
    else if ("double" == r) {
      var p = e.findWordAt(n);
      u = e.display.shift || c.extend ? xe(c, u, p.anchor, p.head) : p
    } else if ("triple" == r) {
      var g = new de(Po(n.line, 0), me(c, Po(n.line + 1, 0)));
      u = e.display.shift || c.extend ? xe(c, u, g.anchor, g.head) : g
    } else u = xe(c, u, n);
    i ? -1 == f ? (f = h.length, Me(c, he(h.concat([u]), f), {
      scroll: !1,
      origin: "*mouse"
    })) : h.length > 1 && h[f].empty() && "single" == r && !t.shiftKey ? (Me(c, he(h.slice(0, f).concat(h.slice(f + 1)), 0)), d = c.sel) : Se(c, f, u, Hl) : (f = 0, Me(c, new fe([u], 0), Hl), d = c.sel);
    var m = n,
      v = a.wrapper.getBoundingClientRect(),
      y = 0,
      b = Ot(e, function(e) {
        bi(e) ? l(e) : s(e)
      }),
      C = Ot(e, s);
    Ll(document, "mousemove", b), Ll(document, "mouseup", C)
  }

  function $t(e, t, n, r, i) {
    try {
      var o = t.clientX,
        l = t.clientY
    } catch (t) {
      return !1
    }
    if (o >= Math.floor(e.display.gutters.getBoundingClientRect().right)) return !1;
    r && Cl(t);
    var s = e.display,
      a = s.lineDiv.getBoundingClientRect();
    if (l > a.bottom || !Li(e, n)) return vi(t);
    l -= a.top - s.viewOffset;
    for (var c = 0; c < e.options.gutters.length; ++c) {
      var u = s.gutters.childNodes[c];
      if (u && u.getBoundingClientRect().right >= o) {
        var f = Jr(e.doc, l),
          d = e.options.gutters[c];
        return i(e, n, e, f, d, t), vi(t)
      }
    }
  }

  function Qt(e, t) {
    return $t(e, t, "gutterClick", !0, xi)
  }

  function Zt(e) {
    var t = this;
    if (!wi(t, e) && !Ut(t.display, e)) {
      Cl(e), po && (jo = +new Date);
      var n = Vt(t, e, !0),
        r = e.dataTransfer.files;
      if (n && !Q(t))
        if (r && r.length && window.FileReader && window.File)
          for (var i = r.length, o = Array(i), l = 0, s = function(e, r) {
              var s = new FileReader;
              s.onload = Ot(t, function() {
                if (o[r] = s.result, ++l == i) {
                  n = me(t.doc, n);
                  var e = {
                    from: n,
                    to: n,
                    text: t.doc.splitLines(o.join(t.doc.lineSeparator())),
                    origin: "paste"
                  };
                  Sn(t.doc, e), Te(t.doc, pe(n, _o(e)))
                }
              }), s.readAsText(e)
            }, a = 0; i > a; ++a) s(r[a], a);
        else {
          if (t.state.draggingText && t.doc.sel.contains(n) > -1) return t.state.draggingText(e), void setTimeout(function() {
            t.display.input.focus()
          }, 20);
          try {
            var o = e.dataTransfer.getData("Text");
            if (o) {
              if (t.state.draggingText && !(ko ? e.altKey : e.ctrlKey)) var c = t.listSelections();
              if (Ae(t.doc, pe(n, n)), c)
                for (var a = 0; a < c.length; ++a) On(t.doc, "", c[a].anchor, c[a].head, "drag");
              t.replaceSelection(o, "around", "paste"), t.display.input.focus()
            }
          } catch (e) {}
        }
    }
  }

  function Jt(e, t) {
    if (po && (!e.state.draggingText || +new Date - jo < 100)) return void Sl(t);
    if (!wi(e, t) && !Ut(e.display, t) && (t.dataTransfer.setData("Text", e.getSelection()), t.dataTransfer.setDragImage && !xo)) {
      var n = Ri("img", null, null, "position: fixed; left: 0; top: 0;");
      n.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", bo && (n.width = n.height = 1, e.display.wrapper.appendChild(n), n._top = n.offsetTop), t.dataTransfer.setDragImage(n, 0, 0), bo && n.parentNode.removeChild(n)
    }
  }

  function en(e, t) {
    Math.abs(e.doc.scrollTop - t) < 2 || (e.doc.scrollTop = t, uo || O(e, {
      top: t
    }), e.display.scroller.scrollTop != t && (e.display.scroller.scrollTop = t), e.display.scrollbars.setScrollTop(t), uo && O(e), ze(e, 100))
  }

  function tn(e, t, n) {
    (n ? t == e.doc.scrollLeft : Math.abs(e.doc.scrollLeft - t) < 2) || (t = Math.min(t, e.display.scroller.scrollWidth - e.display.scroller.clientWidth), e.doc.scrollLeft = t, C(e), e.display.scroller.scrollLeft != t && (e.display.scroller.scrollLeft = t), e.display.scrollbars.setScrollLeft(t))
  }

  function nn(e, t) {
    var n = Uo(t),
      r = n.x,
      i = n.y,
      o = e.display,
      l = o.scroller;
    if (r && l.scrollWidth > l.clientWidth || i && l.scrollHeight > l.clientHeight) {
      if (i && ko && mo) e: for (var s = t.target, a = o.view; s != l; s = s.parentNode)
        for (var c = 0; c < a.length; c++)
          if (a[c].node == s) {
            e.display.currentWheelTarget = s;
            break e
          }
      if (r && !uo && !bo && null != qo) return i && en(e, Math.max(0, Math.min(l.scrollTop + i * qo, l.scrollHeight - l.clientHeight))), tn(e, Math.max(0, Math.min(l.scrollLeft + r * qo, l.scrollWidth - l.clientWidth))), Cl(t), void(o.wheelStartX = null);
      if (i && null != qo) {
        var u = i * qo,
          f = e.doc.scrollTop,
          d = f + o.wrapper.clientHeight;
        0 > u ? f = Math.max(0, f + u - 50) : d = Math.min(e.doc.height, d + u + 50), O(e, {
          top: f,
          bottom: d
        })
      }
      20 > Go && (null == o.wheelStartX ? (o.wheelStartX = l.scrollLeft, o.wheelStartY = l.scrollTop, o.wheelDX = r, o.wheelDY = i, setTimeout(function() {
        if (null != o.wheelStartX) {
          var e = l.scrollLeft - o.wheelStartX,
            t = l.scrollTop - o.wheelStartY,
            n = t && o.wheelDY && t / o.wheelDY || e && o.wheelDX && e / o.wheelDX;
          o.wheelStartX = o.wheelStartY = null, n && (qo = (qo * Go + n) / (Go + 1), ++Go)
        }
      }, 200)) : (o.wheelDX += r, o.wheelDY += i))
    }
  }

  function rn(e, t, n) {
    if ("string" == typeof t && (t = il[t], !t)) return !1;
    e.display.input.ensurePolled();
    var r = e.display.shift,
      i = !1;
    try {
      Q(e) && (e.state.suppressEdits = !0), n && (e.display.shift = !1), i = t(e) != Ol
    } finally {
      e.display.shift = r, e.state.suppressEdits = !1
    }
    return i
  }

  function on(e, t, n) {
    for (var r = 0; r < e.state.keyMaps.length; r++) {
      var i = ll(t, e.state.keyMaps[r], n, e);
      if (i) return i
    }
    return e.options.extraKeys && ll(t, e.options.extraKeys, n, e) || ll(t, e.options.keyMap, n, e)
  }

  function ln(e, t, n, r) {
    var i = e.state.keySeq;
    if (i) {
      if (sl(t)) return "handled";
      Vo.set(50, function() {
        e.state.keySeq == i && (e.state.keySeq = null, e.display.input.reset())
      }), t = i + " " + t
    }
    var o = on(e, t, r);
    return "multi" == o && (e.state.keySeq = t), "handled" == o && xi(e, "keyHandled", e, t, n), ("handled" == o || "multi" == o) && (Cl(n), Ie(e)), i && !o && /\'$/.test(t) ? (Cl(n), !0) : !!o
  }

  function sn(e, t) {
    var n = al(t, !0);
    return n ? t.shiftKey && !e.state.keySeq ? ln(e, "Shift-" + n, t, function(t) {
      return rn(e, t, !0)
    }) || ln(e, n, t, function(t) {
      return ("string" == typeof t ? /^go[A-Z]/.test(t) : t.motion) ? rn(e, t) : void 0
    }) : ln(e, n, t, function(t) {
      return rn(e, t)
    }) : !1
  }

  function an(e, t, n) {
    return ln(e, "'" + n + "'", t, function(t) {
      return rn(e, t, !0)
    })
  }

  function cn(e) {
    var t = this;
    if (t.curOp.focus = Gi(), !wi(t, e)) {
      po && 11 > go && 27 == e.keyCode && (e.returnValue = !1);
      var n = e.keyCode;
      t.display.shift = 16 == n || e.shiftKey;
      var r = sn(t, e);
      bo && (Ko = r ? n : null, !r && 88 == n && !Yl && (ko ? e.metaKey : e.ctrlKey) && t.replaceSelection("", null, "cut")), 18 != n || /\bCodeMirror-crosshair\b/.test(t.display.lineDiv.className) || un(t)
    }
  }

  function un(e) {
    function t(e) {
      18 != e.keyCode && e.altKey || (ql(n, "CodeMirror-crosshair"), kl(document, "keyup", t), kl(document, "mouseover", t))
    }
    var n = e.display.lineDiv;
    Ul(n, "CodeMirror-crosshair"), Ll(document, "keyup", t), Ll(document, "mouseover", t)
  }

  function fn(e) {
    16 == e.keyCode && (this.doc.sel.shift = !1), wi(this, e)
  }

  function dn(e) {
    var t = this;
    if (!(Ut(t.display, e) || wi(t, e) || e.ctrlKey && !e.altKey || ko && e.metaKey)) {
      var n = e.keyCode,
        r = e.charCode;
      if (bo && n == Ko) return Ko = null, void Cl(e);
      if (!bo || e.which && !(e.which < 10) || !sn(t, e)) {
        var i = String.fromCharCode(null == r ? n : r);
        an(t, e, i) || t.display.input.onKeyPress(e)
      }
    }
  }

  function hn(e) {
    e.state.delayingBlurEvent = !0, setTimeout(function() {
      e.state.delayingBlurEvent && (e.state.delayingBlurEvent = !1, gn(e))
    }, 100)
  }

  function pn(e) {
    e.state.delayingBlurEvent && (e.state.delayingBlurEvent = !1), "nocursor" != e.options.readOnly && (e.state.focused || (Tl(e, "focus", e), e.state.focused = !0, Ul(e.display.wrapper, "CodeMirror-focused"), e.curOp || e.display.selForContextMenu == e.doc.sel || (e.display.input.reset(), mo && setTimeout(function() {
      e.display.input.reset(!0)
    }, 20)), e.display.input.receivedFocus()), Ie(e))
  }

  function gn(e) {
    e.state.delayingBlurEvent || (e.state.focused && (Tl(e, "blur", e), e.state.focused = !1, ql(e.display.wrapper, "CodeMirror-focused")), clearInterval(e.display.blinker), setTimeout(function() {
      e.state.focused || (e.display.shift = !1)
    }, 150))
  }

  function mn(e, t) {
    Ut(e.display, t) || vn(e, t) || e.display.input.onContextMenu(t)
  }

  function vn(e, t) {
    return Li(e, "gutterContextMenu") ? $t(e, t, "gutterContextMenu", !1, Tl) : !1
  }

  function yn(e, t) {
    if (Wo(e, t.from) < 0) return e;
    if (Wo(e, t.to) <= 0) return _o(t);
    var n = e.line + t.text.length - (t.to.line - t.from.line) - 1,
      r = e.ch;
    return e.line == t.to.line && (r += _o(t).ch - t.to.ch), Po(n, r)
  }

  function bn(e, t) {
    for (var n = [], r = 0; r < e.sel.ranges.length; r++) {
      var i = e.sel.ranges[r];
      n.push(new de(yn(i.anchor, t), yn(i.head, t)))
    }
    return he(n, e.sel.primIndex)
  }

  function xn(e, t, n) {
    return e.line == t.line ? Po(n.line, e.ch - t.ch + n.ch) : Po(n.line + (e.line - t.line), e.ch)
  }

  function Cn(e, t, n) {
    for (var r = [], i = Po(e.first, 0), o = i, l = 0; l < t.length; l++) {
      var s = t[l],
        a = xn(s.from, i, o),
        c = xn(_o(s), i, o);
      if (i = s.to, o = c, "around" == n) {
        var u = e.sel.ranges[l],
          f = Wo(u.head, u.anchor) < 0;
        r[l] = new de(f ? c : a, f ? a : c)
      } else r[l] = new de(a, a)
    }
    return new fe(r, e.sel.primIndex)
  }

  function wn(e, t, n) {
    var r = {
      canceled: !1,
      from: t.from,
      to: t.to,
      text: t.text,
      origin: t.origin,
      cancel: function() {
        this.canceled = !0
      }
    };
    return n && (r.update = function(t, n, r, i) {
      t && (this.from = me(e, t)), n && (this.to = me(e, n)), r && (this.text = r), void 0 !== i && (this.origin = i)
    }), Tl(e, "beforeChange", e, r), e.cm && Tl(e.cm, "beforeChange", e.cm, r), r.canceled ? null : {
      from: r.from,
      to: r.to,
      text: r.text,
      origin: r.origin
    }
  }

  function Sn(e, t, n) {
    if (e.cm) {
      if (!e.cm.curOp) return Ot(e.cm, Sn)(e, t, n);
      if (e.cm.state.suppressEdits) return
    }
    if (!(Li(e, "beforeChange") || e.cm && Li(e.cm, "beforeChange")) || (t = wn(e, t, !0))) {
      var r = No && !n && or(e, t.from, t.to);
      if (r)
        for (var i = r.length - 1; i >= 0; --i) Ln(e, {
          from: r[i].from,
          to: r[i].to,
          text: i ? [""] : t.text
        });
      else Ln(e, t)
    }
  }

  function Ln(e, t) {
    if (1 != t.text.length || "" != t.text[0] || 0 != Wo(t.from, t.to)) {
      var n = bn(e, t);
      li(e, t, n, e.cm ? e.cm.curOp.id : 0 / 0), Mn(e, t, n, nr(e, t));
      var r = [];
      Kr(e, function(e, n) {
        n || -1 != Ni(r, e.history) || (mi(e.history, t), r.push(e.history)), Mn(e, t, null, nr(e, t))
      })
    }
  }

  function kn(e, t, n) {
    if (!e.cm || !e.cm.state.suppressEdits) {
      for (var r, i = e.history, o = e.sel, l = "undo" == t ? i.done : i.undone, s = "undo" == t ? i.undone : i.done, a = 0; a < l.length && (r = l[a], n ? !r.ranges || r.equals(e.sel) : r.ranges); a++);
      if (a != l.length) {
        for (i.lastOrigin = i.lastSelOrigin = null; r = l.pop(), r.ranges;) {
          if (ci(r, s), n && !r.equals(e.sel)) return void Me(e, r, {
            clearRedo: !1
          });
          o = r
        }
        var c = [];
        ci(o, s), s.push({
          changes: c,
          generation: i.generation
        }), i.generation = r.generation || ++i.maxGeneration;
        for (var u = Li(e, "beforeChange") || e.cm && Li(e.cm, "beforeChange"), a = r.changes.length - 1; a >= 0; --a) {
          var f = r.changes[a];
          if (f.origin = t, u && !wn(e, f, !1)) return void(l.length = 0);
          c.push(ri(e, f));
          var d = a ? bn(e, f) : Oi(l);
          Mn(e, f, d, ir(e, f)), !a && e.cm && e.cm.scrollIntoView({
            from: f.from,
            to: _o(f)
          });
          var h = [];
          Kr(e, function(e, t) {
            t || -1 != Ni(h, e.history) || (mi(e.history, f), h.push(e.history)), Mn(e, f, null, ir(e, f))
          })
        }
      }
    }
  }

  function Tn(e, t) {
    if (0 != t && (e.first += t, e.sel = new fe(Hi(e.sel.ranges, function(e) {
        return new de(Po(e.anchor.line + t, e.anchor.ch), Po(e.head.line + t, e.head.ch))
      }), e.sel.primIndex), e.cm)) {
      Dt(e.cm, e.first, e.first - t, t);
      for (var n = e.cm.display, r = n.viewFrom; r < n.viewTo; r++) Et(e.cm, r, "gutter")
    }
  }

  function Mn(e, t, n, r) {
    if (e.cm && !e.cm.curOp) return Ot(e.cm, Mn)(e, t, n, r);
    if (t.to.line < e.first) return void Tn(e, t.text.length - 1 - (t.to.line - t.from.line));
    if (!(t.from.line > e.lastLine())) {
      if (t.from.line < e.first) {
        var i = t.text.length - 1 - (e.first - t.from.line);
        Tn(e, i), t = {
          from: Po(e.first, 0),
          to: Po(t.to.line + i, t.to.ch),
          text: [Oi(t.text)],
          origin: t.origin
        }
      }
      var o = e.lastLine();
      t.to.line > o && (t = {
        from: t.from,
        to: Po(o, Xr(e, o).text.length),
        text: [t.text[0]],
        origin: t.origin
      }), t.removed = Yr(e, t.from, t.to), n || (n = bn(e, t)), e.cm ? An(e.cm, t, r) : qr(e, t, r), Ae(e, n, Nl)
    }
  }

  function An(e, t, n) {
    var r = e.doc,
      i = e.display,
      l = t.from,
      s = t.to,
      a = !1,
      c = l.line;
    e.options.lineWrapping || (c = Zr(gr(Xr(r, l.line))), r.iter(c, s.line + 1, function(e) {
      return e == i.maxLine ? (a = !0, !0) : void 0
    })), r.sel.contains(t.from, t.to) > -1 && Si(e), qr(r, t, n, o(e)), e.options.lineWrapping || (r.iter(c, l.line + t.text.length, function(e) {
      var t = f(e);
      t > i.maxLineLength && (i.maxLine = e, i.maxLineLength = t, i.maxLineChanged = !0, a = !1)
    }), a && (e.curOp.updateMaxLine = !0)), r.frontier = Math.min(r.frontier, l.line), ze(e, 400);
    var u = t.text.length - (s.line - l.line) - 1;
    t.full ? Dt(e) : l.line != s.line || 1 != t.text.length || Gr(e.doc, t) ? Dt(e, l.line, s.line + 1, u) : Et(e, l.line, "text");
    var d = Li(e, "changes"),
      h = Li(e, "change");
    if (h || d) {
      var p = {
        from: l,
        to: s,
        text: t.text,
        removed: t.removed,
        origin: t.origin
      };
      h && xi(e, "change", e, p), d && (e.curOp.changeObjs || (e.curOp.changeObjs = [])).push(p)
    }
    e.display.selForContextMenu = null
  }

  function On(e, t, n, r, i) {
    if (r || (r = n), Wo(r, n) < 0) {
      var o = r;
      r = n, n = o
    }
    "string" == typeof t && (t = e.splitLines(t)), Sn(e, {
      from: n,
      to: r,
      text: t,
      origin: i
    })
  }

  function Nn(e, t) {
    if (!wi(e, "scrollCursorIntoView")) {
      var n = e.display,
        r = n.sizer.getBoundingClientRect(),
        i = null;
      if (t.top + r.top < 0 ? i = !0 : t.bottom + r.top > (window.innerHeight || document.documentElement.clientHeight) && (i = !1), null != i && !wo) {
        var o = Ri("div", "​", null, "position: absolute; top: " + (t.top - n.viewOffset - Ge(e.display)) + "px; height: " + (t.bottom - t.top + Ve(e) + n.barHeight) + "px; left: " + t.left + "px; width: 2px;");
        e.display.lineSpace.appendChild(o), o.scrollIntoView(i), e.display.lineSpace.removeChild(o)
      }
    }
  }

  function Hn(e, t, n, r) {
    null == r && (r = 0);
    for (var i = 0; 5 > i; i++) {
      var o = !1,
        l = dt(e, t),
        s = n && n != t ? dt(e, n) : l,
        a = Wn(e, Math.min(l.left, s.left), Math.min(l.top, s.top) - r, Math.max(l.left, s.left), Math.max(l.bottom, s.bottom) + r),
        c = e.doc.scrollTop,
        u = e.doc.scrollLeft;
      if (null != a.scrollTop && (en(e, a.scrollTop), Math.abs(e.doc.scrollTop - c) > 1 && (o = !0)), null != a.scrollLeft && (tn(e, a.scrollLeft), Math.abs(e.doc.scrollLeft - u) > 1 && (o = !0)), !o) break
    }
    return l
  }

  function Pn(e, t, n, r, i) {
    var o = Wn(e, t, n, r, i);
    null != o.scrollTop && en(e, o.scrollTop), null != o.scrollLeft && tn(e, o.scrollLeft)
  }

  function Wn(e, t, n, r, i) {
    var o = e.display,
      l = vt(e.display);
    0 > n && (n = 0);
    var s = e.curOp && null != e.curOp.scrollTop ? e.curOp.scrollTop : o.scroller.scrollTop,
      a = _e(e),
      c = {};
    i - n > a && (i = n + a);
    var u = e.doc.height + qe(o),
      f = l > n,
      d = i > u - l;
    if (s > n) c.scrollTop = f ? 0 : n;
    else if (i > s + a) {
      var h = Math.min(n, (d ? u : i) - a);
      h != s && (c.scrollTop = h)
    }
    var p = e.curOp && null != e.curOp.scrollLeft ? e.curOp.scrollLeft : o.scroller.scrollLeft,
      g = Ke(e) - (e.options.fixedGutter ? o.gutters.offsetWidth : 0),
      m = r - t > g;
    return m && (r = t + g), 10 > t ? c.scrollLeft = 0 : p > t ? c.scrollLeft = Math.max(0, t - (m ? 0 : 10)) : r > g + p - 3 && (c.scrollLeft = r + (m ? 0 : 10) - g), c
  }

  function Dn(e, t, n) {
    (null != t || null != n) && Fn(e), null != t && (e.curOp.scrollLeft = (null == e.curOp.scrollLeft ? e.doc.scrollLeft : e.curOp.scrollLeft) + t), null != n && (e.curOp.scrollTop = (null == e.curOp.scrollTop ? e.doc.scrollTop : e.curOp.scrollTop) + n)
  }

  function En(e) {
    Fn(e);
    var t = e.getCursor(),
      n = t,
      r = t;
    e.options.lineWrapping || (n = t.ch ? Po(t.line, t.ch - 1) : t, r = Po(t.line, t.ch + 1)), e.curOp.scrollToPos = {
      from: n,
      to: r,
      margin: e.options.cursorScrollMargin,
      isCursor: !0
    }
  }

  function Fn(e) {
    var t = e.curOp.scrollToPos;
    if (t) {
      e.curOp.scrollToPos = null;
      var n = ht(e, t.from),
        r = ht(e, t.to),
        i = Wn(e, Math.min(n.left, r.left), Math.min(n.top, r.top) - t.margin, Math.max(n.right, r.right), Math.max(n.bottom, r.bottom) + t.margin);
      e.scrollTo(i.scrollLeft, i.scrollTop)
    }
  }

  function In(e, t, n, r) {
    var i, o = e.doc;
    null == n && (n = "add"), "smart" == n && (o.mode.indent ? i = je(e, t) : n = "prev");
    var l = e.options.tabSize,
      s = Xr(o, t),
      a = Wl(s.text, null, l);
    s.stateAfter && (s.stateAfter = null);
    var c, u = s.text.match(/^\s*/)[0];
    if (r || /\S/.test(s.text)) {
      if ("smart" == n && (c = o.mode.indent(i, s.text.slice(u.length), s.text), c == Ol || c > 150)) {
        if (!r) return;
        n = "prev"
      }
    } else c = 0, n = "not";
    "prev" == n ? c = t > o.first ? Wl(Xr(o, t - 1).text, null, l) : 0 : "add" == n ? c = a + e.options.indentUnit : "subtract" == n ? c = a - e.options.indentUnit : "number" == typeof n && (c = a + n), c = Math.max(0, c);
    var f = "",
      d = 0;
    if (e.options.indentWithTabs)
      for (var h = Math.floor(c / l); h; --h) d += l, f += "	";
    if (c > d && (f += Ai(c - d)), f != u) return On(o, f, Po(t, 0), Po(t, u.length), "+input"), s.stateAfter = null, !0;
    for (var h = 0; h < o.sel.ranges.length; h++) {
      var p = o.sel.ranges[h];
      if (p.head.line == t && p.head.ch < u.length) {
        var d = Po(t, u.length);
        Se(o, h, new de(d, d));
        break
      }
    }
  }

  function zn(e, t, n, r) {
    var i = t,
      o = t;
    return "number" == typeof t ? o = Xr(e, ge(e, t)) : i = Zr(t), null == i ? null : (r(o, i) && e.cm && Et(e.cm, i, n), o)
  }

  function Rn(e, t) {
    for (var n = e.doc.sel.ranges, r = [], i = 0; i < n.length; i++) {
      for (var o = t(n[i]); r.length && Wo(o.from, Oi(r).to) <= 0;) {
        var l = r.pop();
        if (Wo(l.from, o.from) < 0) {
          o.from = l.from;
          break
        }
      }
      r.push(o)
    }
    At(e, function() {
      for (var t = r.length - 1; t >= 0; t--) On(e.doc, "", r[t].from, r[t].to, "+delete");
      En(e)
    })
  }

  function Bn(e, t, n, r, i) {
    function o() {
      var t = s + n;

      return t < e.first || t >= e.first + e.size ? f = !1 : (s = t, u = Xr(e, t))
    }

    function l(e) {
      var t = (i ? ao : co)(u, a, n, !0);
      if (null == t) {
        if (e || !o()) return f = !1;
        a = i ? (0 > n ? to : eo)(u) : 0 > n ? u.text.length : 0
      } else a = t;
      return !0
    }
    var s = t.line,
      a = t.ch,
      c = n,
      u = Xr(e, s),
      f = !0;
    if ("char" == r) l();
    else if ("column" == r) l(!0);
    else if ("word" == r || "group" == r)
      for (var d = null, h = "group" == r, p = e.cm && e.cm.getHelper(t, "wordChars"), g = !0; !(0 > n) || l(!g); g = !1) {
        var m = u.text.charAt(a) || "\n",
          v = Fi(m, p) ? "w" : h && "\n" == m ? "n" : !h || /\s/.test(m) ? null : "p";
        if (!h || g || v || (v = "s"), d && d != v) {
          0 > n && (n = 1, l());
          break
        }
        if (v && (d = v), n > 0 && !l(!g)) break
      }
    var y = Pe(e, Po(s, a), c, !0);
    return f || (y.hitSide = !0), y
  }

  function jn(e, t, n, r) {
    var i, o = e.doc,
      l = t.left;
    if ("page" == r) {
      var s = Math.min(e.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
      i = t.top + n * (s - (0 > n ? 1.5 : .5) * vt(e.display))
    } else "line" == r && (i = n > 0 ? t.bottom + 3 : t.top - 3);
    for (;;) {
      var a = gt(e, l, i);
      if (!a.outside) break;
      if (0 > n ? 0 >= i : i >= o.height) {
        a.hitSide = !0;
        break
      }
      i += 5 * n
    }
    return a
  }

  function Gn(t, n, r, i) {
    e.defaults[t] = n, r && (Yo[t] = i ? function(e, t, n) {
      n != $o && r(e, t, n)
    } : r)
  }

  function qn(e) {
    for (var t, n, r, i, o = e.split(/-(?!$)/), e = o[o.length - 1], l = 0; l < o.length - 1; l++) {
      var s = o[l];
      if (/^(cmd|meta|m)$/i.test(s)) i = !0;
      else if (/^a(lt)?$/i.test(s)) t = !0;
      else if (/^(c|ctrl|control)$/i.test(s)) n = !0;
      else {
        if (!/^s(hift)$/i.test(s)) throw new Error("Unrecognized modifier name: " + s);
        r = !0
      }
    }
    return t && (e = "Alt-" + e), n && (e = "Ctrl-" + e), i && (e = "Cmd-" + e), r && (e = "Shift-" + e), e
  }

  function Un(e) {
    return "string" == typeof e ? ol[e] : e
  }

  function Vn(e, t, n, r, i) {
    if (r && r.shared) return Kn(e, t, n, r, i);
    if (e.cm && !e.cm.curOp) return Ot(e.cm, Vn)(e, t, n, r, i);
    var o = new fl(e, i),
      l = Wo(t, n);
    if (r && Di(r, o, !1), l > 0 || 0 == l && o.clearWhenEmpty !== !1) return o;
    if (o.replacedWith && (o.collapsed = !0, o.widgetNode = Ri("span", [o.replacedWith], "CodeMirror-widget"), r.handleMouseEvents || o.widgetNode.setAttribute("cm-ignore-events", "true"), r.insertLeft && (o.widgetNode.insertLeft = !0)), o.collapsed) {
      if (pr(e, t.line, t, n, o) || t.line != n.line && pr(e, n.line, t, n, o)) throw new Error("Inserting collapsed marker partially overlapping an existing one");
      Ho = !0
    }
    o.addToHistory && li(e, {
      from: t,
      to: n,
      origin: "markText"
    }, e.sel, 0 / 0);
    var s, a = t.line,
      c = e.cm;
    if (e.iter(a, n.line + 1, function(e) {
        c && o.collapsed && !c.options.lineWrapping && gr(e) == c.display.maxLine && (s = !0), o.collapsed && a != t.line && Qr(e, 0), Jn(e, new $n(o, a == t.line ? t.ch : null, a == n.line ? n.ch : null)), ++a
      }), o.collapsed && e.iter(t.line, n.line + 1, function(t) {
        br(e, t) && Qr(t, 0)
      }), o.clearOnEnter && Ll(o, "beforeCursorEnter", function() {
        o.clear()
      }), o.readOnly && (No = !0, (e.history.done.length || e.history.undone.length) && e.clearHistory()), o.collapsed && (o.id = ++ul, o.atomic = !0), c) {
      if (s && (c.curOp.updateMaxLine = !0), o.collapsed) Dt(c, t.line, n.line + 1);
      else if (o.className || o.title || o.startStyle || o.endStyle || o.css)
        for (var u = t.line; u <= n.line; u++) Et(c, u, "text");
      o.atomic && Ne(c.doc), xi(c, "markerAdded", c, o)
    }
    return o
  }

  function Kn(e, t, n, r, i) {
    r = Di(r), r.shared = !1;
    var o = [Vn(e, t, n, r, i)],
      l = o[0],
      s = r.widgetNode;
    return Kr(e, function(e) {
      s && (r.widgetNode = s.cloneNode(!0)), o.push(Vn(e, me(e, t), me(e, n), r, i));
      for (var a = 0; a < e.linked.length; ++a)
        if (e.linked[a].isParent) return;
      l = Oi(o)
    }), new dl(o, l)
  }

  function _n(e) {
    return e.findMarks(Po(e.first, 0), e.clipPos(Po(e.lastLine())), function(e) {
      return e.parent
    })
  }

  function Xn(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n],
        i = r.find(),
        o = e.clipPos(i.from),
        l = e.clipPos(i.to);
      if (Wo(o, l)) {
        var s = Vn(e, o, l, r.primary, r.primary.type);
        r.markers.push(s), s.parent = r
      }
    }
  }

  function Yn(e) {
    for (var t = 0; t < e.length; t++) {
      var n = e[t],
        r = [n.primary.doc];
      Kr(n.primary.doc, function(e) {
        r.push(e)
      });
      for (var i = 0; i < n.markers.length; i++) {
        var o = n.markers[i]; - 1 == Ni(r, o.doc) && (o.parent = null, n.markers.splice(i--, 1))
      }
    }
  }

  function $n(e, t, n) {
    this.marker = e, this.from = t, this.to = n
  }

  function Qn(e, t) {
    if (e)
      for (var n = 0; n < e.length; ++n) {
        var r = e[n];
        if (r.marker == t) return r
      }
  }

  function Zn(e, t) {
    for (var n, r = 0; r < e.length; ++r) e[r] != t && (n || (n = [])).push(e[r]);
    return n
  }

  function Jn(e, t) {
    e.markedSpans = e.markedSpans ? e.markedSpans.concat([t]) : [t], t.marker.attachLine(e)
  }

  function er(e, t, n) {
    if (e)
      for (var r, i = 0; i < e.length; ++i) {
        var o = e[i],
          l = o.marker,
          s = null == o.from || (l.inclusiveLeft ? o.from <= t : o.from < t);
        if (s || o.from == t && "bookmark" == l.type && (!n || !o.marker.insertLeft)) {
          var a = null == o.to || (l.inclusiveRight ? o.to >= t : o.to > t);
          (r || (r = [])).push(new $n(l, o.from, a ? null : o.to))
        }
      }
    return r
  }

  function tr(e, t, n) {
    if (e)
      for (var r, i = 0; i < e.length; ++i) {
        var o = e[i],
          l = o.marker,
          s = null == o.to || (l.inclusiveRight ? o.to >= t : o.to > t);
        if (s || o.from == t && "bookmark" == l.type && (!n || o.marker.insertLeft)) {
          var a = null == o.from || (l.inclusiveLeft ? o.from <= t : o.from < t);
          (r || (r = [])).push(new $n(l, a ? null : o.from - t, null == o.to ? null : o.to - t))
        }
      }
    return r
  }

  function nr(e, t) {
    if (t.full) return null;
    var n = ye(e, t.from.line) && Xr(e, t.from.line).markedSpans,
      r = ye(e, t.to.line) && Xr(e, t.to.line).markedSpans;
    if (!n && !r) return null;
    var i = t.from.ch,
      o = t.to.ch,
      l = 0 == Wo(t.from, t.to),
      s = er(n, i, l),
      a = tr(r, o, l),
      c = 1 == t.text.length,
      u = Oi(t.text).length + (c ? i : 0);
    if (s)
      for (var f = 0; f < s.length; ++f) {
        var d = s[f];
        if (null == d.to) {
          var h = Qn(a, d.marker);
          h ? c && (d.to = null == h.to ? null : h.to + u) : d.to = i
        }
      }
    if (a)
      for (var f = 0; f < a.length; ++f) {
        var d = a[f];
        if (null != d.to && (d.to += u), null == d.from) {
          var h = Qn(s, d.marker);
          h || (d.from = u, c && (s || (s = [])).push(d))
        } else d.from += u, c && (s || (s = [])).push(d)
      }
    s && (s = rr(s)), a && a != s && (a = rr(a));
    var p = [s];
    if (!c) {
      var g, m = t.text.length - 2;
      if (m > 0 && s)
        for (var f = 0; f < s.length; ++f) null == s[f].to && (g || (g = [])).push(new $n(s[f].marker, null, null));
      for (var f = 0; m > f; ++f) p.push(g);
      p.push(a)
    }
    return p
  }

  function rr(e) {
    for (var t = 0; t < e.length; ++t) {
      var n = e[t];
      null != n.from && n.from == n.to && n.marker.clearWhenEmpty !== !1 && e.splice(t--, 1)
    }
    return e.length ? e : null
  }

  function ir(e, t) {
    var n = di(e, t),
      r = nr(e, t);
    if (!n) return r;
    if (!r) return n;
    for (var i = 0; i < n.length; ++i) {
      var o = n[i],
        l = r[i];
      if (o && l) e: for (var s = 0; s < l.length; ++s) {
        for (var a = l[s], c = 0; c < o.length; ++c)
          if (o[c].marker == a.marker) continue e;
        o.push(a)
      } else l && (n[i] = l)
    }
    return n
  }

  function or(e, t, n) {
    var r = null;
    if (e.iter(t.line, n.line + 1, function(e) {
        if (e.markedSpans)
          for (var t = 0; t < e.markedSpans.length; ++t) {
            var n = e.markedSpans[t].marker;
            !n.readOnly || r && -1 != Ni(r, n) || (r || (r = [])).push(n)
          }
      }), !r) return null;
    for (var i = [{
        from: t,
        to: n
      }], o = 0; o < r.length; ++o)
      for (var l = r[o], s = l.find(0), a = 0; a < i.length; ++a) {
        var c = i[a];
        if (!(Wo(c.to, s.from) < 0 || Wo(c.from, s.to) > 0)) {
          var u = [a, 1],
            f = Wo(c.from, s.from),
            d = Wo(c.to, s.to);
          (0 > f || !l.inclusiveLeft && !f) && u.push({
            from: c.from,
            to: s.from
          }), (d > 0 || !l.inclusiveRight && !d) && u.push({
            from: s.to,
            to: c.to
          }), i.splice.apply(i, u), a += u.length - 1
        }
      }
    return i
  }

  function lr(e) {
    var t = e.markedSpans;
    if (t) {
      for (var n = 0; n < t.length; ++n) t[n].marker.detachLine(e);
      e.markedSpans = null
    }
  }

  function sr(e, t) {
    if (t) {
      for (var n = 0; n < t.length; ++n) t[n].marker.attachLine(e);
      e.markedSpans = t
    }
  }

  function ar(e) {
    return e.inclusiveLeft ? -1 : 0
  }

  function cr(e) {
    return e.inclusiveRight ? 1 : 0
  }

  function ur(e, t) {
    var n = e.lines.length - t.lines.length;
    if (0 != n) return n;
    var r = e.find(),
      i = t.find(),
      o = Wo(r.from, i.from) || ar(e) - ar(t);
    if (o) return -o;
    var l = Wo(r.to, i.to) || cr(e) - cr(t);
    return l ? l : t.id - e.id
  }

  function fr(e, t) {
    var n, r = Ho && e.markedSpans;
    if (r)
      for (var i, o = 0; o < r.length; ++o) i = r[o], i.marker.collapsed && null == (t ? i.from : i.to) && (!n || ur(n, i.marker) < 0) && (n = i.marker);
    return n
  }

  function dr(e) {
    return fr(e, !0)
  }

  function hr(e) {
    return fr(e, !1)
  }

  function pr(e, t, n, r, i) {
    var o = Xr(e, t),
      l = Ho && o.markedSpans;
    if (l)
      for (var s = 0; s < l.length; ++s) {
        var a = l[s];
        if (a.marker.collapsed) {
          var c = a.marker.find(0),
            u = Wo(c.from, n) || ar(a.marker) - ar(i),
            f = Wo(c.to, r) || cr(a.marker) - cr(i);
          if (!(u >= 0 && 0 >= f || 0 >= u && f >= 0) && (0 >= u && (Wo(c.to, n) > 0 || a.marker.inclusiveRight && i.inclusiveLeft) || u >= 0 && (Wo(c.from, r) < 0 || a.marker.inclusiveLeft && i.inclusiveRight))) return !0
        }
      }
  }

  function gr(e) {
    for (var t; t = dr(e);) e = t.find(-1, !0).line;
    return e
  }

  function mr(e) {
    for (var t, n; t = hr(e);) e = t.find(1, !0).line, (n || (n = [])).push(e);
    return n
  }

  function vr(e, t) {
    var n = Xr(e, t),
      r = gr(n);
    return n == r ? t : Zr(r)
  }

  function yr(e, t) {
    if (t > e.lastLine()) return t;
    var n, r = Xr(e, t);
    if (!br(e, r)) return t;
    for (; n = hr(r);) r = n.find(1, !0).line;
    return Zr(r) + 1
  }

  function br(e, t) {
    var n = Ho && t.markedSpans;
    if (n)
      for (var r, i = 0; i < n.length; ++i)
        if (r = n[i], r.marker.collapsed) {
          if (null == r.from) return !0;
          if (!r.marker.widgetNode && 0 == r.from && r.marker.inclusiveLeft && xr(e, t, r)) return !0
        }
  }

  function xr(e, t, n) {
    if (null == n.to) {
      var r = n.marker.find(1, !0);
      return xr(e, r.line, Qn(r.line.markedSpans, n.marker))
    }
    if (n.marker.inclusiveRight && n.to == t.text.length) return !0;
    for (var i, o = 0; o < t.markedSpans.length; ++o)
      if (i = t.markedSpans[o], i.marker.collapsed && !i.marker.widgetNode && i.from == n.to && (null == i.to || i.to != n.from) && (i.marker.inclusiveLeft || n.marker.inclusiveRight) && xr(e, t, i)) return !0
  }

  function Cr(e, t, n) {
    ei(t) < (e.curOp && e.curOp.scrollTop || e.doc.scrollTop) && Dn(e, null, n)
  }

  function wr(e) {
    if (null != e.height) return e.height;
    var t = e.doc.cm;
    if (!t) return 0;
    if (!Bl(document.body, e.node)) {
      var n = "position: relative;";
      e.coverGutter && (n += "margin-left: -" + t.display.gutters.offsetWidth + "px;"), e.noHScroll && (n += "width: " + t.display.wrapper.clientWidth + "px;"), ji(t.display.measure, Ri("div", [e.node], null, n))
    }
    return e.height = e.node.offsetHeight
  }

  function Sr(e, t, n, r) {
    var i = new hl(e, n, r),
      o = e.cm;
    return o && i.noHScroll && (o.display.alignWidgets = !0), zn(e, t, "widget", function(t) {
      var n = t.widgets || (t.widgets = []);
      if (null == i.insertAt ? n.push(i) : n.splice(Math.min(n.length - 1, Math.max(0, i.insertAt)), 0, i), i.line = t, o && !br(e, t)) {
        var r = ei(t) < e.scrollTop;
        Qr(t, t.height + wr(i)), r && Dn(o, null, i.height), o.curOp.forceUpdate = !0
      }
      return !0
    }), i
  }

  function Lr(e, t, n, r) {
    e.text = t, e.stateAfter && (e.stateAfter = null), e.styles && (e.styles = null), null != e.order && (e.order = null), lr(e), sr(e, n);
    var i = r ? r(e) : 1;
    i != e.height && Qr(e, i)
  }

  function kr(e) {
    e.parent = null, lr(e)
  }

  function Tr(e, t) {
    if (e)
      for (;;) {
        var n = e.match(/(?:^|\s+)line-(background-)?(\S+)/);
        if (!n) break;
        e = e.slice(0, n.index) + e.slice(n.index + n[0].length);
        var r = n[1] ? "bgClass" : "textClass";
        null == t[r] ? t[r] = n[2] : new RegExp("(?:^|s)" + n[2] + "(?:$|s)").test(t[r]) || (t[r] += " " + n[2])
      }
    return e
  }

  function Mr(t, n) {
    if (t.blankLine) return t.blankLine(n);
    if (t.innerMode) {
      var r = e.innerMode(t, n);
      return r.mode.blankLine ? r.mode.blankLine(r.state) : void 0
    }
  }

  function Ar(t, n, r, i) {
    for (var o = 0; 10 > o; o++) {
      i && (i[0] = e.innerMode(t, r).mode);
      var l = t.token(n, r);
      if (n.pos > n.start) return l
    }
    throw new Error("Mode " + t.name + " failed to advance stream.")
  }

  function Or(e, t, n, r) {
    function i(e) {
      return {
        start: f.start,
        end: f.pos,
        string: f.current(),
        type: o || null,
        state: e ? nl(l.mode, u) : u
      }
    }
    var o, l = e.doc,
      s = l.mode;
    t = me(l, t);
    var a, c = Xr(l, t.line),
      u = je(e, t.line, n),
      f = new cl(c.text, e.options.tabSize);
    for (r && (a = []);
      (r || f.pos < t.ch) && !f.eol();) f.start = f.pos, o = Ar(s, f, u), r && a.push(i(!0));
    return r ? a : i()
  }

  function Nr(e, t, n, r, i, o, l) {
    var s = n.flattenSpans;
    null == s && (s = e.options.flattenSpans);
    var a, c = 0,
      u = null,
      f = new cl(t, e.options.tabSize),
      d = e.options.addModeClass && [null];
    for ("" == t && Tr(Mr(n, r), o); !f.eol();) {
      if (f.pos > e.options.maxHighlightLength ? (s = !1, l && Wr(e, t, r, f.pos), f.pos = t.length, a = null) : a = Tr(Ar(n, f, r, d), o), d) {
        var h = d[0].name;
        h && (a = "m-" + (a ? h + " " + a : h))
      }
      if (!s || u != a) {
        for (; c < f.start;) c = Math.min(f.start, c + 5e4), i(c, u);
        u = a
      }
      f.start = f.pos
    }
    for (; c < f.pos;) {
      var p = Math.min(f.pos, c + 5e4);
      i(p, u), c = p
    }
  }

  function Hr(e, t, n, r) {
    var i = [e.state.modeGen],
      o = {};
    Nr(e, t.text, e.doc.mode, n, function(e, t) {
      i.push(e, t)
    }, o, r);
    for (var l = 0; l < e.state.overlays.length; ++l) {
      var s = e.state.overlays[l],
        a = 1,
        c = 0;
      Nr(e, t.text, s.mode, !0, function(e, t) {
        for (var n = a; e > c;) {
          var r = i[a];
          r > e && i.splice(a, 1, e, i[a + 1], r), a += 2, c = Math.min(e, r)
        }
        if (t)
          if (s.opaque) i.splice(n, a - n, e, "cm-overlay " + t), a = n + 2;
          else
            for (; a > n; n += 2) {
              var o = i[n + 1];
              i[n + 1] = (o ? o + " " : "") + "cm-overlay " + t
            }
      }, o)
    }
    return {
      styles: i,
      classes: o.bgClass || o.textClass ? o : null
    }
  }

  function Pr(e, t, n) {
    if (!t.styles || t.styles[0] != e.state.modeGen) {
      var r = Hr(e, t, t.stateAfter = je(e, Zr(t)));
      t.styles = r.styles, r.classes ? t.styleClasses = r.classes : t.styleClasses && (t.styleClasses = null), n === e.doc.frontier && e.doc.frontier++
    }
    return t.styles
  }

  function Wr(e, t, n, r) {
    var i = e.doc.mode,
      o = new cl(t, e.options.tabSize);
    for (o.start = o.pos = r || 0, "" == t && Mr(i, n); !o.eol() && o.pos <= e.options.maxHighlightLength;) Ar(i, o, n), o.start = o.pos
  }

  function Dr(e, t) {
    if (!e || /^\s*$/.test(e)) return null;
    var n = t.addModeClass ? ml : gl;
    return n[e] || (n[e] = e.replace(/\S+/g, "cm-$&"))
  }

  function Er(e, t) {
    var n = Ri("span", null, null, mo ? "padding-right: .1px" : null),
      r = {
        pre: Ri("pre", [n], "CodeMirror-line"),
        content: n,
        col: 0,
        pos: 0,
        cm: e,
        splitSpaces: (po || mo) && e.getOption("lineWrapping")
      };
    t.measure = {};
    for (var i = 0; i <= (t.rest ? t.rest.length : 0); i++) {
      var o, l = i ? t.rest[i - 1] : t.line;
      r.pos = 0, r.addToken = Ir, Yi(e.display.measure) && (o = ti(l)) && (r.addToken = Rr(r.addToken, o)), r.map = [];
      var s = t != e.display.externalMeasured && Zr(l);
      jr(l, r, Pr(e, l, s)), l.styleClasses && (l.styleClasses.bgClass && (r.bgClass = Ui(l.styleClasses.bgClass, r.bgClass || "")), l.styleClasses.textClass && (r.textClass = Ui(l.styleClasses.textClass, r.textClass || ""))), 0 == r.map.length && r.map.push(0, 0, r.content.appendChild(Xi(e.display.measure))), 0 == i ? (t.measure.map = r.map, t.measure.cache = {}) : ((t.measure.maps || (t.measure.maps = [])).push(r.map), (t.measure.caches || (t.measure.caches = [])).push({}))
    }
    return mo && /\bcm-tab\b/.test(r.content.lastChild.className) && (r.content.className = "cm-tab-wrap-hack"), Tl(e, "renderLine", e, t.line, r.pre), r.pre.className && (r.textClass = Ui(r.pre.className, r.textClass || "")), r
  }

  function Fr(e) {
    var t = Ri("span", "•", "cm-invalidchar");
    return t.title = "\\u" + e.charCodeAt(0).toString(16), t.setAttribute("aria-label", t.title), t
  }

  function Ir(e, t, n, r, i, o, l) {
    if (t) {
      var s = e.splitSpaces ? t.replace(/ {3,}/g, zr) : t,
        a = e.cm.state.specialChars,
        c = !1;
      if (a.test(t))
        for (var u = document.createDocumentFragment(), f = 0;;) {
          a.lastIndex = f;
          var d = a.exec(t),
            h = d ? d.index - f : t.length - f;
          if (h) {
            var p = document.createTextNode(s.slice(f, f + h));
            u.appendChild(po && 9 > go ? Ri("span", [p]) : p), e.map.push(e.pos, e.pos + h, p), e.col += h, e.pos += h
          }
          if (!d) break;
          if (f += h + 1, "	" == d[0]) {
            var g = e.cm.options.tabSize,
              m = g - e.col % g,
              p = u.appendChild(Ri("span", Ai(m), "cm-tab"));
            p.setAttribute("role", "presentation"), p.setAttribute("cm-text", "	"), e.col += m
          } else if ("\r" == d[0] || "\n" == d[0]) {
            var p = u.appendChild(Ri("span", "\r" == d[0] ? "␍" : "␤", "cm-invalidchar"));
            p.setAttribute("cm-text", d[0]), e.col += 1
          } else {
            var p = e.cm.options.specialCharPlaceholder(d[0]);
            p.setAttribute("cm-text", d[0]), u.appendChild(po && 9 > go ? Ri("span", [p]) : p), e.col += 1
          }
          e.map.push(e.pos, e.pos + 1, p), e.pos++
        } else {
          e.col += t.length;
          var u = document.createTextNode(s);
          e.map.push(e.pos, e.pos + t.length, u), po && 9 > go && (c = !0), e.pos += t.length
        }
      if (n || r || i || c || l) {
        var v = n || "";
        r && (v += r), i && (v += i);
        var y = Ri("span", [u], v, l);
        return o && (y.title = o), e.content.appendChild(y)
      }
      e.content.appendChild(u)
    }
  }

  function zr(e) {
    for (var t = " ", n = 0; n < e.length - 2; ++n) t += n % 2 ? " " : " ";
    return t += " "
  }

  function Rr(e, t) {
    return function(n, r, i, o, l, s, a) {
      i = i ? i + " cm-force-border" : "cm-force-border";
      for (var c = n.pos, u = c + r.length;;) {
        for (var f = 0; f < t.length; f++) {
          var d = t[f];
          if (d.to > c && d.from <= c) break
        }
        if (d.to >= u) return e(n, r, i, o, l, s, a);
        e(n, r.slice(0, d.to - c), i, o, null, s, a), o = null, r = r.slice(d.to - c), c = d.to
      }
    }
  }

  function Br(e, t, n, r) {
    var i = !r && n.widgetNode;
    i && e.map.push(e.pos, e.pos + t, i), !r && e.cm.display.input.needsContentAttribute && (i || (i = e.content.appendChild(document.createElement("span"))), i.setAttribute("cm-marker", n.id)), i && (e.cm.display.input.setUneditable(i), e.content.appendChild(i)), e.pos += t
  }

  function jr(e, t, n) {
    var r = e.markedSpans,
      i = e.text,
      o = 0;
    if (r)
      for (var l, s, a, c, u, f, d, h = i.length, p = 0, g = 1, m = "", v = 0;;) {
        if (v == p) {
          a = c = u = f = s = "", d = null, v = 1 / 0;
          for (var y = [], b = 0; b < r.length; ++b) {
            var x = r[b],
              C = x.marker;
            "bookmark" == C.type && x.from == p && C.widgetNode ? y.push(C) : x.from <= p && (null == x.to || x.to > p || C.collapsed && x.to == p && x.from == p) ? (null != x.to && x.to != p && v > x.to && (v = x.to, c = ""), C.className && (a += " " + C.className), C.css && (s = C.css), C.startStyle && x.from == p && (u += " " + C.startStyle), C.endStyle && x.to == v && (c += " " + C.endStyle), C.title && !f && (f = C.title), C.collapsed && (!d || ur(d.marker, C) < 0) && (d = x)) : x.from > p && v > x.from && (v = x.from)
          }
          if (d && (d.from || 0) == p) {
            if (Br(t, (null == d.to ? h + 1 : d.to) - p, d.marker, null == d.from), null == d.to) return;
            d.to == p && (d = !1)
          }
          if (!d && y.length)
            for (var b = 0; b < y.length; ++b) Br(t, 0, y[b])
        }
        if (p >= h) break;
        for (var w = Math.min(h, v);;) {
          if (m) {
            var S = p + m.length;
            if (!d) {
              var L = S > w ? m.slice(0, w - p) : m;
              t.addToken(t, L, l ? l + a : a, u, p + L.length == v ? c : "", f, s)
            }
            if (S >= w) {
              m = m.slice(w - p), p = w;
              break
            }
            p = S, u = ""
          }
          m = i.slice(o, o = n[g++]), l = Dr(n[g++], t.cm.options)
        }
      } else
        for (var g = 1; g < n.length; g += 2) t.addToken(t, i.slice(o, o = n[g]), Dr(n[g + 1], t.cm.options))
  }

  function Gr(e, t) {
    return 0 == t.from.ch && 0 == t.to.ch && "" == Oi(t.text) && (!e.cm || e.cm.options.wholeLineUpdateBefore)
  }

  function qr(e, t, n, r) {
    function i(e) {
      return n ? n[e] : null
    }

    function o(e, n, i) {
      Lr(e, n, i, r), xi(e, "change", e, t)
    }

    function l(e, t) {
      for (var n = e, o = []; t > n; ++n) o.push(new pl(c[n], i(n), r));
      return o
    }
    var s = t.from,
      a = t.to,
      c = t.text,
      u = Xr(e, s.line),
      f = Xr(e, a.line),
      d = Oi(c),
      h = i(c.length - 1),
      p = a.line - s.line;
    if (t.full) e.insert(0, l(0, c.length)), e.remove(c.length, e.size - c.length);
    else if (Gr(e, t)) {
      var g = l(0, c.length - 1);
      o(f, f.text, h), p && e.remove(s.line, p), g.length && e.insert(s.line, g)
    } else if (u == f)
      if (1 == c.length) o(u, u.text.slice(0, s.ch) + d + u.text.slice(a.ch), h);
      else {
        var g = l(1, c.length - 1);
        g.push(new pl(d + u.text.slice(a.ch), h, r)), o(u, u.text.slice(0, s.ch) + c[0], i(0)), e.insert(s.line + 1, g)
      }
    else if (1 == c.length) o(u, u.text.slice(0, s.ch) + c[0] + f.text.slice(a.ch), i(0)), e.remove(s.line + 1, p);
    else {
      o(u, u.text.slice(0, s.ch) + c[0], i(0)), o(f, d + f.text.slice(a.ch), h);
      var g = l(1, c.length - 1);
      p > 1 && e.remove(s.line + 1, p - 1), e.insert(s.line + 1, g)
    }
    xi(e, "change", e, t)
  }

  function Ur(e) {
    this.lines = e, this.parent = null;
    for (var t = 0, n = 0; t < e.length; ++t) e[t].parent = this, n += e[t].height;
    this.height = n
  }

  function Vr(e) {
    this.children = e;
    for (var t = 0, n = 0, r = 0; r < e.length; ++r) {
      var i = e[r];
      t += i.chunkSize(), n += i.height, i.parent = this
    }
    this.size = t, this.height = n, this.parent = null
  }

  function Kr(e, t, n) {
    function r(e, i, o) {
      if (e.linked)
        for (var l = 0; l < e.linked.length; ++l) {
          var s = e.linked[l];
          if (s.doc != i) {
            var a = o && s.sharedHist;
            (!n || a) && (t(s.doc, a), r(s.doc, e, a))
          }
        }
    }
    r(e, null, !0)
  }

  function _r(e, t) {
    if (t.cm) throw new Error("This document is already in use.");
    e.doc = t, t.cm = e, l(e), n(e), e.options.lineWrapping || d(e), e.options.mode = t.modeOption, Dt(e)
  }

  function Xr(e, t) {
    if (t -= e.first, 0 > t || t >= e.size) throw new Error("There is no line " + (t + e.first) + " in the document.");
    for (var n = e; !n.lines;)
      for (var r = 0;; ++r) {
        var i = n.children[r],
          o = i.chunkSize();
        if (o > t) {
          n = i;
          break
        }
        t -= o
      }
    return n.lines[t]
  }

  function Yr(e, t, n) {
    var r = [],
      i = t.line;
    return e.iter(t.line, n.line + 1, function(e) {
      var o = e.text;
      i == n.line && (o = o.slice(0, n.ch)), i == t.line && (o = o.slice(t.ch)), r.push(o), ++i
    }), r
  }

  function $r(e, t, n) {
    var r = [];
    return e.iter(t, n, function(e) {
      r.push(e.text)
    }), r
  }

  function Qr(e, t) {
    var n = t - e.height;
    if (n)
      for (var r = e; r; r = r.parent) r.height += n
  }

  function Zr(e) {
    if (null == e.parent) return null;
    for (var t = e.parent, n = Ni(t.lines, e), r = t.parent; r; t = r, r = r.parent)
      for (var i = 0; r.children[i] != t; ++i) n += r.children[i].chunkSize();
    return n + t.first
  }

  function Jr(e, t) {
    var n = e.first;
    e: do {
      for (var r = 0; r < e.children.length; ++r) {
        var i = e.children[r],
          o = i.height;
        if (o > t) {
          e = i;
          continue e
        }
        t -= o, n += i.chunkSize()
      }
      return n
    } while (!e.lines);
    for (var r = 0; r < e.lines.length; ++r) {
      var l = e.lines[r],
        s = l.height;
      if (s > t) break;
      t -= s
    }
    return n + r
  }

  function ei(e) {
    e = gr(e);
    for (var t = 0, n = e.parent, r = 0; r < n.lines.length; ++r) {
      var i = n.lines[r];
      if (i == e) break;
      t += i.height
    }
    for (var o = n.parent; o; n = o, o = n.parent)
      for (var r = 0; r < o.children.length; ++r) {
        var l = o.children[r];
        if (l == n) break;
        t += l.height
      }
    return t
  }

  function ti(e) {
    var t = e.order;
    return null == t && (t = e.order = Jl(e.text)), t
  }

  function ni(e) {
    this.done = [], this.undone = [], this.undoDepth = 1 / 0, this.lastModTime = this.lastSelTime = 0, this.lastOp = this.lastSelOp = null, this.lastOrigin = this.lastSelOrigin = null, this.generation = this.maxGeneration = e || 1
  }

  function ri(e, t) {
    var n = {
      from: _(t.from),
      to: _o(t),
      text: Yr(e, t.from, t.to)
    };
    return ui(e, n, t.from.line, t.to.line + 1), Kr(e, function(e) {
      ui(e, n, t.from.line, t.to.line + 1)
    }, !0), n
  }

  function ii(e) {
    for (; e.length;) {
      var t = Oi(e);
      if (!t.ranges) break;
      e.pop()
    }
  }

  function oi(e, t) {
    return t ? (ii(e.done), Oi(e.done)) : e.done.length && !Oi(e.done).ranges ? Oi(e.done) : e.done.length > 1 && !e.done[e.done.length - 2].ranges ? (e.done.pop(), Oi(e.done)) : void 0
  }

  function li(e, t, n, r) {
    var i = e.history;
    i.undone.length = 0;
    var o, l = +new Date;
    if ((i.lastOp == r || i.lastOrigin == t.origin && t.origin && ("+" == t.origin.charAt(0) && e.cm && i.lastModTime > l - e.cm.options.historyEventDelay || "*" == t.origin.charAt(0))) && (o = oi(i, i.lastOp == r))) {
      var s = Oi(o.changes);
      0 == Wo(t.from, t.to) && 0 == Wo(t.from, s.to) ? s.to = _o(t) : o.changes.push(ri(e, t))
    } else {
      var a = Oi(i.done);
      for (a && a.ranges || ci(e.sel, i.done), o = {
          changes: [ri(e, t)],
          generation: i.generation
        }, i.done.push(o); i.done.length > i.undoDepth;) i.done.shift(), i.done[0].ranges || i.done.shift()
    }
    i.done.push(n), i.generation = ++i.maxGeneration, i.lastModTime = i.lastSelTime = l, i.lastOp = i.lastSelOp = r, i.lastOrigin = i.lastSelOrigin = t.origin, s || Tl(e, "historyAdded")
  }

  function si(e, t, n, r) {
    var i = t.charAt(0);
    return "*" == i || "+" == i && n.ranges.length == r.ranges.length && n.somethingSelected() == r.somethingSelected() && new Date - e.history.lastSelTime <= (e.cm ? e.cm.options.historyEventDelay : 500)
  }

  function ai(e, t, n, r) {
    var i = e.history,
      o = r && r.origin;
    n == i.lastSelOp || o && i.lastSelOrigin == o && (i.lastModTime == i.lastSelTime && i.lastOrigin == o || si(e, o, Oi(i.done), t)) ? i.done[i.done.length - 1] = t : ci(t, i.done), i.lastSelTime = +new Date, i.lastSelOrigin = o, i.lastSelOp = n, r && r.clearRedo !== !1 && ii(i.undone)
  }

  function ci(e, t) {
    var n = Oi(t);
    n && n.ranges && n.equals(e) || t.push(e)
  }

  function ui(e, t, n, r) {
    var i = t["spans_" + e.id],
      o = 0;
    e.iter(Math.max(e.first, n), Math.min(e.first + e.size, r), function(n) {
      n.markedSpans && ((i || (i = t["spans_" + e.id] = {}))[o] = n.markedSpans), ++o
    })
  }

  function fi(e) {
    if (!e) return null;
    for (var t, n = 0; n < e.length; ++n) e[n].marker.explicitlyCleared ? t || (t = e.slice(0, n)) : t && t.push(e[n]);
    return t ? t.length ? t : null : e
  }

  function di(e, t) {
    var n = t["spans_" + e.id];
    if (!n) return null;
    for (var r = 0, i = []; r < t.text.length; ++r) i.push(fi(n[r]));
    return i
  }

  function hi(e, t, n) {
    for (var r = 0, i = []; r < e.length; ++r) {
      var o = e[r];
      if (o.ranges) i.push(n ? fe.prototype.deepCopy.call(o) : o);
      else {
        var l = o.changes,
          s = [];
        i.push({
          changes: s
        });
        for (var a = 0; a < l.length; ++a) {
          var c, u = l[a];
          if (s.push({
              from: u.from,
              to: u.to,
              text: u.text
            }), t)
            for (var f in u)(c = f.match(/^spans_(\d+)$/)) && Ni(t, Number(c[1])) > -1 && (Oi(s)[f] = u[f], delete u[f])
        }
      }
    }
    return i
  }

  function pi(e, t, n, r) {
    n < e.line ? e.line += r : t < e.line && (e.line = t, e.ch = 0)
  }

  function gi(e, t, n, r) {
    for (var i = 0; i < e.length; ++i) {
      var o = e[i],
        l = !0;
      if (o.ranges) {
        o.copied || (o = e[i] = o.deepCopy(), o.copied = !0);
        for (var s = 0; s < o.ranges.length; s++) pi(o.ranges[s].anchor, t, n, r), pi(o.ranges[s].head, t, n, r)
      } else {
        for (var s = 0; s < o.changes.length; ++s) {
          var a = o.changes[s];
          if (n < a.from.line) a.from = Po(a.from.line + r, a.from.ch), a.to = Po(a.to.line + r, a.to.ch);
          else if (t <= a.to.line) {
            l = !1;
            break
          }
        }
        l || (e.splice(0, i + 1), i = 0)
      }
    }
  }

  function mi(e, t) {
    var n = t.from.line,
      r = t.to.line,
      i = t.text.length - (r - n) - 1;
    gi(e.done, n, r, i), gi(e.undone, n, r, i)
  }

  function vi(e) {
    return null != e.defaultPrevented ? e.defaultPrevented : 0 == e.returnValue
  }

  function yi(e) {
    return e.target || e.srcElement
  }

  function bi(e) {
    var t = e.which;
    return null == t && (1 & e.button ? t = 1 : 2 & e.button ? t = 3 : 4 & e.button && (t = 2)), ko && e.ctrlKey && 1 == t && (t = 3), t
  }

  function xi(e, t) {
    function n(e) {
      return function() {
        e.apply(null, o)
      }
    }
    var r = e._handlers && e._handlers[t];
    if (r) {
      var i, o = Array.prototype.slice.call(arguments, 2);
      Ro ? i = Ro.delayedCallbacks : Ml ? i = Ml : (i = Ml = [], setTimeout(Ci, 0));
      for (var l = 0; l < r.length; ++l) i.push(n(r[l]))
    }
  }

  function Ci() {
    var e = Ml;
    Ml = null;
    for (var t = 0; t < e.length; ++t) e[t]()
  }

  function wi(e, t, n) {
    return "string" == typeof t && (t = {
      type: t,
      preventDefault: function() {
        this.defaultPrevented = !0
      }
    }), Tl(e, n || t.type, e, t), vi(t) || t.codemirrorIgnore
  }

  function Si(e) {
    var t = e._handlers && e._handlers.cursorActivity;
    if (t)
      for (var n = e.curOp.cursorActivityHandlers || (e.curOp.cursorActivityHandlers = []), r = 0; r < t.length; ++r) - 1 == Ni(n, t[r]) && n.push(t[r])
  }

  function Li(e, t) {
    var n = e._handlers && e._handlers[t];
    return n && n.length > 0
  }

  function ki(e) {
    e.prototype.on = function(e, t) {
      Ll(this, e, t)
    }, e.prototype.off = function(e, t) {
      kl(this, e, t)
    }
  }

  function Ti() {
    this.id = null
  }

  function Mi(e, t, n) {
    for (var r = 0, i = 0;;) {
      var o = e.indexOf("	", r); - 1 == o && (o = e.length);
      var l = o - r;
      if (o == e.length || i + l >= t) return r + Math.min(l, t - i);
      if (i += o - r, i += n - i % n, r = o + 1, i >= t) return r
    }
  }

  function Ai(e) {
    for (; Dl.length <= e;) Dl.push(Oi(Dl) + " ");
    return Dl[e]
  }

  function Oi(e) {
    return e[e.length - 1]
  }

  function Ni(e, t) {
    for (var n = 0; n < e.length; ++n)
      if (e[n] == t) return n;
    return -1
  }

  function Hi(e, t) {
    for (var n = [], r = 0; r < e.length; r++) n[r] = t(e[r], r);
    return n
  }

  function Pi() {}

  function Wi(e, t) {
    var n;
    return Object.create ? n = Object.create(e) : (Pi.prototype = e, n = new Pi), t && Di(t, n), n
  }

  function Di(e, t, n) {
    t || (t = {});
    for (var r in e) !e.hasOwnProperty(r) || n === !1 && t.hasOwnProperty(r) || (t[r] = e[r]);
    return t
  }

  function Ei(e) {
    var t = Array.prototype.slice.call(arguments, 1);
    return function() {
      return e.apply(null, t)
    }
  }

  function Fi(e, t) {
    return t ? t.source.indexOf("\\w") > -1 && zl(e) ? !0 : t.test(e) : zl(e)
  }

  function Ii(e) {
    for (var t in e)
      if (e.hasOwnProperty(t) && e[t]) return !1;
    return !0
  }

  function zi(e) {
    return e.charCodeAt(0) >= 768 && Rl.test(e)
  }

  function Ri(e, t, n, r) {
    var i = document.createElement(e);
    if (n && (i.className = n), r && (i.style.cssText = r), "string" == typeof t) i.appendChild(document.createTextNode(t));
    else if (t)
      for (var o = 0; o < t.length; ++o) i.appendChild(t[o]);
    return i
  }

  function Bi(e) {
    for (var t = e.childNodes.length; t > 0; --t) e.removeChild(e.firstChild);
    return e
  }

  function ji(e, t) {
    return Bi(e).appendChild(t)
  }

  function Gi() {
    for (var e = document.activeElement; e && e.root && e.root.activeElement;) e = e.root.activeElement;
    return e
  }

  function qi(e) {
    return new RegExp("(^|\\s)" + e + "(?:$|\\s)\\s*")
  }

  function Ui(e, t) {
    for (var n = e.split(" "), r = 0; r < n.length; r++) n[r] && !qi(n[r]).test(t) && (t += " " + n[r]);
    return t
  }

  function Vi(e) {
    if (document.body.getElementsByClassName)
      for (var t = document.body.getElementsByClassName("CodeMirror"), n = 0; n < t.length; n++) {
        var r = t[n].CodeMirror;
        r && e(r)
      }
  }

  function Ki() {
    Vl || (_i(), Vl = !0)
  }

  function _i() {
    var e;
    Ll(window, "resize", function() {
      null == e && (e = setTimeout(function() {
        e = null, Vi(qt)
      }, 100))
    }), Ll(window, "blur", function() {
      Vi(gn)
    })
  }

  function Xi(e) {
    if (null == jl) {
      var t = Ri("span", "​");
      ji(e, Ri("span", [t, document.createTextNode("x")])), 0 != e.firstChild.offsetHeight && (jl = t.offsetWidth <= 1 && t.offsetHeight > 2 && !(po && 8 > go))
    }
    var n = jl ? Ri("span", "​") : Ri("span", " ", null, "display: inline-block; width: 1px; margin-right: -1px");
    return n.setAttribute("cm-text", ""), n
  }

  function Yi(e) {
    if (null != Gl) return Gl;
    var t = ji(e, document.createTextNode("AخA")),
      n = Fl(t, 0, 1).getBoundingClientRect();
    if (!n || n.left == n.right) return !1;
    var r = Fl(t, 1, 2).getBoundingClientRect();
    return Gl = r.right - n.right < 3
  }

  function $i(e) {
    if (null != $l) return $l;
    var t = ji(e, Ri("span", "x")),
      n = t.getBoundingClientRect(),
      r = Fl(t, 0, 1).getBoundingClientRect();
    return $l = Math.abs(n.left - r.left) > 1
  }

  function Qi(e, t, n, r) {
    if (!e) return r(t, n, "ltr");
    for (var i = !1, o = 0; o < e.length; ++o) {
      var l = e[o];
      (l.from < n && l.to > t || t == n && l.to == t) && (r(Math.max(l.from, t), Math.min(l.to, n), 1 == l.level ? "rtl" : "ltr"), i = !0)
    }
    i || r(t, n, "ltr")
  }

  function Zi(e) {
    return e.level % 2 ? e.to : e.from
  }

  function Ji(e) {
    return e.level % 2 ? e.from : e.to
  }

  function eo(e) {
    var t = ti(e);
    return t ? Zi(t[0]) : 0
  }

  function to(e) {
    var t = ti(e);
    return t ? Ji(Oi(t)) : e.text.length
  }

  function no(e, t) {
    var n = Xr(e.doc, t),
      r = gr(n);
    r != n && (t = Zr(r));
    var i = ti(r),
      o = i ? i[0].level % 2 ? to(r) : eo(r) : 0;
    return Po(t, o)
  }

  function ro(e, t) {
    for (var n, r = Xr(e.doc, t); n = hr(r);) r = n.find(1, !0).line, t = null;
    var i = ti(r),
      o = i ? i[0].level % 2 ? eo(r) : to(r) : r.text.length;
    return Po(null == t ? Zr(r) : t, o)
  }

  function io(e, t) {
    var n = no(e, t.line),
      r = Xr(e.doc, n.line),
      i = ti(r);
    if (!i || 0 == i[0].level) {
      var o = Math.max(0, r.text.search(/\S/)),
        l = t.line == n.line && t.ch <= o && t.ch;
      return Po(n.line, l ? 0 : o)
    }
    return n
  }

  function oo(e, t, n) {
    var r = e[0].level;
    return t == r ? !0 : n == r ? !1 : n > t
  }

  function lo(e, t) {
    Zl = null;
    for (var n, r = 0; r < e.length; ++r) {
      var i = e[r];
      if (i.from < t && i.to > t) return r;
      if (i.from == t || i.to == t) {
        if (null != n) return oo(e, i.level, e[n].level) ? (i.from != i.to && (Zl = n), r) : (i.from != i.to && (Zl = r), n);
        n = r
      }
    }
    return n
  }

  function so(e, t, n, r) {
    if (!r) return t + n;
    do t += n; while (t > 0 && zi(e.text.charAt(t)));
    return t
  }

  function ao(e, t, n, r) {
    var i = ti(e);
    if (!i) return co(e, t, n, r);
    for (var o = lo(i, t), l = i[o], s = so(e, t, l.level % 2 ? -n : n, r);;) {
      if (s > l.from && s < l.to) return s;
      if (s == l.from || s == l.to) return lo(i, s) == o ? s : (l = i[o += n], n > 0 == l.level % 2 ? l.to : l.from);
      if (l = i[o += n], !l) return null;
      s = n > 0 == l.level % 2 ? so(e, l.to, -1, r) : so(e, l.from, 1, r)
    }
  }

  function co(e, t, n, r) {
    var i = t + n;
    if (r)
      for (; i > 0 && zi(e.text.charAt(i));) i += n;
    return 0 > i || i > e.text.length ? null : i
  }
  var uo = /gecko\/\d/i.test(navigator.userAgent),
    fo = /MSIE \d/.test(navigator.userAgent),
    ho = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent),
    po = fo || ho,
    go = po && (fo ? document.documentMode || 6 : ho[1]),
    mo = /WebKit\//.test(navigator.userAgent),
    vo = mo && /Qt\/\d+\.\d+/.test(navigator.userAgent),
    yo = /Chrome\//.test(navigator.userAgent),
    bo = /Opera\//.test(navigator.userAgent),
    xo = /Apple Computer/.test(navigator.vendor),
    Co = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(navigator.userAgent),
    wo = /PhantomJS/.test(navigator.userAgent),
    So = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent),
    Lo = So || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(navigator.userAgent),
    ko = So || /Mac/.test(navigator.platform),
    To = /win/i.test(navigator.platform),
    Mo = bo && navigator.userAgent.match(/Version\/(\d*\.\d*)/);
  Mo && (Mo = Number(Mo[1])), Mo && Mo >= 15 && (bo = !1, mo = !0);
  var Ao = ko && (vo || bo && (null == Mo || 12.11 > Mo)),
    Oo = uo || po && go >= 9,
    No = !1,
    Ho = !1;
  g.prototype = Di({
    update: function(e) {
      var t = e.scrollWidth > e.clientWidth + 1,
        n = e.scrollHeight > e.clientHeight + 1,
        r = e.nativeBarWidth;
      if (n) {
        this.vert.style.display = "block", this.vert.style.bottom = t ? r + "px" : "0";
        var i = e.viewHeight - (t ? r : 0);
        this.vert.firstChild.style.height = Math.max(0, e.scrollHeight - e.clientHeight + i) + "px"
      } else this.vert.style.display = "", this.vert.firstChild.style.height = "0";
      if (t) {
        this.horiz.style.display = "block", this.horiz.style.right = n ? r + "px" : "0", this.horiz.style.left = e.barLeft + "px";
        var o = e.viewWidth - e.barLeft - (n ? r : 0);
        this.horiz.firstChild.style.width = e.scrollWidth - e.clientWidth + o + "px"
      } else this.horiz.style.display = "", this.horiz.firstChild.style.width = "0";
      return !this.checkedOverlay && e.clientHeight > 0 && (0 == r && this.overlayHack(), this.checkedOverlay = !0), {
        right: n ? r : 0,
        bottom: t ? r : 0
      }
    },
    setScrollLeft: function(e) {
      this.horiz.scrollLeft != e && (this.horiz.scrollLeft = e)
    },
    setScrollTop: function(e) {
      this.vert.scrollTop != e && (this.vert.scrollTop = e)
    },
    overlayHack: function() {
      var e = ko && !Co ? "12px" : "18px";
      this.horiz.style.minHeight = this.vert.style.minWidth = e;
      var t = this,
        n = function(e) {
          yi(e) != t.vert && yi(e) != t.horiz && Ot(t.cm, Kt)(e)
        };
      Ll(this.vert, "mousedown", n), Ll(this.horiz, "mousedown", n)
    },
    clear: function() {
      var e = this.horiz.parentNode;
      e.removeChild(this.horiz), e.removeChild(this.vert)
    }
  }, g.prototype), m.prototype = Di({
    update: function() {
      return {
        bottom: 0,
        right: 0
      }
    },
    setScrollLeft: function() {},
    setScrollTop: function() {},
    clear: function() {}
  }, m.prototype), e.scrollbarModel = {
    "native": g,
    "null": m
  }, k.prototype.signal = function(e, t) {
    Li(e, t) && this.events.push(arguments)
  }, k.prototype.finish = function() {
    for (var e = 0; e < this.events.length; e++) Tl.apply(null, this.events[e])
  };
  var Po = e.Pos = function(e, t) {
      return this instanceof Po ? (this.line = e, void(this.ch = t)) : new Po(e, t)
    },
    Wo = e.cmpPos = function(e, t) {
      return e.line - t.line || e.ch - t.ch
    },
    Do = null;
  re.prototype = Di({
    init: function(e) {
      function t(e) {
        if (r.somethingSelected()) Do = r.getSelections(), n.inaccurateSelection && (n.prevInput = "", n.inaccurateSelection = !1, o.value = Do.join("\n"), El(o));
        else {
          if (!r.options.lineWiseCopyCut) return;
          var t = te(r);
          Do = t.text, "cut" == e.type ? r.setSelections(t.ranges, null, Nl) : (n.prevInput = "", o.value = t.text.join("\n"), El(o))
        }
        "cut" == e.type && (r.state.cutIncoming = !0)
      }
      var n = this,
        r = this.cm,
        i = this.wrapper = ie(),
        o = this.textarea = i.firstChild;
      e.wrapper.insertBefore(i, e.wrapper.firstChild), So && (o.style.width = "0px"), Ll(o, "input", function() {
        po && go >= 9 && n.hasSelection && (n.hasSelection = null), n.poll()
      }), Ll(o, "paste", function(e) {
        return J(e, r) ? !0 : (r.state.pasteIncoming = !0, void n.fastPoll())
      }), Ll(o, "cut", t), Ll(o, "copy", t), Ll(e.scroller, "paste", function(t) {
        Ut(e, t) || (r.state.pasteIncoming = !0, n.focus())
      }), Ll(e.lineSpace, "selectstart", function(t) {
        Ut(e, t) || Cl(t)
      }), Ll(o, "compositionstart", function() {
        var e = r.getCursor("from");
        n.composing = {
          start: e,
          range: r.markText(e, r.getCursor("to"), {
            className: "CodeMirror-composing"
          })
        }
      }), Ll(o, "compositionend", function() {
        n.composing && (n.poll(), n.composing.range.clear(), n.composing = null)
      })
    },
    prepareSelection: function() {
      var e = this.cm,
        t = e.display,
        n = e.doc,
        r = De(e);
      if (e.options.moveInputWithCursor) {
        var i = dt(e, n.sel.primary().head, "div"),
          o = t.wrapper.getBoundingClientRect(),
          l = t.lineDiv.getBoundingClientRect();
        r.teTop = Math.max(0, Math.min(t.wrapper.clientHeight - 10, i.top + l.top - o.top)), r.teLeft = Math.max(0, Math.min(t.wrapper.clientWidth - 10, i.left + l.left - o.left))
      }
      return r
    },
    showSelection: function(e) {
      var t = this.cm,
        n = t.display;
      ji(n.cursorDiv, e.cursors),
        ji(n.selectionDiv, e.selection), null != e.teTop && (this.wrapper.style.top = e.teTop + "px", this.wrapper.style.left = e.teLeft + "px")
    },
    reset: function(e) {
      if (!this.contextMenuPending) {
        var t, n, r = this.cm,
          i = r.doc;
        if (r.somethingSelected()) {
          this.prevInput = "";
          var o = i.sel.primary();
          t = Yl && (o.to().line - o.from().line > 100 || (n = r.getSelection()).length > 1e3);
          var l = t ? "-" : n || r.getSelection();
          this.textarea.value = l, r.state.focused && El(this.textarea), po && go >= 9 && (this.hasSelection = l)
        } else e || (this.prevInput = this.textarea.value = "", po && go >= 9 && (this.hasSelection = null));
        this.inaccurateSelection = t
      }
    },
    getField: function() {
      return this.textarea
    },
    supportsTouch: function() {
      return !1
    },
    focus: function() {
      if ("nocursor" != this.cm.options.readOnly && (!Lo || Gi() != this.textarea)) try {
        this.textarea.focus()
      } catch (e) {}
    },
    blur: function() {
      this.textarea.blur()
    },
    resetPosition: function() {
      this.wrapper.style.top = this.wrapper.style.left = 0
    },
    receivedFocus: function() {
      this.slowPoll()
    },
    slowPoll: function() {
      var e = this;
      e.pollingFast || e.polling.set(this.cm.options.pollInterval, function() {
        e.poll(), e.cm.state.focused && e.slowPoll()
      })
    },
    fastPoll: function() {
      function e() {
        var r = n.poll();
        r || t ? (n.pollingFast = !1, n.slowPoll()) : (t = !0, n.polling.set(60, e))
      }
      var t = !1,
        n = this;
      n.pollingFast = !0, n.polling.set(20, e)
    },
    poll: function() {
      var e = this.cm,
        t = this.textarea,
        n = this.prevInput;
      if (this.contextMenuPending || !e.state.focused || Xl(t) && !n && !this.composing || Q(e) || e.options.disableInput || e.state.keySeq) return !1;
      var r = t.value;
      if (r == n && !e.somethingSelected()) return !1;
      if (po && go >= 9 && this.hasSelection === r || ko && /[\uf700-\uf7ff]/.test(r)) return e.display.input.reset(), !1;
      if (e.doc.sel == e.display.selForContextMenu) {
        var i = r.charCodeAt(0);
        if (8203 != i || n || (n = "​"), 8666 == i) return this.reset(), this.cm.execCommand("undo")
      }
      for (var o = 0, l = Math.min(n.length, r.length); l > o && n.charCodeAt(o) == r.charCodeAt(o);) ++o;
      var s = this;
      return At(e, function() {
        Z(e, r.slice(o), n.length - o, null, s.composing ? "*compose" : null), r.length > 1e3 || r.indexOf("\n") > -1 ? t.value = s.prevInput = "" : s.prevInput = r, s.composing && (s.composing.range.clear(), s.composing.range = e.markText(s.composing.start, e.getCursor("to"), {
          className: "CodeMirror-composing"
        }))
      }), !0
    },
    ensurePolled: function() {
      this.pollingFast && this.poll() && (this.pollingFast = !1)
    },
    onKeyPress: function() {
      po && go >= 9 && (this.hasSelection = null), this.fastPoll()
    },
    onContextMenu: function(e) {
      function t() {
        if (null != l.selectionStart) {
          var e = i.somethingSelected(),
            t = "​" + (e ? l.value : "");
          l.value = "⇚", l.value = t, r.prevInput = e ? "" : "​", l.selectionStart = 1, l.selectionEnd = t.length, o.selForContextMenu = i.doc.sel
        }
      }

      function n() {
        if (r.contextMenuPending = !1, r.wrapper.style.position = "relative", l.style.cssText = u, po && 9 > go && o.scrollbars.setScrollTop(o.scroller.scrollTop = a), null != l.selectionStart) {
          (!po || po && 9 > go) && t();
          var e = 0,
            n = function() {
              o.selForContextMenu == i.doc.sel && 0 == l.selectionStart && l.selectionEnd > 0 && "​" == r.prevInput ? Ot(i, il.selectAll)(i) : e++ < 10 ? o.detectingSelectAll = setTimeout(n, 500) : o.input.reset()
            };
          o.detectingSelectAll = setTimeout(n, 200)
        }
      }
      var r = this,
        i = r.cm,
        o = i.display,
        l = r.textarea,
        s = Vt(i, e),
        a = o.scroller.scrollTop;
      if (s && !bo) {
        var c = i.options.resetSelectionOnContextMenu;
        c && -1 == i.doc.sel.contains(s) && Ot(i, Me)(i.doc, pe(s), Nl);
        var u = l.style.cssText;
        if (r.wrapper.style.position = "absolute", l.style.cssText = "position: fixed; width: 30px; height: 30px; top: " + (e.clientY - 5) + "px; left: " + (e.clientX - 5) + "px; z-index: 1000; background: " + (po ? "rgba(255, 255, 255, .05)" : "transparent") + "; outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);", mo) var f = window.scrollY;
        if (o.input.focus(), mo && window.scrollTo(null, f), o.input.reset(), i.somethingSelected() || (l.value = r.prevInput = " "), r.contextMenuPending = !0, o.selForContextMenu = i.doc.sel, clearTimeout(o.detectingSelectAll), po && go >= 9 && t(), Oo) {
          Sl(e);
          var d = function() {
            kl(window, "mouseup", d), setTimeout(n, 20)
          };
          Ll(window, "mouseup", d)
        } else setTimeout(n, 50)
      }
    },
    setUneditable: Pi,
    needsContentAttribute: !1
  }, re.prototype), oe.prototype = Di({
    init: function(e) {
      function t(e) {
        if (r.somethingSelected()) Do = r.getSelections(), "cut" == e.type && r.replaceSelection("", null, "cut");
        else {
          if (!r.options.lineWiseCopyCut) return;
          var t = te(r);
          Do = t.text, "cut" == e.type && r.operation(function() {
            r.setSelections(t.ranges, 0, Nl), r.replaceSelection("", null, "cut")
          })
        }
        if (e.clipboardData && !So) e.preventDefault(), e.clipboardData.clearData(), e.clipboardData.setData("text/plain", Do.join("\n"));
        else {
          var n = ie(),
            i = n.firstChild;
          r.display.lineSpace.insertBefore(n, r.display.lineSpace.firstChild), i.value = Do.join("\n");
          var o = document.activeElement;
          El(i), setTimeout(function() {
            r.display.lineSpace.removeChild(n), o.focus()
          }, 50)
        }
      }
      var n = this,
        r = n.cm,
        i = n.div = e.lineDiv;
      i.contentEditable = "true", ne(i), Ll(i, "paste", function(e) {
        J(e, r)
      }), Ll(i, "compositionstart", function(e) {
        var t = e.data;
        if (n.composing = {
            sel: r.doc.sel,
            data: t,
            startData: t
          }, t) {
          var i = r.doc.sel.primary(),
            o = r.getLine(i.head.line),
            l = o.indexOf(t, Math.max(0, i.head.ch - t.length));
          l > -1 && l <= i.head.ch && (n.composing.sel = pe(Po(i.head.line, l), Po(i.head.line, l + t.length)))
        }
      }), Ll(i, "compositionupdate", function(e) {
        n.composing.data = e.data
      }), Ll(i, "compositionend", function(e) {
        var t = n.composing;
        t && (e.data == t.startData || /\u200b/.test(e.data) || (t.data = e.data), setTimeout(function() {
          t.handled || n.applyComposition(t), n.composing == t && (n.composing = null)
        }, 50))
      }), Ll(i, "touchstart", function() {
        n.forceCompositionEnd()
      }), Ll(i, "input", function() {
        n.composing || n.pollContent() || At(n.cm, function() {
          Dt(r)
        })
      }), Ll(i, "copy", t), Ll(i, "cut", t)
    },
    prepareSelection: function() {
      var e = De(this.cm, !1);
      return e.focus = this.cm.state.focused, e
    },
    showSelection: function(e) {
      e && this.cm.display.view.length && (e.focus && this.showPrimarySelection(), this.showMultipleSelections(e))
    },
    showPrimarySelection: function() {
      var e = window.getSelection(),
        t = this.cm.doc.sel.primary(),
        n = ae(this.cm, e.anchorNode, e.anchorOffset),
        r = ae(this.cm, e.focusNode, e.focusOffset);
      if (!n || n.bad || !r || r.bad || 0 != Wo(Y(n, r), t.from()) || 0 != Wo(X(n, r), t.to())) {
        var i = le(this.cm, t.from()),
          o = le(this.cm, t.to());
        if (i || o) {
          var l = this.cm.display.view,
            s = e.rangeCount && e.getRangeAt(0);
          if (i) {
            if (!o) {
              var a = l[l.length - 1].measure,
                c = a.maps ? a.maps[a.maps.length - 1] : a.map;
              o = {
                node: c[c.length - 1],
                offset: c[c.length - 2] - c[c.length - 3]
              }
            }
          } else i = {
            node: l[0].measure.map[2],
            offset: 0
          };
          try {
            var u = Fl(i.node, i.offset, o.offset, o.node)
          } catch (f) {}
          u && (e.removeAllRanges(), e.addRange(u), s && null == e.anchorNode ? e.addRange(s) : uo && this.startGracePeriod()), this.rememberSelection()
        }
      }
    },
    startGracePeriod: function() {
      var e = this;
      clearTimeout(this.gracePeriod), this.gracePeriod = setTimeout(function() {
        e.gracePeriod = !1, e.selectionChanged() && e.cm.operation(function() {
          e.cm.curOp.selectionChanged = !0
        })
      }, 20)
    },
    showMultipleSelections: function(e) {
      ji(this.cm.display.cursorDiv, e.cursors), ji(this.cm.display.selectionDiv, e.selection)
    },
    rememberSelection: function() {
      var e = window.getSelection();
      this.lastAnchorNode = e.anchorNode, this.lastAnchorOffset = e.anchorOffset, this.lastFocusNode = e.focusNode, this.lastFocusOffset = e.focusOffset
    },
    selectionInEditor: function() {
      var e = window.getSelection();
      if (!e.rangeCount) return !1;
      var t = e.getRangeAt(0).commonAncestorContainer;
      return Bl(this.div, t)
    },
    focus: function() {
      "nocursor" != this.cm.options.readOnly && this.div.focus()
    },
    blur: function() {
      this.div.blur()
    },
    getField: function() {
      return this.div
    },
    supportsTouch: function() {
      return !0
    },
    receivedFocus: function() {
      function e() {
        t.cm.state.focused && (t.pollSelection(), t.polling.set(t.cm.options.pollInterval, e))
      }
      var t = this;
      this.selectionInEditor() ? this.pollSelection() : At(this.cm, function() {
        t.cm.curOp.selectionChanged = !0
      }), this.polling.set(this.cm.options.pollInterval, e)
    },
    selectionChanged: function() {
      var e = window.getSelection();
      return e.anchorNode != this.lastAnchorNode || e.anchorOffset != this.lastAnchorOffset || e.focusNode != this.lastFocusNode || e.focusOffset != this.lastFocusOffset
    },
    pollSelection: function() {
      if (!this.composing && !this.gracePeriod && this.selectionChanged()) {
        var e = window.getSelection(),
          t = this.cm;
        this.rememberSelection();
        var n = ae(t, e.anchorNode, e.anchorOffset),
          r = ae(t, e.focusNode, e.focusOffset);
        n && r && At(t, function() {
          Me(t.doc, pe(n, r), Nl), (n.bad || r.bad) && (t.curOp.selectionChanged = !0)
        })
      }
    },
    pollContent: function() {
      var e = this.cm,
        t = e.display,
        n = e.doc.sel.primary(),
        r = n.from(),
        i = n.to();
      if (r.line < t.viewFrom || i.line > t.viewTo - 1) return !1;
      var o;
      if (r.line == t.viewFrom || 0 == (o = It(e, r.line))) var l = Zr(t.view[0].line),
        s = t.view[0].node;
      else var l = Zr(t.view[o].line),
        s = t.view[o - 1].node.nextSibling;
      var a = It(e, i.line);
      if (a == t.view.length - 1) var c = t.viewTo - 1,
        u = t.lineDiv.lastChild;
      else var c = Zr(t.view[a + 1].line) - 1,
        u = t.view[a + 1].node.previousSibling;
      for (var f = e.doc.splitLines(ue(e, s, u, l, c)), d = Yr(e.doc, Po(l, 0), Po(c, Xr(e.doc, c).text.length)); f.length > 1 && d.length > 1;)
        if (Oi(f) == Oi(d)) f.pop(), d.pop(), c--;
        else {
          if (f[0] != d[0]) break;
          f.shift(), d.shift(), l++
        }
      for (var h = 0, p = 0, g = f[0], m = d[0], v = Math.min(g.length, m.length); v > h && g.charCodeAt(h) == m.charCodeAt(h);) ++h;
      for (var y = Oi(f), b = Oi(d), x = Math.min(y.length - (1 == f.length ? h : 0), b.length - (1 == d.length ? h : 0)); x > p && y.charCodeAt(y.length - p - 1) == b.charCodeAt(b.length - p - 1);) ++p;
      f[f.length - 1] = y.slice(0, y.length - p), f[0] = f[0].slice(h);
      var C = Po(l, h),
        w = Po(c, d.length ? Oi(d).length - p : 0);
      return f.length > 1 || f[0] || Wo(C, w) ? (On(e.doc, f, C, w, "+input"), !0) : void 0
    },
    ensurePolled: function() {
      this.forceCompositionEnd()
    },
    reset: function() {
      this.forceCompositionEnd()
    },
    forceCompositionEnd: function() {
      this.composing && !this.composing.handled && (this.applyComposition(this.composing), this.composing.handled = !0, this.div.blur(), this.div.focus())
    },
    applyComposition: function(e) {
      e.data && e.data != e.startData && Ot(this.cm, Z)(this.cm, e.data, 0, e.sel)
    },
    setUneditable: function(e) {
      e.setAttribute("contenteditable", "false")
    },
    onKeyPress: function(e) {
      e.preventDefault(), Ot(this.cm, Z)(this.cm, String.fromCharCode(null == e.charCode ? e.keyCode : e.charCode), 0)
    },
    onContextMenu: Pi,
    resetPosition: Pi,
    needsContentAttribute: !0
  }, oe.prototype), e.inputStyles = {
    textarea: re,
    contenteditable: oe
  }, fe.prototype = {
    primary: function() {
      return this.ranges[this.primIndex]
    },
    equals: function(e) {
      if (e == this) return !0;
      if (e.primIndex != this.primIndex || e.ranges.length != this.ranges.length) return !1;
      for (var t = 0; t < this.ranges.length; t++) {
        var n = this.ranges[t],
          r = e.ranges[t];
        if (0 != Wo(n.anchor, r.anchor) || 0 != Wo(n.head, r.head)) return !1
      }
      return !0
    },
    deepCopy: function() {
      for (var e = [], t = 0; t < this.ranges.length; t++) e[t] = new de(_(this.ranges[t].anchor), _(this.ranges[t].head));
      return new fe(e, this.primIndex)
    },
    somethingSelected: function() {
      for (var e = 0; e < this.ranges.length; e++)
        if (!this.ranges[e].empty()) return !0;
      return !1
    },
    contains: function(e, t) {
      t || (t = e);
      for (var n = 0; n < this.ranges.length; n++) {
        var r = this.ranges[n];
        if (Wo(t, r.from()) >= 0 && Wo(e, r.to()) <= 0) return n
      }
      return -1
    }
  }, de.prototype = {
    from: function() {
      return Y(this.anchor, this.head)
    },
    to: function() {
      return X(this.anchor, this.head)
    },
    empty: function() {
      return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch
    }
  };
  var Eo, Fo, Io, zo = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    Ro = null,
    Bo = 0,
    jo = 0,
    Go = 0,
    qo = null;
  po ? qo = -.53 : uo ? qo = 15 : yo ? qo = -.7 : xo && (qo = -1 / 3);
  var Uo = function(e) {
    var t = e.wheelDeltaX,
      n = e.wheelDeltaY;
    return null == t && e.detail && e.axis == e.HORIZONTAL_AXIS && (t = e.detail), null == n && e.detail && e.axis == e.VERTICAL_AXIS ? n = e.detail : null == n && (n = e.wheelDelta), {
      x: t,
      y: n
    }
  };
  e.wheelEventPixels = function(e) {
    var t = Uo(e);
    return t.x *= qo, t.y *= qo, t
  };
  var Vo = new Ti,
    Ko = null,
    _o = e.changeEnd = function(e) {
      return e.text ? Po(e.from.line + e.text.length - 1, Oi(e.text).length + (1 == e.text.length ? e.from.ch : 0)) : e.to
    };
  e.prototype = {
    constructor: e,
    focus: function() {
      window.focus(), this.display.input.focus()
    },
    setOption: function(e, t) {
      var n = this.options,
        r = n[e];
      (n[e] != t || "mode" == e) && (n[e] = t, Yo.hasOwnProperty(e) && Ot(this, Yo[e])(this, t, r))
    },
    getOption: function(e) {
      return this.options[e]
    },
    getDoc: function() {
      return this.doc
    },
    addKeyMap: function(e, t) {
      this.state.keyMaps[t ? "push" : "unshift"](Un(e))
    },
    removeKeyMap: function(e) {
      for (var t = this.state.keyMaps, n = 0; n < t.length; ++n)
        if (t[n] == e || t[n].name == e) return t.splice(n, 1), !0
    },
    addOverlay: Nt(function(t, n) {
      var r = t.token ? t : e.getMode(this.options, t);
      if (r.startState) throw new Error("Overlays may not be stateful.");
      this.state.overlays.push({
        mode: r,
        modeSpec: t,
        opaque: n && n.opaque
      }), this.state.modeGen++, Dt(this)
    }),
    removeOverlay: Nt(function(e) {
      for (var t = this.state.overlays, n = 0; n < t.length; ++n) {
        var r = t[n].modeSpec;
        if (r == e || "string" == typeof e && r.name == e) return t.splice(n, 1), this.state.modeGen++, void Dt(this)
      }
    }),
    indentLine: Nt(function(e, t, n) {
      "string" != typeof t && "number" != typeof t && (t = null == t ? this.options.smartIndent ? "smart" : "prev" : t ? "add" : "subtract"), ye(this.doc, e) && In(this, e, t, n)
    }),
    indentSelection: Nt(function(e) {
      for (var t = this.doc.sel.ranges, n = -1, r = 0; r < t.length; r++) {
        var i = t[r];
        if (i.empty()) i.head.line > n && (In(this, i.head.line, e, !0), n = i.head.line, r == this.doc.sel.primIndex && En(this));
        else {
          var o = i.from(),
            l = i.to(),
            s = Math.max(n, o.line);
          n = Math.min(this.lastLine(), l.line - (l.ch ? 0 : 1)) + 1;
          for (var a = s; n > a; ++a) In(this, a, e);
          var c = this.doc.sel.ranges;
          0 == o.ch && t.length == c.length && c[r].from().ch > 0 && Se(this.doc, r, new de(o, c[r].to()), Nl)
        }
      }
    }),
    getTokenAt: function(e, t) {
      return Or(this, e, t)
    },
    getLineTokens: function(e, t) {
      return Or(this, Po(e), t, !0)
    },
    getTokenTypeAt: function(e) {
      e = me(this.doc, e);
      var t, n = Pr(this, Xr(this.doc, e.line)),
        r = 0,
        i = (n.length - 1) / 2,
        o = e.ch;
      if (0 == o) t = n[2];
      else
        for (;;) {
          var l = r + i >> 1;
          if ((l ? n[2 * l - 1] : 0) >= o) i = l;
          else {
            if (!(n[2 * l + 1] < o)) {
              t = n[2 * l + 2];
              break
            }
            r = l + 1
          }
        }
      var s = t ? t.indexOf("cm-overlay ") : -1;
      return 0 > s ? t : 0 == s ? null : t.slice(0, s - 1)
    },
    getModeAt: function(t) {
      var n = this.doc.mode;
      return n.innerMode ? e.innerMode(n, this.getTokenAt(t).state).mode : n
    },
    getHelper: function(e, t) {
      return this.getHelpers(e, t)[0]
    },
    getHelpers: function(e, t) {
      var n = [];
      if (!tl.hasOwnProperty(t)) return n;
      var r = tl[t],
        i = this.getModeAt(e);
      if ("string" == typeof i[t]) r[i[t]] && n.push(r[i[t]]);
      else if (i[t])
        for (var o = 0; o < i[t].length; o++) {
          var l = r[i[t][o]];
          l && n.push(l)
        } else i.helperType && r[i.helperType] ? n.push(r[i.helperType]) : r[i.name] && n.push(r[i.name]);
      for (var o = 0; o < r._global.length; o++) {
        var s = r._global[o];
        s.pred(i, this) && -1 == Ni(n, s.val) && n.push(s.val)
      }
      return n
    },
    getStateAfter: function(e, t) {
      var n = this.doc;
      return e = ge(n, null == e ? n.first + n.size - 1 : e), je(this, e + 1, t)
    },
    cursorCoords: function(e, t) {
      var n, r = this.doc.sel.primary();
      return n = null == e ? r.head : "object" == typeof e ? me(this.doc, e) : e ? r.from() : r.to(), dt(this, n, t || "page")
    },
    charCoords: function(e, t) {
      return ft(this, me(this.doc, e), t || "page")
    },
    coordsChar: function(e, t) {
      return e = ut(this, e, t || "page"), gt(this, e.left, e.top)
    },
    lineAtHeight: function(e, t) {
      return e = ut(this, {
        top: e,
        left: 0
      }, t || "page").top, Jr(this.doc, e + this.display.viewOffset)
    },
    heightAtLine: function(e, t) {
      var n, r = !1;
      if ("number" == typeof e) {
        var i = this.doc.first + this.doc.size - 1;
        e < this.doc.first ? e = this.doc.first : e > i && (e = i, r = !0), n = Xr(this.doc, e)
      } else n = e;
      return ct(this, n, {
        top: 0,
        left: 0
      }, t || "page").top + (r ? this.doc.height - ei(n) : 0)
    },
    defaultTextHeight: function() {
      return vt(this.display)
    },
    defaultCharWidth: function() {
      return yt(this.display)
    },
    setGutterMarker: Nt(function(e, t, n) {
      return zn(this.doc, e, "gutter", function(e) {
        var r = e.gutterMarkers || (e.gutterMarkers = {});
        return r[t] = n, !n && Ii(r) && (e.gutterMarkers = null), !0
      })
    }),
    clearGutter: Nt(function(e) {
      var t = this,
        n = t.doc,
        r = n.first;
      n.iter(function(n) {
        n.gutterMarkers && n.gutterMarkers[e] && (n.gutterMarkers[e] = null, Et(t, r, "gutter"), Ii(n.gutterMarkers) && (n.gutterMarkers = null)), ++r
      })
    }),
    lineInfo: function(e) {
      if ("number" == typeof e) {
        if (!ye(this.doc, e)) return null;
        var t = e;
        if (e = Xr(this.doc, e), !e) return null
      } else {
        var t = Zr(e);
        if (null == t) return null
      }
      return {
        line: t,
        handle: e,
        text: e.text,
        gutterMarkers: e.gutterMarkers,
        textClass: e.textClass,
        bgClass: e.bgClass,
        wrapClass: e.wrapClass,
        widgets: e.widgets
      }
    },
    getViewport: function() {
      return {
        from: this.display.viewFrom,
        to: this.display.viewTo
      }
    },
    addWidget: function(e, t, n, r, i) {
      var o = this.display;
      e = dt(this, me(this.doc, e));
      var l = e.bottom,
        s = e.left;
      if (t.style.position = "absolute", t.setAttribute("cm-ignore-events", "true"), this.display.input.setUneditable(t), o.sizer.appendChild(t), "over" == r) l = e.top;
      else if ("above" == r || "near" == r) {
        var a = Math.max(o.wrapper.clientHeight, this.doc.height),
          c = Math.max(o.sizer.clientWidth, o.lineSpace.clientWidth);
        ("above" == r || e.bottom + t.offsetHeight > a) && e.top > t.offsetHeight ? l = e.top - t.offsetHeight : e.bottom + t.offsetHeight <= a && (l = e.bottom), s + t.offsetWidth > c && (s = c - t.offsetWidth)
      }
      t.style.top = l + "px", t.style.left = t.style.right = "", "right" == i ? (s = o.sizer.clientWidth - t.offsetWidth, t.style.right = "0px") : ("left" == i ? s = 0 : "middle" == i && (s = (o.sizer.clientWidth - t.offsetWidth) / 2), t.style.left = s + "px"), n && Pn(this, s, l, s + t.offsetWidth, l + t.offsetHeight)
    },
    triggerOnKeyDown: Nt(cn),
    triggerOnKeyPress: Nt(dn),
    triggerOnKeyUp: fn,
    execCommand: function(e) {
      return il.hasOwnProperty(e) ? il[e](this) : void 0
    },
    triggerElectric: Nt(function(e) {
      ee(this, e)
    }),
    findPosH: function(e, t, n, r) {
      var i = 1;
      0 > t && (i = -1, t = -t);
      for (var o = 0, l = me(this.doc, e); t > o && (l = Bn(this.doc, l, i, n, r), !l.hitSide); ++o);
      return l
    },
    moveH: Nt(function(e, t) {
      var n = this;
      n.extendSelectionsBy(function(r) {
        return n.display.shift || n.doc.extend || r.empty() ? Bn(n.doc, r.head, e, t, n.options.rtlMoveVisually) : 0 > e ? r.from() : r.to()
      }, Pl)
    }),
    deleteH: Nt(function(e, t) {
      var n = this.doc.sel,
        r = this.doc;
      n.somethingSelected() ? r.replaceSelection("", null, "+delete") : Rn(this, function(n) {
        var i = Bn(r, n.head, e, t, !1);
        return 0 > e ? {
          from: i,
          to: n.head
        } : {
          from: n.head,
          to: i
        }
      })
    }),
    findPosV: function(e, t, n, r) {
      var i = 1,
        o = r;
      0 > t && (i = -1, t = -t);
      for (var l = 0, s = me(this.doc, e); t > l; ++l) {
        var a = dt(this, s, "div");
        if (null == o ? o = a.left : a.left = o, s = jn(this, a, i, n), s.hitSide) break
      }
      return s
    },
    moveV: Nt(function(e, t) {
      var n = this,
        r = this.doc,
        i = [],
        o = !n.display.shift && !r.extend && r.sel.somethingSelected();
      if (r.extendSelectionsBy(function(l) {
          if (o) return 0 > e ? l.from() : l.to();
          var s = dt(n, l.head, "div");
          null != l.goalColumn && (s.left = l.goalColumn), i.push(s.left);
          var a = jn(n, s, e, t);
          return "page" == t && l == r.sel.primary() && Dn(n, null, ft(n, a, "div").top - s.top), a
        }, Pl), i.length)
        for (var l = 0; l < r.sel.ranges.length; l++) r.sel.ranges[l].goalColumn = i[l]
    }),
    findWordAt: function(e) {
      var t = this.doc,
        n = Xr(t, e.line).text,
        r = e.ch,
        i = e.ch;
      if (n) {
        var o = this.getHelper(e, "wordChars");
        (e.xRel < 0 || i == n.length) && r ? --r : ++i;
        for (var l = n.charAt(r), s = Fi(l, o) ? function(e) {
            return Fi(e, o)
          } : /\s/.test(l) ? function(e) {
            return /\s/.test(e)
          } : function(e) {
            return !/\s/.test(e) && !Fi(e)
          }; r > 0 && s(n.charAt(r - 1));) --r;
        for (; i < n.length && s(n.charAt(i));) ++i
      }
      return new de(Po(e.line, r), Po(e.line, i))
    },
    toggleOverwrite: function(e) {
      (null == e || e != this.state.overwrite) && ((this.state.overwrite = !this.state.overwrite) ? Ul(this.display.cursorDiv, "CodeMirror-overwrite") : ql(this.display.cursorDiv, "CodeMirror-overwrite"), Tl(this, "overwriteToggle", this, this.state.overwrite))
    },
    hasFocus: function() {
      return this.display.input.getField() == Gi()
    },
    scrollTo: Nt(function(e, t) {
      (null != e || null != t) && Fn(this), null != e && (this.curOp.scrollLeft = e), null != t && (this.curOp.scrollTop = t)
    }),
    getScrollInfo: function() {
      var e = this.display.scroller;
      return {
        left: e.scrollLeft,
        top: e.scrollTop,
        height: e.scrollHeight - Ve(this) - this.display.barHeight,
        width: e.scrollWidth - Ve(this) - this.display.barWidth,
        clientHeight: _e(this),
        clientWidth: Ke(this)
      }
    },
    scrollIntoView: Nt(function(e, t) {
      if (null == e ? (e = {
          from: this.doc.sel.primary().head,
          to: null
        }, null == t && (t = this.options.cursorScrollMargin)) : "number" == typeof e ? e = {
          from: Po(e, 0),
          to: null
        } : null == e.from && (e = {
          from: e,
          to: null
        }), e.to || (e.to = e.from), e.margin = t || 0, null != e.from.line) Fn(this), this.curOp.scrollToPos = e;
      else {
        var n = Wn(this, Math.min(e.from.left, e.to.left), Math.min(e.from.top, e.to.top) - e.margin, Math.max(e.from.right, e.to.right), Math.max(e.from.bottom, e.to.bottom) + e.margin);
        this.scrollTo(n.scrollLeft, n.scrollTop)
      }
    }),
    setSize: Nt(function(e, t) {
      function n(e) {
        return "number" == typeof e || /^\d+$/.test(String(e)) ? e + "px" : e
      }
      var r = this;
      null != e && (r.display.wrapper.style.width = n(e)), null != t && (r.display.wrapper.style.height = n(t)), r.options.lineWrapping && ot(this);
      var i = r.display.viewFrom;
      r.doc.iter(i, r.display.viewTo, function(e) {
        if (e.widgets)
          for (var t = 0; t < e.widgets.length; t++)
            if (e.widgets[t].noHScroll) {
              Et(r, i, "widget");
              break
            }++i
      }), r.curOp.forceUpdate = !0, Tl(r, "refresh", this)
    }),
    operation: function(e) {
      return At(this, e)
    },
    refresh: Nt(function() {
      var e = this.display.cachedTextHeight;
      Dt(this), this.curOp.forceUpdate = !0, lt(this), this.scrollTo(this.doc.scrollLeft, this.doc.scrollTop), u(this), (null == e || Math.abs(e - vt(this.display)) > .5) && l(this), Tl(this, "refresh", this)
    }),
    swapDoc: Nt(function(e) {
      var t = this.doc;
      return t.cm = null, _r(this, e), lt(this), this.display.input.reset(), this.scrollTo(e.scrollLeft, e.scrollTop), this.curOp.forceScroll = !0, xi(this, "swapDoc", this, t), t
    }),
    getInputField: function() {
      return this.display.input.getField()
    },
    getWrapperElement: function() {
      return this.display.wrapper
    },
    getScrollerElement: function() {
      return this.display.scroller
    },
    getGutterElement: function() {
      return this.display.gutters
    }
  }, ki(e);
  var Xo = e.defaults = {},
    Yo = e.optionHandlers = {},
    $o = e.Init = {
      toString: function() {
        return "CodeMirror.Init"
      }
    };
  Gn("value", "", function(e, t) {
    e.setValue(t)
  }, !0), Gn("mode", null, function(e, t) {
    e.doc.modeOption = t, n(e)
  }, !0), Gn("indentUnit", 2, n, !0), Gn("indentWithTabs", !1), Gn("smartIndent", !0), Gn("tabSize", 4, function(e) {
    r(e), lt(e), Dt(e)
  }, !0), Gn("lineSeparator", null, function(e, t) {
    if (e.doc.lineSep = t, t) {
      var n = [],
        r = e.doc.first;
      e.doc.iter(function(e) {
        for (var i = 0;;) {
          var o = e.text.indexOf(t, i);
          if (-1 == o) break;
          i = o + t.length, n.push(Po(r, o))
        }
        r++
      });
      for (var i = n.length - 1; i >= 0; i--) On(e.doc, t, n[i], Po(n[i].line, n[i].ch + t.length))
    }
  }), Gn("specialChars", /[\t\u0000-\u0019\u00ad\u200b-\u200f\u2028\u2029\ufeff]/g, function(t, n, r) {
    t.state.specialChars = new RegExp(n.source + (n.test("	") ? "" : "|	"), "g"), r != e.Init && t.refresh()
  }), Gn("specialCharPlaceholder", Fr, function(e) {
    e.refresh()
  }, !0), Gn("electricChars", !0), Gn("inputStyle", Lo ? "contenteditable" : "textarea", function() {
    throw new Error("inputStyle can not (yet) be changed in a running editor")
  }, !0), Gn("rtlMoveVisually", !To), Gn("wholeLineUpdateBefore", !0), Gn("theme", "default", function(e) {
    s(e), a(e)
  }, !0), Gn("keyMap", "default", function(t, n, r) {
    var i = Un(n),
      o = r != e.Init && Un(r);
    o && o.detach && o.detach(t, i), i.attach && i.attach(t, o || null)
  }), Gn("extraKeys", null), Gn("lineWrapping", !1, i, !0), Gn("gutters", [], function(e) {
    h(e.options), a(e)
  }, !0), Gn("fixedGutter", !0, function(e, t) {
    e.display.gutters.style.left = t ? L(e.display) + "px" : "0", e.refresh()
  }, !0), Gn("coverGutterNextToScrollbar", !1, function(e) {
    y(e)
  }, !0), Gn("scrollbarStyle", "native", function(e) {
    v(e), y(e), e.display.scrollbars.setScrollTop(e.doc.scrollTop), e.display.scrollbars.setScrollLeft(e.doc.scrollLeft)
  }, !0), Gn("lineNumbers", !1, function(e) {
    h(e.options), a(e)
  }, !0), Gn("firstLineNumber", 1, a, !0), Gn("lineNumberFormatter", function(e) {
    return e
  }, a, !0), Gn("showCursorWhenSelecting", !1, We, !0), Gn("resetSelectionOnContextMenu", !0), Gn("lineWiseCopyCut", !0), Gn("readOnly", !1, function(e, t) {
    "nocursor" == t ? (gn(e), e.display.input.blur(), e.display.disabled = !0) : (e.display.disabled = !1, t || e.display.input.reset())
  }), Gn("disableInput", !1, function(e, t) {
    t || e.display.input.reset()
  }, !0), Gn("dragDrop", !0, Gt), Gn("cursorBlinkRate", 530), Gn("cursorScrollMargin", 0), Gn("cursorHeight", 1, We, !0), Gn("singleCursorHeightPerLine", !0, We, !0), Gn("workTime", 100), Gn("workDelay", 100), Gn("flattenSpans", !0, r, !0), Gn("addModeClass", !1, r, !0), Gn("pollInterval", 100), Gn("undoDepth", 200, function(e, t) {
    e.doc.history.undoDepth = t
  }), Gn("historyEventDelay", 1250), Gn("viewportMargin", 10, function(e) {
    e.refresh()
  }, !0), Gn("maxHighlightLength", 1e4, r, !0), Gn("moveInputWithCursor", !0, function(e, t) {
    t || e.display.input.resetPosition()
  }), Gn("tabindex", null, function(e, t) {
    e.display.input.getField().tabIndex = t || ""
  }), Gn("autofocus", null);
  var Qo = e.modes = {},
    Zo = e.mimeModes = {};
  e.defineMode = function(t, n) {
    e.defaults.mode || "null" == t || (e.defaults.mode = t), arguments.length > 2 && (n.dependencies = Array.prototype.slice.call(arguments, 2)), Qo[t] = n
  }, e.defineMIME = function(e, t) {
    Zo[e] = t
  }, e.resolveMode = function(t) {
    if ("string" == typeof t && Zo.hasOwnProperty(t)) t = Zo[t];
    else if (t && "string" == typeof t.name && Zo.hasOwnProperty(t.name)) {
      var n = Zo[t.name];
      "string" == typeof n && (n = {
        name: n
      }), t = Wi(n, t), t.name = n.name
    } else if ("string" == typeof t && /^[\w\-]+\/[\w\-]+\+xml$/.test(t)) return e.resolveMode("application/xml");
    return "string" == typeof t ? {
      name: t
    } : t || {
      name: "null"
    }
  }, e.getMode = function(t, n) {
    var n = e.resolveMode(n),
      r = Qo[n.name];
    if (!r) return e.getMode(t, "text/plain");
    var i = r(t, n);
    if (Jo.hasOwnProperty(n.name)) {
      var o = Jo[n.name];
      for (var l in o) o.hasOwnProperty(l) && (i.hasOwnProperty(l) && (i["_" + l] = i[l]), i[l] = o[l])
    }
    if (i.name = n.name, n.helperType && (i.helperType = n.helperType), n.modeProps)
      for (var l in n.modeProps) i[l] = n.modeProps[l];
    return i
  }, e.defineMode("null", function() {
    return {
      token: function(e) {
        e.skipToEnd()
      }
    }
  }), e.defineMIME("text/plain", "null");
  var Jo = e.modeExtensions = {};
  e.extendMode = function(e, t) {
    var n = Jo.hasOwnProperty(e) ? Jo[e] : Jo[e] = {};
    Di(t, n)
  }, e.defineExtension = function(t, n) {
    e.prototype[t] = n
  }, e.defineDocExtension = function(e, t) {
    yl.prototype[e] = t
  }, e.defineOption = Gn;
  var el = [];
  e.defineInitHook = function(e) {
    el.push(e)
  };
  var tl = e.helpers = {};
  e.registerHelper = function(t, n, r) {
    tl.hasOwnProperty(t) || (tl[t] = e[t] = {
      _global: []
    }), tl[t][n] = r
  }, e.registerGlobalHelper = function(t, n, r, i) {
    e.registerHelper(t, n, i), tl[t]._global.push({
      pred: r,
      val: i
    })
  };
  var nl = e.copyState = function(e, t) {
      if (t === !0) return t;
      if (e.copyState) return e.copyState(t);
      var n = {};
      for (var r in t) {
        var i = t[r];
        i instanceof Array && (i = i.concat([])), n[r] = i
      }
      return n
    },
    rl = e.startState = function(e, t, n) {
      return e.startState ? e.startState(t, n) : !0
    };
  e.innerMode = function(e, t) {
    for (; e.innerMode;) {
      var n = e.innerMode(t);
      if (!n || n.mode == e) break;
      t = n.state, e = n.mode
    }
    return n || {
      mode: e,
      state: t
    }
  };
  var il = e.commands = {
      selectAll: function(e) {
        e.setSelection(Po(e.firstLine(), 0), Po(e.lastLine()), Nl)
      },
      singleSelection: function(e) {
        e.setSelection(e.getCursor("anchor"), e.getCursor("head"), Nl)
      },
      killLine: function(e) {
        Rn(e, function(t) {
          if (t.empty()) {
            var n = Xr(e.doc, t.head.line).text.length;
            return t.head.ch == n && t.head.line < e.lastLine() ? {
              from: t.head,
              to: Po(t.head.line + 1, 0)
            } : {
              from: t.head,
              to: Po(t.head.line, n)
            }
          }
          return {
            from: t.from(),
            to: t.to()
          }
        })
      },
      deleteLine: function(e) {
        Rn(e, function(t) {
          return {
            from: Po(t.from().line, 0),
            to: me(e.doc, Po(t.to().line + 1, 0))
          }
        })
      },
      delLineLeft: function(e) {
        Rn(e, function(e) {
          return {
            from: Po(e.from().line, 0),
            to: e.from()
          }
        })
      },
      delWrappedLineLeft: function(e) {
        Rn(e, function(t) {
          var n = e.charCoords(t.head, "div").top + 5,
            r = e.coordsChar({
              left: 0,
              top: n
            }, "div");
          return {
            from: r,
            to: t.from()
          }
        })
      },
      delWrappedLineRight: function(e) {
        Rn(e, function(t) {
          var n = e.charCoords(t.head, "div").top + 5,
            r = e.coordsChar({
              left: e.display.lineDiv.offsetWidth + 100,
              top: n
            }, "div");
          return {
            from: t.from(),
            to: r
          }
        })
      },
      undo: function(e) {
        e.undo()
      },
      redo: function(e) {
        e.redo()
      },
      undoSelection: function(e) {
        e.undoSelection()
      },
      redoSelection: function(e) {
        e.redoSelection()
      },
      goDocStart: function(e) {
        e.extendSelection(Po(e.firstLine(), 0))
      },
      goDocEnd: function(e) {
        e.extendSelection(Po(e.lastLine()))
      },
      goLineStart: function(e) {
        e.extendSelectionsBy(function(t) {
          return no(e, t.head.line)
        }, {
          origin: "+move",
          bias: 1
        })
      },
      goLineStartSmart: function(e) {
        e.extendSelectionsBy(function(t) {
          return io(e, t.head)
        }, {
          origin: "+move",
          bias: 1
        })
      },
      goLineEnd: function(e) {
        e.extendSelectionsBy(function(t) {
          return ro(e, t.head.line)
        }, {
          origin: "+move",
          bias: -1
        })
      },
      goLineRight: function(e) {
        e.extendSelectionsBy(function(t) {
          var n = e.charCoords(t.head, "div").top + 5;
          return e.coordsChar({
            left: e.display.lineDiv.offsetWidth + 100,
            top: n
          }, "div")
        }, Pl)
      },
      goLineLeft: function(e) {
        e.extendSelectionsBy(function(t) {
          var n = e.charCoords(t.head, "div").top + 5;
          return e.coordsChar({
            left: 0,
            top: n
          }, "div")
        }, Pl)
      },
      goLineLeftSmart: function(e) {
        e.extendSelectionsBy(function(t) {
          var n = e.charCoords(t.head, "div").top + 5,
            r = e.coordsChar({
              left: 0,
              top: n
            }, "div");
          return r.ch < e.getLine(r.line).search(/\S/) ? io(e, t.head) : r
        }, Pl)
      },
      goLineUp: function(e) {
        e.moveV(-1, "line")
      },
      goLineDown: function(e) {
        e.moveV(1, "line")
      },
      goPageUp: function(e) {
        e.moveV(-1, "page")
      },
      goPageDown: function(e) {
        e.moveV(1, "page")
      },
      goCharLeft: function(e) {
        e.moveH(-1, "char")
      },
      goCharRight: function(e) {
        e.moveH(1, "char")
      },
      goColumnLeft: function(e) {
        e.moveH(-1, "column")
      },
      goColumnRight: function(e) {
        e.moveH(1, "column")
      },
      goWordLeft: function(e) {
        e.moveH(-1, "word")
      },
      goGroupRight: function(e) {
        e.moveH(1, "group")
      },
      goGroupLeft: function(e) {
        e.moveH(-1, "group")
      },
      goWordRight: function(e) {
        e.moveH(1, "word")
      },
      delCharBefore: function(e) {
        e.deleteH(-1, "char")
      },
      delCharAfter: function(e) {
        e.deleteH(1, "char")
      },
      delWordBefore: function(e) {
        e.deleteH(-1, "word")
      },
      delWordAfter: function(e) {
        e.deleteH(1, "word")
      },
      delGroupBefore: function(e) {
        e.deleteH(-1, "group")
      },
      delGroupAfter: function(e) {
        e.deleteH(1, "group")
      },
      indentAuto: function(e) {
        e.indentSelection("smart")
      },
      indentMore: function(e) {
        e.indentSelection("add")
      },
      indentLess: function(e) {
        e.indentSelection("subtract")
      },
      insertTab: function(e) {
        e.replaceSelection("	")
      },
      insertSoftTab: function(e) {
        for (var t = [], n = e.listSelections(), r = e.options.tabSize, i = 0; i < n.length; i++) {
          var o = n[i].from(),
            l = Wl(e.getLine(o.line), o.ch, r);
          t.push(new Array(r - l % r + 1).join(" "))
        }
        e.replaceSelections(t)
      },
      defaultTab: function(e) {
        e.somethingSelected() ? e.indentSelection("add") : e.execCommand("insertTab")
      },
      transposeChars: function(e) {
        At(e, function() {
          for (var t = e.listSelections(), n = [], r = 0; r < t.length; r++) {
            var i = t[r].head,
              o = Xr(e.doc, i.line).text;
            if (o)
              if (i.ch == o.length && (i = new Po(i.line, i.ch - 1)), i.ch > 0) i = new Po(i.line, i.ch + 1), e.replaceRange(o.charAt(i.ch - 1) + o.charAt(i.ch - 2), Po(i.line, i.ch - 2), i, "+transpose");
              else if (i.line > e.doc.first) {
              var l = Xr(e.doc, i.line - 1).text;
              l && e.replaceRange(o.charAt(0) + e.doc.lineSeparator() + l.charAt(l.length - 1), Po(i.line - 1, l.length - 1), Po(i.line, 1), "+transpose")
            }
            n.push(new de(i, i))
          }
          e.setSelections(n)
        })
      },
      newlineAndIndent: function(e) {
        At(e, function() {
          for (var t = e.listSelections().length, n = 0; t > n; n++) {
            var r = e.listSelections()[n];
            e.replaceRange(e.doc.lineSeparator(), r.anchor, r.head, "+input"), e.indentLine(r.from().line + 1, null, !0), En(e)
          }
        })
      },
      toggleOverwrite: function(e) {
        e.toggleOverwrite()
      }
    },
    ol = e.keyMap = {};
  ol.basic = {
    Left: "goCharLeft",
    Right: "goCharRight",
    Up: "goLineUp",
    Down: "goLineDown",
    End: "goLineEnd",
    Home: "goLineStartSmart",
    PageUp: "goPageUp",
    PageDown: "goPageDown",
    Delete: "delCharAfter",
    Backspace: "delCharBefore",
    "Shift-Backspace": "delCharBefore",
    Tab: "defaultTab",
    "Shift-Tab": "indentAuto",
    Enter: "newlineAndIndent",
    Insert: "toggleOverwrite",
    Esc: "singleSelection"
  }, ol.pcDefault = {
    "Ctrl-A": "selectAll",
    "Ctrl-D": "deleteLine",
    "Ctrl-Z": "undo",
    "Shift-Ctrl-Z": "redo",
    "Ctrl-Y": "redo",
    "Ctrl-Home": "goDocStart",
    "Ctrl-End": "goDocEnd",
    "Ctrl-Up": "goLineUp",
    "Ctrl-Down": "goLineDown",
    "Ctrl-Left": "goGroupLeft",
    "Ctrl-Right": "goGroupRight",
    "Alt-Left": "goLineStart",
    "Alt-Right": "goLineEnd",
    "Ctrl-Backspace": "delGroupBefore",
    "Ctrl-Delete": "delGroupAfter",
    "Ctrl-S": "save",
    "Ctrl-F": "find",
    "Ctrl-G": "findNext",
    "Shift-Ctrl-G": "findPrev",
    "Shift-Ctrl-F": "replace",
    "Shift-Ctrl-R": "replaceAll",
    "Ctrl-[": "indentLess",
    "Ctrl-]": "indentMore",
    "Ctrl-U": "undoSelection",
    "Shift-Ctrl-U": "redoSelection",
    "Alt-U": "redoSelection",
    fallthrough: "basic"
  }, ol.emacsy = {
    "Ctrl-F": "goCharRight",
    "Ctrl-B": "goCharLeft",
    "Ctrl-P": "goLineUp",
    "Ctrl-N": "goLineDown",
    "Alt-F": "goWordRight",
    "Alt-B": "goWordLeft",
    "Ctrl-A": "goLineStart",
    "Ctrl-E": "goLineEnd",
    "Ctrl-V": "goPageDown",
    "Shift-Ctrl-V": "goPageUp",
    "Ctrl-D": "delCharAfter",
    "Ctrl-H": "delCharBefore",
    "Alt-D": "delWordAfter",
    "Alt-Backspace": "delWordBefore",
    "Ctrl-K": "killLine",
    "Ctrl-T": "transposeChars"
  }, ol.macDefault = {
    "Cmd-A": "selectAll",
    "Cmd-D": "deleteLine",
    "Cmd-Z": "undo",
    "Shift-Cmd-Z": "redo",
    "Cmd-Y": "redo",
    "Cmd-Home": "goDocStart",
    "Cmd-Up": "goDocStart",
    "Cmd-End": "goDocEnd",
    "Cmd-Down": "goDocEnd",
    "Alt-Left": "goGroupLeft",
    "Alt-Right": "goGroupRight",
    "Cmd-Left": "goLineLeft",
    "Cmd-Right": "goLineRight",
    "Alt-Backspace": "delGroupBefore",
    "Ctrl-Alt-Backspace": "delGroupAfter",
    "Alt-Delete": "delGroupAfter",
    "Cmd-S": "save",
    "Cmd-F": "find",
    "Cmd-G": "findNext",
    "Shift-Cmd-G": "findPrev",
    "Cmd-Alt-F": "replace",
    "Shift-Cmd-Alt-F": "replaceAll",
    "Cmd-[": "indentLess",
    "Cmd-]": "indentMore",
    "Cmd-Backspace": "delWrappedLineLeft",
    "Cmd-Delete": "delWrappedLineRight",
    "Cmd-U": "undoSelection",
    "Shift-Cmd-U": "redoSelection",
    "Ctrl-Up": "goDocStart",
    "Ctrl-Down": "goDocEnd",
    fallthrough: ["basic", "emacsy"]
  }, ol["default"] = ko ? ol.macDefault : ol.pcDefault, e.normalizeKeyMap = function(e) {
    var t = {};
    for (var n in e)
      if (e.hasOwnProperty(n)) {
        var r = e[n];
        if (/^(name|fallthrough|(de|at)tach)$/.test(n)) continue;
        if ("..." == r) {
          delete e[n];
          continue
        }
        for (var i = Hi(n.split(" "), qn), o = 0; o < i.length; o++) {
          var l, s;
          o == i.length - 1 ? (s = i.join(" "), l = r) : (s = i.slice(0, o + 1).join(" "), l = "...");
          var a = t[s];
          if (a) {
            if (a != l) throw new Error("Inconsistent bindings for " + s)
          } else t[s] = l
        }
        delete e[n]
      }
    for (var c in t) e[c] = t[c];
    return e
  };
  var ll = e.lookupKey = function(e, t, n, r) {
      t = Un(t);
      var i = t.call ? t.call(e, r) : t[e];

      if (i === !1) return "nothing";
      if ("..." === i) return "multi";
      if (null != i && n(i)) return "handled";
      if (t.fallthrough) {
        if ("[object Array]" != Object.prototype.toString.call(t.fallthrough)) return ll(e, t.fallthrough, n, r);
        for (var o = 0; o < t.fallthrough.length; o++) {
          var l = ll(e, t.fallthrough[o], n, r);
          if (l) return l
        }
      }
    },
    sl = e.isModifierKey = function(e) {
      var t = "string" == typeof e ? e : Ql[e.keyCode];
      return "Ctrl" == t || "Alt" == t || "Shift" == t || "Mod" == t
    },
    al = e.keyName = function(e, t) {
      if (bo && 34 == e.keyCode && e["char"]) return !1;
      var n = Ql[e.keyCode],
        r = n;
      return null == r || e.altGraphKey ? !1 : (e.altKey && "Alt" != n && (r = "Alt-" + r), (Ao ? e.metaKey : e.ctrlKey) && "Ctrl" != n && (r = "Ctrl-" + r), (Ao ? e.ctrlKey : e.metaKey) && "Cmd" != n && (r = "Cmd-" + r), !t && e.shiftKey && "Shift" != n && (r = "Shift-" + r), r)
    };
  e.fromTextArea = function(t, n) {
    function r() {
      t.value = c.getValue()
    }
    if (n = n ? Di(n) : {}, n.value = t.value, !n.tabindex && t.tabIndex && (n.tabindex = t.tabIndex), !n.placeholder && t.placeholder && (n.placeholder = t.placeholder), null == n.autofocus) {
      var i = Gi();
      n.autofocus = i == t || null != t.getAttribute("autofocus") && i == document.body
    }
    if (t.form && (Ll(t.form, "submit", r), !n.leaveSubmitMethodAlone)) {
      var o = t.form,
        l = o.submit;
      try {
        var s = o.submit = function() {
          r(), o.submit = l, o.submit(), o.submit = s
        }
      } catch (a) {}
    }
    n.finishInit = function(e) {
      e.save = r, e.getTextArea = function() {
        return t
      }, e.toTextArea = function() {
        e.toTextArea = isNaN, r(), t.parentNode.removeChild(e.getWrapperElement()), t.style.display = "", t.form && (kl(t.form, "submit", r), "function" == typeof t.form.submit && (t.form.submit = l))
      }
    }, t.style.display = "none";
    var c = e(function(e) {
      t.parentNode.insertBefore(e, t.nextSibling)
    }, n);
    return c
  };
  var cl = e.StringStream = function(e, t) {
    this.pos = this.start = 0, this.string = e, this.tabSize = t || 8, this.lastColumnPos = this.lastColumnValue = 0, this.lineStart = 0
  };
  cl.prototype = {
    eol: function() {
      return this.pos >= this.string.length
    },
    sol: function() {
      return this.pos == this.lineStart
    },
    peek: function() {
      return this.string.charAt(this.pos) || void 0
    },
    next: function() {
      return this.pos < this.string.length ? this.string.charAt(this.pos++) : void 0
    },
    eat: function(e) {
      var t = this.string.charAt(this.pos);
      if ("string" == typeof e) var n = t == e;
      else var n = t && (e.test ? e.test(t) : e(t));
      return n ? (++this.pos, t) : void 0
    },
    eatWhile: function(e) {
      for (var t = this.pos; this.eat(e););
      return this.pos > t
    },
    eatSpace: function() {
      for (var e = this.pos;
        /[\s\u00a0]/.test(this.string.charAt(this.pos));) ++this.pos;
      return this.pos > e
    },
    skipToEnd: function() {
      this.pos = this.string.length
    },
    skipTo: function(e) {
      var t = this.string.indexOf(e, this.pos);
      return t > -1 ? (this.pos = t, !0) : void 0
    },
    backUp: function(e) {
      this.pos -= e
    },
    column: function() {
      return this.lastColumnPos < this.start && (this.lastColumnValue = Wl(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start), this.lastColumnValue - (this.lineStart ? Wl(this.string, this.lineStart, this.tabSize) : 0)
    },
    indentation: function() {
      return Wl(this.string, null, this.tabSize) - (this.lineStart ? Wl(this.string, this.lineStart, this.tabSize) : 0)
    },
    match: function(e, t, n) {
      if ("string" != typeof e) {
        var r = this.string.slice(this.pos).match(e);
        return r && r.index > 0 ? null : (r && t !== !1 && (this.pos += r[0].length), r)
      }
      var i = function(e) {
          return n ? e.toLowerCase() : e
        },
        o = this.string.substr(this.pos, e.length);
      return i(o) == i(e) ? (t !== !1 && (this.pos += e.length), !0) : void 0
    },
    current: function() {
      return this.string.slice(this.start, this.pos)
    },
    hideFirstChars: function(e, t) {
      this.lineStart += e;
      try {
        return t()
      } finally {
        this.lineStart -= e
      }
    }
  };
  var ul = 0,
    fl = e.TextMarker = function(e, t) {
      this.lines = [], this.type = t, this.doc = e, this.id = ++ul
    };
  ki(fl), fl.prototype.clear = function() {
    if (!this.explicitlyCleared) {
      var e = this.doc.cm,
        t = e && !e.curOp;
      if (t && bt(e), Li(this, "clear")) {
        var n = this.find();
        n && xi(this, "clear", n.from, n.to)
      }
      for (var r = null, i = null, o = 0; o < this.lines.length; ++o) {
        var l = this.lines[o],
          s = Qn(l.markedSpans, this);
        e && !this.collapsed ? Et(e, Zr(l), "text") : e && (null != s.to && (i = Zr(l)), null != s.from && (r = Zr(l))), l.markedSpans = Zn(l.markedSpans, s), null == s.from && this.collapsed && !br(this.doc, l) && e && Qr(l, vt(e.display))
      }
      if (e && this.collapsed && !e.options.lineWrapping)
        for (var o = 0; o < this.lines.length; ++o) {
          var a = gr(this.lines[o]),
            c = f(a);
          c > e.display.maxLineLength && (e.display.maxLine = a, e.display.maxLineLength = c, e.display.maxLineChanged = !0)
        }
      null != r && e && this.collapsed && Dt(e, r, i + 1), this.lines.length = 0, this.explicitlyCleared = !0, this.atomic && this.doc.cantEdit && (this.doc.cantEdit = !1, e && Ne(e.doc)), e && xi(e, "markerCleared", e, this), t && Ct(e), this.parent && this.parent.clear()
    }
  }, fl.prototype.find = function(e, t) {
    null == e && "bookmark" == this.type && (e = 1);
    for (var n, r, i = 0; i < this.lines.length; ++i) {
      var o = this.lines[i],
        l = Qn(o.markedSpans, this);
      if (null != l.from && (n = Po(t ? o : Zr(o), l.from), -1 == e)) return n;
      if (null != l.to && (r = Po(t ? o : Zr(o), l.to), 1 == e)) return r
    }
    return n && {
      from: n,
      to: r
    }
  }, fl.prototype.changed = function() {
    var e = this.find(-1, !0),
      t = this,
      n = this.doc.cm;
    e && n && At(n, function() {
      var r = e.line,
        i = Zr(e.line),
        o = Ze(n, i);
      if (o && (it(o), n.curOp.selectionChanged = n.curOp.forceUpdate = !0), n.curOp.updateMaxLine = !0, !br(t.doc, r) && null != t.height) {
        var l = t.height;
        t.height = null;
        var s = wr(t) - l;
        s && Qr(r, r.height + s)
      }
    })
  }, fl.prototype.attachLine = function(e) {
    if (!this.lines.length && this.doc.cm) {
      var t = this.doc.cm.curOp;
      t.maybeHiddenMarkers && -1 != Ni(t.maybeHiddenMarkers, this) || (t.maybeUnhiddenMarkers || (t.maybeUnhiddenMarkers = [])).push(this)
    }
    this.lines.push(e)
  }, fl.prototype.detachLine = function(e) {
    if (this.lines.splice(Ni(this.lines, e), 1), !this.lines.length && this.doc.cm) {
      var t = this.doc.cm.curOp;
      (t.maybeHiddenMarkers || (t.maybeHiddenMarkers = [])).push(this)
    }
  };
  var ul = 0,
    dl = e.SharedTextMarker = function(e, t) {
      this.markers = e, this.primary = t;
      for (var n = 0; n < e.length; ++n) e[n].parent = this
    };
  ki(dl), dl.prototype.clear = function() {
    if (!this.explicitlyCleared) {
      this.explicitlyCleared = !0;
      for (var e = 0; e < this.markers.length; ++e) this.markers[e].clear();
      xi(this, "clear")
    }
  }, dl.prototype.find = function(e, t) {
    return this.primary.find(e, t)
  };
  var hl = e.LineWidget = function(e, t, n) {
    if (n)
      for (var r in n) n.hasOwnProperty(r) && (this[r] = n[r]);
    this.doc = e, this.node = t
  };
  ki(hl), hl.prototype.clear = function() {
    var e = this.doc.cm,
      t = this.line.widgets,
      n = this.line,
      r = Zr(n);
    if (null != r && t) {
      for (var i = 0; i < t.length; ++i) t[i] == this && t.splice(i--, 1);
      t.length || (n.widgets = null);
      var o = wr(this);
      Qr(n, Math.max(0, n.height - o)), e && At(e, function() {
        Cr(e, n, -o), Et(e, r, "widget")
      })
    }
  }, hl.prototype.changed = function() {
    var e = this.height,
      t = this.doc.cm,
      n = this.line;
    this.height = null;
    var r = wr(this) - e;
    r && (Qr(n, n.height + r), t && At(t, function() {
      t.curOp.forceUpdate = !0, Cr(t, n, r)
    }))
  };
  var pl = e.Line = function(e, t, n) {
    this.text = e, sr(this, t), this.height = n ? n(this) : 1
  };
  ki(pl), pl.prototype.lineNo = function() {
    return Zr(this)
  };
  var gl = {},
    ml = {};
  Ur.prototype = {
    chunkSize: function() {
      return this.lines.length
    },
    removeInner: function(e, t) {
      for (var n = e, r = e + t; r > n; ++n) {
        var i = this.lines[n];
        this.height -= i.height, kr(i), xi(i, "delete")
      }
      this.lines.splice(e, t)
    },
    collapse: function(e) {
      e.push.apply(e, this.lines)
    },
    insertInner: function(e, t, n) {
      this.height += n, this.lines = this.lines.slice(0, e).concat(t).concat(this.lines.slice(e));
      for (var r = 0; r < t.length; ++r) t[r].parent = this
    },
    iterN: function(e, t, n) {
      for (var r = e + t; r > e; ++e)
        if (n(this.lines[e])) return !0
    }
  }, Vr.prototype = {
    chunkSize: function() {
      return this.size
    },
    removeInner: function(e, t) {
      this.size -= t;
      for (var n = 0; n < this.children.length; ++n) {
        var r = this.children[n],
          i = r.chunkSize();
        if (i > e) {
          var o = Math.min(t, i - e),
            l = r.height;
          if (r.removeInner(e, o), this.height -= l - r.height, i == o && (this.children.splice(n--, 1), r.parent = null), 0 == (t -= o)) break;
          e = 0
        } else e -= i
      }
      if (this.size - t < 25 && (this.children.length > 1 || !(this.children[0] instanceof Ur))) {
        var s = [];
        this.collapse(s), this.children = [new Ur(s)], this.children[0].parent = this
      }
    },
    collapse: function(e) {
      for (var t = 0; t < this.children.length; ++t) this.children[t].collapse(e)
    },
    insertInner: function(e, t, n) {
      this.size += t.length, this.height += n;
      for (var r = 0; r < this.children.length; ++r) {
        var i = this.children[r],
          o = i.chunkSize();
        if (o >= e) {
          if (i.insertInner(e, t, n), i.lines && i.lines.length > 50) {
            for (; i.lines.length > 50;) {
              var l = i.lines.splice(i.lines.length - 25, 25),
                s = new Ur(l);
              i.height -= s.height, this.children.splice(r + 1, 0, s), s.parent = this
            }
            this.maybeSpill()
          }
          break
        }
        e -= o
      }
    },
    maybeSpill: function() {
      if (!(this.children.length <= 10)) {
        var e = this;
        do {
          var t = e.children.splice(e.children.length - 5, 5),
            n = new Vr(t);
          if (e.parent) {
            e.size -= n.size, e.height -= n.height;
            var r = Ni(e.parent.children, e);
            e.parent.children.splice(r + 1, 0, n)
          } else {
            var i = new Vr(e.children);
            i.parent = e, e.children = [i, n], e = i
          }
          n.parent = e.parent
        } while (e.children.length > 10);
        e.parent.maybeSpill()
      }
    },
    iterN: function(e, t, n) {
      for (var r = 0; r < this.children.length; ++r) {
        var i = this.children[r],
          o = i.chunkSize();
        if (o > e) {
          var l = Math.min(t, o - e);
          if (i.iterN(e, l, n)) return !0;
          if (0 == (t -= l)) break;
          e = 0
        } else e -= o
      }
    }
  };
  var vl = 0,
    yl = e.Doc = function(e, t, n, r) {
      if (!(this instanceof yl)) return new yl(e, t, n, r);
      null == n && (n = 0), Vr.call(this, [new Ur([new pl("", null)])]), this.first = n, this.scrollTop = this.scrollLeft = 0, this.cantEdit = !1, this.cleanGeneration = 1, this.frontier = n;
      var i = Po(n, 0);
      this.sel = pe(i), this.history = new ni(null), this.id = ++vl, this.modeOption = t, this.lineSep = r, "string" == typeof e && (e = this.splitLines(e)), qr(this, {
        from: i,
        to: i,
        text: e
      }), Me(this, pe(i), Nl)
    };
  yl.prototype = Wi(Vr.prototype, {
    constructor: yl,
    iter: function(e, t, n) {
      n ? this.iterN(e - this.first, t - e, n) : this.iterN(this.first, this.first + this.size, e)
    },
    insert: function(e, t) {
      for (var n = 0, r = 0; r < t.length; ++r) n += t[r].height;
      this.insertInner(e - this.first, t, n)
    },
    remove: function(e, t) {
      this.removeInner(e - this.first, t)
    },
    getValue: function(e) {
      var t = $r(this, this.first, this.first + this.size);
      return e === !1 ? t : t.join(e || this.lineSeparator())
    },
    setValue: Ht(function(e) {
      var t = Po(this.first, 0),
        n = this.first + this.size - 1;
      Sn(this, {
        from: t,
        to: Po(n, Xr(this, n).text.length),
        text: this.splitLines(e),
        origin: "setValue",
        full: !0
      }, !0), Me(this, pe(t))
    }),
    replaceRange: function(e, t, n, r) {
      t = me(this, t), n = n ? me(this, n) : t, On(this, e, t, n, r)
    },
    getRange: function(e, t, n) {
      var r = Yr(this, me(this, e), me(this, t));
      return n === !1 ? r : r.join(n || this.lineSeparator())
    },
    getLine: function(e) {
      var t = this.getLineHandle(e);
      return t && t.text
    },
    getLineHandle: function(e) {
      return ye(this, e) ? Xr(this, e) : void 0
    },
    getLineNumber: function(e) {
      return Zr(e)
    },
    getLineHandleVisualStart: function(e) {
      return "number" == typeof e && (e = Xr(this, e)), gr(e)
    },
    lineCount: function() {
      return this.size
    },
    firstLine: function() {
      return this.first
    },
    lastLine: function() {
      return this.first + this.size - 1
    },
    clipPos: function(e) {
      return me(this, e)
    },
    getCursor: function(e) {
      var t, n = this.sel.primary();
      return t = null == e || "head" == e ? n.head : "anchor" == e ? n.anchor : "end" == e || "to" == e || e === !1 ? n.to() : n.from()
    },
    listSelections: function() {
      return this.sel.ranges
    },
    somethingSelected: function() {
      return this.sel.somethingSelected()
    },
    setCursor: Ht(function(e, t, n) {
      Le(this, me(this, "number" == typeof e ? Po(e, t || 0) : e), null, n)
    }),
    setSelection: Ht(function(e, t, n) {
      Le(this, me(this, e), me(this, t || e), n)
    }),
    extendSelection: Ht(function(e, t, n) {
      Ce(this, me(this, e), t && me(this, t), n)
    }),
    extendSelections: Ht(function(e, t) {
      we(this, be(this, e, t))
    }),
    extendSelectionsBy: Ht(function(e, t) {
      we(this, Hi(this.sel.ranges, e), t)
    }),
    setSelections: Ht(function(e, t, n) {
      if (e.length) {
        for (var r = 0, i = []; r < e.length; r++) i[r] = new de(me(this, e[r].anchor), me(this, e[r].head));
        null == t && (t = Math.min(e.length - 1, this.sel.primIndex)), Me(this, he(i, t), n)
      }
    }),
    addSelection: Ht(function(e, t, n) {
      var r = this.sel.ranges.slice(0);
      r.push(new de(me(this, e), me(this, t || e))), Me(this, he(r, r.length - 1), n)
    }),
    getSelection: function(e) {
      for (var t, n = this.sel.ranges, r = 0; r < n.length; r++) {
        var i = Yr(this, n[r].from(), n[r].to());
        t = t ? t.concat(i) : i
      }
      return e === !1 ? t : t.join(e || this.lineSeparator())
    },
    getSelections: function(e) {
      for (var t = [], n = this.sel.ranges, r = 0; r < n.length; r++) {
        var i = Yr(this, n[r].from(), n[r].to());
        e !== !1 && (i = i.join(e || this.lineSeparator())), t[r] = i
      }
      return t
    },
    replaceSelection: function(e, t, n) {
      for (var r = [], i = 0; i < this.sel.ranges.length; i++) r[i] = e;
      this.replaceSelections(r, t, n || "+input")
    },
    replaceSelections: Ht(function(e, t, n) {
      for (var r = [], i = this.sel, o = 0; o < i.ranges.length; o++) {
        var l = i.ranges[o];
        r[o] = {
          from: l.from(),
          to: l.to(),
          text: this.splitLines(e[o]),
          origin: n
        }
      }
      for (var s = t && "end" != t && Cn(this, r, t), o = r.length - 1; o >= 0; o--) Sn(this, r[o]);
      s ? Te(this, s) : this.cm && En(this.cm)
    }),
    undo: Ht(function() {
      kn(this, "undo")
    }),
    redo: Ht(function() {
      kn(this, "redo")
    }),
    undoSelection: Ht(function() {
      kn(this, "undo", !0)
    }),
    redoSelection: Ht(function() {
      kn(this, "redo", !0)
    }),
    setExtending: function(e) {
      this.extend = e
    },
    getExtending: function() {
      return this.extend
    },
    historySize: function() {
      for (var e = this.history, t = 0, n = 0, r = 0; r < e.done.length; r++) e.done[r].ranges || ++t;
      for (var r = 0; r < e.undone.length; r++) e.undone[r].ranges || ++n;
      return {
        undo: t,
        redo: n
      }
    },
    clearHistory: function() {
      this.history = new ni(this.history.maxGeneration)
    },
    markClean: function() {
      this.cleanGeneration = this.changeGeneration(!0)
    },
    changeGeneration: function(e) {
      return e && (this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null), this.history.generation
    },
    isClean: function(e) {
      return this.history.generation == (e || this.cleanGeneration)
    },
    getHistory: function() {
      return {
        done: hi(this.history.done),
        undone: hi(this.history.undone)
      }
    },
    setHistory: function(e) {
      var t = this.history = new ni(this.history.maxGeneration);
      t.done = hi(e.done.slice(0), null, !0), t.undone = hi(e.undone.slice(0), null, !0)
    },
    addLineClass: Ht(function(e, t, n) {
      return zn(this, e, "gutter" == t ? "gutter" : "class", function(e) {
        var r = "text" == t ? "textClass" : "background" == t ? "bgClass" : "gutter" == t ? "gutterClass" : "wrapClass";
        if (e[r]) {
          if (qi(n).test(e[r])) return !1;
          e[r] += " " + n
        } else e[r] = n;
        return !0
      })
    }),
    removeLineClass: Ht(function(e, t, n) {
      return zn(this, e, "gutter" == t ? "gutter" : "class", function(e) {
        var r = "text" == t ? "textClass" : "background" == t ? "bgClass" : "gutter" == t ? "gutterClass" : "wrapClass",
          i = e[r];
        if (!i) return !1;
        if (null == n) e[r] = null;
        else {
          var o = i.match(qi(n));
          if (!o) return !1;
          var l = o.index + o[0].length;
          e[r] = i.slice(0, o.index) + (o.index && l != i.length ? " " : "") + i.slice(l) || null
        }
        return !0
      })
    }),
    addLineWidget: Ht(function(e, t, n) {
      return Sr(this, e, t, n)
    }),
    removeLineWidget: function(e) {
      e.clear()
    },
    markText: function(e, t, n) {
      return Vn(this, me(this, e), me(this, t), n, "range")
    },
    setBookmark: function(e, t) {
      var n = {
        replacedWith: t && (null == t.nodeType ? t.widget : t),
        insertLeft: t && t.insertLeft,
        clearWhenEmpty: !1,
        shared: t && t.shared,
        handleMouseEvents: t && t.handleMouseEvents
      };
      return e = me(this, e), Vn(this, e, e, n, "bookmark")
    },
    findMarksAt: function(e) {
      e = me(this, e);
      var t = [],
        n = Xr(this, e.line).markedSpans;
      if (n)
        for (var r = 0; r < n.length; ++r) {
          var i = n[r];
          (null == i.from || i.from <= e.ch) && (null == i.to || i.to >= e.ch) && t.push(i.marker.parent || i.marker)
        }
      return t
    },
    findMarks: function(e, t, n) {
      e = me(this, e), t = me(this, t);
      var r = [],
        i = e.line;
      return this.iter(e.line, t.line + 1, function(o) {
        var l = o.markedSpans;
        if (l)
          for (var s = 0; s < l.length; s++) {
            var a = l[s];
            i == e.line && e.ch > a.to || null == a.from && i != e.line || i == t.line && a.from > t.ch || n && !n(a.marker) || r.push(a.marker.parent || a.marker)
          }++i
      }), r
    },
    getAllMarks: function() {
      var e = [];
      return this.iter(function(t) {
        var n = t.markedSpans;
        if (n)
          for (var r = 0; r < n.length; ++r) null != n[r].from && e.push(n[r].marker)
      }), e
    },
    posFromIndex: function(e) {
      var t, n = this.first;
      return this.iter(function(r) {
        var i = r.text.length + 1;
        return i > e ? (t = e, !0) : (e -= i, void++n)
      }), me(this, Po(n, t))
    },
    indexFromPos: function(e) {
      e = me(this, e);
      var t = e.ch;
      return e.line < this.first || e.ch < 0 ? 0 : (this.iter(this.first, e.line, function(e) {
        t += e.text.length + 1
      }), t)
    },
    copy: function(e) {
      var t = new yl($r(this, this.first, this.first + this.size), this.modeOption, this.first, this.lineSep);
      return t.scrollTop = this.scrollTop, t.scrollLeft = this.scrollLeft, t.sel = this.sel, t.extend = !1, e && (t.history.undoDepth = this.history.undoDepth, t.setHistory(this.getHistory())), t
    },
    linkedDoc: function(e) {
      e || (e = {});
      var t = this.first,
        n = this.first + this.size;
      null != e.from && e.from > t && (t = e.from), null != e.to && e.to < n && (n = e.to);
      var r = new yl($r(this, t, n), e.mode || this.modeOption, t, this.lineSep);
      return e.sharedHist && (r.history = this.history), (this.linked || (this.linked = [])).push({
        doc: r,
        sharedHist: e.sharedHist
      }), r.linked = [{
        doc: this,
        isParent: !0,
        sharedHist: e.sharedHist
      }], Xn(r, _n(this)), r
    },
    unlinkDoc: function(t) {
      if (t instanceof e && (t = t.doc), this.linked)
        for (var n = 0; n < this.linked.length; ++n) {
          var r = this.linked[n];
          if (r.doc == t) {
            this.linked.splice(n, 1), t.unlinkDoc(this), Yn(_n(this));
            break
          }
        }
      if (t.history == this.history) {
        var i = [t.id];
        Kr(t, function(e) {
          i.push(e.id)
        }, !0), t.history = new ni(null), t.history.done = hi(this.history.done, i), t.history.undone = hi(this.history.undone, i)
      }
    },
    iterLinkedDocs: function(e) {
      Kr(this, e)
    },
    getMode: function() {
      return this.mode
    },
    getEditor: function() {
      return this.cm
    },
    splitLines: function(e) {
      return this.lineSep ? e.split(this.lineSep) : _l(e)
    },
    lineSeparator: function() {
      return this.lineSep || "\n"
    }
  }), yl.prototype.eachLine = yl.prototype.iter;
  var bl = "iter insert remove copy getEditor constructor".split(" ");
  for (var xl in yl.prototype) yl.prototype.hasOwnProperty(xl) && Ni(bl, xl) < 0 && (e.prototype[xl] = function(e) {
    return function() {
      return e.apply(this.doc, arguments)
    }
  }(yl.prototype[xl]));
  ki(yl);
  var Cl = e.e_preventDefault = function(e) {
      e.preventDefault ? e.preventDefault() : e.returnValue = !1
    },
    wl = e.e_stopPropagation = function(e) {
      e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0
    },
    Sl = e.e_stop = function(e) {
      Cl(e), wl(e)
    },
    Ll = e.on = function(e, t, n) {
      if (e.addEventListener) e.addEventListener(t, n, !1);
      else if (e.attachEvent) e.attachEvent("on" + t, n);
      else {
        var r = e._handlers || (e._handlers = {}),
          i = r[t] || (r[t] = []);
        i.push(n)
      }
    },
    kl = e.off = function(e, t, n) {
      if (e.removeEventListener) e.removeEventListener(t, n, !1);
      else if (e.detachEvent) e.detachEvent("on" + t, n);
      else {
        var r = e._handlers && e._handlers[t];
        if (!r) return;
        for (var i = 0; i < r.length; ++i)
          if (r[i] == n) {
            r.splice(i, 1);
            break
          }
      }
    },
    Tl = e.signal = function(e, t) {
      var n = e._handlers && e._handlers[t];
      if (n)
        for (var r = Array.prototype.slice.call(arguments, 2), i = 0; i < n.length; ++i) n[i].apply(null, r)
    },
    Ml = null,
    Al = 30,
    Ol = e.Pass = {
      toString: function() {
        return "CodeMirror.Pass"
      }
    },
    Nl = {
      scroll: !1
    },
    Hl = {
      origin: "*mouse"
    },
    Pl = {
      origin: "+move"
    };
  Ti.prototype.set = function(e, t) {
    clearTimeout(this.id), this.id = setTimeout(t, e)
  };
  var Wl = e.countColumn = function(e, t, n, r, i) {
      null == t && (t = e.search(/[^\s\u00a0]/), -1 == t && (t = e.length));
      for (var o = r || 0, l = i || 0;;) {
        var s = e.indexOf("	", o);
        if (0 > s || s >= t) return l + (t - o);
        l += s - o, l += n - l % n, o = s + 1
      }
    },
    Dl = [""],
    El = function(e) {
      e.select()
    };
  So ? El = function(e) {
    e.selectionStart = 0, e.selectionEnd = e.value.length
  } : po && (El = function(e) {
    try {
      e.select()
    } catch (t) {}
  });
  var Fl, Il = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/,
    zl = e.isWordChar = function(e) {
      return /\w/.test(e) || e > "" && (e.toUpperCase() != e.toLowerCase() || Il.test(e))
    },
    Rl = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
  Fl = document.createRange ? function(e, t, n, r) {
    var i = document.createRange();
    return i.setEnd(r || e, n), i.setStart(e, t), i
  } : function(e, t, n) {
    var r = document.body.createTextRange();
    try {
      r.moveToElementText(e.parentNode)
    } catch (i) {
      return r
    }
    return r.collapse(!0), r.moveEnd("character", n), r.moveStart("character", t), r
  };
  var Bl = e.contains = function(e, t) {
    if (3 == t.nodeType && (t = t.parentNode), e.contains) return e.contains(t);
    do
      if (11 == t.nodeType && (t = t.host), t == e) return !0; while (t = t.parentNode)
  };
  po && 11 > go && (Gi = function() {
    try {
      return document.activeElement
    } catch (e) {
      return document.body
    }
  });
  var jl, Gl, ql = e.rmClass = function(e, t) {
      var n = e.className,
        r = qi(t).exec(n);
      if (r) {
        var i = n.slice(r.index + r[0].length);
        e.className = n.slice(0, r.index) + (i ? r[1] + i : "")
      }
    },
    Ul = e.addClass = function(e, t) {
      var n = e.className;
      qi(t).test(n) || (e.className += (n ? " " : "") + t)
    },
    Vl = !1,
    Kl = function() {
      if (po && 9 > go) return !1;
      var e = Ri("div");
      return "draggable" in e || "dragDrop" in e
    }(),
    _l = e.splitLines = 3 != "\n\nb".split(/\n/).length ? function(e) {
      for (var t = 0, n = [], r = e.length; r >= t;) {
        var i = e.indexOf("\n", t); - 1 == i && (i = e.length);
        var o = e.slice(t, "\r" == e.charAt(i - 1) ? i - 1 : i),
          l = o.indexOf("\r"); - 1 != l ? (n.push(o.slice(0, l)), t += l + 1) : (n.push(o), t = i + 1)
      }
      return n
    } : function(e) {
      return e.split(/\r\n?|\n/)
    },
    Xl = window.getSelection ? function(e) {
      try {
        return e.selectionStart != e.selectionEnd
      } catch (t) {
        return !1
      }
    } : function(e) {
      try {
        var t = e.ownerDocument.selection.createRange()
      } catch (n) {}
      return t && t.parentElement() == e ? 0 != t.compareEndPoints("StartToEnd", t) : !1
    },
    Yl = function() {
      var e = Ri("div");
      return "oncopy" in e ? !0 : (e.setAttribute("oncopy", "return;"), "function" == typeof e.oncopy)
    }(),
    $l = null,
    Ql = {
      3: "Enter",
      8: "Backspace",
      9: "Tab",
      13: "Enter",
      16: "Shift",
      17: "Ctrl",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Esc",
      32: "Space",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "Left",
      38: "Up",
      39: "Right",
      40: "Down",
      44: "PrintScrn",
      45: "Insert",
      46: "Delete",
      59: ";",
      61: "=",
      91: "Mod",
      92: "Mod",
      93: "Mod",
      107: "=",
      109: "-",
      127: "Delete",
      173: "-",
      186: ";",
      187: "=",
      188: ",",
      189: "-",
      190: ".",
      191: "/",
      192: "`",
      219: "[",
      220: "\\",
      221: "]",
      222: "'",
      63232: "Up",
      63233: "Down",
      63234: "Left",
      63235: "Right",
      63272: "Delete",
      63273: "Home",
      63275: "End",
      63276: "PageUp",
      63277: "PageDown",
      63302: "Insert"
    };
  e.keyNames = Ql,
    function() {
      for (var e = 0; 10 > e; e++) Ql[e + 48] = Ql[e + 96] = String(e);
      for (var e = 65; 90 >= e; e++) Ql[e] = String.fromCharCode(e);
      for (var e = 1; 12 >= e; e++) Ql[e + 111] = Ql[e + 63235] = "F" + e
    }();
  var Zl, Jl = function() {
    function e(e) {
      return 247 >= e ? n.charAt(e) : e >= 1424 && 1524 >= e ? "R" : e >= 1536 && 1773 >= e ? r.charAt(e - 1536) : e >= 1774 && 2220 >= e ? "r" : e >= 8192 && 8203 >= e ? "w" : 8204 == e ? "b" : "L"
    }

    function t(e, t, n) {
      this.level = e, this.from = t, this.to = n
    }
    var n = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN",
      r = "rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmm",
      i = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/,
      o = /[stwN]/,
      l = /[LRr]/,
      s = /[Lb1n]/,
      a = /[1n]/,
      c = "L";
    return function(n) {
      if (!i.test(n)) return !1;
      for (var r, u = n.length, f = [], d = 0; u > d; ++d) f.push(r = e(n.charCodeAt(d)));
      for (var d = 0, h = c; u > d; ++d) {
        var r = f[d];
        "m" == r ? f[d] = h : h = r
      }
      for (var d = 0, p = c; u > d; ++d) {
        var r = f[d];
        "1" == r && "r" == p ? f[d] = "n" : l.test(r) && (p = r, "r" == r && (f[d] = "R"))
      }
      for (var d = 1, h = f[0]; u - 1 > d; ++d) {
        var r = f[d];
        "+" == r && "1" == h && "1" == f[d + 1] ? f[d] = "1" : "," != r || h != f[d + 1] || "1" != h && "n" != h || (f[d] = h), h = r
      }
      for (var d = 0; u > d; ++d) {
        var r = f[d];
        if ("," == r) f[d] = "N";
        else if ("%" == r) {
          for (var g = d + 1; u > g && "%" == f[g]; ++g);
          for (var m = d && "!" == f[d - 1] || u > g && "1" == f[g] ? "1" : "N", v = d; g > v; ++v) f[v] = m;
          d = g - 1
        }
      }
      for (var d = 0, p = c; u > d; ++d) {
        var r = f[d];
        "L" == p && "1" == r ? f[d] = "L" : l.test(r) && (p = r)
      }
      for (var d = 0; u > d; ++d)
        if (o.test(f[d])) {
          for (var g = d + 1; u > g && o.test(f[g]); ++g);
          for (var y = "L" == (d ? f[d - 1] : c), b = "L" == (u > g ? f[g] : c), m = y || b ? "L" : "R", v = d; g > v; ++v) f[v] = m;
          d = g - 1
        }
      for (var x, C = [], d = 0; u > d;)
        if (s.test(f[d])) {
          var w = d;
          for (++d; u > d && s.test(f[d]); ++d);
          C.push(new t(0, w, d))
        } else {
          var S = d,
            L = C.length;
          for (++d; u > d && "L" != f[d]; ++d);
          for (var v = S; d > v;)
            if (a.test(f[v])) {
              v > S && C.splice(L, 0, new t(1, S, v));
              var k = v;
              for (++v; d > v && a.test(f[v]); ++v);
              C.splice(L, 0, new t(2, k, v)), S = v
            } else ++v;
          d > S && C.splice(L, 0, new t(1, S, d))
        }
      return 1 == C[0].level && (x = n.match(/^\s+/)) && (C[0].from = x[0].length, C.unshift(new t(0, 0, x[0].length))), 1 == Oi(C).level && (x = n.match(/\s+$/)) && (Oi(C).to -= x[0].length, C.push(new t(0, u - x[0].length, u))), 2 == C[0].level && C.unshift(new t(1, C[0].to, C[0].to)), C[0].level != Oi(C).level && C.push(new t(C[0].level, u, u)), C
    }
  }();
  return e.version = "5.5.0", e
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function(e) {
  "use strict";
  e.defineMode("xml", function(t, n) {
    function r(e, t) {
      function n(n) {
        return t.tokenize = n, n(e, t)
      }
      var r = e.next();
      if ("<" == r) return e.eat("!") ? e.eat("[") ? e.match("CDATA[") ? n(l("atom", "]]>")) : null : e.match("--") ? n(l("comment", "-->")) : e.match("DOCTYPE", !0, !0) ? (e.eatWhile(/[\w\._\-]/), n(s(1))) : null : e.eat("?") ? (e.eatWhile(/[\w\._\-]/), t.tokenize = l("meta", "?>"), "meta") : (S = e.eat("/") ? "closeTag" : "openTag", t.tokenize = i, "tag bracket");
      if ("&" == r) {
        var o;
        return o = e.eat("#") ? e.eat("x") ? e.eatWhile(/[a-fA-F\d]/) && e.eat(";") : e.eatWhile(/[\d]/) && e.eat(";") : e.eatWhile(/[\w\.\-:]/) && e.eat(";"), o ? "atom" : "error"
      }
      return e.eatWhile(/[^&<]/), null
    }

    function i(e, t) {
      var n = e.next();
      if (">" == n || "/" == n && e.eat(">")) return t.tokenize = r, S = ">" == n ? "endTag" : "selfcloseTag", "tag bracket";
      if ("=" == n) return S = "equals", null;
      if ("<" == n) {
        t.tokenize = r, t.state = f, t.tagName = t.tagStart = null;
        var i = t.tokenize(e, t);
        return i ? i + " tag error" : "tag error"
      }
      return /[\'\"]/.test(n) ? (t.tokenize = o(n), t.stringStartCol = e.column(), t.tokenize(e, t)) : (e.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/), "word")
    }

    function o(e) {
      var t = function(t, n) {
        for (; !t.eol();)
          if (t.next() == e) {
            n.tokenize = i;
            break
          }
        return "string"
      };
      return t.isInAttribute = !0, t
    }

    function l(e, t) {
      return function(n, i) {
        for (; !n.eol();) {
          if (n.match(t)) {
            i.tokenize = r;
            break
          }
          n.next()
        }
        return e
      }
    }

    function s(e) {
      return function(t, n) {
        for (var i; null != (i = t.next());) {
          if ("<" == i) return n.tokenize = s(e + 1), n.tokenize(t, n);
          if (">" == i) {
            if (1 == e) {
              n.tokenize = r;
              break
            }
            return n.tokenize = s(e - 1), n.tokenize(t, n)
          }
        }
        return "meta"
      }
    }

    function a(e, t, n) {
      this.prev = e.context, this.tagName = t, this.indent = e.indented, this.startOfLine = n, (k.doNotIndent.hasOwnProperty(t) || e.context && e.context.noIndent) && (this.noIndent = !0)
    }

    function c(e) {
      e.context && (e.context = e.context.prev)
    }

    function u(e, t) {
      for (var n;;) {
        if (!e.context) return;
        if (n = e.context.tagName, !k.contextGrabbers.hasOwnProperty(n) || !k.contextGrabbers[n].hasOwnProperty(t)) return;
        c(e)
      }
    }

    function f(e, t, n) {
      return "openTag" == e ? (n.tagStart = t.column(), d) : "closeTag" == e ? h : f
    }

    function d(e, t, n) {
      return "word" == e ? (n.tagName = t.current(), L = "tag", m) : (L = "error", d)
    }

    function h(e, t, n) {
      if ("word" == e) {
        var r = t.current();
        return n.context && n.context.tagName != r && k.implicitlyClosed.hasOwnProperty(n.context.tagName) && c(n), n.context && n.context.tagName == r ? (L = "tag", p) : (L = "tag error", g)
      }
      return L = "error", g
    }

    function p(e, t, n) {
      return "endTag" != e ? (L = "error", p) : (c(n), f)
    }

    function g(e, t, n) {
      return L = "error", p(e, t, n)
    }

    function m(e, t, n) {
      if ("word" == e) return L = "attribute", v;
      if ("endTag" == e || "selfcloseTag" == e) {
        var r = n.tagName,
          i = n.tagStart;
        return n.tagName = n.tagStart = null, "selfcloseTag" == e || k.autoSelfClosers.hasOwnProperty(r) ? u(n, r) : (u(n, r), n.context = new a(n, r, i == n.indented)), f
      }
      return L = "error", m
    }

    function v(e, t, n) {
      return "equals" == e ? y : (k.allowMissing || (L = "error"), m(e, t, n))
    }

    function y(e, t, n) {
      return "string" == e ? b : "word" == e && k.allowUnquoted ? (L = "string", m) : (L = "error", m(e, t, n))
    }

    function b(e, t, n) {
      return "string" == e ? b : m(e, t, n)
    }
    var x = t.indentUnit,
      C = n.multilineTagIndentFactor || 1,
      w = n.multilineTagIndentPastTag;
    null == w && (w = !0);
    var S, L, k = n.htmlMode ? {
        autoSelfClosers: {
          area: !0,
          base: !0,
          br: !0,
          col: !0,
          command: !0,
          embed: !0,
          frame: !0,
          hr: !0,
          img: !0,
          input: !0,
          keygen: !0,
          link: !0,
          meta: !0,
          param: !0,
          source: !0,
          track: !0,
          wbr: !0,
          menuitem: !0
        },
        implicitlyClosed: {
          dd: !0,
          li: !0,
          optgroup: !0,
          option: !0,
          p: !0,
          rp: !0,
          rt: !0,
          tbody: !0,
          td: !0,
          tfoot: !0,
          th: !0,
          tr: !0
        },
        contextGrabbers: {
          dd: {
            dd: !0,
            dt: !0
          },
          dt: {
            dd: !0,
            dt: !0
          },
          li: {
            li: !0
          },
          option: {
            option: !0,
            optgroup: !0
          },
          optgroup: {
            optgroup: !0
          },
          p: {
            address: !0,
            article: !0,
            aside: !0,
            blockquote: !0,
            dir: !0,
            div: !0,
            dl: !0,
            fieldset: !0,
            footer: !0,
            form: !0,
            h1: !0,
            h2: !0,
            h3: !0,
            h4: !0,
            h5: !0,
            h6: !0,
            header: !0,
            hgroup: !0,
            hr: !0,
            menu: !0,
            nav: !0,
            ol: !0,
            p: !0,
            pre: !0,
            section: !0,
            table: !0,
            ul: !0
          },
          rp: {
            rp: !0,
            rt: !0
          },
          rt: {
            rp: !0,
            rt: !0
          },
          tbody: {
            tbody: !0,
            tfoot: !0
          },
          td: {
            td: !0,
            th: !0
          },
          tfoot: {
            tbody: !0
          },
          th: {
            td: !0,
            th: !0
          },
          thead: {
            tbody: !0,
            tfoot: !0
          },
          tr: {
            tr: !0
          }
        },
        doNotIndent: {
          pre: !0
        },
        allowUnquoted: !0,
        allowMissing: !0,
        caseFold: !0
      } : {
        autoSelfClosers: {},
        implicitlyClosed: {},
        contextGrabbers: {},
        doNotIndent: {},
        allowUnquoted: !1,
        allowMissing: !1,
        caseFold: !1
      },
      T = n.alignCDATA;
    return r.isInText = !0, {
      startState: function() {
        return {
          tokenize: r,
          state: f,
          indented: 0,
          tagName: null,
          tagStart: null,
          context: null
        }
      },
      token: function(e, t) {
        if (!t.tagName && e.sol() && (t.indented = e.indentation()), e.eatSpace()) return null;
        S = null;
        var n = t.tokenize(e, t);
        return (n || S) && "comment" != n && (L = null, t.state = t.state(S || n, e, t), L && (n = "error" == L ? n + " error" : L)), n
      },
      indent: function(t, n, o) {
        var l = t.context;
        if (t.tokenize.isInAttribute) return t.tagStart == t.indented ? t.stringStartCol + 1 : t.indented + x;
        if (l && l.noIndent) return e.Pass;
        if (t.tokenize != i && t.tokenize != r) return o ? o.match(/^(\s*)/)[0].length : 0;
        if (t.tagName) return w ? t.tagStart + t.tagName.length + 2 : t.tagStart + x * C;
        if (T && /<!\[CDATA\[/.test(n)) return 0;
        var s = n && /^<(\/)?([\w_:\.-]*)/.exec(n);
        if (s && s[1])
          for (; l;) {
            if (l.tagName == s[2]) {
              l = l.prev;
              break
            }
            if (!k.implicitlyClosed.hasOwnProperty(l.tagName)) break;
            l = l.prev
          } else if (s)
            for (; l;) {
              var a = k.contextGrabbers[l.tagName];
              if (!a || !a.hasOwnProperty(s[2])) break;
              l = l.prev
            }
        for (; l && !l.startOfLine;) l = l.prev;
        return l ? l.indent + x : 0
      },
      electricInput: /<\/[\s\w:]+>$/,
      blockCommentStart: "<!--",
      blockCommentEnd: "-->",
      configuration: n.htmlMode ? "html" : "xml",
      helperType: n.htmlMode ? "html" : "xml"
    }
  }), e.defineMIME("text/xml", "xml"), e.defineMIME("application/xml", "xml"), e.mimeModes.hasOwnProperty("text/html") || e.defineMIME("text/html", {
    name: "xml",
    htmlMode: !0
  })
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function(e) {
  "use strict";

  function t(e, t) {
    if (!window.JSHINT) return [];
    JSHINT(e, t, t.globals);
    var n = JSHINT.data().errors,
      r = [];
    return n && o(n, r), r
  }

  function n(e) {
    return r(e, s, "warning", !0), r(e, a, "error"), i(e) ? null : e
  }

  function r(e, t, n, r) {
    var i, o, l, s, a;
    i = e.description;
    for (var c = 0; c < t.length; c++) o = t[c], l = "string" == typeof o ? o : o[0], s = "string" == typeof o ? null : o[1], a = -1 !== i.indexOf(l), (r || a) && (e.severity = n), a && s && (e.description = s)
  }

  function i(e) {
    for (var t = e.description, n = 0; n < l.length; n++)
      if (-1 !== t.indexOf(l[n])) return !0;
    return !1
  }

  function o(t, r) {
    for (var i = 0; i < t.length; i++) {
      var o = t[i];
      if (o) {
        var l, s;
        if (l = [], o.evidence) {
          var a = l[o.line];
          if (!a) {
            var c = o.evidence;
            a = [], Array.prototype.forEach.call(c, function(e, t) {
              "	" === e && a.push(t + 1)
            }), l[o.line] = a
          }
          if (a.length > 0) {
            var u = o.character;
            a.forEach(function(e) {
              u > e && (u -= 1)
            }), o.character = u
          }
        }
        var f = o.character - 1,
          d = f + 1;
        o.evidence && (s = o.evidence.substring(f).search(/.\b/), s > -1 && (d += s)), o.description = o.reason, o.start = o.character, o.end = d, o = n(o), o && r.push({
          message: o.description,
          severity: o.severity,
          from: e.Pos(o.line - 1, f),
          to: e.Pos(o.line - 1, d)
        })
      }
    }
  }
  var l = ["Dangerous comment"],
    s = [
      ["Expected '{'", "Statement body should be inside '{ }' braces."]
    ],
    a = ["Missing semicolon", "Extra comma", "Missing property name", "Unmatched ", " and instead saw", " is not defined", "Unclosed string", "Stopping, unable to continue"];
  e.registerHelper("lint", "javascript", t)
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function(e) {
  "use strict";

  function t(t, n) {
    function r(t) {
      return i.parentNode ? (i.style.top = Math.max(0, t.clientY - i.offsetHeight - 5) + "px",
        void(i.style.left = t.clientX + 5 + "px")) : e.off(document, "mousemove", r)
    }
    var i = document.createElement("div");
    return i.className = "CodeMirror-lint-tooltip", i.appendChild(n.cloneNode(!0)), document.body.appendChild(i), e.on(document, "mousemove", r), r(t), null != i.style.opacity && (i.style.opacity = 1), i
  }

  function n(e) {
    e.parentNode && e.parentNode.removeChild(e)
  }

  function r(e) {
    e.parentNode && (null == e.style.opacity && n(e), e.style.opacity = 0, setTimeout(function() {
      n(e)
    }, 600))
  }

  function i(n, i, o) {
    function l() {
      e.off(o, "mouseout", l), s && (r(s), s = null)
    }
    var s = t(n, i),
      a = setInterval(function() {
        if (s)
          for (var e = o;; e = e.parentNode) {
            if (e && 11 == e.nodeType && (e = e.host), e == document.body) return;
            if (!e) {
              l();
              break
            }
          }
        return s ? void 0 : clearInterval(a)
      }, 400);
    e.on(o, "mouseout", l)
  }

  function o(e, t, n) {
    this.marked = [], this.options = t, this.timeout = null, this.hasGutter = n, this.onMouseOver = function(t) {
      m(e, t)
    }
  }

  function l(e, t) {
    return t instanceof Function ? {
      getAnnotations: t
    } : (t && t !== !0 || (t = {}), t)
  }

  function s(e) {
    var t = e.state.lint;
    t.hasGutter && e.clearGutter(v);
    for (var n = 0; n < t.marked.length; ++n) t.marked[n].clear();
    t.marked.length = 0
  }

  function a(t, n, r, o) {
    var l = document.createElement("div"),
      s = l;
    return l.className = "CodeMirror-lint-marker-" + n, r && (s = l.appendChild(document.createElement("div")), s.className = "CodeMirror-lint-marker-multiple"), 0 != o && e.on(s, "mouseover", function(e) {
      i(e, t, s)
    }), l
  }

  function c(e, t) {
    return "error" == e ? e : t
  }

  function u(e) {
    for (var t = [], n = 0; n < e.length; ++n) {
      var r = e[n],
        i = r.from.line;
      (t[i] || (t[i] = [])).push(r)
    }
    return t
  }

  function f(e) {
    var t = e.severity;
    t || (t = "error");
    var n = document.createElement("div");
    return n.className = "CodeMirror-lint-message-" + t, n.appendChild(document.createTextNode(e.message)), n
  }

  function d(t) {
    var n = t.state.lint,
      r = n.options,
      i = r.options || r,
      o = r.getAnnotations || t.getHelper(e.Pos(0, 0), "lint");
    o && (r.async || o.async ? o(t.getValue(), h, i, t) : h(t, o(t.getValue(), i, t)))
  }

  function h(e, t) {
    s(e);
    for (var n = e.state.lint, r = n.options, i = u(t), o = 0; o < i.length; ++o) {
      var l = i[o];
      if (l) {
        for (var d = null, h = n.hasGutter && document.createDocumentFragment(), p = 0; p < l.length; ++p) {
          var g = l[p],
            m = g.severity;
          m || (m = "error"), d = c(d, m), r.formatAnnotation && (g = r.formatAnnotation(g)), n.hasGutter && h.appendChild(f(g)), g.to && n.marked.push(e.markText(g.from, g.to, {
            className: "CodeMirror-lint-mark-" + m,
            __annotation: g
          }))
        }
        n.hasGutter && e.setGutterMarker(o, v, a(h, d, l.length > 1, n.options.tooltips))
      }
    }
    r.onUpdateLinting && r.onUpdateLinting(t, i, e)
  }

  function p(e) {
    var t = e.state.lint;
    t && (clearTimeout(t.timeout), t.timeout = setTimeout(function() {
      d(e)
    }, t.options.delay || 500))
  }

  function g(e, t) {
    var n = t.target || t.srcElement;
    i(t, f(e), n)
  }

  function m(e, t) {
    var n = t.target || t.srcElement;
    if (/\bCodeMirror-lint-mark-/.test(n.className))
      for (var r = n.getBoundingClientRect(), i = (r.left + r.right) / 2, o = (r.top + r.bottom) / 2, l = e.findMarksAt(e.coordsChar({
          left: i,
          top: o
        }, "client")), s = 0; s < l.length; ++s) {
        var a = l[s].__annotation;
        if (a) return g(a, t)
      }
  }
  var v = "CodeMirror-lint-markers";
  e.defineOption("lint", !1, function(t, n, r) {
    if (r && r != e.Init && (s(t), t.off("change", p), e.off(t.getWrapperElement(), "mouseover", t.state.lint.onMouseOver), clearTimeout(t.state.lint.timeout), delete t.state.lint), n) {
      for (var i = t.getOption("gutters"), a = !1, c = 0; c < i.length; ++c) i[c] == v && (a = !0);
      var u = t.state.lint = new o(t, l(t, n), a);
      t.on("change", p), 0 != u.options.tooltips && e.on(t.getWrapperElement(), "mouseover", u.onMouseOver), d(t)
    }
  })
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function(e) {
  function t(e, t) {
    for (var n = 0, r = e.length; r > n; ++n) t(e[n])
  }

  function n(e, t) {
    if (!Array.prototype.indexOf) {
      for (var n = e.length; n--;)
        if (e[n] === t) return !0;
      return !1
    }
    return -1 != e.indexOf(t)
  }

  function r(t, n, r, i) {
    var o = t.getCursor(),
      l = r(t, o);
    if (!/\b(?:string|comment)\b/.test(l.type)) {
      l.state = e.innerMode(t.getMode(), l.state).state, /^[\w$_]*$/.test(l.string) ? l.end > o.ch && (l.end = o.ch, l.string = l.string.slice(0, o.ch - l.start)) : l = {
        start: o.ch,
        end: o.ch,
        string: "",
        state: l.state,
        type: "." == l.string ? "property" : null
      };
      for (var c = l;
        "property" == c.type;) {
        if (c = r(t, a(o.line, c.start)), "." != c.string) return;
        if (c = r(t, a(o.line, c.start)), !u) var u = [];
        u.push(c)
      }
      return {
        list: s(l, u, n, i),
        from: a(o.line, l.start),
        to: a(o.line, l.end)
      }
    }
  }

  function i(e, t) {
    return r(e, d, function(e, t) {
      return e.getTokenAt(t)
    }, t)
  }

  function o(e, t) {
    var n = e.getTokenAt(t);
    return t.ch == n.start + 1 && "." == n.string.charAt(0) ? (n.end = n.start, n.string = ".", n.type = "property") : /^\.[\w$_]*$/.test(n.string) && (n.type = "property", n.start++, n.string = n.string.replace(/\./, "")), n
  }

  function l(e, t) {
    return r(e, h, o, t)
  }

  function s(e, r, i, o) {
    function l(e) {
      0 != e.lastIndexOf(d, 0) || n(a, e) || a.push(e)
    }

    function s(e) {
      "string" == typeof e ? t(c, l) : e instanceof Array ? t(u, l) : e instanceof Function && t(f, l);
      for (var n in e) l(n)
    }
    var a = [],
      d = e.string,
      h = o && o.globalScope || window;
    if (r && r.length) {
      var p, g = r.pop();
      for (g.type && 0 === g.type.indexOf("variable") ? (o && o.additionalContext && (p = o.additionalContext[g.string]), o && o.useGlobalScope === !1 || (p = p || h[g.string])) : "string" == g.type ? p = "" : "atom" == g.type ? p = 1 : "function" == g.type && (null == h.jQuery || "$" != g.string && "jQuery" != g.string || "function" != typeof h.jQuery ? null != h._ && "_" == g.string && "function" == typeof h._ && (p = h._()) : p = h.jQuery()); null != p && r.length;) p = p[r.pop().string];
      null != p && s(p)
    } else {
      for (var m = e.state.localVars; m; m = m.next) l(m.name);
      for (var m = e.state.globalVars; m; m = m.next) l(m.name);
      o && o.useGlobalScope === !1 || s(h), t(i, l)
    }
    return a
  }
  var a = e.Pos;
  e.registerHelper("hint", "javascript", i), e.registerHelper("hint", "coffeescript", l);
  var c = "charAt charCodeAt indexOf lastIndexOf substring substr slice trim trimLeft trimRight toUpperCase toLowerCase split concat match replace search".split(" "),
    u = "length concat join splice push pop shift unshift slice reverse sort indexOf lastIndexOf every some filter forEach map reduce reduceRight ".split(" "),
    f = "prototype apply call bind".split(" "),
    d = "break case catch continue debugger default delete do else false finally for function if in instanceof new null return switch throw true try typeof var void while with".split(" "),
    h = "and break catch class continue delete do else extends false finally for if in instanceof isnt new no not null of off on or return switch then throw true try typeof until void while with yes".split(" ")
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function(e) {
  function t(e, t, n) {
    var r, i = e.getWrapperElement();
    return r = i.appendChild(document.createElement("div")), r.className = n ? "CodeMirror-dialog CodeMirror-dialog-bottom" : "CodeMirror-dialog CodeMirror-dialog-top", "string" == typeof t ? r.innerHTML = t : r.appendChild(t), r
  }

  function n(e, t) {
    e.state.currentNotificationClose && e.state.currentNotificationClose(), e.state.currentNotificationClose = t
  }
  e.defineExtension("openDialog", function(r, i, o) {
    function l(e) {
      if ("string" == typeof e) f.value = e;
      else {
        if (c) return;
        c = !0, a.parentNode.removeChild(a), u.focus(), o.onClose && o.onClose(a)
      }
    }
    o || (o = {}), n(this, null);
    var s, a = t(this, r, o.bottom),
      c = !1,
      u = this,
      f = a.getElementsByTagName("input")[0];
    return f ? (o.value && (f.value = o.value, o.selectValueOnOpen !== !1 && f.select()), o.onInput && e.on(f, "input", function(e) {
      o.onInput(e, f.value, l)
    }), o.onKeyUp && e.on(f, "keyup", function(e) {
      o.onKeyUp(e, f.value, l)
    }), e.on(f, "keydown", function(t) {
      o && o.onKeyDown && o.onKeyDown(t, f.value, l) || ((27 == t.keyCode || o.closeOnEnter !== !1 && 13 == t.keyCode) && (f.blur(), e.e_stop(t), l()), 13 == t.keyCode && i(f.value, t))
    }), o.closeOnBlur !== !1 && e.on(f, "blur", l), f.focus()) : (s = a.getElementsByTagName("button")[0]) && (e.on(s, "click", function() {
      l(), u.focus()
    }), o.closeOnBlur !== !1 && e.on(s, "blur", l), s.focus()), l
  }), e.defineExtension("openConfirm", function(r, i, o) {
    function l() {
      c || (c = !0, s.parentNode.removeChild(s), u.focus())
    }
    n(this, null);
    var s = t(this, r, o && o.bottom),
      a = s.getElementsByTagName("button"),
      c = !1,
      u = this,
      f = 1;
    a[0].focus();
    for (var d = 0; d < a.length; ++d) {
      var h = a[d];
      ! function(t) {
        e.on(h, "click", function(n) {
          e.e_preventDefault(n), l(), t && t(u)
        })
      }(i[d]), e.on(h, "blur", function() {
        --f, setTimeout(function() {
          0 >= f && l()
        }, 200)
      }), e.on(h, "focus", function() {
        ++f
      })
    }
  }), e.defineExtension("openNotification", function(r, i) {
    function o() {
      a || (a = !0, clearTimeout(l), s.parentNode.removeChild(s))
    }
    n(this, o);
    var l, s = t(this, r, i && i.bottom),
      a = !1,
      c = i && "undefined" != typeof i.duration ? i.duration : 5e3;
    return e.on(s, "click", function(t) {
      e.e_preventDefault(t), o()
    }), c && (l = setTimeout(o, c)), o
  })
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function(e) {
  "use strict";

  function t(t, i, o, l) {
    function s(e) {
      var n = a(t, i);
      if (!n || n.to.line - n.from.line < c) return null;
      for (var r = t.findMarksAt(n.from), o = 0; o < r.length; ++o)
        if (r[o].__isFold && "fold" !== l) {
          if (!e) return null;
          n.cleared = !0, r[o].clear()
        }
      return n
    }
    if (o && o.call) {
      var a = o;
      o = null
    } else var a = r(t, o, "rangeFinder");
    "number" == typeof i && (i = e.Pos(i, 0));
    var c = r(t, o, "minFoldSize"),
      u = s(!0);
    if (r(t, o, "scanUp"))
      for (; !u && i.line > t.firstLine();) i = e.Pos(i.line - 1, 0), u = s(!1);
    if (u && !u.cleared && "unfold" !== l) {
      var f = n(t, o);
      e.on(f, "mousedown", function(t) {
        d.clear(), e.e_preventDefault(t)
      });
      var d = t.markText(u.from, u.to, {
        replacedWith: f,
        clearOnEnter: !0,
        __isFold: !0
      });
      d.on("clear", function(n, r) {
        e.signal(t, "unfold", t, n, r)
      }), e.signal(t, "fold", t, u.from, u.to)
    }
  }

  function n(e, t) {
    var n = r(e, t, "widget");
    if ("string" == typeof n) {
      var i = document.createTextNode(n);
      n = document.createElement("span"), n.appendChild(i), n.className = "CodeMirror-foldmarker"
    }
    return n
  }

  function r(e, t, n) {
    if (t && void 0 !== t[n]) return t[n];
    var r = e.options.foldOptions;
    return r && void 0 !== r[n] ? r[n] : i[n]
  }
  e.newFoldFunction = function(e, n) {
    return function(r, i) {
      t(r, i, {
        rangeFinder: e,
        widget: n
      })
    }
  }, e.defineExtension("foldCode", function(e, n, r) {
    t(this, e, n, r)
  }), e.defineExtension("isFolded", function(e) {
    for (var t = this.findMarksAt(e), n = 0; n < t.length; ++n)
      if (t[n].__isFold) return !0
  }), e.commands.toggleFold = function(e) {
    e.foldCode(e.getCursor())
  }, e.commands.fold = function(e) {
    e.foldCode(e.getCursor(), null, "fold")
  }, e.commands.unfold = function(e) {
    e.foldCode(e.getCursor(), null, "unfold")
  }, e.commands.foldAll = function(t) {
    t.operation(function() {
      for (var n = t.firstLine(), r = t.lastLine(); r >= n; n++) t.foldCode(e.Pos(n, 0), null, "fold")
    })
  }, e.commands.unfoldAll = function(t) {
    t.operation(function() {
      for (var n = t.firstLine(), r = t.lastLine(); r >= n; n++) t.foldCode(e.Pos(n, 0), null, "unfold")
    })
  }, e.registerHelper("fold", "combine", function() {
    var e = Array.prototype.slice.call(arguments, 0);
    return function(t, n) {
      for (var r = 0; r < e.length; ++r) {
        var i = e[r](t, n);
        if (i) return i
      }
    }
  }), e.registerHelper("fold", "auto", function(e, t) {
    for (var n = e.getHelpers(t, "fold"), r = 0; r < n.length; r++) {
      var i = n[r](e, t);
      if (i) return i
    }
  });
  var i = {
    rangeFinder: e.fold.auto,
    widget: "↔",
    minFoldSize: 0,
    scanUp: !1
  };
  e.defineOption("foldOptions", null), e.defineExtension("foldOption", function(e, t) {
    return r(this, e, t)
  })
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function(e) {
  "use strict";
  e.registerHelper("fold", "brace", function(t, n) {
    function r(r) {
      for (var i = n.ch, a = 0;;) {
        var c = 0 >= i ? -1 : s.lastIndexOf(r, i - 1);
        if (-1 != c) {
          if (1 == a && c < n.ch) break;
          if (o = t.getTokenTypeAt(e.Pos(l, c + 1)), !/^(comment|string)/.test(o)) return c + 1;
          i = c - 1
        } else {
          if (1 == a) break;
          a = 1, i = s.length
        }
      }
    }
    var i, o, l = n.line,
      s = t.getLine(l),
      a = "{",
      c = "}",
      i = r("{");
    if (null == i && (a = "[", c = "]", i = r("[")), null != i) {
      var u, f, d = 1,
        h = t.lastLine();
      e: for (var p = l; h >= p; ++p)
        for (var g = t.getLine(p), m = p == l ? i : 0;;) {
          var v = g.indexOf(a, m),
            y = g.indexOf(c, m);
          if (0 > v && (v = g.length), 0 > y && (y = g.length), m = Math.min(v, y), m == g.length) break;
          if (t.getTokenTypeAt(e.Pos(p, m + 1)) == o)
            if (m == v) ++d;
            else if (!--d) {
            u = p, f = m;
            break e
          }++m
        }
      if (null != u && (l != u || f != i)) return {
        from: e.Pos(l, i),
        to: e.Pos(u, f)
      }
    }
  }), e.registerHelper("fold", "import", function(t, n) {
    function r(n) {
      if (n < t.firstLine() || n > t.lastLine()) return null;
      var r = t.getTokenAt(e.Pos(n, 1));
      if (/\S/.test(r.string) || (r = t.getTokenAt(e.Pos(n, r.end + 1))), "keyword" != r.type || "import" != r.string) return null;
      for (var i = n, o = Math.min(t.lastLine(), n + 10); o >= i; ++i) {
        var l = t.getLine(i),
          s = l.indexOf(";");
        if (-1 != s) return {
          startCh: r.end,
          end: e.Pos(i, s)
        }
      }
    }
    var i, n = n.line,
      o = r(n);
    if (!o || r(n - 1) || (i = r(n - 2)) && i.end.line == n - 1) return null;
    for (var l = o.end;;) {
      var s = r(l.line + 1);
      if (null == s) break;
      l = s.end
    }
    return {
      from: t.clipPos(e.Pos(n, o.startCh + 1)),
      to: l
    }
  }), e.registerHelper("fold", "include", function(t, n) {
    function r(n) {
      if (n < t.firstLine() || n > t.lastLine()) return null;
      var r = t.getTokenAt(e.Pos(n, 1));
      return /\S/.test(r.string) || (r = t.getTokenAt(e.Pos(n, r.end + 1))), "meta" == r.type && "#include" == r.string.slice(0, 8) ? r.start + 8 : void 0
    }
    var n = n.line,
      i = r(n);
    if (null == i || null != r(n - 1)) return null;
    for (var o = n;;) {
      var l = r(o + 1);
      if (null == l) break;
      ++o
    }
    return {
      from: e.Pos(n, i + 1),
      to: t.clipPos(e.Pos(o))
    }
  })
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror"), require("./foldcode")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror", "./foldcode"], e) : e(CodeMirror)
}(function(e) {
  "use strict";

  function t(e) {
    this.options = e, this.from = this.to = 0
  }

  function n(e) {
    return e === !0 && (e = {}), null == e.gutter && (e.gutter = "CodeMirror-foldgutter"), null == e.indicatorOpen && (e.indicatorOpen = "CodeMirror-foldgutter-open"), null == e.indicatorFolded && (e.indicatorFolded = "CodeMirror-foldgutter-folded"), e
  }

  function r(e, t) {
    for (var n = e.findMarksAt(f(t)), r = 0; r < n.length; ++r)
      if (n[r].__isFold && n[r].find().from.line == t) return n[r]
  }

  function i(e) {
    if ("string" == typeof e) {
      var t = document.createElement("div");
      return t.className = e + " CodeMirror-guttermarker-subtle", t
    }
    return e.cloneNode(!0)
  }

  function o(e, t, n) {
    var o = e.state.foldGutter.options,
      l = t,
      s = e.foldOption(o, "minFoldSize"),
      a = e.foldOption(o, "rangeFinder");
    e.eachLine(t, n, function(t) {
      var n = null;
      if (r(e, l)) n = i(o.indicatorFolded);
      else {
        var c = f(l, 0),
          u = a && a(e, c);
        u && u.to.line - u.from.line >= s && (n = i(o.indicatorOpen))
      }
      e.setGutterMarker(t, o.gutter, n), ++l
    })
  }

  function l(e) {
    var t = e.getViewport(),
      n = e.state.foldGutter;
    n && (e.operation(function() {
      o(e, t.from, t.to)
    }), n.from = t.from, n.to = t.to)
  }

  function s(e, t, n) {
    var i = e.state.foldGutter;
    if (i) {
      var o = i.options;
      if (n == o.gutter) {
        var l = r(e, t);
        l ? l.clear() : e.foldCode(f(t, 0), o.rangeFinder)
      }
    }
  }

  function a(e) {
    var t = e.state.foldGutter;
    if (t) {
      var n = t.options;
      t.from = t.to = 0, clearTimeout(t.changeUpdate), t.changeUpdate = setTimeout(function() {
        l(e)
      }, n.foldOnChangeTimeSpan || 600)
    }
  }

  function c(e) {
    var t = e.state.foldGutter;
    if (t) {
      var n = t.options;
      clearTimeout(t.changeUpdate), t.changeUpdate = setTimeout(function() {
        var n = e.getViewport();
        t.from == t.to || n.from - t.to > 20 || t.from - n.to > 20 ? l(e) : e.operation(function() {
          n.from < t.from && (o(e, n.from, t.from), t.from = n.from), n.to > t.to && (o(e, t.to, n.to), t.to = n.to)
        })
      }, n.updateViewportTimeSpan || 400)
    }
  }

  function u(e, t) {
    var n = e.state.foldGutter;
    if (n) {
      var r = t.line;
      r >= n.from && r < n.to && o(e, r, r + 1)
    }
  }
  e.defineOption("foldGutter", !1, function(r, i, o) {
    o && o != e.Init && (r.clearGutter(r.state.foldGutter.options.gutter), r.state.foldGutter = null, r.off("gutterClick", s), r.off("change", a), r.off("viewportChange", c), r.off("fold", u), r.off("unfold", u), r.off("swapDoc", l)), i && (r.state.foldGutter = new t(n(i)), l(r), r.on("gutterClick", s), r.on("change", a), r.on("viewportChange", c), r.on("fold", u), r.on("unfold", u), r.on("swapDoc", l))
  });
  var f = e.Pos
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function(e) {
  "use strict";
  e.registerHelper("fold", "markdown", function(t, n) {
    function r(n) {
      var r = t.getTokenTypeAt(e.Pos(n, 0));
      return r && /\bheader\b/.test(r)
    }

    function i(e, t, n) {
      var i = t && t.match(/^#+/);
      return i && r(e) ? i[0].length : (i = n && n.match(/^[=\-]+\s*$/), i && r(e + 1) ? "=" == n[0] ? 1 : 2 : o)
    }
    var o = 100,
      l = t.getLine(n.line),
      s = t.getLine(n.line + 1),
      a = i(n.line, l, s);
    if (a === o) return void 0;
    for (var c = t.lastLine(), u = n.line, f = t.getLine(u + 2); c > u && !(i(u + 1, s, f) <= a);) ++u, s = f, f = t.getLine(u + 2);
    return {
      from: e.Pos(n.line, l.length),
      to: e.Pos(u, t.getLine(u).length)
    }
  })
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function(e) {
  "use strict";

  function t(e, t) {
    return e.line - t.line || e.ch - t.ch
  }

  function n(e, t, n, r) {
    this.line = t, this.ch = n, this.cm = e, this.text = e.getLine(t), this.min = r ? r.from : e.firstLine(), this.max = r ? r.to - 1 : e.lastLine()
  }

  function r(e, t) {
    var n = e.cm.getTokenTypeAt(d(e.line, t));
    return n && /\btag\b/.test(n)
  }

  function i(e) {
    return e.line >= e.max ? void 0 : (e.ch = 0, e.text = e.cm.getLine(++e.line), !0)
  }

  function o(e) {
    return e.line <= e.min ? void 0 : (e.text = e.cm.getLine(--e.line), e.ch = e.text.length, !0)
  }

  function l(e) {
    for (;;) {
      var t = e.text.indexOf(">", e.ch);
      if (-1 == t) {
        if (i(e)) continue;
        return
      } {
        if (r(e, t + 1)) {
          var n = e.text.lastIndexOf("/", t),
            o = n > -1 && !/\S/.test(e.text.slice(n + 1, t));
          return e.ch = t + 1, o ? "selfClose" : "regular"
        }
        e.ch = t + 1
      }
    }
  }

  function s(e) {
    for (;;) {
      var t = e.ch ? e.text.lastIndexOf("<", e.ch - 1) : -1;
      if (-1 == t) {
        if (o(e)) continue;
        return
      }
      if (r(e, t + 1)) {
        g.lastIndex = t, e.ch = t;
        var n = g.exec(e.text);
        if (n && n.index == t) return n
      } else e.ch = t
    }
  }

  function a(e) {
    for (;;) {
      g.lastIndex = e.ch;
      var t = g.exec(e.text);
      if (!t) {
        if (i(e)) continue;
        return
      } {
        if (r(e, t.index + 1)) return e.ch = t.index + t[0].length, t;
        e.ch = t.index + 1
      }
    }
  }

  function c(e) {
    for (;;) {
      var t = e.ch ? e.text.lastIndexOf(">", e.ch - 1) : -1;
      if (-1 == t) {
        if (o(e)) continue;
        return
      } {
        if (r(e, t + 1)) {
          var n = e.text.lastIndexOf("/", t),
            i = n > -1 && !/\S/.test(e.text.slice(n + 1, t));
          return e.ch = t + 1, i ? "selfClose" : "regular"
        }
        e.ch = t
      }
    }
  }

  function u(e, t) {
    for (var n = [];;) {
      var r, i = a(e),
        o = e.line,
        s = e.ch - (i ? i[0].length : 0);
      if (!i || !(r = l(e))) return;
      if ("selfClose" != r)
        if (i[1]) {
          for (var c = n.length - 1; c >= 0; --c)
            if (n[c] == i[2]) {
              n.length = c;
              break
            }
          if (0 > c && (!t || t == i[2])) return {
            tag: i[2],
            from: d(o, s),
            to: d(e.line, e.ch)
          }
        } else n.push(i[2])
    }
  }

  function f(e, t) {
    for (var n = [];;) {
      var r = c(e);
      if (!r) return;
      if ("selfClose" != r) {
        var i = e.line,
          o = e.ch,
          l = s(e);
        if (!l) return;
        if (l[1]) n.push(l[2]);
        else {
          for (var a = n.length - 1; a >= 0; --a)
            if (n[a] == l[2]) {
              n.length = a;
              break
            }
          if (0 > a && (!t || t == l[2])) return {
            tag: l[2],
            from: d(e.line, e.ch),
            to: d(i, o)
          }
        }
      } else s(e)
    }
  }
  var d = e.Pos,
    h = "A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD",
    p = h + "-:.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040",
    g = new RegExp("<(/?)([" + h + "][" + p + "]*)", "g");
  e.registerHelper("fold", "xml", function(e, t) {
    for (var r = new n(e, t.line, 0);;) {
      var i, o = a(r);
      if (!o || r.line != t.line || !(i = l(r))) return;
      if (!o[1] && "selfClose" != i) {
        var t = d(r.line, r.ch),
          s = u(r, o[2]);
        return s && {
          from: t,
          to: s.from
        }
      }
    }
  }), e.findMatchingTag = function(e, r, i) {
    var o = new n(e, r.line, r.ch, i);
    if (-1 != o.text.indexOf(">") || -1 != o.text.indexOf("<")) {
      var a = l(o),
        c = a && d(o.line, o.ch),
        h = a && s(o);
      if (a && h && !(t(o, r) > 0)) {
        var p = {
          from: d(o.line, o.ch),
          to: c,
          tag: h[2]
        };
        return "selfClose" == a ? {
          open: p,
          close: null,
          at: "open"
        } : h[1] ? {
          open: f(o, h[2]),
          close: p,
          at: "close"
        } : (o = new n(e, c.line, c.ch, i), {
          open: p,
          close: u(o, h[2]),
          at: "open"
        })
      }
    }
  }, e.findEnclosingTag = function(e, t, r) {
    for (var i = new n(e, t.line, t.ch, r);;) {
      var o = f(i);
      if (!o) break;
      var l = new n(e, t.line, t.ch, r),
        s = u(l, o.tag);
      if (s) return {
        open: o,
        close: s
      }
    }
  }, e.scanForClosingTag = function(e, t, r, i) {
    var o = new n(e, t.line, t.ch, i ? {
      from: 0,
      to: i
    } : null);
    return u(o, r)
  }
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function(e) {
  "use strict";
  e.registerHelper("fold", "indent", function(t, n) {
    var r = t.getOption("tabSize"),
      i = t.getLine(n.line);
    if (/\S/.test(i)) {
      for (var o = function(t) {
          return e.countColumn(t, null, r)
        }, l = o(i), s = null, a = n.line + 1, c = t.lastLine(); c >= a; ++a) {
        var u = t.getLine(a),
          f = o(u);
        if (f > l) s = a;
        else if (/\S/.test(u)) break
      }
      return s ? {
        from: e.Pos(n.line, i.length),
        to: e.Pos(s, t.getLine(s).length)
      } : void 0
    }
  })
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function(e) {
  "use strict";
  e.registerGlobalHelper("fold", "comment", function(e) {
    return e.blockCommentStart && e.blockCommentEnd
  }, function(t, n) {
    var r = t.getModeAt(n),
      i = r.blockCommentStart,
      o = r.blockCommentEnd;
    if (i && o) {
      for (var l, s = n.line, a = t.getLine(s), c = n.ch, u = 0;;) {
        var f = 0 >= c ? -1 : a.lastIndexOf(i, c - 1);
        if (-1 != f) {
          if (1 == u && f < n.ch) return;
          if (/comment/.test(t.getTokenTypeAt(e.Pos(s, f + 1)))) {
            l = f + i.length;
            break
          }
          c = f - 1
        } else {
          if (1 == u) return;
          u = 1, c = a.length
        }
      }
      var d, h, p = 1,
        g = t.lastLine();
      e: for (var m = s; g >= m; ++m)
        for (var v = t.getLine(m), y = m == s ? l : 0;;) {
          var b = v.indexOf(i, y),
            x = v.indexOf(o, y);
          if (0 > b && (b = v.length), 0 > x && (x = v.length), y = Math.min(b, x), y == v.length) break;
          if (y == b) ++p;
          else if (!--p) {
            d = m, h = y;
            break e
          }++y
        }
      if (null != d && (s != d || h != l)) return {
        from: e.Pos(s, l),
        to: e.Pos(d, h)
      }
    }
  })
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function(e) {
  "use strict";

  function t(e) {
    var t = e.getWrapperElement();
    e.state.fullScreenRestore = {
      scrollTop: window.pageYOffset,
      scrollLeft: window.pageXOffset,
      width: t.style.width,
      height: t.style.height
    }, t.style.width = "", t.style.height = "auto", t.className += " CodeMirror-fullscreen", document.documentElement.style.overflow = "hidden", e.refresh()
  }

  function n(e) {
    var t = e.getWrapperElement();
    t.className = t.className.replace(/\s*CodeMirror-fullscreen\b/, ""), document.documentElement.style.overflow = "";
    var n = e.state.fullScreenRestore;
    t.style.width = n.width, t.style.height = n.height, window.scrollTo(n.scrollLeft, n.scrollTop), e.refresh()
  }
  e.defineOption("fullScreen", !1, function(r, i, o) {
    o == e.Init && (o = !1), !o != !i && (i ? t(r) : n(r))
  })
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function(e) {
  "use strict";

  function t(e) {
    for (var t = 0; t < e.state.activeLines.length; t++) e.removeLineClass(e.state.activeLines[t], "wrap", o), e.removeLineClass(e.state.activeLines[t], "background", l)
  }

  function n(e, t) {
    if (e.length != t.length) return !1;
    for (var n = 0; n < e.length; n++)
      if (e[n] != t[n]) return !1;
    return !0
  }

  function r(e, r) {
    for (var i = [], s = 0; s < r.length; s++) {
      var a = r[s];
      if (a.empty()) {
        var c = e.getLineHandleVisualStart(a.head.line);
        i[i.length - 1] != c && i.push(c)
      }
    }
    n(e.state.activeLines, i) || e.operation(function() {
      t(e);
      for (var n = 0; n < i.length; n++) e.addLineClass(i[n], "wrap", o), e.addLineClass(i[n], "background", l);
      e.state.activeLines = i
    })
  }

  function i(e, t) {
    r(e, t.ranges)
  }
  var o = "CodeMirror-activeline",
    l = "CodeMirror-activeline-background";
  e.defineOption("styleActiveLine", !1, function(n, o, l) {
    var s = l && l != e.Init;
    o && !s ? (n.state.activeLines = [], r(n, n.listSelections()), n.on("beforeSelectionChange", i)) : !o && s && (n.off("beforeSelectionChange", i), t(n), delete n.state.activeLines)
  })
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function(e) {
  "use strict";
  e.overlayMode = function(t, n, r) {
    return {
      startState: function() {
        return {
          base: e.startState(t),
          overlay: e.startState(n),
          basePos: 0,
          baseCur: null,
          overlayPos: 0,
          overlayCur: null,
          streamSeen: null
        }
      },
      copyState: function(r) {
        return {
          base: e.copyState(t, r.base),
          overlay: e.copyState(n, r.overlay),
          basePos: r.basePos,
          baseCur: null,
          overlayPos: r.overlayPos,
          overlayCur: null
        }
      },
      token: function(e, i) {
        return (e != i.streamSeen || Math.min(i.basePos, i.overlayPos) < e.start) && (i.streamSeen = e, i.basePos = i.overlayPos = e.start), e.start == i.basePos && (i.baseCur = t.token(e, i.base), i.basePos = e.pos), e.start == i.overlayPos && (e.pos = e.start, i.overlayCur = n.token(e, i.overlay), i.overlayPos = e.pos), e.pos = Math.min(i.basePos, i.overlayPos), null == i.overlayCur ? i.baseCur : null != i.baseCur && i.overlay.combineTokens || r && null == i.overlay.combineTokens ? i.baseCur + " " + i.overlayCur : i.overlayCur
      },
      indent: t.indent && function(e, n) {
        return t.indent(e.base, n)
      },
      electricChars: t.electricChars,
      innerMode: function(e) {
        return {
          state: e.base,
          mode: t
        }
      },
      blankLine: function(e) {
        t.blankLine && t.blankLine(e.base), n.blankLine && n.blankLine(e.overlay)
      }
    }
  }
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function(e) {
  "use strict";
  e.runMode = function(t, n, r, i) {
    var o = e.getMode(e.defaults, n),
      l = /MSIE \d/.test(navigator.userAgent),
      s = l && (null == document.documentMode || document.documentMode < 9);
    if (1 == r.nodeType) {
      var a = i && i.tabSize || e.defaults.tabSize,
        c = r,
        u = 0;
      c.innerHTML = "", r = function(e, t) {
        if ("\n" == e) return c.appendChild(document.createTextNode(s ? "\r" : e)), void(u = 0);
        for (var n = "", r = 0;;) {
          var i = e.indexOf("	", r);
          if (-1 == i) {
            n += e.slice(r), u += e.length - r;
            break
          }
          u += i - r, n += e.slice(r, i);
          var o = a - u % a;
          u += o;
          for (var l = 0; o > l; ++l) n += " ";
          r = i + 1
        }
        if (t) {
          var f = c.appendChild(document.createElement("span"));
          f.className = "cm-" + t.replace(/ +/g, " cm-"), f.appendChild(document.createTextNode(n))
        } else c.appendChild(document.createTextNode(n))
      }
    }
    for (var f = e.splitLines(t), d = i && i.state || e.startState(o), h = 0, p = f.length; p > h; ++h) {
      h && r("\n");
      var g = new e.StringStream(f[h]);
      for (!g.string && o.blankLine && o.blankLine(d); !g.eol();) {
        var m = o.token(g, d);
        r(g.current(), m, h, g.start, d), g.start = g.pos
      }
    }
  }
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror"), require("./searchcursor"), require("../dialog/dialog")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror", "./searchcursor", "../dialog/dialog"], e) : e(CodeMirror)
}(function(e) {
  "use strict";

  function t(e, t) {
    return "string" == typeof e ? e = new RegExp(e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), t ? "gi" : "g") : e.global || (e = new RegExp(e.source, e.ignoreCase ? "gi" : "g")), {
      token: function(t) {
        e.lastIndex = t.pos;
        var n = e.exec(t.string);
        return n && n.index == t.pos ? (t.pos += n[0].length, "searching") : void(n ? t.pos = n.index : t.skipToEnd())
      }
    }
  }

  function n() {
    this.posFrom = this.posTo = this.lastQuery = this.query = null, this.overlay = null
  }

  function r(e) {
    return e.state.search || (e.state.search = new n)
  }

  function i(e) {
    return "string" == typeof e && e == e.toLowerCase()
  }

  function o(e, t, n) {
    return e.getSearchCursor(t, n, i(t))
  }

  function l(e, t, n, r) {
    e.openDialog(t, r, {
      value: n,
      selectValueOnOpen: !0,
      closeOnEnter: !1,
      onClose: function() {
        h(e)
      }
    })
  }

  function s(e, t, n, r, i) {
    e.openDialog ? e.openDialog(t, i, {
      value: r,
      selectValueOnOpen: !0
    }) : i(prompt(n, r))
  }

  function a(e, t, n, r) {
    e.openConfirm ? e.openConfirm(t, r) : confirm(n) && r[0]()
  }

  function c(e) {
    var t = e.match(/^\/(.*)\/([a-z]*)$/);
    if (t) try {
      e = new RegExp(t[1], -1 == t[2].indexOf("i") ? "" : "i")
    } catch (n) {}
    return ("string" == typeof e ? "" == e : e.test("")) && (e = /x^/), e
  }

  function u(e, n, r) {
    n.queryText = r, n.query = c(r), e.removeOverlay(n.overlay, i(n.query)), n.overlay = t(n.query, i(n.query)), e.addOverlay(n.overlay), e.showMatchesOnScrollbar && (n.annotate && (n.annotate.clear(), n.annotate = null), n.annotate = e.showMatchesOnScrollbar(n.query, i(n.query)))
  }

  function f(t, n, i) {
    var o = r(t);
    if (o.query) return d(t, n);
    var a = t.getSelection() || o.lastQuery;
    i && t.openDialog ? l(t, g, a, function(n, r) {
      e.e_stop(r), n && (n != o.queryText && u(t, o, n), d(t, r.shiftKey))
    }) : s(t, g, "Search for:", a, function(e) {
      e && !o.query && t.operation(function() {
        u(t, o, e), o.posFrom = o.posTo = t.getCursor(), d(t, n)
      })
    })
  }

  function d(t, n) {
    t.operation(function() {
      var i = r(t),
        l = o(t, i.query, n ? i.posFrom : i.posTo);
      (l.find(n) || (l = o(t, i.query, n ? e.Pos(t.lastLine()) : e.Pos(t.firstLine(), 0)), l.find(n))) && (t.setSelection(l.from(), l.to()), t.scrollIntoView({
        from: l.from(),
        to: l.to()
      }, 20), i.posFrom = l.from(), i.posTo = l.to())
    })
  }

  function h(e) {
    e.operation(function() {
      var t = r(e);
      t.lastQuery = t.query, t.query && (t.query = t.queryText = null, e.removeOverlay(t.overlay), t.annotate && (t.annotate.clear(), t.annotate = null))
    })
  }

  function p(e, t) {
    if (!e.getOption("readOnly")) {
      var n = e.getSelection() || r(e).lastQuery;
      s(e, m, "Replace:", n, function(n) {
        n && (n = c(n), s(e, v, "Replace with:", "", function(r) {
          if (t) e.operation(function() {
            for (var t = o(e, n); t.findNext();)
              if ("string" != typeof n) {
                var i = e.getRange(t.from(), t.to()).match(n);
                t.replace(r.replace(/\$(\d)/g, function(e, t) {
                  return i[t]
                }))
              } else t.replace(r)
          });
          else {
            h(e);
            var i = o(e, n, e.getCursor()),
              l = function() {
                var t, r = i.from();
                !(t = i.findNext()) && (i = o(e, n), !(t = i.findNext()) || r && i.from().line == r.line && i.from().ch == r.ch) || (e.setSelection(i.from(), i.to()), e.scrollIntoView({
                  from: i.from(),
                  to: i.to()
                }), a(e, y, "Replace?", [function() {
                  s(t)
                }, l]))
              },
              s = function(e) {
                i.replace("string" == typeof n ? r : r.replace(/\$(\d)/g, function(t, n) {
                  return e[n]
                })), l()
              };
            l()
          }
        }))
      })
    }
  }
  var g = 'Search: <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">(Use /re/ syntax for regexp search)</span>',
    m = 'Replace: <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">(Use /re/ syntax for regexp search)</span>',
    v = 'With: <input type="text" style="width: 10em" class="CodeMirror-search-field"/>',
    y = "Replace? <button>Yes</button> <button>No</button> <button>Stop</button>";
  e.commands.find = function(e) {
    h(e), f(e)
  }, e.commands.findPersistent = function(e) {
    h(e), f(e, !1, !0)
  }, e.commands.findNext = f, e.commands.findPrev = function(e) {
    f(e, !0)
  }, e.commands.clearSearch = h, e.commands.replace = p, e.commands.replaceAll = function(e) {
    p(e, !0)
  }
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function(e) {
  "use strict";

  function t(e, t, i, o) {
    if (this.atOccurrence = !1, this.doc = e, null == o && "string" == typeof t && (o = !1), i = i ? e.clipPos(i) : r(0, 0), this.pos = {
        from: i,
        to: i
      }, "string" != typeof t) t.global || (t = new RegExp(t.source, t.ignoreCase ? "ig" : "g")), this.matches = function(n, i) {
      if (n) {
        t.lastIndex = 0;
        for (var o, l, s = e.getLine(i.line).slice(0, i.ch), a = 0;;) {
          t.lastIndex = a;
          var c = t.exec(s);
          if (!c) break;
          if (o = c, l = o.index, a = o.index + (o[0].length || 1), a == s.length) break
        }
        var u = o && o[0].length || 0;
        u || (0 == l && 0 == s.length ? o = void 0 : l != e.getLine(i.line).length && u++)
      } else {
        t.lastIndex = i.ch;
        var s = e.getLine(i.line),
          o = t.exec(s),
          u = o && o[0].length || 0,
          l = o && o.index;
        l + u == s.length || u || (u = 1)
      }
      return o && u ? {
        from: r(i.line, l),
        to: r(i.line, l + u),
        match: o
      } : void 0
    };
    else {
      var l = t;
      o && (t = t.toLowerCase());
      var s = o ? function(e) {
          return e.toLowerCase()
        } : function(e) {
          return e
        },
        a = t.split("\n");
      if (1 == a.length) this.matches = t.length ? function(i, o) {
        if (i) {
          var a = e.getLine(o.line).slice(0, o.ch),
            c = s(a),
            u = c.lastIndexOf(t);
          if (u > -1) return u = n(a, c, u), {
            from: r(o.line, u),
            to: r(o.line, u + l.length)
          }
        } else {
          var a = e.getLine(o.line).slice(o.ch),
            c = s(a),
            u = c.indexOf(t);
          if (u > -1) return u = n(a, c, u) + o.ch, {
            from: r(o.line, u),
            to: r(o.line, u + l.length)
          }
        }
      } : function() {};
      else {
        var c = l.split("\n");
        this.matches = function(t, n) {
          var i = a.length - 1;
          if (t) {
            if (n.line - (a.length - 1) < e.firstLine()) return;
            if (s(e.getLine(n.line).slice(0, c[i].length)) != a[a.length - 1]) return;
            for (var o = r(n.line, c[i].length), l = n.line - 1, u = i - 1; u >= 1; --u, --l)
              if (a[u] != s(e.getLine(l))) return;
            var f = e.getLine(l),
              d = f.length - c[0].length;
            if (s(f.slice(d)) != a[0]) return;
            return {
              from: r(l, d),
              to: o
            }
          }
          if (!(n.line + (a.length - 1) > e.lastLine())) {
            var f = e.getLine(n.line),
              d = f.length - c[0].length;
            if (s(f.slice(d)) == a[0]) {
              for (var h = r(n.line, d), l = n.line + 1, u = 1; i > u; ++u, ++l)
                if (a[u] != s(e.getLine(l))) return;
              if (s(e.getLine(l).slice(0, c[i].length)) == a[i]) return {
                from: h,
                to: r(l, c[i].length)
              }
            }
          }
        }
      }
    }
  }

  function n(e, t, n) {
    if (e.length == t.length) return n;
    for (var r = Math.min(n, e.length);;) {
      var i = e.slice(0, r).toLowerCase().length;
      if (n > i) ++r;
      else {
        if (!(i > n)) return r;
        --r
      }
    }
  }
  var r = e.Pos;
  t.prototype = {
    findNext: function() {
      return this.find(!1)
    },
    findPrevious: function() {
      return this.find(!0)
    },
    find: function(e) {
      function t(e) {
        var t = r(e, 0);
        return n.pos = {
          from: t,
          to: t
        }, n.atOccurrence = !1, !1
      }
      for (var n = this, i = this.doc.clipPos(e ? this.pos.from : this.pos.to);;) {
        if (this.pos = this.matches(e, i)) return this.atOccurrence = !0, this.pos.match || !0;
        if (e) {
          if (!i.line) return t(0);
          i = r(i.line - 1, this.doc.getLine(i.line - 1).length)
        } else {
          var o = this.doc.lineCount();
          if (i.line == o - 1) return t(o);
          i = r(i.line + 1, 0)
        }
      }
    },
    from: function() {
      return this.atOccurrence ? this.pos.from : void 0
    },
    to: function() {
      return this.atOccurrence ? this.pos.to : void 0
    },
    replace: function(t, n) {
      if (this.atOccurrence) {
        var i = e.splitLines(t);
        this.doc.replaceRange(i, this.pos.from, this.pos.to, n), this.pos.to = r(this.pos.from.line + i.length - 1, i[i.length - 1].length + (1 == i.length ? this.pos.from.ch : 0))
      }
    }
  }, e.defineExtension("getSearchCursor", function(e, n, r) {
    return new t(this.doc, e, n, r);

  }), e.defineDocExtension("getSearchCursor", function(e, n, r) {
    return new t(this, e, n, r)
  }), e.defineExtension("selectMatches", function(t, n) {
    for (var r = [], i = this.getSearchCursor(t, this.getCursor("from"), n); i.findNext() && !(e.cmpPos(i.to(), this.getCursor("to")) > 0);) r.push({
      anchor: i.from(),
      head: i.to()
    });
    r.length && this.setSelections(r, 0)
  })
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror"), require("../fold/xml-fold")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror", "../fold/xml-fold"], e) : e(CodeMirror)
}(function(e) {
  "use strict";

  function t(e) {
    e.state.tagHit && e.state.tagHit.clear(), e.state.tagOther && e.state.tagOther.clear(), e.state.tagHit = e.state.tagOther = null
  }

  function n(n) {
    n.state.failedTagMatch = !1, n.operation(function() {
      if (t(n), !n.somethingSelected()) {
        var r = n.getCursor(),
          i = n.getViewport();
        i.from = Math.min(i.from, r.line), i.to = Math.max(r.line + 1, i.to);
        var o = e.findMatchingTag(n, r, i);
        if (o) {
          if (n.state.matchBothTags) {
            var l = "open" == o.at ? o.open : o.close;
            l && (n.state.tagHit = n.markText(l.from, l.to, {
              className: "CodeMirror-matchingtag"
            }))
          }
          var s = "close" == o.at ? o.open : o.close;
          s ? n.state.tagOther = n.markText(s.from, s.to, {
            className: "CodeMirror-matchingtag"
          }) : n.state.failedTagMatch = !0
        }
      }
    })
  }

  function r(e) {
    e.state.failedTagMatch && n(e)
  }
  e.defineOption("matchTags", !1, function(i, o, l) {
    l && l != e.Init && (i.off("cursorActivity", n), i.off("viewportChange", r), t(i)), o && (i.state.matchBothTags = "object" == typeof o && o.bothTags, i.on("cursorActivity", n), i.on("viewportChange", r), n(i))
  }), e.commands.toMatchingTag = function(t) {
    var n = e.findMatchingTag(t, t.getCursor());
    if (n) {
      var r = "close" == n.at ? n.open : n.close;
      r && t.extendSelection(r.to, r.from)
    }
  }
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function(e) {
  function t(e, t, r, i) {
    var o = e.getLineHandle(t.line),
      a = t.ch - 1,
      c = a >= 0 && s[o.text.charAt(a)] || s[o.text.charAt(++a)];
    if (!c) return null;
    var u = ">" == c.charAt(1) ? 1 : -1;
    if (r && u > 0 != (a == t.ch)) return null;
    var f = e.getTokenTypeAt(l(t.line, a + 1)),
      d = n(e, l(t.line, a + (u > 0 ? 1 : 0)), u, f || null, i);
    return null == d ? null : {
      from: l(t.line, a),
      to: d && d.pos,
      match: d && d.ch == c.charAt(0),
      forward: u > 0
    }
  }

  function n(e, t, n, r, i) {
    for (var o = i && i.maxScanLineLength || 1e4, a = i && i.maxScanLines || 1e3, c = [], u = i && i.bracketRegex ? i.bracketRegex : /[(){}[\]]/, f = n > 0 ? Math.min(t.line + a, e.lastLine() + 1) : Math.max(e.firstLine() - 1, t.line - a), d = t.line; d != f; d += n) {
      var h = e.getLine(d);
      if (h) {
        var p = n > 0 ? 0 : h.length - 1,
          g = n > 0 ? h.length : -1;
        if (!(h.length > o))
          for (d == t.line && (p = t.ch - (0 > n ? 1 : 0)); p != g; p += n) {
            var m = h.charAt(p);
            if (u.test(m) && (void 0 === r || e.getTokenTypeAt(l(d, p + 1)) == r)) {
              var v = s[m];
              if (">" == v.charAt(1) == n > 0) c.push(m);
              else {
                if (!c.length) return {
                  pos: l(d, p),
                  ch: m
                };
                c.pop()
              }
            }
          }
      }
    }
    return d - n == (n > 0 ? e.lastLine() : e.firstLine()) ? !1 : null
  }

  function r(e, n, r) {
    for (var i = e.state.matchBrackets.maxHighlightLineLength || 1e3, s = [], a = e.listSelections(), c = 0; c < a.length; c++) {
      var u = a[c].empty() && t(e, a[c].head, !1, r);
      if (u && e.getLine(u.from.line).length <= i) {
        var f = u.match ? "CodeMirror-matchingbracket" : "CodeMirror-nonmatchingbracket";
        s.push(e.markText(u.from, l(u.from.line, u.from.ch + 1), {
          className: f
        })), u.to && e.getLine(u.to.line).length <= i && s.push(e.markText(u.to, l(u.to.line, u.to.ch + 1), {
          className: f
        }))
      }
    }
    if (s.length) {
      o && e.state.focused && e.focus();
      var d = function() {
        e.operation(function() {
          for (var e = 0; e < s.length; e++) s[e].clear()
        })
      };
      if (!n) return d;
      setTimeout(d, 800)
    }
  }

  function i(e) {
    e.operation(function() {
      a && (a(), a = null), a = r(e, !1, e.state.matchBrackets)
    })
  }
  var o = /MSIE \d/.test(navigator.userAgent) && (null == document.documentMode || document.documentMode < 8),
    l = e.Pos,
    s = {
      "(": ")>",
      ")": "(<",
      "[": "]>",
      "]": "[<",
      "{": "}>",
      "}": "{<"
    },
    a = null;
  e.defineOption("matchBrackets", !1, function(t, n, r) {
    r && r != e.Init && t.off("cursorActivity", i), n && (t.state.matchBrackets = "object" == typeof n ? n : {}, t.on("cursorActivity", i))
  }), e.defineExtension("matchBrackets", function() {
    r(this, !0)
  }), e.defineExtension("findMatchingBracket", function(e, n, r) {
    return t(this, e, n, r)
  }), e.defineExtension("scanForBracket", function(e, t, r, i) {
    return n(this, e, t, r, i)
  })
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function(e) {
  function t(e, t) {
    return "pairs" == t && "string" == typeof e ? e : "object" == typeof e && null != e[t] ? e[t] : u[t]
  }

  function n(e) {
    return function(t) {
      return l(t, e)
    }
  }

  function r(e) {
    var t = e.state.closeBrackets;
    if (!t) return null;
    var n = e.getModeAt(e.getCursor());
    return n.closeBrackets || t
  }

  function i(n) {
    var i = r(n);
    if (!i || n.getOption("disableInput")) return e.Pass;
    for (var o = t(i, "pairs"), l = n.listSelections(), s = 0; s < l.length; s++) {
      if (!l[s].empty()) return e.Pass;
      var c = a(n, l[s].head);
      if (!c || o.indexOf(c) % 2 != 0) return e.Pass
    }
    for (var s = l.length - 1; s >= 0; s--) {
      var u = l[s].head;
      n.replaceRange("", f(u.line, u.ch - 1), f(u.line, u.ch + 1))
    }
  }

  function o(n) {
    var i = r(n),
      o = i && t(i, "explode");
    if (!o || n.getOption("disableInput")) return e.Pass;
    for (var l = n.listSelections(), s = 0; s < l.length; s++) {
      if (!l[s].empty()) return e.Pass;
      var c = a(n, l[s].head);
      if (!c || o.indexOf(c) % 2 != 0) return e.Pass
    }
    n.operation(function() {
      n.replaceSelection("\n\n", null), n.execCommand("goCharLeft"), l = n.listSelections();
      for (var e = 0; e < l.length; e++) {
        var t = l[e].head.line;
        n.indentLine(t, null, !0), n.indentLine(t + 1, null, !0)
      }
    })
  }

  function l(n, i) {
    var o = r(n);
    if (!o || n.getOption("disableInput")) return e.Pass;
    var l = t(o, "pairs"),
      a = l.indexOf(i);
    if (-1 == a) return e.Pass;
    for (var u, d, h = t(o, "triples"), p = l.charAt(a + 1) == i, g = n.listSelections(), m = a % 2 == 0, v = 0; v < g.length; v++) {
      var y, b = g[v],
        x = b.head,
        d = n.getRange(x, f(x.line, x.ch + 1));
      if (m && !b.empty()) y = "surround";
      else if (!p && m || d != i)
        if (p && x.ch > 1 && h.indexOf(i) >= 0 && n.getRange(f(x.line, x.ch - 2), x) == i + i && (x.ch <= 2 || n.getRange(f(x.line, x.ch - 3), f(x.line, x.ch - 2)) != i)) y = "addFour";
        else if (p) {
        if (e.isWordChar(d) || !c(n, x, i)) return e.Pass;
        y = "both"
      } else {
        if (!m || n.getLine(x.line).length != x.ch && !s(d, l) && !/\s/.test(d)) return e.Pass;
        y = "both"
      } else y = h.indexOf(i) >= 0 && n.getRange(x, f(x.line, x.ch + 3)) == i + i + i ? "skipThree" : "skip";
      if (u) {
        if (u != y) return e.Pass
      } else u = y
    }
    var C = a % 2 ? l.charAt(a - 1) : i,
      w = a % 2 ? i : l.charAt(a + 1);
    n.operation(function() {
      if ("skip" == u) n.execCommand("goCharRight");
      else if ("skipThree" == u)
        for (var e = 0; 3 > e; e++) n.execCommand("goCharRight");
      else if ("surround" == u) {
        for (var t = n.getSelections(), e = 0; e < t.length; e++) t[e] = C + t[e] + w;
        n.replaceSelections(t, "around")
      } else "both" == u ? (n.replaceSelection(C + w, null), n.triggerElectric(C + w), n.execCommand("goCharLeft")) : "addFour" == u && (n.replaceSelection(C + C + C + C, "before"), n.execCommand("goCharRight"))
    })
  }

  function s(e, t) {
    var n = t.lastIndexOf(e);
    return n > -1 && n % 2 == 1
  }

  function a(e, t) {
    var n = e.getRange(f(t.line, t.ch - 1), f(t.line, t.ch + 1));
    return 2 == n.length ? n : null
  }

  function c(t, n, r) {
    var i = t.getLine(n.line),
      o = t.getTokenAt(n);
    if (/\bstring2?\b/.test(o.type)) return !1;
    var l = new e.StringStream(i.slice(0, n.ch) + r + i.slice(n.ch), 4);
    for (l.pos = l.start = o.start;;) {
      var s = t.getMode().token(l, o.state);
      if (l.pos >= n.ch + 1) return /\bstring2?\b/.test(s);
      l.start = l.pos
    }
  }
  var u = {
      pairs: "()[]{}''\"\"",
      triples: "",
      explode: "[]{}"
    },
    f = e.Pos;
  e.defineOption("autoCloseBrackets", !1, function(t, n, r) {
    r && r != e.Init && (t.removeKeyMap(h), t.state.closeBrackets = null), n && (t.state.closeBrackets = n, t.addKeyMap(h))
  });
  for (var d = u.pairs + "`", h = {
      Backspace: i,
      Enter: o
    }, p = 0; p < d.length; p++) h["'" + d.charAt(p) + "'"] = n(d.charAt(p))
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function(e) {
  "use strict";

  function t(e, t, n) {
    var r = e.docs[t];
    r ? n(N(e, r)) : e.options.getFile ? e.options.getFile(t, n) : n(null)
  }

  function n(e, t, n) {
    for (var r in e.docs) {
      var i = e.docs[r];
      if (i.doc == t) return i
    }
    if (!n)
      for (var o = 0;; ++o)
        if (r = "[doc" + (o || "") + "]", !e.docs[r]) {
          n = r;
          break
        }
    return e.addDoc(n, t)
  }

  function r(t, r) {
    return "string" == typeof r ? t.docs[r] : (r instanceof e && (r = r.getDoc()), r instanceof e.Doc ? n(t, r) : void 0)
  }

  function i(e, t, r) {
    var i = n(e, t),
      l = e.cachedArgHints;
    l && l.doc == t && F(l.start, r.to) <= 0 && (e.cachedArgHints = null);
    var s = i.changed;
    null == s && (i.changed = s = {
      from: r.from.line,
      to: r.from.line
    });
    var a = r.from.line + (r.text.length - 1);
    r.from.line < s.to && (s.to = s.to - (r.to.line - a)), a >= s.to && (s.to = a + 1), s.from > r.from.line && (s.from = r.from.line), t.lineCount() > D && r.to - s.from > 100 && setTimeout(function() {
      i.changed && i.changed.to - i.changed.from > 100 && o(e, i)
    }, 200)
  }

  function o(e, t) {
    e.server.request({
      files: [{
        type: "full",
        name: t.name,
        text: N(e, t)
      }]
    }, function(e) {
      e ? window.console.error(e) : t.changed = null
    })
  }

  function l(t, n, r) {
    t.request(n, {
      type: "completions",
      types: !0,
      docs: !0,
      urls: !0
    }, function(i, o) {
      if (i) return A(t, n, i);
      var l = [],
        a = "",
        c = o.start,
        u = o.end;
      '["' == n.getRange(P(c.line, c.ch - 2), c) && '"]' != n.getRange(u, P(u.line, u.ch + 2)) && (a = '"]');
      for (var f = 0; f < o.completions.length; ++f) {
        var d = o.completions[f],
          h = s(d.type);
        o.guess && (h += " " + W + "guess"), l.push({
          text: d.name + a,
          displayText: d.displayName || d.name,
          className: h,
          data: d
        })
      }
      var p = {
          from: c,
          to: u,
          list: l
        },
        g = null;
      e.on(p, "close", function() {
        T(g)
      }), e.on(p, "update", function() {
        T(g)
      }), e.on(p, "select", function(e, n) {
        T(g);
        var r = t.options.completionTip ? t.options.completionTip(e.data) : e.data.doc;
        r && (g = k(n.parentNode.getBoundingClientRect().right + window.pageXOffset, n.getBoundingClientRect().top + window.pageYOffset, r), g.className += " " + W + "hint-doc")
      }), r(p)
    })
  }

  function s(e) {
    var t;
    return t = "?" == e ? "unknown" : "number" == e || "string" == e || "bool" == e ? e : /^fn\(/.test(e) ? "fn" : /^\[/.test(e) ? "array" : "object", W + "completion " + W + "completion-" + t
  }

  function a(e, t, n, r, i) {
    e.request(t, r, function(n, r) {
      if (n) return A(e, t, n);
      if (e.options.typeTip) var o = e.options.typeTip(r);
      else {
        var o = w("span", null, w("strong", null, r.type || "not found"));
        if (r.doc && o.appendChild(document.createTextNode(" — " + r.doc)), r.url) {
          o.appendChild(document.createTextNode(" "));
          var l = o.appendChild(w("a", null, "[docs]"));
          l.href = r.url, l.target = "_blank"
        }
      }
      L(t, o), i && i()
    }, n)
  }

  function c(t, n) {
    if (O(t), !n.somethingSelected()) {
      var r = n.getTokenAt(n.getCursor()).state,
        i = e.innerMode(n.getMode(), r);
      if ("javascript" == i.mode.name) {
        var o = i.state.lexical;
        if ("call" == o.info) {
          for (var l, s = o.pos || 0, a = n.getOption("tabSize"), c = n.getCursor().line, d = Math.max(0, c - 9), h = !1; c >= d; --c) {
            for (var p = n.getLine(c), g = 0, m = 0;;) {
              var v = p.indexOf("	", m);
              if (-1 == v) break;
              g += a - (v + g) % a - 1, m = v + 1
            }
            if (l = o.column - g, "(" == p.charAt(l)) {
              h = !0;
              break
            }
          }
          if (h) {
            var y = P(c, l),
              b = t.cachedArgHints;
            return b && b.doc == n.getDoc() && 0 == F(y, b.start) ? u(t, n, s) : void t.request(n, {
              type: "type",
              preferFunction: !0,
              end: y
            }, function(e, r) {
              !e && r.type && /^fn\(/.test(r.type) && (t.cachedArgHints = {
                start: m,
                type: f(r.type),
                name: r.exprName || r.name || "fn",
                guess: r.guess,
                doc: n.getDoc()
              }, u(t, n, s))
            })
          }
        }
      }
    }
  }

  function u(e, t, n) {
    O(e);
    for (var r = e.cachedArgHints, i = r.type, o = w("span", r.guess ? W + "fhint-guess" : null, w("span", W + "fname", r.name), "("), l = 0; l < i.args.length; ++l) {
      l && o.appendChild(document.createTextNode(", "));
      var s = i.args[l];
      o.appendChild(w("span", W + "farg" + (l == n ? " " + W + "farg-current" : ""), s.name || "?")), "?" != s.type && (o.appendChild(document.createTextNode(": ")), o.appendChild(w("span", W + "type", s.type)))
    }
    o.appendChild(document.createTextNode(i.rettype ? ") -> " : ")")), i.rettype && o.appendChild(w("span", W + "type", i.rettype));
    var a = t.cursorCoords(null, "page");
    e.activeArgHints = k(a.right + 1, a.bottom, o)
  }

  function f(e) {
    function t(t) {
      for (var n = 0, i = r;;) {
        var o = e.charAt(r);
        if (t.test(o) && !n) return e.slice(i, r);
        /[{\[\(]/.test(o) ? ++n : /[}\]\)]/.test(o) && --n, ++r
      }
    }
    var n = [],
      r = 3;
    if (")" != e.charAt(r))
      for (;;) {
        var i = e.slice(r).match(/^([^, \(\[\{]+): /);
        if (i && (r += i[0].length, i = i[1]), n.push({
            name: i,
            type: t(/[\),]/)
          }), ")" == e.charAt(r)) break;
        r += 2
      }
    var o = e.slice(r).match(/^\) -> (.*)$/);
    return {
      args: n,
      rettype: o && o[1]
    }
  }

  function d(e, t) {
    function r(r) {
      var i = {
          type: "definition",
          variable: r || null
        },
        o = n(e, t.getDoc());
      e.server.request(x(e, o, i), function(n, r) {
        if (n) return A(e, t, n);
        if (!r.file && r.url) return void window.open(r.url);
        if (r.file) {
          var i, l = e.docs[r.file];
          if (l && (i = g(l.doc, r))) return e.jumpStack.push({
            file: o.name,
            start: t.getCursor("from"),
            end: t.getCursor("to")
          }), void p(e, o, l, i.start, i.end)
        }
        A(e, t, "Could not find a definition.")
      })
    }
    m(t) ? r() : S(t, "Jump to variable", function(e) {
      e && r(e)
    })
  }

  function h(e, t) {
    var r = e.jumpStack.pop(),
      i = r && e.docs[r.file];
    i && p(e, n(e, t.getDoc()), i, r.start, r.end)
  }

  function p(e, t, n, r, i) {
    n.doc.setSelection(r, i), t != n && e.options.switchToDoc && (O(e), e.options.switchToDoc(n.name, n.doc))
  }

  function g(e, t) {
    for (var n = t.context.slice(0, t.contextOffset).split("\n"), r = t.start.line - (n.length - 1), i = P(r, (1 == n.length ? t.start.ch : e.getLine(r).length) - n[0].length), o = e.getLine(r).slice(i.ch), l = r + 1; l < e.lineCount() && o.length < t.context.length; ++l) o += "\n" + e.getLine(l);
    if (o.slice(0, t.context.length) == t.context) return t;
    for (var s, a = e.getSearchCursor(t.context, 0, !1), c = 1 / 0; a.findNext();) {
      var u = a.from(),
        f = 1e4 * Math.abs(u.line - i.line);
      f || (f = Math.abs(u.ch - i.ch)), c > f && (s = u, c = f)
    }
    if (!s) return null;
    if (1 == n.length ? s.ch += n[0].length : s = P(s.line + (n.length - 1), n[n.length - 1].length), t.start.line == t.end.line) var d = P(s.line, s.ch + (t.end.ch - t.start.ch));
    else var d = P(s.line + (t.end.line - t.start.line), t.end.ch);
    return {
      start: s,
      end: d
    }
  }

  function m(e) {
    var t = e.getCursor("end"),
      n = e.getTokenAt(t);
    return n.start < t.ch && "comment" == n.type ? !1 : /[\w)\]]/.test(e.getLine(t.line).slice(Math.max(t.ch - 1, 0), t.ch + 1))
  }

  function v(e, t) {
    var n = t.getTokenAt(t.getCursor());
    return /\w/.test(n.string) ? void S(t, "New name for " + n.string, function(n) {
      e.request(t, {
        type: "rename",
        newName: n,
        fullDocs: !0
      }, function(n, r) {
        return n ? A(e, t, n) : void b(e, r.changes)
      })
    }) : A(e, t, "Not at a variable")
  }

  function y(e, t) {
    var r = n(e, t.doc).name;
    e.request(t, {
      type: "refs"
    }, function(n, i) {
      if (n) return A(e, t, n);
      for (var o = [], l = 0, s = 0; s < i.refs.length; s++) {
        var a = i.refs[s];
        a.file == r && (o.push({
          anchor: a.start,
          head: a.end
        }), F(l, a.start) >= 0 && F(l, a.end) <= 0 && (l = o.length - 1))
      }
      t.setSelections(o, l)
    })
  }

  function b(e, t) {
    for (var n = Object.create(null), r = 0; r < t.length; ++r) {
      var i = t[r];
      (n[i.file] || (n[i.file] = [])).push(i)
    }
    for (var o in n) {
      var l = e.docs[o],
        s = n[o];
      if (l) {
        s.sort(function(e, t) {
          return F(t.start, e.start)
        });
        for (var a = "*rename" + ++E, r = 0; r < s.length; ++r) {
          var i = s[r];
          l.doc.replaceRange(i.text, i.start, i.end, a)
        }
      }
    }
  }

  function x(e, t, n, r) {
    var i = [],
      o = 0,
      l = !n.fullDocs;
    l || delete n.fullDocs, "string" == typeof n && (n = {
      type: n
    }), n.lineCharPositions = !0, null == n.end && (n.end = r || t.doc.getCursor("end"), t.doc.somethingSelected() && (n.start = t.doc.getCursor("start")));
    var s = n.start || n.end;
    if (t.changed)
      if (t.doc.lineCount() > D && l !== !1 && t.changed.to - t.changed.from < 100 && t.changed.from <= s.line && t.changed.to > n.end.line) {
        i.push(C(t, s, n.end)), n.file = "#0";
        var o = i[0].offsetLines;
        null != n.start && (n.start = P(n.start.line - -o, n.start.ch)), n.end = P(n.end.line - o, n.end.ch)
      } else i.push({
        type: "full",
        name: t.name,
        text: N(e, t)
      }), n.file = t.name, t.changed = null;
    else n.file = t.name;
    for (var a in e.docs) {
      var c = e.docs[a];
      c.changed && c != t && (i.push({
        type: "full",
        name: c.name,
        text: N(e, c)
      }), c.changed = null)
    }
    return {
      query: n,
      files: i
    }
  }

  function C(t, n, r) {
    for (var i, o = t.doc, l = null, s = null, a = 4, c = n.line - 1, u = Math.max(0, c - 50); c >= u; --c) {
      var f = o.getLine(c),
        d = f.search(/\bfunction\b/);
      if (!(0 > d)) {
        var h = e.countColumn(f, null, a);
        null != l && h >= l || (l = h, s = c)
      }
    }
    null == s && (s = u);
    var p = Math.min(o.lastLine(), r.line + 20);
    if (null == l || l == e.countColumn(o.getLine(n.line), null, a)) i = p;
    else
      for (i = r.line + 1; p > i; ++i) {
        var h = e.countColumn(o.getLine(i), null, a);
        if (l >= h) break
      }
    var g = P(s, 0);
    return {
      type: "part",
      name: t.name,
      offsetLines: g.line,
      text: o.getRange(g, P(i, 0))
    }
  }

  function w(e, t) {
    var n = document.createElement(e);
    t && (n.className = t);
    for (var r = 2; r < arguments.length; ++r) {
      var i = arguments[r];
      "string" == typeof i && (i = document.createTextNode(i)), n.appendChild(i)
    }
    return n
  }

  function S(e, t, n) {
    e.openDialog ? e.openDialog(t + ": <input type=text>", n) : n(prompt(t, ""))
  }

  function L(t, n) {
    function r() {
      a = !0, s || i()
    }

    function i() {
      t.state.ternTooltip = null, l.parentNode && (t.off("cursorActivity", i), t.off("blur", i), t.off("scroll", i), M(l))
    }
    t.state.ternTooltip && T(t.state.ternTooltip);
    var o = t.cursorCoords(),
      l = t.state.ternTooltip = k(o.right + 1, o.bottom, n),
      s = !1,
      a = !1;
    e.on(l, "mousemove", function() {
      s = !0
    }), e.on(l, "mouseout", function(t) {
      e.contains(l, t.relatedTarget || t.toElement) || (a ? i() : s = !1)
    }), setTimeout(r, 1700), t.on("cursorActivity", i), t.on("blur", i), t.on("scroll", i)
  }

  function k(e, t, n) {
    var r = w("div", W + "tooltip", n);
    return r.style.left = e + "px", r.style.top = t + "px", document.body.appendChild(r), r
  }

  function T(e) {
    var t = e && e.parentNode;
    t && t.removeChild(e)
  }

  function M(e) {
    e.style.opacity = "0", setTimeout(function() {
      T(e)
    }, 1100)
  }

  function A(e, t, n) {
    e.options.showError ? e.options.showError(t, n) : L(t, String(n))
  }

  function O(e) {
    e.activeArgHints && (T(e.activeArgHints), e.activeArgHints = null)
  }

  function N(e, t) {
    var n = t.doc.getValue();
    return e.options.fileFilter && (n = e.options.fileFilter(n, t.name, t.doc)), n
  }

  function H(e) {
    function n(e, t) {
      t && (e.id = ++i, o[i] = t), r.postMessage(e)
    }
    var r = e.worker = new Worker(e.options.workerScript);
    r.postMessage({
      type: "init",
      defs: e.options.defs,
      plugins: e.options.plugins,
      scripts: e.options.workerDeps
    });
    var i = 0,
      o = {};
    r.onmessage = function(r) {
      var i = r.data;
      "getFile" == i.type ? t(e, i.name, function(e, t) {
        n({
          type: "getFile",
          err: String(e),
          text: t,
          id: i.id
        })
      }) : "debug" == i.type ? window.console.log(i.message) : i.id && o[i.id] && (o[i.id](i.err, i.body), delete o[i.id])
    }, r.onerror = function(e) {
      for (var t in o) o[t](e);
      o = {}
    }, this.addFile = function(e, t) {
      n({
        type: "add",
        name: e,
        text: t
      })
    }, this.delFile = function(e) {
      n({
        type: "del",
        name: e
      })
    }, this.request = function(e, t) {
      n({
        type: "req",
        body: e
      }, t)
    }
  }
  e.TernServer = function(e) {
    var n = this;
    this.options = e || {};
    var r = this.options.plugins || (this.options.plugins = {});
    r.doc_comment || (r.doc_comment = !0), this.docs = Object.create(null), this.server = this.options.useWorker ? new H(this) : new tern.Server({
      getFile: function(e, r) {
        return t(n, e, r)
      },
      async: !0,
      defs: this.options.defs || [],
      plugins: r
    }), this.trackChange = function(e, t) {
      i(n, e, t)
    }, this.cachedArgHints = null, this.activeArgHints = null, this.jumpStack = [], this.getHint = function(e, t) {
      return l(n, e, t)
    }, this.getHint.async = !0
  }, e.TernServer.prototype = {
    addDoc: function(t, n) {
      var r = {
        doc: n,
        name: t,
        changed: null
      };
      return this.server.addFile(t, N(this, r)), e.on(n, "change", this.trackChange), this.docs[t] = r
    },
    delDoc: function(t) {
      var n = r(this, t);
      n && (e.off(n.doc, "change", this.trackChange), delete this.docs[n.name], this.server.delFile(n.name))
    },
    hideDoc: function(e) {
      O(this);
      var t = r(this, e);
      t && t.changed && o(this, t)
    },
    complete: function(e) {
      e.showHint({
        hint: this.getHint
      })
    },
    showType: function(e, t, n) {
      a(this, e, t, "type", n)
    },
    showDocs: function(e, t, n) {
      a(this, e, t, "documentation", n)
    },
    updateArgHints: function(e) {
      c(this, e)
    },
    jumpToDef: function(e) {
      d(this, e)
    },
    jumpBack: function(e) {
      h(this, e)
    },
    rename: function(e) {
      v(this, e)
    },
    selectName: function(e) {
      y(this, e)
    },
    request: function(e, t, r, i) {
      var o = this,
        l = n(this, e.getDoc()),
        s = x(this, l, t, i),
        a = s.query && this.options.queryOptions && this.options.queryOptions[s.query.type];
      if (a)
        for (var c in a) s.query[c] = a[c];
      this.server.request(s, function(e, n) {
        !e && o.options.responseFilter && (n = o.options.responseFilter(l, t, s, e, n)), r(e, n)
      })
    },
    destroy: function() {
      this.worker && (this.worker.terminate(), this.worker = null)
    }
  };
  var P = e.Pos,
    W = "CodeMirror-Tern-",
    D = 250,
    E = 0,
    F = e.cmpPos
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function(e) {
  "use strict";

  function t(e, t) {
    this.cm = e, this.options = this.buildOptions(t), this.widget = null, this.debounce = 0, this.tick = 0, this.startPos = this.cm.getCursor(), this.startLen = this.cm.getLine(this.startPos.line).length;
    var n = this;
    e.on("cursorActivity", this.activityFunc = function() {
      n.cursorActivity()
    })
  }

  function n(e) {
    return "string" == typeof e ? e : e.text
  }

  function r(e, t) {
    function n(e, n) {
      var i;
      i = "string" != typeof n ? function(e) {
        return n(e, t)
      } : r.hasOwnProperty(n) ? r[n] : n, o[e] = i
    }
    var r = {
        Up: function() {
          t.moveFocus(-1)
        },
        Down: function() {
          t.moveFocus(1)
        },
        PageUp: function() {
          t.moveFocus(-t.menuSize() + 1, !0)
        },
        PageDown: function() {
          t.moveFocus(t.menuSize() - 1, !0)
        },
        Home: function() {
          t.setFocus(0)
        },
        End: function() {
          t.setFocus(t.length - 1)
        },
        Enter: t.pick,
        Tab: t.pick,
        Esc: t.close
      },
      i = e.options.customKeys,
      o = i ? {} : r;
    if (i)
      for (var l in i) i.hasOwnProperty(l) && n(l, i[l]);
    var s = e.options.extraKeys;
    if (s)
      for (var l in s) s.hasOwnProperty(l) && n(l, s[l]);
    return o
  }

  function i(e, t) {
    for (; t && t != e;) {
      if ("LI" === t.nodeName.toUpperCase() && t.parentNode == e) return t;
      t = t.parentNode
    }
  }

  function o(t, o) {
    this.completion = t, this.data = o, this.picked = !1;
    var a = this,
      c = t.cm,
      u = this.hints = document.createElement("ul");
    u.className = "CodeMirror-hints", this.selectedHint = o.selectedHint || 0;
    for (var f = o.list, d = 0; d < f.length; ++d) {
      var h = u.appendChild(document.createElement("li")),
        p = f[d],
        g = l + (d != this.selectedHint ? "" : " " + s);
      null != p.className && (g = p.className + " " + g), h.className = g, p.render ? p.render(h, o, p) : h.appendChild(document.createTextNode(p.displayText || n(p))), h.hintId = d
    }
    var m = c.cursorCoords(t.options.alignWithWord ? o.from : null),
      v = m.left,
      y = m.bottom,
      b = !0;
    u.style.left = v + "px", u.style.top = y + "px";
    var x = window.innerWidth || Math.max(document.body.offsetWidth, document.documentElement.offsetWidth),
      C = window.innerHeight || Math.max(document.body.offsetHeight, document.documentElement.offsetHeight);
    (t.options.container || document.body).appendChild(u);
    var w = u.getBoundingClientRect(),
      S = w.bottom - C;
    if (S > 0) {
      var L = w.bottom - w.top,
        k = m.top - (m.bottom - w.top);
      if (k - L > 0) u.style.top = (y = m.top - L) + "px", b = !1;
      else if (L > C) {
        u.style.height = C - 5 + "px", u.style.top = (y = m.bottom - w.top) + "px";
        var T = c.getCursor();
        o.from.ch != T.ch && (m = c.cursorCoords(T), u.style.left = (v = m.left) + "px", w = u.getBoundingClientRect())
      }
    }
    var M = w.right - x;
    if (M > 0 && (w.right - w.left > x && (u.style.width = x - 5 + "px", M -= w.right - w.left - x), u.style.left = (v = m.left - M) + "px"), c.addKeyMap(this.keyMap = r(t, {
        moveFocus: function(e, t) {
          a.changeActive(a.selectedHint + e, t)
        },
        setFocus: function(e) {
          a.changeActive(e)
        },
        menuSize: function() {
          return a.screenAmount()
        },
        length: f.length,
        close: function() {
          t.close()
        },
        pick: function() {
          a.pick()
        },
        data: o
      })), t.options.closeOnUnfocus) {
      var A;
      c.on("blur", this.onBlur = function() {
        A = setTimeout(function() {
          t.close()
        }, 100)
      }), c.on("focus", this.onFocus = function() {
        clearTimeout(A)
      })
    }
    var O = c.getScrollInfo();
    return c.on("scroll", this.onScroll = function() {
      var e = c.getScrollInfo(),
        n = c.getWrapperElement().getBoundingClientRect(),
        r = y + O.top - e.top,
        i = r - (window.pageYOffset || (document.documentElement || document.body).scrollTop);
      return b || (i += u.offsetHeight), i <= n.top || i >= n.bottom ? t.close() : (u.style.top = r + "px", void(u.style.left = v + O.left - e.left + "px"))
    }), e.on(u, "dblclick", function(e) {
      var t = i(u, e.target || e.srcElement);
      t && null != t.hintId && (a.changeActive(t.hintId), a.pick())
    }), e.on(u, "click", function(e) {
      var n = i(u, e.target || e.srcElement);
      n && null != n.hintId && (a.changeActive(n.hintId), t.options.completeOnSingleClick && a.pick())
    }), e.on(u, "mousedown", function() {
      setTimeout(function() {
        c.focus()
      }, 20)
    }), e.signal(o, "select", f[0], u.firstChild), !0
  }
  var l = "CodeMirror-hint",
    s = "CodeMirror-hint-active";
  e.showHint = function(e, t, n) {
    if (!t) return e.showHint(n);
    n && n.async && (t.async = !0);
    var r = {
      hint: t
    };
    if (n)
      for (var i in n) r[i] = n[i];
    return e.showHint(r)
  }, e.defineExtension("showHint", function(n) {
    if (!(this.listSelections().length > 1 || this.somethingSelected())) {
      this.state.completionActive && this.state.completionActive.close();
      var r = this.state.completionActive = new t(this, n);
      r.options.hint && (e.signal(this, "startCompletion", this), r.update(!0))
    }
  });
  var a = window.requestAnimationFrame || function(e) {
      return setTimeout(e, 1e3 / 60)
    },
    c = window.cancelAnimationFrame || clearTimeout;
  t.prototype = {
    close: function() {
      this.active() && (this.cm.state.completionActive = null, this.tick = null, this.cm.off("cursorActivity", this.activityFunc), this.widget && this.data && e.signal(this.data, "close"), this.widget && this.widget.close(), e.signal(this.cm, "endCompletion", this.cm))
    },
    active: function() {
      return this.cm.state.completionActive == this
    },
    pick: function(t, r) {
      var i = t.list[r];
      i.hint ? i.hint(this.cm, t, i) : this.cm.replaceRange(n(i), i.from || t.from, i.to || t.to, "complete"), e.signal(t, "pick", i), this.close()
    },
    cursorActivity: function() {
      this.debounce && (c(this.debounce), this.debounce = 0);
      var e = this.cm.getCursor(),
        t = this.cm.getLine(e.line);
      if (e.line != this.startPos.line || t.length - e.ch != this.startLen - this.startPos.ch || e.ch < this.startPos.ch || this.cm.somethingSelected() || e.ch && this.options.closeCharacters.test(t.charAt(e.ch - 1))) this.close();
      else {
        var n = this;
        this.debounce = a(function() {
          n.update()
        }), this.widget && this.widget.disable()
      }
    },
    update: function(e) {
      if (null != this.tick)
        if (this.options.hint.async) {
          var t = ++this.tick,
            n = this;
          this.options.hint(this.cm, function(r) {
            n.tick == t && n.finishUpdate(r, e)
          }, this.options)
        } else this.finishUpdate(this.options.hint(this.cm, this.options), e)
    },
    finishUpdate: function(t, n) {
      this.data && e.signal(this.data, "update"), t && this.data && e.cmpPos(t.from, this.data.from) && (t = null), this.data = t;
      var r = this.widget && this.widget.picked || n && this.options.completeSingle;
      this.widget && this.widget.close(), t && t.list.length && (r && 1 == t.list.length ? this.pick(t, 0) : (this.widget = new o(this, t), e.signal(t, "shown")))
    },
    buildOptions: function(e) {
      var t = this.cm.options.hintOptions,
        n = {};
      for (var r in u) n[r] = u[r];
      if (t)
        for (var r in t) void 0 !== t[r] && (n[r] = t[r]);
      if (e)
        for (var r in e) void 0 !== e[r] && (n[r] = e[r]);
      return n
    }
  }, o.prototype = {
    close: function() {
      if (this.completion.widget == this) {
        this.completion.widget = null, this.hints.parentNode.removeChild(this.hints), this.completion.cm.removeKeyMap(this.keyMap);
        var e = this.completion.cm;
        this.completion.options.closeOnUnfocus && (e.off("blur", this.onBlur), e.off("focus", this.onFocus)), e.off("scroll", this.onScroll)
      }
    },
    disable: function() {
      this.completion.cm.removeKeyMap(this.keyMap);
      var e = this;
      this.keyMap = {
        Enter: function() {
          e.picked = !0
        }
      }, this.completion.cm.addKeyMap(this.keyMap)
    },
    pick: function() {
      this.completion.pick(this.data, this.selectedHint)
    },
    changeActive: function(t, n) {
      if (t >= this.data.list.length ? t = n ? this.data.list.length - 1 : 0 : 0 > t && (t = n ? 0 : this.data.list.length - 1), this.selectedHint != t) {
        var r = this.hints.childNodes[this.selectedHint];
        r.className = r.className.replace(" " + s, ""), r = this.hints.childNodes[this.selectedHint = t], r.className += " " + s, r.offsetTop < this.hints.scrollTop ? this.hints.scrollTop = r.offsetTop - 3 : r.offsetTop + r.offsetHeight > this.hints.scrollTop + this.hints.clientHeight && (this.hints.scrollTop = r.offsetTop + r.offsetHeight - this.hints.clientHeight + 3), e.signal(this.data, "select", this.data.list[this.selectedHint], r)
      }
    },
    screenAmount: function() {
      return Math.floor(this.hints.clientHeight / this.hints.firstChild.offsetHeight) || 1
    }
  }, e.registerHelper("hint", "auto", function(t, n) {
    var r, i = t.getHelpers(t.getCursor(), "hint");
    if (i.length)
      for (var o = 0; o < i.length; o++) {
        var l = i[o](t, n);
        if (l && l.list.length) return l
      } else if (r = t.getHelper(t.getCursor(), "hintWords")) {
        if (r) return e.hint.fromList(t, {
          words: r
        })
      } else if (e.hint.anyword) return e.hint.anyword(t, n)
  }), e.registerHelper("hint", "fromList", function(t, n) {
    var r = t.getCursor(),
      i = t.getTokenAt(r),
      o = e.Pos(r.line, i.end);
    if (i.string && /\w/.test(i.string[i.string.length - 1])) var l = i.string,
      s = e.Pos(r.line, i.start);
    else var l = "",
      s = o;
    for (var a = [], c = 0; c < n.words.length; c++) {
      var u = n.words[c];
      u.slice(0, l.length) == l && a.push(u)
    }
    return a.length ? {
      list: a,
      from: s,
      to: o
    } : void 0
  }), e.commands.autocomplete = e.showHint;
  var u = {
    hint: e.hint.auto,
    completeSingle: !0,
    alignWithWord: !0,
    closeCharacters: /[\s()\[\]{};:>,]/,
    closeOnUnfocus: !0,
    completeOnSingleClick: !1,
    container: null,
    customKeys: null,
    extraKeys: null
  };
  e.defineOption("hintOptions", null)
}),
function(e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function(e) {
  "use strict";

  function t(e) {
    var t = e.search(r);
    return -1 == t ? 0 : t
  }
  var n = {},
    r = /[^\s\u00a0]/,
    i = e.Pos;
  e.commands.toggleComment = function(e) {
    for (var t = 1 / 0, n = e.listSelections(), r = null, o = n.length - 1; o >= 0; o--) {
      var l = n[o].from(),
        s = n[o].to();
      l.line >= t || (s.line >= t && (s = i(t, 0)), t = l.line, null == r ? e.uncomment(l, s) ? r = "un" : (e.lineComment(l, s), r = "line") : "un" == r ? e.uncomment(l, s) : e.lineComment(l, s))
    }
  }, e.defineExtension("lineComment", function(e, o, l) {
    l || (l = n);
    var s = this,
      a = s.getModeAt(e),
      c = l.lineComment || a.lineComment;
    if (!c) return void((l.blockCommentStart || a.blockCommentStart) && (l.fullLines = !0, s.blockComment(e, o, l)));
    var u = s.getLine(e.line);
    if (null != u) {
      var f = Math.min(0 != o.ch || o.line == e.line ? o.line + 1 : o.line, s.lastLine() + 1),
        d = null == l.padding ? " " : l.padding,
        h = l.commentBlankLines || e.line == o.line;
      s.operation(function() {
        if (l.indent)
          for (var n = u.slice(0, t(u)), o = e.line; f > o; ++o) {
            var a = s.getLine(o),
              p = n.length;
            (h || r.test(a)) && (a.slice(0, p) != n && (p = t(a)), s.replaceRange(n + c + d, i(o, 0), i(o, p)))
          } else
            for (var o = e.line; f > o; ++o)(h || r.test(s.getLine(o))) && s.replaceRange(c + d, i(o, 0))
      })
    }
  }), e.defineExtension("blockComment", function(e, t, o) {
    o || (o = n);
    var l = this,
      s = l.getModeAt(e),
      a = o.blockCommentStart || s.blockCommentStart,
      c = o.blockCommentEnd || s.blockCommentEnd;
    if (!a || !c) return void((o.lineComment || s.lineComment) && 0 != o.fullLines && l.lineComment(e, t, o));
    var u = Math.min(t.line, l.lastLine());
    u != e.line && 0 == t.ch && r.test(l.getLine(u)) && --u;
    var f = null == o.padding ? " " : o.padding;
    e.line > u || l.operation(function() {
      if (0 != o.fullLines) {
        var n = r.test(l.getLine(u));
        l.replaceRange(f + c, i(u)), l.replaceRange(a + f, i(e.line, 0));
        var d = o.blockCommentLead || s.blockCommentLead;
        if (null != d)
          for (var h = e.line + 1; u >= h; ++h)(h != u || n) && l.replaceRange(d + f, i(h, 0))
      } else l.replaceRange(c, t), l.replaceRange(a, e)
    })
  }), e.defineExtension("uncomment", function(e, t, o) {
    o || (o = n);
    var l, s = this,
      a = s.getModeAt(e),
      c = Math.min(0 != t.ch || t.line == e.line ? t.line : t.line - 1, s.lastLine()),
      u = Math.min(e.line, c),
      f = o.lineComment || a.lineComment,
      d = [],
      h = null == o.padding ? " " : o.padding;
    e: if (f) {
      for (var p = u; c >= p; ++p) {
        var g = s.getLine(p),
          m = g.indexOf(f);
        if (m > -1 && !/comment/.test(s.getTokenTypeAt(i(p, m + 1))) && (m = -1), -1 == m && (p != c || p == u) && r.test(g)) break e;
        if (m > -1 && r.test(g.slice(0, m))) break e;
        d.push(g)
      }
      if (s.operation(function() {
          for (var e = u; c >= e; ++e) {
            var t = d[e - u],
              n = t.indexOf(f),
              r = n + f.length;
            0 > n || (t.slice(r, r + h.length) == h && (r += h.length), l = !0, s.replaceRange("", i(e, n), i(e, r)))
          }
        }), l) return !0
    }
    var v = o.blockCommentStart || a.blockCommentStart,
      y = o.blockCommentEnd || a.blockCommentEnd;
    if (!v || !y) return !1;
    var b = o.blockCommentLead || a.blockCommentLead,
      x = s.getLine(u),
      C = c == u ? x : s.getLine(c),
      w = x.indexOf(v),
      S = C.lastIndexOf(y);
    if (-1 == S && u != c && (C = s.getLine(--c), S = C.lastIndexOf(y)), -1 == w || -1 == S || !/comment/.test(s.getTokenTypeAt(i(u, w + 1))) || !/comment/.test(s.getTokenTypeAt(i(c, S + 1)))) return !1;
    var L = x.lastIndexOf(v, e.ch),
      k = -1 == L ? -1 : x.slice(0, e.ch).indexOf(y, L + v.length);
    if (-1 != L && -1 != k && k + y.length != e.ch) return !1;
    k = C.indexOf(y, t.ch);
    var T = C.slice(t.ch).lastIndexOf(v, k - t.ch);
    return L = -1 == k || -1 == T ? -1 : t.ch + T, -1 != k && -1 != L && L != t.ch ? !1 : (s.operation(function() {
      s.replaceRange("", i(c, S - (h && C.slice(S - h.length, S) == h ? h.length : 0)), i(c, S + y.length));
      var e = w + v.length;
      if (h && x.slice(e, e + h.length) == h && (e += h.length), s.replaceRange("", i(u, w), i(u, e)), b)
        for (var t = u + 1; c >= t; ++t) {
          var n = s.getLine(t),
            o = n.indexOf(b);
          if (-1 != o && !r.test(n.slice(0, o))) {
            var l = o + b.length;
            h && n.slice(l, l + h.length) == h && (l += h.length), s.replaceRange("", i(t, o), i(t, l))
          }
        }
    }), !0)
  })
});
/*! RESOURCE: /scripts/snc-code-editor/codemirror/mode/css/css.js */
(function(mod) {
  if (typeof exports == "object" && typeof module == "object")
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd)
    define(["../../lib/codemirror"], mod);
  else
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";
  CodeMirror.defineMode("css", function(config, parserConfig) {
    if (!parserConfig.propertyKeywords) parserConfig = CodeMirror.resolveMode("text/css");
    var indentUnit = config.indentUnit,
      tokenHooks = parserConfig.tokenHooks,
      documentTypes = parserConfig.documentTypes || {},
      mediaTypes = parserConfig.mediaTypes || {},
      mediaFeatures = parserConfig.mediaFeatures || {},
      propertyKeywords = parserConfig.propertyKeywords || {},
      nonStandardPropertyKeywords = parserConfig.nonStandardPropertyKeywords || {},
      fontProperties = parserConfig.fontProperties || {},
      counterDescriptors = parserConfig.counterDescriptors || {},
      colorKeywords = parserConfig.colorKeywords || {},
      valueKeywords = parserConfig.valueKeywords || {},
      allowNested = parserConfig.allowNested;
    var type, override;

    function ret(style, tp) {
      type = tp;
      return style;
    }

    function tokenBase(stream, state) {
      var ch = stream.next();
      if (tokenHooks[ch]) {
        var result = tokenHooks[ch](stream, state);
        if (result !== false) return result;
      }
      if (ch == "@") {
        stream.eatWhile(/[\w\\\-]/);
        return ret("def", stream.current());
      } else if (ch == "=" || (ch == "~" || ch == "|") && stream.eat("=")) {
        return ret(null, "compare");
      } else if (ch == "\"" || ch == "'") {
        state.tokenize = tokenString(ch);
        return state.tokenize(stream, state);
      } else if (ch == "#") {
        stream.eatWhile(/[\w\\\-]/);
        return ret("atom", "hash");
      } else if (ch == "!") {
        stream.match(/^\s*\w*/);
        return ret("keyword", "important");
      } else if (/\d/.test(ch) || ch == "." && stream.eat(/\d/)) {
        stream.eatWhile(/[\w.%]/);
        return ret("number", "unit");
      } else if (ch === "-") {
        if (/[\d.]/.test(stream.peek())) {
          stream.eatWhile(/[\w.%]/);
          return ret("number", "unit");
        } else if (stream.match(/^-[\w\\\-]+/)) {
          stream.eatWhile(/[\w\\\-]/);
          if (stream.match(/^\s*:/, false))
            return ret("variable-2", "variable-definition");
          return ret("variable-2", "variable");
        } else if (stream.match(/^\w+-/)) {
          return ret("meta", "meta");
        }
      } else if (/[,+>*\/]/.test(ch)) {
        return ret(null, "select-op");
      } else if (ch == "." && stream.match(/^-?[_a-z][_a-z0-9-]*/i)) {
        return ret("qualifier", "qualifier");
      } else if (/[:;{}\[\]\(\)]/.test(ch)) {
        return ret(null, ch);
      } else if ((ch == "u" && stream.match(/rl(-prefix)?\(/)) ||
        (ch == "d" && stream.match("omain(")) ||
        (ch == "r" && stream.match("egexp("))) {
        stream.backUp(1);
        state.tokenize = tokenParenthesized;
        return ret("property", "word");
      } else if (/[\w\\\-]/.test(ch)) {
        stream.eatWhile(/[\w\\\-]/);
        return ret("property", "word");
      } else {
        return ret(null, null);
      }
    }

    function tokenString(quote) {
      return function(stream, state) {
        var escaped = false,
          ch;
        while ((ch = stream.next()) != null) {
          if (ch == quote && !escaped) {
            if (quote == ")") stream.backUp(1);
            break;
          }
          escaped = !escaped && ch == "\\";
        }
        if (ch == quote || !escaped && quote != ")") state.tokenize = null;
        return ret("string", "string");
      };
    }

    function tokenParenthesized(stream, state) {
      stream.next();
      if (!stream.match(/\s*[\"\')]/, false))
        state.tokenize = tokenString(")");
      else
        state.tokenize = null;
      return ret(null, "(");
    }

    function Context(type, indent, prev) {
      this.type = type;
      this.indent = indent;
      this.prev = prev;
    }

    function pushContext(state, stream, type) {
      state.context = new Context(type, stream.indentation() + indentUnit, state.context);
      return type;
    }

    function popContext(state) {
      state.context = state.context.prev;
      return state.context.type;
    }

    function pass(type, stream, state) {
      return states[state.context.type](type, stream, state);
    }

    function popAndPass(type, stream, state, n) {
      for (var i = n || 1; i > 0; i--)
        state.context = state.context.prev;
      return pass(type, stream, state);
    }

    function wordAsValue(stream) {
      var word = stream.current().toLowerCase();
      if (valueKeywords.hasOwnProperty(word))
        override = "atom";
      else if (colorKeywords.hasOwnProperty(word))
        override = "keyword";
      else
        override = "variable";
    }
    var states = {};
    states.top = function(type, stream, state) {
      if (type == "{") {
        return pushContext(state, stream, "block");
      } else if (type == "}" && state.context.prev) {
        return popContext(state);
      } else if (/@(media|supports|(-moz-)?document)/.test(type)) {
        return pushContext(state, stream, "atBlock");
      } else if (/@(font-face|counter-style)/.test(type)) {
        state.stateArg = type;
        return "restricted_atBlock_before";
      } else if (/^@(-(moz|ms|o|webkit)-)?keyframes$/.test(type)) {
        return "keyframes";
      } else if (type && type.charAt(0) == "@") {
        return pushContext(state, stream, "at");
      } else if (type == "hash") {
        override = "builtin";
      } else if (type == "word") {
        override = "tag";
      } else if (type == "variable-definition") {
        return "maybeprop";
      } else if (type == "interpolation") {
        return pushContext(state, stream, "interpolation");
      } else if (type == ":") {
        return "pseudo";
      } else if (allowNested && type == "(") {
        return pushContext(state, stream, "parens");
      }
      return state.context.type;
    };
    states.block = function(type, stream, state) {
      if (type == "word") {
        var word = stream.current().toLowerCase();
        if (propertyKeywords.hasOwnProperty(word)) {
          override = "property";
          return "maybeprop";
        } else if (nonStandardPropertyKeywords.hasOwnProperty(word)) {
          override = "string-2";
          return "maybeprop";
        } else if (allowNested) {
          override = stream.match(/^\s*:(?:\s|$)/, false) ? "property" : "tag";
          return "block";
        } else {
          override += " error";
          return "maybeprop";
        }
      } else if (type == "meta") {
        return "block";
      } else if (!allowNested && (type == "hash" || type == "qualifier")) {
        override = "error";
        return "block";
      } else {
        return states.top(type, stream, state);
      }
    };
    states.maybeprop = function(type, stream, state) {
      if (type == ":") return pushContext(state, stream, "prop");
      return pass(type, stream, state);
    };
    states.prop = function(type, stream, state) {
      if (type == ";") return popContext(state);
      if (type == "{" && allowNested) return pushContext(state, stream, "propBlock");
      if (type == "}" || type == "{") return popAndPass(type, stream, state);
      if (type == "(") return pushContext(state, stream, "parens");
      if (type == "hash" && !/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(stream.current())) {
        override += " error";
      } else if (type == "word") {
        wordAsValue(stream);
      } else if (type == "interpolation") {
        return pushContext(state, stream, "interpolation");
      }
      return "prop";
    };
    states.propBlock = function(type, _stream, state) {
      if (type == "}") return popContext(state);
      if (type == "word") {
        override = "property";
        return "maybeprop";
      }
      return state.context.type;
    };
    states.parens = function(type, stream, state) {
      if (type == "{" || type == "}") return popAndPass(type, stream, state);
      if (type == ")") return popContext(state);
      if (type == "(") return pushContext(state, stream, "parens");
      if (type == "interpolation") return pushContext(state, stream, "interpolation");
      if (type == "word") wordAsValue(stream);
      return "parens";
    };
    states.pseudo = function(type, stream, state) {
      if (type == "word") {
        override = "variable-3";
        return state.context.type;
      }
      return pass(type, stream, state);
    };
    states.atBlock = function(type, stream, state) {
      if (type == "(") return pushContext(state, stream, "atBlock_parens");
      if (type == "}") return popAndPass(type, stream, state);
      if (type == "{") return popContext(state) && pushContext(state, stream, allowNested ? "block" : "top");
      if (type == "word") {
        var word = stream.current().toLowerCase();
        if (word == "only" || word == "not" || word == "and" || word == "or")
          override = "keyword";
        else if (documentTypes.hasOwnProperty(word))
          override = "tag";
        else if (mediaTypes.hasOwnProperty(word))
          override = "attribute";
        else if (mediaFeatures.hasOwnProperty(word))
          override = "property";
        else if (propertyKeywords.hasOwnProperty(word))
          override = "property";
        else if (nonStandardPropertyKeywords.hasOwnProperty(word))
          override = "string-2";
        else if (valueKeywords.hasOwnProperty(word))
          override = "atom";
        else if (colorKeywords.hasOwnProperty(word))
          override = "keyword";
        else
          override = "error";
      }
      return state.context.type;
    };
    states.atBlock_parens = function(type, stream, state) {
      if (type == ")") return popContext(state);
      if (type == "{" || type == "}") return popAndPass(type, stream, state, 2);
      return states.atBlock(type, stream, state);
    };
    states.restricted_atBlock_before = function(type, stream, state) {
      if (type == "{")
        return pushContext(state, stream, "restricted_atBlock");
      if (type == "word" && state.stateArg == "@counter-style") {
        override = "variable";
        return "restricted_atBlock_before";
      }
      return pass(type, stream, state);
    };
    states.restricted_atBlock = function(type, stream, state) {
      if (type == "}") {
        state.stateArg = null;
        return popContext(state);
      }
      if (type == "word") {
        if ((state.stateArg == "@font-face" && !fontProperties.hasOwnProperty(stream.current().toLowerCase())) ||
          (state.stateArg == "@counter-style" && !counterDescriptors.hasOwnProperty(stream.current().toLowerCase())))
          override = "error";
        else
          override = "property";
        return "maybeprop";
      }
      return "restricted_atBlock";
    };
    states.keyframes = function(type, stream, state) {
      if (type == "word") {
        override = "variable";
        return "keyframes";
      }
      if (type == "{") return pushContext(state, stream, "top");
      return pass(type, stream, state);
    };
    states.at = function(type, stream, state) {
      if (type == ";") return popContext(state);
      if (type == "{" || type == "}") return popAndPass(type, stream, state);
      if (type == "word") override = "tag";
      else if (type == "hash") override = "builtin";
      return "at";
    };
    states.interpolation = function(type, stream, state) {
      if (type == "}") return popContext(state);
      if (type == "{" || type == ";") return popAndPass(type, stream, state);
      if (type == "word") override = "variable";
      else if (type != "variable" && type != "(" && type != ")") override = "error";
      return "interpolation";
    };
    return {
      startState: function(base) {
        return {
          tokenize: null,
          state: "top",
          stateArg: null,
          context: new Context("top", base || 0, null)
        };
      },
      token: function(stream, state) {
        if (!state.tokenize && stream.eatSpace()) return null;
        var style = (state.tokenize || tokenBase)(stream, state);
        if (style && typeof style == "object") {
          type = style[1];
          style = style[0];
        }
        override = style;
        state.state = states[state.state](type, stream, state);
        return override;
      },
      indent: function(state, textAfter) {
        var cx = state.context,
          ch = textAfter && textAfter.charAt(0);
        var indent = cx.indent;
        if (cx.type == "prop" && (ch == "}" || ch == ")")) cx = cx.prev;
        if (cx.prev &&
          (ch == "}" && (cx.type == "block" || cx.type == "top" || cx.type == "interpolation" || cx.type == "restricted_atBlock") ||
            ch == ")" && (cx.type == "parens" || cx.type == "atBlock_parens") ||
            ch == "{" && (cx.type == "at" || cx.type == "atBlock"))) {
          indent = cx.indent - indentUnit;
          cx = cx.prev;
        }
        return indent;
      },
      electricChars: "}",
      blockCommentStart: "/*",
      blockCommentEnd: "*/",
      fold: "brace"
    };
  });

  function keySet(array) {
    var keys = {};
    for (var i = 0; i < array.length; ++i) {
      keys[array[i]] = true;
    }
    return keys;
  }
  var documentTypes_ = [
      "domain", "regexp", "url", "url-prefix"
    ],
    documentTypes = keySet(documentTypes_);
  var mediaTypes_ = [
      "all", "aural", "braille", "handheld", "print", "projection", "screen",
      "tty", "tv", "embossed"
    ],
    mediaTypes = keySet(mediaTypes_);
  var mediaFeatures_ = [
      "width", "min-width", "max-width", "height", "min-height", "max-height",
      "device-width", "min-device-width", "max-device-width", "device-height",
      "min-device-height", "max-device-height", "aspect-ratio",
      "min-aspect-ratio", "max-aspect-ratio", "device-aspect-ratio",
      "min-device-aspect-ratio", "max-device-aspect-ratio", "color", "min-color",
      "max-color", "color-index", "min-color-index", "max-color-index",
      "monochrome", "min-monochrome", "max-monochrome", "resolution",
      "min-resolution", "max-resolution", "scan", "grid"
    ],
    mediaFeatures = keySet(mediaFeatures_);
  var propertyKeywords_ = [
      "align-content", "align-items", "align-self", "alignment-adjust",
      "alignment-baseline", "anchor-point", "animation", "animation-delay",
      "animation-direction", "animation-duration", "animation-fill-mode",
      "animation-iteration-count", "animation-name", "animation-play-state",
      "animation-timing-function", "appearance", "azimuth", "backface-visibility",
      "background", "background-attachment", "background-clip", "background-color",
      "background-image", "background-origin", "background-position",
      "background-repeat", "background-size", "baseline-shift", "binding",
      "bleed", "bookmark-label", "bookmark-level", "bookmark-state",
      "bookmark-target", "border", "border-bottom", "border-bottom-color",
      "border-bottom-left-radius", "border-bottom-right-radius",
      "border-bottom-style", "border-bottom-width", "border-collapse",
      "border-color", "border-image", "border-image-outset",
      "border-image-repeat", "border-image-slice", "border-image-source",
      "border-image-width", "border-left", "border-left-color",
      "border-left-style", "border-left-width", "border-radius", "border-right",
      "border-right-color", "border-right-style", "border-right-width",
      "border-spacing", "border-style", "border-top", "border-top-color",
      "border-top-left-radius", "border-top-right-radius", "border-top-style",
      "border-top-width", "border-width", "bottom", "box-decoration-break",
      "box-shadow", "box-sizing", "break-after", "break-before", "break-inside",
      "caption-side", "clear", "clip", "color", "color-profile", "column-count",
      "column-fill", "column-gap", "column-rule", "column-rule-color",
      "column-rule-style", "column-rule-width", "column-span", "column-width",
      "columns", "content", "counter-increment", "counter-reset", "crop", "cue",
      "cue-after", "cue-before", "cursor", "direction", "display",
      "dominant-baseline", "drop-initial-after-adjust",
      "drop-initial-after-align", "drop-initial-before-adjust",
      "drop-initial-before-align", "drop-initial-size", "drop-initial-value",
      "elevation", "empty-cells", "fit", "fit-position", "flex", "flex-basis",
      "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap",
      "float", "float-offset", "flow-from", "flow-into", "font", "font-feature-settings",
      "font-family", "font-kerning", "font-language-override", "font-size", "font-size-adjust",
      "font-stretch", "font-style", "font-synthesis", "font-variant",
      "font-variant-alternates", "font-variant-caps", "font-variant-east-asian",
      "font-variant-ligatures", "font-variant-numeric", "font-variant-position",
      "font-weight", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow",
      "grid-auto-position", "grid-auto-rows", "grid-column", "grid-column-end",
      "grid-column-start", "grid-row", "grid-row-end", "grid-row-start",
      "grid-template", "grid-template-areas", "grid-template-columns",
      "grid-template-rows", "hanging-punctuation", "height", "hyphens",
      "icon", "image-orientation", "image-rendering", "image-resolution",
      "inline-box-align", "justify-content", "left", "letter-spacing",
      "line-break", "line-height", "line-stacking", "line-stacking-ruby",
      "line-stacking-shift", "line-stacking-strategy", "list-style",
      "list-style-image", "list-style-position", "list-style-type", "margin",
      "margin-bottom", "margin-left", "margin-right", "margin-top",
      "marker-offset", "marks", "marquee-direction", "marquee-loop",
      "marquee-play-count", "marquee-speed", "marquee-style", "max-height",
      "max-width", "min-height", "min-width", "move-to", "nav-down", "nav-index",
      "nav-left", "nav-right", "nav-up", "object-fit", "object-position",
      "opacity", "order", "orphans", "outline",
      "outline-color", "outline-offset", "outline-style", "outline-width",
      "overflow", "overflow-style", "overflow-wrap", "overflow-x", "overflow-y",
      "padding", "padding-bottom", "padding-left", "padding-right", "padding-top",
      "page", "page-break-after", "page-break-before", "page-break-inside",
      "page-policy", "pause", "pause-after", "pause-before", "perspective",
      "perspective-origin", "pitch", "pitch-range", "play-during", "position",
      "presentation-level", "punctuation-trim", "quotes", "region-break-after",
      "region-break-before", "region-break-inside", "region-fragment",
      "rendering-intent", "resize", "rest", "rest-after", "rest-before", "richness",
      "right", "rotation", "rotation-point", "ruby-align", "ruby-overhang",
      "ruby-position", "ruby-span", "shape-image-threshold", "shape-inside", "shape-margin",
      "shape-outside", "size", "speak", "speak-as", "speak-header",
      "speak-numeral", "speak-punctuation", "speech-rate", "stress", "string-set",
      "tab-size", "table-layout", "target", "target-name", "target-new",
      "target-position", "text-align", "text-align-last", "text-decoration",
      "text-decoration-color", "text-decoration-line", "text-decoration-skip",
      "text-decoration-style", "text-emphasis", "text-emphasis-color",
      "text-emphasis-position", "text-emphasis-style", "text-height",
      "text-indent", "text-justify", "text-outline", "text-overflow", "text-shadow",
      "text-size-adjust", "text-space-collapse", "text-transform", "text-underline-position",
      "text-wrap", "top", "transform", "transform-origin", "transform-style",
      "transition", "transition-delay", "transition-duration",
      "transition-property", "transition-timing-function", "unicode-bidi",
      "vertical-align", "visibility", "voice-balance", "voice-duration",
      "voice-family", "voice-pitch", "voice-range", "voice-rate", "voice-stress",
      "voice-volume", "volume", "white-space", "widows", "width", "word-break",
      "word-spacing", "word-wrap", "z-index",
      "clip-path", "clip-rule", "mask", "enable-background", "filter", "flood-color",
      "flood-opacity", "lighting-color", "stop-color", "stop-opacity", "pointer-events",
      "color-interpolation", "color-interpolation-filters",
      "color-rendering", "fill", "fill-opacity", "fill-rule", "image-rendering",
      "marker", "marker-end", "marker-mid", "marker-start", "shape-rendering", "stroke",
      "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin",
      "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-rendering",
      "baseline-shift", "dominant-baseline", "glyph-orientation-horizontal",
      "glyph-orientation-vertical", "text-anchor", "writing-mode"
    ],
    propertyKeywords = keySet(propertyKeywords_);
  var nonStandardPropertyKeywords_ = [
      "scrollbar-arrow-color", "scrollbar-base-color", "scrollbar-dark-shadow-color",
      "scrollbar-face-color", "scrollbar-highlight-color", "scrollbar-shadow-color",
      "scrollbar-3d-light-color", "scrollbar-track-color", "shape-inside",
      "searchfield-cancel-button", "searchfield-decoration", "searchfield-results-button",
      "searchfield-results-decoration", "zoom"
    ],
    nonStandardPropertyKeywords = keySet(nonStandardPropertyKeywords_);
  var fontProperties_ = [
      "font-family", "src", "unicode-range", "font-variant", "font-feature-settings",
      "font-stretch", "font-weight", "font-style"
    ],
    fontProperties = keySet(fontProperties_);
  var counterDescriptors_ = [
      "additive-symbols", "fallback", "negative", "pad", "prefix", "range",
      "speak-as", "suffix", "symbols", "system"
    ],
    counterDescriptors = keySet(counterDescriptors_);
  var colorKeywords_ = [
      "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige",
      "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown",
      "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue",
      "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod",
      "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen",
      "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen",
      "darkslateblue", "darkslategray", "darkturquoise", "darkviolet",
      "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick",
      "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite",
      "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew",
      "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender",
      "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral",
      "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink",
      "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray",
      "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta",
      "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple",
      "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise",
      "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin",
      "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered",
      "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred",
      "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue",
      "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown",
      "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue",
      "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan",
      "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white",
      "whitesmoke", "yellow", "yellowgreen"
    ],
    colorKeywords = keySet(colorKeywords_);
  var valueKeywords_ = [
      "above", "absolute", "activeborder", "additive", "activecaption", "afar",
      "after-white-space", "ahead", "alias", "all", "all-scroll", "alphabetic", "alternate",
      "always", "amharic", "amharic-abegede", "antialiased", "appworkspace",
      "arabic-indic", "armenian", "asterisks", "attr", "auto", "avoid", "avoid-column", "avoid-page",
      "avoid-region", "background", "backwards", "baseline", "below", "bidi-override", "binary",
      "bengali", "blink", "block", "block-axis", "bold", "bolder", "border", "border-box",
      "both", "bottom", "break", "break-all", "break-word", "bullets", "button", "button-bevel",
      "buttonface", "buttonhighlight", "buttonshadow", "buttontext", "calc", "cambodian",
      "capitalize", "caps-lock-indicator", "caption", "captiontext", "caret",
      "cell", "center", "checkbox", "circle", "cjk-decimal", "cjk-earthly-branch",
      "cjk-heavenly-stem", "cjk-ideographic", "clear", "clip", "close-quote",
      "col-resize", "collapse", "column", "compact", "condensed", "contain", "content",
      "content-box", "context-menu", "continuous", "copy", "counter", "counters", "cover", "crop",
      "cross", "crosshair", "currentcolor", "cursive", "cyclic", "dashed", "decimal",
      "decimal-leading-zero", "default", "default-button", "destination-atop",
      "destination-in", "destination-out", "destination-over", "devanagari",
      "disc", "discard", "disclosure-closed", "disclosure-open", "document",
      "dot-dash", "dot-dot-dash",
      "dotted", "double", "down", "e-resize", "ease", "ease-in", "ease-in-out", "ease-out",
      "element", "ellipse", "ellipsis", "embed", "end", "ethiopic", "ethiopic-abegede",
      "ethiopic-abegede-am-et", "ethiopic-abegede-gez", "ethiopic-abegede-ti-er",
      "ethiopic-abegede-ti-et", "ethiopic-halehame-aa-er",
      "ethiopic-halehame-aa-et", "ethiopic-halehame-am-et",
      "ethiopic-halehame-gez", "ethiopic-halehame-om-et",
      "ethiopic-halehame-sid-et", "ethiopic-halehame-so-et",
      "ethiopic-halehame-ti-er", "ethiopic-halehame-ti-et", "ethiopic-halehame-tig",
      "ethiopic-numeric", "ew-resize", "expanded", "extends", "extra-condensed",
      "extra-expanded", "fantasy", "fast", "fill", "fixed", "flat", "flex", "footnotes",
      "forwards", "from", "geometricPrecision", "georgian", "graytext", "groove",
      "gujarati", "gurmukhi", "hand", "hangul", "hangul-consonant", "hebrew",
      "help", "hidden", "hide", "higher", "highlight", "highlighttext",
      "hiragana", "hiragana-iroha", "horizontal", "hsl", "hsla", "icon", "ignore",
      "inactiveborder", "inactivecaption", "inactivecaptiontext", "infinite",
      "infobackground", "infotext", "inherit", "initial", "inline", "inline-axis",
      "inline-block", "inline-flex", "inline-table", "inset", "inside", "intrinsic", "invert",
      "italic", "japanese-formal", "japanese-informal", "justify", "kannada",
      "katakana", "katakana-iroha", "keep-all", "khmer",
      "korean-hangul-formal", "korean-hanja-formal", "korean-hanja-informal",
      "landscape", "lao", "large", "larger", "left", "level", "lighter",
      "line-through", "linear", "linear-gradient", "lines", "list-item", "listbox", "listitem",
      "local", "logical", "loud", "lower", "lower-alpha", "lower-armenian",
      "lower-greek", "lower-hexadecimal", "lower-latin", "lower-norwegian",
      "lower-roman", "lowercase", "ltr", "malayalam", "match", "matrix", "matrix3d",
      "media-controls-background", "media-current-time-display",
      "media-fullscreen-button", "media-mute-button", "media-play-button",
      "media-return-to-realtime-button", "media-rewind-button",
      "media-seek-back-button", "media-seek-forward-button", "media-slider",
      "media-sliderthumb", "media-time-remaining-display", "media-volume-slider",
      "media-volume-slider-container", "media-volume-sliderthumb", "medium",
      "menu", "menulist", "menulist-button", "menulist-text",
      "menulist-textfield", "menutext", "message-box", "middle", "min-intrinsic",
      "mix", "mongolian", "monospace", "move", "multiple", "myanmar", "n-resize",
      "narrower", "ne-resize", "nesw-resize", "no-close-quote", "no-drop",
      "no-open-quote", "no-repeat", "none", "normal", "not-allowed", "nowrap",
      "ns-resize", "numbers", "numeric", "nw-resize", "nwse-resize", "oblique", "octal", "open-quote",
      "optimizeLegibility", "optimizeSpeed", "oriya", "oromo", "outset",
      "outside", "outside-shape", "overlay", "overline", "padding", "padding-box",
      "painted", "page", "paused", "persian", "perspective", "plus-darker", "plus-lighter",
      "pointer", "polygon", "portrait", "pre", "pre-line", "pre-wrap", "preserve-3d",
      "progress", "push-button", "radial-gradient", "radio", "read-only",
      "read-write", "read-write-plaintext-only", "rectangle", "region",
      "relative", "repeat", "repeating-linear-gradient",
      "repeating-radial-gradient", "repeat-x", "repeat-y", "reset", "reverse",
      "rgb", "rgba", "ridge", "right", "rotate", "rotate3d", "rotateX", "rotateY",
      "rotateZ", "round", "row-resize", "rtl", "run-in", "running",
      "s-resize", "sans-serif", "scale", "scale3d", "scaleX", "scaleY", "scaleZ",
      "scroll", "scrollbar", "se-resize", "searchfield",
      "searchfield-cancel-button", "searchfield-decoration",
      "searchfield-results-button", "searchfield-results-decoration",
      "semi-condensed", "semi-expanded", "separate", "serif", "show", "sidama",
      "simp-chinese-formal", "simp-chinese-informal", "single",
      "skew", "skewX", "skewY", "skip-white-space", "slide", "slider-horizontal",
      "slider-vertical", "sliderthumb-horizontal", "sliderthumb-vertical", "slow",
      "small", "small-caps", "small-caption", "smaller", "solid", "somali",
      "source-atop", "source-in", "source-out", "source-over", "space", "spell-out", "square",
      "square-button", "start", "static", "status-bar", "stretch", "stroke", "sub",
      "subpixel-antialiased", "super", "sw-resize", "symbolic", "symbols", "table",
      "table-caption", "table-cell", "table-column", "table-column-group",
      "table-footer-group", "table-header-group", "table-row", "table-row-group",
      "tamil",
      "telugu", "text", "text-bottom", "text-top", "textarea", "textfield", "thai",
      "thick", "thin", "threeddarkshadow", "threedface", "threedhighlight",
      "threedlightshadow", "threedshadow", "tibetan", "tigre", "tigrinya-er",
      "tigrinya-er-abegede", "tigrinya-et", "tigrinya-et-abegede", "to", "top",
      "trad-chinese-formal", "trad-chinese-informal",
      "translate", "translate3d", "translateX", "translateY", "translateZ",
      "transparent", "ultra-condensed", "ultra-expanded", "underline", "up",
      "upper-alpha", "upper-armenian", "upper-greek", "upper-hexadecimal",
      "upper-latin", "upper-norwegian", "upper-roman", "uppercase", "urdu", "url",
      "var", "vertical", "vertical-text", "visible", "visibleFill", "visiblePainted",
      "visibleStroke", "visual", "w-resize", "wait", "wave", "wider",
      "window", "windowframe", "windowtext", "words", "x-large", "x-small", "xor",
      "xx-large", "xx-small"
    ],
    valueKeywords = keySet(valueKeywords_);
  var allWords = documentTypes_.concat(mediaTypes_).concat(mediaFeatures_).concat(propertyKeywords_)
    .concat(nonStandardPropertyKeywords_).concat(colorKeywords_).concat(valueKeywords_);
  CodeMirror.registerHelper("hintWords", "css", allWords);

  function tokenCComment(stream, state) {
    var maybeEnd = false,
      ch;
    while ((ch = stream.next()) != null) {
      if (maybeEnd && ch == "/") {
        state.tokenize = null;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return ["comment", "comment"];
  }
  CodeMirror.defineMIME("text/css", {
    documentTypes: documentTypes,
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    fontProperties: fontProperties,
    counterDescriptors: counterDescriptors,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    tokenHooks: {
      "/": function(stream, state) {
        if (!stream.eat("*")) return false;
        state.tokenize = tokenCComment;
        return tokenCComment(stream, state);
      }
    },
    name: "css"
  });
  CodeMirror.defineMIME("text/x-scss", {
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    fontProperties: fontProperties,
    allowNested: true,
    tokenHooks: {
      "/": function(stream, state) {
        if (stream.eat("/")) {
          stream.skipToEnd();
          return ["comment", "comment"];
        } else if (stream.eat("*")) {
          state.tokenize = tokenCComment;
          return tokenCComment(stream, state);
        } else {
          return ["operator", "operator"];
        }
      },
      ":": function(stream) {
        if (stream.match(/\s*\{/))
          return [null, "{"];
        return false;
      },
      "$": function(stream) {
        stream.match(/^[\w-]+/);
        if (stream.match(/^\s*:/, false))
          return ["variable-2", "variable-definition"];
        return ["variable-2", "variable"];
      },
      "#": function(stream) {
        if (!stream.eat("{")) return false;
        return [null, "interpolation"];
      }
    },
    name: "css",
    helperType: "scss"
  });
  CodeMirror.defineMIME("text/x-less", {
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    fontProperties: fontProperties,
    allowNested: true,
    tokenHooks: {
      "/": function(stream, state) {
        if (stream.eat("/")) {
          stream.skipToEnd();
          return ["comment", "comment"];
        } else if (stream.eat("*")) {
          state.tokenize = tokenCComment;
          return tokenCComment(stream, state);
        } else {
          return ["operator", "operator"];
        }
      },
      "@": function(stream) {
        if (stream.eat("{")) return [null, "interpolation"];
        if (stream.match(/^(charset|document|font-face|import|(-(moz|ms|o|webkit)-)?keyframes|media|namespace|page|supports)\b/, false)) return false;
        stream.eatWhile(/[\w\\\-]/);
        if (stream.match(/^\s*:/, false))
          return ["variable-2", "variable-definition"];
        return ["variable-2", "variable"];
      },
      "&": function() {
        return ["atom", "atom"];
      }
    },
    name: "css",
    helperType: "less"
  });
});;
/*! RESOURCE: /scripts/snc-code-editor/codemirror/mode/xml/xml.js */
(function(mod) {
  if (typeof exports == "object" && typeof module == "object")
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd)
    define(["../../lib/codemirror"], mod);
  else
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";
  CodeMirror.defineMode("xml", function(config, parserConfig) {
    var indentUnit = config.indentUnit;
    var multilineTagIndentFactor = parserConfig.multilineTagIndentFactor || 1;
    var multilineTagIndentPastTag = parserConfig.multilineTagIndentPastTag;
    if (multilineTagIndentPastTag == null) multilineTagIndentPastTag = true;
    var Kludges = parserConfig.htmlMode ? {
      autoSelfClosers: {
        'area': true,
        'base': true,
        'br': true,
        'col': true,
        'command': true,
        'embed': true,
        'frame': true,
        'hr': true,
        'img': true,
        'input': true,
        'keygen': true,
        'link': true,
        'meta': true,
        'param': true,
        'source': true,
        'track': true,
        'wbr': true,
        'menuitem': true
      },
      implicitlyClosed: {
        'dd': true,
        'li': true,
        'optgroup': true,
        'option': true,
        'p': true,
        'rp': true,
        'rt': true,
        'tbody': true,
        'td': true,
        'tfoot': true,
        'th': true,
        'tr': true
      },
      contextGrabbers: {
        'dd': {
          'dd': true,
          'dt': true
        },
        'dt': {
          'dd': true,
          'dt': true
        },
        'li': {
          'li': true
        },
        'option': {
          'option': true,
          'optgroup': true
        },
        'optgroup': {
          'optgroup': true
        },
        'p': {
          'address': true,
          'article': true,
          'aside': true,
          'blockquote': true,
          'dir': true,
          'div': true,
          'dl': true,
          'fieldset': true,
          'footer': true,
          'form': true,
          'h1': true,
          'h2': true,
          'h3': true,
          'h4': true,
          'h5': true,
          'h6': true,
          'header': true,
          'hgroup': true,
          'hr': true,
          'menu': true,
          'nav': true,
          'ol': true,
          'p': true,
          'pre': true,
          'section': true,
          'table': true,
          'ul': true
        },
        'rp': {
          'rp': true,
          'rt': true
        },
        'rt': {
          'rp': true,
          'rt': true
        },
        'tbody': {
          'tbody': true,
          'tfoot': true
        },
        'td': {
          'td': true,
          'th': true
        },
        'tfoot': {
          'tbody': true
        },
        'th': {
          'td': true,
          'th': true
        },
        'thead': {
          'tbody': true,
          'tfoot': true
        },
        'tr': {
          'tr': true
        }
      },
      doNotIndent: {
        "pre": true
      },
      allowUnquoted: true,
      allowMissing: true,
      caseFold: true
    } : {
      autoSelfClosers: {},
      implicitlyClosed: {},
      contextGrabbers: {},
      doNotIndent: {},
      allowUnquoted: false,
      allowMissing: false,
      caseFold: false
    };
    var alignCDATA = parserConfig.alignCDATA;
    var type, setStyle;

    function inText(stream, state) {
      function chain(parser) {
        state.tokenize = parser;
        return parser(stream, state);
      }
      var ch = stream.next();
      if (ch == "<") {
        if (stream.eat("!")) {
          if (stream.eat("[")) {
            if (stream.match("CDATA[")) return chain(inBlock("atom", "]]>"));
            else return null;
          } else if (stream.match("--")) {
            return chain(inBlock("comment", "-->"));
          } else if (stream.match("DOCTYPE", true, true)) {
            stream.eatWhile(/[\w\._\-]/);
            return chain(doctype(1));
          } else {
            return null;
          }
        } else if (stream.eat("?")) {
          stream.eatWhile(/[\w\._\-]/);
          state.tokenize = inBlock("meta", "?>");
          return "meta";
        } else {
          type = stream.eat("/") ? "closeTag" : "openTag";
          state.tokenize = inTag;
          return "tag bracket";
        }
      } else if (ch == "&") {
        var ok;
        if (stream.eat("#")) {
          if (stream.eat("x")) {
            ok = stream.eatWhile(/[a-fA-F\d]/) && stream.eat(";");
          } else {
            ok = stream.eatWhile(/[\d]/) && stream.eat(";");
          }
        } else {
          ok = stream.eatWhile(/[\w\.\-:]/) && stream.eat(";");
        }
        return ok ? "atom" : "error";
      } else {
        stream.eatWhile(/[^&<]/);
        return null;
      }
    }
    inText.isInText = true;

    function inTag(stream, state) {
      var ch = stream.next();
      if (ch == ">" || (ch == "/" && stream.eat(">"))) {
        state.tokenize = inText;
        type = ch == ">" ? "endTag" : "selfcloseTag";
        return "tag bracket";
      } else if (ch == "=") {
        type = "equals";
        return null;
      } else if (ch == "<") {
        state.tokenize = inText;
        state.state = baseState;
        state.tagName = state.tagStart = null;
        var next = state.tokenize(stream, state);
        return next ? next + " tag error" : "tag error";
      } else if (/[\'\"]/.test(ch)) {
        state.tokenize = inAttribute(ch);
        state.stringStartCol = stream.column();
        return state.tokenize(stream, state);
      } else {
        stream.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/);
        return "word";
      }
    }

    function inAttribute(quote) {
      var closure = function(stream, state) {
        while (!stream.eol()) {
          if (stream.next() == quote) {
            state.tokenize = inTag;
            break;
          }
        }
        return "string";
      };
      closure.isInAttribute = true;
      return closure;
    }

    function inBlock(style, terminator) {
      return function(stream, state) {
        while (!stream.eol()) {
          if (stream.match(terminator)) {
            state.tokenize = inText;
            break;
          }
          stream.next();
        }
        return style;
      };
    }

    function doctype(depth) {
      return function(stream, state) {
        var ch;
        while ((ch = stream.next()) != null) {
          if (ch == "<") {
            state.tokenize = doctype(depth + 1);
            return state.tokenize(stream, state);
          } else if (ch == ">") {
            if (depth == 1) {
              state.tokenize = inText;
              break;
            } else {
              state.tokenize = doctype(depth - 1);
              return state.tokenize(stream, state);
            }
          }
        }
        return "meta";
      };
    }

    function Context(state, tagName, startOfLine) {
      this.prev = state.context;
      this.tagName = tagName;
      this.indent = state.indented;
      this.startOfLine = startOfLine;
      if (Kludges.doNotIndent.hasOwnProperty(tagName) || (state.context && state.context.noIndent))
        this.noIndent = true;
    }

    function popContext(state) {
      if (state.context) state.context = state.context.prev;
    }

    function maybePopContext(state, nextTagName) {
      var parentTagName;
      while (true) {
        if (!state.context) {
          return;
        }
        parentTagName = state.context.tagName;
        if (!Kludges.contextGrabbers.hasOwnProperty(parentTagName) ||
          !Kludges.contextGrabbers[parentTagName].hasOwnProperty(nextTagName)) {
          return;
        }
        popContext(state);
      }
    }

    function baseState(type, stream, state) {
      if (type == "openTag") {
        state.tagStart = stream.column();
        return tagNameState;
      } else if (type == "closeTag") {
        return closeTagNameState;
      } else {
        return baseState;
      }
    }

    function tagNameState(type, stream, state) {
      if (type == "word") {
        state.tagName = stream.current();
        setStyle = "tag";
        return attrState;
      } else {
        setStyle = "error";
        return tagNameState;
      }
    }

    function closeTagNameState(type, stream, state) {
      if (type == "word") {
        var tagName = stream.current();
        if (state.context && state.context.tagName != tagName &&
          Kludges.implicitlyClosed.hasOwnProperty(state.context.tagName))
          popContext(state);
        if (state.context && state.context.tagName == tagName) {
          setStyle = "tag";
          return closeState;
        } else {
          setStyle = "tag error";
          return closeStateErr;
        }
      } else {
        setStyle = "error";
        return closeStateErr;
      }
    }

    function closeState(type, _stream, state) {
      if (type != "endTag") {
        setStyle = "error";
        return closeState;
      }
      popContext(state);
      return baseState;
    }

    function closeStateErr(type, stream, state) {
      setStyle = "error";
      return closeState(type, stream, state);
    }

    function attrState(type, _stream, state) {
      if (type == "word") {
        setStyle = "attribute";
        return attrEqState;
      } else if (type == "endTag" || type == "selfcloseTag") {
        var tagName = state.tagName,
          tagStart = state.tagStart;
        state.tagName = state.tagStart = null;
        if (type == "selfcloseTag" ||
          Kludges.autoSelfClosers.hasOwnProperty(tagName)) {
          maybePopContext(state, tagName);
        } else {
          maybePopContext(state, tagName);
          state.context = new Context(state, tagName, tagStart == state.indented);
        }
        return baseState;
      }
      setStyle = "error";
      return attrState;
    }

    function attrEqState(type, stream, state) {
      if (type == "equals") return attrValueState;
      if (!Kludges.allowMissing) setStyle = "error";
      return attrState(type, stream, state);
    }

    function attrValueState(type, stream, state) {
      if (type == "string") return attrContinuedState;
      if (type == "word" && Kludges.allowUnquoted) {
        setStyle = "string";
        return attrState;
      }
      setStyle = "error";
      return attrState(type, stream, state);
    }

    function attrContinuedState(type, stream, state) {
      if (type == "string") return attrContinuedState;
      return attrState(type, stream, state);
    }
    return {
      startState: function() {
        return {
          tokenize: inText,
          state: baseState,
          indented: 0,
          tagName: null,
          tagStart: null,
          context: null
        };
      },
      token: function(stream, state) {
        if (!state.tagName && stream.sol())
          state.indented = stream.indentation();
        if (stream.eatSpace()) return null;
        type = null;
        var style = state.tokenize(stream, state);
        if ((style || type) && style != "comment") {
          setStyle = null;
          state.state = state.state(type || style, stream, state);
          if (setStyle)
            style = setStyle == "error" ? style + " error" : setStyle;
        }
        return style;
      },
      indent: function(state, textAfter, fullLine) {
        var context = state.context;
        if (state.tokenize.isInAttribute) {
          if (state.tagStart == state.indented)
            return state.stringStartCol + 1;
          else
            return state.indented + indentUnit;
        }
        if (context && context.noIndent) return CodeMirror.Pass;
        if (state.tokenize != inTag && state.tokenize != inText)
          return fullLine ? fullLine.match(/^(\s*)/)[0].length : 0;
        if (state.tagName) {
          if (multilineTagIndentPastTag)
            return state.tagStart + state.tagName.length + 2;
          else
            return state.tagStart + indentUnit * multilineTagIndentFactor;
        }
        if (alignCDATA && /<!\[CDATA\[/.test(textAfter)) return 0;
        var tagAfter = textAfter && /^<(\/)?([\w_:\.-]*)/.exec(textAfter);
        if (tagAfter && tagAfter[1]) {
          while (context) {
            if (context.tagName == tagAfter[2]) {
              context = context.prev;
              break;
            } else if (Kludges.implicitlyClosed.hasOwnProperty(context.tagName)) {
              context = context.prev;
            } else {
              break;
            }
          }
        } else if (tagAfter) {
          while (context) {
            var grabbers = Kludges.contextGrabbers[context.tagName];
            if (grabbers && grabbers.hasOwnProperty(tagAfter[2]))
              context = context.prev;
            else
              break;
          }
        }
        while (context && !context.startOfLine)
          context = context.prev;
        if (context) return context.indent + indentUnit;
        else return 0;
      },
      electricInput: /<\/[\s\w:]+>$/,
      blockCommentStart: "<!--",
      blockCommentEnd: "-->",
      configuration: parserConfig.htmlMode ? "html" : "xml",
      helperType: parserConfig.htmlMode ? "html" : "xml"
    };
  });
  CodeMirror.defineMIME("text/xml", "xml");
  CodeMirror.defineMIME("application/xml", "xml");
  if (!CodeMirror.mimeModes.hasOwnProperty("text/html"))
    CodeMirror.defineMIME("text/html", {
      name: "xml",
      htmlMode: true
    });
});;
/*! RESOURCE: /scripts/snc-code-editor/codemirror/mode/htmlmixed/htmlmixed.js */
(function(mod) {
  if (typeof exports == "object" && typeof module == "object")
    mod(require("../../lib/codemirror"), require("../xml/xml"), require("../javascript/javascript"), require("../css/css"));
  else if (typeof define == "function" && define.amd)
    define(["../../lib/codemirror", "../xml/xml", "../javascript/javascript", "../css/css"], mod);
  else
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";
  CodeMirror.defineMode("htmlmixed", function(config, parserConfig) {
    var htmlMode = CodeMirror.getMode(config, {
      name: "xml",
      htmlMode: true,
      multilineTagIndentFactor: parserConfig.multilineTagIndentFactor,
      multilineTagIndentPastTag: parserConfig.multilineTagIndentPastTag
    });
    var cssMode = CodeMirror.getMode(config, "css");
    var scriptTypes = [],
      scriptTypesConf = parserConfig && parserConfig.scriptTypes;
    scriptTypes.push({
      matches: /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^$/i,
      mode: CodeMirror.getMode(config, "javascript")
    });
    if (scriptTypesConf)
      for (var i = 0; i < scriptTypesConf.length; ++i) {
        var conf = scriptTypesConf[i];
        scriptTypes.push({
          matches: conf.matches,
          mode: conf.mode && CodeMirror.getMode(config, conf.mode)
        });
      }
    scriptTypes.push({
      matches: /./,
      mode: CodeMirror.getMode(config, "text/plain")
    });

    function html(stream, state) {
      var tagName = state.htmlState.tagName;
      if (tagName) tagName = tagName.toLowerCase();
      var style = htmlMode.token(stream, state.htmlState);
      if (tagName == "script" && /\btag\b/.test(style) && stream.current() == ">") {
        var scriptType = stream.string.slice(Math.max(0, stream.pos - 100), stream.pos).match(/\btype\s*=\s*("[^"]+"|'[^']+'|\S+)[^<]*$/i);
        scriptType = scriptType ? scriptType[1] : "";
        if (scriptType && /[\"\']/.test(scriptType.charAt(0))) scriptType = scriptType.slice(1, scriptType.length - 1);
        for (var i = 0; i < scriptTypes.length; ++i) {
          var tp = scriptTypes[i];
          if (typeof tp.matches == "string" ? scriptType == tp.matches : tp.matches.test(scriptType)) {
            if (tp.mode) {
              state.token = script;
              state.localMode = tp.mode;
              state.localState = tp.mode.startState && tp.mode.startState(htmlMode.indent(state.htmlState, ""));
            }
            break;
          }
        }
      } else if (tagName == "style" && /\btag\b/.test(style) && stream.current() == ">") {
        state.token = css;
        state.localMode = cssMode;
        state.localState = cssMode.startState(htmlMode.indent(state.htmlState, ""));
      }
      return style;
    }

    function maybeBackup(stream, pat, style) {
      var cur = stream.current();
      var close = cur.search(pat);
      if (close > -1) stream.backUp(cur.length - close);
      else if (cur.match(/<\/?$/)) {
        stream.backUp(cur.length);
        if (!stream.match(pat, false)) stream.match(cur);
      }
      return style;
    }

    function script(stream, state) {
      if (stream.match(/^<\/\s*script\s*>/i, false)) {
        state.token = html;
        state.localState = state.localMode = null;
        return null;
      }
      return maybeBackup(stream, /<\/\s*script\s*>/,
        state.localMode.token(stream, state.localState));
    }

    function css(stream, state) {
      if (stream.match(/^<\/\s*style\s*>/i, false)) {
        state.token = html;
        state.localState = state.localMode = null;
        return null;
      }
      return maybeBackup(stream, /<\/\s*style\s*>/,
        cssMode.token(stream, state.localState));
    }
    return {
      startState: function() {
        var state = htmlMode.startState();
        return {
          token: html,
          localMode: null,
          localState: null,
          htmlState: state
        };
      },
      copyState: function(state) {
        if (state.localState)
          var local = CodeMirror.copyState(state.localMode, state.localState);
        return {
          token: state.token,
          localMode: state.localMode,
          localState: local,
          htmlState: CodeMirror.copyState(htmlMode, state.htmlState)
        };
      },
      token: function(stream, state) {
        return state.token(stream, state);
      },
      indent: function(state, textAfter) {
        if (!state.localMode || /^\s*<\//.test(textAfter))
          return htmlMode.indent(state.htmlState, textAfter);
        else if (state.localMode.indent)
          return state.localMode.indent(state.localState, textAfter);
        else
          return CodeMirror.Pass;
      },
      innerMode: function(state) {
        return {
          state: state.localState || state.htmlState,
          mode: state.localMode || htmlMode
        };
      }
    };
  }, "xml", "javascript", "css");
  CodeMirror.defineMIME("text/html", "htmlmixed");
});;
/*! RESOURCE: /scripts/snc-code-editor/codemirror/mode/javascript/javascript.js */
(function(mod) {
  if (typeof exports == "object" && typeof module == "object")
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd)
    define(["../../lib/codemirror"], mod);
  else
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";
  CodeMirror.defineMode("javascript", function(config, parserConfig) {
    var indentUnit = config.indentUnit;
    var statementIndent = parserConfig.statementIndent;
    var jsonldMode = parserConfig.jsonld;
    var jsonMode = parserConfig.json || jsonldMode;
    var isTS = parserConfig.typescript;
    var wordRE = parserConfig.wordCharacters || /[\w$\xa1-\uffff]/;
    var keywords = function() {
      function kw(type) {
        return {
          type: type,
          style: "keyword"
        };
      }
      var A = kw("keyword a"),
        B = kw("keyword b"),
        C = kw("keyword c");
      var operator = kw("operator"),
        atom = {
          type: "atom",
          style: "atom"
        };
      var jsKeywords = {
        "if": kw("if"),
        "while": A,
        "with": A,
        "else": B,
        "do": B,
        "try": B,
        "finally": B,
        "return": C,
        "break": C,
        "continue": C,
        "new": C,
        "delete": C,
        "throw": C,
        "debugger": C,
        "var": kw("var"),
        "const": kw("var"),
        "let": kw("var"),
        "function": kw("function"),
        "catch": kw("catch"),
        "for": kw("for"),
        "switch": kw("switch"),
        "case": kw("case"),
        "default": kw("default"),
        "in": operator,
        "typeof": operator,
        "instanceof": operator,
        "true": atom,
        "false": atom,
        "null": atom,
        "undefined": atom,
        "NaN": atom,
        "Infinity": atom,
        "this": kw("this"),
        "module": kw("module"),
        "class": kw("class"),
        "super": kw("atom"),
        "yield": C,
        "export": kw("export"),
        "import": kw("import"),
        "extends": C
      };
      if (isTS) {
        var type = {
          type: "variable",
          style: "variable-3"
        };
        var tsKeywords = {
          "interface": kw("interface"),
          "extends": kw("extends"),
          "constructor": kw("constructor"),
          "public": kw("public"),
          "private": kw("private"),
          "protected": kw("protected"),
          "static": kw("static"),
          "string": type,
          "number": type,
          "bool": type,
          "any": type
        };
        for (var attr in tsKeywords) {
          jsKeywords[attr] = tsKeywords[attr];
        }
      }
      return jsKeywords;
    }();
    var isOperatorChar = /[+\-*&%=<>!?|~^]/;
    var isJsonldKeyword = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/;

    function readRegexp(stream) {
      var escaped = false,
        next, inSet = false;
      while ((next = stream.next()) != null) {
        if (!escaped) {
          if (next == "/" && !inSet) return;
          if (next == "[") inSet = true;
          else if (inSet && next == "]") inSet = false;
        }
        escaped = !escaped && next == "\\";
      }
    }
    var type, content;

    function ret(tp, style, cont) {
      type = tp;
      content = cont;
      return style;
    }

    function tokenBase(stream, state) {
      var ch = stream.next();
      if (ch == '"' || ch == "'") {
        state.tokenize = tokenString(ch);
        return state.tokenize(stream, state);
      } else if (ch == "." && stream.match(/^\d+(?:[eE][+\-]?\d+)?/)) {
        return ret("number", "number");
      } else if (ch == "." && stream.match("..")) {
        return ret("spread", "meta");
      } else if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
        return ret(ch);
      } else if (ch == "=" && stream.eat(">")) {
        return ret("=>", "operator");
      } else if (ch == "0" && stream.eat(/x/i)) {
        stream.eatWhile(/[\da-f]/i);
        return ret("number", "number");
      } else if (/\d/.test(ch)) {
        stream.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/);
        return ret("number", "number");
      } else if (ch == "/") {
        if (stream.eat("*")) {
          state.tokenize = tokenComment;
          return tokenComment(stream, state);
        } else if (stream.eat("/")) {
          stream.skipToEnd();
          return ret("comment", "comment");
        } else if (state.lastType == "operator" || state.lastType == "keyword c" ||
          state.lastType == "sof" || /^[\[{}\(,;:]$/.test(state.lastType)) {
          readRegexp(stream);
          stream.match(/^\b(([gimyu])(?![gimyu]*\2))+\b/);
          return ret("regexp", "string-2");
        } else {
          stream.eatWhile(isOperatorChar);
          return ret("operator", "operator", stream.current());
        }
      } else if (ch == "`") {
        state.tokenize = tokenQuasi;
        return tokenQuasi(stream, state);
      } else if (ch == "#") {
        stream.skipToEnd();
        return ret("error", "error");
      } else if (isOperatorChar.test(ch)) {
        stream.eatWhile(isOperatorChar);
        return ret("operator", "operator", stream.current());
      } else if (wordRE.test(ch)) {
        stream.eatWhile(wordRE);
        var word = stream.current(),
          known = keywords.propertyIsEnumerable(word) && keywords[word];
        return (known && state.lastType != ".") ? ret(known.type, known.style, word) :
          ret("variable", "variable", word);
      }
    }

    function tokenString(quote) {
      return function(stream, state) {
        var escaped = false,
          next;
        if (jsonldMode && stream.peek() == "@" && stream.match(isJsonldKeyword)) {
          state.tokenize = tokenBase;
          return ret("jsonld-keyword", "meta");
        }
        while ((next = stream.next()) != null) {
          if (next == quote && !escaped) break;
          escaped = !escaped && next == "\\";
        }
        if (!escaped) state.tokenize = tokenBase;
        return ret("string", "string");
      };
    }

    function tokenComment(stream, state) {
      var maybeEnd = false,
        ch;
      while (ch = stream.next()) {
        if (ch == "/" && maybeEnd) {
          state.tokenize = tokenBase;
          break;
        }
        maybeEnd = (ch == "*");
      }
      return ret("comment", "comment");
    }

    function tokenQuasi(stream, state) {
      var escaped = false,
        next;
      while ((next = stream.next()) != null) {
        if (!escaped && (next == "`" || next == "$" && stream.eat("{"))) {
          state.tokenize = tokenBase;
          break;
        }
        escaped = !escaped && next == "\\";
      }
      return ret("quasi", "string-2", stream.current());
    }
    var brackets = "([{}])";

    function findFatArrow(stream, state) {
      if (state.fatArrowAt) state.fatArrowAt = null;
      var arrow = stream.string.indexOf("=>", stream.start);
      if (arrow < 0) return;
      var depth = 0,
        sawSomething = false;
      for (var pos = arrow - 1; pos >= 0; --pos) {
        var ch = stream.string.charAt(pos);
        var bracket = brackets.indexOf(ch);
        if (bracket >= 0 && bracket < 3) {
          if (!depth) {
            ++pos;
            break;
          }
          if (--depth == 0) break;
        } else if (bracket >= 3 && bracket < 6) {
          ++depth;
        } else if (wordRE.test(ch)) {
          sawSomething = true;
        } else if (/["'\/]/.test(ch)) {
          return;
        } else if (sawSomething && !depth) {
          ++pos;
          break;
        }
      }
      if (sawSomething && !depth) state.fatArrowAt = pos;
    }
    var atomicTypes = {
      "atom": true,
      "number": true,
      "variable": true,
      "string": true,
      "regexp": true,
      "this": true,
      "jsonld-keyword": true
    };

    function JSLexical(indented, column, type, align, prev, info) {
      this.indented = indented;
      this.column = column;
      this.type = type;
      this.prev = prev;
      this.info = info;
      if (align != null) this.align = align;
    }

    function inScope(state, varname) {
      for (var v = state.localVars; v; v = v.next)
        if (v.name == varname) return true;
      for (var cx = state.context; cx; cx = cx.prev) {
        for (var v = cx.vars; v; v = v.next)
          if (v.name == varname) return true;
      }
    }

    function parseJS(state, style, type, content, stream) {
      var cc = state.cc;
      cx.state = state;
      cx.stream = stream;
      cx.marked = null, cx.cc = cc;
      cx.style = style;
      if (!state.lexical.hasOwnProperty("align"))
        state.lexical.align = true;
      while (true) {
        var combinator = cc.length ? cc.pop() : jsonMode ? expression : statement;
        if (combinator(type, content)) {
          while (cc.length && cc[cc.length - 1].lex)
            cc.pop()();
          if (cx.marked) return cx.marked;
          if (type == "variable" && inScope(state, content)) return "variable-2";
          return style;
        }
      }
    }
    var cx = {
      state: null,
      column: null,
      marked: null,
      cc: null
    };

    function pass() {
      for (var i = arguments.length - 1; i >= 0; i--) cx.cc.push(arguments[i]);
    }

    function cont() {
      pass.apply(null, arguments);
      return true;
    }

    function register(varname) {
      function inList(list) {
        for (var v = list; v; v = v.next)
          if (v.name == varname) return true;
        return false;
      }
      var state = cx.state;
      if (state.context) {
        cx.marked = "def";
        if (inList(state.localVars)) return;
        state.localVars = {
          name: varname,
          next: state.localVars
        };
      } else {
        if (inList(state.globalVars)) return;
        if (parserConfig.globalVars)
          state.globalVars = {
            name: varname,
            next: state.globalVars
          };
      }
    }
    var defaultVars = {
      name: "this",
      next: {
        name: "arguments"
      }
    };

    function pushcontext() {
      cx.state.context = {
        prev: cx.state.context,
        vars: cx.state.localVars
      };
      cx.state.localVars = defaultVars;
    }

    function popcontext() {
      cx.state.localVars = cx.state.context.vars;
      cx.state.context = cx.state.context.prev;
    }

    function pushlex(type, info) {
      var result = function() {
        var state = cx.state,
          indent = state.indented;
        if (state.lexical.type == "stat") indent = state.lexical.indented;
        else
          for (var outer = state.lexical; outer && outer.type == ")" && outer.align; outer = outer.prev)
            indent = outer.indented;
        state.lexical = new JSLexical(indent, cx.stream.column(), type, null, state.lexical, info);
      };
      result.lex = true;
      return result;
    }

    function poplex() {
      var state = cx.state;
      if (state.lexical.prev) {
        if (state.lexical.type == ")")
          state.indented = state.lexical.indented;
        state.lexical = state.lexical.prev;
      }
    }
    poplex.lex = true;

    function expect(wanted) {
      function exp(type) {
        if (type == wanted) return cont();
        else if (wanted == ";") return pass();
        else return cont(exp);
      };
      return exp;
    }

    function statement(type, value) {
      if (type == "var") return cont(pushlex("vardef", value.length), vardef, expect(";"), poplex);
      if (type == "keyword a") return cont(pushlex("form"), expression, statement, poplex);
      if (type == "keyword b") return cont(pushlex("form"), statement, poplex);
      if (type == "{") return cont(pushlex("}"), block, poplex);
      if (type == ";") return cont();
      if (type == "if") {
        if (cx.state.lexical.info == "else" && cx.state.cc[cx.state.cc.length - 1] == poplex)
          cx.state.cc.pop()();
        return cont(pushlex("form"), expression, statement, poplex, maybeelse);
      }
      if (type == "function") return cont(functiondef);
      if (type == "for") return cont(pushlex("form"), forspec, statement, poplex);
      if (type == "variable") return cont(pushlex("stat"), maybelabel);
      if (type == "switch") return cont(pushlex("form"), expression, pushlex("}", "switch"), expect("{"),
        block, poplex, poplex);
      if (type == "case") return cont(expression, expect(":"));
      if (type == "default") return cont(expect(":"));
      if (type == "catch") return cont(pushlex("form"), pushcontext, expect("("), funarg, expect(")"),
        statement, poplex, popcontext);
      if (type == "module") return cont(pushlex("form"), pushcontext, afterModule, popcontext, poplex);
      if (type == "class") return cont(pushlex("form"), className, poplex);
      if (type == "export") return cont(pushlex("form"), afterExport, poplex);
      if (type == "import") return cont(pushlex("form"), afterImport, poplex);
      return pass(pushlex("stat"), expression, expect(";"), poplex);
    }

    function expression(type) {
      return expressionInner(type, false);
    }

    function expressionNoComma(type) {
      return expressionInner(type, true);
    }

    function expressionInner(type, noComma) {
      if (cx.state.fatArrowAt == cx.stream.start) {
        var body = noComma ? arrowBodyNoComma : arrowBody;
        if (type == "(") return cont(pushcontext, pushlex(")"), commasep(pattern, ")"), poplex, expect("=>"), body, popcontext);
        else if (type == "variable") return pass(pushcontext, pattern, expect("=>"), body, popcontext);
      }
      var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
      if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
      if (type == "function") return cont(functiondef, maybeop);
      if (type == "keyword c") return cont(noComma ? maybeexpressionNoComma : maybeexpression);
      if (type == "(") return cont(pushlex(")"), maybeexpression, comprehension, expect(")"), poplex, maybeop);
      if (type == "operator" || type == "spread") return cont(noComma ? expressionNoComma : expression);
      if (type == "[") return cont(pushlex("]"), arrayLiteral, poplex, maybeop);
      if (type == "{") return contCommasep(objprop, "}", null, maybeop);
      if (type == "quasi") {
        return pass(quasi, maybeop);
      }
      return cont();
    }

    function maybeexpression(type) {
      if (type.match(/[;\}\)\],]/)) return pass();
      return pass(expression);
    }

    function maybeexpressionNoComma(type) {
      if (type.match(/[;\}\)\],]/)) return pass();
      return pass(expressionNoComma);
    }

    function maybeoperatorComma(type, value) {
      if (type == ",") return cont(expression);
      return maybeoperatorNoComma(type, value, false);
    }

    function maybeoperatorNoComma(type, value, noComma) {
      var me = noComma == false ? maybeoperatorComma : maybeoperatorNoComma;
      var expr = noComma == false ? expression : expressionNoComma;
      if (type == "=>") return cont(pushcontext, noComma ? arrowBodyNoComma : arrowBody, popcontext);
      if (type == "operator") {
        if (/\+\+|--/.test(value)) return cont(me);
        if (value == "?") return cont(expression, expect(":"), expr);
        return cont(expr);
      }
      if (type == "quasi") {
        return pass(quasi, me);
      }
      if (type == ";") return;
      if (type == "(") return contCommasep(expressionNoComma, ")", "call", me);
      if (type == ".") return cont(property, me);
      if (type == "[") return cont(pushlex("]"), maybeexpression, expect("]"), poplex, me);
    }

    function quasi(type, value) {
      if (type != "quasi") return pass();
      if (value.slice(value.length - 2) != "${") return cont(quasi);
      return cont(expression, continueQuasi);
    }

    function continueQuasi(type) {
      if (type == "}") {
        cx.marked = "string-2";
        cx.state.tokenize = tokenQuasi;
        return cont(quasi);
      }
    }

    function arrowBody(type) {
      findFatArrow(cx.stream, cx.state);
      return pass(type == "{" ? statement : expression);
    }

    function arrowBodyNoComma(type) {
      findFatArrow(cx.stream, cx.state);
      return pass(type == "{" ? statement : expressionNoComma);
    }

    function maybelabel(type) {
      if (type == ":") return cont(poplex, statement);
      return pass(maybeoperatorComma, expect(";"), poplex);
    }

    function property(type) {
      if (type == "variable") {
        cx.marked = "property";
        return cont();
      }
    }

    function objprop(type, value) {
      if (type == "variable" || cx.style == "keyword") {
        cx.marked = "property";
        if (value == "get" || value == "set") return cont(getterSetter);
        return cont(afterprop);
      } else if (type == "number" || type == "string") {
        cx.marked = jsonldMode ? "property" : (cx.style + " property");
        return cont(afterprop);
      } else if (type == "jsonld-keyword") {
        return cont(afterprop);
      } else if (type == "[") {
        return cont(expression, expect("]"), afterprop);
      }
    }

    function getterSetter(type) {
      if (type != "variable") return pass(afterprop);
      cx.marked = "property";
      return cont(functiondef);
    }

    function afterprop(type) {
      if (type == ":") return cont(expressionNoComma);
      if (type == "(") return pass(functiondef);
    }

    function commasep(what, end) {
      function proceed(type) {
        if (type == ",") {
          var lex = cx.state.lexical;
          if (lex.info == "call") lex.pos = (lex.pos || 0) + 1;
          return cont(what, proceed);
        }
        if (type == end) return cont();
        return cont(expect(end));
      }
      return function(type) {
        if (type == end) return cont();
        return pass(what, proceed);
      };
    }

    function contCommasep(what, end, info) {
      for (var i = 3; i < arguments.length; i++)
        cx.cc.push(arguments[i]);
      return cont(pushlex(end, info), commasep(what, end), poplex);
    }

    function block(type) {
      if (type == "}") return cont();
      return pass(statement, block);
    }

    function maybetype(type) {
      if (isTS && type == ":") return cont(typedef);
    }

    function maybedefault(_, value) {
      if (value == "=") return cont(expressionNoComma);
    }

    function typedef(type) {
      if (type == "variable") {
        cx.marked = "variable-3";
        return cont();
      }
    }

    function vardef() {
      return pass(pattern, maybetype, maybeAssign, vardefCont);
    }

    function pattern(type, value) {
      if (type == "variable") {
        register(value);
        return cont();
      }
      if (type == "[") return contCommasep(pattern, "]");
      if (type == "{") return contCommasep(proppattern, "}");
    }

    function proppattern(type, value) {
      if (type == "variable" && !cx.stream.match(/^\s*:/, false)) {
        register(value);
        return cont(maybeAssign);
      }
      if (type == "variable") cx.marked = "property";
      return cont(expect(":"), pattern, maybeAssign);
    }

    function maybeAssign(_type, value) {
      if (value == "=") return cont(expressionNoComma);
    }

    function vardefCont(type) {
      if (type == ",") return cont(vardef);
    }

    function maybeelse(type, value) {
      if (type == "keyword b" && value == "else") return cont(pushlex("form", "else"), statement, poplex);
    }

    function forspec(type) {
      if (type == "(") return cont(pushlex(")"), forspec1, expect(")"), poplex);
    }

    function forspec1(type) {
      if (type == "var") return cont(vardef, expect(";"), forspec2);
      if (type == ";") return cont(forspec2);
      if (type == "variable") return cont(formaybeinof);
      return pass(expression, expect(";"), forspec2);
    }

    function formaybeinof(_type, value) {
      if (value == "in" || value == "of") {
        cx.marked = "keyword";
        return cont(expression);
      }
      return cont(maybeoperatorComma, forspec2);
    }

    function forspec2(type, value) {
      if (type == ";") return cont(forspec3);
      if (value == "in" || value == "of") {
        cx.marked = "keyword";
        return cont(expression);
      }
      return pass(expression, expect(";"), forspec3);
    }

    function forspec3(type) {
      if (type != ")") cont(expression);
    }

    function functiondef(type, value) {
      if (value == "*") {
        cx.marked = "keyword";
        return cont(functiondef);
      }
      if (type == "variable") {
        register(value);
        return cont(functiondef);
      }
      if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, statement, popcontext);
    }

    function funarg(type) {
      if (type == "spread") return cont(funarg);
      return pass(pattern, maybetype, maybedefault);
    }

    function className(type, value) {
      if (type == "variable") {
        register(value);
        return cont(classNameAfter);
      }
    }

    function classNameAfter(type, value) {
      if (value == "extends") return cont(expression, classNameAfter);
      if (type == "{") return cont(pushlex("}"), classBody, poplex);
    }

    function classBody(type, value) {
      if (type == "variable" || cx.style == "keyword") {
        if (value == "static") {
          cx.marked = "keyword";
          return cont(classBody);
        }
        cx.marked = "property";
        if (value == "get" || value == "set") return cont(classGetterSetter, functiondef, classBody);
        return cont(functiondef, classBody);
      }
      if (value == "*") {
        cx.marked = "keyword";
        return cont(classBody);
      }
      if (type == ";") return cont(classBody);
      if (type == "}") return cont();
    }

    function classGetterSetter(type) {
      if (type != "variable") return pass();
      cx.marked = "property";
      return cont();
    }

    function afterModule(type, value) {
      if (type == "string") return cont(statement);
      if (type == "variable") {
        register(value);
        return cont(maybeFrom);
      }
    }

    function afterExport(_type, value) {
      if (value == "*") {
        cx.marked = "keyword";
        return cont(maybeFrom, expect(";"));
      }
      if (value == "default") {
        cx.marked = "keyword";
        return cont(expression, expect(";"));
      }
      return pass(statement);
    }

    function afterImport(type) {
      if (type == "string") return cont();
      return pass(importSpec, maybeFrom);
    }

    function importSpec(type, value) {
      if (type == "{") return contCommasep(importSpec, "}");
      if (type == "variable") register(value);
      if (value == "*") cx.marked = "keyword";
      return cont(maybeAs);
    }

    function maybeAs(_type, value) {
      if (value == "as") {
        cx.marked = "keyword";
        return cont(importSpec);
      }
    }

    function maybeFrom(_type, value) {
      if (value == "from") {
        cx.marked = "keyword";
        return cont(expression);
      }
    }

    function arrayLiteral(type) {
      if (type == "]") return cont();
      return pass(expressionNoComma, maybeArrayComprehension);
    }

    function maybeArrayComprehension(type) {
      if (type == "for") return pass(comprehension, expect("]"));
      if (type == ",") return cont(commasep(maybeexpressionNoComma, "]"));
      return pass(commasep(expressionNoComma, "]"));
    }

    function comprehension(type) {
      if (type == "for") return cont(forspec, comprehension);
      if (type == "if") return cont(expression, comprehension);
    }

    function isContinuedStatement(state, textAfter) {
      return state.lastType == "operator" || state.lastType == "," ||
        isOperatorChar.test(textAfter.charAt(0)) ||
        /[,.]/.test(textAfter.charAt(0));
    }
    return {
      startState: function(basecolumn) {
        var state = {
          tokenize: tokenBase,
          lastType: "sof",
          cc: [],
          lexical: new JSLexical((basecolumn || 0) - indentUnit, 0, "block", false),
          localVars: parserConfig.localVars,
          context: parserConfig.localVars && {
            vars: parserConfig.localVars
          },
          indented: 0
        };
        if (parserConfig.globalVars && typeof parserConfig.globalVars == "object")
          state.globalVars = parserConfig.globalVars;
        return state;
      },
      token: function(stream, state) {
        if (stream.sol()) {
          if (!state.lexical.hasOwnProperty("align"))
            state.lexical.align = false;
          state.indented = stream.indentation();
          findFatArrow(stream, state);
        }
        if (state.tokenize != tokenComment && stream.eatSpace()) return null;
        var style = state.tokenize(stream, state);
        if (type == "comment") return style;
        state.lastType = type == "operator" && (content == "++" || content == "--") ? "incdec" : type;
        return parseJS(state, style, type, content, stream);
      },
      indent: function(state, textAfter) {
        if (state.tokenize == tokenComment) return CodeMirror.Pass;
        if (state.tokenize != tokenBase) return 0;
        var firstChar = textAfter && textAfter.charAt(0),
          lexical = state.lexical;
        if (!/^\s*else\b/.test(textAfter))
          for (var i = state.cc.length - 1; i >= 0; --i) {
            var c = state.cc[i];
            if (c == poplex) lexical = lexical.prev;
            else if (c != maybeelse) break;
          }
        if (lexical.type == "stat" && firstChar == "}") lexical = lexical.prev;
        if (statementIndent && lexical.type == ")" && lexical.prev.type == "stat")
          lexical = lexical.prev;
        var type = lexical.type,
          closing = firstChar == type;
        if (type == "vardef") return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? lexical.info + 1 : 0);
        else if (type == "form" && firstChar == "{") return lexical.indented;
        else if (type == "form") return lexical.indented + indentUnit;
        else if (type == "stat")
          return lexical.indented + (isContinuedStatement(state, textAfter) ? statementIndent || indentUnit : 0);
        else if (lexical.info == "switch" && !closing && parserConfig.doubleIndentSwitch != false)
          return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? indentUnit : 2 * indentUnit);
        else if (lexical.align) return lexical.column + (closing ? 0 : 1);
        else return lexical.indented + (closing ? 0 : indentUnit);
      },
      electricInput: /^\s*(?:case .*?:|default:|\{|\})$/,
      blockCommentStart: jsonMode ? null : "/*",
      blockCommentEnd: jsonMode ? null : "*/",
      lineComment: jsonMode ? null : "//",
      fold: "brace",
      closeBrackets: "()[]{}''\"\"``",
      helperType: jsonMode ? "json" : "javascript",
      jsonldMode: jsonldMode,
      jsonMode: jsonMode
    };
  });
  CodeMirror.registerHelper("wordChars", "javascript", /[\w$]/);
  CodeMirror.defineMIME("text/javascript", "javascript");
  CodeMirror.defineMIME("text/ecmascript", "javascript");
  CodeMirror.defineMIME("application/javascript", "javascript");
  CodeMirror.defineMIME("application/x-javascript", "javascript");
  CodeMirror.defineMIME("application/ecmascript", "javascript");
  CodeMirror.defineMIME("application/json", {
    name: "javascript",
    json: true
  });
  CodeMirror.defineMIME("application/x-json", {
    name: "javascript",
    json: true
  });
  CodeMirror.defineMIME("application/ld+json", {
    name: "javascript",
    jsonld: true
  });
  CodeMirror.defineMIME("text/typescript", {
    name: "javascript",
    typescript: true
  });
  CodeMirror.defineMIME("application/typescript", {
    name: "javascript",
    typescript: true
  });
});;
/*! RESOURCE: /scripts/snc-code-editor/codemirror/mode/properties/properties.js */
(function(mod) {
  if (typeof exports == "object" && typeof module == "object")
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd)
    define(["../../lib/codemirror"], mod);
  else
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";
  CodeMirror.defineMode("properties", function() {
    return {
      token: function(stream, state) {
        var sol = stream.sol() || state.afterSection;
        var eol = stream.eol();
        state.afterSection = false;
        if (sol) {
          if (state.nextMultiline) {
            state.inMultiline = true;
            state.nextMultiline = false;
          } else {
            state.position = "def";
          }
        }
        if (eol && !state.nextMultiline) {
          state.inMultiline = false;
          state.position = "def";
        }
        if (sol) {
          while (stream.eatSpace());
        }
        var ch = stream.next();
        if (sol && (ch === "#" || ch === "!" || ch === ";")) {
          state.position = "comment";
          stream.skipToEnd();
          return "comment";
        } else if (sol && ch === "[") {
          state.afterSection = true;
          stream.skipTo("]");
          stream.eat("]");
          return "header";
        } else if (ch === "=" || ch === ":") {
          state.position = "quote";
          return null;
        } else if (ch === "\\" && state.position === "quote") {
          if (stream.eol()) {
            state.nextMultiline = true;
          }
        }
        return state.position;
      },
      startState: function() {
        return {
          position: "def",
          nextMultiline: false,
          inMultiline: false,
          afterSection: false
        };
      }
    };
  });
  CodeMirror.defineMIME("text/x-properties", "properties");
  CodeMirror.defineMIME("text/x-ini", "properties");
});;
/*! RESOURCE: /scripts/codemirror_tern/js_includes_codemirror.js */
/*! RESOURCE: /scripts/codemirror_tern/acorn.js */
(function(f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f()
  } else if (typeof define === "function" && define.amd) {
    define([], f)
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window
    } else if (typeof global !== "undefined") {
      g = global
    } else if (typeof self !== "undefined") {
      g = self
    } else {
      g = this
    }
    g.acorn = f()
  }
})(function() {
  var define, module, exports;
  return (function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;
          if (!u && a) return a(o, !0);
          if (i) return i(o, !0);
          var f = new Error("Cannot find module '" + o + "'");
          throw f.code = "MODULE_NOT_FOUND", f
        }
        var l = n[o] = {
          exports: {}
        };
        t[o][0].call(l.exports, function(e) {
          var n = t[o][1][e];
          return s(n ? n : e)
        }, l, l.exports, e, t, n, r)
      }
      return n[o].exports
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s
  })({
    1: [function(_dereq_, module, exports) {
      "use strict";
      exports.parse = parse;
      exports.parseExpressionAt = parseExpressionAt;
      exports.tokenizer = tokenizer;
      exports.__esModule = true;
      var _state = _dereq_("./state");
      var Parser = _state.Parser;
      var _options = _dereq_("./options");
      var getOptions = _options.getOptions;
      _dereq_("./parseutil");
      _dereq_("./statement");
      _dereq_("./lval");
      _dereq_("./expression");
      exports.Parser = _state.Parser;
      exports.plugins = _state.plugins;
      exports.defaultOptions = _options.defaultOptions;
      var _location = _dereq_("./location");
      exports.SourceLocation = _location.SourceLocation;
      exports.getLineInfo = _location.getLineInfo;
      exports.Node = _dereq_("./node").Node;
      var _tokentype = _dereq_("./tokentype");
      exports.TokenType = _tokentype.TokenType;
      exports.tokTypes = _tokentype.types;
      var _tokencontext = _dereq_("./tokencontext");
      exports.TokContext = _tokencontext.TokContext;
      exports.tokContexts = _tokencontext.types;
      var _identifier = _dereq_("./identifier");
      exports.isIdentifierChar = _identifier.isIdentifierChar;
      exports.isIdentifierStart = _identifier.isIdentifierStart;
      exports.Token = _dereq_("./tokenize").Token;
      var _whitespace = _dereq_("./whitespace");
      exports.isNewLine = _whitespace.isNewLine;
      exports.lineBreak = _whitespace.lineBreak;
      exports.lineBreakG = _whitespace.lineBreakG;
      var version = "1.1.0";
      exports.version = version;

      function parse(input, options) {
        var p = parser(options, input);
        var startPos = p.pos,
          startLoc = p.options.locations && p.curPosition();
        p.nextToken();
        return p.parseTopLevel(p.options.program || p.startNodeAt(startPos, startLoc));
      }

      function parseExpressionAt(input, pos, options) {
        var p = parser(options, input, pos);
        p.nextToken();
        return p.parseExpression();
      }

      function tokenizer(input, options) {
        return parser(options, input);
      }

      function parser(options, input) {
        return new Parser(getOptions(options), String(input));
      }
    }, {
      "./expression": 2,
      "./identifier": 3,
      "./location": 4,
      "./lval": 5,
      "./node": 6,
      "./options": 7,
      "./parseutil": 8,
      "./state": 9,
      "./statement": 10,
      "./tokencontext": 11,
      "./tokenize": 12,
      "./tokentype": 13,
      "./whitespace": 15
    }],
    2: [function(_dereq_, module, exports) {
      "use strict";
      var tt = _dereq_("./tokentype").types;
      var Parser = _dereq_("./state").Parser;
      var reservedWords = _dereq_("./identifier").reservedWords;
      var has = _dereq_("./util").has;
      var pp = Parser.prototype;
      pp.checkPropClash = function(prop, propHash) {
        if (this.options.ecmaVersion >= 6) return;
        var key = prop.key,
          name = undefined;
        switch (key.type) {
          case "Identifier":
            name = key.name;
            break;
          case "Literal":
            name = String(key.value);
            break;
          default:
            return;
        }
        var kind = prop.kind || "init",
          other = undefined;
        if (has(propHash, name)) {
          other = propHash[name];
          var isGetSet = kind !== "init";
          if ((this.strict || isGetSet) && other[kind] || !(isGetSet ^ other.init)) this.raise(key.start, "Redefinition of property");
        } else {
          other = propHash[name] = {
            init: false,
            get: false,
            set: false
          };
        }
        other[kind] = true;
      };
      pp.parseExpression = function(noIn, refShorthandDefaultPos) {
        var startPos = this.start,
          startLoc = this.startLoc;
        var expr = this.parseMaybeAssign(noIn, refShorthandDefaultPos);
        if (this.type === tt.comma) {
          var node = this.startNodeAt(startPos, startLoc);
          node.expressions = [expr];
          while (this.eat(tt.comma)) node.expressions.push(this.parseMaybeAssign(noIn, refShorthandDefaultPos));
          return this.finishNode(node, "SequenceExpression");
        }
        return expr;
      };
      pp.parseMaybeAssign = function(noIn, refShorthandDefaultPos, afterLeftParse) {
        if (this.type == tt._yield && this.inGenerator) return this.parseYield();
        var failOnShorthandAssign = undefined;
        if (!refShorthandDefaultPos) {
          refShorthandDefaultPos = {
            start: 0
          };
          failOnShorthandAssign = true;
        } else {
          failOnShorthandAssign = false;
        }
        var startPos = this.start,
          startLoc = this.startLoc;
        if (this.type == tt.parenL || this.type == tt.name) this.potentialArrowAt = this.start;
        var left = this.parseMaybeConditional(noIn, refShorthandDefaultPos);
        if (afterLeftParse) left = afterLeftParse.call(this, left, startPos, startLoc);
        if (this.type.isAssign) {
          var node = this.startNodeAt(startPos, startLoc);
          node.operator = this.value;
          node.left = this.type === tt.eq ? this.toAssignable(left) : left;
          refShorthandDefaultPos.start = 0;
          this.checkLVal(left);
          this.next();
          node.right = this.parseMaybeAssign(noIn);
          return this.finishNode(node, "AssignmentExpression");
        } else if (failOnShorthandAssign && refShorthandDefaultPos.start) {
          this.unexpected(refShorthandDefaultPos.start);
        }
        return left;
      };
      pp.parseMaybeConditional = function(noIn, refShorthandDefaultPos) {
        var startPos = this.start,
          startLoc = this.startLoc;
        var expr = this.parseExprOps(noIn, refShorthandDefaultPos);
        if (refShorthandDefaultPos && refShorthandDefaultPos.start) return expr;
        if (this.eat(tt.question)) {
          var node = this.startNodeAt(startPos, startLoc);
          node.test = expr;
          node.consequent = this.parseMaybeAssign();
          this.expect(tt.colon);
          node.alternate = this.parseMaybeAssign(noIn);
          return this.finishNode(node, "ConditionalExpression");
        }
        return expr;
      };
      pp.parseExprOps = function(noIn, refShorthandDefaultPos) {
        var startPos = this.start,
          startLoc = this.startLoc;
        var expr = this.parseMaybeUnary(refShorthandDefaultPos);
        if (refShorthandDefaultPos && refShorthandDefaultPos.start) return expr;
        return this.parseExprOp(expr, startPos, startLoc, -1, noIn);
      };
      pp.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, noIn) {
        var prec = this.type.binop;
        if (prec != null && (!noIn || this.type !== tt._in)) {
          if (prec > minPrec) {
            var node = this.startNodeAt(leftStartPos, leftStartLoc);
            node.left = left;
            node.operator = this.value;
            var op = this.type;
            this.next();
            var startPos = this.start,
              startLoc = this.startLoc;
            node.right = this.parseExprOp(this.parseMaybeUnary(), startPos, startLoc, prec, noIn);
            this.finishNode(node, op === tt.logicalOR || op === tt.logicalAND ? "LogicalExpression" : "BinaryExpression");
            return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, noIn);
          }
        }
        return left;
      };
      pp.parseMaybeUnary = function(refShorthandDefaultPos) {
        if (this.type.prefix) {
          var node = this.startNode(),
            update = this.type === tt.incDec;
          node.operator = this.value;
          node.prefix = true;
          this.next();
          node.argument = this.parseMaybeUnary();
          if (refShorthandDefaultPos && refShorthandDefaultPos.start) this.unexpected(refShorthandDefaultPos.start);
          if (update) this.checkLVal(node.argument);
          else if (this.strict && node.operator === "delete" && node.argument.type === "Identifier") this.raise(node.start, "Deleting local variable in strict mode");
          return this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
        }
        var startPos = this.start,
          startLoc = this.startLoc;
        var expr = this.parseExprSubscripts(refShorthandDefaultPos);
        if (refShorthandDefaultPos && refShorthandDefaultPos.start) return expr;
        while (this.type.postfix && !this.canInsertSemicolon()) {
          var node = this.startNodeAt(startPos, startLoc);
          node.operator = this.value;
          node.prefix = false;
          node.argument = expr;
          this.checkLVal(expr);
          this.next();
          expr = this.finishNode(node, "UpdateExpression");
        }
        return expr;
      };
      pp.parseExprSubscripts = function(refShorthandDefaultPos) {
        var startPos = this.start,
          startLoc = this.startLoc;
        var expr = this.parseExprAtom(refShorthandDefaultPos);
        if (refShorthandDefaultPos && refShorthandDefaultPos.start) return expr;
        return this.parseSubscripts(expr, startPos, startLoc);
      };
      pp.parseSubscripts = function(base, startPos, startLoc, noCalls) {
        for (;;) {
          if (this.eat(tt.dot)) {
            var node = this.startNodeAt(startPos, startLoc);
            node.object = base;
            node.property = this.parseIdent(true);
            node.computed = false;
            base = this.finishNode(node, "MemberExpression");
          } else if (this.eat(tt.bracketL)) {
            var node = this.startNodeAt(startPos, startLoc);
            node.object = base;
            node.property = this.parseExpression();
            node.computed = true;
            this.expect(tt.bracketR);
            base = this.finishNode(node, "MemberExpression");
          } else if (!noCalls && this.eat(tt.parenL)) {
            var node = this.startNodeAt(startPos, startLoc);
            node.callee = base;
            node.arguments = this.parseExprList(tt.parenR, false);
            base = this.finishNode(node, "CallExpression");
          } else if (this.type === tt.backQuote) {
            var node = this.startNodeAt(startPos, startLoc);
            node.tag = base;
            node.quasi = this.parseTemplate();
            base = this.finishNode(node, "TaggedTemplateExpression");
          } else {
            return base;
          }
        }
      };
      pp.parseExprAtom = function(refShorthandDefaultPos) {
        var node = undefined,
          canBeArrow = this.potentialArrowAt == this.start;
        switch (this.type) {
          case tt._this:
          case tt._super:
            var type = this.type === tt._this ? "ThisExpression" : "Super";
            node = this.startNode();
            this.next();
            return this.finishNode(node, type);
          case tt._yield:
            if (this.inGenerator) this.unexpected();
          case tt.name:
            var startPos = this.start,
              startLoc = this.startLoc;
            var id = this.parseIdent(this.type !== tt.name);
            if (canBeArrow && !this.canInsertSemicolon() && this.eat(tt.arrow)) return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id]);
            return id;
          case tt.regexp:
            var value = this.value;
            node = this.parseLiteral(value.value);
            node.regex = {
              pattern: value.pattern,
              flags: value.flags
            };
            return node;
          case tt.num:
          case tt.string:
            return this.parseLiteral(this.value);
          case tt._null:
          case tt._true:
          case tt._false:
            node = this.startNode();
            node.value = this.type === tt._null ? null : this.type === tt._true;
            node.raw = this.type.keyword;
            this.next();
            return this.finishNode(node, "Literal");
          case tt.parenL:
            return this.parseParenAndDistinguishExpression(canBeArrow);
          case tt.bracketL:
            node = this.startNode();
            this.next();
            if (this.options.ecmaVersion >= 7 && this.type === tt._for) {
              return this.parseComprehension(node, false);
            }
            node.elements = this.parseExprList(tt.bracketR, true, true, refShorthandDefaultPos);
            return this.finishNode(node, "ArrayExpression");
          case tt.braceL:
            return this.parseObj(false, refShorthandDefaultPos);
          case tt._function:
            node = this.startNode();
            this.next();
            return this.parseFunction(node, false);
          case tt._class:
            return this.parseClass(this.startNode(), false);
          case tt._new:
            return this.parseNew();
          case tt.backQuote:
            return this.parseTemplate();
          default:
            this.unexpected();
        }
      };
      pp.parseLiteral = function(value) {
        var node = this.startNode();
        node.value = value;
        node.raw = this.input.slice(this.start, this.end);
        this.next();
        return this.finishNode(node, "Literal");
      };
      pp.parseParenExpression = function() {
        this.expect(tt.parenL);
        var val = this.parseExpression();
        this.expect(tt.parenR);
        return val;
      };
      pp.parseParenAndDistinguishExpression = function(canBeArrow) {
        var startPos = this.start,
          startLoc = this.startLoc,
          val = undefined;
        if (this.options.ecmaVersion >= 6) {
          this.next();
          if (this.options.ecmaVersion >= 7 && this.type === tt._for) {
            return this.parseComprehension(this.startNodeAt(startPos, startLoc), true);
          }
          var innerStartPos = this.start,
            innerStartLoc = this.startLoc;
          var exprList = [],
            first = true;
          var refShorthandDefaultPos = {
              start: 0
            },
            spreadStart = undefined,
            innerParenStart = undefined;
          while (this.type !== tt.parenR) {
            first ? first = false : this.expect(tt.comma);
            if (this.type === tt.ellipsis) {
              spreadStart = this.start;
              exprList.push(this.parseParenItem(this.parseRest()));
              break;
            } else {
              if (this.type === tt.parenL && !innerParenStart) {
                innerParenStart = this.start;
              }
              exprList.push(this.parseMaybeAssign(false, refShorthandDefaultPos, this.parseParenItem));
            }
          }
          var innerEndPos = this.start,
            innerEndLoc = this.startLoc;
          this.expect(tt.parenR);
          if (canBeArrow && !this.canInsertSemicolon() && this.eat(tt.arrow)) {
            if (innerParenStart) this.unexpected(innerParenStart);
            return this.parseParenArrowList(startPos, startLoc, exprList);
          }
          if (!exprList.length) this.unexpected(this.lastTokStart);
          if (spreadStart) this.unexpected(spreadStart);
          if (refShorthandDefaultPos.start) this.unexpected(refShorthandDefaultPos.start);
          if (exprList.length > 1) {
            val = this.startNodeAt(innerStartPos, innerStartLoc);
            val.expressions = exprList;
            this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
          } else {
            val = exprList[0];
          }
        } else {
          val = this.parseParenExpression();
        }
        if (this.options.preserveParens) {
          var par = this.startNodeAt(startPos, startLoc);
          par.expression = val;
          return this.finishNode(par, "ParenthesizedExpression");
        } else {
          return val;
        }
      };
      pp.parseParenItem = function(item) {
        return item;
      };
      pp.parseParenArrowList = function(startPos, startLoc, exprList) {
        return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList);
      };
      var empty = [];
      pp.parseNew = function() {
        var node = this.startNode();
        var meta = this.parseIdent(true);
        if (this.options.ecmaVersion >= 6 && this.eat(tt.dot)) {
          node.meta = meta;
          node.property = this.parseIdent(true);
          if (node.property.name !== "target") this.raise(node.property.start, "The only valid meta property for new is new.target");
          return this.finishNode(node, "MetaProperty");
        }
        var startPos = this.start,
          startLoc = this.startLoc;
        node.callee = this.parseSubscripts(this.parseExprAtom(), startPos, startLoc, true);
        if (this.eat(tt.parenL)) node.arguments = this.parseExprList(tt.parenR, false);
        else node.arguments = empty;
        return this.finishNode(node, "NewExpression");
      };
      pp.parseTemplateElement = function() {
        var elem = this.startNode();
        elem.value = {
          raw: this.input.slice(this.start, this.end),
          cooked: this.value
        };
        this.next();
        elem.tail = this.type === tt.backQuote;
        return this.finishNode(elem, "TemplateElement");
      };
      pp.parseTemplate = function() {
        var node = this.startNode();
        this.next();
        node.expressions = [];
        var curElt = this.parseTemplateElement();
        node.quasis = [curElt];
        while (!curElt.tail) {
          this.expect(tt.dollarBraceL);
          node.expressions.push(this.parseExpression());
          this.expect(tt.braceR);
          node.quasis.push(curElt = this.parseTemplateElement());
        }
        this.next();
        return this.finishNode(node, "TemplateLiteral");
      };
      pp.parseObj = function(isPattern, refShorthandDefaultPos) {
        var node = this.startNode(),
          first = true,
          propHash = {};
        node.properties = [];
        this.next();
        while (!this.eat(tt.braceR)) {
          if (!first) {
            this.expect(tt.comma);
            if (this.afterTrailingComma(tt.braceR)) break;
          } else first = false;
          var prop = this.startNode(),
            isGenerator = undefined,
            startPos = undefined,
            startLoc = undefined;
          if (this.options.ecmaVersion >= 6) {
            prop.method = false;
            prop.shorthand = false;
            if (isPattern || refShorthandDefaultPos) {
              startPos = this.start;
              startLoc = this.startLoc;
            }
            if (!isPattern) isGenerator = this.eat(tt.star);
          }
          this.parsePropertyName(prop);
          this.parsePropertyValue(prop, isPattern, isGenerator, startPos, startLoc, refShorthandDefaultPos);
          this.checkPropClash(prop, propHash);
          node.properties.push(this.finishNode(prop, "Property"));
        }
        return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression");
      };
      pp.parsePropertyValue = function(prop, isPattern, isGenerator, startPos, startLoc, refShorthandDefaultPos) {
        if (this.eat(tt.colon)) {
          prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refShorthandDefaultPos);
          prop.kind = "init";
        } else if (this.options.ecmaVersion >= 6 && this.type === tt.parenL) {
          if (isPattern) this.unexpected();
          prop.kind = "init";
          prop.method = true;
          prop.value = this.parseMethod(isGenerator);
        } else if (this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" && (prop.key.name === "get" || prop.key.name === "set") && (this.type != tt.comma && this.type != tt.braceR)) {
          if (isGenerator || isPattern) this.unexpected();
          prop.kind = prop.key.name;
          this.parsePropertyName(prop);
          prop.value = this.parseMethod(false);
        } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
          prop.kind = "init";
          if (isPattern) {
            if (this.isKeyword(prop.key.name) || this.strict && (reservedWords.strictBind(prop.key.name) || reservedWords.strict(prop.key.name)) || !this.options.allowReserved && this.isReservedWord(prop.key.name)) this.raise(prop.key.start, "Binding " + prop.key.name);
            prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
          } else if (this.type === tt.eq && refShorthandDefaultPos) {
            if (!refShorthandDefaultPos.start) refShorthandDefaultPos.start = this.start;
            prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
          } else {
            prop.value = prop.key;
          }
          prop.shorthand = true;
        } else this.unexpected();
      };
      pp.parsePropertyName = function(prop) {
        if (this.options.ecmaVersion >= 6) {
          if (this.eat(tt.bracketL)) {
            prop.computed = true;
            prop.key = this.parseMaybeAssign();
            this.expect(tt.bracketR);
            return;
          } else {
            prop.computed = false;
          }
        }
        prop.key = this.type === tt.num || this.type === tt.string ? this.parseExprAtom() : this.parseIdent(true);
      };
      pp.initFunction = function(node) {
        node.id = null;
        if (this.options.ecmaVersion >= 6) {
          node.generator = false;
          node.expression = false;
        }
      };
      pp.parseMethod = function(isGenerator) {
        var node = this.startNode();
        this.initFunction(node);
        this.expect(tt.parenL);
        node.params = this.parseBindingList(tt.parenR, false, false);
        var allowExpressionBody = undefined;
        if (this.options.ecmaVersion >= 6) {
          node.generator = isGenerator;
          allowExpressionBody = true;
        } else {
          allowExpressionBody = false;
        }
        this.parseFunctionBody(node, allowExpressionBody);
        return this.finishNode(node, "FunctionExpression");
      };
      pp.parseArrowExpression = function(node, params) {
        this.initFunction(node);
        node.params = this.toAssignableList(params, true);
        this.parseFunctionBody(node, true);
        return this.finishNode(node, "ArrowFunctionExpression");
      };
      pp.parseFunctionBody = function(node, allowExpression) {
        var isExpression = allowExpression && this.type !== tt.braceL;
        if (isExpression) {
          node.body = this.parseMaybeAssign();
          node.expression = true;
        } else {
          var oldInFunc = this.inFunction,
            oldInGen = this.inGenerator,
            oldLabels = this.labels;
          this.inFunction = true;
          this.inGenerator = node.generator;
          this.labels = [];
          node.body = this.parseBlock(true);
          node.expression = false;
          this.inFunction = oldInFunc;
          this.inGenerator = oldInGen;
          this.labels = oldLabels;
        }
        if (this.strict || !isExpression && node.body.body.length && this.isUseStrict(node.body.body[0])) {
          var nameHash = {},
            oldStrict = this.strict;
          this.strict = true;
          if (node.id) this.checkLVal(node.id, true);
          for (var i = 0; i < node.params.length; i++) {
            this.checkLVal(node.params[i], true, nameHash);
          }
          this.strict = oldStrict;
        }
      };
      pp.parseExprList = function(close, allowTrailingComma, allowEmpty, refShorthandDefaultPos) {
        var elts = [],
          first = true;
        while (!this.eat(close)) {
          if (!first) {
            this.expect(tt.comma);
            if (allowTrailingComma && this.afterTrailingComma(close)) break;
          } else first = false;
          if (allowEmpty && this.type === tt.comma) {
            elts.push(null);
          } else {
            if (this.type === tt.ellipsis) elts.push(this.parseSpread(refShorthandDefaultPos));
            else elts.push(this.parseMaybeAssign(false, refShorthandDefaultPos));
          }
        }
        return elts;
      };
      pp.parseIdent = function(liberal) {
        var node = this.startNode();
        if (liberal && this.options.allowReserved == "never") liberal = false;
        if (this.type === tt.name) {
          if (!liberal && (!this.options.allowReserved && this.isReservedWord(this.value) || this.strict && reservedWords.strict(this.value) && (this.options.ecmaVersion >= 6 || this.input.slice(this.start, this.end).indexOf("\\") == -1))) this.raise(this.start, "The keyword '" + this.value + "' is reserved");
          node.name = this.value;
        } else if (liberal && this.type.keyword) {
          node.name = this.type.keyword;
        } else {
          this.unexpected();
        }
        this.next();
        return this.finishNode(node, "Identifier");
      };
      pp.parseYield = function() {
        var node = this.startNode();
        this.next();
        if (this.type == tt.semi || this.canInsertSemicolon() || this.type != tt.star && !this.type.startsExpr) {
          node.delegate = false;
          node.argument = null;
        } else {
          node.delegate = this.eat(tt.star);
          node.argument = this.parseMaybeAssign();
        }
        return this.finishNode(node, "YieldExpression");
      };
      pp.parseComprehension = function(node, isGenerator) {
        node.blocks = [];
        while (this.type === tt._for) {
          var block = this.startNode();
          this.next();
          this.expect(tt.parenL);
          block.left = this.parseBindingAtom();
          this.checkLVal(block.left, true);
          this.expectContextual("of");
          block.right = this.parseExpression();
          this.expect(tt.parenR);
          node.blocks.push(this.finishNode(block, "ComprehensionBlock"));
        }
        node.filter = this.eat(tt._if) ? this.parseParenExpression() : null;
        node.body = this.parseExpression();
        this.expect(isGenerator ? tt.parenR : tt.bracketR);
        node.generator = isGenerator;
        return this.finishNode(node, "ComprehensionExpression");
      };
    }, {
      "./identifier": 3,
      "./state": 9,
      "./tokentype": 13,
      "./util": 14
    }],
    3: [function(_dereq_, module, exports) {
      "use strict";
      exports.isIdentifierStart = isIdentifierStart;
      exports.isIdentifierChar = isIdentifierChar;
      exports.__esModule = true;

      function makePredicate(words) {
        words = words.split(" ");
        var f = "",
          cats = [];
        out: for (var i = 0; i < words.length; ++i) {
          for (var j = 0; j < cats.length; ++j) {
            if (cats[j][0].length == words[i].length) {
              cats[j].push(words[i]);
              continue out;
            }
          }
          cats.push([words[i]]);
        }

        function compareTo(arr) {
          if (arr.length == 1) {
            return f += "return str === " + JSON.stringify(arr[0]) + ";";
          }
          f += "switch(str){";
          for (var i = 0; i < arr.length; ++i) {
            f += "case " + JSON.stringify(arr[i]) + ":";
          }
          f += "return true}return false;";
        }
        if (cats.length > 3) {
          cats.sort(function(a, b) {
            return b.length - a.length;
          });
          f += "switch(str.length){";
          for (var i = 0; i < cats.length; ++i) {
            var cat = cats[i];
            f += "case " + cat[0].length + ":";
            compareTo(cat);
          }
          f += "}";
        } else {
          compareTo(words);
        }
        return new Function("str", f);
      }
      var reservedWords = {
        3: makePredicate("abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile"),
        5: makePredicate("class enum extends super const export import"),
        6: makePredicate("enum await"),
        strict: makePredicate("implements interface let package private protected public static yield"),
        strictBind: makePredicate("eval arguments")
      };
      exports.reservedWords = reservedWords;
      var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";
      var keywords = {
        5: makePredicate(ecma5AndLessKeywords),
        6: makePredicate(ecma5AndLessKeywords + " let const class extends export import yield super")
      };
      exports.keywords = keywords;
      var nonASCIIidentifierStartChars = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙա-ևא-תװ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠ-ࢲऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘౙౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൠൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᧁ-ᧇᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᳵᳶᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿌ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꞎꞐ-ꞭꞰꞱꟷ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭟꭤꭥꯀ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ";
      var nonASCIIidentifierChars = "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࣤ-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ଁ-ଃ଼ା-ୄେୈୋ-୍ୖୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఃా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ഁ-ഃാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ංඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ູົຼ່-ໍ໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜔ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠐-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏ᦰ-ᧀᧈᧉ᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭ᳲ-᳴᳸᳹᷀-᷵᷼-᷿‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯꘠-꘩꙯ꙴ-꙽ꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧꢀꢁꢴ-꣄꣐-꣙꣠-꣱꤀-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︭︳︴﹍-﹏０-９＿";
      var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
      var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
      nonASCIIidentifierStartChars = nonASCIIidentifierChars = null;
      var astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 17, 26, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 99, 39, 9, 51, 157, 310, 10, 21, 11, 7, 153, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 98, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 26, 45, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 955, 52, 76, 44, 33, 24, 27, 35, 42, 34, 4, 0, 13, 47, 15, 3, 22, 0, 38, 17, 2, 24, 133, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 32, 4, 287, 47, 21, 1, 2, 0, 185, 46, 82, 47, 21, 0, 60, 42, 502, 63, 32, 0, 449, 56, 1288, 920, 104, 110, 2962, 1070, 13266, 568, 8, 30, 114, 29, 19, 47, 17, 3, 32, 20, 6, 18, 881, 68, 12, 0, 67, 12, 16481, 1, 3071, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 4149, 196, 1340, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42710, 42, 4148, 12, 221, 16355, 541];
      var astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 1306, 2, 54, 14, 32, 9, 16, 3, 46, 10, 54, 9, 7, 2, 37, 13, 2, 9, 52, 0, 13, 2, 49, 13, 16, 9, 83, 11, 168, 11, 6, 9, 8, 2, 57, 0, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 316, 19, 13, 9, 214, 6, 3, 8, 112, 16, 16, 9, 82, 12, 9, 9, 535, 9, 20855, 9, 135, 4, 60, 6, 26, 9, 1016, 45, 17, 3, 19723, 1, 5319, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 4305, 6, 792618, 239];

      function isInAstralSet(code, set) {
        var pos = 65536;
        for (var i = 0; i < set.length; i += 2) {
          pos += set[i];
          if (pos > code) {
            return false;
          }
          pos += set[i + 1];
          if (pos >= code) {
            return true;
          }
        }
      }

      function isIdentifierStart(code, astral) {
        if (code < 65) {
          return code === 36;
        }
        if (code < 91) {
          return true;
        }
        if (code < 97) {
          return code === 95;
        }
        if (code < 123) {
          return true;
        }
        if (code <= 65535) {
          return code >= 170 && nonASCIIidentifierStart.test(String.fromCharCode(code));
        }
        if (astral === false) {
          return false;
        }
        return isInAstralSet(code, astralIdentifierStartCodes);
      }

      function isIdentifierChar(code, astral) {
        if (code < 48) {
          return code === 36;
        }
        if (code < 58) {
          return true;
        }
        if (code < 65) {
          return false;
        }
        if (code < 91) {
          return true;
        }
        if (code < 97) {
          return code === 95;
        }
        if (code < 123) {
          return true;
        }
        if (code <= 65535) {
          return code >= 170 && nonASCIIidentifier.test(String.fromCharCode(code));
        }
        if (astral === false) {
          return false;
        }
        return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
      }
    }, {}],
    4: [function(_dereq_, module, exports) {
      "use strict";
      var _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      exports.getLineInfo = getLineInfo;
      exports.__esModule = true;
      var Parser = _dereq_("./state").Parser;
      var lineBreakG = _dereq_("./whitespace").lineBreakG;
      var Position = exports.Position = (function() {
        function Position(line, col) {
          _classCallCheck(this, Position);
          this.line = line;
          this.column = col;
        }
        Position.prototype.offset = function offset(n) {
          return new Position(this.line, this.column + n);
        };
        return Position;
      })();
      var SourceLocation = exports.SourceLocation = function SourceLocation(p, start, end) {
        _classCallCheck(this, SourceLocation);
        this.start = start;
        this.end = end;
        if (p.sourceFile !== null) this.source = p.sourceFile;
      };

      function getLineInfo(input, offset) {
        for (var line = 1, cur = 0;;) {
          lineBreakG.lastIndex = cur;
          var match = lineBreakG.exec(input);
          if (match && match.index < offset) {
            ++line;
            cur = match.index + match[0].length;
          } else {
            return new Position(line, offset - cur);
          }
        }
      }
      var pp = Parser.prototype;
      pp.raise = function(pos, message) {
        var loc = getLineInfo(this.input, pos);
        message += " (" + loc.line + ":" + loc.column + ")";
        var err = new SyntaxError(message);
        err.pos = pos;
        err.loc = loc;
        err.raisedAt = this.pos;
        throw err;
      };
      pp.curPosition = function() {
        return new Position(this.curLine, this.pos - this.lineStart);
      };
    }, {
      "./state": 9,
      "./whitespace": 15
    }],
    5: [function(_dereq_, module, exports) {
      "use strict";
      var tt = _dereq_("./tokentype").types;
      var Parser = _dereq_("./state").Parser;
      var reservedWords = _dereq_("./identifier").reservedWords;
      var has = _dereq_("./util").has;
      var pp = Parser.prototype;
      pp.toAssignable = function(node, isBinding) {
        if (this.options.ecmaVersion >= 6 && node) {
          switch (node.type) {
            case "Identifier":
            case "ObjectPattern":
            case "ArrayPattern":
            case "AssignmentPattern":
              break;
            case "ObjectExpression":
              node.type = "ObjectPattern";
              for (var i = 0; i < node.properties.length; i++) {
                var prop = node.properties[i];
                if (prop.kind !== "init") this.raise(prop.key.start, "Object pattern can't contain getter or setter");
                this.toAssignable(prop.value, isBinding);
              }
              break;
            case "ArrayExpression":
              node.type = "ArrayPattern";
              this.toAssignableList(node.elements, isBinding);
              break;
            case "AssignmentExpression":
              if (node.operator === "=") {
                node.type = "AssignmentPattern";
              } else {
                this.raise(node.left.end, "Only '=' operator can be used for specifying default value.");
              }
              break;
            case "ParenthesizedExpression":
              node.expression = this.toAssignable(node.expression, isBinding);
              break;
            case "MemberExpression":
              if (!isBinding) break;
            default:
              this.raise(node.start, "Assigning to rvalue");
          }
        }
        return node;
      };
      pp.toAssignableList = function(exprList, isBinding) {
        var end = exprList.length;
        if (end) {
          var last = exprList[end - 1];
          if (last && last.type == "RestElement") {
            --end;
          } else if (last && last.type == "SpreadElement") {
            last.type = "RestElement";
            var arg = last.argument;
            this.toAssignable(arg, isBinding);
            if (arg.type !== "Identifier" && arg.type !== "MemberExpression" && arg.type !== "ArrayPattern") this.unexpected(arg.start);
            --end;
          }
        }
        for (var i = 0; i < end; i++) {
          var elt = exprList[i];
          if (elt) this.toAssignable(elt, isBinding);
        }
        return exprList;
      };
      pp.parseSpread = function(refShorthandDefaultPos) {
        var node = this.startNode();
        this.next();
        node.argument = this.parseMaybeAssign(refShorthandDefaultPos);
        return this.finishNode(node, "SpreadElement");
      };
      pp.parseRest = function() {
        var node = this.startNode();
        this.next();
        node.argument = this.type === tt.name || this.type === tt.bracketL ? this.parseBindingAtom() : this.unexpected();
        return this.finishNode(node, "RestElement");
      };
      pp.parseBindingAtom = function() {
        if (this.options.ecmaVersion < 6) return this.parseIdent();
        switch (this.type) {
          case tt.name:
            return this.parseIdent();
          case tt.bracketL:
            var node = this.startNode();
            this.next();
            node.elements = this.parseBindingList(tt.bracketR, true, true);
            return this.finishNode(node, "ArrayPattern");
          case tt.braceL:
            return this.parseObj(true);
          default:
            this.unexpected();
        }
      };
      pp.parseBindingList = function(close, allowEmpty, allowTrailingComma) {
        var elts = [],
          first = true;
        while (!this.eat(close)) {
          if (first) first = false;
          else this.expect(tt.comma);
          if (allowEmpty && this.type === tt.comma) {
            elts.push(null);
          } else if (allowTrailingComma && this.afterTrailingComma(close)) {
            break;
          } else if (this.type === tt.ellipsis) {
            var rest = this.parseRest();
            this.parseBindingListItem(rest);
            elts.push(rest);
            this.expect(close);
            break;
          } else {
            var elem = this.parseMaybeDefault(this.start, this.startLoc);
            this.parseBindingListItem(elem);
            elts.push(elem);
          }
        }
        return elts;
      };
      pp.parseBindingListItem = function(param) {
        return param;
      };
      pp.parseMaybeDefault = function(startPos, startLoc, left) {
        left = left || this.parseBindingAtom();
        if (!this.eat(tt.eq)) return left;
        var node = this.startNodeAt(startPos, startLoc);
        node.operator = "=";
        node.left = left;
        node.right = this.parseMaybeAssign();
        return this.finishNode(node, "AssignmentPattern");
      };
      pp.checkLVal = function(expr, isBinding, checkClashes) {
        switch (expr.type) {
          case "Identifier":
            if (this.strict && (reservedWords.strictBind(expr.name) || reservedWords.strict(expr.name))) this.raise(expr.start, (isBinding ? "Binding " : "Assigning to ") + expr.name + " in strict mode");
            if (checkClashes) {
              if (has(checkClashes, expr.name)) this.raise(expr.start, "Argument name clash in strict mode");
              checkClashes[expr.name] = true;
            }
            break;
          case "MemberExpression":
            if (isBinding) this.raise(expr.start, (isBinding ? "Binding" : "Assigning to") + " member expression");
            break;
          case "ObjectPattern":
            for (var i = 0; i < expr.properties.length; i++) {
              this.checkLVal(expr.properties[i].value, isBinding, checkClashes);
            }
            break;
          case "ArrayPattern":
            for (var i = 0; i < expr.elements.length; i++) {
              var elem = expr.elements[i];
              if (elem) this.checkLVal(elem, isBinding, checkClashes);
            }
            break;
          case "AssignmentPattern":
            this.checkLVal(expr.left, isBinding, checkClashes);
            break;
          case "RestElement":
            this.checkLVal(expr.argument, isBinding, checkClashes);
            break;
          case "ParenthesizedExpression":
            this.checkLVal(expr.expression, isBinding, checkClashes);
            break;
          default:
            this.raise(expr.start, (isBinding ? "Binding" : "Assigning to") + " rvalue");
        }
      };
    }, {
      "./identifier": 3,
      "./state": 9,
      "./tokentype": 13,
      "./util": 14
    }],
    6: [function(_dereq_, module, exports) {
      "use strict";
      var _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      exports.__esModule = true;
      var Parser = _dereq_("./state").Parser;
      var SourceLocation = _dereq_("./location").SourceLocation;
      var pp = Parser.prototype;
      var Node = exports.Node = function Node() {
        _classCallCheck(this, Node);
      };
      pp.startNode = function() {
        var node = new Node();
        node.start = this.start;
        if (this.options.locations) node.loc = new SourceLocation(this, this.startLoc);
        if (this.options.directSourceFile) node.sourceFile = this.options.directSourceFile;
        if (this.options.ranges) node.range = [this.start, 0];
        return node;
      };
      pp.startNodeAt = function(pos, loc) {
        var node = new Node();
        node.start = pos;
        if (this.options.locations) node.loc = new SourceLocation(this, loc);
        if (this.options.directSourceFile) node.sourceFile = this.options.directSourceFile;
        if (this.options.ranges) node.range = [pos, 0];
        return node;
      };
      pp.finishNode = function(node, type) {
        node.type = type;
        node.end = this.lastTokEnd;
        if (this.options.locations) node.loc.end = this.lastTokEndLoc;
        if (this.options.ranges) node.range[1] = this.lastTokEnd;
        return node;
      };
      pp.finishNodeAt = function(node, type, pos, loc) {
        node.type = type;
        node.end = pos;
        if (this.options.locations) node.loc.end = loc;
        if (this.options.ranges) node.range[1] = pos;
        return node;
      };
    }, {
      "./location": 4,
      "./state": 9
    }],
    7: [function(_dereq_, module, exports) {
      "use strict";
      exports.getOptions = getOptions;
      exports.__esModule = true;
      var _util = _dereq_("./util");
      var has = _util.has;
      var isArray = _util.isArray;
      var SourceLocation = _dereq_("./location").SourceLocation;
      var defaultOptions = {
        ecmaVersion: 5,
        sourceType: "script",
        onInsertedSemicolon: null,
        onTrailingComma: null,
        allowReserved: true,
        allowReturnOutsideFunction: false,
        allowImportExportEverywhere: false,
        allowHashBang: false,
        locations: false,
        onToken: null,
        onComment: null,
        ranges: false,
        program: null,
        sourceFile: null,
        directSourceFile: null,
        preserveParens: false,
        plugins: {}
      };
      exports.defaultOptions = defaultOptions;

      function getOptions(opts) {
        var options = {};
        for (var opt in defaultOptions) {
          options[opt] = opts && has(opts, opt) ? opts[opt] : defaultOptions[opt];
        }
        if (isArray(options.onToken)) {
          (function() {
            var tokens = options.onToken;
            options.onToken = function(token) {
              return tokens.push(token);
            };
          })();
        }
        if (isArray(options.onComment)) options.onComment = pushComment(options, options.onComment);
        return options;
      }

      function pushComment(options, array) {
        return function(block, text, start, end, startLoc, endLoc) {
          var comment = {
            type: block ? "Block" : "Line",
            value: text,
            start: start,
            end: end
          };
          if (options.locations) comment.loc = new SourceLocation(this, startLoc, endLoc);
          if (options.ranges) comment.range = [start, end];
          array.push(comment);
        };
      }
    }, {
      "./location": 4,
      "./util": 14
    }],
    8: [function(_dereq_, module, exports) {
      "use strict";
      var tt = _dereq_("./tokentype").types;
      var Parser = _dereq_("./state").Parser;
      var lineBreak = _dereq_("./whitespace").lineBreak;
      var pp = Parser.prototype;
      pp.isUseStrict = function(stmt) {
        return this.options.ecmaVersion >= 5 && stmt.type === "ExpressionStatement" && stmt.expression.type === "Literal" && stmt.expression.value === "use strict";
      };
      pp.eat = function(type) {
        if (this.type === type) {
          this.next();
          return true;
        } else {
          return false;
        }
      };
      pp.isContextual = function(name) {
        return this.type === tt.name && this.value === name;
      };
      pp.eatContextual = function(name) {
        return this.value === name && this.eat(tt.name);
      };
      pp.expectContextual = function(name) {
        if (!this.eatContextual(name)) this.unexpected();
      };
      pp.canInsertSemicolon = function() {
        return this.type === tt.eof || this.type === tt.braceR || lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
      };
      pp.insertSemicolon = function() {
        if (this.canInsertSemicolon()) {
          if (this.options.onInsertedSemicolon) this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc);
          return true;
        }
      };
      pp.semicolon = function() {
        if (!this.eat(tt.semi) && !this.insertSemicolon()) this.unexpected();
      };
      pp.afterTrailingComma = function(tokType) {
        if (this.type == tokType) {
          if (this.options.onTrailingComma) this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc);
          this.next();
          return true;
        }
      };
      pp.expect = function(type) {
        this.eat(type) || this.unexpected();
      };
      pp.unexpected = function(pos) {
        this.raise(pos != null ? pos : this.start, "Unexpected token");
      };
    }, {
      "./state": 9,
      "./tokentype": 13,
      "./whitespace": 15
    }],
    9: [function(_dereq_, module, exports) {
      "use strict";
      exports.Parser = Parser;
      exports.__esModule = true;
      var _identifier = _dereq_("./identifier");
      var reservedWords = _identifier.reservedWords;
      var keywords = _identifier.keywords;
      var _tokentype = _dereq_("./tokentype");
      var tt = _tokentype.types;
      var lineBreak = _tokentype.lineBreak;

      function Parser(options, input, startPos) {
        this.options = options;
        this.loadPlugins(this.options.plugins);
        this.sourceFile = this.options.sourceFile || null;
        this.isKeyword = keywords[this.options.ecmaVersion >= 6 ? 6 : 5];
        this.isReservedWord = reservedWords[this.options.ecmaVersion];
        this.input = input;
        if (startPos) {
          this.pos = startPos;
          this.lineStart = Math.max(0, this.input.lastIndexOf("\n", startPos));
          this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
        } else {
          this.pos = this.lineStart = 0;
          this.curLine = 1;
        }
        this.type = tt.eof;
        this.value = null;
        this.start = this.end = this.pos;
        this.startLoc = this.endLoc = null;
        this.lastTokEndLoc = this.lastTokStartLoc = null;
        this.lastTokStart = this.lastTokEnd = this.pos;
        this.context = this.initialContext();
        this.exprAllowed = true;
        this.strict = this.inModule = this.options.sourceType === "module";
        this.potentialArrowAt = -1;
        this.inFunction = this.inGenerator = false;
        this.labels = [];
        if (this.pos === 0 && this.options.allowHashBang && this.input.slice(0, 2) === "#!") this.skipLineComment(2);
      }
      Parser.prototype.extend = function(name, f) {
        this[name] = f(this[name]);
      };
      var plugins = {};
      exports.plugins = plugins;
      Parser.prototype.loadPlugins = function(plugins) {
        for (var _name in plugins) {
          var plugin = exports.plugins[_name];
          if (!plugin) throw new Error("Plugin '" + _name + "' not found");
          plugin(this, plugins[_name]);
        }
      };
    }, {
      "./identifier": 3,
      "./tokentype": 13
    }],
    10: [function(_dereq_, module, exports) {
      "use strict";
      var tt = _dereq_("./tokentype").types;
      var Parser = _dereq_("./state").Parser;
      var lineBreak = _dereq_("./whitespace").lineBreak;
      var pp = Parser.prototype;
      pp.parseTopLevel = function(node) {
        var first = true;
        if (!node.body) node.body = [];
        while (this.type !== tt.eof) {
          var stmt = this.parseStatement(true, true);
          node.body.push(stmt);
          if (first && this.isUseStrict(stmt)) this.setStrict(true);
          first = false;
        }
        this.next();
        if (this.options.ecmaVersion >= 6) {
          node.sourceType = this.options.sourceType;
        }
        return this.finishNode(node, "Program");
      };
      var loopLabel = {
          kind: "loop"
        },
        switchLabel = {
          kind: "switch"
        };
      pp.parseStatement = function(declaration, topLevel) {
        var starttype = this.type,
          node = this.startNode();
        switch (starttype) {
          case tt._break:
          case tt._continue:
            return this.parseBreakContinueStatement(node, starttype.keyword);
          case tt._debugger:
            return this.parseDebuggerStatement(node);
          case tt._do:
            return this.parseDoStatement(node);
          case tt._for:
            return this.parseForStatement(node);
          case tt._function:
            if (!declaration && this.options.ecmaVersion >= 6) this.unexpected();
            return this.parseFunctionStatement(node);
          case tt._class:
            if (!declaration) this.unexpected();
            return this.parseClass(node, true);
          case tt._if:
            return this.parseIfStatement(node);
          case tt._return:
            return this.parseReturnStatement(node);
          case tt._switch:
            return this.parseSwitchStatement(node);
          case tt._throw:
            return this.parseThrowStatement(node);
          case tt._try:
            return this.parseTryStatement(node);
          case tt._let:
          case tt._const:
            if (!declaration) this.unexpected();
          case tt._var:
            return this.parseVarStatement(node, starttype);
          case tt._while:
            return this.parseWhileStatement(node);
          case tt._with:
            return this.parseWithStatement(node);
          case tt.braceL:
            return this.parseBlock();
          case tt.semi:
            return this.parseEmptyStatement(node);
          case tt._export:
          case tt._import:
            if (!this.options.allowImportExportEverywhere) {
              if (!topLevel) this.raise(this.start, "'import' and 'export' may only appear at the top level");
              if (!this.inModule) this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'");
            }
            return starttype === tt._import ? this.parseImport(node) : this.parseExport(node);
          default:
            var maybeName = this.value,
              expr = this.parseExpression();
            if (starttype === tt.name && expr.type === "Identifier" && this.eat(tt.colon)) return this.parseLabeledStatement(node, maybeName, expr);
            else return this.parseExpressionStatement(node, expr);
        }
      };
      pp.parseBreakContinueStatement = function(node, keyword) {
        var isBreak = keyword == "break";
        this.next();
        if (this.eat(tt.semi) || this.insertSemicolon()) node.label = null;
        else if (this.type !== tt.name) this.unexpected();
        else {
          node.label = this.parseIdent();
          this.semicolon();
        }
        for (var i = 0; i < this.labels.length; ++i) {
          var lab = this.labels[i];
          if (node.label == null || lab.name === node.label.name) {
            if (lab.kind != null && (isBreak || lab.kind === "loop")) break;
            if (node.label && isBreak) break;
          }
        }
        if (i === this.labels.length) this.raise(node.start, "Unsyntactic " + keyword);
        return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
      };
      pp.parseDebuggerStatement = function(node) {
        this.next();
        this.semicolon();
        return this.finishNode(node, "DebuggerStatement");
      };
      pp.parseDoStatement = function(node) {
        this.next();
        this.labels.push(loopLabel);
        node.body = this.parseStatement(false);
        this.labels.pop();
        this.expect(tt._while);
        node.test = this.parseParenExpression();
        if (this.options.ecmaVersion >= 6) this.eat(tt.semi);
        else this.semicolon();
        return this.finishNode(node, "DoWhileStatement");
      };
      pp.parseForStatement = function(node) {
        this.next();
        this.labels.push(loopLabel);
        this.expect(tt.parenL);
        if (this.type === tt.semi) return this.parseFor(node, null);
        if (this.type === tt._var || this.type === tt._let || this.type === tt._const) {
          var _init = this.startNode(),
            varKind = this.type;
          this.next();
          this.parseVar(_init, true, varKind);
          this.finishNode(_init, "VariableDeclaration");
          if ((this.type === tt._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && _init.declarations.length === 1 && !(varKind !== tt._var && _init.declarations[0].init)) return this.parseForIn(node, _init);
          return this.parseFor(node, _init);
        }
        var refShorthandDefaultPos = {
          start: 0
        };
        var init = this.parseExpression(true, refShorthandDefaultPos);
        if (this.type === tt._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) {
          this.toAssignable(init);
          this.checkLVal(init);
          return this.parseForIn(node, init);
        } else if (refShorthandDefaultPos.start) {
          this.unexpected(refShorthandDefaultPos.start);
        }
        return this.parseFor(node, init);
      };
      pp.parseFunctionStatement = function(node) {
        this.next();
        return this.parseFunction(node, true);
      };
      pp.parseIfStatement = function(node) {
        this.next();
        node.test = this.parseParenExpression();
        node.consequent = this.parseStatement(false);
        node.alternate = this.eat(tt._else) ? this.parseStatement(false) : null;
        return this.finishNode(node, "IfStatement");
      };
      pp.parseReturnStatement = function(node) {
        if (!this.inFunction && !this.options.allowReturnOutsideFunction) this.raise(this.start, "'return' outside of function");
        this.next();
        if (this.eat(tt.semi) || this.insertSemicolon()) node.argument = null;
        else {
          node.argument = this.parseExpression();
          this.semicolon();
        }
        return this.finishNode(node, "ReturnStatement");
      };
      pp.parseSwitchStatement = function(node) {
        this.next();
        node.discriminant = this.parseParenExpression();
        node.cases = [];
        this.expect(tt.braceL);
        this.labels.push(switchLabel);
        for (var cur, sawDefault; this.type != tt.braceR;) {
          if (this.type === tt._case || this.type === tt._default) {
            var isCase = this.type === tt._case;
            if (cur) this.finishNode(cur, "SwitchCase");
            node.cases.push(cur = this.startNode());
            cur.consequent = [];
            this.next();
            if (isCase) {
              cur.test = this.parseExpression();
            } else {
              if (sawDefault) this.raise(this.lastTokStart, "Multiple default clauses");
              sawDefault = true;
              cur.test = null;
            }
            this.expect(tt.colon);
          } else {
            if (!cur) this.unexpected();
            cur.consequent.push(this.parseStatement(true));
          }
        }
        if (cur) this.finishNode(cur, "SwitchCase");
        this.next();
        this.labels.pop();
        return this.finishNode(node, "SwitchStatement");
      };
      pp.parseThrowStatement = function(node) {
        this.next();
        if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) this.raise(this.lastTokEnd, "Illegal newline after throw");
        node.argument = this.parseExpression();
        this.semicolon();
        return this.finishNode(node, "ThrowStatement");
      };
      var empty = [];
      pp.parseTryStatement = function(node) {
        this.next();
        node.block = this.parseBlock();
        node.handler = null;
        if (this.type === tt._catch) {
          var clause = this.startNode();
          this.next();
          this.expect(tt.parenL);
          clause.param = this.parseBindingAtom();
          this.checkLVal(clause.param, true);
          this.expect(tt.parenR);
          clause.guard = null;
          clause.body = this.parseBlock();
          node.handler = this.finishNode(clause, "CatchClause");
        }
        node.guardedHandlers = empty;
        node.finalizer = this.eat(tt._finally) ? this.parseBlock() : null;
        if (!node.handler && !node.finalizer) this.raise(node.start, "Missing catch or finally clause");
        return this.finishNode(node, "TryStatement");
      };
      pp.parseVarStatement = function(node, kind) {
        this.next();
        this.parseVar(node, false, kind);
        this.semicolon();
        return this.finishNode(node, "VariableDeclaration");
      };
      pp.parseWhileStatement = function(node) {
        this.next();
        node.test = this.parseParenExpression();
        this.labels.push(loopLabel);
        node.body = this.parseStatement(false);
        this.labels.pop();
        return this.finishNode(node, "WhileStatement");
      };
      pp.parseWithStatement = function(node) {
        if (this.strict) this.raise(this.start, "'with' in strict mode");
        this.next();
        node.object = this.parseParenExpression();
        node.body = this.parseStatement(false);
        return this.finishNode(node, "WithStatement");
      };
      pp.parseEmptyStatement = function(node) {
        this.next();
        return this.finishNode(node, "EmptyStatement");
      };
      pp.parseLabeledStatement = function(node, maybeName, expr) {
        for (var i = 0; i < this.labels.length; ++i) {
          if (this.labels[i].name === maybeName) this.raise(expr.start, "Label '" + maybeName + "' is already declared");
        }
        var kind = this.type.isLoop ? "loop" : this.type === tt._switch ? "switch" : null;
        this.labels.push({
          name: maybeName,
          kind: kind
        });
        node.body = this.parseStatement(true);
        this.labels.pop();
        node.label = expr;
        return this.finishNode(node, "LabeledStatement");
      };
      pp.parseExpressionStatement = function(node, expr) {
        node.expression = expr;
        this.semicolon();
        return this.finishNode(node, "ExpressionStatement");
      };
      pp.parseBlock = function(allowStrict) {
        var node = this.startNode(),
          first = true,
          oldStrict = undefined;
        node.body = [];
        this.expect(tt.braceL);
        while (!this.eat(tt.braceR)) {
          var stmt = this.parseStatement(true);
          node.body.push(stmt);
          if (first && allowStrict && this.isUseStrict(stmt)) {
            oldStrict = this.strict;
            this.setStrict(this.strict = true);
          }
          first = false;
        }
        if (oldStrict === false) this.setStrict(false);
        return this.finishNode(node, "BlockStatement");
      };
      pp.parseFor = function(node, init) {
        node.init = init;
        this.expect(tt.semi);
        node.test = this.type === tt.semi ? null : this.parseExpression();
        this.expect(tt.semi);
        node.update = this.type === tt.parenR ? null : this.parseExpression();
        this.expect(tt.parenR);
        node.body = this.parseStatement(false);
        this.labels.pop();
        return this.finishNode(node, "ForStatement");
      };
      pp.parseForIn = function(node, init) {
        var type = this.type === tt._in ? "ForInStatement" : "ForOfStatement";
        this.next();
        node.left = init;
        node.right = this.parseExpression();
        this.expect(tt.parenR);
        node.body = this.parseStatement(false);
        this.labels.pop();
        return this.finishNode(node, type);
      };
      pp.parseVar = function(node, isFor, kind) {
        node.declarations = [];
        node.kind = kind.keyword;
        for (;;) {
          var decl = this.startNode();
          this.parseVarId(decl);
          if (this.eat(tt.eq)) {
            decl.init = this.parseMaybeAssign(isFor);
          } else if (kind === tt._const && !(this.type === tt._in || this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
            this.unexpected();
          } else if (decl.id.type != "Identifier" && !(isFor && (this.type === tt._in || this.isContextual("of")))) {
            this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value");
          } else {
            decl.init = null;
          }
          node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
          if (!this.eat(tt.comma)) break;
        }
        return node;
      };
      pp.parseVarId = function(decl) {
        decl.id = this.parseBindingAtom();
        this.checkLVal(decl.id, true);
      };
      pp.parseFunction = function(node, isStatement, allowExpressionBody) {
        this.initFunction(node);
        if (this.options.ecmaVersion >= 6) node.generator = this.eat(tt.star);
        if (isStatement || this.type === tt.name) node.id = this.parseIdent();
        this.parseFunctionParams(node);
        this.parseFunctionBody(node, allowExpressionBody);
        return this.finishNode(node, isStatement ? "FunctionDeclaration" : "FunctionExpression");
      };
      pp.parseFunctionParams = function(node) {
        this.expect(tt.parenL);
        node.params = this.parseBindingList(tt.parenR, false, false);
      };
      pp.parseClass = function(node, isStatement) {
        this.next();
        this.parseClassId(node, isStatement);
        this.parseClassSuper(node);
        var classBody = this.startNode();
        classBody.body = [];
        this.expect(tt.braceL);
        while (!this.eat(tt.braceR)) {
          if (this.eat(tt.semi)) continue;
          var method = this.startNode();
          var isGenerator = this.eat(tt.star);
          this.parsePropertyName(method);
          if (this.type !== tt.parenL && !method.computed && method.key.type === "Identifier" && method.key.name === "static") {
            if (isGenerator) this.unexpected();
            method["static"] = true;
            isGenerator = this.eat(tt.star);
            this.parsePropertyName(method);
          } else {
            method["static"] = false;
          }
          method.kind = "method";
          if (!method.computed && !isGenerator) {
            if (method.key.type === "Identifier") {
              if (this.type !== tt.parenL && (method.key.name === "get" || method.key.name === "set")) {
                method.kind = method.key.name;
                this.parsePropertyName(method);
              } else if (!method["static"] && method.key.name === "constructor") {
                method.kind = "constructor";
              }
            } else if (!method["static"] && method.key.type === "Literal" && method.key.value === "constructor") {
              method.kind = "constructor";
            }
          }
          this.parseClassMethod(classBody, method, isGenerator);
        }
        node.body = this.finishNode(classBody, "ClassBody");
        return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
      };
      pp.parseClassMethod = function(classBody, method, isGenerator) {
        method.value = this.parseMethod(isGenerator);
        classBody.body.push(this.finishNode(method, "MethodDefinition"));
      };
      pp.parseClassId = function(node, isStatement) {
        node.id = this.type === tt.name ? this.parseIdent() : isStatement ? this.unexpected() : null;
      };
      pp.parseClassSuper = function(node) {
        node.superClass = this.eat(tt._extends) ? this.parseExprSubscripts() : null;
      };
      pp.parseExport = function(node) {
        this.next();
        if (this.eat(tt.star)) {
          this.expectContextual("from");
          node.source = this.type === tt.string ? this.parseExprAtom() : this.unexpected();
          this.semicolon();
          return this.finishNode(node, "ExportAllDeclaration");
        }
        if (this.eat(tt._default)) {
          var expr = this.parseMaybeAssign();
          var needsSemi = true;
          if (expr.type == "FunctionExpression" || expr.type == "ClassExpression") {
            needsSemi = false;
            if (expr.id) {
              expr.type = expr.type == "FunctionExpression" ? "FunctionDeclaration" : "ClassDeclaration";
            }
          }
          node.declaration = expr;
          if (needsSemi) this.semicolon();
          return this.finishNode(node, "ExportDefaultDeclaration");
        }
        if (this.shouldParseExportStatement()) {
          node.declaration = this.parseStatement(true);
          node.specifiers = [];
          node.source = null;
        } else {
          node.declaration = null;
          node.specifiers = this.parseExportSpecifiers();
          if (this.eatContextual("from")) {
            node.source = this.type === tt.string ? this.parseExprAtom() : this.unexpected();
          } else {
            node.source = null;
          }
          this.semicolon();
        }
        return this.finishNode(node, "ExportNamedDeclaration");
      };
      pp.shouldParseExportStatement = function() {
        return this.type.keyword;
      };
      pp.parseExportSpecifiers = function() {
        var nodes = [],
          first = true;
        this.expect(tt.braceL);
        while (!this.eat(tt.braceR)) {
          if (!first) {
            this.expect(tt.comma);
            if (this.afterTrailingComma(tt.braceR)) break;
          } else first = false;
          var node = this.startNode();
          node.local = this.parseIdent(this.type === tt._default);
          node.exported = this.eatContextual("as") ? this.parseIdent(true) : node.local;
          nodes.push(this.finishNode(node, "ExportSpecifier"));
        }
        return nodes;
      };
      pp.parseImport = function(node) {
        this.next();
        if (this.type === tt.string) {
          node.specifiers = empty;
          node.source = this.parseExprAtom();
          node.kind = "";
        } else {
          node.specifiers = this.parseImportSpecifiers();
          this.expectContextual("from");
          node.source = this.type === tt.string ? this.parseExprAtom() : this.unexpected();
        }
        this.semicolon();
        return this.finishNode(node, "ImportDeclaration");
      };
      pp.parseImportSpecifiers = function() {
        var nodes = [],
          first = true;
        if (this.type === tt.name) {
          var node = this.startNode();
          node.local = this.parseIdent();
          this.checkLVal(node.local, true);
          nodes.push(this.finishNode(node, "ImportDefaultSpecifier"));
          if (!this.eat(tt.comma)) return nodes;
        }
        if (this.type === tt.star) {
          var node = this.startNode();
          this.next();
          this.expectContextual("as");
          node.local = this.parseIdent();
          this.checkLVal(node.local, true);
          nodes.push(this.finishNode(node, "ImportNamespaceSpecifier"));
          return nodes;
        }
        this.expect(tt.braceL);
        while (!this.eat(tt.braceR)) {
          if (!first) {
            this.expect(tt.comma);
            if (this.afterTrailingComma(tt.braceR)) break;
          } else first = false;
          var node = this.startNode();
          node.imported = this.parseIdent(true);
          node.local = this.eatContextual("as") ? this.parseIdent() : node.imported;
          this.checkLVal(node.local, true);
          nodes.push(this.finishNode(node, "ImportSpecifier"));
        }
        return nodes;
      };
    }, {
      "./state": 9,
      "./tokentype": 13,
      "./whitespace": 15
    }],
    11: [function(_dereq_, module, exports) {
      "use strict";
      var _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      exports.__esModule = true;
      var Parser = _dereq_("./state").Parser;
      var tt = _dereq_("./tokentype").types;
      var lineBreak = _dereq_("./whitespace").lineBreak;
      var TokContext = exports.TokContext = function TokContext(token, isExpr, preserveSpace, override) {
        _classCallCheck(this, TokContext);
        this.token = token;
        this.isExpr = isExpr;
        this.preserveSpace = preserveSpace;
        this.override = override;
      };
      var types = {
        b_stat: new TokContext("{", false),
        b_expr: new TokContext("{", true),
        b_tmpl: new TokContext("${", true),
        p_stat: new TokContext("(", false),
        p_expr: new TokContext("(", true),
        q_tmpl: new TokContext("`", true, true, function(p) {
          return p.readTmplToken();
        }),
        f_expr: new TokContext("function", true)
      };
      exports.types = types;
      var pp = Parser.prototype;
      pp.initialContext = function() {
        return [types.b_stat];
      };
      pp.braceIsBlock = function(prevType) {
        var parent = undefined;
        if (prevType === tt.colon && (parent = this.curContext()).token == "{") return !parent.isExpr;
        if (prevType === tt._return) return lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
        if (prevType === tt._else || prevType === tt.semi || prevType === tt.eof) return true;
        if (prevType == tt.braceL) return this.curContext() === types.b_stat;
        return !this.exprAllowed;
      };
      pp.updateContext = function(prevType) {
        var update = undefined,
          type = this.type;
        if (type.keyword && prevType == tt.dot) this.exprAllowed = false;
        else if (update = type.updateContext) update.call(this, prevType);
        else this.exprAllowed = type.beforeExpr;
      };
      tt.parenR.updateContext = tt.braceR.updateContext = function() {
        if (this.context.length == 1) {
          this.exprAllowed = true;
          return;
        }
        var out = this.context.pop();
        if (out === types.b_stat && this.curContext() === types.f_expr) {
          this.context.pop();
          this.exprAllowed = false;
        } else if (out === types.b_tmpl) {
          this.exprAllowed = true;
        } else {
          this.exprAllowed = !out.isExpr;
        }
      };
      tt.braceL.updateContext = function(prevType) {
        this.context.push(this.braceIsBlock(prevType) ? types.b_stat : types.b_expr);
        this.exprAllowed = true;
      };
      tt.dollarBraceL.updateContext = function() {
        this.context.push(types.b_tmpl);
        this.exprAllowed = true;
      };
      tt.parenL.updateContext = function(prevType) {
        var statementParens = prevType === tt._if || prevType === tt._for || prevType === tt._with || prevType === tt._while;
        this.context.push(statementParens ? types.p_stat : types.p_expr);
        this.exprAllowed = true;
      };
      tt.incDec.updateContext = function() {};
      tt._function.updateContext = function() {
        if (this.curContext() !== types.b_stat) this.context.push(types.f_expr);
        this.exprAllowed = false;
      };
      tt.backQuote.updateContext = function() {
        if (this.curContext() === types.q_tmpl) this.context.pop();
        else this.context.push(types.q_tmpl);
        this.exprAllowed = false;
      };
    }, {
      "./state": 9,
      "./tokentype": 13,
      "./whitespace": 15
    }],
    12: [function(_dereq_, module, exports) {
      "use strict";
      var _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      exports.__esModule = true;
      var _identifier = _dereq_("./identifier");
      var isIdentifierStart = _identifier.isIdentifierStart;
      var isIdentifierChar = _identifier.isIdentifierChar;
      var _tokentype = _dereq_("./tokentype");
      var tt = _tokentype.types;
      var keywordTypes = _tokentype.keywords;
      var Parser = _dereq_("./state").Parser;
      var SourceLocation = _dereq_("./location").SourceLocation;
      var _whitespace = _dereq_("./whitespace");
      var lineBreak = _whitespace.lineBreak;
      var lineBreakG = _whitespace.lineBreakG;
      var isNewLine = _whitespace.isNewLine;
      var nonASCIIwhitespace = _whitespace.nonASCIIwhitespace;
      var Token = exports.Token = function Token(p) {
        _classCallCheck(this, Token);
        this.type = p.type;
        this.value = p.value;
        this.start = p.start;
        this.end = p.end;
        if (p.options.locations) this.loc = new SourceLocation(p, p.startLoc, p.endLoc);
        if (p.options.ranges) this.range = [p.start, p.end];
      };
      var pp = Parser.prototype;
      pp.next = function() {
        if (this.options.onToken) this.options.onToken(new Token(this));
        this.lastTokEnd = this.end;
        this.lastTokStart = this.start;
        this.lastTokEndLoc = this.endLoc;
        this.lastTokStartLoc = this.startLoc;
        this.nextToken();
      };
      pp.getToken = function() {
        this.next();
        return new Token(this);
      };
      if (typeof Symbol !== "undefined") pp[Symbol.iterator] = function() {
        var self = this;
        return {
          next: function next() {
            var token = self.getToken();
            return {
              done: token.type === tt.eof,
              value: token
            };
          }
        };
      };
      pp.setStrict = function(strict) {
        this.strict = strict;
        if (this.type !== tt.num && this.type !== tt.string) return;
        this.pos = this.start;
        if (this.options.locations) {
          while (this.pos < this.lineStart) {
            this.lineStart = this.input.lastIndexOf("\n", this.lineStart - 2) + 1;
            --this.curLine;
          }
        }
        this.nextToken();
      };
      pp.curContext = function() {
        return this.context[this.context.length - 1];
      };
      pp.nextToken = function() {
        var curContext = this.curContext();
        if (!curContext || !curContext.preserveSpace) this.skipSpace();
        this.start = this.pos;
        if (this.options.locations) this.startLoc = this.curPosition();
        if (this.pos >= this.input.length) return this.finishToken(tt.eof);
        if (curContext.override) return curContext.override(this);
        else this.readToken(this.fullCharCodeAtPos());
      };
      pp.readToken = function(code) {
        if (isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92) return this.readWord();
        return this.getTokenFromCode(code);
      };
      pp.fullCharCodeAtPos = function() {
        var code = this.input.charCodeAt(this.pos);
        if (code <= 55295 || code >= 57344) return code;
        var next = this.input.charCodeAt(this.pos + 1);
        return (code << 10) + next - 56613888;
      };
      pp.skipBlockComment = function() {
        var startLoc = this.options.onComment && this.options.locations && this.curPosition();
        var start = this.pos,
          end = this.input.indexOf("*/", this.pos += 2);
        if (end === -1) this.raise(this.pos - 2, "Unterminated comment");
        this.pos = end + 2;
        if (this.options.locations) {
          lineBreakG.lastIndex = start;
          var match = undefined;
          while ((match = lineBreakG.exec(this.input)) && match.index < this.pos) {
            ++this.curLine;
            this.lineStart = match.index + match[0].length;
          }
        }
        if (this.options.onComment) this.options.onComment(true, this.input.slice(start + 2, end), start, this.pos, startLoc, this.options.locations && this.curPosition());
      };
      pp.skipLineComment = function(startSkip) {
        var start = this.pos;
        var startLoc = this.options.onComment && this.options.locations && this.curPosition();
        var ch = this.input.charCodeAt(this.pos += startSkip);
        while (this.pos < this.input.length && ch !== 10 && ch !== 13 && ch !== 8232 && ch !== 8233) {
          ++this.pos;
          ch = this.input.charCodeAt(this.pos);
        }
        if (this.options.onComment) this.options.onComment(false, this.input.slice(start + startSkip, this.pos), start, this.pos, startLoc, this.options.locations && this.curPosition());
      };
      pp.skipSpace = function() {
        while (this.pos < this.input.length) {
          var ch = this.input.charCodeAt(this.pos);
          if (ch === 32) {
            ++this.pos;
          } else if (ch === 13) {
            ++this.pos;
            var next = this.input.charCodeAt(this.pos);
            if (next === 10) {
              ++this.pos;
            }
            if (this.options.locations) {
              ++this.curLine;
              this.lineStart = this.pos;
            }
          } else if (ch === 10 || ch === 8232 || ch === 8233) {
            ++this.pos;
            if (this.options.locations) {
              ++this.curLine;
              this.lineStart = this.pos;
            }
          } else if (ch > 8 && ch < 14) {
            ++this.pos;
          } else if (ch === 47) {
            var next = this.input.charCodeAt(this.pos + 1);
            if (next === 42) {
              this.skipBlockComment();
            } else if (next === 47) {
              this.skipLineComment(2);
            } else break;
          } else if (ch === 160) {
            ++this.pos;
          } else if (ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
            ++this.pos;
          } else {
            break;
          }
        }
      };
      pp.finishToken = function(type, val) {
        this.end = this.pos;
        if (this.options.locations) this.endLoc = this.curPosition();
        var prevType = this.type;
        this.type = type;
        this.value = val;
        this.updateContext(prevType);
      };
      pp.readToken_dot = function() {
        var next = this.input.charCodeAt(this.pos + 1);
        if (next >= 48 && next <= 57) return this.readNumber(true);
        var next2 = this.input.charCodeAt(this.pos + 2);
        if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) {
          this.pos += 3;
          return this.finishToken(tt.ellipsis);
        } else {
          ++this.pos;
          return this.finishToken(tt.dot);
        }
      };
      pp.readToken_slash = function() {
        var next = this.input.charCodeAt(this.pos + 1);
        if (this.exprAllowed) {
          ++this.pos;
          return this.readRegexp();
        }
        if (next === 61) return this.finishOp(tt.assign, 2);
        return this.finishOp(tt.slash, 1);
      };
      pp.readToken_mult_modulo = function(code) {
        var next = this.input.charCodeAt(this.pos + 1);
        if (next === 61) return this.finishOp(tt.assign, 2);
        return this.finishOp(code === 42 ? tt.star : tt.modulo, 1);
      };
      pp.readToken_pipe_amp = function(code) {
        var next = this.input.charCodeAt(this.pos + 1);
        if (next === code) return this.finishOp(code === 124 ? tt.logicalOR : tt.logicalAND, 2);
        if (next === 61) return this.finishOp(tt.assign, 2);
        return this.finishOp(code === 124 ? tt.bitwiseOR : tt.bitwiseAND, 1);
      };
      pp.readToken_caret = function() {
        var next = this.input.charCodeAt(this.pos + 1);
        if (next === 61) return this.finishOp(tt.assign, 2);
        return this.finishOp(tt.bitwiseXOR, 1);
      };
      pp.readToken_plus_min = function(code) {
        var next = this.input.charCodeAt(this.pos + 1);
        if (next === code) {
          if (next == 45 && this.input.charCodeAt(this.pos + 2) == 62 && lineBreak.test(this.input.slice(this.lastTokEnd, this.pos))) {
            this.skipLineComment(3);
            this.skipSpace();
            return this.nextToken();
          }
          return this.finishOp(tt.incDec, 2);
        }
        if (next === 61) return this.finishOp(tt.assign, 2);
        return this.finishOp(tt.plusMin, 1);
      };
      pp.readToken_lt_gt = function(code) {
        var next = this.input.charCodeAt(this.pos + 1);
        var size = 1;
        if (next === code) {
          size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
          if (this.input.charCodeAt(this.pos + size) === 61) return this.finishOp(tt.assign, size + 1);
          return this.finishOp(tt.bitShift, size);
        }
        if (next == 33 && code == 60 && this.input.charCodeAt(this.pos + 2) == 45 && this.input.charCodeAt(this.pos + 3) == 45) {
          if (this.inModule) this.unexpected();
          this.skipLineComment(4);
          this.skipSpace();
          return this.nextToken();
        }
        if (next === 61) size = this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2;
        return this.finishOp(tt.relational, size);
      };
      pp.readToken_eq_excl = function(code) {
        var next = this.input.charCodeAt(this.pos + 1);
        if (next === 61) return this.finishOp(tt.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2);
        if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) {
          this.pos += 2;
          return this.finishToken(tt.arrow);
        }
        return this.finishOp(code === 61 ? tt.eq : tt.prefix, 1);
      };
      pp.getTokenFromCode = function(code) {
        switch (code) {
          case 46:
            return this.readToken_dot();
          case 40:
            ++this.pos;
            return this.finishToken(tt.parenL);
          case 41:
            ++this.pos;
            return this.finishToken(tt.parenR);
          case 59:
            ++this.pos;
            return this.finishToken(tt.semi);
          case 44:
            ++this.pos;
            return this.finishToken(tt.comma);
          case 91:
            ++this.pos;
            return this.finishToken(tt.bracketL);
          case 93:
            ++this.pos;
            return this.finishToken(tt.bracketR);
          case 123:
            ++this.pos;
            return this.finishToken(tt.braceL);
          case 125:
            ++this.pos;
            return this.finishToken(tt.braceR);
          case 58:
            ++this.pos;
            return this.finishToken(tt.colon);
          case 63:
            ++this.pos;
            return this.finishToken(tt.question);
          case 96:
            if (this.options.ecmaVersion < 6) break;
            ++this.pos;
            return this.finishToken(tt.backQuote);
          case 48:
            var next = this.input.charCodeAt(this.pos + 1);
            if (next === 120 || next === 88) return this.readRadixNumber(16);
            if (this.options.ecmaVersion >= 6) {
              if (next === 111 || next === 79) return this.readRadixNumber(8);
              if (next === 98 || next === 66) return this.readRadixNumber(2);
            }
          case 49:
          case 50:
          case 51:
          case 52:
          case 53:
          case 54:
          case 55:
          case 56:
          case 57:
            return this.readNumber(false);
          case 34:
          case 39:
            return this.readString(code);
          case 47:
            return this.readToken_slash();
          case 37:
          case 42:
            return this.readToken_mult_modulo(code);
          case 124:
          case 38:
            return this.readToken_pipe_amp(code);
          case 94:
            return this.readToken_caret();
          case 43:
          case 45:
            return this.readToken_plus_min(code);
          case 60:
          case 62:
            return this.readToken_lt_gt(code);
          case 61:
          case 33:
            return this.readToken_eq_excl(code);
          case 126:
            return this.finishOp(tt.prefix, 1);
        }
        this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
      };
      pp.finishOp = function(type, size) {
        var str = this.input.slice(this.pos, this.pos + size);
        this.pos += size;
        return this.finishToken(type, str);
      };
      var regexpUnicodeSupport = false;
      try {
        new RegExp("￿", "u");
        regexpUnicodeSupport = true;
      } catch (e) {}
      pp.readRegexp = function() {
        var escaped = undefined,
          inClass = undefined,
          start = this.pos;
        for (;;) {
          if (this.pos >= this.input.length) this.raise(start, "Unterminated regular expression");
          var ch = this.input.charAt(this.pos);
          if (lineBreak.test(ch)) this.raise(start, "Unterminated regular expression");
          if (!escaped) {
            if (ch === "[") inClass = true;
            else if (ch === "]" && inClass) inClass = false;
            else if (ch === "/" && !inClass) break;
            escaped = ch === "\\";
          } else escaped = false;
          ++this.pos;
        }
        var content = this.input.slice(start, this.pos);
        ++this.pos;
        var mods = this.readWord1();
        var tmp = content;
        if (mods) {
          var validFlags = /^[gmsiy]*$/;
          if (this.options.ecmaVersion >= 6) validFlags = /^[gmsiyu]*$/;
          if (!validFlags.test(mods)) this.raise(start, "Invalid regular expression flag");
          if (mods.indexOf("u") >= 0 && !regexpUnicodeSupport) {
            tmp = tmp.replace(/\\u([a-fA-F0-9]{4})|\\u\{([0-9a-fA-F]+)\}|[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "x");
          }
        }
        try {
          new RegExp(tmp);
        } catch (e) {
          if (e instanceof SyntaxError) this.raise(start, "Error parsing regular expression: " + e.message);
          this.raise(e);
        }
        var value = undefined;
        try {
          value = new RegExp(content, mods);
        } catch (err) {
          value = null;
        }
        return this.finishToken(tt.regexp, {
          pattern: content,
          flags: mods,
          value: value
        });
      };
      pp.readInt = function(radix, len) {
        var start = this.pos,
          total = 0;
        for (var i = 0, e = len == null ? Infinity : len; i < e; ++i) {
          var code = this.input.charCodeAt(this.pos),
            val = undefined;
          if (code >= 97) val = code - 97 + 10;
          else if (code >= 65) val = code - 65 + 10;
          else if (code >= 48 && code <= 57) val = code - 48;
          else val = Infinity;
          if (val >= radix) break;
          ++this.pos;
          total = total * radix + val;
        }
        if (this.pos === start || len != null && this.pos - start !== len) return null;
        return total;
      };
      pp.readRadixNumber = function(radix) {
        this.pos += 2;
        var val = this.readInt(radix);
        if (val == null) this.raise(this.start + 2, "Expected number in radix " + radix);
        if (isIdentifierStart(this.fullCharCodeAtPos())) this.raise(this.pos, "Identifier directly after number");
        return this.finishToken(tt.num, val);
      };
      pp.readNumber = function(startsWithDot) {
        var start = this.pos,
          isFloat = false,
          octal = this.input.charCodeAt(this.pos) === 48;
        if (!startsWithDot && this.readInt(10) === null) this.raise(start, "Invalid number");
        if (this.input.charCodeAt(this.pos) === 46) {
          ++this.pos;
          this.readInt(10);
          isFloat = true;
        }
        var next = this.input.charCodeAt(this.pos);
        if (next === 69 || next === 101) {
          next = this.input.charCodeAt(++this.pos);
          if (next === 43 || next === 45) ++this.pos;
          if (this.readInt(10) === null) this.raise(start, "Invalid number");
          isFloat = true;
        }
        if (isIdentifierStart(this.fullCharCodeAtPos())) this.raise(this.pos, "Identifier directly after number");
        var str = this.input.slice(start, this.pos),
          val = undefined;
        if (isFloat) val = parseFloat(str);
        else if (!octal || str.length === 1) val = parseInt(str, 10);
        else if (/[89]/.test(str) || this.strict) this.raise(start, "Invalid number");
        else val = parseInt(str, 8);
        return this.finishToken(tt.num, val);
      };
      pp.readCodePoint = function() {
        var ch = this.input.charCodeAt(this.pos),
          code = undefined;
        if (ch === 123) {
          if (this.options.ecmaVersion < 6) this.unexpected();
          ++this.pos;
          code = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
          ++this.pos;
          if (code > 1114111) this.unexpected();
        } else {
          code = this.readHexChar(4);
        }
        return code;
      };

      function codePointToString(code) {
        if (code <= 65535) {
          return String.fromCharCode(code);
        }
        return String.fromCharCode((code - 65536 >> 10) + 55296, (code - 65536 & 1023) + 56320);
      }
      pp.readString = function(quote) {
        var out = "",
          chunkStart = ++this.pos;
        for (;;) {
          if (this.pos >= this.input.length) this.raise(this.start, "Unterminated string constant");
          var ch = this.input.charCodeAt(this.pos);
          if (ch === quote) break;
          if (ch === 92) {
            out += this.input.slice(chunkStart, this.pos);
            out += this.readEscapedChar();
            chunkStart = this.pos;
          } else {
            if (isNewLine(ch)) this.raise(this.start, "Unterminated string constant");
            ++this.pos;
          }
        }
        out += this.input.slice(chunkStart, this.pos++);
        return this.finishToken(tt.string, out);
      };
      pp.readTmplToken = function() {
        var out = "",
          chunkStart = this.pos;
        for (;;) {
          if (this.pos >= this.input.length) this.raise(this.start, "Unterminated template");
          var ch = this.input.charCodeAt(this.pos);
          if (ch === 96 || ch === 36 && this.input.charCodeAt(this.pos + 1) === 123) {
            if (this.pos === this.start && this.type === tt.template) {
              if (ch === 36) {
                this.pos += 2;
                return this.finishToken(tt.dollarBraceL);
              } else {
                ++this.pos;
                return this.finishToken(tt.backQuote);
              }
            }
            out += this.input.slice(chunkStart, this.pos);
            return this.finishToken(tt.template, out);
          }
          if (ch === 92) {
            out += this.input.slice(chunkStart, this.pos);
            out += this.readEscapedChar();
            chunkStart = this.pos;
          } else if (isNewLine(ch)) {
            out += this.input.slice(chunkStart, this.pos);
            ++this.pos;
            if (ch === 13 && this.input.charCodeAt(this.pos) === 10) {
              ++this.pos;
              out += "\n";
            } else {
              out += String.fromCharCode(ch);
            }
            if (this.options.locations) {
              ++this.curLine;
              this.lineStart = this.pos;
            }
            chunkStart = this.pos;
          } else {
            ++this.pos;
          }
        }
      };
      pp.readEscapedChar = function() {
        var ch = this.input.charCodeAt(++this.pos);
        var octal = /^[0-7]+/.exec(this.input.slice(this.pos, this.pos + 3));
        if (octal) octal = octal[0];
        while (octal && parseInt(octal, 8) > 255) octal = octal.slice(0, -1);
        if (octal === "0") octal = null;
        ++this.pos;
        if (octal) {
          if (this.strict) this.raise(this.pos - 2, "Octal literal in strict mode");
          this.pos += octal.length - 1;
          return String.fromCharCode(parseInt(octal, 8));
        } else {
          switch (ch) {
            case 110:
              return "\n";
            case 114:
              return "\r";
            case 120:
              return String.fromCharCode(this.readHexChar(2));
            case 117:
              return codePointToString(this.readCodePoint());
            case 116:
              return "\t";
            case 98:
              return "\b";
            case 118:
              return "\u000b";
            case 102:
              return "\f";
            case 48:
              return "\u0000";
            case 13:
              if (this.input.charCodeAt(this.pos) === 10) ++this.pos;
            case 10:
              if (this.options.locations) {
                this.lineStart = this.pos;
                ++this.curLine;
              }
              return "";
            default:
              return String.fromCharCode(ch);
          }
        }
      };
      pp.readHexChar = function(len) {
        var n = this.readInt(16, len);
        if (n === null) this.raise(this.start, "Bad character escape sequence");
        return n;
      };
      var containsEsc;
      pp.readWord1 = function() {
        containsEsc = false;
        var word = "",
          first = true,
          chunkStart = this.pos;
        var astral = this.options.ecmaVersion >= 6;
        while (this.pos < this.input.length) {
          var ch = this.fullCharCodeAtPos();
          if (isIdentifierChar(ch, astral)) {
            this.pos += ch <= 65535 ? 1 : 2;
          } else if (ch === 92) {
            containsEsc = true;
            word += this.input.slice(chunkStart, this.pos);
            var escStart = this.pos;
            if (this.input.charCodeAt(++this.pos) != 117)
              this.raise(this.pos, "Expecting Unicode escape sequence \\uXXXX");
            ++this.pos;
            var esc = this.readCodePoint();
            if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral)) this.raise(escStart, "Invalid Unicode escape");
            word += codePointToString(esc);
            chunkStart = this.pos;
          } else {
            break;
          }
          first = false;
        }
        return word + this.input.slice(chunkStart, this.pos);
      };
      pp.readWord = function() {
        var word = this.readWord1();
        var type = tt.name;
        if ((this.options.ecmaVersion >= 6 || !containsEsc) && this.isKeyword(word)) type = keywordTypes[word];
        return this.finishToken(type, word);
      };
    }, {
      "./identifier": 3,
      "./location": 4,
      "./state": 9,
      "./tokentype": 13,
      "./whitespace": 15
    }],
    13: [function(_dereq_, module, exports) {
      "use strict";
      var _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      exports.__esModule = true;
      var TokenType = exports.TokenType = function TokenType(label) {
        var conf = arguments[1] === undefined ? {} : arguments[1];
        _classCallCheck(this, TokenType);
        this.label = label;
        this.keyword = conf.keyword;
        this.beforeExpr = !!conf.beforeExpr;
        this.startsExpr = !!conf.startsExpr;
        this.isLoop = !!conf.isLoop;
        this.isAssign = !!conf.isAssign;
        this.prefix = !!conf.prefix;
        this.postfix = !!conf.postfix;
        this.binop = conf.binop || null;
        this.updateContext = null;
      };

      function binop(name, prec) {
        return new TokenType(name, {
          beforeExpr: true,
          binop: prec
        });
      }
      var beforeExpr = {
          beforeExpr: true
        },
        startsExpr = {
          startsExpr: true
        };
      var types = {
        num: new TokenType("num", startsExpr),
        regexp: new TokenType("regexp", startsExpr),
        string: new TokenType("string", startsExpr),
        name: new TokenType("name", startsExpr),
        eof: new TokenType("eof"),
        bracketL: new TokenType("[", {
          beforeExpr: true,
          startsExpr: true
        }),
        bracketR: new TokenType("]"),
        braceL: new TokenType("{", {
          beforeExpr: true,
          startsExpr: true
        }),
        braceR: new TokenType("}"),
        parenL: new TokenType("(", {
          beforeExpr: true,
          startsExpr: true
        }),
        parenR: new TokenType(")"),
        comma: new TokenType(",", beforeExpr),
        semi: new TokenType(";", beforeExpr),
        colon: new TokenType(":", beforeExpr),
        dot: new TokenType("."),
        question: new TokenType("?", beforeExpr),
        arrow: new TokenType("=>", beforeExpr),
        template: new TokenType("template"),
        ellipsis: new TokenType("...", beforeExpr),
        backQuote: new TokenType("`", startsExpr),
        dollarBraceL: new TokenType("$\{", {
          beforeExpr: true,
          startsExpr: true
        }),
        eq: new TokenType("=", {
          beforeExpr: true,
          isAssign: true
        }),
        assign: new TokenType("_=", {
          beforeExpr: true,
          isAssign: true
        }),
        incDec: new TokenType("++/--", {
          prefix: true,
          postfix: true,
          startsExpr: true
        }),
        prefix: new TokenType("prefix", {
          beforeExpr: true,
          prefix: true,
          startsExpr: true
        }),
        logicalOR: binop("||", 1),
        logicalAND: binop("&&", 2),
        bitwiseOR: binop("|", 3),
        bitwiseXOR: binop("^", 4),
        bitwiseAND: binop("&", 5),
        equality: binop("==/!=", 6),
        relational: binop("</>", 7),
        bitShift: binop("<</>>", 8),
        plusMin: new TokenType("+/-", {
          beforeExpr: true,
          binop: 9,
          prefix: true,
          startsExpr: true
        }),
        modulo: binop("%", 10),
        star: binop("*", 10),
        slash: binop("/", 10)
      };
      exports.types = types;
      var keywords = {};
      exports.keywords = keywords;

      function kw(name) {
        var options = arguments[1] === undefined ? {} : arguments[1];
        options.keyword = name;
        keywords[name] = types["_" + name] = new TokenType(name, options);
      }
      kw("break");
      kw("case", beforeExpr);
      kw("catch");
      kw("continue");
      kw("debugger");
      kw("default");
      kw("do", {
        isLoop: true
      });
      kw("else", beforeExpr);
      kw("finally");
      kw("for", {
        isLoop: true
      });
      kw("function", startsExpr);
      kw("if");
      kw("return", beforeExpr);
      kw("switch");
      kw("throw", beforeExpr);
      kw("try");
      kw("var");
      kw("let");
      kw("const");
      kw("while", {
        isLoop: true
      });
      kw("with");
      kw("new", {
        beforeExpr: true,
        startsExpr: true
      });
      kw("this", startsExpr);
      kw("super", startsExpr);
      kw("class");
      kw("extends", beforeExpr);
      kw("export");
      kw("import");
      kw("yield", {
        beforeExpr: true,
        startsExpr: true
      });
      kw("null", startsExpr);
      kw("true", startsExpr);
      kw("false", startsExpr);
      kw("in", {
        beforeExpr: true,
        binop: 7
      });
      kw("instanceof", {
        beforeExpr: true,
        binop: 7
      });
      kw("typeof", {
        beforeExpr: true,
        prefix: true,
        startsExpr: true
      });
      kw("void", {
        beforeExpr: true,
        prefix: true,
        startsExpr: true
      });
      kw("delete", {
        beforeExpr: true,
        prefix: true,
        startsExpr: true
      });
    }, {}],
    14: [function(_dereq_, module, exports) {
      "use strict";
      exports.isArray = isArray;
      exports.has = has;
      exports.__esModule = true;

      function isArray(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
      }

      function has(obj, propName) {
        return Object.prototype.hasOwnProperty.call(obj, propName);
      }
    }, {}],
    15: [function(_dereq_, module, exports) {
      "use strict";
      exports.isNewLine = isNewLine;
      exports.__esModule = true;
      var lineBreak = /\r\n?|\n|\u2028|\u2029/;
      exports.lineBreak = lineBreak;
      var lineBreakG = new RegExp(lineBreak.source, "g");
      exports.lineBreakG = lineBreakG;

      function isNewLine(code) {
        return code === 10 || code === 13 || code === 8232 || code == 8233;
      }
      var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
      exports.nonASCIIwhitespace = nonASCIIwhitespace;
    }, {}]
  }, {}, [1])(1)
});;
/*! RESOURCE: /scripts/lib/acorn/dist/acorn_loose.js */
(function(f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f()
  } else if (typeof define === "function" && define.amd) {
    define([], f)
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window
    } else if (typeof global !== "undefined") {
      g = global
    } else if (typeof self !== "undefined") {
      g = self
    } else {
      g = this
    }(g.acorn || (g.acorn = {})).loose = f()
  }
})(function() {
  var define, module, exports;
  return (function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;
          if (!u && a) return a(o, !0);
          if (i) return i(o, !0);
          var f = new Error("Cannot find module '" + o + "'");
          throw f.code = "MODULE_NOT_FOUND", f
        }
        var l = n[o] = {
          exports: {}
        };
        t[o][0].call(l.exports, function(e) {
          var n = t[o][1][e];
          return s(n ? n : e)
        }, l, l.exports, e, t, n, r)
      }
      return n[o].exports
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s
  })({
    1: [function(_dereq_, module, exports) {
      "use strict";
      var _interopRequireWildcard = function(obj) {
        return obj && obj.__esModule ? obj : {
          "default": obj
        };
      };
      exports.parse_dammit = parse_dammit;
      exports.__esModule = true;
      var acorn = _interopRequireWildcard(_dereq_(".."));
      var _state = _dereq_("./state");
      var LooseParser = _state.LooseParser;
      _dereq_("./tokenize");
      _dereq_("./parseutil");
      _dereq_("./statement");
      _dereq_("./expression");
      exports.LooseParser = _state.LooseParser;
      acorn.defaultOptions.tabSize = 4;

      function parse_dammit(input, options) {
        var p = new LooseParser(input, options);
        p.next();
        return p.parseTopLevel();
      }
      acorn.parse_dammit = parse_dammit;
      acorn.LooseParser = LooseParser;
    }, {
      "..": 2,
      "./expression": 3,
      "./parseutil": 4,
      "./state": 5,
      "./statement": 6,
      "./tokenize": 7
    }],
    2: [function(_dereq_, module, exports) {
      "use strict";
      module.exports = typeof acorn != "undefined" ? acorn : _dereq_("./acorn");
    }, {}],
    3: [function(_dereq_, module, exports) {
      "use strict";
      var LooseParser = _dereq_("./state").LooseParser;
      var isDummy = _dereq_("./parseutil").isDummy;
      var tt = _dereq_("..").tokTypes;
      var lp = LooseParser.prototype;
      lp.checkLVal = function(expr, binding) {
        if (!expr) return expr;
        switch (expr.type) {
          case "Identifier":
            return expr;
          case "MemberExpression":
            return binding ? this.dummyIdent() : expr;
          case "ParenthesizedExpression":
            expr.expression = this.checkLVal(expr.expression, binding);
            return expr;
          case "ObjectPattern":
          case "ArrayPattern":
          case "RestElement":
          case "AssignmentPattern":
            if (this.options.ecmaVersion >= 6) return expr;
          default:
            return this.dummyIdent();
        }
      };
      lp.parseExpression = function(noIn) {
        var start = this.storeCurrentPos();
        var expr = this.parseMaybeAssign(noIn);
        if (this.tok.type === tt.comma) {
          var node = this.startNodeAt(start);
          node.expressions = [expr];
          while (this.eat(tt.comma)) node.expressions.push(this.parseMaybeAssign(noIn));
          return this.finishNode(node, "SequenceExpression");
        }
        return expr;
      };
      lp.parseParenExpression = function() {
        this.pushCx();
        this.expect(tt.parenL);
        var val = this.parseExpression();
        this.popCx();
        this.expect(tt.parenR);
        return val;
      };
      lp.parseMaybeAssign = function(noIn) {
        var start = this.storeCurrentPos();
        var left = this.parseMaybeConditional(noIn);
        if (this.tok.type.isAssign) {
          var node = this.startNodeAt(start);
          node.operator = this.tok.value;
          node.left = this.tok.type === tt.eq ? this.toAssignable(left) : this.checkLVal(left);
          this.next();
          node.right = this.parseMaybeAssign(noIn);
          return this.finishNode(node, "AssignmentExpression");
        }
        return left;
      };
      lp.parseMaybeConditional = function(noIn) {
        var start = this.storeCurrentPos();
        var expr = this.parseExprOps(noIn);
        if (this.eat(tt.question)) {
          var node = this.startNodeAt(start);
          node.test = expr;
          node.consequent = this.parseMaybeAssign();
          node.alternate = this.expect(tt.colon) ? this.parseMaybeAssign(noIn) : this.dummyIdent();
          return this.finishNode(node, "ConditionalExpression");
        }
        return expr;
      };
      lp.parseExprOps = function(noIn) {
        var start = this.storeCurrentPos();
        var indent = this.curIndent,
          line = this.curLineStart;
        return this.parseExprOp(this.parseMaybeUnary(noIn), start, -1, noIn, indent, line);
      };
      lp.parseExprOp = function(left, start, minPrec, noIn, indent, line) {
        if (this.curLineStart != line && this.curIndent < indent && this.tokenStartsLine()) return left;
        var prec = this.tok.type.binop;
        if (prec != null && (!noIn || this.tok.type !== tt._in)) {
          if (prec > minPrec) {
            var node = this.startNodeAt(start);
            node.left = left;
            node.operator = this.tok.value;
            this.next();
            if (this.curLineStart != line && this.curIndent < indent && this.tokenStartsLine()) {
              node.right = this.dummyIdent();
            } else {
              var rightStart = this.storeCurrentPos();
              node.right = this.parseExprOp(this.parseMaybeUnary(noIn), rightStart, prec, noIn, indent, line);
            }
            this.finishNode(node, /&&|\|\|/.test(node.operator) ? "LogicalExpression" : "BinaryExpression");
            return this.parseExprOp(node, start, minPrec, noIn, indent, line);
          }
        }
        return left;
      };
      lp.parseMaybeUnary = function(noIn) {
        if (this.tok.type.prefix) {
          var node = this.startNode(),
            update = this.tok.type === tt.incDec;
          node.operator = this.tok.value;
          node.prefix = true;
          this.next();
          node.argument = this.parseMaybeUnary(noIn);
          if (update) node.argument = this.checkLVal(node.argument);
          return this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
        } else if (this.tok.type === tt.ellipsis) {
          var node = this.startNode();
          this.next();
          node.argument = this.parseMaybeUnary(noIn);
          return this.finishNode(node, "SpreadElement");
        }
        var start = this.storeCurrentPos();
        var expr = this.parseExprSubscripts();
        while (this.tok.type.postfix && !this.canInsertSemicolon()) {
          var node = this.startNodeAt(start);
          node.operator = this.tok.value;
          node.prefix = false;
          node.argument = this.checkLVal(expr);
          this.next();
          expr = this.finishNode(node, "UpdateExpression");
        }
        return expr;
      };
      lp.parseExprSubscripts = function() {
        var start = this.storeCurrentPos();
        return this.parseSubscripts(this.parseExprAtom(), start, false, this.curIndent, this.curLineStart);
      };
      lp.parseSubscripts = function(base, start, noCalls, startIndent, line) {
        for (;;) {
          if (this.curLineStart != line && this.curIndent <= startIndent && this.tokenStartsLine()) {
            if (this.tok.type == tt.dot && this.curIndent == startIndent) --startIndent;
            else return base;
          }
          if (this.eat(tt.dot)) {
            var node = this.startNodeAt(start);
            node.object = base;
            if (this.curLineStart != line && this.curIndent <= startIndent && this.tokenStartsLine()) node.property = this.dummyIdent();
            else node.property = this.parsePropertyAccessor() || this.dummyIdent();
            node.computed = false;
            base = this.finishNode(node, "MemberExpression");
          } else if (this.tok.type == tt.bracketL) {
            this.pushCx();
            this.next();
            var node = this.startNodeAt(start);
            node.object = base;
            node.property = this.parseExpression();
            node.computed = true;
            this.popCx();
            this.expect(tt.bracketR);
            base = this.finishNode(node, "MemberExpression");
          } else if (!noCalls && this.tok.type == tt.parenL) {
            var node = this.startNodeAt(start);
            node.callee = base;
            node.arguments = this.parseExprList(tt.parenR);
            base = this.finishNode(node, "CallExpression");
          } else if (this.tok.type == tt.backQuote) {
            var node = this.startNodeAt(start);
            node.tag = base;
            node.quasi = this.parseTemplate();
            base = this.finishNode(node, "TaggedTemplateExpression");
          } else {
            return base;
          }
        }
      };
      lp.parseExprAtom = function() {
        var node = undefined;
        switch (this.tok.type) {
          case tt._this:
          case tt._super:
            var type = this.tok.type === tt._this ? "ThisExpression" : "Super";
            node = this.startNode();
            this.next();
            return this.finishNode(node, type);
          case tt.name:
            var start = this.storeCurrentPos();
            var id = this.parseIdent();
            return this.eat(tt.arrow) ? this.parseArrowExpression(this.startNodeAt(start), [id]) : id;
          case tt.regexp:
            node = this.startNode();
            var val = this.tok.value;
            node.regex = {
              pattern: val.pattern,
              flags: val.flags
            };
            node.value = val.value;
            node.raw = this.input.slice(this.tok.start, this.tok.end);
            this.next();
            return this.finishNode(node, "Literal");
          case tt.num:
          case tt.string:
            node = this.startNode();
            node.value = this.tok.value;
            node.raw = this.input.slice(this.tok.start, this.tok.end);
            this.next();
            return this.finishNode(node, "Literal");
          case tt._null:
          case tt._true:
          case tt._false:
            node = this.startNode();
            node.value = this.tok.type === tt._null ? null : this.tok.type === tt._true;
            node.raw = this.tok.type.keyword;
            this.next();
            return this.finishNode(node, "Literal");
          case tt.parenL:
            var parenStart = this.storeCurrentPos();
            this.next();
            var inner = this.parseExpression();
            this.expect(tt.parenR);
            if (this.eat(tt.arrow)) {
              return this.parseArrowExpression(this.startNodeAt(parenStart), inner.expressions || (isDummy(inner) ? [] : [inner]));
            }
            if (this.options.preserveParens) {
              var par = this.startNodeAt(parenStart);
              par.expression = inner;
              inner = this.finishNode(par, "ParenthesizedExpression");
            }
            return inner;
          case tt.bracketL:
            node = this.startNode();
            node.elements = this.parseExprList(tt.bracketR, true);
            return this.finishNode(node, "ArrayExpression");
          case tt.braceL:
            return this.parseObj();
          case tt._class:
            return this.parseClass();
          case tt._function:
            node = this.startNode();
            this.next();
            return this.parseFunction(node, false);
          case tt._new:
            return this.parseNew();
          case tt._yield:
            node = this.startNode();
            this.next();
            if (this.semicolon() || this.canInsertSemicolon() || this.tok.type != tt.star && !this.tok.type.startsExpr) {
              node.delegate = false;
              node.argument = null;
            } else {
              node.delegate = this.eat(tt.star);
              node.argument = this.parseMaybeAssign();
            }
            return this.finishNode(node, "YieldExpression");
          case tt.backQuote:
            return this.parseTemplate();
          default:
            return this.dummyIdent();
        }
      };
      lp.parseNew = function() {
        var node = this.startNode(),
          startIndent = this.curIndent,
          line = this.curLineStart;
        var meta = this.parseIdent(true);
        if (this.options.ecmaVersion >= 6 && this.eat(tt.dot)) {
          node.meta = meta;
          node.property = this.parseIdent(true);
          return this.finishNode(node, "MetaProperty");
        }
        var start = this.storeCurrentPos();
        node.callee = this.parseSubscripts(this.parseExprAtom(), start, true, startIndent, line);
        if (this.tok.type == tt.parenL) {
          node.arguments = this.parseExprList(tt.parenR);
        } else {
          node.arguments = [];
        }
        return this.finishNode(node, "NewExpression");
      };
      lp.parseTemplateElement = function() {
        var elem = this.startNode();
        elem.value = {
          raw: this.input.slice(this.tok.start, this.tok.end),
          cooked: this.tok.value
        };
        this.next();
        elem.tail = this.tok.type === tt.backQuote;
        return this.finishNode(elem, "TemplateElement");
      };
      lp.parseTemplate = function() {
        var node = this.startNode();
        this.next();
        node.expressions = [];
        var curElt = this.parseTemplateElement();
        node.quasis = [curElt];
        while (!curElt.tail) {
          this.next();
          node.expressions.push(this.parseExpression());
          if (this.expect(tt.braceR)) {
            curElt = this.parseTemplateElement();
          } else {
            curElt = this.startNode();
            curElt.value = {
              cooked: "",
              raw: ""
            };
            curElt.tail = true;
          }
          node.quasis.push(curElt);
        }
        this.expect(tt.backQuote);
        return this.finishNode(node, "TemplateLiteral");
      };
      lp.parseObj = function() {
        var node = this.startNode();
        node.properties = [];
        this.pushCx();
        var indent = this.curIndent + 1,
          line = this.curLineStart;
        this.eat(tt.braceL);
        if (this.curIndent + 1 < indent) {
          indent = this.curIndent;
          line = this.curLineStart;
        }
        while (!this.closes(tt.braceR, indent, line)) {
          var prop = this.startNode(),
            isGenerator = undefined,
            start = undefined;
          if (this.options.ecmaVersion >= 6) {
            start = this.storeCurrentPos();
            prop.method = false;
            prop.shorthand = false;
            isGenerator = this.eat(tt.star);
          }
          this.parsePropertyName(prop);
          if (isDummy(prop.key)) {
            if (isDummy(this.parseMaybeAssign())) this.next();
            this.eat(tt.comma);
            continue;
          }
          if (this.eat(tt.colon)) {
            prop.kind = "init";
            prop.value = this.parseMaybeAssign();
          } else if (this.options.ecmaVersion >= 6 && (this.tok.type === tt.parenL || this.tok.type === tt.braceL)) {
            prop.kind = "init";
            prop.method = true;
            prop.value = this.parseMethod(isGenerator);
          } else if (this.options.ecmaVersion >= 5 && prop.key.type === "Identifier" && !prop.computed && (prop.key.name === "get" || prop.key.name === "set") && (this.tok.type != tt.comma && this.tok.type != tt.braceR)) {
            prop.kind = prop.key.name;
            this.parsePropertyName(prop);
            prop.value = this.parseMethod(false);
          } else {
            prop.kind = "init";
            if (this.options.ecmaVersion >= 6) {
              if (this.eat(tt.eq)) {
                var assign = this.startNodeAt(start);
                assign.operator = "=";
                assign.left = prop.key;
                assign.right = this.parseMaybeAssign();
                prop.value = this.finishNode(assign, "AssignmentExpression");
              } else {
                prop.value = prop.key;
              }
            } else {
              prop.value = this.dummyIdent();
            }
            prop.shorthand = true;
          }
          node.properties.push(this.finishNode(prop, "Property"));
          this.eat(tt.comma);
        }
        this.popCx();
        if (!this.eat(tt.braceR)) {
          this.last.end = this.tok.start;
          if (this.options.locations) this.last.loc.end = this.tok.loc.start;
        }
        return this.finishNode(node, "ObjectExpression");
      };
      lp.parsePropertyName = function(prop) {
        if (this.options.ecmaVersion >= 6) {
          if (this.eat(tt.bracketL)) {
            prop.computed = true;
            prop.key = this.parseExpression();
            this.expect(tt.bracketR);
            return;
          } else {
            prop.computed = false;
          }
        }
        var key = this.tok.type === tt.num || this.tok.type === tt.string ? this.parseExprAtom() : this.parseIdent();
        prop.key = key || this.dummyIdent();
      };
      lp.parsePropertyAccessor = function() {
        if (this.tok.type === tt.name || this.tok.type.keyword) return this.parseIdent();
      };
      lp.parseIdent = function() {
        var name = this.tok.type === tt.name ? this.tok.value : this.tok.type.keyword;
        if (!name) return this.dummyIdent();
        var node = this.startNode();
        this.next();
        node.name = name;
        return this.finishNode(node, "Identifier");
      };
      lp.initFunction = function(node) {
        node.id = null;
        node.params = [];
        if (this.options.ecmaVersion >= 6) {
          node.generator = false;
          node.expression = false;
        }
      };
      lp.toAssignable = function(node, binding) {
        if (this.options.ecmaVersion >= 6 && node) {
          switch (node.type) {
            case "ObjectExpression":
              node.type = "ObjectPattern";
              var props = node.properties;
              for (var i = 0; i < props.length; i++) {
                this.toAssignable(props[i].value, binding);
              }
              break;
            case "ArrayExpression":
              node.type = "ArrayPattern";
              this.toAssignableList(node.elements, binding);
              break;
            case "SpreadElement":
              node.type = "RestElement";
              node.argument = this.toAssignable(node.argument, binding);
              break;
            case "AssignmentExpression":
              node.type = "AssignmentPattern";
              break;
          }
        }
        return this.checkLVal(node, binding);
      };
      lp.toAssignableList = function(exprList, binding) {
        for (var i = 0; i < exprList.length; i++) {
          exprList[i] = this.toAssignable(exprList[i], binding);
        }
        return exprList;
      };
      lp.parseFunctionParams = function(params) {
        params = this.parseExprList(tt.parenR);
        return this.toAssignableList(params, true);
      };
      lp.parseMethod = function(isGenerator) {
        var node = this.startNode();
        this.initFunction(node);
        node.params = this.parseFunctionParams();
        node.generator = isGenerator || false;
        node.expression = this.options.ecmaVersion >= 6 && this.tok.type !== tt.braceL;
        node.body = node.expression ? this.parseMaybeAssign() : this.parseBlock();
        return this.finishNode(node, "FunctionExpression");
      };
      lp.parseArrowExpression = function(node, params) {
        this.initFunction(node);
        node.params = this.toAssignableList(params, true);
        node.expression = this.tok.type !== tt.braceL;
        node.body = node.expression ? this.parseMaybeAssign() : this.parseBlock();
        return this.finishNode(node, "ArrowFunctionExpression");
      };
      lp.parseExprList = function(close, allowEmpty) {
        this.pushCx();
        var indent = this.curIndent,
          line = this.curLineStart,
          elts = [];
        this.next();
        while (!this.closes(close, indent + 1, line)) {
          if (this.eat(tt.comma)) {
            elts.push(allowEmpty ? null : this.dummyIdent());
            continue;
          }
          var elt = this.parseMaybeAssign();
          if (isDummy(elt)) {
            if (this.closes(close, indent, line)) break;
            this.next();
          } else {
            elts.push(elt);
          }
          this.eat(tt.comma);
        }
        this.popCx();
        if (!this.eat(close)) {
          this.last.end = this.tok.start;
          if (this.options.locations) this.last.loc.end = this.tok.loc.start;
        }
        return elts;
      };
    }, {
      "..": 2,
      "./parseutil": 4,
      "./state": 5
    }],
    4: [function(_dereq_, module, exports) {
      "use strict";
      exports.isDummy = isDummy;
      exports.__esModule = true;
      var LooseParser = _dereq_("./state").LooseParser;
      var _ = _dereq_("..");
      var Node = _.Node;
      var SourceLocation = _.SourceLocation;
      var lineBreak = _.lineBreak;
      var isNewLine = _.isNewLine;
      var tt = _.tokTypes;
      var lp = LooseParser.prototype;
      lp.startNode = function() {
        var node = new Node();
        node.start = this.tok.start;
        if (this.options.locations) node.loc = new SourceLocation(this.toks, this.tok.loc.start);
        if (this.options.directSourceFile) node.sourceFile = this.options.directSourceFile;
        if (this.options.ranges) node.range = [this.tok.start, 0];
        return node;
      };
      lp.storeCurrentPos = function() {
        return this.options.locations ? [this.tok.start, this.tok.loc.start] : this.tok.start;
      };
      lp.startNodeAt = function(pos) {
        var node = new Node();
        if (this.options.locations) {
          node.start = pos[0];
          node.loc = new SourceLocation(this.toks, pos[1]);
          pos = pos[0];
        } else {
          node.start = pos;
        }
        if (this.options.directSourceFile) node.sourceFile = this.options.directSourceFile;
        if (this.options.ranges) node.range = [pos, 0];
        return node;
      };
      lp.finishNode = function(node, type) {
        node.type = type;
        node.end = this.last.end;
        if (this.options.locations) node.loc.end = this.last.loc.end;
        if (this.options.ranges) node.range[1] = this.last.end;
        return node;
      };
      lp.dummyIdent = function() {
        var dummy = this.startNode();
        dummy.name = "✖";
        return this.finishNode(dummy, "Identifier");
      };

      function isDummy(node) {
        return node.name == "✖";
      }
      lp.eat = function(type) {
        if (this.tok.type === type) {
          this.next();
          return true;
        } else {
          return false;
        }
      };
      lp.isContextual = function(name) {
        return this.tok.type === tt.name && this.tok.value === name;
      };
      lp.eatContextual = function(name) {
        return this.tok.value === name && this.eat(tt.name);
      };
      lp.canInsertSemicolon = function() {
        return this.tok.type === tt.eof || this.tok.type === tt.braceR || lineBreak.test(this.input.slice(this.last.end, this.tok.start));
      };
      lp.semicolon = function() {
        return this.eat(tt.semi);
      };
      lp.expect = function(type) {
        if (this.eat(type)) return true;
        for (var i = 1; i <= 2; i++) {
          if (this.lookAhead(i).type == type) {
            for (var j = 0; j < i; j++) {
              this.next();
            }
            return true;
          }
        }
      };
      lp.pushCx = function() {
        this.context.push(this.curIndent);
      };
      lp.popCx = function() {
        this.curIndent = this.context.pop();
      };
      lp.lineEnd = function(pos) {
        while (pos < this.input.length && !isNewLine(this.input.charCodeAt(pos))) ++pos;
        return pos;
      };
      lp.indentationAfter = function(pos) {
        for (var count = 0;; ++pos) {
          var ch = this.input.charCodeAt(pos);
          if (ch === 32) ++count;
          else if (ch === 9) count += this.options.tabSize;
          else return count;
        }
      };
      lp.closes = function(closeTok, indent, line, blockHeuristic) {
        if (this.tok.type === closeTok || this.tok.type === tt.eof) return true;
        return line != this.curLineStart && this.curIndent < indent && this.tokenStartsLine() && (!blockHeuristic || this.nextLineStart >= this.input.length || this.indentationAfter(this.nextLineStart) < indent);
      };
      lp.tokenStartsLine = function() {
        for (var p = this.tok.start - 1; p >= this.curLineStart; --p) {
          var ch = this.input.charCodeAt(p);
          if (ch !== 9 && ch !== 32) return false;
        }
        return true;
      };
    }, {
      "..": 2,
      "./state": 5
    }],
    5: [function(_dereq_, module, exports) {
      "use strict";
      exports.LooseParser = LooseParser;
      exports.__esModule = true;
      var _ = _dereq_("..");
      var tokenizer = _.tokenizer;
      var SourceLocation = _.SourceLocation;
      var tt = _.tokTypes;

      function LooseParser(input, options) {
        this.toks = tokenizer(input, options);
        this.options = this.toks.options;
        this.input = this.toks.input;
        this.tok = this.last = {
          type: tt.eof,
          start: 0,
          end: 0
        };
        if (this.options.locations) {
          var here = this.toks.curPosition();
          this.tok.loc = new SourceLocation(this.toks, here, here);
        }
        this.ahead = [];
        this.context = [];
        this.curIndent = 0;
        this.curLineStart = 0;
        this.nextLineStart = this.lineEnd(this.curLineStart) + 1;
      }
    }, {
      "..": 2
    }],
    6: [function(_dereq_, module, exports) {
      "use strict";
      var LooseParser = _dereq_("./state").LooseParser;
      var isDummy = _dereq_("./parseutil").isDummy;
      var _ = _dereq_("..");
      var getLineInfo = _.getLineInfo;
      var tt = _.tokTypes;
      var lp = LooseParser.prototype;
      lp.parseTopLevel = function() {
        var node = this.startNodeAt(this.options.locations ? [0, getLineInfo(this.input, 0)] : 0);
        node.body = [];
        while (this.tok.type !== tt.eof) node.body.push(this.parseStatement());
        this.last = this.tok;
        if (this.options.ecmaVersion >= 6) {
          node.sourceType = this.options.sourceType;
        }
        return this.finishNode(node, "Program");
      };
      lp.parseStatement = function() {
        var starttype = this.tok.type,
          node = this.startNode();
        switch (starttype) {
          case tt._break:
          case tt._continue:
            this.next();
            var isBreak = starttype === tt._break;
            if (this.semicolon() || this.canInsertSemicolon()) {
              node.label = null;
            } else {
              node.label = this.tok.type === tt.name ? this.parseIdent() : null;
              this.semicolon();
            }
            return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
          case tt._debugger:
            this.next();
            this.semicolon();
            return this.finishNode(node, "DebuggerStatement");
          case tt._do:
            this.next();
            node.body = this.parseStatement();
            node.test = this.eat(tt._while) ? this.parseParenExpression() : this.dummyIdent();
            this.semicolon();
            return this.finishNode(node, "DoWhileStatement");
          case tt._for:
            this.next();
            this.pushCx();
            this.expect(tt.parenL);
            if (this.tok.type === tt.semi) return this.parseFor(node, null);
            if (this.tok.type === tt._var || this.tok.type === tt._let || this.tok.type === tt._const) {
              var _init = this.parseVar(true);
              if (_init.declarations.length === 1 && (this.tok.type === tt._in || this.isContextual("of"))) {
                return this.parseForIn(node, _init);
              }
              return this.parseFor(node, _init);
            }
            var init = this.parseExpression(true);
            if (this.tok.type === tt._in || this.isContextual("of")) return this.parseForIn(node, this.toAssignable(init));
            return this.parseFor(node, init);
          case tt._function:
            this.next();
            return this.parseFunction(node, true);
          case tt._if:
            this.next();
            node.test = this.parseParenExpression();
            node.consequent = this.parseStatement();
            node.alternate = this.eat(tt._else) ? this.parseStatement() : null;
            return this.finishNode(node, "IfStatement");
          case tt._return:
            this.next();
            if (this.eat(tt.semi) || this.canInsertSemicolon()) node.argument = null;
            else {
              node.argument = this.parseExpression();
              this.semicolon();
            }
            return this.finishNode(node, "ReturnStatement");
          case tt._switch:
            var blockIndent = this.curIndent,
              line = this.curLineStart;
            this.next();
            node.discriminant = this.parseParenExpression();
            node.cases = [];
            this.pushCx();
            this.expect(tt.braceL);
            var cur = undefined;
            while (!this.closes(tt.braceR, blockIndent, line, true)) {
              if (this.tok.type === tt._case || this.tok.type === tt._default) {
                var isCase = this.tok.type === tt._case;
                if (cur) this.finishNode(cur, "SwitchCase");
                node.cases.push(cur = this.startNode());
                cur.consequent = [];
                this.next();
                if (isCase) cur.test = this.parseExpression();
                else cur.test = null;
                this.expect(tt.colon);
              } else {
                if (!cur) {
                  node.cases.push(cur = this.startNode());
                  cur.consequent = [];
                  cur.test = null;
                }
                cur.consequent.push(this.parseStatement());
              }
            }
            if (cur) this.finishNode(cur, "SwitchCase");
            this.popCx();
            this.eat(tt.braceR);
            return this.finishNode(node, "SwitchStatement");
          case tt._throw:
            this.next();
            node.argument = this.parseExpression();
            this.semicolon();
            return this.finishNode(node, "ThrowStatement");
          case tt._try:
            this.next();
            node.block = this.parseBlock();
            node.handler = null;
            if (this.tok.type === tt._catch) {
              var clause = this.startNode();
              this.next();
              this.expect(tt.parenL);
              clause.param = this.toAssignable(this.parseExprAtom(), true);
              this.expect(tt.parenR);
              clause.guard = null;
              clause.body = this.parseBlock();
              node.handler = this.finishNode(clause, "CatchClause");
            }
            node.finalizer = this.eat(tt._finally) ? this.parseBlock() : null;
            if (!node.handler && !node.finalizer) return node.block;
            return this.finishNode(node, "TryStatement");
          case tt._var:
          case tt._let:
          case tt._const:
            return this.parseVar();
          case tt._while:
            this.next();
            node.test = this.parseParenExpression();
            node.body = this.parseStatement();
            return this.finishNode(node, "WhileStatement");
          case tt._with:
            this.next();
            node.object = this.parseParenExpression();
            node.body = this.parseStatement();
            return this.finishNode(node, "WithStatement");
          case tt.braceL:
            return this.parseBlock();
          case tt.semi:
            this.next();
            return this.finishNode(node, "EmptyStatement");
          case tt._class:
            return this.parseClass(true);
          case tt._import:
            return this.parseImport();
          case tt._export:
            return this.parseExport();
          default:
            var expr = this.parseExpression();
            if (isDummy(expr)) {
              this.next();
              if (this.tok.type === tt.eof) return this.finishNode(node, "EmptyStatement");
              return this.parseStatement();
            } else if (starttype === tt.name && expr.type === "Identifier" && this.eat(tt.colon)) {
              node.body = this.parseStatement();
              node.label = expr;
              return this.finishNode(node, "LabeledStatement");
            } else {
              node.expression = expr;
              this.semicolon();
              return this.finishNode(node, "ExpressionStatement");
            }
        }
      };
      lp.parseBlock = function() {
        var node = this.startNode();
        this.pushCx();
        this.expect(tt.braceL);
        var blockIndent = this.curIndent,
          line = this.curLineStart;
        node.body = [];
        while (!this.closes(tt.braceR, blockIndent, line, true)) node.body.push(this.parseStatement());
        this.popCx();
        this.eat(tt.braceR);
        return this.finishNode(node, "BlockStatement");
      };
      lp.parseFor = function(node, init) {
        node.init = init;
        node.test = node.update = null;
        if (this.eat(tt.semi) && this.tok.type !== tt.semi) node.test = this.parseExpression();
        if (this.eat(tt.semi) && this.tok.type !== tt.parenR) node.update = this.parseExpression();
        this.popCx();
        this.expect(tt.parenR);
        node.body = this.parseStatement();
        return this.finishNode(node, "ForStatement");
      };
      lp.parseForIn = function(node, init) {
        var type = this.tok.type === tt._in ? "ForInStatement" : "ForOfStatement";
        this.next();
        node.left = init;
        node.right = this.parseExpression();
        this.popCx();
        this.expect(tt.parenR);
        node.body = this.parseStatement();
        return this.finishNode(node, type);
      };
      lp.parseVar = function(noIn) {
        var node = this.startNode();
        node.kind = this.tok.type.keyword;
        this.next();
        node.declarations = [];
        do {
          var decl = this.startNode();
          decl.id = this.options.ecmaVersion >= 6 ? this.toAssignable(this.parseExprAtom(), true) : this.parseIdent();
          decl.init = this.eat(tt.eq) ? this.parseMaybeAssign(noIn) : null;
          node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
        } while (this.eat(tt.comma));
        if (!node.declarations.length) {
          var decl = this.startNode();
          decl.id = this.dummyIdent();
          node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
        }
        if (!noIn) this.semicolon();
        return this.finishNode(node, "VariableDeclaration");
      };
      lp.parseClass = function(isStatement) {
        var node = this.startNode();
        this.next();
        if (this.tok.type === tt.name) node.id = this.parseIdent();
        else if (isStatement) node.id = this.dummyIdent();
        else node.id = null;
        node.superClass = this.eat(tt._extends) ? this.parseExpression() : null;
        node.body = this.startNode();
        node.body.body = [];
        this.pushCx();
        var indent = this.curIndent + 1,
          line = this.curLineStart;
        this.eat(tt.braceL);
        if (this.curIndent + 1 < indent) {
          indent = this.curIndent;
          line = this.curLineStart;
        }
        while (!this.closes(tt.braceR, indent, line)) {
          if (this.semicolon()) continue;
          var method = this.startNode(),
            isGenerator = undefined;
          if (this.options.ecmaVersion >= 6) {
            method["static"] = false;
            isGenerator = this.eat(tt.star);
          }
          this.parsePropertyName(method);
          if (isDummy(method.key)) {
            if (isDummy(this.parseMaybeAssign())) this.next();
            this.eat(tt.comma);
            continue;
          }
          if (method.key.type === "Identifier" && !method.computed && method.key.name === "static" && (this.tok.type != tt.parenL && this.tok.type != tt.braceL)) {
            method["static"] = true;
            isGenerator = this.eat(tt.star);
            this.parsePropertyName(method);
          } else {
            method["static"] = false;
          }
          if (this.options.ecmaVersion >= 5 && method.key.type === "Identifier" && !method.computed && (method.key.name === "get" || method.key.name === "set") && this.tok.type !== tt.parenL && this.tok.type !== tt.braceL) {
            method.kind = method.key.name;
            this.parsePropertyName(method);
            method.value = this.parseMethod(false);
          } else {
            if (!method.computed && !method["static"] && !isGenerator && (method.key.type === "Identifier" && method.key.name === "constructor" || method.key.type === "Literal" && method.key.value === "constructor")) {
              method.kind = "constructor";
            } else {
              method.kind = "method";
            }
            method.value = this.parseMethod(isGenerator);
          }
          node.body.body.push(this.finishNode(method, "MethodDefinition"));
        }
        this.popCx();
        if (!this.eat(tt.braceR)) {
          this.last.end = this.tok.start;
          if (this.options.locations) this.last.loc.end = this.tok.loc.start;
        }
        this.semicolon();
        this.finishNode(node.body, "ClassBody");
        return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
      };
      lp.parseFunction = function(node, isStatement) {
        this.initFunction(node);
        if (this.options.ecmaVersion >= 6) {
          node.generator = this.eat(tt.star);
        }
        if (this.tok.type === tt.name) node.id = this.parseIdent();
        else if (isStatement) node.id = this.dummyIdent();
        node.params = this.parseFunctionParams();
        node.body = this.parseBlock();
        return this.finishNode(node, isStatement ? "FunctionDeclaration" : "FunctionExpression");
      };
      lp.parseExport = function() {
        var node = this.startNode();
        this.next();
        if (this.eat(tt.star)) {
          node.source = this.eatContextual("from") ? this.parseExprAtom() : null;
          return this.finishNode(node, "ExportAllDeclaration");
        }
        if (this.eat(tt._default)) {
          var expr = this.parseMaybeAssign();
          if (expr.id) {
            switch (expr.type) {
              case "FunctionExpression":
                expr.type = "FunctionDeclaration";
                break;
              case "ClassExpression":
                expr.type = "ClassDeclaration";
                break;
            }
          }
          node.declaration = expr;
          this.semicolon();
          return this.finishNode(node, "ExportDefaultDeclaration");
        }
        if (this.tok.type.keyword) {
          node.declaration = this.parseStatement();
          node.specifiers = [];
          node.source = null;
        } else {
          node.declaration = null;
          node.specifiers = this.parseExportSpecifierList();
          node.source = this.eatContextual("from") ? this.parseExprAtom() : null;
          this.semicolon();
        }
        return this.finishNode(node, "ExportNamedDeclaration");
      };
      lp.parseImport = function() {
        var node = this.startNode();
        this.next();
        if (this.tok.type === tt.string) {
          node.specifiers = [];
          node.source = this.parseExprAtom();
          node.kind = "";
        } else {
          var elt = undefined;
          if (this.tok.type === tt.name && this.tok.value !== "from") {
            elt = this.startNode();
            elt.local = this.parseIdent();
            this.finishNode(elt, "ImportDefaultSpecifier");
            this.eat(tt.comma);
          }
          node.specifiers = this.parseImportSpecifierList();
          node.source = this.eatContextual("from") ? this.parseExprAtom() : null;
          if (elt) node.specifiers.unshift(elt);
        }
        this.semicolon();
        return this.finishNode(node, "ImportDeclaration");
      };
      lp.parseImportSpecifierList = function() {
        var elts = [];
        if (this.tok.type === tt.star) {
          var elt = this.startNode();
          this.next();
          if (this.eatContextual("as")) elt.local = this.parseIdent();
          elts.push(this.finishNode(elt, "ImportNamespaceSpecifier"));
        } else {
          var indent = this.curIndent,
            line = this.curLineStart,
            continuedLine = this.nextLineStart;
          this.pushCx();
          this.eat(tt.braceL);
          if (this.curLineStart > continuedLine) continuedLine = this.curLineStart;
          while (!this.closes(tt.braceR, indent + (this.curLineStart <= continuedLine ? 1 : 0), line)) {
            var elt = this.startNode();
            if (this.eat(tt.star)) {
              if (this.eatContextual("as")) elt.local = this.parseIdent();
              this.finishNode(elt, "ImportNamespaceSpecifier");
            } else {
              if (this.isContextual("from")) break;
              elt.imported = this.parseIdent();
              elt.local = this.eatContextual("as") ? this.parseIdent() : elt.imported;
              this.finishNode(elt, "ImportSpecifier");
            }
            elts.push(elt);
            this.eat(tt.comma);
          }
          this.eat(tt.braceR);
          this.popCx();
        }
        return elts;
      };
      lp.parseExportSpecifierList = function() {
        var elts = [];
        var indent = this.curIndent,
          line = this.curLineStart,
          continuedLine = this.nextLineStart;
        this.pushCx();
        this.eat(tt.braceL);
        if (this.curLineStart > continuedLine) continuedLine = this.curLineStart;
        while (!this.closes(tt.braceR, indent + (this.curLineStart <= continuedLine ? 1 : 0), line)) {
          if (this.isContextual("from")) break;
          var elt = this.startNode();
          elt.local = this.parseIdent();
          elt.exported = this.eatContextual("as") ? this.parseIdent() : elt.local;
          this.finishNode(elt, "ExportSpecifier");
          elts.push(elt);
          this.eat(tt.comma);
        }
        this.eat(tt.braceR);
        this.popCx();
        return elts;
      };
    }, {
      "..": 2,
      "./parseutil": 4,
      "./state": 5
    }],
    7: [function(_dereq_, module, exports) {
      "use strict";
      var _ = _dereq_("..");
      var tt = _.tokTypes;
      var Token = _.Token;
      var isNewLine = _.isNewLine;
      var SourceLocation = _.SourceLocation;
      var getLineInfo = _.getLineInfo;
      var lineBreakG = _.lineBreakG;
      var LooseParser = _dereq_("./state").LooseParser;
      var lp = LooseParser.prototype;

      function isSpace(ch) {
        return ch < 14 && ch > 8 || ch === 32 || ch === 160 || isNewLine(ch);
      }
      lp.next = function() {
        this.last = this.tok;
        if (this.ahead.length) this.tok = this.ahead.shift();
        else this.tok = this.readToken();
        if (this.tok.start >= this.nextLineStart) {
          while (this.tok.start >= this.nextLineStart) {
            this.curLineStart = this.nextLineStart;
            this.nextLineStart = this.lineEnd(this.curLineStart) + 1;
          }
          this.curIndent = this.indentationAfter(this.curLineStart);
        }
      };
      lp.readToken = function() {
        for (;;) {
          try {
            this.toks.next();
            if (this.toks.type === tt.dot && this.input.substr(this.toks.end, 1) === "." && this.options.ecmaVersion >= 6) {
              this.toks.end++;
              this.toks.type = tt.ellipsis;
            }
            return new Token(this.toks);
          } catch (e) {
            if (!(e instanceof SyntaxError)) throw e;
            var msg = e.message,
              pos = e.raisedAt,
              replace = true;
            if (/unterminated/i.test(msg)) {
              pos = this.lineEnd(e.pos + 1);
              if (/string/.test(msg)) {
                replace = {
                  start: e.pos,
                  end: pos,
                  type: tt.string,
                  value: this.input.slice(e.pos + 1, pos)
                };
              } else if (/regular expr/i.test(msg)) {
                var re = this.input.slice(e.pos, pos);
                try {
                  re = new RegExp(re);
                } catch (e) {}
                replace = {
                  start: e.pos,
                  end: pos,
                  type: tt.regexp,
                  value: re
                };
              } else if (/template/.test(msg)) {
                replace = {
                  start: e.pos,
                  end: pos,
                  type: tt.template,
                  value: this.input.slice(e.pos, pos)
                };
              } else {
                replace = false;
              }
            } else if (/invalid (unicode|regexp|number)|expecting unicode|octal literal|is reserved|directly after number|expected number in radix/i.test(msg)) {
              while (pos < this.input.length && !isSpace(this.input.charCodeAt(pos))) ++pos;
            } else if (/character escape|expected hexadecimal/i.test(msg)) {
              while (pos < this.input.length) {
                var ch = this.input.charCodeAt(pos++);
                if (ch === 34 || ch === 39 || isNewLine(ch)) break;
              }
            } else if (/unexpected character/i.test(msg)) {
              pos++;
              replace = false;
            } else if (/regular expression/i.test(msg)) {
              replace = true;
            } else {
              throw e;
            }
            this.resetTo(pos);
            if (replace === true) replace = {
              start: pos,
              end: pos,
              type: tt.name,
              value: "✖"
            };
            if (replace) {
              if (this.options.locations) replace.loc = new SourceLocation(this.toks, getLineInfo(this.input, replace.start), getLineInfo(this.input, replace.end));
              return replace;
            }
          }
        }
      };
      lp.resetTo = function(pos) {
        this.toks.pos = pos;
        var ch = this.input.charAt(pos - 1);
        this.toks.exprAllowed = !ch || /[\[\{\(,;:?\/*=+\-~!|&%^<>]/.test(ch) || /[enwfd]/.test(ch) && /\b(keywords|case|else|return|throw|new|in|(instance|type)of|delete|void)$/.test(this.input.slice(pos - 10, pos));
        if (this.options.locations) {
          this.toks.curLine = 1;
          this.toks.lineStart = lineBreakG.lastIndex = 0;
          var match = undefined;
          while ((match = lineBreakG.exec(this.input)) && match.index < pos) {
            ++this.toks.curLine;
            this.toks.lineStart = match.index + match[0].length;
          }
        }
      };
      lp.lookAhead = function(n) {
        while (n > this.ahead.length) this.ahead.push(this.readToken());
        return this.ahead[n - 1];
      };
    }, {
      "..": 2,
      "./state": 5
    }]
  }, {}, [1])(1)
});;
/*! RESOURCE: /scripts/lib/acorn/dist/walk.js */
(function(f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f()
  } else if (typeof define === "function" && define.amd) {
    define([], f)
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window
    } else if (typeof global !== "undefined") {
      g = global
    } else if (typeof self !== "undefined") {
      g = self
    } else {
      g = this
    }(g.acorn || (g.acorn = {})).walk = f()
  }
})(function() {
    var define, module, exports;
    return (function e(t, n, r) {
        function s(o, u) {
          if (!n[o]) {
            if (!t[o]) {
              var a = typeof require == "function" && require;
              if (!u && a) return a(o, !0);
              if (i) return i(o, !0);
              var f = new Error("Cannot find module '" + o + "'");
              throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = {
              exports: {}
            };
            t[o][0].call(l.exports, function(e) {
              var n = t[o][1][e];
              return s(n ? n : e)
            }, l, l.exports, e, t, n, r)
          }
          return n[o].exports
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s
      })({
          1: [function(_dereq_, module, exports) {
                "use strict";
                var _classCallCheck = function(instance, Constructor) {
                  if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                  }
                };
                exports.simple = simple;
                exports.ancestor = ancestor;
                exports.recursive = recursive;
                exports.findNodeAt = findNodeAt;
                exports.findNodeAround = findNodeAround;
                exports.findNodeAfter = findNodeAfter;
                exports.findNodeBefore = findNodeBefore;
                exports.make = make;
                exports.__esModule = true;

                function simple(node, visitors, base, state, override) {
                  if (!base) base = exports.base;
                  (function c(node, st, override) {
                    var type = override || node.type,
                      found = visitors[type];
                    base[type](node, st, c);
                    if (found) found(node, st);
                  })(node, state, override);
                }

                function ancestor(node, visitors, base, state) {
                  if (!base) base = exports.base;
                  if (!state) state = [];
                  (function c(node, st, override) {
                    var type = override || node.type,
                      found = visitors[type];
                    if (node != st[st.length - 1]) {
                      st = st.slice();
                      st.push(node);
                    }
                    base[type](node, st, c);
                    if (found) found(node, st);
                  })(node, state);
                }

                function recursive(node, state, funcs, base, override) {
                  var visitor = funcs ? exports.make(funcs, base) : base;
                  (function c(node, st, override) {
                    visitor[override || node.type](node, st, c);
                  })(node, state, override);
                }

                function makeTest(test) {
                  if (typeof test == "string") {
                    return function(type) {
                      return type == test;
                    };
                  } else if (!test) {
                    return function() {
                      return true;
                    };
                  } else {
                    return test;
                  }
                }
                var Found = function Found(node, state) {
                  _classCallCheck(this, Found);
                  this.node = node;
                  this.state = state;
                };

                function findNodeAt(node, start, end, test, base, state) {
                  test = makeTest(test);
                  if (!base) base = exports.base;
                  try {;
                    (function c(node, st, override) {
                      var type = override || node.type;
                      if ((start == null || node.start <= start) && (end == null || node.end >= end)) base[type](node, st, c);
                      if (test(type, node) && (start == null || node.start == start) && (end == null || node.end == end)) throw new Found(node, st);
                    })(node, state);
                  } catch (e) {
                    if (e instanceof Found) {
                      return e;
                    }
                    throw e;
                  }
                }

                function findNodeAround(node, pos, test, base, state) {
                  test = makeTest(test);
                  if (!base) base = exports.base;
                  try {;
                    (function c(node, st, override) {
                      var type = override || node.type;
                      if (node.start > pos || node.end < pos) {
                        return;
                      }
                      base[type](node, st, c);
                      if (test(type, node)) throw new Found(node, st);
                    })(node, state);
                  } catch (e) {
                    if (e instanceof Found) {
                      return e;
                    }
                    throw e;
                  }
                }

                function findNodeAfter(node, pos, test, base, state) {
                  test = makeTest(test);
                  if (!base) base = exports.base;
                  try {;
                    (function c(node, st, override) {
                      if (node.end < pos) {
                        return;
                      }
                      var type = override || node.type;
                      if (node.start >= pos && test(type, node)) throw new Found(node, st);
                      base[type](node, st, c);
                    })(node, state);
                  } catch (e) {
                    if (e ins