/*! RESOURCE: /scripts/highcharts/modules/treemap.js */
(function(q) {
    "object" === typeof module && module.exports ? module.exports = q : q(Highcharts)
})(function(q) {
    (function(g) {
        var q = g.seriesType,
            l = g.seriesTypes,
            E = g.map,
            v = g.merge,
            y = g.extend,
            z = g.noop,
            n = g.each,
            x = g.grep,
            F = g.isNumber,
            A = g.isString,
            k = g.pick,
            r = g.Series,
            G = g.stableSort,
            B = g.Color,
            H = function(a, b, c) {
                var e;
                c = c || this;
                for (e in a) a.hasOwnProperty(e) && b.call(c, a[e], e, a)
            },
            C = function(a, b, c, e) {
                e = e || this;
                a = a || [];
                n(a, function(d, f) {
                    c = b.call(e, c, d, f, a)
                });
                return c
            },
            w = function(a, b, c) {
                c = c || this;
                a = b.call(c, a);
                !1 !== a && w(a,
                    b, c)
            };
        q("treemap", "scatter", {
            showInLegend: !1,
            marker: !1,
            dataLabels: {
                enabled: !0,
                defer: !1,
                verticalAlign: "middle",
                formatter: function() {
                    return this.point.name || this.point.id
                },
                inside: !0
            },
            tooltip: {
                headerFormat: "",
                pointFormat: "\x3cb\x3e{point.name}\x3c/b\x3e: {point.value}\x3c/b\x3e\x3cbr/\x3e"
            },
            layoutAlgorithm: "sliceAndDice",
            layoutStartingDirection: "vertical",
            alternateStartingDirection: !1,
            levelIsConstant: !0,
            drillUpButton: {
                position: {
                    align: "right",
                    x: -10,
                    y: 10
                }
            },
            borderColor: "#e6e6e6",
            borderWidth: 1,
            opacity: .15,
            states: {
                hover: {
                    borderColor: "#999999",
                    brightness: l.heatmap ? 0 : .1,
                    opacity: .75,
                    shadow: !1
                }
            }
        }, {
            pointArrayMap: ["value"],
            axisTypes: l.heatmap ? ["xAxis", "yAxis", "colorAxis"] : ["xAxis", "yAxis"],
            optionalAxis: "colorAxis",
            getSymbol: z,
            parallelArrays: ["x", "y", "value", "colorValue"],
            colorKey: "colorValue",
            translateColors: l.heatmap && l.heatmap.prototype.translateColors,
            trackerGroups: ["group", "dataLabelsGroup"],
            getListOfParents: function(a, b) {
                a = C(a, function(a, b, d) {
                    b = k(b.parent, "");
                    void 0 === a[b] && (a[b] = []);
                    a[b].push(d);
                    return a
                }, {});
                H(a, function(a, e, d) {
                    "" !== e && -1 === g.inArray(e, b) && (n(a, function(a) {
                        d[""].push(a)
                    }), delete d[e])
                });
                return a
            },
            getTree: function() {
                var a = E(this.data, function(a) {
                        return a.id
                    }),
                    a = this.getListOfParents(this.data, a);
                this.nodeMap = [];
                return this.buildNode("", -1, 0, a, null)
            },
            init: function(a, b) {
                r.prototype.init.call(this, a, b);
                this.options.allowDrillToNode && g.addEvent(this, "click", this.onClickDrillToNode)
            },
            buildNode: function(a, b, c, e, d) {
                var f = this,
                    h = [],
                    D = f.points[b],
                    p;
                n(e[a] || [], function(b) {
                    p = f.buildNode(f.points[b].id,
                        b, c + 1, e, a);
                    h.push(p)
                });
                b = {
                    id: a,
                    i: b,
                    children: h,
                    level: c,
                    parent: d,
                    visible: !1
                };
                f.nodeMap[b.id] = b;
                D && (D.node = b);
                return b
            },
            setTreeValues: function(a) {
                var b = this,
                    c = b.options,
                    e = 0,
                    d = [],
                    f, h = b.points[a.i];
                w(b.nodeMap[b.rootNode], function(a) {
                    var c = !1,
                        d = a.parent;
                    a.visible = !0;
                    if (d || "" === d) c = b.nodeMap[d];
                    return c
                });
                w(b.nodeMap[b.rootNode].children, function(a) {
                    var b = !1;
                    n(a, function(a) {
                        a.visible = !0;
                        a.children.length && (b = (b || []).concat(a.children))
                    });
                    return b
                });
                n(a.children, function(a) {
                    a = b.setTreeValues(a);
                    d.push(a);
                    a.ignore ? w(a.children, function(a) {
                        var b = !1;
                        n(a, function(a) {
                            y(a, {
                                ignore: !0,
                                isLeaf: !1,
                                visible: !1
                            });
                            a.children.length && (b = (b || []).concat(a.children))
                        });
                        return b
                    }) : e += a.val
                });
                G(d, function(a, b) {
                    return a.sortIndex - b.sortIndex
                });
                f = k(h && h.options.value, e);
                h && (h.value = f);
                y(a, {
                    children: d,
                    childrenTotal: e,
                    ignore: !(k(h && h.visible, !0) && 0 < f),
                    isLeaf: a.visible && !e,
                    levelDynamic: c.levelIsConstant ? a.level : a.level - b.nodeMap[b.rootNode].level,
                    name: k(h && h.name, ""),
                    sortIndex: k(h && h.sortIndex, -f),
                    val: f
                });
                return a
            },
            calculateChildrenAreas: function(a,
                b) {
                var c = this,
                    e = c.options,
                    d = this.levelMap[a.levelDynamic + 1],
                    f = k(c[d && d.layoutAlgorithm] && d.layoutAlgorithm, e.layoutAlgorithm),
                    h = e.alternateStartingDirection,
                    g = [];
                a = x(a.children, function(a) {
                    return !a.ignore
                });
                d && d.layoutStartingDirection && (b.direction = "vertical" === d.layoutStartingDirection ? 0 : 1);
                g = c[f](b, a);
                n(a, function(a, d) {
                    d = g[d];
                    a.values = v(d, {
                        val: a.childrenTotal,
                        direction: h ? 1 - b.direction : b.direction
                    });
                    a.pointValues = v(d, {
                        x: d.x / c.axisRatio,
                        width: d.width / c.axisRatio
                    });
                    a.children.length && c.calculateChildrenAreas(a,
                        a.values)
                })
            },
            setPointValues: function() {
                var a = this,
                    b = a.xAxis,
                    c = a.yAxis;
                n(a.points, function(e) {
                    var d = e.node,
                        f = d.pointValues,
                        h, g, p = (a.pointAttribs(e)["stroke-width"] || 0) % 2 / 2;
                    f && d.visible ? (d = Math.round(b.translate(f.x, 0, 0, 0, 1)) - p, h = Math.round(b.translate(f.x + f.width, 0, 0, 0, 1)) - p, g = Math.round(c.translate(f.y, 0, 0, 0, 1)) - p, f = Math.round(c.translate(f.y + f.height, 0, 0, 0, 1)) - p, e.shapeType = "rect", e.shapeArgs = {
                            x: Math.min(d, h),
                            y: Math.min(g, f),
                            width: Math.abs(h - d),
                            height: Math.abs(f - g)
                        }, e.plotX = e.shapeArgs.x + e.shapeArgs.width /
                        2, e.plotY = e.shapeArgs.y + e.shapeArgs.height / 2) : (delete e.plotX, delete e.plotY)
                })
            },
            setColorRecursive: function(a, b, c) {
                var e = this,
                    d, f;
                a && (d = e.points[a.i], f = e.levelMap[a.levelDynamic], b = k(d && d.options.color, f && f.color, b), c = k(d && d.options.colorIndex, f && f.colorIndex, c), d && (d.color = b, d.colorIndex = c), a.children.length && n(a.children, function(a) {
                    e.setColorRecursive(a, b, c)
                }))
            },
            algorithmGroup: function(a, b, c, e) {
                this.height = a;
                this.width = b;
                this.plot = e;
                this.startDirection = this.direction = c;
                this.lH = this.nH = this.lW =
                    this.nW = this.total = 0;
                this.elArr = [];
                this.lP = {
                    total: 0,
                    lH: 0,
                    nH: 0,
                    lW: 0,
                    nW: 0,
                    nR: 0,
                    lR: 0,
                    aspectRatio: function(a, b) {
                        return Math.max(a / b, b / a)
                    }
                };
                this.addElement = function(a) {
                    this.lP.total = this.elArr[this.elArr.length - 1];
                    this.total += a;
                    0 === this.direction ? (this.lW = this.nW, this.lP.lH = this.lP.total / this.lW, this.lP.lR = this.lP.aspectRatio(this.lW, this.lP.lH), this.nW = this.total / this.height, this.lP.nH = this.lP.total / this.nW, this.lP.nR = this.lP.aspectRatio(this.nW, this.lP.nH)) : (this.lH = this.nH, this.lP.lW = this.lP.total /
                        this.lH, this.lP.lR = this.lP.aspectRatio(this.lP.lW, this.lH), this.nH = this.total / this.width, this.lP.nW = this.lP.total / this.nH, this.lP.nR = this.lP.aspectRatio(this.lP.nW, this.nH));
                    this.elArr.push(a)
                };
                this.reset = function() {
                    this.lW = this.nW = 0;
                    this.elArr = [];
                    this.total = 0
                }
            },
            algorithmCalcPoints: function(a, b, c, e) {
                var d, f, h, g, p = c.lW,
                    k = c.lH,
                    m = c.plot,
                    l, t = 0,
                    u = c.elArr.length - 1;
                b ? (p = c.nW, k = c.nH) : l = c.elArr[c.elArr.length - 1];
                n(c.elArr, function(a) {
                    if (b || t < u) 0 === c.direction ? (d = m.x, f = m.y, h = p, g = a / h) : (d = m.x, f = m.y, g = k, h = a / g),
                        e.push({
                            x: d,
                            y: f,
                            width: h,
                            height: g
                        }), 0 === c.direction ? m.y += g : m.x += h;
                    t += 1
                });
                c.reset();
                0 === c.direction ? c.width -= p : c.height -= k;
                m.y = m.parent.y + (m.parent.height - c.height);
                m.x = m.parent.x + (m.parent.width - c.width);
                a && (c.direction = 1 - c.direction);
                b || c.addElement(l)
            },
            algorithmLowAspectRatio: function(a, b, c) {
                var e = [],
                    d = this,
                    f, g = {
                        x: b.x,
                        y: b.y,
                        parent: b
                    },
                    k = 0,
                    p = c.length - 1,
                    l = new this.algorithmGroup(b.height, b.width, b.direction, g);
                n(c, function(c) {
                    f = c.val / b.val * b.height * b.width;
                    l.addElement(f);
                    l.lP.nR > l.lP.lR && d.algorithmCalcPoints(a, !1, l, e, g);
                    k === p && d.algorithmCalcPoints(a, !0, l, e, g);
                    k += 1
                });
                return e
            },
            algorithmFill: function(a, b, c) {
                var e = [],
                    d, f = b.direction,
                    g = b.x,
                    k = b.y,
                    l = b.width,
                    q = b.height,
                    m, r, t, u;
                n(c, function(c) {
                    d = c.val / b.val * b.height * b.width;
                    m = g;
                    r = k;
                    0 === f ? (u = q, t = d / u, l -= t, g += t) : (t = l, u = d / t, q -= u, k += u);
                    e.push({
                        x: m,
                        y: r,
                        width: t,
                        height: u
                    });
                    a && (f = 1 - f)
                });
                return e
            },
            strip: function(a, b) {
                return this.algorithmLowAspectRatio(!1, a, b)
            },
            squarified: function(a, b) {
                return this.algorithmLowAspectRatio(!0, a, b)
            },
            sliceAndDice: function(a, b) {
                return this.algorithmFill(!0,
                    a, b)
            },
            stripes: function(a, b) {
                return this.algorithmFill(!1, a, b)
            },
            translate: function() {
                var a = this.rootNode = k(this.rootNode, this.options.rootId, ""),
                    b, c;
                r.prototype.translate.call(this);
                this.levelMap = C(this.options.levels, function(a, b) {
                    a[b.level] = b;
                    return a
                }, {});
                c = this.tree = this.getTree();
                b = this.nodeMap[a];
                "" === a || b && b.children.length || (this.drillToNode("", !1), a = this.rootNode, b = this.nodeMap[a]);
                this.setTreeValues(c);
                this.axisRatio = this.xAxis.len / this.yAxis.len;
                this.nodeMap[""].pointValues = a = {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100
                };
                this.nodeMap[""].values = a = v(a, {
                    width: a.width * this.axisRatio,
                    direction: "vertical" === this.options.layoutStartingDirection ? 0 : 1,
                    val: c.val
                });
                this.calculateChildrenAreas(c, a);
                this.colorAxis ? this.translateColors() : this.options.colorByPoint || this.setColorRecursive(this.tree);
                this.options.allowDrillToNode && (b = b.pointValues, this.xAxis.setExtremes(b.x, b.x + b.width, !1), this.yAxis.setExtremes(b.y, b.y + b.height, !1), this.xAxis.setScale(), this.yAxis.setScale());
                this.setPointValues()
            },
            drawDataLabels: function() {
                var a =
                    this,
                    b = x(a.points, function(a) {
                        return a.node.visible
                    }),
                    c, e;
                n(b, function(b) {
                    e = a.levelMap[b.node.levelDynamic];
                    c = {
                        style: {}
                    };
                    b.node.isLeaf || (c.enabled = !1);
                    e && e.dataLabels && (c = v(c, e.dataLabels), a._hasPointLabels = !0);
                    b.shapeArgs && (c.style.width = b.shapeArgs.width, b.dataLabel && b.dataLabel.css({
                        width: b.shapeArgs.width + "px"
                    }));
                    b.dlOptions = v(c, b.options.dataLabels)
                });
                r.prototype.drawDataLabels.call(this)
            },
            alignDataLabel: function(a) {
                l.column.prototype.alignDataLabel.apply(this, arguments);
                a.dataLabel && a.dataLabel.attr({
                    zIndex: a.node.zIndex +
                        1
                })
            },
            pointAttribs: function(a, b) {
                var c = this.levelMap[a.node.levelDynamic] || {},
                    e = this.options,
                    d = b && e.states[b] || {},
                    f = a.getClassName();
                a = {
                    stroke: a.borderColor || c.borderColor || d.borderColor || e.borderColor,
                    "stroke-width": k(a.borderWidth, c.borderWidth, d.borderWidth, e.borderWidth),
                    dashstyle: a.borderDashStyle || c.borderDashStyle || d.borderDashStyle || e.borderDashStyle,
                    fill: a.color || this.color
                }; - 1 !== f.indexOf("highcharts-above-level") ? (a.fill = "none", a["stroke-width"] = 0) : -1 !== f.indexOf("highcharts-internal-node-interactive") ?
                    (b = k(d.opacity, e.opacity), a.fill = B(a.fill).setOpacity(b).get(), a.cursor = "pointer") : -1 !== f.indexOf("highcharts-internal-node") ? a.fill = "none" : b && (a.fill = B(a.fill).brighten(d.brightness).get());
                return a
            },
            drawPoints: function() {
                var a = this,
                    b = x(a.points, function(a) {
                        return a.node.visible
                    });
                n(b, function(b) {
                    var c = "levelGroup-" + b.node.levelDynamic;
                    a[c] || (a[c] = a.chart.renderer.g(c).attr({
                        zIndex: 1E3 - b.node.levelDynamic
                    }).add(a.group));
                    b.group = a[c]
                });
                l.column.prototype.drawPoints.call(this);
                a.options.allowDrillToNode &&
                    n(b, function(b) {
                        b.graphic && (b.drillId = a.options.interactByLeaf ? a.drillToByLeaf(b) : a.drillToByGroup(b))
                    })
            },
            onClickDrillToNode: function(a) {
                var b = (a = a.point) && a.drillId;
                A(b) && (a.setState(""), this.drillToNode(b))
            },
            drillToByGroup: function(a) {
                var b = !1;
                1 !== a.node.level - this.nodeMap[this.rootNode].level || a.node.isLeaf || (b = a.id);
                return b
            },
            drillToByLeaf: function(a) {
                var b = !1;
                if (a.node.parent !== this.rootNode && a.node.isLeaf)
                    for (a = a.node; !b;) a = this.nodeMap[a.parent], a.parent === this.rootNode && (b = a.id);
                return b
            },
            drillUp: function() {
                var a = this.nodeMap[this.rootNode];
                a && A(a.parent) && this.drillToNode(a.parent)
            },
            drillToNode: function(a, b) {
                var c = this.nodeMap[a];
                this.rootNode = a;
                "" === a ? this.drillUpButton = this.drillUpButton.destroy() : this.showDrillUpButton(c && c.name || a);
                this.isDirty = !0;
                k(b, !0) && this.chart.redraw()
            },
            showDrillUpButton: function(a) {
                var b = this;
                a = a || "\x3c Back";
                var c = b.options.drillUpButton,
                    e, d;
                c.text && (a = c.text);
                this.drillUpButton ? this.drillUpButton.attr({
                    text: a
                }).align() : (d = (e = c.theme) && e.states, this.drillUpButton =
                    this.chart.renderer.button(a, null, null, function() {
                        b.drillUp()
                    }, e, d && d.hover, d && d.select).attr({
                        align: c.position.align,
                        zIndex: 7
                    }).add().align(c.position, !1, c.relativeTo || "plotBox"))
            },
            buildKDTree: z,
            drawLegendSymbol: g.LegendSymbolMixin.drawRectangle,
            getExtremes: function() {
                r.prototype.getExtremes.call(this, this.colorValueData);
                this.valueMin = this.dataMin;
                this.valueMax = this.dataMax;
                r.prototype.getExtremes.call(this)
            },
            getExtremesFromAll: !0,
            bindAxes: function() {
                var a = {
                    endOnTick: !1,
                    gridLineWidth: 0,
                    lineWidth: 0,
                    min: 0,
                    dataMin: 0,
                    minPadding: 0,
                    max: 100,
                    dataMax: 100,
                    maxPadding: 0,
                    startOnTick: !1,
                    title: null,
                    tickPositions: []
                };
                r.prototype.bindAxes.call(this);
                g.extend(this.yAxis.options, a);
                g.extend(this.xAxis.options, a)
            }
        }, {
            getClassName: function() {
                var a = g.Point.prototype.getClassName.call(this),
                    b = this.series,
                    c = b.options;
                this.node.level <= b.nodeMap[b.rootNode].level ? a += " highcharts-above-level" : this.node.isLeaf || k(c.interactByLeaf, !c.allowDrillToNode) ? this.node.isLeaf || (a += " highcharts-internal-node") : a += " highcharts-internal-node-interactive";
                return a
            },
            isValid: function() {
                return F(this.value)
            },
            setState: function(a) {
                g.Point.prototype.setState.call(this, a);
                this.graphic.attr({
                    zIndex: "hover" === a ? 1 : 0
                })
            },
            setVisible: l.pie.prototype.pointClass.prototype.setVisible
        })
    })(q)
});;