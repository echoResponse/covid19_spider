(function(P, K) {
    "object" === typeof module && module.exports ? (K["default"] = K, module.exports = P.document ? K(P) : K) : "function" === typeof define && define.amd ? define("highcharts/highmaps", function() {
        return K(P)
    }) : (P.Highcharts && P.Highcharts.error(16, !0), P.Highcharts = K(P))
})("undefined" !== typeof window ? window : this, function(P) {
    function K(c, f, H, D) {
        c.hasOwnProperty(f) || (c[f] = D.apply(null, H))
    }
    var C = {};
    K(C, "parts/Globals.js", [], function() {
        var c = "undefined" !== typeof P ? P : "undefined" !== typeof window ? window : {},
            f = c.document,
            H = c.navigator && c.navigator.userAgent || "",
            D = f && f.createElementNS && !!f.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect,
            A = /(edge|msie|trident)/i.test(H) && !c.opera,
            E = -1 !== H.indexOf("Firefox"),
            p = -1 !== H.indexOf("Chrome"),
            y = E && 4 > parseInt(H.split("Firefox/")[1], 10);
        return {
            product: "Highcharts",
            version: "7.2.1",
            deg2rad: 2 * Math.PI / 360,
            doc: f,
            hasBidiBug: y,
            hasTouch: !!c.TouchEvent,
            isMS: A,
            isWebKit: -1 !== H.indexOf("AppleWebKit"),
            isFirefox: E,
            isChrome: p,
            isSafari: !p && -1 !== H.indexOf("Safari"),
            isTouchDevice: /(Mobile|Android|Windows Phone)/.test(H),
            SVG_NS: "http://www.w3.org/2000/svg",
            chartCount: 0,
            seriesTypes: {},
            symbolSizes: {},
            svg: D,
            win: c,
            marginNames: ["plotTop", "marginRight", "marginBottom", "plotLeft"],
            noop: function() {},
            charts: [],
            dateFormats: {}
        }
    });
    K(C, "parts/Utilities.js", [C["parts/Globals.js"]], function(c) {
        function f(b, d) {
            return parseInt(b, d || 10)
        }
        function H(b) {
            return "string" === typeof b
        }
        function D(b) {
            b = Object.prototype.toString.call(b);
            return "[object Array]" === b || "[object Array Iterator]" === b
        }
        function A(b, d) {
            return !!b && "object" === typeof b && (!d ||
                !D(b))
        }
        function E(b) {
            return A(b) && "number" === typeof b.nodeType
        }
        function p(b) {
            var d = b && b.constructor;
            return !(!A(b, !0) || E(b) || !d || !d.name || "Object" === d.name)
        }
        function y(b) {
            return "number" === typeof b && !isNaN(b) && Infinity > b && -Infinity < b
        }
        function G(b) {
            return "undefined" !== typeof b && null !== b
        }
        function v(b, d, a) {
            var e;
            H(d) ? G(a) ? b.setAttribute(d, a) : b && b.getAttribute && ((e = b.getAttribute(d)) || "class" !== d || (e = b.getAttribute(d + "Name"))) : m(d, function(a, d) {
                b.setAttribute(d, a)
            });
            return e
        }
        function q(b, d) {
            var a;
            b || (b = {});
            for (a in d) b[a] = d[a];
            return b
        }
        function k() {
            for (var b = arguments, d = b.length, a = 0; a < d; a++) {
                var e = b[a];
                if ("undefined" !== typeof e && null !== e) return e
            }
        }
        function m(b, d, a) {
            for (var e in b) Object.hasOwnProperty.call(b, e) && d.call(a || b[e], b[e], e, b)
        }
        c.timers = [];
        var w = c.charts,
            g = c.doc,
            e = c.win;
        c.error = function(b, d, a, h) {
            var n = y(b),
                g = n ? "Highcharts error #" + b + ": www.highcharts.com/errors/" + b + "/" : b.toString(),
                r = function() {
                    if (d) throw Error(g);
                    e.console && console.log(g)
                };
            if ("undefined" !== typeof h) {
                var x = "";
                n && (g += "?");
                c.objectEach(h, function(a, b) {
                    x += "\n" + b + ": " + a;
                    n && (g += encodeURI(b) + "=" + encodeURI(a))
                });
                g += x
            }
            a ? c.fireEvent(a, "displayError", {
                code: b,
                message: g,
                params: h
            }, r) : r()
        };
        c.Fx = function(b, d, a) {
            this.options = d;
            this.elem = b;
            this.prop = a
        };
        c.Fx.prototype = {
            dSetter: function() {
                var b = this.paths[0],
                    d = this.paths[1],
                    a = [],
                    e = this.now,
                    n = b.length;
                if (1 === e) a = this.toD;
                else if (n === d.length && 1 > e)
                    for (; n--;) {
                        var c = parseFloat(b[n]);
                        a[n] = isNaN(c) || "A" === d[n - 4] || "A" === d[n - 5] ? d[n] : e * parseFloat("" + (d[n] - c)) + c
                    } else a = d;
                this.elem.attr("d", a,
                    null, !0)
            },
            update: function() {
                var b = this.elem,
                    d = this.prop,
                    a = this.now,
                    e = this.options.step;
                if (this[d + "Setter"]) this[d + "Setter"]();
                else b.attr ? b.element && b.attr(d, a, null, !0) : b.style[d] = a + this.unit;
                e && e.call(b, a, this)
            },
            run: function(b, d, a) {
                var h = this,
                    n = h.options,
                    g = function(a) {
                        return g.stopped ? !1 : h.step(a)
                    },
                    r = e.requestAnimationFrame || function(a) {
                        setTimeout(a, 13)
                    },
                    x = function() {
                        for (var a = 0; a < c.timers.length; a++) c.timers[a]() || c.timers.splice(a--, 1);
                        c.timers.length && r(x)
                    };
                b !== d || this.elem["forceAnimate:" + this.prop] ?
                    (this.startTime = +new Date, this.start = b, this.end = d, this.unit = a, this.now = this.start, this.pos = 0, g.elem = this.elem, g.prop = this.prop, g() && 1 === c.timers.push(g) && r(x)) : (delete n.curAnim[this.prop], n.complete && 0 === Object.keys(n.curAnim).length && n.complete.call(this.elem))
            },
            step: function(b) {
                var d = +new Date,
                    a = this.options,
                    e = this.elem,
                    n = a.complete,
                    c = a.duration,
                    r = a.curAnim;
                if (e.attr && !e.element) b = !1;
                else if (b || d >= c + this.startTime) {
                    this.now = this.end;
                    this.pos = 1;
                    this.update();
                    var g = r[this.prop] = !0;
                    m(r, function(a) {
                        !0 !==
                            a && (g = !1)
                    });
                    g && n && n.call(e);
                    b = !1
                } else this.pos = a.easing((d - this.startTime) / c), this.now = this.start + (this.end - this.start) * this.pos, this.update(), b = !0;
                return b
            },
            initPath: function(b, d, a) {
                function e(a) {
                    for (k = a.length; k--;) {
                        var b = "M" === a[k] || "L" === a[k];
                        var d = /[a-zA-Z]/.test(a[k + 3]);
                        b && d && a.splice(k + 1, 0, a[k + 1], a[k + 2], a[k + 1], a[k + 2])
                    }
                }
                function n(a, b) {
                    for (; a.length < m;) {
                        a[0] = b[m - a.length];
                        var d = a.slice(0, t);
                        [].splice.apply(a, [0, 0].concat(d));
                        z && (d = a.slice(a.length - t), [].splice.apply(a, [a.length, 0].concat(d)),
                            k--)
                    }
                    a[0] = "M"
                }
                function c(a, b) {
                    for (var d = (m - a.length) / t; 0 < d && d--;) B = a.slice().splice(a.length / u - t, t * u), B[0] = b[m - t - d * t], l && (B[t - 6] = B[t - 2], B[t - 5] = B[t - 1]), [].splice.apply(a, [a.length / u, 0].concat(B)), z && d--
                }
                d = d || "";
                var r = b.startX,
                    g = b.endX,
                    l = -1 < d.indexOf("C"),
                    t = l ? 7 : 3,
                    B, k;
                d = d.split(" ");
                a = a.slice();
                var z = b.isArea,
                    u = z ? 2 : 1;
                l && (e(d), e(a));
                if (r && g) {
                    for (k = 0; k < r.length; k++)
                        if (r[k] === g[0]) {
                            var L = k;
                            break
                        } else if (r[0] === g[g.length - r.length + k]) {
                        L = k;
                        var M = !0;
                        break
                    } else if (r[r.length - 1] === g[g.length - r.length + k]) {
                        L =
                            r.length - k;
                        break
                    }
                    "undefined" === typeof L && (d = [])
                }
                if (d.length && y(L)) {
                    var m = a.length + L * u * t;
                    M ? (n(d, a), c(a, d)) : (n(a, d), c(d, a))
                }
                return [d, a]
            },
            fillSetter: function() {
                c.Fx.prototype.strokeSetter.apply(this, arguments)
            },
            strokeSetter: function() {
                this.elem.attr(this.prop, c.color(this.start).tweenTo(c.color(this.end), this.pos), null, !0)
            }
        };
        c.merge = function() {
            var b, d = arguments,
                a = {},
                e = function(a, b) {
                    "object" !== typeof a && (a = {});
                    m(b, function(d, h) {
                        !A(d, !0) || p(d) || E(d) ? a[h] = b[h] : a[h] = e(a[h] || {}, d)
                    });
                    return a
                };
            !0 === d[0] &&
                (a = d[1], d = Array.prototype.slice.call(d, 2));
            var n = d.length;
            for (b = 0; b < n; b++) a = e(a, d[b]);
            return a
        };
        c.clearTimeout = function(b) {
            G(b) && clearTimeout(b)
        };
        c.css = function(b, d) {
            c.isMS && !c.svg && d && "undefined" !== typeof d.opacity && (d.filter = "alpha(opacity=" + 100 * d.opacity + ")");
            q(b.style, d)
        };
        c.createElement = function(b, d, a, e, n) {
            b = g.createElement(b);
            var h = c.css;
            d && q(b, d);
            n && h(b, {
                padding: "0",
                border: "none",
                margin: "0"
            });
            a && h(b, a);
            e && e.appendChild(b);
            return b
        };
        c.extendClass = function(b, d) {
            var a = function() {};
            a.prototype =
                new b;
            q(a.prototype, d);
            return a
        };
        c.pad = function(b, d, a) {
            return Array((d || 2) + 1 - String(b).replace("-", "").length).join(a || "0") + b
        };
        c.relativeLength = function(b, d, a) {
            return /%$/.test(b) ? d * parseFloat(b) / 100 + (a || 0) : parseFloat(b)
        };
        c.wrap = function(b, d, a) {
            var e = b[d];
            b[d] = function() {
                var b = Array.prototype.slice.call(arguments),
                    d = arguments,
                    h = this;
                h.proceed = function() {
                    e.apply(h, arguments.length ? arguments : d)
                };
                b.unshift(e);
                b = a.apply(this, b);
                h.proceed = null;
                return b
            }
        };
        c.datePropsToTimestamps = function(b) {
            m(b, function(d,
                a) {
                A(d) && "function" === typeof d.getTime ? b[a] = d.getTime() : (A(d) || D(d)) && c.datePropsToTimestamps(d)
            })
        };
        c.formatSingle = function(b, d, a) {
            var e = /\.([0-9])/,
                n = c.defaultOptions.lang;
            /f$/.test(b) ? (a = (a = b.match(e)) ? a[1] : -1, null !== d && (d = c.numberFormat(d, a, n.decimalPoint, -1 < b.indexOf(",") ? n.thousandsSep : ""))) : d = (a || c.time).dateFormat(b, d);
            return d
        };
        c.format = function(b, d, a) {
            for (var e = "{", n = !1, g, r, k, l, t = [], B; b;) {
                e = b.indexOf(e);
                if (-1 === e) break;
                g = b.slice(0, e);
                if (n) {
                    g = g.split(":");
                    r = g.shift().split(".");
                    l = r.length;
                    B = d;
                    for (k = 0; k < l; k++) B && (B = B[r[k]]);
                    g.length && (B = c.formatSingle(g.join(":"), B, a));
                    t.push(B)
                } else t.push(g);
                b = b.slice(e + 1);
                e = (n = !n) ? "}" : "{"
            }
            t.push(b);
            return t.join("")
        };
        c.getMagnitude = function(b) {
            return Math.pow(10, Math.floor(Math.log(b) / Math.LN10))
        };
        c.normalizeTickInterval = function(b, d, a, e, n) {
            var h = b;
            a = k(a, 1);
            var r = b / a;
            d || (d = n ? [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10] : [1, 2, 2.5, 5, 10], !1 === e && (1 === a ? d = d.filter(function(a) {
                return 0 === a % 1
            }) : .1 >= a && (d = [1 / a])));
            for (e = 0; e < d.length && !(h = d[e], n && h * a >= b || !n && r <= (d[e] +
                    (d[e + 1] || d[e])) / 2); e++);
            return h = c.correctFloat(h * a, -Math.round(Math.log(.001) / Math.LN10))
        };
        c.stableSort = function(b, d) {
            var a = b.length,
                e, c;
            for (c = 0; c < a; c++) b[c].safeI = c;
            b.sort(function(a, b) {
                e = d(a, b);
                return 0 === e ? a.safeI - b.safeI : e
            });
            for (c = 0; c < a; c++) delete b[c].safeI
        };
        c.correctFloat = function(b, d) {
            return parseFloat(b.toPrecision(d || 14))
        };
        c.animObject = function(b) {
            return A(b) ? c.merge(b) : {
                duration: b ? 500 : 0
            }
        };
        c.timeUnits = {
            millisecond: 1,
            second: 1E3,
            minute: 6E4,
            hour: 36E5,
            day: 864E5,
            week: 6048E5,
            month: 24192E5,
            year: 314496E5
        };
        c.numberFormat = function(b, d, a, e) {
            b = +b || 0;
            d = +d;
            var h = c.defaultOptions.lang,
                g = (b.toString().split(".")[1] || "").split("e")[0].length,
                r = b.toString().split("e");
            if (-1 === d) d = Math.min(g, 20);
            else if (!y(d)) d = 2;
            else if (d && r[1] && 0 > r[1]) {
                var x = d + +r[1];
                0 <= x ? (r[0] = (+r[0]).toExponential(x).split("e")[0], d = x) : (r[0] = r[0].split(".")[0] || 0, b = 20 > d ? (r[0] * Math.pow(10, r[1])).toFixed(d) : 0, r[1] = 0)
            }
            var l = (Math.abs(r[1] ? r[0] : b) + Math.pow(10, -Math.max(d, g) - 1)).toFixed(d);
            g = String(f(l));
            x = 3 < g.length ? g.length % 3 : 0;
            a = k(a, h.decimalPoint);
            e = k(e, h.thousandsSep);
            b = (0 > b ? "-" : "") + (x ? g.substr(0, x) + e : "");
            b += g.substr(x).replace(/(\d{3})(?=\d)/g, "$1" + e);
            d && (b += a + l.slice(-d));
            r[1] && 0 !== +b && (b += "e" + r[1]);
            return b
        };
        Math.easeInOutSine = function(b) {
            return -.5 * (Math.cos(Math.PI * b) - 1)
        };
        c.getStyle = function(b, d, a) {
            if ("width" === d) return d = Math.min(b.offsetWidth, b.scrollWidth), a = b.getBoundingClientRect && b.getBoundingClientRect().width, a < d && a >= d - 1 && (d = Math.floor(a)), Math.max(0, d - c.getStyle(b, "padding-left") - c.getStyle(b, "padding-right"));
            if ("height" === d) return Math.max(0,
                Math.min(b.offsetHeight, b.scrollHeight) - c.getStyle(b, "padding-top") - c.getStyle(b, "padding-bottom"));
            e.getComputedStyle || c.error(27, !0);
            if (b = e.getComputedStyle(b, void 0)) b = b.getPropertyValue(d), k(a, "opacity" !== d) && (b = f(b));
            return b
        };
        c.inArray = function(b, d, a) {
            return d.indexOf(b, a)
        };
        c.find = Array.prototype.find ? function(b, d) {
            return b.find(d)
        } : function(b, d) {
            var a, e = b.length;
            for (a = 0; a < e; a++)
                if (d(b[a], a)) return b[a]
        };
        c.keys = Object.keys;
        c.offset = function(b) {
            var d = g.documentElement;
            b = b.parentElement || b.parentNode ?
                b.getBoundingClientRect() : {
                    top: 0,
                    left: 0
                };
            return {
                top: b.top + (e.pageYOffset || d.scrollTop) - (d.clientTop || 0),
                left: b.left + (e.pageXOffset || d.scrollLeft) - (d.clientLeft || 0)
            }
        };
        c.stop = function(b, d) {
            for (var a = c.timers.length; a--;) c.timers[a].elem !== b || d && d !== c.timers[a].prop || (c.timers[a].stopped = !0)
        };
        m({
            map: "map",
            each: "forEach",
            grep: "filter",
            reduce: "reduce",
            some: "some"
        }, function(b, d) {
            c[d] = function(a) {
                return Array.prototype[b].apply(a, [].slice.call(arguments, 1))
            }
        });
        c.addEvent = function(b, d, a, e) {
            void 0 === e && (e = {});
            var h = b.addEventListener || c.addEventListenerPolyfill;
            var g = "function" === typeof b && b.prototype ? b.prototype.protoEvents = b.prototype.protoEvents || {} : b.hcEvents = b.hcEvents || {};
            c.Point && b instanceof c.Point && b.series && b.series.chart && (b.series.chart.runTrackerClick = !0);
            h && h.call(b, d, a, !1);
            g[d] || (g[d] = []);
            g[d].push({
                fn: a,
                order: "number" === typeof e.order ? e.order : Infinity
            });
            g[d].sort(function(a, b) {
                return a.order - b.order
            });
            return function() {
                c.removeEvent(b, d, a)
            }
        };
        c.removeEvent = function(b, d, a) {
            function e(a,
                d) {
                var e = b.removeEventListener || c.removeEventListenerPolyfill;
                e && e.call(b, a, d, !1)
            }
            function g(a) {
                var h;
                if (b.nodeName) {
                    if (d) {
                        var l = {};
                        l[d] = !0
                    } else l = a;
                    m(l, function(b, d) {
                        if (a[d])
                            for (h = a[d].length; h--;) e(d, a[d][h].fn)
                    })
                }
            }
            var k;
            ["protoEvents", "hcEvents"].forEach(function(h, c) {
                var l = (c = c ? b : b.prototype) && c[h];
                l && (d ? (k = l[d] || [], a ? (l[d] = k.filter(function(b) {
                    return a !== b.fn
                }), e(d, a)) : (g(l), l[d] = [])) : (g(l), c[h] = {}))
            })
        };
        c.fireEvent = function(b, d, a, e) {
            var h;
            a = a || {};
            if (g.createEvent && (b.dispatchEvent || b.fireEvent)) {
                var c =
                    g.createEvent("Events");
                c.initEvent(d, !0, !0);
                q(c, a);
                b.dispatchEvent ? b.dispatchEvent(c) : b.fireEvent(d, c)
            } else a.target || q(a, {
                    preventDefault: function() {
                        a.defaultPrevented = !0
                    },
                    target: b,
                    type: d
                }),
                function(d, e) {
                    void 0 === d && (d = []);
                    void 0 === e && (e = []);
                    var l = 0,
                        c = 0,
                        r = d.length + e.length;
                    for (h = 0; h < r; h++) !1 === (d[l] ? e[c] ? d[l].order <= e[c].order ? d[l++] : e[c++] : d[l++] : e[c++]).fn.call(b, a) && a.preventDefault()
                }(b.protoEvents && b.protoEvents[d], b.hcEvents && b.hcEvents[d]);
            e && !a.defaultPrevented && e.call(b, a)
        };
        c.animate = function(b,
            d, a) {
            var e, g = "",
                k, r;
            if (!A(a)) {
                var x = arguments;
                a = {
                    duration: x[2],
                    easing: x[3],
                    complete: x[4]
                }
            }
            y(a.duration) || (a.duration = 400);
            a.easing = "function" === typeof a.easing ? a.easing : Math[a.easing] || Math.easeInOutSine;
            a.curAnim = c.merge(d);
            m(d, function(h, t) {
                c.stop(b, t);
                r = new c.Fx(b, a, t);
                k = null;
                "d" === t ? (r.paths = r.initPath(b, b.d, d.d), r.toD = d.d, e = 0, k = 1) : b.attr ? e = b.attr(t) : (e = parseFloat(c.getStyle(b, t)) || 0, "opacity" !== t && (g = "px"));
                k || (k = h);
                k && k.match && k.match("px") && (k = k.replace(/px/g, ""));
                r.run(e, k, g)
            })
        };
        c.seriesType =
            function(b, d, a, e, g) {
                var h = c.getOptions(),
                    r = c.seriesTypes;
                h.plotOptions[b] = c.merge(h.plotOptions[d], a);
                r[b] = c.extendClass(r[d] || function() {}, e);
                r[b].prototype.type = b;
                g && (r[b].prototype.pointClass = c.extendClass(c.Point, g));
                return r[b]
            };
        c.uniqueKey = function() {
            var b = Math.random().toString(36).substring(2, 9),
                d = 0;
            return function() {
                return "highcharts-" + b + "-" + d++
            }
        }();
        c.isFunction = function(b) {
            return "function" === typeof b
        };
        e.jQuery && (e.jQuery.fn.highcharts = function() {
            var b = [].slice.call(arguments);
            if (this[0]) return b[0] ?
                (new(c[H(b[0]) ? b.shift() : "Chart"])(this[0], b[0], b[1]), this) : w[v(this[0], "data-highcharts-chart")]
        });
        return {
            arrayMax: function(b) {
                for (var d = b.length, a = b[0]; d--;) b[d] > a && (a = b[d]);
                return a
            },
            arrayMin: function(b) {
                for (var d = b.length, a = b[0]; d--;) b[d] < a && (a = b[d]);
                return a
            },
            attr: v,
            defined: G,
            destroyObjectProperties: function(b, d) {
                m(b, function(a, e) {
                    a && a !== d && a.destroy && a.destroy();
                    delete b[e]
                })
            },
            discardElement: function(b) {
                var d = c.garbageBin;
                d || (d = c.createElement("div"));
                b && d.appendChild(b);
                d.innerHTML = ""
            },
            erase: function(b,
                d) {
                for (var a = b.length; a--;)
                    if (b[a] === d) {
                        b.splice(a, 1);
                        break
                    }
            },
            extend: q,
            isArray: D,
            isClass: p,
            isDOMElement: E,
            isNumber: y,
            isObject: A,
            isString: H,
            objectEach: m,
            pick: k,
            pInt: f,
            setAnimation: function(b, d) {
                d.renderer.globalAnimation = k(b, d.options.chart.animation, !0)
            },
            splat: function(b) {
                return D(b) ? b : [b]
            },
            syncTimeout: function(b, d, a) {
                if (0 < d) return setTimeout(b, d, a);
                b.call(0, a);
                return -1
            }
        }
    });
    K(C, "parts/Color.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.isNumber,
            D = f.pInt,
            A = c.merge;
        c.Color =
            function(f) {
                if (!(this instanceof c.Color)) return new c.Color(f);
                this.init(f)
            };
        c.Color.prototype = {
            parsers: [{
                regex: /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,
                parse: function(c) {
                    return [D(c[1]), D(c[2]), D(c[3]), parseFloat(c[4], 10)]
                }
            }, {
                regex: /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,
                parse: function(c) {
                    return [D(c[1]), D(c[2]), D(c[3]), 1]
                }
            }],
            names: {
                white: "#ffffff",
                black: "#ffffff"
            },
            init: function(f) {
                var p, y;
                if ((this.input = f = this.names[f &&
                        f.toLowerCase ? f.toLowerCase() : ""] || f) && f.stops) this.stops = f.stops.map(function(f) {
                    return new c.Color(f[1])
                });
                else {
                    if (f && f.charAt && "#" === f.charAt()) {
                        var G = f.length;
                        f = parseInt(f.substr(1), 16);
                        7 === G ? p = [(f & 16711680) >> 16, (f & 65280) >> 8, f & 255, 1] : 4 === G && (p = [(f & 3840) >> 4 | (f & 3840) >> 8, (f & 240) >> 4 | f & 240, (f & 15) << 4 | f & 15, 1])
                    }
                    if (!p)
                        for (y = this.parsers.length; y-- && !p;) {
                            var v = this.parsers[y];
                            (G = v.regex.exec(f)) && (p = v.parse(G))
                        }
                }
                this.rgba = p || []
            },
            get: function(c) {
                var f = this.input,
                    y = this.rgba;
                if (this.stops) {
                    var G = A(f);
                    G.stops = [].concat(G.stops);
                    this.stops.forEach(function(f, q) {
                        G.stops[q] = [G.stops[q][0], f.get(c)]
                    })
                } else G = y && H(y[0]) ? "rgb" === c || !c && 1 === y[3] ? "rgb(" + y[0] + "," + y[1] + "," + y[2] + ")" : "a" === c ? y[3] : "rgba(" + y.join(",") + ")" : f;
                return G
            },
            brighten: function(c) {
                var f, y = this.rgba;
                if (this.stops) this.stops.forEach(function(f) {
                    f.brighten(c)
                });
                else if (H(c) && 0 !== c)
                    for (f = 0; 3 > f; f++) y[f] += D(255 * c), 0 > y[f] && (y[f] = 0), 255 < y[f] && (y[f] = 255);
                return this
            },
            setOpacity: function(c) {
                this.rgba[3] = c;
                return this
            },
            tweenTo: function(c, f) {
                var y = this.rgba,
                    p = c.rgba;
                p.length && y && y.length ? (c = 1 !== p[3] || 1 !== y[3], f = (c ? "rgba(" : "rgb(") + Math.round(p[0] + (y[0] - p[0]) * (1 - f)) + "," + Math.round(p[1] + (y[1] - p[1]) * (1 - f)) + "," + Math.round(p[2] + (y[2] - p[2]) * (1 - f)) + (c ? "," + (p[3] + (y[3] - p[3]) * (1 - f)) : "") + ")") : f = c.input || "none";
                return f
            }
        };
        c.color = function(f) {
            return new c.Color(f)
        }
    });
    K(C, "parts/SvgRenderer.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.attr,
            D = f.defined,
            A = f.destroyObjectProperties,
            E = f.erase,
            p = f.extend,
            y = f.isArray,
            G = f.isNumber,
            v = f.isObject,
            q = f.isString,
            k = f.objectEach,
            m = f.pick,
            w = f.pInt,
            g = f.splat,
            e = c.addEvent,
            b = c.animate,
            d = c.charts,
            a = c.color,
            h = c.css,
            n = c.createElement,
            F = c.deg2rad,
            r = c.doc,
            x = c.hasTouch,
            l = c.isFirefox,
            t = c.isMS,
            B = c.isWebKit,
            I = c.merge,
            z = c.noop,
            u = c.removeEvent,
            L = c.stop,
            M = c.svg,
            T = c.SVG_NS,
            Q = c.symbolSizes,
            R = c.win;
        var N = c.SVGElement = function() {
            return this
        };
        p(N.prototype, {
            opacity: 1,
            SVG_NS: T,
            textProps: "direction fontSize fontWeight fontFamily fontStyle color lineHeight width textAlign textDecoration textOverflow textOutline cursor".split(" "),
            init: function(a, b) {
                this.element = "span" === b ? n(b) : r.createElementNS(this.SVG_NS, b);
                this.renderer = a;
                c.fireEvent(this, "afterInit")
            },
            animate: function(a, d, e) {
                var J = c.animObject(m(d, this.renderer.globalAnimation, !0));
                m(r.hidden, r.msHidden, r.webkitHidden, !1) && (J.duration = 0);
                0 !== J.duration ? (e && (J.complete = e), b(this, a, J)) : (this.attr(a, void 0, e), k(a, function(a, b) {
                    J.step && J.step.call(this, a, {
                        prop: b,
                        pos: 1
                    })
                }, this));
                return this
            },
            complexColor: function(a, b, d) {
                var e = this.renderer,
                    J, u, z, h, l, O, t, r, g, n, B, M = [],
                    L;
                c.fireEvent(this.renderer,
                    "complexColor", {
                        args: arguments
                    },
                    function() {
                        a.radialGradient ? u = "radialGradient" : a.linearGradient && (u = "linearGradient");
                        u && (z = a[u], l = e.gradients, t = a.stops, n = d.radialReference, y(z) && (a[u] = z = {
                            x1: z[0],
                            y1: z[1],
                            x2: z[2],
                            y2: z[3],
                            gradientUnits: "userSpaceOnUse"
                        }), "radialGradient" === u && n && !D(z.gradientUnits) && (h = z, z = I(z, e.getRadialAttr(n, h), {
                            gradientUnits: "userSpaceOnUse"
                        })), k(z, function(a, b) {
                            "id" !== b && M.push(b, a)
                        }), k(t, function(a) {
                            M.push(a)
                        }), M = M.join(","), l[M] ? B = l[M].attr("id") : (z.id = B = c.uniqueKey(), l[M] = O =
                            e.createElement(u).attr(z).add(e.defs), O.radAttr = h, O.stops = [], t.forEach(function(a) {
                                0 === a[1].indexOf("rgba") ? (J = c.color(a[1]), r = J.get("rgb"), g = J.get("a")) : (r = a[1], g = 1);
                                a = e.createElement("stop").attr({
                                    offset: a[0],
                                    "stop-color": r,
                                    "stop-opacity": g
                                }).add(O);
                                O.stops.push(a)
                            })), L = "url(" + e.url + "#" + B + ")", d.setAttribute(b, L), d.gradient = M, a.toString = function() {
                            return L
                        })
                    })
            },
            applyTextOutline: function(a) {
                var b = this.element,
                    d; - 1 !== a.indexOf("contrast") && (a = a.replace(/contrast/g, this.renderer.getContrast(b.style.fill)));
                a = a.split(" ");
                var e = a[a.length - 1];
                if ((d = a[0]) && "none" !== d && c.svg) {
                    this.fakeTS = !0;
                    a = [].slice.call(b.getElementsByTagName("tspan"));
                    this.ySetter = this.xSetter;
                    d = d.replace(/(^[\d\.]+)(.*?)$/g, function(a, b, d) {
                        return 2 * b + d
                    });
                    this.removeTextOutline(a);
                    var J = b.firstChild;
                    a.forEach(function(a, u) {
                        0 === u && (a.setAttribute("x", b.getAttribute("x")), u = b.getAttribute("y"), a.setAttribute("y", u || 0), null === u && b.setAttribute("y", 0));
                        a = a.cloneNode(1);
                        H(a, {
                            "class": "highcharts-text-outline",
                            fill: e,
                            stroke: e,
                            "stroke-width": d,
                            "stroke-linejoin": "round"
                        });
                        b.insertBefore(a, J)
                    })
                }
            },
            removeTextOutline: function(a) {
                for (var b = a.length, d; b--;) d = a[b], "highcharts-text-outline" === d.getAttribute("class") && E(a, this.element.removeChild(d))
            },
            symbolCustomAttribs: "x y width height r start end innerR anchorX anchorY rounded".split(" "),
            attr: function(a, b, d, e) {
                var u = this.element,
                    J, z = this,
                    h, l, t = this.symbolCustomAttribs;
                if ("string" === typeof a && void 0 !== b) {
                    var r = a;
                    a = {};
                    a[r] = b
                }
                "string" === typeof a ? z = (this[a + "Getter"] || this._defaultGetter).call(this,
                    a, u) : (k(a, function(b, d) {
                    h = !1;
                    e || L(this, d);
                    this.symbolName && -1 !== c.inArray(d, t) && (J || (this.symbolAttr(a), J = !0), h = !0);
                    !this.rotation || "x" !== d && "y" !== d || (this.doTransform = !0);
                    h || (l = this[d + "Setter"] || this._defaultSetter, l.call(this, b, d, u), !this.styledMode && this.shadows && /^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(d) && this.updateShadows(d, b, l))
                }, this), this.afterSetters());
                d && d.call(this);
                return z
            },
            afterSetters: function() {
                this.doTransform && (this.updateTransform(), this.doTransform = !1)
            },
            updateShadows: function(a,
                b, d) {
                for (var e = this.shadows, u = e.length; u--;) d.call(e[u], "height" === a ? Math.max(b - (e[u].cutHeight || 0), 0) : "d" === a ? this.d : b, a, e[u])
            },
            addClass: function(a, b) {
                var d = b ? "" : this.attr("class") || "";
                a = (a || "").split(/ /g).reduce(function(a, b) {
                    -1 === d.indexOf(b) && a.push(b);
                    return a
                }, d ? [d] : []).join(" ");
                a !== d && this.attr("class", a);
                return this
            },
            hasClass: function(a) {
                return -1 !== (this.attr("class") || "").split(" ").indexOf(a)
            },
            removeClass: function(a) {
                return this.attr("class", (this.attr("class") || "").replace(q(a) ? new RegExp(" ?" +
                    a + " ?") : a, ""))
            },
            symbolAttr: function(a) {
                var b = this;
                "x y r start end width height innerR anchorX anchorY clockwise".split(" ").forEach(function(d) {
                    b[d] = m(a[d], b[d])
                });
                b.attr({
                    d: b.renderer.symbols[b.symbolName](b.x, b.y, b.width, b.height, b)
                })
            },
            clip: function(a) {
                return this.attr("clip-path", a ? "url(" + this.renderer.url + "#" + a.id + ")" : "none")
            },
            crisp: function(a, b) {
                b = b || a.strokeWidth || 0;
                var d = Math.round(b) % 2 / 2;
                a.x = Math.floor(a.x || this.x || 0) + d;
                a.y = Math.floor(a.y || this.y || 0) + d;
                a.width = Math.floor((a.width || this.width ||
                    0) - 2 * d);
                a.height = Math.floor((a.height || this.height || 0) - 2 * d);
                D(a.strokeWidth) && (a.strokeWidth = b);
                return a
            },
            css: function(a) {
                var b = this.styles,
                    d = {},
                    e = this.element,
                    u = "",
                    z = !b,
                    J = ["textOutline", "textOverflow", "width"];
                a && a.color && (a.fill = a.color);
                b && k(a, function(a, e) {
                    a !== b[e] && (d[e] = a, z = !0)
                });
                if (z) {
                    b && (a = p(b, d));
                    if (a)
                        if (null === a.width || "auto" === a.width) delete this.textWidth;
                        else if ("text" === e.nodeName.toLowerCase() && a.width) var l = this.textWidth = w(a.width);
                    this.styles = a;
                    l && !M && this.renderer.forExport && delete a.width;
                    if (e.namespaceURI === this.SVG_NS) {
                        var c = function(a, b) {
                            return "-" + b.toLowerCase()
                        };
                        k(a, function(a, b) {
                            -1 === J.indexOf(b) && (u += b.replace(/([A-Z])/g, c) + ":" + a + ";")
                        });
                        u && H(e, "style", u)
                    } else h(e, a);
                    this.added && ("text" === this.element.nodeName && this.renderer.buildText(this), a && a.textOutline && this.applyTextOutline(a.textOutline))
                }
                return this
            },
            getStyle: function(a) {
                return R.getComputedStyle(this.element || this, "").getPropertyValue(a)
            },
            strokeWidth: function() {
                if (!this.renderer.styledMode) return this["stroke-width"] ||
                    0;
                var a = this.getStyle("stroke-width");
                if (a.indexOf("px") === a.length - 2) a = w(a);
                else {
                    var b = r.createElementNS(T, "rect");
                    H(b, {
                        width: a,
                        "stroke-width": 0
                    });
                    this.element.parentNode.appendChild(b);
                    a = b.getBBox().width;
                    b.parentNode.removeChild(b)
                }
                return a
            },
            on: function(a, b) {
                var d = this,
                    e = d.element;
                x && "click" === a ? (e.ontouchstart = function(a) {
                    d.touchEventFired = Date.now();
                    a.preventDefault();
                    b.call(e, a)
                }, e.onclick = function(a) {
                    (-1 === R.navigator.userAgent.indexOf("Android") || 1100 < Date.now() - (d.touchEventFired || 0)) && b.call(e,
                        a)
                }) : e["on" + a] = b;
                return this
            },
            setRadialReference: function(a) {
                var b = this.renderer.gradients[this.element.gradient];
                this.element.radialReference = a;
                b && b.radAttr && b.animate(this.renderer.getRadialAttr(a, b.radAttr));
                return this
            },
            translate: function(a, b) {
                return this.attr({
                    translateX: a,
                    translateY: b
                })
            },
            invert: function(a) {
                this.inverted = a;
                this.updateTransform();
                return this
            },
            updateTransform: function() {
                var a = this.translateX || 0,
                    b = this.translateY || 0,
                    d = this.scaleX,
                    e = this.scaleY,
                    u = this.inverted,
                    z = this.rotation,
                    h =
                    this.matrix,
                    l = this.element;
                u && (a += this.width, b += this.height);
                a = ["translate(" + a + "," + b + ")"];
                D(h) && a.push("matrix(" + h.join(",") + ")");
                u ? a.push("rotate(90) scale(-1,1)") : z && a.push("rotate(" + z + " " + m(this.rotationOriginX, l.getAttribute("x"), 0) + " " + m(this.rotationOriginY, l.getAttribute("y") || 0) + ")");
                (D(d) || D(e)) && a.push("scale(" + m(d, 1) + " " + m(e, 1) + ")");
                a.length && l.setAttribute("transform", a.join(" "))
            },
            toFront: function() {
                var a = this.element;
                a.parentNode.appendChild(a);
                return this
            },
            align: function(a, b, d) {
                var e,
                    u = {};
                var z = this.renderer;
                var h = z.alignedObjects;
                var l, J;
                if (a) {
                    if (this.alignOptions = a, this.alignByTranslate = b, !d || q(d)) this.alignTo = e = d || "renderer", E(h, this), h.push(this), d = null
                } else a = this.alignOptions, b = this.alignByTranslate, e = this.alignTo;
                d = m(d, z[e], z);
                e = a.align;
                z = a.verticalAlign;
                h = (d.x || 0) + (a.x || 0);
                var c = (d.y || 0) + (a.y || 0);
                "right" === e ? l = 1 : "center" === e && (l = 2);
                l && (h += (d.width - (a.width || 0)) / l);
                u[b ? "translateX" : "x"] = Math.round(h);
                "bottom" === z ? J = 1 : "middle" === z && (J = 2);
                J && (c += (d.height - (a.height || 0)) /
                    J);
                u[b ? "translateY" : "y"] = Math.round(c);
                this[this.placed ? "animate" : "attr"](u);
                this.placed = !0;
                this.alignAttr = u;
                return this
            },
            getBBox: function(a, b) {
                var d, e = this.renderer,
                    u = this.element,
                    z = this.styles,
                    h = this.textStr,
                    l, J = e.cache,
                    c = e.cacheKeys,
                    t = u.namespaceURI === this.SVG_NS;
                b = m(b, this.rotation, 0);
                var r = e.styledMode ? u && N.prototype.getStyle.call(u, "font-size") : z && z.fontSize;
                if (D(h)) {
                    var g = h.toString(); - 1 === g.indexOf("<") && (g = g.replace(/[0-9]/g, "0"));
                    g += ["", b, r, this.textWidth, z && z.textOverflow].join()
                }
                g && !a &&
                    (d = J[g]);
                if (!d) {
                    if (t || e.forExport) {
                        try {
                            (l = this.fakeTS && function(a) {
                                [].forEach.call(u.querySelectorAll(".highcharts-text-outline"), function(b) {
                                    b.style.display = a
                                })
                            }) && l("none"), d = u.getBBox ? p({}, u.getBBox()) : {
                                width: u.offsetWidth,
                                height: u.offsetHeight
                            }, l && l("")
                        } catch (ba) {
                            ""
                        }
                        if (!d || 0 > d.width) d = {
                            width: 0,
                            height: 0
                        }
                    } else d = this.htmlGetBBox();
                    e.isSVG && (a = d.width, e = d.height, t && (d.height = e = {
                        "11px,17": 14,
                        "13px,20": 16
                    }[z && z.fontSize + "," + Math.round(e)] || e), b && (z = b * F, d.width = Math.abs(e * Math.sin(z)) + Math.abs(a * Math.cos(z)),
                        d.height = Math.abs(e * Math.cos(z)) + Math.abs(a * Math.sin(z))));
                    if (g && 0 < d.height) {
                        for (; 250 < c.length;) delete J[c.shift()];
                        J[g] || c.push(g);
                        J[g] = d
                    }
                }
                return d
            },
            show: function(a) {
                return this.attr({
                    visibility: a ? "inherit" : "visible"
                })
            },
            hide: function(a) {
                a ? this.attr({
                    y: -9999
                }) : this.attr({
                    visibility: "hidden"
                });
                return this
            },
            fadeOut: function(a) {
                var b = this;
                b.animate({
                    opacity: 0
                }, {
                    duration: a || 150,
                    complete: function() {
                        b.attr({
                            y: -9999
                        })
                    }
                })
            },
            add: function(a) {
                var b = this.renderer,
                    d = this.element;
                a && (this.parentGroup = a);
                this.parentInverted =
                    a && a.inverted;
                void 0 !== this.textStr && b.buildText(this);
                this.added = !0;
                if (!a || a.handleZ || this.zIndex) var e = this.zIndexSetter();
                e || (a ? a.element : b.box).appendChild(d);
                if (this.onAdd) this.onAdd();
                return this
            },
            safeRemoveChild: function(a) {
                var b = a.parentNode;
                b && b.removeChild(a)
            },
            destroy: function() {
                var a = this,
                    b = a.element || {},
                    d = a.renderer,
                    e = d.isSVG && "SPAN" === b.nodeName && a.parentGroup,
                    u = b.ownerSVGElement,
                    z = a.clipPath;
                b.onclick = b.onmouseout = b.onmouseover = b.onmousemove = b.point = null;
                L(a);
                z && u && ([].forEach.call(u.querySelectorAll("[clip-path],[CLIP-PATH]"),
                    function(a) {
                        -1 < a.getAttribute("clip-path").indexOf(z.element.id) && a.removeAttribute("clip-path")
                    }), a.clipPath = z.destroy());
                if (a.stops) {
                    for (u = 0; u < a.stops.length; u++) a.stops[u] = a.stops[u].destroy();
                    a.stops = null
                }
                a.safeRemoveChild(b);
                for (d.styledMode || a.destroyShadows(); e && e.div && 0 === e.div.childNodes.length;) b = e.parentGroup, a.safeRemoveChild(e.div), delete e.div, e = b;
                a.alignTo && E(d.alignedObjects, a);
                k(a, function(b, d) {
                    a[d] && a[d].parentGroup === a && a[d].destroy && a[d].destroy();
                    delete a[d]
                })
            },
            shadow: function(a,
                b, d) {
                var e = [],
                    u, z = this.element;
                if (!a) this.destroyShadows();
                else if (!this.shadows) {
                    var h = m(a.width, 3);
                    var l = (a.opacity || .15) / h;
                    var c = this.parentInverted ? "(-1,-1)" : "(" + m(a.offsetX, 1) + ", " + m(a.offsetY, 1) + ")";
                    for (u = 1; u <= h; u++) {
                        var J = z.cloneNode(0);
                        var g = 2 * h + 1 - 2 * u;
                        H(J, {
                            stroke: a.color || "#FFFFFF",
                            "stroke-opacity": l * u,
                            "stroke-width": g,
                            transform: "translate" + c,
                            fill: "none"
                        });
                        J.setAttribute("class", (J.getAttribute("class") || "") + " highcharts-shadow");
                        d && (H(J, "height", Math.max(H(J, "height") - g, 0)), J.cutHeight = g);
                        b ? b.element.appendChild(J) : z.parentNode && z.parentNode.insertBefore(J, z);
                        e.push(J)
                    }
                    this.shadows = e
                }
                return this
            },
            destroyShadows: function() {
                (this.shadows || []).forEach(function(a) {
                    this.safeRemoveChild(a)
                }, this);
                this.shadows = void 0
            },
            xGetter: function(a) {
                "circle" === this.element.nodeName && ("x" === a ? a = "cx" : "y" === a && (a = "cy"));
                return this._defaultGetter(a)
            },
            _defaultGetter: function(a) {
                a = m(this[a + "Value"], this[a], this.element ? this.element.getAttribute(a) : null, 0);
                /^[\-0-9\.]+$/.test(a) && (a = parseFloat(a));
                return a
            },
            dSetter: function(a, b, d) {
                a && a.join && (a = a.join(" "));
                /(NaN| {2}|^$)/.test(a) && (a = "M 0 0");
                this[b] !== a && (d.setAttribute(b, a), this[b] = a)
            },
            dashstyleSetter: function(a) {
                var b, d = this["stroke-width"];
                "inherit" === d && (d = 1);
                if (a = a && a.toLowerCase()) {
                    a = a.replace("shortdashdotdot", "3,1,1,1,1,1,").replace("shortdashdot", "3,1,1,1").replace("shortdot", "1,1,").replace("shortdash", "3,1,").replace("longdash", "8,3,").replace(/dot/g, "1,3,").replace("dash", "4,3,").replace(/,$/, "").split(",");
                    for (b = a.length; b--;) a[b] = w(a[b]) *
                        d;
                    a = a.join(",").replace(/NaN/g, "none");
                    this.element.setAttribute("stroke-dasharray", a)
                }
            },
            alignSetter: function(a) {
                var b = {
                    left: "start",
                    center: "middle",
                    right: "end"
                };
                b[a] && (this.alignValue = a, this.element.setAttribute("text-anchor", b[a]))
            },
            opacitySetter: function(a, b, d) {
                this[b] = a;
                d.setAttribute(b, a)
            },
            titleSetter: function(a) {
                var b = this.element.getElementsByTagName("title")[0];
                b || (b = r.createElementNS(this.SVG_NS, "title"), this.element.appendChild(b));
                b.firstChild && b.removeChild(b.firstChild);
                b.appendChild(r.createTextNode(String(m(a,
                    "")).replace(/<[^>]*>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">")))
            },
            textSetter: function(a) {
                a !== this.textStr && (delete this.bBox, delete this.textPxLength, this.textStr = a, this.added && this.renderer.buildText(this))
            },
            setTextPath: function(a, b) {
                var d = this.element,
                    e = {
                        textAnchor: "text-anchor"
                    },
                    u = !1,
                    h = this.textPathWrapper,
                    l = !h;
                b = I(!0, {
                    enabled: !0,
                    attributes: {
                        dy: -5,
                        startOffset: "50%",
                        textAnchor: "middle"
                    }
                }, b);
                var g = b.attributes;
                if (a && b && b.enabled) {
                    this.options && this.options.padding && (g.dx = -this.options.padding);
                    h || (this.textPathWrapper = h = this.renderer.createElement("textPath"), u = !0);
                    var t = h.element;
                    (b = a.element.getAttribute("id")) || a.element.setAttribute("id", b = c.uniqueKey());
                    if (l)
                        for (a = d.getElementsByTagName("tspan"); a.length;) a[0].setAttribute("y", 0), t.appendChild(a[0]);
                    u && h.add({
                        element: this.text ? this.text.element : d
                    });
                    t.setAttributeNS("http://www.w3.org/1999/xlink", "href", this.renderer.url + "#" + b);
                    D(g.dy) && (t.parentNode.setAttribute("dy", g.dy), delete g.dy);
                    D(g.dx) && (t.parentNode.setAttribute("dx", g.dx),
                        delete g.dx);
                    k(g, function(a, b) {
                        t.setAttribute(e[b] || b, a)
                    });
                    d.removeAttribute("transform");
                    this.removeTextOutline.call(h, [].slice.call(d.getElementsByTagName("tspan")));
                    this.text && !this.renderer.styledMode && this.attr({
                        fill: "none",
                        "stroke-width": 0
                    });
                    this.applyTextOutline = this.updateTransform = z
                } else h && (delete this.updateTransform, delete this.applyTextOutline, this.destroyTextPath(d, a));
                return this
            },
            destroyTextPath: function(a, b) {
                var d;
                b.element.setAttribute("id", "");
                for (d = this.textPathWrapper.element.childNodes; d.length;) a.firstChild.appendChild(d[0]);
                a.firstChild.removeChild(this.textPathWrapper.element);
                delete b.textPathWrapper
            },
            fillSetter: function(a, b, d) {
                "string" === typeof a ? d.setAttribute(b, a) : a && this.complexColor(a, b, d)
            },
            visibilitySetter: function(a, b, d) {
                "inherit" === a ? d.removeAttribute(b) : this[b] !== a && d.setAttribute(b, a);
                this[b] = a
            },
            zIndexSetter: function(a, b) {
                var d = this.renderer,
                    e = this.parentGroup,
                    u = (e || d).element || d.box,
                    z = this.element,
                    h = !1;
                d = u === d.box;
                var l = this.added;
                var c;
                D(a) ? (z.setAttribute("data-z-index", a), a = +a, this[b] === a && (l = !1)) : D(this[b]) &&
                    z.removeAttribute("data-z-index");
                this[b] = a;
                if (l) {
                    (a = this.zIndex) && e && (e.handleZ = !0);
                    b = u.childNodes;
                    for (c = b.length - 1; 0 <= c && !h; c--) {
                        e = b[c];
                        l = e.getAttribute("data-z-index");
                        var g = !D(l);
                        if (e !== z)
                            if (0 > a && g && !d && !c) u.insertBefore(z, b[c]), h = !0;
                            else if (w(l) <= a || g && (!D(a) || 0 <= a)) u.insertBefore(z, b[c + 1] || null), h = !0
                    }
                    h || (u.insertBefore(z, b[d ? 3 : 0] || null), h = !0)
                }
                return h
            },
            _defaultSetter: function(a, b, d) {
                d.setAttribute(b, a)
            }
        });
        N.prototype.yGetter = N.prototype.xGetter;
        N.prototype.translateXSetter = N.prototype.translateYSetter =
            N.prototype.rotationSetter = N.prototype.verticalAlignSetter = N.prototype.rotationOriginXSetter = N.prototype.rotationOriginYSetter = N.prototype.scaleXSetter = N.prototype.scaleYSetter = N.prototype.matrixSetter = function(a, b) {
                this[b] = a;
                this.doTransform = !0
            };
        N.prototype["stroke-widthSetter"] = N.prototype.strokeSetter = function(a, b, d) {
            this[b] = a;
            this.stroke && this["stroke-width"] ? (N.prototype.fillSetter.call(this, this.stroke, "stroke", d), d.setAttribute("stroke-width", this["stroke-width"]), this.hasStroke = !0) : "stroke-width" ===
                b && 0 === a && this.hasStroke ? (d.removeAttribute("stroke"), this.hasStroke = !1) : this.renderer.styledMode && this["stroke-width"] && (d.setAttribute("stroke-width", this["stroke-width"]), this.hasStroke = !0)
        };
        f = c.SVGRenderer = function() {
            this.init.apply(this, arguments)
        };
        p(f.prototype, {
            Element: N,
            SVG_NS: T,
            init: function(a, b, d, u, z, c, g) {
                var t = this.createElement("svg").attr({
                    version: "1.1",
                    "class": "highcharts-root"
                });
                g || t.css(this.getStyle(u));
                u = t.element;
                a.appendChild(u);
                H(a, "dir", "ltr"); - 1 === a.innerHTML.indexOf("xmlns") &&
                    H(u, "xmlns", this.SVG_NS);
                this.isSVG = !0;
                this.box = u;
                this.boxWrapper = t;
                this.alignedObjects = [];
                this.url = (l || B) && r.getElementsByTagName("base").length ? R.location.href.split("#")[0].replace(/<[^>]*>/g, "").replace(/([\('\)])/g, "\\$1").replace(/ /g, "%20") : "";
                this.createElement("desc").add().element.appendChild(r.createTextNode("Created with Highcharts 7.2.1"));
                this.defs = this.createElement("defs").add();
                this.allowHTML = c;
                this.forExport = z;
                this.styledMode = g;
                this.gradients = {};
                this.cache = {};
                this.cacheKeys = [];
                this.imgCount =
                    0;
                this.setSize(b, d, !1);
                var n;
                l && a.getBoundingClientRect && (b = function() {
                    h(a, {
                        left: 0,
                        top: 0
                    });
                    n = a.getBoundingClientRect();
                    h(a, {
                        left: Math.ceil(n.left) - n.left + "px",
                        top: Math.ceil(n.top) - n.top + "px"
                    })
                }, b(), this.unSubPixelFix = e(R, "resize", b))
            },
            definition: function(a) {
                function b(a, e) {
                    var u;
                    g(a).forEach(function(a) {
                        var z = d.createElement(a.tagName),
                            h = {};
                        k(a, function(a, b) {
                            "tagName" !== b && "children" !== b && "textContent" !== b && (h[b] = a)
                        });
                        z.attr(h);
                        z.add(e || d.defs);
                        a.textContent && z.element.appendChild(r.createTextNode(a.textContent));
                        b(a.children || [], z);
                        u = z
                    });
                    return u
                }
                var d = this;
                return b(a)
            },
            getStyle: function(a) {
                return this.style = p({
                    fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
                    fontSize: "12px"
                }, a)
            },
            setStyle: function(a) {
                this.boxWrapper.css(this.getStyle(a))
            },
            isHidden: function() {
                return !this.boxWrapper.getBBox().width
            },
            destroy: function() {
                var a = this.defs;
                this.box = null;
                this.boxWrapper = this.boxWrapper.destroy();
                A(this.gradients || {});
                this.gradients = null;
                a && (this.defs = a.destroy());
                this.unSubPixelFix &&
                    this.unSubPixelFix();
                return this.alignedObjects = null
            },
            createElement: function(a) {
                var b = new this.Element;
                b.init(this, a);
                return b
            },
            draw: z,
            getRadialAttr: function(a, b) {
                return {
                    cx: a[0] - a[2] / 2 + b.cx * a[2],
                    cy: a[1] - a[2] / 2 + b.cy * a[2],
                    r: b.r * a[2]
                }
            },
            truncate: function(a, b, d, e, u, z, h) {
                var l = this,
                    c = a.rotation,
                    g, t = e ? 1 : 0,
                    n = (d || e).length,
                    B = n,
                    k = [],
                    J = function(a) {
                        b.firstChild && b.removeChild(b.firstChild);
                        a && b.appendChild(r.createTextNode(a))
                    },
                    M = function(z, c) {
                        c = c || z;
                        if (void 0 === k[c])
                            if (b.getSubStringLength) try {
                                k[c] = u + b.getSubStringLength(0,
                                    e ? c + 1 : c)
                            } catch (ca) {
                                ""
                            } else l.getSpanWidth && (J(h(d || e, z)), k[c] = u + l.getSpanWidth(a, b));
                        return k[c]
                    },
                    L;
                a.rotation = 0;
                var x = M(b.textContent.length);
                if (L = u + x > z) {
                    for (; t <= n;) B = Math.ceil((t + n) / 2), e && (g = h(e, B)), x = M(B, g && g.length - 1), t === n ? t = n + 1 : x > z ? n = B - 1 : t = B;
                    0 === n ? J("") : d && n === d.length - 1 || J(g || h(d || e, B))
                }
                e && e.splice(0, B);
                a.actualWidth = x;
                a.rotation = c;
                return L
            },
            escapes: {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "'": "&#39;",
                '"': "&quot;"
            },
            buildText: function(a) {
                var b = a.element,
                    d = this,
                    e = d.forExport,
                    u = m(a.textStr, "").toString(),
                    z = -1 !== u.indexOf("<"),
                    l = b.childNodes,
                    c, g = H(b, "x"),
                    t = a.styles,
                    n = a.textWidth,
                    B = t && t.lineHeight,
                    J = t && t.textOutline,
                    L = t && "ellipsis" === t.textOverflow,
                    x = t && "nowrap" === t.whiteSpace,
                    I = t && t.fontSize,
                    F, f = l.length;
                t = n && !a.added && this.box;
                var q = function(a) {
                        var e;
                        d.styledMode || (e = /(px|em)$/.test(a && a.style.fontSize) ? a.style.fontSize : I || d.style.fontSize || 12);
                        return B ? w(B) : d.fontMetrics(e, a.getAttribute("style") ? a : b).h
                    },
                    p = function(a, b) {
                        k(d.escapes, function(d, e) {
                            b && -1 !== b.indexOf(d) || (a = a.toString().replace(new RegExp(d,
                                "g"), e))
                        });
                        return a
                    },
                    y = function(a, b) {
                        var d = a.indexOf("<");
                        a = a.substring(d, a.indexOf(">") - d);
                        d = a.indexOf(b + "=");
                        if (-1 !== d && (d = d + b.length + 1, b = a.charAt(d), '"' === b || "'" === b)) return a = a.substring(d + 1), a.substring(0, a.indexOf(b))
                    },
                    G = /<br.*?>/g;
                var v = [u, L, x, B, J, I, n].join();
                if (v !== a.textCache) {
                    for (a.textCache = v; f--;) b.removeChild(l[f]);
                    z || J || L || n || -1 !== u.indexOf(" ") && (!x || G.test(u)) ? (t && t.appendChild(b), z ? (u = d.styledMode ? u.replace(/<(b|strong)>/g, '<span class="highcharts-strong">').replace(/<(i|em)>/g, '<span class="highcharts-emphasized">') :
                        u.replace(/<(b|strong)>/g, '<span style="font-weight:bold">').replace(/<(i|em)>/g, '<span style="font-style:italic">'), u = u.replace(/<a/g, "<span").replace(/<\/(b|strong|i|em|a)>/g, "</span>").split(G)) : u = [u], u = u.filter(function(a) {
                        return "" !== a
                    }), u.forEach(function(u, z) {
                        var l = 0,
                            t = 0;
                        u = u.replace(/^\s+|\s+$/g, "").replace(/<span/g, "|||<span").replace(/<\/span>/g, "</span>|||");
                        var B = u.split("|||");
                        B.forEach(function(u) {
                            if ("" !== u || 1 === B.length) {
                                var k = {},
                                    J = r.createElementNS(d.SVG_NS, "tspan"),
                                    m, O;
                                (m = y(u, "class")) &&
                                H(J, "class", m);
                                if (m = y(u, "style")) m = m.replace(/(;| |^)color([ :])/, "$1fill$2"), H(J, "style", m);
                                (O = y(u, "href")) && !e && (H(J, "onclick", 'location.href="' + O + '"'), H(J, "class", "highcharts-anchor"), d.styledMode || h(J, {
                                    cursor: "pointer"
                                }));
                                u = p(u.replace(/<[a-zA-Z\/](.|\n)*?>/g, "") || " ");
                                if (" " !== u) {
                                    J.appendChild(r.createTextNode(u));
                                    l ? k.dx = 0 : z && null !== g && (k.x = g);
                                    H(J, k);
                                    b.appendChild(J);
                                    !l && F && (!M && e && h(J, {
                                        display: "block"
                                    }), H(J, "dy", q(J)));
                                    if (n) {
                                        var f = u.replace(/([^\^])-/g, "$1- ").split(" ");
                                        k = !x && (1 < B.length ||
                                            z || 1 < f.length);
                                        O = 0;
                                        var w = q(J);
                                        if (L) c = d.truncate(a, J, u, void 0, 0, Math.max(0, n - parseInt(I || 12, 10)), function(a, b) {
                                            return a.substring(0, b) + "\u2026"
                                        });
                                        else if (k)
                                            for (; f.length;) f.length && !x && 0 < O && (J = r.createElementNS(T, "tspan"), H(J, {
                                                dy: w,
                                                x: g
                                            }), m && H(J, "style", m), J.appendChild(r.createTextNode(f.join(" ").replace(/- /g, "-"))), b.appendChild(J)), d.truncate(a, J, null, f, 0 === O ? t : 0, n, function(a, b) {
                                                return f.slice(0, b).join(" ").replace(/- /g, "-")
                                            }), t = a.actualWidth, O++
                                    }
                                    l++
                                }
                            }
                        });
                        F = F || b.childNodes.length
                    }), L && c && a.attr("title",
                        p(a.textStr, ["&lt;", "&gt;"])), t && t.removeChild(b), J && a.applyTextOutline && a.applyTextOutline(J)) : b.appendChild(r.createTextNode(p(u)))
                }
            },
            getContrast: function(b) {
                b = a(b).rgba;
                b[0] *= 1;
                b[1] *= 1.2;
                b[2] *= .5;
                return 459 < b[0] + b[1] + b[2] ? "#FFFFFF" : "#FFFFFF"
            },
            button: function(a, b, d, u, z, h, l, c, g, r) {
                var n = this.label(a, b, d, g, null, null, r, null, "button"),
                    B = 0,
                    k = this.styledMode;
                n.attr(I({
                    padding: 8,
                    r: 2
                }, z));
                if (!k) {
                    z = I({
                            fill: "#f7f7f7",
                            stroke: "#cccccc",
                            "stroke-width": 1,
                            style: {
                                color: "#333333",
                                cursor: "pointer",
                                fontWeight: "normal"
                            }
                        },
                        z);
                    var J = z.style;
                    delete z.style;
                    h = I(z, {
                        fill: "#e6e6e6"
                    }, h);
                    var M = h.style;
                    delete h.style;
                    l = I(z, {
                        fill: "#e6ebf5",
                        style: {
                            color: "#FFFFFF",
                            fontWeight: "bold"
                        }
                    }, l);
                    var L = l.style;
                    delete l.style;
                    c = I(z, {
                        style: {
                            color: "#cccccc"
                        }
                    }, c);
                    var x = c.style;
                    delete c.style
                }
                e(n.element, t ? "mouseover" : "mouseenter", function() {
                    3 !== B && n.setState(1)
                });
                e(n.element, t ? "mouseout" : "mouseleave", function() {
                    3 !== B && n.setState(B)
                });
                n.setState = function(a) {
                    1 !== a && (n.state = B = a);
                    n.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass("highcharts-button-" + ["normal", "hover", "pressed", "disabled"][a || 0]);
                    k || n.attr([z, h, l, c][a || 0]).css([J, M, L, x][a || 0])
                };
                k || n.attr(z).css(p({
                    cursor: "default"
                }, J));
                return n.on("click", function(a) {
                    3 !== B && u.call(n, a)
                })
            },
            crispLine: function(a, b) {
                a[1] === a[4] && (a[1] = a[4] = Math.round(a[1]) - b % 2 / 2);
                a[2] === a[5] && (a[2] = a[5] = Math.round(a[2]) + b % 2 / 2);
                return a
            },
            path: function(a) {
                var b = this.styledMode ? {} : {
                    fill: "none"
                };
                y(a) ? b.d = a : v(a) && p(b, a);
                return this.createElement("path").attr(b)
            },
            circle: function(a, b, d) {
                a = v(a) ? a : void 0 === a ? {} : {
                    x: a,
                    y: b,
                    r: d
                };
                b = this.createElement("circle");
                b.xSetter = b.ySetter = function(a, b, d) {
                    d.setAttribute("c" + b, a)
                };
                return b.attr(a)
            },
            arc: function(a, b, d, e, u, z) {
                v(a) ? (e = a, b = e.y, d = e.r, a = e.x) : e = {
                    innerR: e,
                    start: u,
                    end: z
                };
                a = this.symbol("arc", a, b, d, d, e);
                a.r = d;
                return a
            },
            rect: function(a, b, d, e, u, z) {
                u = v(a) ? a.r : u;
                var h = this.createElement("rect");
                a = v(a) ? a : void 0 === a ? {} : {
                    x: a,
                    y: b,
                    width: Math.max(d, 0),
                    height: Math.max(e, 0)
                };
                this.styledMode || (void 0 !== z && (a.strokeWidth = z, a = h.crisp(a)), a.fill = "none");
                u && (a.r = u);
                h.rSetter = function(a, b, d) {
                    h.r =
                        a;
                    H(d, {
                        rx: a,
                        ry: a
                    })
                };
                h.rGetter = function() {
                    return h.r
                };
                return h.attr(a)
            },
            setSize: function(a, b, d) {
                var e = this.alignedObjects,
                    u = e.length;
                this.width = a;
                this.height = b;
                for (this.boxWrapper.animate({
                        width: a,
                        height: b
                    }, {
                        step: function() {
                            this.attr({
                                viewBox: "0 0 " + this.attr("width") + " " + this.attr("height")
                            })
                        },
                        duration: m(d, !0) ? void 0 : 0
                    }); u--;) e[u].align()
            },
            g: function(a) {
                var b = this.createElement("g");
                return a ? b.attr({
                    "class": "highcharts-" + a
                }) : b
            },
            image: function(a, b, d, u, z, h) {
                var l = {
                        preserveAspectRatio: "none"
                    },
                    c = function(a,
                        b) {
                        a.setAttributeNS ? a.setAttributeNS("http://www.w3.org/1999/xlink", "href", b) : a.setAttribute("hc-svg-href", b)
                    },
                    t = function(b) {
                        c(g.element, a);
                        h.call(g, b)
                    };
                1 < arguments.length && p(l, {
                    x: b,
                    y: d,
                    width: u,
                    height: z
                });
                var g = this.createElement("image").attr(l);
                h ? (c(g.element, "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="), l = new R.Image, e(l, "load", t), l.src = a, l.complete && t({})) : c(g.element, a);
                return g
            },
            symbol: function(a, b, e, u, z, l) {
                var c = this,
                    g = /^url\((.*?)\)$/,
                    t = g.test(a),
                    B = !t && (this.symbols[a] ?
                        a : "circle"),
                    k = B && this.symbols[B],
                    M = D(b) && k && k.call(this.symbols, Math.round(b), Math.round(e), u, z, l);
                if (k) {
                    var L = this.path(M);
                    c.styledMode || L.attr("fill", "none");
                    p(L, {
                        symbolName: B,
                        x: b,
                        y: e,
                        width: u,
                        height: z
                    });
                    l && p(L, l)
                } else if (t) {
                    var x = a.match(g)[1];
                    L = this.image(x);
                    L.imgwidth = m(Q[x] && Q[x].width, l && l.width);
                    L.imgheight = m(Q[x] && Q[x].height, l && l.height);
                    var J = function() {
                        L.attr({
                            width: L.width,
                            height: L.height
                        })
                    };
                    ["width", "height"].forEach(function(a) {
                        L[a + "Setter"] = function(a, b) {
                            var d = {},
                                e = this["img" + b],
                                u =
                                "width" === b ? "translateX" : "translateY";
                            this[b] = a;
                            D(e) && (l && "within" === l.backgroundSize && this.width && this.height && (e = Math.round(e * Math.min(this.width / this.imgwidth, this.height / this.imgheight))), this.element && this.element.setAttribute(b, e), this.alignByTranslate || (d[u] = ((this[b] || 0) - e) / 2, this.attr(d)))
                        }
                    });
                    D(b) && L.attr({
                        x: b,
                        y: e
                    });
                    L.isImg = !0;
                    D(L.imgwidth) && D(L.imgheight) ? J() : (L.attr({
                        width: 0,
                        height: 0
                    }), n("img", {
                        onload: function() {
                            var a = d[c.chartIndex];
                            0 === this.width && (h(this, {
                                    position: "absolute",
                                    top: "-999em"
                                }),
                                r.body.appendChild(this));
                            Q[x] = {
                                width: this.width,
                                height: this.height
                            };
                            L.imgwidth = this.width;
                            L.imgheight = this.height;
                            L.element && J();
                            this.parentNode && this.parentNode.removeChild(this);
                            c.imgCount--;
                            if (!c.imgCount && a && a.onload) a.onload()
                        },
                        src: x
                    }), this.imgCount++)
                }
                return L
            },
            symbols: {
                circle: function(a, b, d, e) {
                    return this.arc(a + d / 2, b + e / 2, d / 2, e / 2, {
                        start: .5 * Math.PI,
                        end: 2.5 * Math.PI,
                        open: !1
                    })
                },
                square: function(a, b, d, e) {
                    return ["M", a, b, "L", a + d, b, a + d, b + e, a, b + e, "Z"]
                },
                triangle: function(a, b, d, e) {
                    return ["M", a + d / 2, b, "L",
                        a + d, b + e, a, b + e, "Z"
                    ]
                },
                "triangle-down": function(a, b, d, e) {
                    return ["M", a, b, "L", a + d, b, a + d / 2, b + e, "Z"]
                },
                diamond: function(a, b, d, e) {
                    return ["M", a + d / 2, b, "L", a + d, b + e / 2, a + d / 2, b + e, a, b + e / 2, "Z"]
                },
                arc: function(a, b, d, e, u) {
                    var z = u.start,
                        h = u.r || d,
                        l = u.r || e || d,
                        c = u.end - .001;
                    d = u.innerR;
                    e = m(u.open, .001 > Math.abs(u.end - u.start - 2 * Math.PI));
                    var g = Math.cos(z),
                        t = Math.sin(z),
                        r = Math.cos(c);
                    c = Math.sin(c);
                    z = .001 > u.end - z - Math.PI ? 0 : 1;
                    u = ["M", a + h * g, b + l * t, "A", h, l, 0, z, m(u.clockwise, 1), a + h * r, b + l * c];
                    D(d) && u.push(e ? "M" : "L", a + d * r, b + d * c, "A", d,
                        d, 0, z, 0, a + d * g, b + d * t);
                    u.push(e ? "" : "Z");
                    return u
                },
                callout: function(a, b, d, e, u) {
                    var z = Math.min(u && u.r || 0, d, e),
                        h = z + 6,
                        l = u && u.anchorX;
                    u = u && u.anchorY;
                    var c = ["M", a + z, b, "L", a + d - z, b, "C", a + d, b, a + d, b, a + d, b + z, "L", a + d, b + e - z, "C", a + d, b + e, a + d, b + e, a + d - z, b + e, "L", a + z, b + e, "C", a, b + e, a, b + e, a, b + e - z, "L", a, b + z, "C", a, b, a, b, a + z, b];
                    l && l > d ? u > b + h && u < b + e - h ? c.splice(13, 3, "L", a + d, u - 6, a + d + 6, u, a + d, u + 6, a + d, b + e - z) : c.splice(13, 3, "L", a + d, e / 2, l, u, a + d, e / 2, a + d, b + e - z) : l && 0 > l ? u > b + h && u < b + e - h ? c.splice(33, 3, "L", a, u + 6, a - 6, u, a, u - 6, a, b + z) : c.splice(33,
                        3, "L", a, e / 2, l, u, a, e / 2, a, b + z) : u && u > e && l > a + h && l < a + d - h ? c.splice(23, 3, "L", l + 6, b + e, l, b + e + 6, l - 6, b + e, a + z, b + e) : u && 0 > u && l > a + h && l < a + d - h && c.splice(3, 3, "L", l - 6, b, l, b - 6, l + 6, b, d - z, b);
                    return c
                }
            },
            clipRect: function(a, b, d, e) {
                var u = c.uniqueKey() + "-",
                    z = this.createElement("clipPath").attr({
                        id: u
                    }).add(this.defs);
                a = this.rect(a, b, d, e, 0).add(z);
                a.id = u;
                a.clipPath = z;
                a.count = 0;
                return a
            },
            text: function(a, b, d, e) {
                var u = {};
                if (e && (this.allowHTML || !this.forExport)) return this.html(a, b, d);
                u.x = Math.round(b || 0);
                d && (u.y = Math.round(d));
                D(a) && (u.text = a);
                a = this.createElement("text").attr(u);
                e || (a.xSetter = function(a, b, d) {
                    var e = d.getElementsByTagName("tspan"),
                        u = d.getAttribute(b),
                        z;
                    for (z = 0; z < e.length; z++) {
                        var h = e[z];
                        h.getAttribute(b) === u && h.setAttribute(b, a)
                    }
                    d.setAttribute(b, a)
                });
                return a
            },
            fontMetrics: function(a, b) {
                a = !this.styledMode && /px/.test(a) || !R.getComputedStyle ? a || b && b.style && b.style.fontSize || this.style && this.style.fontSize : b && N.prototype.getStyle.call(b, "font-size");
                a = /px/.test(a) ? w(a) : 12;
                b = 24 > a ? a + 3 : Math.round(1.2 * a);
                return {
                    h: b,
                    b: Math.round(.8 * b),
                    f: a
                }
            },
            rotCorr: function(a, b, d) {
                var e = a;
                b && d && (e = Math.max(e * Math.cos(b * F), 4));
                return {
                    x: -a / 3 * Math.sin(b * F),
                    y: e
                }
            },
            label: function(a, b, d, e, z, h, l, c, g) {
                var t = this,
                    r = t.styledMode,
                    n = t.g("button" !== g && "label"),
                    B = n.text = t.text("", 0, 0, l).attr({
                        zIndex: 1
                    }),
                    k, L, M = 0,
                    x = 3,
                    m = 0,
                    F, J, f, w, q, O = {},
                    T, y, v = /^url\((.*?)\)$/.test(e),
                    W = r || v,
                    Q = function() {
                        return r ? k.strokeWidth() % 2 / 2 : (T ? parseInt(T, 10) : 0) % 2 / 2
                    };
                g && n.addClass("highcharts-" + g);
                var A = function() {
                    var a = B.element.style,
                        b = {};
                    L = (void 0 === F || void 0 === J || q) &&
                        D(B.textStr) && B.getBBox();
                    n.width = (F || L.width || 0) + 2 * x + m;
                    n.height = (J || L.height || 0) + 2 * x;
                    y = x + Math.min(t.fontMetrics(a && a.fontSize, B).b, L ? L.height : Infinity);
                    W && (k || (n.box = k = t.symbols[e] || v ? t.symbol(e) : t.rect(), k.addClass(("button" === g ? "" : "highcharts-label-box") + (g ? " highcharts-" + g + "-box" : "")), k.add(n), a = Q(), b.x = a, b.y = (c ? -y : 0) + a), b.width = Math.round(n.width), b.height = Math.round(n.height), k.attr(p(b, O)), O = {})
                };
                var R = function() {
                    var a = m + x;
                    var b = c ? 0 : y;
                    D(F) && L && ("center" === q || "right" === q) && (a += {
                            center: .5,
                            right: 1
                        }[q] *
                        (F - L.width));
                    if (a !== B.x || b !== B.y) B.attr("x", a), B.hasBoxWidthChanged && (L = B.getBBox(!0), A()), void 0 !== b && B.attr("y", b);
                    B.x = a;
                    B.y = b
                };
                var E = function(a, b) {
                    k ? k.attr(a, b) : O[a] = b
                };
                n.onAdd = function() {
                    B.add(n);
                    n.attr({
                        text: a || 0 === a ? a : "",
                        x: b,
                        y: d
                    });
                    k && D(z) && n.attr({
                        anchorX: z,
                        anchorY: h
                    })
                };
                n.widthSetter = function(a) {
                    F = G(a) ? a : null
                };
                n.heightSetter = function(a) {
                    J = a
                };
                n["text-alignSetter"] = function(a) {
                    q = a
                };
                n.paddingSetter = function(a) {
                    D(a) && a !== x && (x = n.padding = a, R())
                };
                n.paddingLeftSetter = function(a) {
                    D(a) && a !== m && (m = a,
                        R())
                };
                n.alignSetter = function(a) {
                    a = {
                        left: 0,
                        center: .5,
                        right: 1
                    }[a];
                    a !== M && (M = a, L && n.attr({
                        x: f
                    }))
                };
                n.textSetter = function(a) {
                    void 0 !== a && B.attr({
                        text: a
                    });
                    A();
                    R()
                };
                n["stroke-widthSetter"] = function(a, b) {
                    a && (W = !0);
                    T = this["stroke-width"] = a;
                    E(b, a)
                };
                r ? n.rSetter = function(a, b) {
                    E(b, a)
                } : n.strokeSetter = n.fillSetter = n.rSetter = function(a, b) {
                    "r" !== b && ("fill" === b && a && (W = !0), n[b] = a);
                    E(b, a)
                };
                n.anchorXSetter = function(a, b) {
                    z = n.anchorX = a;
                    E(b, Math.round(a) - Q() - f)
                };
                n.anchorYSetter = function(a, b) {
                    h = n.anchorY = a;
                    E(b, a - w)
                };
                n.xSetter =
                    function(a) {
                        n.x = a;
                        M && (a -= M * ((F || L.width) + 2 * x), n["forceAnimate:x"] = !0);
                        f = Math.round(a);
                        n.attr("translateX", f)
                    };
                n.ySetter = function(a) {
                    w = n.y = Math.round(a);
                    n.attr("translateY", w)
                };
                var S = n.css;
                l = {
                    css: function(a) {
                        if (a) {
                            var b = {};
                            a = I(a);
                            n.textProps.forEach(function(d) {
                                void 0 !== a[d] && (b[d] = a[d], delete a[d])
                            });
                            B.css(b);
                            "width" in b && A();
                            "fontSize" in b && (A(), R())
                        }
                        return S.call(n, a)
                    },
                    getBBox: function() {
                        return {
                            width: L.width + 2 * x,
                            height: L.height + 2 * x,
                            x: L.x - x,
                            y: L.y - x
                        }
                    },
                    destroy: function() {
                        u(n.element, "mouseenter");
                        u(n.element, "mouseleave");
                        B && (B = B.destroy());
                        k && (k = k.destroy());
                        N.prototype.destroy.call(n);
                        n = t = A = R = E = null
                    }
                };
                r || (l.shadow = function(a) {
                    a && (A(), k && k.shadow(a));
                    return n
                });
                return p(n, l)
            }
        });
        c.Renderer = f
    });
    K(C, "parts/Html.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.attr,
            D = f.defined,
            A = f.extend,
            E = f.pick,
            p = f.pInt,
            y = c.createElement,
            G = c.css,
            v = c.isFirefox,
            q = c.isMS,
            k = c.isWebKit,
            m = c.SVGElement;
        f = c.SVGRenderer;
        var w = c.win;
        A(m.prototype, {
            htmlCss: function(c) {
                var e = "SPAN" === this.element.tagName &&
                    c && "width" in c,
                    b = E(e && c.width, void 0);
                if (e) {
                    delete c.width;
                    this.textWidth = b;
                    var d = !0
                }
                c && "ellipsis" === c.textOverflow && (c.whiteSpace = "nowrap", c.overflow = "hidden");
                this.styles = A(this.styles, c);
                G(this.element, c);
                d && this.htmlUpdateTransform();
                return this
            },
            htmlGetBBox: function() {
                var c = this.element;
                return {
                    x: c.offsetLeft,
                    y: c.offsetTop,
                    width: c.offsetWidth,
                    height: c.offsetHeight
                }
            },
            htmlUpdateTransform: function() {
                if (this.added) {
                    var c = this.renderer,
                        e = this.element,
                        b = this.translateX || 0,
                        d = this.translateY || 0,
                        a = this.x ||
                        0,
                        h = this.y || 0,
                        n = this.textAlign || "left",
                        k = {
                            left: 0,
                            center: .5,
                            right: 1
                        }[n],
                        r = this.styles,
                        x = r && r.whiteSpace;
                    G(e, {
                        marginLeft: b,
                        marginTop: d
                    });
                    !c.styledMode && this.shadows && this.shadows.forEach(function(a) {
                        G(a, {
                            marginLeft: b + 1,
                            marginTop: d + 1
                        })
                    });
                    this.inverted && [].forEach.call(e.childNodes, function(a) {
                        c.invertChild(a, e)
                    });
                    if ("SPAN" === e.tagName) {
                        r = this.rotation;
                        var l = this.textWidth && p(this.textWidth),
                            t = [r, n, e.innerHTML, this.textWidth, this.textAlign].join(),
                            B;
                        (B = l !== this.oldTextWidth) && !(B = l > this.oldTextWidth) &&
                        ((B = this.textPxLength) || (G(e, {
                            width: "",
                            whiteSpace: x || "nowrap"
                        }), B = e.offsetWidth), B = B > l);
                        B && (/[ \-]/.test(e.textContent || e.innerText) || "ellipsis" === e.style.textOverflow) ? (G(e, {
                            width: l + "px",
                            display: "block",
                            whiteSpace: x || "normal"
                        }), this.oldTextWidth = l, this.hasBoxWidthChanged = !0) : this.hasBoxWidthChanged = !1;
                        t !== this.cTT && (x = c.fontMetrics(e.style.fontSize, e).b, !D(r) || r === (this.oldRotation || 0) && n === this.oldAlign || this.setSpanRotation(r, k, x), this.getSpanCorrection(!D(r) && this.textPxLength || e.offsetWidth,
                            x, k, r, n));
                        G(e, {
                            left: a + (this.xCorr || 0) + "px",
                            top: h + (this.yCorr || 0) + "px"
                        });
                        this.cTT = t;
                        this.oldRotation = r;
                        this.oldAlign = n
                    }
                } else this.alignOnAdd = !0
            },
            setSpanRotation: function(c, e, b) {
                var d = {},
                    a = this.renderer.getTransformKey();
                d[a] = d.transform = "rotate(" + c + "deg)";
                d[a + (v ? "Origin" : "-origin")] = d.transformOrigin = 100 * e + "% " + b + "px";
                G(this.element, d)
            },
            getSpanCorrection: function(c, e, b) {
                this.xCorr = -c * b;
                this.yCorr = -e
            }
        });
        A(f.prototype, {
            getTransformKey: function() {
                return q && !/Edge/.test(w.navigator.userAgent) ? "-ms-transform" :
                    k ? "-webkit-transform" : v ? "MozTransform" : w.opera ? "-o-transform" : ""
            },
            html: function(c, e, b) {
                var d = this.createElement("span"),
                    a = d.element,
                    h = d.renderer,
                    n = h.isSVG,
                    g = function(a, b) {
                        ["opacity", "visibility"].forEach(function(d) {
                            a[d + "Setter"] = function(e, h, l) {
                                var z = a.div ? a.div.style : b;
                                m.prototype[d + "Setter"].call(this, e, h, l);
                                z && (z[h] = e)
                            }
                        });
                        a.addedSetters = !0
                    };
                d.textSetter = function(b) {
                    b !== a.innerHTML && (delete this.bBox, delete this.oldTextWidth);
                    this.textStr = b;
                    a.innerHTML = E(b, "");
                    d.doTransform = !0
                };
                n && g(d, d.element.style);
                d.xSetter = d.ySetter = d.alignSetter = d.rotationSetter = function(a, b) {
                    "align" === b && (b = "textAlign");
                    d[b] = a;
                    d.doTransform = !0
                };
                d.afterSetters = function() {
                    this.doTransform && (this.htmlUpdateTransform(), this.doTransform = !1)
                };
                d.attr({
                    text: c,
                    x: Math.round(e),
                    y: Math.round(b)
                }).css({
                    position: "absolute"
                });
                h.styledMode || d.css({
                    fontFamily: this.style.fontFamily,
                    fontSize: this.style.fontSize
                });
                a.style.whiteSpace = "nowrap";
                d.css = d.htmlCss;
                n && (d.add = function(b) {
                    var e = h.box.parentNode,
                        l = [];
                    if (this.parentGroup = b) {
                        var c = b.div;
                        if (!c) {
                            for (; b;) l.push(b), b = b.parentGroup;
                            l.reverse().forEach(function(a) {
                                function b(b, d) {
                                    a[d] = b;
                                    "translateX" === d ? u.left = b + "px" : u.top = b + "px";
                                    a.doTransform = !0
                                }
                                var z = H(a.element, "class");
                                c = a.div = a.div || y("div", z ? {
                                    className: z
                                } : void 0, {
                                    position: "absolute",
                                    left: (a.translateX || 0) + "px",
                                    top: (a.translateY || 0) + "px",
                                    display: a.display,
                                    opacity: a.opacity,
                                    pointerEvents: a.styles && a.styles.pointerEvents
                                }, c || e);
                                var u = c.style;
                                A(a, {
                                    classSetter: function(a) {
                                        return function(b) {
                                            this.element.setAttribute("class", b);
                                            a.className =
                                                b
                                        }
                                    }(c),
                                    on: function() {
                                        l[0].div && d.on.apply({
                                            element: l[0].div
                                        }, arguments);
                                        return a
                                    },
                                    translateXSetter: b,
                                    translateYSetter: b
                                });
                                a.addedSetters || g(a)
                            })
                        }
                    } else c = e;
                    c.appendChild(a);
                    d.added = !0;
                    d.alignOnAdd && d.htmlUpdateTransform();
                    return d
                });
                return d
            }
        })
    });
    K(C, "parts/Time.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.defined,
            D = f.extend,
            A = f.isObject,
            E = f.objectEach,
            p = f.pick,
            y = f.splat,
            G = c.merge,
            v = c.timeUnits,
            q = c.win;
        c.Time = function(c) {
            this.update(c, !1)
        };
        c.Time.prototype = {
            defaultOptions: {
                Date: void 0,
                getTimezoneOffset: void 0,
                timezone: void 0,
                timezoneOffset: 0,
                useUTC: !0
            },
            update: function(c) {
                var k = p(c && c.useUTC, !0),
                    f = this;
                this.options = c = G(!0, this.options || {}, c);
                this.Date = c.Date || q.Date || Date;
                this.timezoneOffset = (this.useUTC = k) && c.timezoneOffset;
                this.getTimezoneOffset = this.timezoneOffsetFunction();
                (this.variableTimezone = !(k && !c.getTimezoneOffset && !c.timezone)) || this.timezoneOffset ? (this.get = function(c, e) {
                        var b = e.getTime(),
                            d = b - f.getTimezoneOffset(e);
                        e.setTime(d);
                        c = e["getUTC" + c]();
                        e.setTime(b);
                        return c
                    },
                    this.set = function(c, e, b) {
                        if ("Milliseconds" === c || "Seconds" === c || "Minutes" === c && 0 === e.getTimezoneOffset() % 60) e["set" + c](b);
                        else {
                            var d = f.getTimezoneOffset(e);
                            d = e.getTime() - d;
                            e.setTime(d);
                            e["setUTC" + c](b);
                            c = f.getTimezoneOffset(e);
                            d = e.getTime() + c;
                            e.setTime(d)
                        }
                    }) : k ? (this.get = function(c, e) {
                    return e["getUTC" + c]()
                }, this.set = function(c, e, b) {
                    return e["setUTC" + c](b)
                }) : (this.get = function(c, e) {
                    return e["get" + c]()
                }, this.set = function(c, e, b) {
                    return e["set" + c](b)
                })
            },
            makeTime: function(k, m, f, g, e, b) {
                if (this.useUTC) {
                    var d =
                        this.Date.UTC.apply(0, arguments);
                    var a = this.getTimezoneOffset(d);
                    d += a;
                    var h = this.getTimezoneOffset(d);
                    a !== h ? d += h - a : a - 36E5 !== this.getTimezoneOffset(d - 36E5) || c.isSafari || (d -= 36E5)
                } else d = (new this.Date(k, m, p(f, 1), p(g, 0), p(e, 0), p(b, 0))).getTime();
                return d
            },
            timezoneOffsetFunction: function() {
                var k = this,
                    m = this.options,
                    f = q.moment;
                if (!this.useUTC) return function(c) {
                    return 6E4 * (new Date(c)).getTimezoneOffset()
                };
                if (m.timezone) {
                    if (f) return function(c) {
                        return 6E4 * -f.tz(c, m.timezone).utcOffset()
                    };
                    c.error(25)
                }
                return this.useUTC &&
                    m.getTimezoneOffset ? function(c) {
                        return 6E4 * m.getTimezoneOffset(c)
                    } : function() {
                        return 6E4 * (k.timezoneOffset || 0)
                    }
            },
            dateFormat: function(k, m, f) {
                if (!H(m) || isNaN(m)) return c.defaultOptions.lang.invalidDate || "";
                k = p(k, "%Y-%m-%d %H:%M:%S");
                var g = this,
                    e = new this.Date(m),
                    b = this.get("Hours", e),
                    d = this.get("Day", e),
                    a = this.get("Date", e),
                    h = this.get("Month", e),
                    n = this.get("FullYear", e),
                    F = c.defaultOptions.lang,
                    r = F.weekdays,
                    x = F.shortWeekdays,
                    l = c.pad;
                e = D({
                    a: x ? x[d] : r[d].substr(0, 3),
                    A: r[d],
                    d: l(a),
                    e: l(a, 2, " "),
                    w: d,
                    b: F.shortMonths[h],
                    B: F.months[h],
                    m: l(h + 1),
                    o: h + 1,
                    y: n.toString().substr(2, 2),
                    Y: n,
                    H: l(b),
                    k: b,
                    I: l(b % 12 || 12),
                    l: b % 12 || 12,
                    M: l(g.get("Minutes", e)),
                    p: 12 > b ? "AM" : "PM",
                    P: 12 > b ? "am" : "pm",
                    S: l(e.getSeconds()),
                    L: l(Math.floor(m % 1E3), 3)
                }, c.dateFormats);
                E(e, function(a, b) {
                    for (; - 1 !== k.indexOf("%" + b);) k = k.replace("%" + b, "function" === typeof a ? a.call(g, m) : a)
                });
                return f ? k.substr(0, 1).toUpperCase() + k.substr(1) : k
            },
            resolveDTLFormat: function(c) {
                return A(c, !0) ? c : (c = y(c), {
                    main: c[0],
                    from: c[1],
                    to: c[2]
                })
            },
            getTimeTicks: function(c, m, f, g) {
                var e = this,
                    b = [],
                    d = {};
                var a = new e.Date(m);
                var h = c.unitRange,
                    n = c.count || 1,
                    k;
                g = p(g, 1);
                if (H(m)) {
                    e.set("Milliseconds", a, h >= v.second ? 0 : n * Math.floor(e.get("Milliseconds", a) / n));
                    h >= v.second && e.set("Seconds", a, h >= v.minute ? 0 : n * Math.floor(e.get("Seconds", a) / n));
                    h >= v.minute && e.set("Minutes", a, h >= v.hour ? 0 : n * Math.floor(e.get("Minutes", a) / n));
                    h >= v.hour && e.set("Hours", a, h >= v.day ? 0 : n * Math.floor(e.get("Hours", a) / n));
                    h >= v.day && e.set("Date", a, h >= v.month ? 1 : Math.max(1, n * Math.floor(e.get("Date", a) / n)));
                    if (h >= v.month) {
                        e.set("Month", a, h >=
                            v.year ? 0 : n * Math.floor(e.get("Month", a) / n));
                        var r = e.get("FullYear", a)
                    }
                    h >= v.year && e.set("FullYear", a, r - r % n);
                    h === v.week && (r = e.get("Day", a), e.set("Date", a, e.get("Date", a) - r + g + (r < g ? -7 : 0)));
                    r = e.get("FullYear", a);
                    g = e.get("Month", a);
                    var x = e.get("Date", a),
                        l = e.get("Hours", a);
                    m = a.getTime();
                    e.variableTimezone && (k = f - m > 4 * v.month || e.getTimezoneOffset(m) !== e.getTimezoneOffset(f));
                    m = a.getTime();
                    for (a = 1; m < f;) b.push(m), m = h === v.year ? e.makeTime(r + a * n, 0) : h === v.month ? e.makeTime(r, g + a * n) : !k || h !== v.day && h !== v.week ? k && h ===
                        v.hour && 1 < n ? e.makeTime(r, g, x, l + a * n) : m + h * n : e.makeTime(r, g, x + a * n * (h === v.day ? 1 : 7)), a++;
                    b.push(m);
                    h <= v.hour && 1E4 > b.length && b.forEach(function(a) {
                        0 === a % 18E5 && "000000000" === e.dateFormat("%H%M%S%L", a) && (d[a] = "day")
                    })
                }
                b.info = D(c, {
                    higherRanks: d,
                    totalRange: h * n
                });
                return b
            }
        }
    });
    K(C, "parts/Options.js", [C["parts/Globals.js"]], function(c) {
        var f = c.color,
            H = c.merge;
        c.defaultOptions = {
            colors: "#7cb5ec #434348 #90ed7d #f7a35c #8085e9 #f15c80 #e4d354 #2b908f #f45b5b #91e8e1".split(" "),
            symbols: ["circle", "diamond", "square",
                "triangle", "triangle-down"
            ],
            lang: {
                loading: "Loading...",
                months: "January February March April May June July August September October November December".split(" "),
                shortMonths: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
                weekdays: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
                decimalPoint: ".",
                numericSymbols: "kMGTPE".split(""),
                resetZoom: "Reset zoom",
                resetZoomTitle: "Reset zoom level 1:1",
                thousandsSep: " "
            },
            global: {},
            time: c.Time.prototype.defaultOptions,
            chart: {
                styledMode: !1,
                borderRadius: 0,
                colorCount: 10,
                defaultSeriesType: "line",
                ignoreHiddenSeries: !0,
                spacing: [10, 10, 15, 10],
                resetZoomButton: {
                    theme: {
                        zIndex: 6
                    },
                    position: {
                        align: "right",
                        x: -10,
                        y: 10
                    }
                },
                width: null,
                height: null,
                borderColor: "#335cad",
                backgroundColor: "#ffffff",
                plotBorderColor: "#cccccc"
            },
            title: {
                text: "Chart title",
                align: "center",
                margin: 15,
                widthAdjust: -44
            },
            subtitle: {
                text: "",
                align: "center",
                widthAdjust: -44
            },
            caption: {
                margin: 15,
                text: "",
                align: "left",
                verticalAlign: "bottom"
            },
            plotOptions: {},
            labels: {
                style: {
                    position: "absolute",
                    color: "#333333"
                }
            },
            legend: {
                enabled: !0,
                align: "center",
                alignColumns: !0,
                layout: "horizontal",
                labelFormatter: function() {
                    return this.name
                },
                borderColor: "#999999",
                borderRadius: 0,
                navigation: {
                    activeColor: "#003399",
                    inactiveColor: "#cccccc"
                },
                itemStyle: {
                    color: "#333333",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textOverflow: "ellipsis"
                },
                itemHoverStyle: {
                    color: "#000000"
                },
                itemHiddenStyle: {
                    color: "#cccccc"
                },
                shadow: !1,
                itemCheckboxStyle: {
                    position: "absolute",
                    width: "13px",
                    height: "13px"
                },
                squareSymbol: !0,
                symbolPadding: 5,
                verticalAlign: "bottom",
                x: 0,
                y: 0,
                title: {
                    style: {
                        fontWeight: "bold"
                    }
                }
            },
            loading: {
                labelStyle: {
                    fontWeight: "bold",
                    position: "relative",
                    top: "45%"
                },
                style: {
                    position: "absolute",
                    backgroundColor: "#ffffff",
                    opacity: .5,
                    textAlign: "center"
                }
            },
            tooltip: {
                enabled: !0,
                animation: c.svg,
                borderRadius: 3,
                dateTimeLabelFormats: {
                    millisecond: "%A, %b %e, %H:%M:%S.%L",
                    second: "%A, %b %e, %H:%M:%S",
                    minute: "%A, %b %e, %H:%M",
                    hour: "%A, %b %e, %H:%M",
                    day: "%A, %b %e, %Y",
                    week: "Week from %A, %b %e, %Y",
                    month: "%B %Y",
                    year: "%Y"
                },
                footerFormat: "",
                padding: 8,
                snap: c.isTouchDevice ?
                    25 : 10,
                headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
                pointFormat: '<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.y}</b><br/>',
                backgroundColor: f("#f7f7f7").setOpacity(.85).get(),
                borderWidth: 1,
                shadow: !0,
                style: {
                    color: "#333333",
                    cursor: "default",
                    fontSize: "12px",
                    pointerEvents: "none",
                    whiteSpace: "nowrap"
                }
            },
            credits: {
                enabled: !0,
                href: "https://www.highcharts.com?credits",
                position: {
                    align: "right",
                    x: -10,
                    verticalAlign: "bottom",
                    y: -5
                },
                style: {
                    cursor: "pointer",
                    color: "#999999",
                    fontSize: "9px"
                },
                text: "geyunhao.cn"
            }
        };
        c.setOptions = function(f) {
            c.defaultOptions = H(!0, c.defaultOptions, f);
            (f.time || f.global) && c.time.update(H(c.defaultOptions.global, c.defaultOptions.time, f.global, f.time));
            return c.defaultOptions
        };
        c.getOptions = function() {
            return c.defaultOptions
        };
        c.defaultPlotOptions = c.defaultOptions.plotOptions;
        c.time = new c.Time(H(c.defaultOptions.global, c.defaultOptions.time));
        c.dateFormat = function(f, A, E) {
            return c.time.dateFormat(f, A, E)
        };
        ""
    });
    K(C, "parts/Tick.js", [C["parts/Globals.js"],
        C["parts/Utilities.js"]
    ], function(c, f) {
        var H = f.defined,
            D = f.destroyObjectProperties,
            A = f.extend,
            E = f.isNumber,
            p = f.pick,
            y = c.correctFloat,
            G = c.fireEvent,
            v = c.merge,
            q = c.deg2rad;
        c.Tick = function(c, m, f, g, e) {
            this.axis = c;
            this.pos = m;
            this.type = f || "";
            this.isNewLabel = this.isNew = !0;
            this.parameters = e || {};
            this.tickmarkOffset = this.parameters.tickmarkOffset;
            this.options = this.parameters.options;
            f || g || this.addLabel()
        };
        c.Tick.prototype = {
            addLabel: function() {
                var c = this,
                    m = c.axis,
                    f = m.options,
                    g = m.chart,
                    e = m.categories,
                    b = m.names,
                    d = c.pos,
                    a = p(c.options && c.options.labels, f.labels),
                    h = m.tickPositions,
                    n = d === h[0],
                    F = d === h[h.length - 1];
                e = this.parameters.category || (e ? p(e[d], b[d], d) : d);
                var r = c.label;
                h = h.info;
                var x, l;
                if (m.isDatetimeAxis && h) {
                    var t = g.time.resolveDTLFormat(f.dateTimeLabelFormats[!f.grid && h.higherRanks[d] || h.unitName]);
                    var B = t.main
                }
                c.isFirst = n;
                c.isLast = F;
                c.formatCtx = {
                    axis: m,
                    chart: g,
                    isFirst: n,
                    isLast: F,
                    dateTimeLabelFormat: B,
                    tickPositionInfo: h,
                    value: m.isLog ? y(m.lin2log(e)) : e,
                    pos: d
                };
                f = m.labelFormatter.call(c.formatCtx, this.formatCtx);
                if (l = t && t.list) c.shortenLabel = function() {
                    for (x = 0; x < l.length; x++)
                        if (r.attr({
                                text: m.labelFormatter.call(A(c.formatCtx, {
                                    dateTimeLabelFormat: l[x]
                                }))
                            }), r.getBBox().width < m.getSlotWidth(c) - 2 * p(a.padding, 5)) return;
                    r.attr({
                        text: ""
                    })
                };
                if (H(r)) r && r.textStr !== f && (!r.textWidth || a.style && a.style.width || r.styles.width || r.css({
                    width: null
                }), r.attr({
                    text: f
                }), r.textPxLength = r.getBBox().width);
                else {
                    if (c.label = r = H(f) && a.enabled ? g.renderer.text(f, 0, 0, a.useHTML).add(m.labelGroup) : null) g.styledMode || r.css(v(a.style)), r.textPxLength =
                        r.getBBox().width;
                    c.rotation = 0
                }
            },
            getLabelSize: function() {
                return this.label ? this.label.getBBox()[this.axis.horiz ? "height" : "width"] : 0
            },
            handleOverflow: function(c) {
                var k = this.axis,
                    f = k.options.labels,
                    g = c.x,
                    e = k.chart.chartWidth,
                    b = k.chart.spacing,
                    d = p(k.labelLeft, Math.min(k.pos, b[3]));
                b = p(k.labelRight, Math.max(k.isRadial ? 0 : k.pos + k.len, e - b[1]));
                var a = this.label,
                    h = this.rotation,
                    n = {
                        left: 0,
                        center: .5,
                        right: 1
                    }[k.labelAlign || a.attr("align")],
                    F = a.getBBox().width,
                    r = k.getSlotWidth(this),
                    x = r,
                    l = 1,
                    t, B = {};
                if (h || "justify" !==
                    p(f.overflow, "justify")) 0 > h && g - n * F < d ? t = Math.round(g / Math.cos(h * q) - d) : 0 < h && g + n * F > b && (t = Math.round((e - g) / Math.cos(h * q)));
                else if (e = g + (1 - n) * F, g - n * F < d ? x = c.x + x * (1 - n) - d : e > b && (x = b - c.x + x * n, l = -1), x = Math.min(r, x), x < r && "center" === k.labelAlign && (c.x += l * (r - x - n * (r - Math.min(F, x)))), F > x || k.autoRotation && (a.styles || {}).width) t = x;
                t && (this.shortenLabel ? this.shortenLabel() : (B.width = Math.floor(t), (f.style || {}).textOverflow || (B.textOverflow = "ellipsis"), a.css(B)))
            },
            getPosition: function(k, m, f, g) {
                var e = this.axis,
                    b = e.chart,
                    d = g && b.oldChartHeight || b.chartHeight;
                k = {
                    x: k ? c.correctFloat(e.translate(m + f, null, null, g) + e.transB) : e.left + e.offset + (e.opposite ? (g && b.oldChartWidth || b.chartWidth) - e.right - e.left : 0),
                    y: k ? d - e.bottom + e.offset - (e.opposite ? e.height : 0) : c.correctFloat(d - e.translate(m + f, null, null, g) - e.transB)
                };
                k.y = Math.max(Math.min(k.y, 1E5), -1E5);
                G(this, "afterGetPosition", {
                    pos: k
                });
                return k
            },
            getLabelPosition: function(c, m, f, g, e, b, d, a) {
                var h = this.axis,
                    n = h.transA,
                    k = h.isLinked && h.linkedParent ? h.linkedParent.reversed : h.reversed,
                    r =
                    h.staggerLines,
                    x = h.tickRotCorr || {
                        x: 0,
                        y: 0
                    },
                    l = e.y,
                    t = g || h.reserveSpaceDefault ? 0 : -h.labelOffset * ("center" === h.labelAlign ? .5 : 1),
                    B = {};
                H(l) || (l = 0 === h.side ? f.rotation ? -8 : -f.getBBox().height : 2 === h.side ? x.y + 8 : Math.cos(f.rotation * q) * (x.y - f.getBBox(!1, 0).height / 2));
                c = c + e.x + t + x.x - (b && g ? b * n * (k ? -1 : 1) : 0);
                m = m + l - (b && !g ? b * n * (k ? 1 : -1) : 0);
                r && (f = d / (a || 1) % r, h.opposite && (f = r - f - 1), m += h.labelOffset / r * f);
                B.x = c;
                B.y = Math.round(m);
                G(this, "afterGetLabelPosition", {
                    pos: B,
                    tickmarkOffset: b,
                    index: d
                });
                return B
            },
            getMarkPath: function(c,
                m, f, g, e, b) {
                return b.crispLine(["M", c, m, "L", c + (e ? 0 : -f), m + (e ? f : 0)], g)
            },
            renderGridLine: function(c, m, f) {
                var g = this.axis,
                    e = g.options,
                    b = this.gridLine,
                    d = {},
                    a = this.pos,
                    h = this.type,
                    n = p(this.tickmarkOffset, g.tickmarkOffset),
                    k = g.chart.renderer,
                    r = h ? h + "Grid" : "grid",
                    x = e[r + "LineWidth"],
                    l = e[r + "LineColor"];
                e = e[r + "LineDashStyle"];
                b || (g.chart.styledMode || (d.stroke = l, d["stroke-width"] = x, e && (d.dashstyle = e)), h || (d.zIndex = 1), c && (m = 0), this.gridLine = b = k.path().attr(d).addClass("highcharts-" + (h ? h + "-" : "") + "grid-line").add(g.gridGroup));
                if (b && (f = g.getPlotLinePath({
                        value: a + n,
                        lineWidth: b.strokeWidth() * f,
                        force: "pass",
                        old: c
                    }))) b[c || this.isNew ? "attr" : "animate"]({
                    d: f,
                    opacity: m
                })
            },
            renderMark: function(c, m, f) {
                var g = this.axis,
                    e = g.options,
                    b = g.chart.renderer,
                    d = this.type,
                    a = d ? d + "Tick" : "tick",
                    h = g.tickSize(a),
                    n = this.mark,
                    k = !n,
                    r = c.x;
                c = c.y;
                var x = p(e[a + "Width"], !d && g.isXAxis ? 1 : 0);
                e = e[a + "Color"];
                h && (g.opposite && (h[0] = -h[0]), k && (this.mark = n = b.path().addClass("highcharts-" + (d ? d + "-" : "") + "tick").add(g.axisGroup), g.chart.styledMode || n.attr({
                        stroke: e,
                        "stroke-width": x
                    })),
                    n[k ? "attr" : "animate"]({
                        d: this.getMarkPath(r, c, h[0], n.strokeWidth() * f, g.horiz, b),
                        opacity: m
                    }))
            },
            renderLabel: function(c, m, f, g) {
                var e = this.axis,
                    b = e.horiz,
                    d = e.options,
                    a = this.label,
                    h = d.labels,
                    n = h.step;
                e = p(this.tickmarkOffset, e.tickmarkOffset);
                var k = !0,
                    r = c.x;
                c = c.y;
                a && E(r) && (a.xy = c = this.getLabelPosition(r, c, a, b, h, e, g, n), this.isFirst && !this.isLast && !p(d.showFirstLabel, 1) || this.isLast && !this.isFirst && !p(d.showLastLabel, 1) ? k = !1 : !b || h.step || h.rotation || m || 0 === f || this.handleOverflow(c), n && g % n && (k = !1), k && E(c.y) ?
                    (c.opacity = f, a[this.isNewLabel ? "attr" : "animate"](c), this.isNewLabel = !1) : (a.attr("y", -9999), this.isNewLabel = !0))
            },
            render: function(k, f, q) {
                var g = this.axis,
                    e = g.horiz,
                    b = this.pos,
                    d = p(this.tickmarkOffset, g.tickmarkOffset);
                b = this.getPosition(e, b, d, f);
                d = b.x;
                var a = b.y;
                g = e && d === g.pos + g.len || !e && a === g.pos ? -1 : 1;
                q = p(q, 1);
                this.isActive = !0;
                this.renderGridLine(f, q, g);
                this.renderMark(b, q, g);
                this.renderLabel(b, f, q, k);
                this.isNew = !1;
                c.fireEvent(this, "afterRender")
            },
            destroy: function() {
                D(this, this.axis)
            }
        }
    });
    K(C, "parts/Axis.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.arrayMax,
            D = f.arrayMin,
            A = f.defined,
            E = f.destroyObjectProperties,
            p = f.extend,
            y = f.isArray,
            G = f.isNumber,
            v = f.isString,
            q = f.objectEach,
            k = f.pick,
            m = f.splat,
            w = f.syncTimeout,
            g = c.addEvent,
            e = c.animObject,
            b = c.color,
            d = c.correctFloat,
            a = c.defaultOptions,
            h = c.deg2rad,
            n = c.fireEvent,
            F = c.format,
            r = c.getMagnitude,
            x = c.merge,
            l = c.normalizeTickInterval,
            t = c.removeEvent,
            B = c.seriesTypes,
            I = c.Tick;
        f = function() {
            this.init.apply(this, arguments)
        };
        p(f.prototype, {
            defaultOptions: {
                dateTimeLabelFormats: {
                    millisecond: {
                        main: "%H:%M:%S.%L",
                        range: !1
                    },
                    second: {
                        main: "%H:%M:%S",
                        range: !1
                    },
                    minute: {
                        main: "%H:%M",
                        range: !1
                    },
                    hour: {
                        main: "%H:%M",
                        range: !1
                    },
                    day: {
                        main: "%e. %b"
                    },
                    week: {
                        main: "%e. %b"
                    },
                    month: {
                        main: "%b '%y"
                    },
                    year: {
                        main: "%Y"
                    }
                },
                endOnTick: !1,
                labels: {
                    enabled: !0,
                    indentation: 10,
                    x: 0,
                    style: {
                        color: "#666666",
                        cursor: "default",
                        fontSize: "11px"
                    }
                },
                maxPadding: .01,
                minorTickLength: 2,
                minorTickPosition: "outside",
                minPadding: .01,
                showEmpty: !0,
                startOfWeek: 1,
                startOnTick: !1,
                tickLength: 10,
                tickPixelInterval: 100,
                tickmarkPlacement: "between",
                tickPosition: "outside",
                title: {
                    align: "middle",
                    style: {
                        color: "#666666"
                    }
                },
                type: "linear",
                minorGridLineColor: "#f2f2f2",
                minorGridLineWidth: 1,
                minorTickColor: "#999999",
                lineColor: "#ccd6eb",
                lineWidth: 1,
                gridLineColor: "#e6e6e6",
                tickColor: "#ccd6eb"
            },
            defaultYAxisOptions: {
                endOnTick: !0,
                maxPadding: .05,
                minPadding: .05,
                tickPixelInterval: 72,
                showLastLabel: !0,
                labels: {
                    x: -8
                },
                startOnTick: !0,
                title: {
                    rotation: 270,
                    text: "Values"
                },
                stackLabels: {
                    allowOverlap: !1,
                    enabled: !1,
                    crop: !0,
                    overflow: "justify",
                    formatter: function() {
                        return c.numberFormat(this.total, -1)
                    },
                    style: {
                        color: "#FFFFFF",
                        fontSize: "11px",
                        fontWeight: "bold",
                        textOutline: "1px contrast"
                    }
                },
                gridLineWidth: 1,
                lineWidth: 0
            },
            defaultLeftAxisOptions: {
                labels: {
                    x: -15
                },
                title: {
                    rotation: 270
                }
            },
            defaultRightAxisOptions: {
                labels: {
                    x: 15
                },
                title: {
                    rotation: 90
                }
            },
            defaultBottomAxisOptions: {
                labels: {
                    autoRotation: [-45],
                    x: 0
                },
                margin: 15,
                title: {
                    rotation: 0
                }
            },
            defaultTopAxisOptions: {
                labels: {
                    autoRotation: [-45],
                    x: 0
                },
                margin: 15,
                title: {
                    rotation: 0
                }
            },
            init: function(a, b) {
                var d = b.isX,
                    e = this;
                e.chart = a;
                e.horiz = a.inverted && !e.isZAxis ? !d : d;
                e.isXAxis = d;
                e.coll = e.coll || (d ? "xAxis" :
                    "yAxis");
                n(this, "init", {
                    userOptions: b
                });
                e.opposite = b.opposite;
                e.side = b.side || (e.horiz ? e.opposite ? 0 : 2 : e.opposite ? 1 : 3);
                e.setOptions(b);
                var u = this.options,
                    z = u.type;
                e.labelFormatter = u.labels.formatter || e.defaultLabelFormatter;
                e.userOptions = b;
                e.minPixelPadding = 0;
                e.reversed = u.reversed;
                e.visible = !1 !== u.visible;
                e.zoomEnabled = !1 !== u.zoomEnabled;
                e.hasNames = "category" === z || !0 === u.categories;
                e.categories = u.categories || e.hasNames;
                e.names || (e.names = [], e.names.keys = {});
                e.plotLinesAndBandsGroups = {};
                e.isLog = "logarithmic" ===
                    z;
                e.isDatetimeAxis = "datetime" === z;
                e.positiveValuesOnly = e.isLog && !e.allowNegativeLog;
                e.isLinked = A(u.linkedTo);
                e.ticks = {};
                e.labelEdge = [];
                e.minorTicks = {};
                e.plotLinesAndBands = [];
                e.alternateBands = {};
                e.len = 0;
                e.minRange = e.userMinRange = u.minRange || u.maxZoom;
                e.range = u.range;
                e.offset = u.offset || 0;
                e.stacks = {};
                e.oldStacks = {};
                e.stacksTouched = 0;
                e.max = null;
                e.min = null;
                e.crosshair = k(u.crosshair, m(a.options.tooltip.crosshairs)[d ? 0 : 1], !1);
                b = e.options.events; - 1 === a.axes.indexOf(e) && (d ? a.axes.splice(a.xAxis.length, 0, e) :
                    a.axes.push(e), a[e.coll].push(e));
                e.series = e.series || [];
                a.inverted && !e.isZAxis && d && void 0 === e.reversed && (e.reversed = !0);
                q(b, function(a, b) {
                    c.isFunction(a) && g(e, b, a)
                });
                e.lin2log = u.linearToLogConverter || e.lin2log;
                e.isLog && (e.val2lin = e.log2lin, e.lin2val = e.lin2log);
                n(this, "afterInit")
            },
            setOptions: function(b) {
                this.options = x(this.defaultOptions, "yAxis" === this.coll && this.defaultYAxisOptions, [this.defaultTopAxisOptions, this.defaultRightAxisOptions, this.defaultBottomAxisOptions, this.defaultLeftAxisOptions][this.side],
                    x(a[this.coll], b));
                n(this, "afterSetOptions", {
                    userOptions: b
                })
            },
            defaultLabelFormatter: function() {
                var b = this.axis,
                    d = this.value,
                    e = b.chart.time,
                    h = b.categories,
                    l = this.dateTimeLabelFormat,
                    n = a.lang,
                    t = n.numericSymbols;
                n = n.numericSymbolMagnitude || 1E3;
                var g = t && t.length,
                    r = b.options.labels.format;
                b = b.isLog ? Math.abs(d) : b.tickInterval;
                if (r) var B = F(r, this, e);
                else if (h) B = d;
                else if (l) B = e.dateFormat(l, d);
                else if (g && 1E3 <= b)
                    for (; g-- && void 0 === B;) e = Math.pow(n, g + 1), b >= e && 0 === 10 * d % e && null !== t[g] && 0 !== d && (B = c.numberFormat(d /
                        e, -1) + t[g]);
                void 0 === B && (B = 1E4 <= Math.abs(d) ? c.numberFormat(d, -1) : c.numberFormat(d, -1, void 0, ""));
                return B
            },
            getSeriesExtremes: function() {
                var a = this,
                    b = a.chart,
                    d;
                n(this, "getSeriesExtremes", null, function() {
                    a.hasVisibleSeries = !1;
                    a.dataMin = a.dataMax = a.threshold = null;
                    a.softThreshold = !a.isXAxis;
                    a.buildStacks && a.buildStacks();
                    a.series.forEach(function(e) {
                        if (e.visible || !b.options.chart.ignoreHiddenSeries) {
                            var u = e.options,
                                c = u.threshold;
                            a.hasVisibleSeries = !0;
                            a.positiveValuesOnly && 0 >= c && (c = null);
                            if (a.isXAxis) {
                                if (u =
                                    e.xData, u.length) {
                                    d = e.getXExtremes(u);
                                    var z = d.min;
                                    var h = d.max;
                                    G(z) || z instanceof Date || (u = u.filter(G), d = e.getXExtremes(u), z = d.min, h = d.max);
                                    u.length && (a.dataMin = Math.min(k(a.dataMin, z), z), a.dataMax = Math.max(k(a.dataMax, h), h))
                                }
                            } else if (e.getExtremes(), h = e.dataMax, z = e.dataMin, A(z) && A(h) && (a.dataMin = Math.min(k(a.dataMin, z), z), a.dataMax = Math.max(k(a.dataMax, h), h)), A(c) && (a.threshold = c), !u.softThreshold || a.positiveValuesOnly) a.softThreshold = !1
                        }
                    })
                });
                n(this, "afterGetSeriesExtremes")
            },
            translate: function(a,
                b, d, e, c, h) {
                var u = this.linkedParent || this,
                    z = 1,
                    l = 0,
                    n = e ? u.oldTransA : u.transA;
                e = e ? u.oldMin : u.min;
                var t = u.minPixelPadding;
                c = (u.isOrdinal || u.isBroken || u.isLog && c) && u.lin2val;
                n || (n = u.transA);
                d && (z *= -1, l = u.len);
                u.reversed && (z *= -1, l -= z * (u.sector || u.len));
                b ? (a = (a * z + l - t) / n + e, c && (a = u.lin2val(a))) : (c && (a = u.val2lin(a)), a = G(e) ? z * (a - e) * n + l + z * t + (G(h) ? n * h : 0) : void 0);
                return a
            },
            toPixels: function(a, b) {
                return this.translate(a, !1, !this.horiz, null, !0) + (b ? 0 : this.pos)
            },
            toValue: function(a, b) {
                return this.translate(a - (b ? 0 : this.pos), !0, !this.horiz, null, !0)
            },
            getPlotLinePath: function(a) {
                var b = this,
                    d = b.chart,
                    e = b.left,
                    c = b.top,
                    h = a.old,
                    z = a.value,
                    l = a.translatedValue,
                    t = a.lineWidth,
                    g = a.force,
                    r, B, x, I, f = h && d.oldChartHeight || d.chartHeight,
                    m = h && d.oldChartWidth || d.chartWidth,
                    F, q = b.transB,
                    w = function(a, b, d) {
                        if ("pass" !== g && a < b || a > d) g ? a = Math.min(Math.max(b, a), d) : F = !0;
                        return a
                    };
                a = {
                    value: z,
                    lineWidth: t,
                    old: h,
                    force: g,
                    acrossPanes: a.acrossPanes,
                    translatedValue: l
                };
                n(this, "getPlotLinePath", a, function(a) {
                    l = k(l, b.translate(z, null, null, h));
                    l = Math.min(Math.max(-1E5,
                        l), 1E5);
                    r = x = Math.round(l + q);
                    B = I = Math.round(f - l - q);
                    G(l) ? b.horiz ? (B = c, I = f - b.bottom, r = x = w(r, e, e + b.width)) : (r = e, x = m - b.right, B = I = w(B, c, c + b.height)) : (F = !0, g = !1);
                    a.path = F && !g ? null : d.renderer.crispLine(["M", r, B, "L", x, I], t || 1)
                });
                return a.path
            },
            getLinearTickPositions: function(a, b, e) {
                var u = d(Math.floor(b / a) * a);
                e = d(Math.ceil(e / a) * a);
                var c = [],
                    h;
                d(u + a) === u && (h = 20);
                if (this.single) return [b];
                for (b = u; b <= e;) {
                    c.push(b);
                    b = d(b + a, h);
                    if (b === z) break;
                    var z = b
                }
                return c
            },
            getMinorTickInterval: function() {
                var a = this.options;
                return !0 ===
                    a.minorTicks ? k(a.minorTickInterval, "auto") : !1 === a.minorTicks ? null : a.minorTickInterval
            },
            getMinorTickPositions: function() {
                var a = this,
                    b = a.options,
                    d = a.tickPositions,
                    e = a.minorTickInterval,
                    c = [],
                    h = a.pointRangePadding || 0,
                    l = a.min - h;
                h = a.max + h;
                var n = h - l;
                if (n && n / e < a.len / 3)
                    if (a.isLog) this.paddedTicks.forEach(function(b, d, u) {
                        d && c.push.apply(c, a.getLogTickPositions(e, u[d - 1], u[d], !0))
                    });
                    else if (a.isDatetimeAxis && "auto" === this.getMinorTickInterval()) c = c.concat(a.getTimeTicks(a.normalizeTimeTickInterval(e), l, h, b.startOfWeek));
                else
                    for (b = l + (d[0] - l) % e; b <= h && b !== c[0]; b += e) c.push(b);
                0 !== c.length && a.trimTicks(c);
                return c
            },
            adjustForMinRange: function() {
                var a = this.options,
                    b = this.min,
                    d = this.max,
                    e, c, h, l, n;
                this.isXAxis && void 0 === this.minRange && !this.isLog && (A(a.min) || A(a.max) ? this.minRange = null : (this.series.forEach(function(a) {
                    l = a.xData;
                    for (c = n = a.xIncrement ? 1 : l.length - 1; 0 < c; c--)
                        if (h = l[c] - l[c - 1], void 0 === e || h < e) e = h
                }), this.minRange = Math.min(5 * e, this.dataMax - this.dataMin)));
                if (d - b < this.minRange) {
                    var t = this.dataMax - this.dataMin >= this.minRange;
                    var g = this.minRange;
                    var r = (g - d + b) / 2;
                    r = [b - r, k(a.min, b - r)];
                    t && (r[2] = this.isLog ? this.log2lin(this.dataMin) : this.dataMin);
                    b = H(r);
                    d = [b + g, k(a.max, b + g)];
                    t && (d[2] = this.isLog ? this.log2lin(this.dataMax) : this.dataMax);
                    d = D(d);
                    d - b < g && (r[0] = d - g, r[1] = k(a.min, d - g), b = H(r))
                }
                this.min = b;
                this.max = d
            },
            getClosest: function() {
                var a;
                this.categories ? a = 1 : this.series.forEach(function(b) {
                    var d = b.closestPointRange,
                        e = b.visible || !b.chart.options.chart.ignoreHiddenSeries;
                    !b.noSharedTooltip && A(d) && e && (a = A(a) ? Math.min(a, d) : d)
                });
                return a
            },
            nameToX: function(a) {
                var b = y(this.categories),
                    d = b ? this.categories : this.names,
                    e = a.options.x;
                a.series.requireSorting = !1;
                A(e) || (e = !1 === this.options.uniqueNames ? a.series.autoIncrement() : b ? d.indexOf(a.name) : k(d.keys[a.name], -1));
                if (-1 === e) {
                    if (!b) var c = d.length
                } else c = e;
                void 0 !== c && (this.names[c] = a.name, this.names.keys[a.name] = c);
                return c
            },
            updateNames: function() {
                var a = this,
                    b = this.names;
                0 < b.length && (Object.keys(b.keys).forEach(function(a) {
                    delete b.keys[a]
                }), b.length = 0, this.minRange = this.userMinRange, (this.series || []).forEach(function(b) {
                    b.xIncrement = null;
                    if (!b.points || b.isDirtyData) a.max = Math.max(a.max, b.xData.length - 1), b.processData(), b.generatePoints();
                    b.data.forEach(function(d, e) {
                        if (d && d.options && void 0 !== d.name) {
                            var u = a.nameToX(d);
                            void 0 !== u && u !== d.x && (d.x = u, b.xData[e] = u)
                        }
                    })
                }))
            },
            setAxisTranslation: function(a) {
                var b = this,
                    d = b.max - b.min,
                    e = b.axisPointRange || 0,
                    c = 0,
                    h = 0,
                    l = b.linkedParent,
                    z = !!b.categories,
                    t = b.transA,
                    g = b.isXAxis;
                if (g || z || e) {
                    var r = b.getClosest();
                    l ? (c = l.minPointOffset, h = l.pointRangePadding) : b.series.forEach(function(a) {
                        var d =
                            z ? 1 : g ? k(a.options.pointRange, r, 0) : b.axisPointRange || 0,
                            u = a.options.pointPlacement;
                        e = Math.max(e, d);
                        if (!b.single || z) a = B.xrange && a instanceof B.xrange ? !g : g, c = Math.max(c, a && v(u) ? 0 : d / 2), h = Math.max(h, a && "on" === u ? 0 : d)
                    });
                    l = b.ordinalSlope && r ? b.ordinalSlope / r : 1;
                    b.minPointOffset = c *= l;
                    b.pointRangePadding = h *= l;
                    b.pointRange = Math.min(e, b.single && z ? 1 : d);
                    g && (b.closestPointRange = r)
                }
                a && (b.oldTransA = t);
                b.translationSlope = b.transA = t = b.staticScale || b.len / (d + h || 1);
                b.transB = b.horiz ? b.left : b.bottom;
                b.minPixelPadding = t * c;
                n(this,
                    "afterSetAxisTranslation")
            },
            minFromRange: function() {
                return this.max - this.range
            },
            setTickInterval: function(a) {
                var b = this,
                    e = b.chart,
                    h = b.options,
                    z = b.isLog,
                    t = b.isDatetimeAxis,
                    g = b.isXAxis,
                    B = b.isLinked,
                    x = h.maxPadding,
                    I = h.minPadding,
                    f = h.tickInterval,
                    F = h.tickPixelInterval,
                    m = b.categories,
                    q = G(b.threshold) ? b.threshold : null,
                    w = b.softThreshold;
                t || m || B || this.getTickAmount();
                var p = k(b.userMin, h.min);
                var y = k(b.userMax, h.max);
                if (B) {
                    b.linkedParent = e[b.coll][h.linkedTo];
                    var v = b.linkedParent.getExtremes();
                    b.min = k(v.min,
                        v.dataMin);
                    b.max = k(v.max, v.dataMax);
                    h.type !== b.linkedParent.options.type && c.error(11, 1, e)
                } else {
                    if (!w && A(q))
                        if (b.dataMin >= q) v = q, I = 0;
                        else if (b.dataMax <= q) {
                        var E = q;
                        x = 0
                    }
                    b.min = k(p, v, b.dataMin);
                    b.max = k(y, E, b.dataMax)
                }
                z && (b.positiveValuesOnly && !a && 0 >= Math.min(b.min, k(b.dataMin, b.min)) && c.error(10, 1, e), b.min = d(b.log2lin(b.min), 16), b.max = d(b.log2lin(b.max), 16));
                b.range && A(b.max) && (b.userMin = b.min = p = Math.max(b.dataMin, b.minFromRange()), b.userMax = y = b.max, b.range = null);
                n(b, "foundExtremes");
                b.beforePadding && b.beforePadding();
                b.adjustForMinRange();
                !(m || b.axisPointRange || b.usePercentage || B) && A(b.min) && A(b.max) && (e = b.max - b.min) && (!A(p) && I && (b.min -= e * I), !A(y) && x && (b.max += e * x));
                G(h.softMin) && !G(b.userMin) && h.softMin < b.min && (b.min = p = h.softMin);
                G(h.softMax) && !G(b.userMax) && h.softMax > b.max && (b.max = y = h.softMax);
                G(h.floor) && (b.min = Math.min(Math.max(b.min, h.floor), Number.MAX_VALUE));
                G(h.ceiling) && (b.max = Math.max(Math.min(b.max, h.ceiling), k(b.userMax, -Number.MAX_VALUE)));
                w && A(b.dataMin) && (q = q || 0, !A(p) && b.min < q && b.dataMin >= q ? b.min =
                    b.options.minRange ? Math.min(q, b.max - b.minRange) : q : !A(y) && b.max > q && b.dataMax <= q && (b.max = b.options.minRange ? Math.max(q, b.min + b.minRange) : q));
                b.tickInterval = b.min === b.max || void 0 === b.min || void 0 === b.max ? 1 : B && !f && F === b.linkedParent.options.tickPixelInterval ? f = b.linkedParent.tickInterval : k(f, this.tickAmount ? (b.max - b.min) / Math.max(this.tickAmount - 1, 1) : void 0, m ? 1 : (b.max - b.min) * F / Math.max(b.len, F));
                g && !a && b.series.forEach(function(a) {
                    a.processData(b.min !== b.oldMin || b.max !== b.oldMax)
                });
                b.setAxisTranslation(!0);
                b.beforeSetTickPositions && b.beforeSetTickPositions();
                b.postProcessTickInterval && (b.tickInterval = b.postProcessTickInterval(b.tickInterval));
                b.pointRange && !f && (b.tickInterval = Math.max(b.pointRange, b.tickInterval));
                a = k(h.minTickInterval, b.isDatetimeAxis && b.closestPointRange);
                !f && b.tickInterval < a && (b.tickInterval = a);
                t || z || f || (b.tickInterval = l(b.tickInterval, null, r(b.tickInterval), k(h.allowDecimals, !(.5 < b.tickInterval && 5 > b.tickInterval && 1E3 < b.max && 9999 > b.max)), !!this.tickAmount));
                this.tickAmount || (b.tickInterval =
                    b.unsquish());
                this.setTickPositions()
            },
            setTickPositions: function() {
                var a = this.options,
                    b = a.tickPositions;
                var d = this.getMinorTickInterval();
                var e = a.tickPositioner,
                    h = a.startOnTick,
                    l = a.endOnTick;
                this.tickmarkOffset = this.categories && "between" === a.tickmarkPlacement && 1 === this.tickInterval ? .5 : 0;
                this.minorTickInterval = "auto" === d && this.tickInterval ? this.tickInterval / 5 : d;
                this.single = this.min === this.max && A(this.min) && !this.tickAmount && (parseInt(this.min, 10) === this.min || !1 !== a.allowDecimals);
                this.tickPositions =
                    d = b && b.slice();
                !d && (!this.ordinalPositions && (this.max - this.min) / this.tickInterval > Math.max(2 * this.len, 200) ? (d = [this.min, this.max], c.error(19, !1, this.chart)) : d = this.isDatetimeAxis ? this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval, a.units), this.min, this.max, a.startOfWeek, this.ordinalPositions, this.closestPointRange, !0) : this.isLog ? this.getLogTickPositions(this.tickInterval, this.min, this.max) : this.getLinearTickPositions(this.tickInterval, this.min, this.max), d.length > this.len && (d = [d[0],
                    d.pop()
                ], d[0] === d[1] && (d.length = 1)), this.tickPositions = d, e && (e = e.apply(this, [this.min, this.max]))) && (this.tickPositions = d = e);
                this.paddedTicks = d.slice(0);
                this.trimTicks(d, h, l);
                this.isLinked || (this.single && 2 > d.length && !this.categories && (this.min -= .5, this.max += .5), b || e || this.adjustTickAmount());
                n(this, "afterSetTickPositions")
            },
            trimTicks: function(a, b, d) {
                var e = a[0],
                    c = a[a.length - 1],
                    h = this.minPointOffset || 0;
                n(this, "trimTicks");
                if (!this.isLinked) {
                    if (b && -Infinity !== e) this.min = e;
                    else
                        for (; this.min - h > a[0];) a.shift();
                    if (d) this.max = c;
                    else
                        for (; this.max + h < a[a.length - 1];) a.pop();
                    0 === a.length && A(e) && !this.options.tickPositions && a.push((c + e) / 2)
                }
            },
            alignToOthers: function() {
                var a = {},
                    b, d = this.options;
                !1 === this.chart.options.chart.alignTicks || !1 === d.alignTicks || !1 === d.startOnTick || !1 === d.endOnTick || this.isLog || this.chart[this.coll].forEach(function(d) {
                    var e = d.options;
                    e = [d.horiz ? e.left : e.top, e.width, e.height, e.pane].join();
                    d.series.length && (a[e] ? b = !0 : a[e] = 1)
                });
                return b
            },
            getTickAmount: function() {
                var a = this.options,
                    b = a.tickAmount,
                    d = a.tickPixelInterval;
                !A(a.tickInterval) && this.len < d && !this.isRadial && !this.isLog && a.startOnTick && a.endOnTick && (b = 2);
                !b && this.alignToOthers() && (b = Math.ceil(this.len / d) + 1);
                4 > b && (this.finalTickAmt = b, b = 5);
                this.tickAmount = b
            },
            adjustTickAmount: function() {
                var a = this.options,
                    b = this.tickInterval,
                    e = this.tickPositions,
                    c = this.tickAmount,
                    h = this.finalTickAmt,
                    l = e && e.length,
                    n = k(this.threshold, this.softThreshold ? 0 : null),
                    t;
                if (this.hasData()) {
                    if (l < c) {
                        for (t = this.min; e.length < c;) e.length % 2 || t === n ? e.push(d(e[e.length -
                            1] + b)) : e.unshift(d(e[0] - b));
                        this.transA *= (l - 1) / (c - 1);
                        this.min = a.startOnTick ? e[0] : Math.min(this.min, e[0]);
                        this.max = a.endOnTick ? e[e.length - 1] : Math.max(this.max, e[e.length - 1])
                    } else l > c && (this.tickInterval *= 2, this.setTickPositions());
                    if (A(h)) {
                        for (b = a = e.length; b--;)(3 === h && 1 === b % 2 || 2 >= h && 0 < b && b < a - 1) && e.splice(b, 1);
                        this.finalTickAmt = void 0
                    }
                }
            },
            setScale: function() {
                var a = this.series.some(function(a) {
                        return a.isDirtyData || a.isDirty || a.xAxis && a.xAxis.isDirty
                    }),
                    b;
                this.oldMin = this.min;
                this.oldMax = this.max;
                this.oldAxisLength =
                    this.len;
                this.setAxisSize();
                (b = this.len !== this.oldAxisLength) || a || this.isLinked || this.forceRedraw || this.userMin !== this.oldUserMin || this.userMax !== this.oldUserMax || this.alignToOthers() ? (this.resetStacks && this.resetStacks(), this.forceRedraw = !1, this.getSeriesExtremes(), this.setTickInterval(), this.oldUserMin = this.userMin, this.oldUserMax = this.userMax, this.isDirty || (this.isDirty = b || this.min !== this.oldMin || this.max !== this.oldMax)) : this.cleanStacks && this.cleanStacks();
                n(this, "afterSetScale")
            },
            setExtremes: function(a,
                b, d, e, c) {
                var h = this,
                    l = h.chart;
                d = k(d, !0);
                h.series.forEach(function(a) {
                    delete a.kdTree
                });
                c = p(c, {
                    min: a,
                    max: b
                });
                n(h, "setExtremes", c, function() {
                    h.userMin = a;
                    h.userMax = b;
                    h.eventArgs = c;
                    d && l.redraw(e)
                })
            },
            zoom: function(a, b) {
                var d = this.dataMin,
                    e = this.dataMax,
                    c = this.options,
                    h = Math.min(d, k(c.min, d)),
                    l = Math.max(e, k(c.max, e));
                a = {
                    newMin: a,
                    newMax: b
                };
                n(this, "zoom", a, function(a) {
                    var b = a.newMin,
                        c = a.newMax;
                    if (b !== this.min || c !== this.max) this.allowZoomOutside || (A(d) && (b < h && (b = h), b > l && (b = l)), A(e) && (c < h && (c = h), c > l && (c = l))),
                        this.displayBtn = void 0 !== b || void 0 !== c, this.setExtremes(b, c, !1, void 0, {
                            trigger: "zoom"
                        });
                    a.zoomed = !0
                });
                return a.zoomed
            },
            setAxisSize: function() {
                var a = this.chart,
                    b = this.options,
                    d = b.offsets || [0, 0, 0, 0],
                    e = this.horiz,
                    h = this.width = Math.round(c.relativeLength(k(b.width, a.plotWidth - d[3] + d[1]), a.plotWidth)),
                    l = this.height = Math.round(c.relativeLength(k(b.height, a.plotHeight - d[0] + d[2]), a.plotHeight)),
                    n = this.top = Math.round(c.relativeLength(k(b.top, a.plotTop + d[0]), a.plotHeight, a.plotTop));
                b = this.left = Math.round(c.relativeLength(k(b.left,
                    a.plotLeft + d[3]), a.plotWidth, a.plotLeft));
                this.bottom = a.chartHeight - l - n;
                this.right = a.chartWidth - h - b;
                this.len = Math.max(e ? h : l, 0);
                this.pos = e ? b : n
            },
            getExtremes: function() {
                var a = this.isLog;
                return {
                    min: a ? d(this.lin2log(this.min)) : this.min,
                    max: a ? d(this.lin2log(this.max)) : this.max,
                    dataMin: this.dataMin,
                    dataMax: this.dataMax,
                    userMin: this.userMin,
                    userMax: this.userMax
                }
            },
            getThreshold: function(a) {
                var b = this.isLog,
                    d = b ? this.lin2log(this.min) : this.min;
                b = b ? this.lin2log(this.max) : this.max;
                null === a || -Infinity === a ? a = d : Infinity ===
                    a ? a = b : d > a ? a = d : b < a && (a = b);
                return this.translate(a, 0, 1, 0, 1)
            },
            autoLabelAlign: function(a) {
                var b = (k(a, 0) - 90 * this.side + 720) % 360;
                a = {
                    align: "center"
                };
                n(this, "autoLabelAlign", a, function(a) {
                    15 < b && 165 > b ? a.align = "right" : 195 < b && 345 > b && (a.align = "left")
                });
                return a.align
            },
            tickSize: function(a) {
                var b = this.options,
                    d = b[a + "Length"],
                    e = k(b[a + "Width"], "tick" === a && this.isXAxis && !this.categories ? 1 : 0);
                if (e && d) {
                    "inside" === b[a + "Position"] && (d = -d);
                    var c = [d, e]
                }
                a = {
                    tickSize: c
                };
                n(this, "afterTickSize", a);
                return a.tickSize
            },
            labelMetrics: function() {
                var a =
                    this.tickPositions && this.tickPositions[0] || 0;
                return this.chart.renderer.fontMetrics(this.options.labels.style && this.options.labels.style.fontSize, this.ticks[a] && this.ticks[a].label)
            },
            unsquish: function() {
                var a = this.options.labels,
                    b = this.horiz,
                    e = this.tickInterval,
                    c = e,
                    l = this.len / (((this.categories ? 1 : 0) + this.max - this.min) / e),
                    n, t = a.rotation,
                    g = this.labelMetrics(),
                    r, B = Number.MAX_VALUE,
                    x, I = this.max - this.min,
                    f = function(a) {
                        var b = a / (l || 1);
                        b = 1 < b ? Math.ceil(b) : 1;
                        b * e > I && Infinity !== a && Infinity !== l && I && (b = Math.ceil(I /
                            e));
                        return d(b * e)
                    };
                b ? (x = !a.staggerLines && !a.step && (A(t) ? [t] : l < k(a.autoRotationLimit, 80) && a.autoRotation)) && x.forEach(function(a) {
                    if (a === t || a && -90 <= a && 90 >= a) {
                        r = f(Math.abs(g.h / Math.sin(h * a)));
                        var b = r + Math.abs(a / 360);
                        b < B && (B = b, n = a, c = r)
                    }
                }) : a.step || (c = f(g.h));
                this.autoRotation = x;
                this.labelRotation = k(n, t);
                return c
            },
            getSlotWidth: function(a) {
                var b = this.chart,
                    d = this.horiz,
                    e = this.options.labels,
                    c = Math.max(this.tickPositions.length - (this.categories ? 0 : 1), 1),
                    h = b.margin[3];
                return a && a.slotWidth || d && 2 > (e.step ||
                    0) && !e.rotation && (this.staggerLines || 1) * this.len / c || !d && (e.style && parseInt(e.style.width, 10) || h && h - b.spacing[3] || .33 * b.chartWidth)
            },
            renderUnsquish: function() {
                var a = this.chart,
                    b = a.renderer,
                    d = this.tickPositions,
                    e = this.ticks,
                    c = this.options.labels,
                    h = c && c.style || {},
                    l = this.horiz,
                    n = this.getSlotWidth(),
                    t = Math.max(1, Math.round(n - 2 * (c.padding || 5))),
                    g = {},
                    r = this.labelMetrics(),
                    B = c.style && c.style.textOverflow,
                    k = 0;
                v(c.rotation) || (g.rotation = c.rotation || 0);
                d.forEach(function(a) {
                    (a = e[a]) && a.label && a.label.textPxLength >
                        k && (k = a.label.textPxLength)
                });
                this.maxLabelLength = k;
                if (this.autoRotation) k > t && k > r.h ? g.rotation = this.labelRotation : this.labelRotation = 0;
                else if (n) {
                    var x = t;
                    if (!B) {
                        var I = "clip";
                        for (t = d.length; !l && t--;) {
                            var f = d[t];
                            if (f = e[f].label) f.styles && "ellipsis" === f.styles.textOverflow ? f.css({
                                textOverflow: "clip"
                            }) : f.textPxLength > n && f.css({
                                width: n + "px"
                            }), f.getBBox().height > this.len / d.length - (r.h - r.f) && (f.specificTextOverflow = "ellipsis")
                        }
                    }
                }
                g.rotation && (x = k > .5 * a.chartHeight ? .33 * a.chartHeight : k, B || (I = "ellipsis"));
                if (this.labelAlign =
                    c.align || this.autoLabelAlign(this.labelRotation)) g.align = this.labelAlign;
                d.forEach(function(a) {
                    var b = (a = e[a]) && a.label,
                        d = h.width,
                        c = {};
                    b && (b.attr(g), a.shortenLabel ? a.shortenLabel() : x && !d && "nowrap" !== h.whiteSpace && (x < b.textPxLength || "SPAN" === b.element.tagName) ? (c.width = x, B || (c.textOverflow = b.specificTextOverflow || I), b.css(c)) : b.styles && b.styles.width && !c.width && !d && b.css({
                        width: null
                    }), delete b.specificTextOverflow, a.rotation = g.rotation)
                }, this);
                this.tickRotCorr = b.rotCorr(r.b, this.labelRotation || 0, 0 !==
                    this.side)
            },
            hasData: function() {
                return this.series.some(function(a) {
                    return a.hasData()
                }) || this.options.showEmpty && A(this.min) && A(this.max)
            },
            addTitle: function(a) {
                var b = this.chart.renderer,
                    d = this.horiz,
                    e = this.opposite,
                    c = this.options.title,
                    h, l = this.chart.styledMode;
                this.axisTitle || ((h = c.textAlign) || (h = (d ? {
                        low: "left",
                        middle: "center",
                        high: "right"
                    } : {
                        low: e ? "right" : "left",
                        middle: "center",
                        high: e ? "left" : "right"
                    })[c.align]), this.axisTitle = b.text(c.text, 0, 0, c.useHTML).attr({
                        zIndex: 7,
                        rotation: c.rotation || 0,
                        align: h
                    }).addClass("highcharts-axis-title"),
                    l || this.axisTitle.css(x(c.style)), this.axisTitle.add(this.axisGroup), this.axisTitle.isNew = !0);
                l || c.style.width || this.isRadial || this.axisTitle.css({
                    width: this.len
                });
                this.axisTitle[a ? "show" : "hide"](a)
            },
            generateTick: function(a) {
                var b = this.ticks;
                b[a] ? b[a].addLabel() : b[a] = new I(this, a)
            },
            getOffset: function() {
                var a = this,
                    b = a.chart,
                    d = b.renderer,
                    e = a.options,
                    c = a.tickPositions,
                    h = a.ticks,
                    l = a.horiz,
                    t = a.side,
                    g = b.inverted && !a.isZAxis ? [1, 0, 3, 2][t] : t,
                    r, B = 0,
                    x = 0,
                    I = e.title,
                    f = e.labels,
                    F = 0,
                    m = b.axisOffset;
                b = b.clipOffset;
                var w = [-1, 1, 1, -1][t],
                    p = e.className,
                    y = a.axisParent;
                var v = a.hasData();
                a.showAxis = r = v || k(e.showEmpty, !0);
                a.staggerLines = a.horiz && f.staggerLines;
                a.axisGroup || (a.gridGroup = d.g("grid").attr({
                    zIndex: e.gridZIndex || 1
                }).addClass("highcharts-" + this.coll.toLowerCase() + "-grid " + (p || "")).add(y), a.axisGroup = d.g("axis").attr({
                    zIndex: e.zIndex || 2
                }).addClass("highcharts-" + this.coll.toLowerCase() + " " + (p || "")).add(y), a.labelGroup = d.g("axis-labels").attr({
                    zIndex: f.zIndex || 7
                }).addClass("highcharts-" + a.coll.toLowerCase() +
                    "-labels " + (p || "")).add(y));
                v || a.isLinked ? (c.forEach(function(b, d) {
                    a.generateTick(b, d)
                }), a.renderUnsquish(), a.reserveSpaceDefault = 0 === t || 2 === t || {
                    1: "left",
                    3: "right"
                }[t] === a.labelAlign, k(f.reserveSpace, "center" === a.labelAlign ? !0 : null, a.reserveSpaceDefault) && c.forEach(function(a) {
                    F = Math.max(h[a].getLabelSize(), F)
                }), a.staggerLines && (F *= a.staggerLines), a.labelOffset = F * (a.opposite ? -1 : 1)) : q(h, function(a, b) {
                    a.destroy();
                    delete h[b]
                });
                if (I && I.text && !1 !== I.enabled && (a.addTitle(r), r && !1 !== I.reserveSpace)) {
                    a.titleOffset =
                        B = a.axisTitle.getBBox()[l ? "height" : "width"];
                    var G = I.offset;
                    x = A(G) ? 0 : k(I.margin, l ? 5 : 10)
                }
                a.renderLine();
                a.offset = w * k(e.offset, m[t] ? m[t] + (e.margin || 0) : 0);
                a.tickRotCorr = a.tickRotCorr || {
                    x: 0,
                    y: 0
                };
                d = 0 === t ? -a.labelMetrics().h : 2 === t ? a.tickRotCorr.y : 0;
                x = Math.abs(F) + x;
                F && (x = x - d + w * (l ? k(f.y, a.tickRotCorr.y + 8 * w) : f.x));
                a.axisTitleMargin = k(G, x);
                a.getMaxLabelDimensions && (a.maxLabelDimensions = a.getMaxLabelDimensions(h, c));
                l = this.tickSize("tick");
                m[t] = Math.max(m[t], a.axisTitleMargin + B + w * a.offset, x, c && c.length && l ? l[0] +
                    w * a.offset : 0);
                e = e.offset ? 0 : 2 * Math.floor(a.axisLine.strokeWidth() / 2);
                b[g] = Math.max(b[g], e);
                n(this, "afterGetOffset")
            },
            getLinePath: function(a) {
                var b = this.chart,
                    d = this.opposite,
                    e = this.offset,
                    c = this.horiz,
                    h = this.left + (d ? this.width : 0) + e;
                e = b.chartHeight - this.bottom - (d ? this.height : 0) + e;
                d && (a *= -1);
                return b.renderer.crispLine(["M", c ? this.left : h, c ? e : this.top, "L", c ? b.chartWidth - this.right : h, c ? e : b.chartHeight - this.bottom], a)
            },
            renderLine: function() {
                this.axisLine || (this.axisLine = this.chart.renderer.path().addClass("highcharts-axis-line").add(this.axisGroup),
                    this.chart.styledMode || this.axisLine.attr({
                        stroke: this.options.lineColor,
                        "stroke-width": this.options.lineWidth,
                        zIndex: 7
                    }))
            },
            getTitlePosition: function() {
                var a = this.horiz,
                    b = this.left,
                    d = this.top,
                    e = this.len,
                    c = this.options.title,
                    h = a ? b : d,
                    l = this.opposite,
                    t = this.offset,
                    g = c.x || 0,
                    r = c.y || 0,
                    B = this.axisTitle,
                    k = this.chart.renderer.fontMetrics(c.style && c.style.fontSize, B);
                B = Math.max(B.getBBox(null, 0).height - k.h - 1, 0);
                e = {
                    low: h + (a ? 0 : e),
                    middle: h + e / 2,
                    high: h + (a ? e : 0)
                }[c.align];
                b = (a ? d + this.height : b) + (a ? 1 : -1) * (l ? -1 : 1) * this.axisTitleMargin + [-B, B, k.f, -B][this.side];
                a = {
                    x: a ? e + g : b + (l ? this.width : 0) + t + g,
                    y: a ? b + r - (l ? this.height : 0) + t : e + r
                };
                n(this, "afterGetTitlePosition", {
                    titlePosition: a
                });
                return a
            },
            renderMinorTick: function(a) {
                var b = this.chart.hasRendered && G(this.oldMin),
                    d = this.minorTicks;
                d[a] || (d[a] = new I(this, a, "minor"));
                b && d[a].isNew && d[a].render(null, !0);
                d[a].render(null, !1, 1)
            },
            renderTick: function(a, b) {
                var d = this.isLinked,
                    e = this.ticks,
                    c = this.chart.hasRendered && G(this.oldMin);
                if (!d || a >= this.min && a <= this.max) e[a] || (e[a] = new I(this, a)), c && e[a].isNew &&
                    e[a].render(b, !0, -1), e[a].render(b)
            },
            render: function() {
                var a = this,
                    b = a.chart,
                    d = a.options,
                    h = a.isLog,
                    l = a.isLinked,
                    t = a.tickPositions,
                    g = a.axisTitle,
                    r = a.ticks,
                    B = a.minorTicks,
                    k = a.alternateBands,
                    x = d.stackLabels,
                    f = d.alternateGridColor,
                    F = a.tickmarkOffset,
                    m = a.axisLine,
                    p = a.showAxis,
                    y = e(b.renderer.globalAnimation),
                    v, A;
                a.labelEdge.length = 0;
                a.overlap = !1;
                [r, B, k].forEach(function(a) {
                    q(a, function(a) {
                        a.isActive = !1
                    })
                });
                if (a.hasData() || l) a.minorTickInterval && !a.categories && a.getMinorTickPositions().forEach(function(b) {
                        a.renderMinorTick(b)
                    }),
                    t.length && (t.forEach(function(b, d) {
                        a.renderTick(b, d)
                    }), F && (0 === a.min || a.single) && (r[-1] || (r[-1] = new I(a, -1, null, !0)), r[-1].render(-1))), f && t.forEach(function(d, e) {
                        A = void 0 !== t[e + 1] ? t[e + 1] + F : a.max - F;
                        0 === e % 2 && d < a.max && A <= a.max + (b.polar ? -F : F) && (k[d] || (k[d] = new c.PlotLineOrBand(a)), v = d + F, k[d].options = {
                            from: h ? a.lin2log(v) : v,
                            to: h ? a.lin2log(A) : A,
                            color: f
                        }, k[d].render(), k[d].isActive = !0)
                    }), a._addedPlotLB || ((d.plotLines || []).concat(d.plotBands || []).forEach(function(b) {
                        a.addPlotBandOrLine(b)
                    }), a._addedPlotLB = !0);
                [r, B, k].forEach(function(a) {
                    var d, e = [],
                        c = y.duration;
                    q(a, function(a, b) {
                        a.isActive || (a.render(b, !1, 0), a.isActive = !1, e.push(b))
                    });
                    w(function() {
                        for (d = e.length; d--;) a[e[d]] && !a[e[d]].isActive && (a[e[d]].destroy(), delete a[e[d]])
                    }, a !== k && b.hasRendered && c ? c : 0)
                });
                m && (m[m.isPlaced ? "animate" : "attr"]({
                    d: this.getLinePath(m.strokeWidth())
                }), m.isPlaced = !0, m[p ? "show" : "hide"](p));
                g && p && (d = a.getTitlePosition(), G(d.y) ? (g[g.isNew ? "attr" : "animate"](d), g.isNew = !1) : (g.attr("y", -9999), g.isNew = !0));
                x && x.enabled && a.renderStackTotals();
                a.isDirty = !1;
                n(this, "afterRender")
            },
            redraw: function() {
                this.visible && (this.render(), this.plotLinesAndBands.forEach(function(a) {
                    a.render()
                }));
                this.series.forEach(function(a) {
                    a.isDirty = !0
                })
            },
            keepProps: "extKey hcEvents names series userMax userMin".split(" "),
            destroy: function(a) {
                var b = this,
                    d = b.stacks,
                    e = b.plotLinesAndBands,
                    c;
                n(this, "destroy", {
                    keepEvents: a
                });
                a || t(b);
                q(d, function(a, b) {
                    E(a);
                    d[b] = null
                });
                [b.ticks, b.minorTicks, b.alternateBands].forEach(function(a) {
                    E(a)
                });
                if (e)
                    for (a = e.length; a--;) e[a].destroy();
                "stackTotalGroup axisLine axisTitle axisGroup gridGroup labelGroup cross scrollbar".split(" ").forEach(function(a) {
                    b[a] && (b[a] = b[a].destroy())
                });
                for (c in b.plotLinesAndBandsGroups) b.plotLinesAndBandsGroups[c] = b.plotLinesAndBandsGroups[c].destroy();
                q(b, function(a, d) {
                    -1 === b.keepProps.indexOf(d) && delete b[d]
                })
            },
            drawCrosshair: function(a, d) {
                var e, c = this.crosshair,
                    h = k(c.snap, !0),
                    l, t = this.cross;
                n(this, "drawCrosshair", {
                    e: a,
                    point: d
                });
                a || (a = this.cross && this.cross.e);
                if (this.crosshair && !1 !== (A(d) || !h)) {
                    h ? A(d) &&
                        (l = k("colorAxis" !== this.coll ? d.crosshairPos : null, this.isXAxis ? d.plotX : this.len - d.plotY)) : l = a && (this.horiz ? a.chartX - this.pos : this.len - a.chartY + this.pos);
                    A(l) && (e = this.getPlotLinePath({
                        value: d && (this.isXAxis ? d.x : k(d.stackY, d.y)),
                        translatedValue: l
                    }) || null);
                    if (!A(e)) {
                        this.hideCrosshair();
                        return
                    }
                    h = this.categories && !this.isRadial;
                    t || (this.cross = t = this.chart.renderer.path().addClass("highcharts-crosshair highcharts-crosshair-" + (h ? "category " : "thin ") + c.className).attr({
                            zIndex: k(c.zIndex, 2)
                        }).add(), this.chart.styledMode ||
                        (t.attr({
                            stroke: c.color || (h ? b("#ccd6eb").setOpacity(.25).get() : "#cccccc"),
                            "stroke-width": k(c.width, 1)
                        }).css({
                            "pointer-events": "none"
                        }), c.dashStyle && t.attr({
                            dashstyle: c.dashStyle
                        })));
                    t.show().attr({
                        d: e
                    });
                    h && !c.width && t.attr({
                        "stroke-width": this.transA
                    });
                    this.cross.e = a
                } else this.hideCrosshair();
                n(this, "afterDrawCrosshair", {
                    e: a,
                    point: d
                })
            },
            hideCrosshair: function() {
                this.cross && this.cross.hide();
                n(this, "afterHideCrosshair")
            }
        });
        return c.Axis = f
    });
    K(C, "parts/DateTimeAxis.js", [C["parts/Globals.js"]], function(c) {
        var f =
            c.Axis,
            H = c.getMagnitude,
            D = c.normalizeTickInterval,
            A = c.timeUnits;
        f.prototype.getTimeTicks = function() {
            return this.chart.time.getTimeTicks.apply(this.chart.time, arguments)
        };
        f.prototype.normalizeTimeTickInterval = function(c, f) {
            var y = f || [
                ["millisecond", [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]],
                ["second", [1, 2, 5, 10, 15, 30]],
                ["minute", [1, 2, 5, 10, 15, 30]],
                ["hour", [1, 2, 3, 4, 6, 8, 12]],
                ["day", [1, 2]],
                ["week", [1, 2]],
                ["month", [1, 2, 3, 4, 6]],
                ["year", null]
            ];
            f = y[y.length - 1];
            var p = A[f[0]],
                v = f[1],
                q;
            for (q = 0; q < y.length && !(f = y[q], p = A[f[0]],
                    v = f[1], y[q + 1] && c <= (p * v[v.length - 1] + A[y[q + 1][0]]) / 2); q++);
            p === A.year && c < 5 * p && (v = [1, 2, 5]);
            c = D(c / p, v, "year" === f[0] ? Math.max(H(c / p), 1) : 1);
            return {
                unitRange: p,
                count: c,
                unitName: f[0]
            }
        }
    });
    K(C, "parts/LogarithmicAxis.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.pick;
        f = c.Axis;
        var D = c.getMagnitude,
            A = c.normalizeTickInterval;
        f.prototype.getLogTickPositions = function(c, f, y, G) {
            var p = this.options,
                q = this.len,
                k = [];
            G || (this._minorAutoInterval = null);
            if (.5 <= c) c = Math.round(c), k = this.getLinearTickPositions(c,
                f, y);
            else if (.08 <= c) {
                q = Math.floor(f);
                var m, w;
                for (p = .3 < c ? [1, 2, 4] : .15 < c ? [1, 2, 4, 6, 8] : [1, 2, 3, 4, 5, 6, 7, 8, 9]; q < y + 1 && !w; q++) {
                    var g = p.length;
                    for (m = 0; m < g && !w; m++) {
                        var e = this.log2lin(this.lin2log(q) * p[m]);
                        e > f && (!G || b <= y) && void 0 !== b && k.push(b);
                        b > y && (w = !0);
                        var b = e
                    }
                }
            } else f = this.lin2log(f), y = this.lin2log(y), c = G ? this.getMinorTickInterval() : p.tickInterval, c = H("auto" === c ? null : c, this._minorAutoInterval, p.tickPixelInterval / (G ? 5 : 1) * (y - f) / ((G ? q / this.tickPositions.length : q) || 1)), c = A(c, null, D(c)), k = this.getLinearTickPositions(c,
                f, y).map(this.log2lin), G || (this._minorAutoInterval = c / 5);
            G || (this.tickInterval = c);
            return k
        };
        f.prototype.log2lin = function(c) {
            return Math.log(c) / Math.LN10
        };
        f.prototype.lin2log = function(c) {
            return Math.pow(10, c)
        }
    });
    K(C, "parts/PlotLineOrBand.js", [C["parts/Globals.js"], C["parts/Axis.js"], C["parts/Utilities.js"]], function(c, f, H) {
        var D = H.arrayMax,
            A = H.arrayMin,
            E = H.defined,
            p = H.destroyObjectProperties,
            y = H.erase,
            G = H.extend,
            v = H.objectEach,
            q = H.pick,
            k = c.merge;
        c.PlotLineOrBand = function(c, k) {
            this.axis = c;
            k && (this.options =
                k, this.id = k.id)
        };
        c.PlotLineOrBand.prototype = {
            render: function() {
                c.fireEvent(this, "render");
                var f = this,
                    w = f.axis,
                    g = w.horiz,
                    e = f.options,
                    b = e.label,
                    d = f.label,
                    a = e.to,
                    h = e.from,
                    n = e.value,
                    F = E(h) && E(a),
                    r = E(n),
                    x = f.svgElem,
                    l = !x,
                    t = [],
                    B = e.color,
                    I = q(e.zIndex, 0),
                    z = e.events;
                t = {
                    "class": "highcharts-plot-" + (F ? "band " : "line ") + (e.className || "")
                };
                var u = {},
                    L = w.chart.renderer,
                    M = F ? "bands" : "lines";
                w.isLog && (h = w.log2lin(h), a = w.log2lin(a), n = w.log2lin(n));
                w.chart.styledMode || (r ? (t.stroke = B || "#999999", t["stroke-width"] = q(e.width,
                    1), e.dashStyle && (t.dashstyle = e.dashStyle)) : F && (t.fill = B || "#e6ebf5", e.borderWidth && (t.stroke = e.borderColor, t["stroke-width"] = e.borderWidth)));
                u.zIndex = I;
                M += "-" + I;
                (B = w.plotLinesAndBandsGroups[M]) || (w.plotLinesAndBandsGroups[M] = B = L.g("plot-" + M).attr(u).add());
                l && (f.svgElem = x = L.path().attr(t).add(B));
                if (r) t = w.getPlotLinePath({
                    value: n,
                    lineWidth: x.strokeWidth(),
                    acrossPanes: e.acrossPanes
                });
                else if (F) t = w.getPlotBandPath(h, a, e);
                else return;
                (l || !x.d) && t && t.length ? (x.attr({
                    d: t
                }), z && v(z, function(a, b) {
                    x.on(b,
                        function(a) {
                            z[b].apply(f, [a])
                        })
                })) : x && (t ? (x.show(!0), x.animate({
                    d: t
                })) : x.d && (x.hide(), d && (f.label = d = d.destroy())));
                b && (E(b.text) || E(b.formatter)) && t && t.length && 0 < w.width && 0 < w.height && !t.isFlat ? (b = k({
                    align: g && F && "center",
                    x: g ? !F && 4 : 10,
                    verticalAlign: !g && F && "middle",
                    y: g ? F ? 16 : 10 : F ? 6 : -4,
                    rotation: g && !F && 90
                }, b), this.renderLabel(b, t, F, I)) : d && d.hide();
                return f
            },
            renderLabel: function(c, k, g, e) {
                var b = this.label,
                    d = this.axis.chart.renderer;
                b || (b = {
                    align: c.textAlign || c.align,
                    rotation: c.rotation,
                    "class": "highcharts-plot-" +
                        (g ? "band" : "line") + "-label " + (c.className || "")
                }, b.zIndex = e, e = this.getLabelText(c), this.label = b = d.text(e, 0, 0, c.useHTML).attr(b).add(), this.axis.chart.styledMode || b.css(c.style));
                d = k.xBounds || [k[1], k[4], g ? k[6] : k[1]];
                k = k.yBounds || [k[2], k[5], g ? k[7] : k[2]];
                g = A(d);
                e = A(k);
                b.align(c, !1, {
                    x: g,
                    y: e,
                    width: D(d) - g,
                    height: D(k) - e
                });
                b.show(!0)
            },
            getLabelText: function(c) {
                return E(c.formatter) ? c.formatter.call(this) : c.text
            },
            destroy: function() {
                y(this.axis.plotLinesAndBands, this);
                delete this.axis;
                p(this)
            }
        };
        G(f.prototype, {
            getPlotBandPath: function(c, k) {
                var g = this.getPlotLinePath({
                        value: k,
                        force: !0,
                        acrossPanes: this.options.acrossPanes
                    }),
                    e = this.getPlotLinePath({
                        value: c,
                        force: !0,
                        acrossPanes: this.options.acrossPanes
                    }),
                    b = [],
                    d = this.horiz,
                    a = 1;
                c = c < this.min && k < this.min || c > this.max && k > this.max;
                if (e && g) {
                    if (c) {
                        var h = e.toString() === g.toString();
                        a = 0
                    }
                    for (c = 0; c < e.length; c += 6) d && g[c + 1] === e[c + 1] ? (g[c + 1] += a, g[c + 4] += a) : d || g[c + 2] !== e[c + 2] || (g[c + 2] += a, g[c + 5] += a), b.push("M", e[c + 1], e[c + 2], "L", e[c + 4], e[c + 5], g[c + 4], g[c + 5], g[c + 1], g[c + 2], "z"),
                        b.isFlat = h
                }
                return b
            },
            addPlotBand: function(c) {
                return this.addPlotBandOrLine(c, "plotBands")
            },
            addPlotLine: function(c) {
                return this.addPlotBandOrLine(c, "plotLines")
            },
            addPlotBandOrLine: function(k, f) {
                var g = (new c.PlotLineOrBand(this, k)).render(),
                    e = this.userOptions;
                if (g) {
                    if (f) {
                        var b = e[f] || [];
                        b.push(k);
                        e[f] = b
                    }
                    this.plotLinesAndBands.push(g)
                }
                return g
            },
            removePlotBandOrLine: function(c) {
                for (var k = this.plotLinesAndBands, g = this.options, e = this.userOptions, b = k.length; b--;) k[b].id === c && k[b].destroy();
                [g.plotLines || [], e.plotLines || [], g.plotBands || [], e.plotBands || []].forEach(function(d) {
                    for (b = d.length; b--;) d[b].id === c && y(d, d[b])
                })
            },
            removePlotBand: function(c) {
                this.removePlotBandOrLine(c)
            },
            removePlotLine: function(c) {
                this.removePlotBandOrLine(c)
            }
        })
    });
    K(C, "parts/Tooltip.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.defined,
            D = f.discardElement,
            A = f.extend,
            E = f.isNumber,
            p = f.isString,
            y = f.pick,
            G = f.splat,
            v = f.syncTimeout;
        "";
        var q = c.doc,
            k = c.format,
            m = c.merge,
            w = c.timeUnits;
        c.Tooltip = function() {
            this.init.apply(this,
                arguments)
        };
        c.Tooltip.prototype = {
            init: function(c, e) {
                this.chart = c;
                this.options = e;
                this.crosshairs = [];
                this.now = {
                    x: 0,
                    y: 0
                };
                this.isHidden = !0;
                this.split = e.split && !c.inverted;
                this.shared = e.shared || this.split;
                this.outside = y(e.outside, !(!c.scrollablePixelsX && !c.scrollablePixelsY))
            },
            cleanSplit: function(c) {
                this.chart.series.forEach(function(e) {
                    var b = e && e.tt;
                    b && (!b.isActive || c ? e.tt = b.destroy() : b.isActive = !1)
                })
            },
            applyFilter: function() {
                var c = this.chart;
                c.renderer.definition({
                    tagName: "filter",
                    id: "drop-shadow-" + c.index,
                    opacity: .5,
                    children: [{
                        tagName: "feGaussianBlur",
                        "in": "SourceAlpha",
                        stdDeviation: 1
                    }, {
                        tagName: "feOffset",
                        dx: 1,
                        dy: 1
                    }, {
                        tagName: "feComponentTransfer",
                        children: [{
                            tagName: "feFuncA",
                            type: "linear",
                            slope: .3
                        }]
                    }, {
                        tagName: "feMerge",
                        children: [{
                            tagName: "feMergeNode"
                        }, {
                            tagName: "feMergeNode",
                            "in": "SourceGraphic"
                        }]
                    }]
                });
                c.renderer.definition({
                    tagName: "style",
                    textContent: ".highcharts-tooltip-" + c.index + "{filter:url(#drop-shadow-" + c.index + ")}"
                })
            },
            getLabel: function() {
                var g = this,
                    e = this.chart.renderer,
                    b = this.chart.styledMode,
                    d = this.options,
                    a = "tooltip" + (H(d.className) ? " " + d.className : ""),
                    h;
                if (!this.label) {
                    this.outside && (this.container = h = c.doc.createElement("div"), h.className = "highcharts-tooltip-container", c.css(h, {
                        position: "absolute",
                        top: "1px",
                        pointerEvents: d.style && d.style.pointerEvents,
                        zIndex: 3
                    }), c.doc.body.appendChild(h), this.renderer = e = new c.Renderer(h, 0, 0, {}, void 0, void 0, e.styledMode));
                    this.split ? this.label = e.g(a) : (this.label = e.label("", 0, 0, d.shape || "callout", null, null, d.useHTML, null, a).attr({
                            padding: d.padding,
                            r: d.borderRadius
                        }),
                        b || this.label.attr({
                            fill: d.backgroundColor,
                            "stroke-width": d.borderWidth
                        }).css(d.style).shadow(d.shadow));
                    b && (this.applyFilter(), this.label.addClass("highcharts-tooltip-" + this.chart.index));
                    if (g.outside && !g.split) {
                        var n = {
                            x: this.label.xSetter,
                            y: this.label.ySetter
                        };
                        this.label.xSetter = function(a, b) {
                            n[b].call(this.label, g.distance);
                            h.style.left = a + "px"
                        };
                        this.label.ySetter = function(a, b) {
                            n[b].call(this.label, g.distance);
                            h.style.top = a + "px"
                        }
                    }
                    this.label.attr({
                        zIndex: 8
                    }).add()
                }
                return this.label
            },
            update: function(c) {
                this.destroy();
                m(!0, this.chart.options.tooltip.userOptions, c);
                this.init(this.chart, m(!0, this.options, c))
            },
            destroy: function() {
                this.label && (this.label = this.label.destroy());
                this.split && this.tt && (this.cleanSplit(this.chart, !0), this.tt = this.tt.destroy());
                this.renderer && (this.renderer = this.renderer.destroy(), D(this.container));
                c.clearTimeout(this.hideTimer);
                c.clearTimeout(this.tooltipTimeout)
            },
            move: function(g, e, b, d) {
                var a = this,
                    h = a.now,
                    n = !1 !== a.options.animation && !a.isHidden && (1 < Math.abs(g - h.x) || 1 < Math.abs(e - h.y)),
                    k =
                    a.followPointer || 1 < a.len;
                A(h, {
                    x: n ? (2 * h.x + g) / 3 : g,
                    y: n ? (h.y + e) / 2 : e,
                    anchorX: k ? void 0 : n ? (2 * h.anchorX + b) / 3 : b,
                    anchorY: k ? void 0 : n ? (h.anchorY + d) / 2 : d
                });
                a.getLabel().attr(h);
                n && (c.clearTimeout(this.tooltipTimeout), this.tooltipTimeout = setTimeout(function() {
                    a && a.move(g, e, b, d)
                }, 32))
            },
            hide: function(g) {
                var e = this;
                c.clearTimeout(this.hideTimer);
                g = y(g, this.options.hideDelay, 500);
                this.isHidden || (this.hideTimer = v(function() {
                    e.getLabel()[g ? "fadeOut" : "hide"]();
                    e.isHidden = !0
                }, g))
            },
            getAnchor: function(c, e) {
                var b = this.chart,
                    d = b.pointer,
                    a = b.inverted,
                    h = b.plotTop,
                    n = b.plotLeft,
                    g = 0,
                    r = 0,
                    k, l;
                c = G(c);
                this.followPointer && e ? (void 0 === e.chartX && (e = d.normalize(e)), c = [e.chartX - b.plotLeft, e.chartY - h]) : c[0].tooltipPos ? c = c[0].tooltipPos : (c.forEach(function(b) {
                    k = b.series.yAxis;
                    l = b.series.xAxis;
                    g += b.plotX + (!a && l ? l.left - n : 0);
                    r += (b.plotLow ? (b.plotLow + b.plotHigh) / 2 : b.plotY) + (!a && k ? k.top - h : 0)
                }), g /= c.length, r /= c.length, c = [a ? b.plotWidth - r : g, this.shared && !a && 1 < c.length && e ? e.chartY - h : a ? b.plotHeight - g : r]);
                return c.map(Math.round)
            },
            getPosition: function(c,
                e, b) {
                var d = this.chart,
                    a = this.distance,
                    h = {},
                    n = d.inverted && b.h || 0,
                    g, r = this.outside,
                    k = r ? q.documentElement.clientWidth - 2 * a : d.chartWidth,
                    l = r ? Math.max(q.body.scrollHeight, q.documentElement.scrollHeight, q.body.offsetHeight, q.documentElement.offsetHeight, q.documentElement.clientHeight) : d.chartHeight,
                    t = d.pointer.getChartPosition(),
                    B = d.containerScaling,
                    f = function(a) {
                        return B ? a * B.scaleX : a
                    },
                    z = function(a) {
                        return B ? a * B.scaleY : a
                    },
                    u = function(h) {
                        var n = "x" === h;
                        return [h, n ? k : l, n ? c : e].concat(r ? [n ? f(c) : z(e), n ? t.left - a +
                            f(b.plotX + d.plotLeft) : t.top - a + z(b.plotY + d.plotTop), 0, n ? k : l
                        ] : [n ? c : e, n ? b.plotX + d.plotLeft : b.plotY + d.plotTop, n ? d.plotLeft : d.plotTop, n ? d.plotLeft + d.plotWidth : d.plotTop + d.plotHeight])
                    },
                    m = u("y"),
                    M = u("x"),
                    w = !this.followPointer && y(b.ttBelow, !d.inverted === !!b.negative),
                    p = function(b, d, e, c, l, t, r) {
                        var g = "y" === b ? z(a) : f(a),
                            u = (e - c) / 2,
                            B = c < l - a,
                            k = l + a + c < d,
                            x = l - g - e + u;
                        l = l + g - u;
                        if (w && k) h[b] = l;
                        else if (!w && B) h[b] = x;
                        else if (B) h[b] = Math.min(r - c, 0 > x - n ? x : x - n);
                        else if (k) h[b] = Math.max(t, l + n + e > d ? l : l + n);
                        else return !1
                    },
                    v = function(b,
                        d, e, c, l) {
                        var t;
                        l < a || l > d - a ? t = !1 : h[b] = l < e / 2 ? 1 : l > d - c / 2 ? d - c - 2 : l - e / 2;
                        return t
                    },
                    A = function(a) {
                        var b = m;
                        m = M;
                        M = b;
                        g = a
                    },
                    J = function() {
                        !1 !== p.apply(0, m) ? !1 !== v.apply(0, M) || g || (A(!0), J()) : g ? h.x = h.y = 0 : (A(!0), J())
                    };
                (d.inverted || 1 < this.len) && A();
                J();
                return h
            },
            defaultFormatter: function(c) {
                var e = this.points || G(this);
                var b = [c.tooltipFooterHeaderFormatter(e[0])];
                b = b.concat(c.bodyFormatter(e));
                b.push(c.tooltipFooterHeaderFormatter(e[0], !0));
                return b
            },
            refresh: function(g, e) {
                var b = this.chart,
                    d = this.options,
                    a = g,
                    h = {},
                    n = [],
                    k = d.formatter || this.defaultFormatter;
                h = this.shared;
                var r = b.styledMode;
                if (d.enabled) {
                    c.clearTimeout(this.hideTimer);
                    this.followPointer = G(a)[0].series.tooltipOptions.followPointer;
                    var x = this.getAnchor(a, e);
                    e = x[0];
                    var l = x[1];
                    !h || a.series && a.series.noSharedTooltip ? h = a.getLabelConfig() : (b.pointer.applyInactiveState(a), a.forEach(function(a) {
                        a.setState("hover");
                        n.push(a.getLabelConfig())
                    }), h = {
                        x: a[0].category,
                        y: a[0].y
                    }, h.points = n, a = a[0]);
                    this.len = n.length;
                    b = k.call(h, this);
                    k = a.series;
                    this.distance = y(k.tooltipOptions.distance,
                        16);
                    !1 === b ? this.hide() : (this.split ? this.renderSplit(b, G(g)) : (g = this.getLabel(), d.style.width && !r || g.css({
                        width: this.chart.spacingBox.width
                    }), g.attr({
                        text: b && b.join ? b.join("") : b
                    }), g.removeClass(/highcharts-color-[\d]+/g).addClass("highcharts-color-" + y(a.colorIndex, k.colorIndex)), r || g.attr({
                        stroke: d.borderColor || a.color || k.color || "#666666"
                    }), this.updatePosition({
                        plotX: e,
                        plotY: l,
                        negative: a.negative,
                        ttBelow: a.ttBelow,
                        h: x[2] || 0
                    })), this.isHidden && this.label && this.label.attr({
                        opacity: 1
                    }).show(), this.isHidden = !1);
                    c.fireEvent(this, "refresh")
                }
            },
            renderSplit: function(g, e) {
                var b = this,
                    d = [],
                    a = this.chart,
                    h = a.renderer,
                    n = !0,
                    k = this.options,
                    r = 0,
                    x, l = this.getLabel(),
                    t = a.plotTop;
                p(g) && (g = [!1, g]);
                g.slice(0, e.length + 1).forEach(function(c, g) {
                    if (!1 !== c && "" !== c) {
                        g = e[g - 1] || {
                            isHeader: !0,
                            plotX: e[0].plotX,
                            plotY: a.plotHeight
                        };
                        var u = g.series || b,
                            B = u.tt,
                            z = g.series || {},
                            f = "highcharts-color-" + y(g.colorIndex, z.colorIndex, "none");
                        B || (B = {
                                padding: k.padding,
                                r: k.borderRadius
                            }, a.styledMode || (B.fill = k.backgroundColor, B["stroke-width"] = k.borderWidth),
                            u.tt = B = h.label(null, null, null, (g.isHeader ? k.headerShape : k.shape) || "callout", null, null, k.useHTML).addClass(g.isHeader ? "highcharts-tooltip-header " : "highcharts-tooltip-box " + f).attr(B).add(l));
                        B.isActive = !0;
                        B.attr({
                            text: c
                        });
                        a.styledMode || B.css(k.style).shadow(k.shadow).attr({
                            stroke: k.borderColor || g.color || z.color || "#333333"
                        });
                        c = B.getBBox();
                        f = c.width + B.strokeWidth();
                        g.isHeader ? (r = c.height, a.xAxis[0].opposite && (x = !0, t -= r), c = Math.max(0, Math.min(g.plotX + a.plotLeft - f / 2, a.chartWidth + (a.scrollablePixelsX ?
                            a.scrollablePixelsX - a.marginRight : 0) - f))) : c = g.plotX + a.plotLeft - y(k.distance, 16) - f;
                        0 > c && (n = !1);
                        g.isHeader ? z = x ? -r : a.plotHeight + r : (z = z.yAxis, z = z.pos - t + Math.max(0, Math.min(g.plotY || 0, z.len)));
                        d.push({
                            target: z,
                            rank: g.isHeader ? 1 : 0,
                            size: u.tt.getBBox().height + 1,
                            point: g,
                            x: c,
                            tt: B
                        })
                    }
                });
                this.cleanSplit();
                k.positioner && d.forEach(function(a) {
                    var d = k.positioner.call(b, a.tt.getBBox().width, a.size, a.point);
                    a.x = d.x;
                    a.align = 0;
                    a.target = d.y;
                    a.rank = y(d.rank, a.rank)
                });
                c.distribute(d, a.plotHeight + r);
                d.forEach(function(d) {
                    var e =
                        d.point,
                        c = e.series,
                        h = c && c.yAxis;
                    d.tt.attr({
                        visibility: void 0 === d.pos ? "hidden" : "inherit",
                        x: n || e.isHeader || k.positioner ? d.x : e.plotX + a.plotLeft + b.distance,
                        y: d.pos + t,
                        anchorX: e.isHeader ? e.plotX + a.plotLeft : e.plotX + c.xAxis.pos,
                        anchorY: e.isHeader ? a.plotTop + a.plotHeight / 2 : h.pos + Math.max(0, Math.min(e.plotY, h.len))
                    })
                });
                var B = b.container;
                g = b.renderer;
                if (b.outside && B && g) {
                    var f = a.pointer.getChartPosition();
                    B.style.left = f.left + "px";
                    B.style.top = f.top + "px";
                    B = l.getBBox();
                    g.setSize(B.width + B.x, B.height + B.y, !1)
                }
            },
            updatePosition: function(g) {
                var e =
                    this.chart,
                    b = e.pointer,
                    d = this.getLabel(),
                    a = g.plotX + e.plotLeft,
                    h = g.plotY + e.plotTop;
                b = b.getChartPosition();
                g = (this.options.positioner || this.getPosition).call(this, d.width, d.height, g);
                if (this.outside) {
                    var n = (this.options.borderWidth || 0) + 2 * this.distance;
                    this.renderer.setSize(d.width + n, d.height + n, !1);
                    if (e = e.containerScaling) c.css(this.container, {
                        transform: "scale(" + e.scaleX + ", " + e.scaleY + ")"
                    }), a *= e.scaleX, h *= e.scaleY;
                    a += b.left - g.x;
                    h += b.top - g.y
                }
                this.move(Math.round(g.x), Math.round(g.y || 0), a, h)
            },
            getDateFormat: function(c,
                e, b, d) {
                var a = this.chart.time,
                    h = a.dateFormat("%m-%d %H:%M:%S.%L", e),
                    n = {
                        millisecond: 15,
                        second: 12,
                        minute: 9,
                        hour: 6,
                        day: 3
                    },
                    g = "millisecond";
                for (r in w) {
                    if (c === w.week && +a.dateFormat("%w", e) === b && "00:00:00.000" === h.substr(6)) {
                        var r = "week";
                        break
                    }
                    if (w[r] > c) {
                        r = g;
                        break
                    }
                    if (n[r] && h.substr(n[r]) !== "01-01 00:00:00.000".substr(n[r])) break;
                    "week" !== r && (g = r)
                }
                if (r) var k = a.resolveDTLFormat(d[r]).main;
                return k
            },
            getXDateFormat: function(c, e, b) {
                e = e.dateTimeLabelFormats;
                var d = b && b.closestPointRange;
                return (d ? this.getDateFormat(d,
                    c.x, b.options.startOfWeek, e) : e.day) || e.year
            },
            tooltipFooterHeaderFormatter: function(g, e) {
                var b = e ? "footer" : "header",
                    d = g.series,
                    a = d.tooltipOptions,
                    h = a.xDateFormat,
                    n = d.xAxis,
                    f = n && "datetime" === n.options.type && E(g.key),
                    r = a[b + "Format"];
                e = {
                    isFooter: e,
                    labelConfig: g
                };
                c.fireEvent(this, "headerFormatter", e, function(b) {
                    f && !h && (h = this.getXDateFormat(g, a, n));
                    f && h && (g.point && g.point.tooltipDateKeys || ["key"]).forEach(function(a) {
                        r = r.replace("{point." + a + "}", "{point." + a + ":" + h + "}")
                    });
                    d.chart.styledMode && (r = this.styledModeFormat(r));
                    b.text = k(r, {
                        point: g,
                        series: d
                    }, this.chart.time)
                });
                return e.text
            },
            bodyFormatter: function(c) {
                return c.map(function(e) {
                    var b = e.series.tooltipOptions;
                    return (b[(e.point.formatPrefix || "point") + "Formatter"] || e.point.tooltipFormatter).call(e.point, b[(e.point.formatPrefix || "point") + "Format"] || "")
                })
            },
            styledModeFormat: function(c) {
                return c.replace('style="font-size: 10px"', 'class="highcharts-header"').replace(/style="color:{(point|series)\.color}"/g, 'class="highcharts-color-{$1.colorIndex}"')
            }
        }
    });
    K(C, "parts/Pointer.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.attr,
            D = f.defined,
            A = f.extend,
            E = f.isNumber,
            p = f.isObject,
            y = f.objectEach,
            G = f.pick,
            v = f.splat,
            q = c.addEvent,
            k = c.charts,
            m = c.color,
            w = c.css,
            g = c.find,
            e = c.fireEvent,
            b = c.offset,
            d = c.Tooltip;
        c.Pointer = function(a, b) {
            this.init(a, b)
        };
        c.Pointer.prototype = {
            init: function(a, b) {
                this.options = b;
                this.chart = a;
                this.runChartClick = b.chart.events && !!b.chart.events.click;
                this.pinchDown = [];
                this.lastValidTouch = {};
                d && (a.tooltip = new d(a, b.tooltip), this.followTouchMove =
                    G(b.tooltip.followTouchMove, !0));
                this.setDOMEvents()
            },
            zoomOption: function(a) {
                var b = this.chart,
                    d = b.options.chart,
                    e = d.zoomType || "";
                b = b.inverted;
                /touch/.test(a.type) && (e = G(d.pinchType, e));
                this.zoomX = a = /x/.test(e);
                this.zoomY = e = /y/.test(e);
                this.zoomHor = a && !b || e && b;
                this.zoomVert = e && !b || a && b;
                this.hasZoom = a || e
            },
            getChartPosition: function() {
                return this.chartPosition || (this.chartPosition = b(this.chart.container))
            },
            normalize: function(a, b) {
                var d = a.touches ? a.touches.length ? a.touches.item(0) : a.changedTouches[0] :
                    a;
                b || (b = this.getChartPosition());
                var e = d.pageX - b.left;
                b = d.pageY - b.top;
                if (d = this.chart.containerScaling) e /= d.scaleX, b /= d.scaleY;
                return A(a, {
                    chartX: Math.round(e),
                    chartY: Math.round(b)
                })
            },
            getCoordinates: function(a) {
                var b = {
                    xAxis: [],
                    yAxis: []
                };
                this.chart.axes.forEach(function(d) {
                    b[d.isXAxis ? "xAxis" : "yAxis"].push({
                        axis: d,
                        value: d.toValue(a[d.horiz ? "chartX" : "chartY"])
                    })
                });
                return b
            },
            findNearestKDPoint: function(a, b, d) {
                var e;
                a.forEach(function(a) {
                    var c = !(a.noSharedTooltip && b) && 0 > a.options.findNearestPointBy.indexOf("y");
                    a = a.searchPoint(d, c);
                    if ((c = p(a, !0)) && !(c = !p(e, !0))) {
                        c = e.distX - a.distX;
                        var h = e.dist - a.dist,
                            t = (a.series.group && a.series.group.zIndex) - (e.series.group && e.series.group.zIndex);
                        c = 0 < (0 !== c && b ? c : 0 !== h ? h : 0 !== t ? t : e.series.index > a.series.index ? -1 : 1)
                    }
                    c && (e = a)
                });
                return e
            },
            getPointFromEvent: function(a) {
                a = a.target;
                for (var b; a && !b;) b = a.point, a = a.parentNode;
                return b
            },
            getChartCoordinatesFromPoint: function(a, b) {
                var d = a.series,
                    e = d.xAxis;
                d = d.yAxis;
                var c = G(a.clientX, a.plotX),
                    h = a.shapeArgs;
                if (e && d) return b ? {
                    chartX: e.len +
                        e.pos - c,
                    chartY: d.len + d.pos - a.plotY
                } : {
                    chartX: c + e.pos,
                    chartY: a.plotY + d.pos
                };
                if (h && h.x && h.y) return {
                    chartX: h.x,
                    chartY: h.y
                }
            },
            getHoverData: function(a, b, d, e, c, k) {
                var h, t = [];
                e = !(!e || !a);
                var n = b && !b.stickyTracking ? [b] : d.filter(function(a) {
                    return a.visible && !(!c && a.directTouch) && G(a.options.enableMouseTracking, !0) && a.stickyTracking
                });
                b = (h = e || !k ? a : this.findNearestKDPoint(n, c, k)) && h.series;
                h && (c && !b.noSharedTooltip ? (n = d.filter(function(a) {
                    return a.visible && !(!c && a.directTouch) && G(a.options.enableMouseTracking, !0) && !a.noSharedTooltip
                }), n.forEach(function(a) {
                    var b = g(a.points, function(a) {
                        return a.x === h.x && !a.isNull
                    });
                    p(b) && (a.chart.isBoosting && (b = a.getPoint(b)), t.push(b))
                })) : t.push(h));
                return {
                    hoverPoint: h,
                    hoverSeries: b,
                    hoverPoints: t
                }
            },
            runPointActions: function(a, b) {
                var d = this.chart,
                    e = d.tooltip && d.tooltip.options.enabled ? d.tooltip : void 0,
                    h = e ? e.shared : !1,
                    g = b || d.hoverPoint,
                    l = g && g.series || d.hoverSeries;
                l = this.getHoverData(g, l, d.series, (!a || "touchmove" !== a.type) && (!!b || l && l.directTouch && this.isDirectTouch), h, a);
                g = l.hoverPoint;
                var t = l.hoverPoints;
                b = (l = l.hoverSeries) && l.tooltipOptions.followPointer;
                h = h && l && !l.noSharedTooltip;
                if (g && (g !== d.hoverPoint || e && e.isHidden)) {
                    (d.hoverPoints || []).forEach(function(a) {
                        -1 === t.indexOf(a) && a.setState()
                    });
                    if (d.hoverSeries !== l) l.onMouseOver();
                    this.applyInactiveState(t);
                    (t || []).forEach(function(a) {
                        a.setState("hover")
                    });
                    d.hoverPoint && d.hoverPoint.firePointEvent("mouseOut");
                    if (!g.series) return;
                    g.firePointEvent("mouseOver");
                    d.hoverPoints = t;
                    d.hoverPoint = g;
                    e && e.refresh(h ? t : g, a)
                } else b &&
                    e && !e.isHidden && (g = e.getAnchor([{}], a), e.updatePosition({
                        plotX: g[0],
                        plotY: g[1]
                    }));
                this.unDocMouseMove || (this.unDocMouseMove = q(d.container.ownerDocument, "mousemove", function(a) {
                    var b = k[c.hoverChartIndex];
                    if (b) b.pointer.onDocumentMouseMove(a)
                }));
                d.axes.forEach(function(b) {
                    var d = G(b.crosshair.snap, !0),
                        e = d ? c.find(t, function(a) {
                            return a.series[b.coll] === b
                        }) : void 0;
                    e || !d ? b.drawCrosshair(a, e) : b.hideCrosshair()
                })
            },
            applyInactiveState: function(a) {
                var b = [],
                    d;
                (a || []).forEach(function(a) {
                    d = a.series;
                    b.push(d);
                    d.linkedParent && b.push(d.linkedParent);
                    d.linkedSeries && (b = b.concat(d.linkedSeries));
                    d.navigatorSeries && b.push(d.navigatorSeries)
                });
                this.chart.series.forEach(function(a) {
                    -1 === b.indexOf(a) ? a.setState("inactive", !0) : a.options.inactiveOtherPoints && a.setAllPointsToState("inactive")
                })
            },
            reset: function(a, b) {
                var d = this.chart,
                    e = d.hoverSeries,
                    c = d.hoverPoint,
                    h = d.hoverPoints,
                    l = d.tooltip,
                    t = l && l.shared ? h : c;
                a && t && v(t).forEach(function(b) {
                    b.series.isCartesian && void 0 === b.plotX && (a = !1)
                });
                if (a) l && t && v(t).length && (l.refresh(t),
                    l.shared && h ? h.forEach(function(a) {
                        a.setState(a.state, !0);
                        a.series.isCartesian && (a.series.xAxis.crosshair && a.series.xAxis.drawCrosshair(null, a), a.series.yAxis.crosshair && a.series.yAxis.drawCrosshair(null, a))
                    }) : c && (c.setState(c.state, !0), d.axes.forEach(function(a) {
                        a.crosshair && a.drawCrosshair(null, c)
                    })));
                else {
                    if (c) c.onMouseOut();
                    h && h.forEach(function(a) {
                        a.setState()
                    });
                    if (e) e.onMouseOut();
                    l && l.hide(b);
                    this.unDocMouseMove && (this.unDocMouseMove = this.unDocMouseMove());
                    d.axes.forEach(function(a) {
                        a.hideCrosshair()
                    });
                    this.hoverX = d.hoverPoints = d.hoverPoint = null
                }
            },
            scaleGroups: function(a, b) {
                var d = this.chart,
                    e;
                d.series.forEach(function(c) {
                    e = a || c.getPlotBox();
                    c.xAxis && c.xAxis.zoomEnabled && c.group && (c.group.attr(e), c.markerGroup && (c.markerGroup.attr(e), c.markerGroup.clip(b ? d.clipRect : null)), c.dataLabelsGroup && c.dataLabelsGroup.attr(e))
                });
                d.clipRect.attr(b || d.clipBox)
            },
            dragStart: function(a) {
                var b = this.chart;
                b.mouseIsDown = a.type;
                b.cancelClick = !1;
                b.mouseDownX = this.mouseDownX = a.chartX;
                b.mouseDownY = this.mouseDownY = a.chartY
            },
            drag: function(a) {
                var b = this.chart,
                    d = b.options.chart,
                    e = a.chartX,
                    c = a.chartY,
                    g = this.zoomHor,
                    l = this.zoomVert,
                    t = b.plotLeft,
                    k = b.plotTop,
                    f = b.plotWidth,
                    z = b.plotHeight,
                    u = this.selectionMarker,
                    q = this.mouseDownX,
                    w = this.mouseDownY,
                    p = d.panKey && a[d.panKey + "Key"];
                if (!u || !u.touch)
                    if (e < t ? e = t : e > t + f && (e = t + f), c < k ? c = k : c > k + z && (c = k + z), this.hasDragged = Math.sqrt(Math.pow(q - e, 2) + Math.pow(w - c, 2)), 10 < this.hasDragged) {
                        var y = b.isInsidePlot(q - t, w - k);
                        b.hasCartesianSeries && (this.zoomX || this.zoomY) && y && !p && !u && (this.selectionMarker =
                            u = b.renderer.rect(t, k, g ? 1 : f, l ? 1 : z, 0).attr({
                                "class": "highcharts-selection-marker",
                                zIndex: 7
                            }).add(), b.styledMode || u.attr({
                                fill: d.selectionMarkerFill || m("#335cad").setOpacity(.25).get()
                            }));
                        u && g && (e -= q, u.attr({
                            width: Math.abs(e),
                            x: (0 < e ? 0 : e) + q
                        }));
                        u && l && (e = c - w, u.attr({
                            height: Math.abs(e),
                            y: (0 < e ? 0 : e) + w
                        }));
                        y && !u && d.panning && b.pan(a, d.panning)
                    }
            },
            drop: function(a) {
                var b = this,
                    d = this.chart,
                    c = this.hasPinched;
                if (this.selectionMarker) {
                    var g = {
                            originalEvent: a,
                            xAxis: [],
                            yAxis: []
                        },
                        k = this.selectionMarker,
                        l = k.attr ? k.attr("x") :
                        k.x,
                        t = k.attr ? k.attr("y") : k.y,
                        B = k.attr ? k.attr("width") : k.width,
                        f = k.attr ? k.attr("height") : k.height,
                        z;
                    if (this.hasDragged || c) d.axes.forEach(function(d) {
                        if (d.zoomEnabled && D(d.min) && (c || b[{
                                xAxis: "zoomX",
                                yAxis: "zoomY"
                            }[d.coll]])) {
                            var e = d.horiz,
                                h = "touchend" === a.type ? d.minPixelPadding : 0,
                                k = d.toValue((e ? l : t) + h);
                            e = d.toValue((e ? l + B : t + f) - h);
                            g[d.coll].push({
                                axis: d,
                                min: Math.min(k, e),
                                max: Math.max(k, e)
                            });
                            z = !0
                        }
                    }), z && e(d, "selection", g, function(a) {
                        d.zoom(A(a, c ? {
                            animation: !1
                        } : null))
                    });
                    E(d.index) && (this.selectionMarker =
                        this.selectionMarker.destroy());
                    c && this.scaleGroups()
                }
                d && E(d.index) && (w(d.container, {
                    cursor: d._cursor
                }), d.cancelClick = 10 < this.hasDragged, d.mouseIsDown = this.hasDragged = this.hasPinched = !1, this.pinchDown = [])
            },
            onContainerMouseDown: function(a) {
                a = this.normalize(a);
                2 !== a.button && (this.zoomOption(a), a.preventDefault && a.preventDefault(), this.dragStart(a))
            },
            onDocumentMouseUp: function(a) {
                k[c.hoverChartIndex] && k[c.hoverChartIndex].pointer.drop(a)
            },
            onDocumentMouseMove: function(a) {
                var b = this.chart,
                    d = this.chartPosition;
                a = this.normalize(a, d);
                !d || this.inClass(a.target, "highcharts-tracker") || b.isInsidePlot(a.chartX - b.plotLeft, a.chartY - b.plotTop) || this.reset()
            },
            onContainerMouseLeave: function(a) {
                var b = k[c.hoverChartIndex];
                b && (a.relatedTarget || a.toElement) && (b.pointer.reset(), b.pointer.chartPosition = void 0)
            },
            onContainerMouseMove: function(a) {
                var b = this.chart;
                D(c.hoverChartIndex) && k[c.hoverChartIndex] && k[c.hoverChartIndex].mouseIsDown || (c.hoverChartIndex = b.index);
                a = this.normalize(a);
                a.preventDefault || (a.returnValue = !1);
                "mousedown" === b.mouseIsDown && this.drag(a);
                !this.inClass(a.target, "highcharts-tracker") && !b.isInsidePlot(a.chartX - b.plotLeft, a.chartY - b.plotTop) || b.openMenu || this.runPointActions(a)
            },
            inClass: function(a, b) {
                for (var d; a;) {
                    if (d = H(a, "class")) {
                        if (-1 !== d.indexOf(b)) return !0;
                        if (-1 !== d.indexOf("highcharts-container")) return !1
                    }
                    a = a.parentNode
                }
            },
            onTrackerMouseOut: function(a) {
                var b = this.chart.hoverSeries;
                a = a.relatedTarget || a.toElement;
                this.isDirectTouch = !1;
                if (!(!b || !a || b.stickyTracking || this.inClass(a, "highcharts-tooltip") ||
                        this.inClass(a, "highcharts-series-" + b.index) && this.inClass(a, "highcharts-tracker"))) b.onMouseOut()
            },
            onContainerClick: function(a) {
                var b = this.chart,
                    d = b.hoverPoint,
                    c = b.plotLeft,
                    g = b.plotTop;
                a = this.normalize(a);
                b.cancelClick || (d && this.inClass(a.target, "highcharts-tracker") ? (e(d.series, "click", A(a, {
                    point: d
                })), b.hoverPoint && d.firePointEvent("click", a)) : (A(a, this.getCoordinates(a)), b.isInsidePlot(a.chartX - c, a.chartY - g) && e(b, "click", a)))
            },
            setDOMEvents: function() {
                var a = this,
                    b = a.chart.container,
                    d = b.ownerDocument;
                b.onmousedown = function(b) {
                    a.onContainerMouseDown(b)
                };
                b.onmousemove = function(b) {
                    a.onContainerMouseMove(b)
                };
                b.onclick = function(b) {
                    a.onContainerClick(b)
                };
                this.unbindContainerMouseLeave = q(b, "mouseleave", a.onContainerMouseLeave);
                c.unbindDocumentMouseUp || (c.unbindDocumentMouseUp = q(d, "mouseup", a.onDocumentMouseUp));
                c.hasTouch && (q(b, "touchstart", function(b) {
                    a.onContainerTouchStart(b)
                }), q(b, "touchmove", function(b) {
                    a.onContainerTouchMove(b)
                }), c.unbindDocumentTouchEnd || (c.unbindDocumentTouchEnd = q(d, "touchend",
                    a.onDocumentTouchEnd)))
            },
            destroy: function() {
                var a = this;
                a.unDocMouseMove && a.unDocMouseMove();
                this.unbindContainerMouseLeave();
                c.chartCount || (c.unbindDocumentMouseUp && (c.unbindDocumentMouseUp = c.unbindDocumentMouseUp()), c.unbindDocumentTouchEnd && (c.unbindDocumentTouchEnd = c.unbindDocumentTouchEnd()));
                clearInterval(a.tooltipTimeout);
                y(a, function(b, d) {
                    a[d] = null
                })
            }
        }
    });
    K(C, "parts/TouchPointer.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.extend,
            D = f.pick,
            A = c.charts,
            E = c.noop;
        H(c.Pointer.prototype, {
            pinchTranslate: function(c, f, A, v, q, k) {
                this.zoomHor && this.pinchTranslateDirection(!0, c, f, A, v, q, k);
                this.zoomVert && this.pinchTranslateDirection(!1, c, f, A, v, q, k)
            },
            pinchTranslateDirection: function(c, f, A, v, q, k, m, w) {
                var g = this.chart,
                    e = c ? "x" : "y",
                    b = c ? "X" : "Y",
                    d = "chart" + b,
                    a = c ? "width" : "height",
                    h = g["plot" + (c ? "Left" : "Top")],
                    n, F, r = w || 1,
                    x = g.inverted,
                    l = g.bounds[c ? "h" : "v"],
                    t = 1 === f.length,
                    B = f[0][d],
                    I = A[0][d],
                    z = !t && f[1][d],
                    u = !t && A[1][d];
                A = function() {
                    !t && 20 < Math.abs(B - z) && (r = w || Math.abs(I - u) / Math.abs(B - z));
                    F = (h - I) / r + B;
                    n = g["plot" + (c ? "Width" : "Height")] / r
                };
                A();
                f = F;
                if (f < l.min) {
                    f = l.min;
                    var L = !0
                } else f + n > l.max && (f = l.max - n, L = !0);
                L ? (I -= .8 * (I - m[e][0]), t || (u -= .8 * (u - m[e][1])), A()) : m[e] = [I, u];
                x || (k[e] = F - h, k[a] = n);
                k = x ? 1 / r : r;
                q[a] = n;
                q[e] = f;
                v[x ? c ? "scaleY" : "scaleX" : "scale" + b] = r;
                v["translate" + b] = k * h + (I - k * B)
            },
            pinch: function(c) {
                var f = this,
                    p = f.chart,
                    v = f.pinchDown,
                    q = c.touches,
                    k = q.length,
                    m = f.lastValidTouch,
                    w = f.hasZoom,
                    g = f.selectionMarker,
                    e = {},
                    b = 1 === k && (f.inClass(c.target, "highcharts-tracker") && p.runTrackerClick || f.runChartClick),
                    d = {};
                1 < k && (f.initiated = !0);
                w && f.initiated && !b && c.preventDefault();
                [].map.call(q, function(a) {
                    return f.normalize(a)
                });
                "touchstart" === c.type ? ([].forEach.call(q, function(a, b) {
                    v[b] = {
                        chartX: a.chartX,
                        chartY: a.chartY
                    }
                }), m.x = [v[0].chartX, v[1] && v[1].chartX], m.y = [v[0].chartY, v[1] && v[1].chartY], p.axes.forEach(function(a) {
                    if (a.zoomEnabled) {
                        var b = p.bounds[a.horiz ? "h" : "v"],
                            d = a.minPixelPadding,
                            e = a.toPixels(Math.min(D(a.options.min, a.dataMin), a.dataMin)),
                            c = a.toPixels(Math.max(D(a.options.max, a.dataMax), a.dataMax)),
                            g = Math.max(e,
                                c);
                        b.min = Math.min(a.pos, Math.min(e, c) - d);
                        b.max = Math.max(a.pos + a.len, g + d)
                    }
                }), f.res = !0) : f.followTouchMove && 1 === k ? this.runPointActions(f.normalize(c)) : v.length && (g || (f.selectionMarker = g = H({
                    destroy: E,
                    touch: !0
                }, p.plotBox)), f.pinchTranslate(v, q, e, g, d, m), f.hasPinched = w, f.scaleGroups(e, d), f.res && (f.res = !1, this.reset(!1, 0)))
            },
            touch: function(f, y) {
                var p = this.chart,
                    v;
                if (p.index !== c.hoverChartIndex) this.onContainerMouseLeave({
                    relatedTarget: !0
                });
                c.hoverChartIndex = p.index;
                if (1 === f.touches.length)
                    if (f = this.normalize(f),
                        (v = p.isInsidePlot(f.chartX - p.plotLeft, f.chartY - p.plotTop)) && !p.openMenu) {
                        y && this.runPointActions(f);
                        if ("touchmove" === f.type) {
                            y = this.pinchDown;
                            var q = y[0] ? 4 <= Math.sqrt(Math.pow(y[0].chartX - f.chartX, 2) + Math.pow(y[0].chartY - f.chartY, 2)) : !1
                        }
                        D(q, !0) && this.pinch(f)
                    } else y && this.reset();
                else 2 === f.touches.length && this.pinch(f)
            },
            onContainerTouchStart: function(c) {
                this.zoomOption(c);
                this.touch(c, !0)
            },
            onContainerTouchMove: function(c) {
                this.touch(c)
            },
            onDocumentTouchEnd: function(f) {
                A[c.hoverChartIndex] && A[c.hoverChartIndex].pointer.drop(f)
            }
        })
    });
    K(C, "parts/MSPointer.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.extend,
            D = f.objectEach,
            A = c.addEvent,
            E = c.charts,
            p = c.css,
            y = c.doc,
            G = c.noop;
        f = c.Pointer;
        var v = c.removeEvent,
            q = c.win,
            k = c.wrap;
        if (!c.hasTouch && (q.PointerEvent || q.MSPointerEvent)) {
            var m = {},
                w = !!q.PointerEvent,
                g = function() {
                    var b = [];
                    b.item = function(b) {
                        return this[b]
                    };
                    D(m, function(d) {
                        b.push({
                            pageX: d.pageX,
                            pageY: d.pageY,
                            target: d.target
                        })
                    });
                    return b
                },
                e = function(b, d, a, e) {
                    "touch" !== b.pointerType && b.pointerType !== b.MSPOINTER_TYPE_TOUCH ||
                        !E[c.hoverChartIndex] || (e(b), e = E[c.hoverChartIndex].pointer, e[d]({
                            type: a,
                            target: b.currentTarget,
                            preventDefault: G,
                            touches: g()
                        }))
                };
            H(f.prototype, {
                onContainerPointerDown: function(b) {
                    e(b, "onContainerTouchStart", "touchstart", function(b) {
                        m[b.pointerId] = {
                            pageX: b.pageX,
                            pageY: b.pageY,
                            target: b.currentTarget
                        }
                    })
                },
                onContainerPointerMove: function(b) {
                    e(b, "onContainerTouchMove", "touchmove", function(b) {
                        m[b.pointerId] = {
                            pageX: b.pageX,
                            pageY: b.pageY
                        };
                        m[b.pointerId].target || (m[b.pointerId].target = b.currentTarget)
                    })
                },
                onDocumentPointerUp: function(b) {
                    e(b,
                        "onDocumentTouchEnd", "touchend",
                        function(b) {
                            delete m[b.pointerId]
                        })
                },
                batchMSEvents: function(b) {
                    b(this.chart.container, w ? "pointerdown" : "MSPointerDown", this.onContainerPointerDown);
                    b(this.chart.container, w ? "pointermove" : "MSPointerMove", this.onContainerPointerMove);
                    b(y, w ? "pointerup" : "MSPointerUp", this.onDocumentPointerUp)
                }
            });
            k(f.prototype, "init", function(b, d, a) {
                b.call(this, d, a);
                this.hasZoom && p(d.container, {
                    "-ms-touch-action": "none",
                    "touch-action": "none"
                })
            });
            k(f.prototype, "setDOMEvents", function(b) {
                b.apply(this);
                (this.hasZoom || this.followTouchMove) && this.batchMSEvents(A)
            });
            k(f.prototype, "destroy", function(b) {
                this.batchMSEvents(v);
                b.call(this)
            })
        }
    });
    K(C, "parts/Legend.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.defined,
            D = f.discardElement,
            A = f.isNumber,
            E = f.pick,
            p = f.setAnimation,
            y = c.addEvent,
            G = c.css,
            v = c.fireEvent;
        f = c.isFirefox;
        var q = c.marginNames,
            k = c.merge,
            m = c.stableSort,
            w = c.win,
            g = c.wrap;
        c.Legend = function(e, b) {
            this.init(e, b)
        };
        c.Legend.prototype = {
            init: function(e, b) {
                this.chart = e;
                this.setOptions(b);
                b.enabled && (this.render(), y(this.chart, "endResize", function() {
                    this.legend.positionCheckboxes()
                }), this.proximate ? this.unchartrender = y(this.chart, "render", function() {
                    this.legend.proximatePositions();
                    this.legend.positionItems()
                }) : this.unchartrender && this.unchartrender())
            },
            setOptions: function(e) {
                var b = E(e.padding, 8);
                this.options = e;
                this.chart.styledMode || (this.itemStyle = e.itemStyle, this.itemHiddenStyle = k(this.itemStyle, e.itemHiddenStyle));
                this.itemMarginTop = e.itemMarginTop || 0;
                this.itemMarginBottom = e.itemMarginBottom ||
                    0;
                this.padding = b;
                this.initialItemY = b - 5;
                this.symbolWidth = E(e.symbolWidth, 16);
                this.pages = [];
                this.proximate = "proximate" === e.layout && !this.chart.inverted
            },
            update: function(e, b) {
                var d = this.chart;
                this.setOptions(k(!0, this.options, e));
                this.destroy();
                d.isDirtyLegend = d.isDirtyBox = !0;
                E(b, !0) && d.redraw();
                v(this, "afterUpdate")
            },
            colorizeItem: function(e, b) {
                e.legendGroup[b ? "removeClass" : "addClass"]("highcharts-legend-item-hidden");
                if (!this.chart.styledMode) {
                    var d = this.options,
                        a = e.legendItem,
                        c = e.legendLine,
                        g = e.legendSymbol,
                        k = this.itemHiddenStyle.color;
                    d = b ? d.itemStyle.color : k;
                    var r = b ? e.color || k : k,
                        f = e.options && e.options.marker,
                        l = {
                            fill: r
                        };
                    a && a.css({
                        fill: d,
                        color: d
                    });
                    c && c.attr({
                        stroke: r
                    });
                    g && (f && g.isMarker && (l = e.pointAttribs(), b || (l.stroke = l.fill = k)), g.attr(l))
                }
                v(this, "afterColorizeItem", {
                    item: e,
                    visible: b
                })
            },
            positionItems: function() {
                this.allItems.forEach(this.positionItem, this);
                this.chart.isResizing || this.positionCheckboxes()
            },
            positionItem: function(e) {
                var b = this.options,
                    d = b.symbolPadding;
                b = !b.rtl;
                var a = e._legendItemPos,
                    c = a[0];
                a = a[1];
                var g = e.checkbox;
                if ((e = e.legendGroup) && e.element) e[H(e.translateY) ? "animate" : "attr"]({
                    translateX: b ? c : this.legendWidth - c - 2 * d - 4,
                    translateY: a
                });
                g && (g.x = c, g.y = a)
            },
            destroyItem: function(e) {
                var b = e.checkbox;
                ["legendItem", "legendLine", "legendSymbol", "legendGroup"].forEach(function(b) {
                    e[b] && (e[b] = e[b].destroy())
                });
                b && D(e.checkbox)
            },
            destroy: function() {
                function e(b) {
                    this[b] && (this[b] = this[b].destroy())
                }
                this.getAllItems().forEach(function(b) {
                    ["legendItem", "legendGroup"].forEach(e, b)
                });
                "clipRect up down pager nav box title group".split(" ").forEach(e,
                    this);
                this.display = null
            },
            positionCheckboxes: function() {
                var e = this.group && this.group.alignAttr,
                    b = this.clipHeight || this.legendHeight,
                    d = this.titleHeight;
                if (e) {
                    var a = e.translateY;
                    this.allItems.forEach(function(c) {
                        var h = c.checkbox;
                        if (h) {
                            var g = a + d + h.y + (this.scrollOffset || 0) + 3;
                            G(h, {
                                left: e.translateX + c.checkboxOffset + h.x - 20 + "px",
                                top: g + "px",
                                display: this.proximate || g > a - 6 && g < a + b - 6 ? "" : "none"
                            })
                        }
                    }, this)
                }
            },
            renderTitle: function() {
                var e = this.options,
                    b = this.padding,
                    d = e.title,
                    a = 0;
                d.text && (this.title || (this.title = this.chart.renderer.label(d.text,
                    b - 3, b - 4, null, null, null, e.useHTML, null, "legend-title").attr({
                    zIndex: 1
                }), this.chart.styledMode || this.title.css(d.style), this.title.add(this.group)), d.width || this.title.css({
                    width: this.maxLegendWidth + "px"
                }), e = this.title.getBBox(), a = e.height, this.offsetWidth = e.width, this.contentGroup.attr({
                    translateY: a
                }));
                this.titleHeight = a
            },
            setText: function(e) {
                var b = this.options;
                e.legendItem.attr({
                    text: b.labelFormat ? c.format(b.labelFormat, e, this.chart.time) : b.labelFormatter.call(e)
                })
            },
            renderItem: function(e) {
                var b = this.chart,
                    d = b.renderer,
                    a = this.options,
                    c = this.symbolWidth,
                    g = a.symbolPadding,
                    f = this.itemStyle,
                    r = this.itemHiddenStyle,
                    x = "horizontal" === a.layout ? E(a.itemDistance, 20) : 0,
                    l = !a.rtl,
                    t = e.legendItem,
                    B = !e.series,
                    I = !B && e.series.drawLegendSymbol ? e.series : e,
                    z = I.options;
                z = this.createCheckboxForItem && z && z.showCheckbox;
                x = c + g + x + (z ? 20 : 0);
                var u = a.useHTML,
                    m = e.options.className;
                t || (e.legendGroup = d.g("legend-item").addClass("highcharts-" + I.type + "-series highcharts-color-" + e.colorIndex + (m ? " " + m : "") + (B ? " highcharts-series-" + e.index :
                    "")).attr({
                    zIndex: 1
                }).add(this.scrollGroup), e.legendItem = t = d.text("", l ? c + g : -g, this.baseline || 0, u), b.styledMode || t.css(k(e.visible ? f : r)), t.attr({
                    align: l ? "left" : "right",
                    zIndex: 2
                }).add(e.legendGroup), this.baseline || (this.fontMetrics = d.fontMetrics(b.styledMode ? 12 : f.fontSize, t), this.baseline = this.fontMetrics.f + 3 + this.itemMarginTop, t.attr("y", this.baseline)), this.symbolHeight = a.symbolHeight || this.fontMetrics.f, I.drawLegendSymbol(this, e), this.setItemEvents && this.setItemEvents(e, t, u));
                z && !e.checkbox && this.createCheckboxForItem(e);
                this.colorizeItem(e, e.visible);
                !b.styledMode && f.width || t.css({
                    width: (a.itemWidth || this.widthOption || b.spacingBox.width) - x
                });
                this.setText(e);
                b = t.getBBox();
                e.itemWidth = e.checkboxOffset = a.itemWidth || e.legendItemWidth || b.width + x;
                this.maxItemWidth = Math.max(this.maxItemWidth, e.itemWidth);
                this.totalItemWidth += e.itemWidth;
                this.itemHeight = e.itemHeight = Math.round(e.legendItemHeight || b.height || this.symbolHeight)
            },
            layoutItem: function(e) {
                var b = this.options,
                    d = this.padding,
                    a = "horizontal" === b.layout,
                    c = e.itemHeight,
                    g = this.itemMarginBottom,
                    k = this.itemMarginTop,
                    r = a ? E(b.itemDistance, 20) : 0,
                    f = this.maxLegendWidth;
                b = b.alignColumns && this.totalItemWidth > f ? this.maxItemWidth : e.itemWidth;
                a && this.itemX - d + b > f && (this.itemX = d, this.lastLineHeight && (this.itemY += k + this.lastLineHeight + g), this.lastLineHeight = 0);
                this.lastItemY = k + this.itemY + g;
                this.lastLineHeight = Math.max(c, this.lastLineHeight);
                e._legendItemPos = [this.itemX, this.itemY];
                a ? this.itemX += b : (this.itemY += k + c + g, this.lastLineHeight = c);
                this.offsetWidth = this.widthOption || Math.max((a ?
                    this.itemX - d - (e.checkbox ? 0 : r) : b) + d, this.offsetWidth)
            },
            getAllItems: function() {
                var e = [];
                this.chart.series.forEach(function(b) {
                    var d = b && b.options;
                    b && E(d.showInLegend, H(d.linkedTo) ? !1 : void 0, !0) && (e = e.concat(b.legendItems || ("point" === d.legendType ? b.data : b)))
                });
                v(this, "afterGetAllItems", {
                    allItems: e
                });
                return e
            },
            getAlignment: function() {
                var e = this.options;
                return this.proximate ? e.align.charAt(0) + "tv" : e.floating ? "" : e.align.charAt(0) + e.verticalAlign.charAt(0) + e.layout.charAt(0)
            },
            adjustMargins: function(e, b) {
                var d =
                    this.chart,
                    a = this.options,
                    c = this.getAlignment();
                c && [/(lth|ct|rth)/, /(rtv|rm|rbv)/, /(rbh|cb|lbh)/, /(lbv|lm|ltv)/].forEach(function(h, g) {
                    h.test(c) && !H(e[g]) && (d[q[g]] = Math.max(d[q[g]], d.legend[(g + 1) % 2 ? "legendHeight" : "legendWidth"] + [1, -1, -1, 1][g] * a[g % 2 ? "x" : "y"] + E(a.margin, 12) + b[g] + (d.titleOffset[g] || 0)))
                })
            },
            proximatePositions: function() {
                var e = this.chart,
                    b = [],
                    d = "left" === this.options.align;
                this.allItems.forEach(function(a) {
                    var h = d;
                    if (a.yAxis && a.points) {
                        a.xAxis.options.reversed && (h = !h);
                        var g = c.find(h ? a.points :
                            a.points.slice(0).reverse(),
                            function(a) {
                                return A(a.plotY)
                            });
                        h = this.itemMarginTop + a.legendItem.getBBox().height + this.itemMarginBottom;
                        var k = a.yAxis.top - e.plotTop;
                        a.visible ? (g = g ? g.plotY : a.yAxis.height, g += k - .3 * h) : g = k + a.yAxis.height;
                        b.push({
                            target: g,
                            size: h,
                            item: a
                        })
                    }
                }, this);
                c.distribute(b, e.plotHeight);
                b.forEach(function(a) {
                    a.item._legendItemPos[1] = e.plotTop - e.spacing[0] + a.pos
                })
            },
            render: function() {
                var e = this.chart,
                    b = e.renderer,
                    d = this.group,
                    a, h = this.box,
                    g = this.options,
                    f = this.padding;
                this.itemX = f;
                this.itemY =
                    this.initialItemY;
                this.lastItemY = this.offsetWidth = 0;
                this.widthOption = c.relativeLength(g.width, e.spacingBox.width - f);
                var r = e.spacingBox.width - 2 * f - g.x; - 1 < ["rm", "lm"].indexOf(this.getAlignment().substring(0, 2)) && (r /= 2);
                this.maxLegendWidth = this.widthOption || r;
                d || (this.group = d = b.g("legend").attr({
                    zIndex: 7
                }).add(), this.contentGroup = b.g().attr({
                    zIndex: 1
                }).add(d), this.scrollGroup = b.g().add(this.contentGroup));
                this.renderTitle();
                r = this.getAllItems();
                m(r, function(a, b) {
                    return (a.options && a.options.legendIndex ||
                        0) - (b.options && b.options.legendIndex || 0)
                });
                g.reversed && r.reverse();
                this.allItems = r;
                this.display = a = !!r.length;
                this.itemHeight = this.totalItemWidth = this.maxItemWidth = this.lastLineHeight = 0;
                r.forEach(this.renderItem, this);
                r.forEach(this.layoutItem, this);
                r = (this.widthOption || this.offsetWidth) + f;
                var x = this.lastItemY + this.lastLineHeight + this.titleHeight;
                x = this.handleOverflow(x);
                x += f;
                h || (this.box = h = b.rect().addClass("highcharts-legend-box").attr({
                    r: g.borderRadius
                }).add(d), h.isNew = !0);
                e.styledMode || h.attr({
                    stroke: g.borderColor,
                    "stroke-width": g.borderWidth || 0,
                    fill: g.backgroundColor || "none"
                }).shadow(g.shadow);
                0 < r && 0 < x && (h[h.isNew ? "attr" : "animate"](h.crisp.call({}, {
                    x: 0,
                    y: 0,
                    width: r,
                    height: x
                }, h.strokeWidth())), h.isNew = !1);
                h[a ? "show" : "hide"]();
                e.styledMode && "none" === d.getStyle("display") && (r = x = 0);
                this.legendWidth = r;
                this.legendHeight = x;
                a && (b = e.spacingBox, h = b.y, /(lth|ct|rth)/.test(this.getAlignment()) && 0 < e.titleOffset[0] ? h += e.titleOffset[0] : /(lbh|cb|rbh)/.test(this.getAlignment()) && 0 < e.titleOffset[2] && (h -= e.titleOffset[2]), h !==
                    b.y && (b = k(b, {
                        y: h
                    })), d.align(k(g, {
                        width: r,
                        height: x,
                        verticalAlign: this.proximate ? "top" : g.verticalAlign
                    }), !0, b));
                this.proximate || this.positionItems();
                v(this, "afterRender")
            },
            handleOverflow: function(e) {
                var b = this,
                    d = this.chart,
                    a = d.renderer,
                    c = this.options,
                    g = c.y,
                    k = this.padding;
                g = d.spacingBox.height + ("top" === c.verticalAlign ? -g : g) - k;
                var f = c.maxHeight,
                    x, l = this.clipRect,
                    t = c.navigation,
                    B = E(t.animation, !0),
                    I = t.arrowSize || 12,
                    z = this.nav,
                    u = this.pages,
                    m, q = this.allItems,
                    w = function(a) {
                        "number" === typeof a ? l.attr({
                                height: a
                            }) :
                            l && (b.clipRect = l.destroy(), b.contentGroup.clip());
                        b.contentGroup.div && (b.contentGroup.div.style.clip = a ? "rect(" + k + "px,9999px," + (k + a) + "px,0)" : "auto")
                    },
                    p = function(e) {
                        b[e] = a.circle(0, 0, 1.3 * I).translate(I / 2, I / 2).add(z);
                        d.styledMode || b[e].attr("fill", "rgba(0,0,0,0.0001)");
                        return b[e]
                    };
                "horizontal" !== c.layout || "middle" === c.verticalAlign || c.floating || (g /= 2);
                f && (g = Math.min(g, f));
                u.length = 0;
                e > g && !1 !== t.enabled ? (this.clipHeight = x = Math.max(g - 20 - this.titleHeight - k, 0), this.currentPage = E(this.currentPage, 1), this.fullHeight =
                    e, q.forEach(function(a, b) {
                        var d = a._legendItemPos[1],
                            e = Math.round(a.legendItem.getBBox().height),
                            c = u.length;
                        if (!c || d - u[c - 1] > x && (m || d) !== u[c - 1]) u.push(m || d), c++;
                        a.pageIx = c - 1;
                        m && (q[b - 1].pageIx = c - 1);
                        b === q.length - 1 && d + e - u[c - 1] > x && d !== m && (u.push(d), a.pageIx = c);
                        d !== m && (m = d)
                    }), l || (l = b.clipRect = a.clipRect(0, k, 9999, 0), b.contentGroup.clip(l)), w(x), z || (this.nav = z = a.g().attr({
                            zIndex: 1
                        }).add(this.group), this.up = a.symbol("triangle", 0, 0, I, I).add(z), p("upTracker").on("click", function() {
                            b.scroll(-1, B)
                        }), this.pager =
                        a.text("", 15, 10).addClass("highcharts-legend-navigation"), d.styledMode || this.pager.css(t.style), this.pager.add(z), this.down = a.symbol("triangle-down", 0, 0, I, I).add(z), p("downTracker").on("click", function() {
                            b.scroll(1, B)
                        })), b.scroll(0), e = g) : z && (w(), this.nav = z.destroy(), this.scrollGroup.attr({
                    translateY: 1
                }), this.clipHeight = 0);
                return e
            },
            scroll: function(e, b) {
                var d = this.pages,
                    a = d.length,
                    c = this.currentPage + e;
                e = this.clipHeight;
                var g = this.options.navigation,
                    k = this.pager,
                    f = this.padding;
                c > a && (c = a);
                0 < c && (void 0 !==
                    b && p(b, this.chart), this.nav.attr({
                        translateX: f,
                        translateY: e + this.padding + 7 + this.titleHeight,
                        visibility: "visible"
                    }), [this.up, this.upTracker].forEach(function(a) {
                        a.attr({
                            "class": 1 === c ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active"
                        })
                    }), k.attr({
                        text: c + "/" + a
                    }), [this.down, this.downTracker].forEach(function(b) {
                        b.attr({
                            x: 18 + this.pager.getBBox().width,
                            "class": c === a ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active"
                        })
                    }, this), this.chart.styledMode || (this.up.attr({
                        fill: 1 === c ? g.inactiveColor : g.activeColor
                    }), this.upTracker.css({
                        cursor: 1 === c ? "default" : "pointer"
                    }), this.down.attr({
                        fill: c === a ? g.inactiveColor : g.activeColor
                    }), this.downTracker.css({
                        cursor: c === a ? "default" : "pointer"
                    })), this.scrollOffset = -d[c - 1] + this.initialItemY, this.scrollGroup.animate({
                        translateY: this.scrollOffset
                    }), this.currentPage = c, this.positionCheckboxes())
            }
        };
        c.LegendSymbolMixin = {
            drawRectangle: function(e, b) {
                var d = e.symbolHeight,
                    a = e.options.squareSymbol;
                b.legendSymbol = this.chart.renderer.rect(a ? (e.symbolWidth - d) / 2 : 0, e.baseline -
                    d + 1, a ? d : e.symbolWidth, d, E(e.options.symbolRadius, d / 2)).addClass("highcharts-point").attr({
                    zIndex: 3
                }).add(b.legendGroup)
            },
            drawLineMarker: function(e) {
                var b = this.options,
                    d = b.marker,
                    a = e.symbolWidth,
                    c = e.symbolHeight,
                    g = c / 2,
                    f = this.chart.renderer,
                    r = this.legendGroup;
                e = e.baseline - Math.round(.3 * e.fontMetrics.b);
                var x = {};
                this.chart.styledMode || (x = {
                    "stroke-width": b.lineWidth || 0
                }, b.dashStyle && (x.dashstyle = b.dashStyle));
                this.legendLine = f.path(["M", 0, e, "L", a, e]).addClass("highcharts-graph").attr(x).add(r);
                d && !1 !==
                    d.enabled && a && (b = Math.min(E(d.radius, g), g), 0 === this.symbol.indexOf("url") && (d = k(d, {
                        width: c,
                        height: c
                    }), b = 0), this.legendSymbol = d = f.symbol(this.symbol, a / 2 - b, e - b, 2 * b, 2 * b, d).addClass("highcharts-point").add(r), d.isMarker = !0)
            }
        };
        (/Trident\/7\.0/.test(w.navigator && w.navigator.userAgent) || f) && g(c.Legend.prototype, "positionItem", function(e, b) {
            var d = this,
                a = function() {
                    b._legendItemPos && e.call(d, b)
                };
            a();
            d.bubbleLegend || setTimeout(a)
        })
    });
    K(C, "parts/Chart.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c,
        f) {
        var H = f.attr,
            D = f.defined,
            A = f.discardElement,
            E = f.erase,
            p = f.extend,
            y = f.isArray,
            G = f.isNumber,
            v = f.isObject,
            q = f.isString,
            k = f.objectEach,
            m = f.pick,
            w = f.pInt,
            g = f.setAnimation,
            e = f.splat,
            b = f.syncTimeout,
            d = c.addEvent,
            a = c.animate,
            h = c.animObject,
            n = c.doc,
            F = c.Axis,
            r = c.createElement,
            x = c.defaultOptions,
            l = c.charts,
            t = c.css,
            B = c.find,
            I = c.fireEvent,
            z = c.Legend,
            u = c.marginNames,
            L = c.merge,
            M = c.Pointer,
            T = c.removeEvent,
            Q = c.seriesTypes,
            C = c.win,
            N = c.Chart = function() {
                this.getArgs.apply(this, arguments)
            };
        c.chart = function(a, b, d) {
            return new N(a,
                b, d)
        };
        p(N.prototype, {
            callbacks: [],
            getArgs: function() {
                var a = [].slice.call(arguments);
                if (q(a[0]) || a[0].nodeName) this.renderTo = a.shift();
                this.init(a[0], a[1])
            },
            init: function(a, b) {
                var e, h = a.series,
                    g = a.plotOptions || {};
                I(this, "init", {
                    args: arguments
                }, function() {
                    a.series = null;
                    e = L(x, a);
                    k(e.plotOptions, function(a, b) {
                        v(a) && (a.tooltip = g[b] && L(g[b].tooltip) || void 0)
                    });
                    e.tooltip.userOptions = a.chart && a.chart.forExport && a.tooltip.userOptions || a.tooltip;
                    e.series = a.series = h;
                    this.userOptions = a;
                    var t = e.chart,
                        u = t.events;
                    this.margin = [];
                    this.spacing = [];
                    this.bounds = {
                        h: {},
                        v: {}
                    };
                    this.labelCollectors = [];
                    this.callback = b;
                    this.isResizing = 0;
                    this.options = e;
                    this.axes = [];
                    this.series = [];
                    this.time = a.time && Object.keys(a.time).length ? new c.Time(a.time) : c.time;
                    this.styledMode = t.styledMode;
                    this.hasCartesianSeries = t.showAxes;
                    var f = this;
                    f.index = l.length;
                    l.push(f);
                    c.chartCount++;
                    u && k(u, function(a, b) {
                        c.isFunction(a) && d(f, b, a)
                    });
                    f.xAxis = [];
                    f.yAxis = [];
                    f.pointCount = f.colorCounter = f.symbolCounter = 0;
                    I(f, "afterInit");
                    f.firstRender()
                })
            },
            initSeries: function(a) {
                var b =
                    this.options.chart;
                b = a.type || b.type || b.defaultSeriesType;
                var d = Q[b];
                d || c.error(17, !0, this, {
                    missingModuleFor: b
                });
                b = new d;
                b.init(this, a);
                return b
            },
            orderSeries: function(a) {
                var b = this.series;
                for (a = a || 0; a < b.length; a++) b[a] && (b[a].index = a, b[a].name = b[a].getName())
            },
            isInsidePlot: function(a, b, d) {
                var e = d ? b : a;
                a = d ? a : b;
                return 0 <= e && e <= this.plotWidth && 0 <= a && a <= this.plotHeight
            },
            redraw: function(a) {
                I(this, "beforeRedraw");
                var b = this.axes,
                    d = this.series,
                    e = this.pointer,
                    c = this.legend,
                    l = this.userOptions.legend,
                    h = this.isDirtyLegend,
                    t = this.hasCartesianSeries,
                    k = this.isDirtyBox,
                    f = this.renderer,
                    u = f.isHidden(),
                    r = [];
                this.setResponsive && this.setResponsive(!1);
                g(a, this);
                u && this.temporaryDisplay();
                this.layOutTitles();
                for (a = d.length; a--;) {
                    var B = d[a];
                    if (B.options.stacking) {
                        var n = !0;
                        if (B.isDirty) {
                            var z = !0;
                            break
                        }
                    }
                }
                if (z)
                    for (a = d.length; a--;) B = d[a], B.options.stacking && (B.isDirty = !0);
                d.forEach(function(a) {
                    a.isDirty && ("point" === a.options.legendType ? (a.updateTotals && a.updateTotals(), h = !0) : l && (l.labelFormatter || l.labelFormat) && (h = !0));
                    a.isDirtyData &&
                        I(a, "updatedData")
                });
                h && c && c.options.enabled && (c.render(), this.isDirtyLegend = !1);
                n && this.getStacks();
                t && b.forEach(function(a) {
                    a.updateNames();
                    a.setScale()
                });
                this.getMargins();
                t && (b.forEach(function(a) {
                    a.isDirty && (k = !0)
                }), b.forEach(function(a) {
                    var b = a.min + "," + a.max;
                    a.extKey !== b && (a.extKey = b, r.push(function() {
                        I(a, "afterSetExtremes", p(a.eventArgs, a.getExtremes()));
                        delete a.eventArgs
                    }));
                    (k || n) && a.redraw()
                }));
                k && this.drawChartBox();
                I(this, "predraw");
                d.forEach(function(a) {
                    (k || a.isDirty) && a.visible && a.redraw();
                    a.isDirtyData = !1
                });
                e && e.reset(!0);
                f.draw();
                I(this, "redraw");
                I(this, "render");
                u && this.temporaryDisplay(!0);
                r.forEach(function(a) {
                    a.call()
                })
            },
            get: function(a) {
                function b(b) {
                    return b.id === a || b.options && b.options.id === a
                }
                var d = this.series,
                    e;
                var c = B(this.axes, b) || B(this.series, b);
                for (e = 0; !c && e < d.length; e++) c = B(d[e].points || [], b);
                return c
            },
            getAxes: function() {
                var a = this,
                    b = this.options,
                    d = b.xAxis = e(b.xAxis || {});
                b = b.yAxis = e(b.yAxis || {});
                I(this, "getAxes");
                d.forEach(function(a, b) {
                    a.index = b;
                    a.isX = !0
                });
                b.forEach(function(a,
                    b) {
                    a.index = b
                });
                d.concat(b).forEach(function(b) {
                    new F(a, b)
                });
                I(this, "afterGetAxes")
            },
            getSelectedPoints: function() {
                var a = [];
                this.series.forEach(function(b) {
                    a = a.concat((b[b.hasGroupedData ? "points" : "data"] || []).filter(function(a) {
                        return m(a.selectedStaging, a.selected)
                    }))
                });
                return a
            },
            getSelectedSeries: function() {
                return this.series.filter(function(a) {
                    return a.selected
                })
            },
            setTitle: function(a, b, d) {
                this.applyDescription("title", a);
                this.applyDescription("subtitle", b);
                this.applyDescription("caption", void 0);
                this.layOutTitles(d)
            },
            applyDescription: function(a, b) {
                var d = this,
                    e = "title" === a ? {
                        color: "#333333",
                        fontSize: this.options.isStock ? "16px" : "18px"
                    } : {
                        color: "#666666"
                    };
                e = this.options[a] = L(!this.styledMode && {
                    style: e
                }, this.options[a], b);
                var c = this[a];
                c && b && (this[a] = c = c.destroy());
                e && !c && (c = this.renderer.text(e.text, 0, 0, e.useHTML).attr({
                        align: e.align,
                        "class": "highcharts-" + a,
                        zIndex: e.zIndex || 4
                    }).add(), c.update = function(b) {
                        d[{
                            title: "setTitle",
                            subtitle: "setSubtitle",
                            caption: "setCaption"
                        }[a]](b)
                    }, this.styledMode ||
                    c.css(e.style), this[a] = c)
            },
            layOutTitles: function(a) {
                var b = [0, 0, 0],
                    d = this.renderer,
                    e = this.spacingBox;
                ["title", "subtitle", "caption"].forEach(function(a) {
                    var c = this[a],
                        l = this.options[a],
                        h = l.verticalAlign || "top";
                    a = "title" === a ? -3 : "top" === h ? b[0] + 2 : 0;
                    if (c) {
                        if (!this.styledMode) var g = l.style.fontSize;
                        g = d.fontMetrics(g, c).b;
                        c.css({
                            width: (l.width || e.width + (l.widthAdjust || 0)) + "px"
                        });
                        var t = Math.round(c.getBBox(l.useHTML).height);
                        c.align(p({
                            y: "bottom" === h ? g : a + g,
                            height: t
                        }, l), !1, "spacingBox");
                        l.floating || ("top" ===
                            h ? b[0] = Math.ceil(b[0] + t) : "bottom" === h && (b[2] = Math.ceil(b[2] + t)))
                    }
                }, this);
                b[0] && "top" === (this.options.title.verticalAlign || "top") && (b[0] += this.options.title.margin);
                b[2] && "bottom" === this.options.caption.verticalAlign && (b[2] += this.options.caption.margin);
                var c = !this.titleOffset || this.titleOffset.join(",") !== b.join(",");
                this.titleOffset = b;
                I(this, "afterLayOutTitles");
                !this.isDirtyBox && c && (this.isDirtyBox = this.isDirtyLegend = c, this.hasRendered && m(a, !0) && this.isDirtyBox && this.redraw())
            },
            getChartSize: function() {
                var a =
                    this.options.chart,
                    b = a.width;
                a = a.height;
                var d = this.renderTo;
                D(b) || (this.containerWidth = c.getStyle(d, "width"));
                D(a) || (this.containerHeight = c.getStyle(d, "height"));
                this.chartWidth = Math.max(0, b || this.containerWidth || 600);
                this.chartHeight = Math.max(0, c.relativeLength(a, this.chartWidth) || (1 < this.containerHeight ? this.containerHeight : 400))
            },
            temporaryDisplay: function(a) {
                var b = this.renderTo;
                if (a)
                    for (; b && b.style;) b.hcOrigStyle && (c.css(b, b.hcOrigStyle), delete b.hcOrigStyle), b.hcOrigDetached && (n.body.removeChild(b),
                        b.hcOrigDetached = !1), b = b.parentNode;
                else
                    for (; b && b.style;) {
                        n.body.contains(b) || b.parentNode || (b.hcOrigDetached = !0, n.body.appendChild(b));
                        if ("none" === c.getStyle(b, "display", !1) || b.hcOricDetached) b.hcOrigStyle = {
                            display: b.style.display,
                            height: b.style.height,
                            overflow: b.style.overflow
                        }, a = {
                            display: "block",
                            overflow: "hidden"
                        }, b !== this.renderTo && (a.height = 0), c.css(b, a), b.offsetWidth || b.style.setProperty("display", "block", "important");
                        b = b.parentNode;
                        if (b === n.body) break
                    }
            },
            setClassName: function(a) {
                this.container.className =
                    "highcharts-container " + (a || "")
            },
            getContainer: function() {
                var a = this.options,
                    b = a.chart;
                var d = this.renderTo;
                var e = c.uniqueKey(),
                    h, g;
                d || (this.renderTo = d = b.renderTo);
                q(d) && (this.renderTo = d = n.getElementById(d));
                d || c.error(13, !0, this);
                var k = w(H(d, "data-highcharts-chart"));
                G(k) && l[k] && l[k].hasRendered && l[k].destroy();
                H(d, "data-highcharts-chart", this.index);
                d.innerHTML = "";
                b.skipClone || d.offsetWidth || this.temporaryDisplay();
                this.getChartSize();
                k = this.chartWidth;
                var f = this.chartHeight;
                t(d, {
                    overflow: "hidden"
                });
                this.styledMode || (h = p({
                    position: "relative",
                    overflow: "hidden",
                    width: k + "px",
                    height: f + "px",
                    textAlign: "left",
                    lineHeight: "normal",
                    zIndex: 0,
                    "-webkit-tap-highlight-color": "rgba(0,0,0,0)"
                }, b.style));
                this.container = d = r("div", {
                    id: e
                }, h, d);
                this._cursor = d.style.cursor;
                this.renderer = new(c[b.renderer] || c.Renderer)(d, k, f, null, b.forExport, a.exporting && a.exporting.allowHTML, this.styledMode);
                this.setClassName(b.className);
                if (this.styledMode)
                    for (g in a.defs) this.renderer.definition(a.defs[g]);
                else this.renderer.setStyle(b.style);
                this.renderer.chartIndex = this.index;
                I(this, "afterGetContainer")
            },
            getMargins: function(a) {
                var b = this.spacing,
                    d = this.margin,
                    e = this.titleOffset;
                this.resetMargins();
                e[0] && !D(d[0]) && (this.plotTop = Math.max(this.plotTop, e[0] + b[0]));
                e[2] && !D(d[2]) && (this.marginBottom = Math.max(this.marginBottom, e[2] + b[2]));
                this.legend && this.legend.display && this.legend.adjustMargins(d, b);
                I(this, "getMargins");
                a || this.getAxisMargins()
            },
            getAxisMargins: function() {
                var a = this,
                    b = a.axisOffset = [0, 0, 0, 0],
                    d = a.colorAxis,
                    e = a.margin,
                    c = function(a) {
                        a.forEach(function(a) {
                            a.visible &&
                                a.getOffset()
                        })
                    };
                a.hasCartesianSeries ? c(a.axes) : d && d.length && c(d);
                u.forEach(function(d, c) {
                    D(e[c]) || (a[d] += b[c])
                });
                a.setChartSize()
            },
            reflow: function(a) {
                var d = this,
                    e = d.options.chart,
                    l = d.renderTo,
                    h = D(e.width) && D(e.height),
                    g = e.width || c.getStyle(l, "width");
                e = e.height || c.getStyle(l, "height");
                l = a ? a.target : C;
                if (!h && !d.isPrinting && g && e && (l === C || l === n)) {
                    if (g !== d.containerWidth || e !== d.containerHeight) c.clearTimeout(d.reflowTimeout), d.reflowTimeout = b(function() {
                            d.container && d.setSize(void 0, void 0, !1)
                        }, a ? 100 :
                        0);
                    d.containerWidth = g;
                    d.containerHeight = e
                }
            },
            setReflow: function(a) {
                var b = this;
                !1 === a || this.unbindReflow ? !1 === a && this.unbindReflow && (this.unbindReflow = this.unbindReflow()) : (this.unbindReflow = d(C, "resize", function(a) {
                    b.options && b.reflow(a)
                }), d(this, "destroy", this.unbindReflow))
            },
            setSize: function(d, e, c) {
                var l = this,
                    k = l.renderer;
                l.isResizing += 1;
                g(c, l);
                l.oldChartHeight = l.chartHeight;
                l.oldChartWidth = l.chartWidth;
                void 0 !== d && (l.options.chart.width = d);
                void 0 !== e && (l.options.chart.height = e);
                l.getChartSize();
                if (!l.styledMode) {
                    var f = k.globalAnimation;
                    (f ? a : t)(l.container, {
                        width: l.chartWidth + "px",
                        height: l.chartHeight + "px"
                    }, f)
                }
                l.setChartSize(!0);
                k.setSize(l.chartWidth, l.chartHeight, c);
                l.axes.forEach(function(a) {
                    a.isDirty = !0;
                    a.setScale()
                });
                l.isDirtyLegend = !0;
                l.isDirtyBox = !0;
                l.layOutTitles();
                l.getMargins();
                l.redraw(c);
                l.oldChartHeight = null;
                I(l, "resize");
                b(function() {
                    l && I(l, "endResize", null, function() {
                        --l.isResizing
                    })
                }, h(f).duration || 0)
            },
            setChartSize: function(a) {
                var b = this.inverted,
                    d = this.renderer,
                    e = this.chartWidth,
                    c = this.chartHeight,
                    l = this.options.chart,
                    h = this.spacing,
                    g = this.clipOffset,
                    t, k, f, u;
                this.plotLeft = t = Math.round(this.plotLeft);
                this.plotTop = k = Math.round(this.plotTop);
                this.plotWidth = f = Math.max(0, Math.round(e - t - this.marginRight));
                this.plotHeight = u = Math.max(0, Math.round(c - k - this.marginBottom));
                this.plotSizeX = b ? u : f;
                this.plotSizeY = b ? f : u;
                this.plotBorderWidth = l.plotBorderWidth || 0;
                this.spacingBox = d.spacingBox = {
                    x: h[3],
                    y: h[0],
                    width: e - h[3] - h[1],
                    height: c - h[0] - h[2]
                };
                this.plotBox = d.plotBox = {
                    x: t,
                    y: k,
                    width: f,
                    height: u
                };
                e = 2 * Math.floor(this.plotBorderWidth / 2);
                b = Math.ceil(Math.max(e, g[3]) / 2);
                d = Math.ceil(Math.max(e, g[0]) / 2);
                this.clipBox = {
                    x: b,
                    y: d,
                    width: Math.floor(this.plotSizeX - Math.max(e, g[1]) / 2 - b),
                    height: Math.max(0, Math.floor(this.plotSizeY - Math.max(e, g[2]) / 2 - d))
                };
                a || this.axes.forEach(function(a) {
                    a.setAxisSize();
                    a.setAxisTranslation()
                });
                I(this, "afterSetChartSize", {
                    skipAxes: a
                })
            },
            resetMargins: function() {
                I(this, "resetMargins");
                var a = this,
                    b = a.options.chart;
                ["margin", "spacing"].forEach(function(d) {
                    var e = b[d],
                        c = v(e) ? e : [e,
                            e, e, e
                        ];
                    ["Top", "Right", "Bottom", "Left"].forEach(function(e, l) {
                        a[d][l] = m(b[d + e], c[l])
                    })
                });
                u.forEach(function(b, d) {
                    a[b] = m(a.margin[d], a.spacing[d])
                });
                a.axisOffset = [0, 0, 0, 0];
                a.clipOffset = [0, 0, 0, 0]
            },
            drawChartBox: function() {
                var a = this.options.chart,
                    b = this.renderer,
                    d = this.chartWidth,
                    e = this.chartHeight,
                    c = this.chartBackground,
                    l = this.plotBackground,
                    h = this.plotBorder,
                    g = this.styledMode,
                    t = this.plotBGImage,
                    k = a.backgroundColor,
                    f = a.plotBackgroundColor,
                    u = a.plotBackgroundImage,
                    r, B = this.plotLeft,
                    n = this.plotTop,
                    z = this.plotWidth,
                    x = this.plotHeight,
                    m = this.plotBox,
                    q = this.clipRect,
                    L = this.clipBox,
                    w = "animate";
                c || (this.chartBackground = c = b.rect().addClass("highcharts-background").add(), w = "attr");
                if (g) var F = r = c.strokeWidth();
                else {
                    F = a.borderWidth || 0;
                    r = F + (a.shadow ? 8 : 0);
                    k = {
                        fill: k || "none"
                    };
                    if (F || c["stroke-width"]) k.stroke = a.borderColor, k["stroke-width"] = F;
                    c.attr(k).shadow(a.shadow)
                }
                c[w]({
                    x: r / 2,
                    y: r / 2,
                    width: d - r - F % 2,
                    height: e - r - F % 2,
                    r: a.borderRadius
                });
                w = "animate";
                l || (w = "attr", this.plotBackground = l = b.rect().addClass("highcharts-plot-background").add());
                l[w](m);
                g || (l.attr({
                    fill: f || "none"
                }).shadow(a.plotShadow), u && (t ? t.animate(m) : this.plotBGImage = b.image(u, B, n, z, x).add()));
                q ? q.animate({
                    width: L.width,
                    height: L.height
                }) : this.clipRect = b.clipRect(L);
                w = "animate";
                h || (w = "attr", this.plotBorder = h = b.rect().addClass("highcharts-plot-border").attr({
                    zIndex: 1
                }).add());
                g || h.attr({
                    stroke: a.plotBorderColor,
                    "stroke-width": a.plotBorderWidth || 0,
                    fill: "none"
                });
                h[w](h.crisp({
                    x: B,
                    y: n,
                    width: z,
                    height: x
                }, -h.strokeWidth()));
                this.isDirtyBox = !1;
                I(this, "afterDrawChartBox")
            },
            propFromSeries: function() {
                var a =
                    this,
                    b = a.options.chart,
                    d, e = a.options.series,
                    c, l;
                ["inverted", "angular", "polar"].forEach(function(h) {
                    d = Q[b.type || b.defaultSeriesType];
                    l = b[h] || d && d.prototype[h];
                    for (c = e && e.length; !l && c--;)(d = Q[e[c].type]) && d.prototype[h] && (l = !0);
                    a[h] = l
                })
            },
            linkSeries: function() {
                var a = this,
                    b = a.series;
                b.forEach(function(a) {
                    a.linkedSeries.length = 0
                });
                b.forEach(function(b) {
                    var d = b.options.linkedTo;
                    q(d) && (d = ":previous" === d ? a.series[b.index - 1] : a.get(d)) && d.linkedParent !== b && (d.linkedSeries.push(b), b.linkedParent = d, b.visible =
                        m(b.options.visible, d.options.visible, b.visible))
                });
                I(this, "afterLinkSeries")
            },
            renderSeries: function() {
                this.series.forEach(function(a) {
                    a.translate();
                    a.render()
                })
            },
            renderLabels: function() {
                var a = this,
                    b = a.options.labels;
                b.items && b.items.forEach(function(d) {
                    var e = p(b.style, d.style),
                        c = w(e.left) + a.plotLeft,
                        l = w(e.top) + a.plotTop + 12;
                    delete e.left;
                    delete e.top;
                    a.renderer.text(d.html, c, l).attr({
                        zIndex: 2
                    }).css(e).add()
                })
            },
            render: function() {
                var a = this.axes,
                    b = this.colorAxis,
                    d = this.renderer,
                    e = this.options,
                    c = 0,
                    l =
                    function(a) {
                        a.forEach(function(a) {
                            a.visible && a.render()
                        })
                    };
                this.setTitle();
                this.legend = new z(this, e.legend);
                this.getStacks && this.getStacks();
                this.getMargins(!0);
                this.setChartSize();
                e = this.plotWidth;
                a.some(function(a) {
                    if (a.horiz && a.visible && a.options.labels.enabled && a.series.length) return c = 21, !0
                });
                var h = this.plotHeight = Math.max(this.plotHeight - c, 0);
                a.forEach(function(a) {
                    a.setScale()
                });
                this.getAxisMargins();
                var g = 1.1 < e / this.plotWidth;
                var t = 1.05 < h / this.plotHeight;
                if (g || t) a.forEach(function(a) {
                    (a.horiz &&
                        g || !a.horiz && t) && a.setTickInterval(!0)
                }), this.getMargins();
                this.drawChartBox();
                this.hasCartesianSeries ? l(a) : b && b.length && l(b);
                this.seriesGroup || (this.seriesGroup = d.g("series-group").attr({
                    zIndex: 3
                }).add());
                this.renderSeries();
                this.renderLabels();
                this.addCredits();
                this.setResponsive && this.setResponsive();
                this.updateContainerScaling();
                this.hasRendered = !0
            },
            addCredits: function(a) {
                var b = this;
                a = L(!0, this.options.credits, a);
                a.enabled && !this.credits && (this.credits = this.renderer.text(a.text + (this.mapCredits ||
                    ""), 0, 0).addClass("highcharts-credits").on("click", function() {
                    a.href && (C.location.href = a.href)
                }).attr({
                    align: a.position.align,
                    zIndex: 8
                }), b.styledMode || this.credits.css(a.style), this.credits.add().align(a.position), this.credits.update = function(a) {
                    b.credits = b.credits.destroy();
                    b.addCredits(a)
                })
            },
            updateContainerScaling: function() {
                var a = this.container;
                if (a.offsetWidth && a.offsetHeight && a.getBoundingClientRect) {
                    var b = a.getBoundingClientRect(),
                        d = b.width / a.offsetWidth;
                    a = b.height / a.offsetHeight;
                    1 !== d || 1 !==
                        a ? this.containerScaling = {
                            scaleX: d,
                            scaleY: a
                        } : delete this.containerScaling
                }
            },
            destroy: function() {
                var a = this,
                    b = a.axes,
                    d = a.series,
                    e = a.container,
                    h, g = e && e.parentNode;
                I(a, "destroy");
                a.renderer.forExport ? E(l, a) : l[a.index] = void 0;
                c.chartCount--;
                a.renderTo.removeAttribute("data-highcharts-chart");
                T(a);
                for (h = b.length; h--;) b[h] = b[h].destroy();
                this.scroller && this.scroller.destroy && this.scroller.destroy();
                for (h = d.length; h--;) d[h] = d[h].destroy();
                "title subtitle chartBackground plotBackground plotBGImage plotBorder seriesGroup clipRect credits pointer rangeSelector legend resetZoomButton tooltip renderer".split(" ").forEach(function(b) {
                    var d =
                        a[b];
                    d && d.destroy && (a[b] = d.destroy())
                });
                e && (e.innerHTML = "", T(e), g && A(e));
                k(a, function(b, d) {
                    delete a[d]
                })
            },
            firstRender: function() {
                var a = this,
                    b = a.options;
                if (!a.isReadyToRender || a.isReadyToRender()) {
                    a.getContainer();
                    a.resetMargins();
                    a.setChartSize();
                    a.propFromSeries();
                    a.getAxes();
                    (y(b.series) ? b.series : []).forEach(function(b) {
                        a.initSeries(b)
                    });
                    a.linkSeries();
                    I(a, "beforeRender");
                    M && (a.pointer = new M(a, b));
                    a.render();
                    if (!a.renderer.imgCount && a.onload) a.onload();
                    a.temporaryDisplay(!0)
                }
            },
            onload: function() {
                this.callbacks.concat([this.callback]).forEach(function(a) {
                    a &&
                        void 0 !== this.index && a.apply(this, [this])
                }, this);
                I(this, "load");
                I(this, "render");
                D(this.index) && this.setReflow(this.options.chart.reflow);
                this.onload = null
            }
        })
    });
    K(C, "parts/ScrollablePlotArea.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.pick,
            D = c.addEvent;
        f = c.Chart;
        "";
        D(f, "afterSetChartSize", function(f) {
            var A = this.options.chart.scrollablePlotArea,
                p = A && A.minWidth;
            A = A && A.minHeight;
            if (!this.renderer.forExport) {
                if (p) {
                    if (this.scrollablePixelsX = p = Math.max(0, p - this.chartWidth)) {
                        this.plotWidth +=
                            p;
                        this.inverted ? (this.clipBox.height += p, this.plotBox.height += p) : (this.clipBox.width += p, this.plotBox.width += p);
                        var y = {
                            1: {
                                name: "right",
                                value: p
                            }
                        }
                    }
                } else A && (this.scrollablePixelsY = p = Math.max(0, A - this.chartHeight)) && (this.plotHeight += p, this.inverted ? (this.clipBox.width += p, this.plotBox.width += p) : (this.clipBox.height += p, this.plotBox.height += p), y = {
                    2: {
                        name: "bottom",
                        value: p
                    }
                });
                y && !f.skipAxes && this.axes.forEach(function(f) {
                    y[f.side] ? f.getPlotLinePath = function() {
                        var p = y[f.side].name,
                            q = this[p];
                        this[p] = q - y[f.side].value;
                        var k = c.Axis.prototype.getPlotLinePath.apply(this, arguments);
                        this[p] = q;
                        return k
                    } : (f.setAxisSize(), f.setAxisTranslation())
                })
            }
        });
        D(f, "render", function() {
            this.scrollablePixelsX || this.scrollablePixelsY ? (this.setUpScrolling && this.setUpScrolling(), this.applyFixed()) : this.fixedDiv && this.applyFixed()
        });
        f.prototype.setUpScrolling = function() {
            var f = {
                WebkitOverflowScrolling: "touch",
                overflowX: "hidden",
                overflowY: "hidden"
            };
            this.scrollablePixelsX && (f.overflowX = "auto");
            this.scrollablePixelsY && (f.overflowY = "auto");
            this.scrollingContainer = c.createElement("div", {
                className: "highcharts-scrolling"
            }, f, this.renderTo);
            this.innerContainer = c.createElement("div", {
                className: "highcharts-inner-container"
            }, null, this.scrollingContainer);
            this.innerContainer.appendChild(this.container);
            this.setUpScrolling = null
        };
        f.prototype.moveFixedElements = function() {
            var c = this.container,
                f = this.fixedRenderer,
                p = ".highcharts-contextbutton .highcharts-credits .highcharts-legend .highcharts-legend-checkbox .highcharts-navigator-series .highcharts-navigator-xaxis .highcharts-navigator-yaxis .highcharts-navigator .highcharts-reset-zoom .highcharts-scrollbar .highcharts-subtitle .highcharts-title".split(" "),
                y;
            this.scrollablePixelsX && !this.inverted ? y = ".highcharts-yaxis" : this.scrollablePixelsX && this.inverted ? y = ".highcharts-xaxis" : this.scrollablePixelsY && !this.inverted ? y = ".highcharts-xaxis" : this.scrollablePixelsY && this.inverted && (y = ".highcharts-yaxis");
            p.push(y, y + "-labels");
            p.forEach(function(p) {
                [].forEach.call(c.querySelectorAll(p), function(c) {
                    (c.namespaceURI === f.SVG_NS ? f.box : f.box.parentNode).appendChild(c);
                    c.style.pointerEvents = "auto"
                })
            })
        };
        f.prototype.applyFixed = function() {
            var f, E = !this.fixedDiv,
                p = this.options.chart.scrollablePlotArea;
            E ? (this.fixedDiv = c.createElement("div", {
                    className: "highcharts-fixed"
                }, {
                    position: "absolute",
                    overflow: "hidden",
                    pointerEvents: "none",
                    zIndex: 2
                }, null, !0), this.renderTo.insertBefore(this.fixedDiv, this.renderTo.firstChild), this.renderTo.style.overflow = "visible", this.fixedRenderer = f = new c.Renderer(this.fixedDiv, this.chartWidth, this.chartHeight), this.scrollableMask = f.path().attr({
                    fill: c.color(this.options.chart.backgroundColor || "#fff").setOpacity(H(p.opacity, .85)).get(),
                    zIndex: -1
                }).addClass("highcharts-scrollable-mask").add(),
                this.moveFixedElements(), D(this, "afterShowResetZoom", this.moveFixedElements), D(this, "afterLayOutTitles", this.moveFixedElements)) : this.fixedRenderer.setSize(this.chartWidth, this.chartHeight);
            f = this.chartWidth + (this.scrollablePixelsX || 0);
            var y = this.chartHeight + (this.scrollablePixelsY || 0);
            c.stop(this.container);
            this.container.style.width = f + "px";
            this.container.style.height = y + "px";
            this.renderer.boxWrapper.attr({
                width: f,
                height: y,
                viewBox: [0, 0, f, y].join(" ")
            });
            this.chartBackground.attr({
                width: f,
                height: y
            });
            this.scrollablePixelsY && (this.scrollingContainer.style.height = this.chartHeight + "px");
            E && (p.scrollPositionX && (this.scrollingContainer.scrollLeft = this.scrollablePixelsX * p.scrollPositionX), p.scrollPositionY && (this.scrollingContainer.scrollTop = this.scrollablePixelsY * p.scrollPositionY));
            y = this.axisOffset;
            E = this.plotTop - y[0] - 1;
            p = this.plotLeft - y[3] - 1;
            f = this.plotTop + this.plotHeight + y[2] + 1;
            y = this.plotLeft + this.plotWidth + y[1] + 1;
            var G = this.plotLeft + this.plotWidth - (this.scrollablePixelsX || 0),
                v = this.plotTop + this.plotHeight -
                (this.scrollablePixelsY || 0);
            E = this.scrollablePixelsX ? ["M", 0, E, "L", this.plotLeft - 1, E, "L", this.plotLeft - 1, f, "L", 0, f, "Z", "M", G, E, "L", this.chartWidth, E, "L", this.chartWidth, f, "L", G, f, "Z"] : this.scrollablePixelsY ? ["M", p, 0, "L", p, this.plotTop - 1, "L", y, this.plotTop - 1, "L", y, 0, "Z", "M", p, v, "L", p, this.chartHeight, "L", y, this.chartHeight, "L", y, v, "Z"] : ["M", 0, 0];
            "adjustHeight" !== this.redrawTrigger && this.scrollableMask.attr({
                d: E
            })
        }
    });
    K(C, "parts/Point.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H =
            f.defined,
            D = f.erase,
            A = f.extend,
            E = f.isArray,
            p = f.isNumber,
            y = f.isObject,
            G = f.pick,
            v, q = c.fireEvent,
            k = c.format,
            m = c.uniqueKey,
            w = c.removeEvent;
        c.Point = v = function() {};
        c.Point.prototype = {
            init: function(c, e, b) {
                this.series = c;
                this.applyOptions(e, b);
                this.id = H(this.id) ? this.id : m();
                this.resolveColor();
                c.chart.pointCount++;
                q(this, "afterInit");
                return this
            },
            resolveColor: function() {
                var c = this.series;
                var e = c.chart.options.chart.colorCount;
                var b = c.chart.styledMode;
                b || this.options.color || (this.color = c.color);
                c.options.colorByPoint ?
                    (b || (e = c.options.colors || c.chart.options.colors, this.color = this.color || e[c.colorCounter], e = e.length), b = c.colorCounter, c.colorCounter++, c.colorCounter === e && (c.colorCounter = 0)) : b = c.colorIndex;
                this.colorIndex = G(this.colorIndex, b)
            },
            applyOptions: function(c, e) {
                var b = this.series,
                    d = b.options.pointValKey || b.pointValKey;
                c = v.prototype.optionsToObject.call(this, c);
                A(this, c);
                this.options = this.options ? A(this.options, c) : c;
                c.group && delete this.group;
                c.dataLabels && delete this.dataLabels;
                d && (this.y = this[d]);
                this.formatPrefix =
                    (this.isNull = G(this.isValid && !this.isValid(), null === this.x || !p(this.y))) ? "null" : "point";
                this.selected && (this.state = "select");
                "name" in this && void 0 === e && b.xAxis && b.xAxis.hasNames && (this.x = b.xAxis.nameToX(this));
                void 0 === this.x && b && (this.x = void 0 === e ? b.autoIncrement(this) : e);
                return this
            },
            setNestedProperty: function(c, e, b) {
                b.split(".").reduce(function(b, a, c, g) {
                    b[a] = g.length - 1 === c ? e : y(b[a], !0) ? b[a] : {};
                    return b[a]
                }, c);
                return c
            },
            optionsToObject: function(g) {
                var e = {},
                    b = this.series,
                    d = b.options.keys,
                    a = d || b.pointArrayMap || ["y"],
                    h = a.length,
                    k = 0,
                    f = 0;
                if (p(g) || null === g) e[a[0]] = g;
                else if (E(g))
                    for (!d && g.length > h && (b = typeof g[0], "string" === b ? e.name = g[0] : "number" === b && (e.x = g[0]), k++); f < h;) d && void 0 === g[k] || (0 < a[f].indexOf(".") ? c.Point.prototype.setNestedProperty(e, g[k], a[f]) : e[a[f]] = g[k]), k++, f++;
                else "object" === typeof g && (e = g, g.dataLabels && (b._hasPointLabels = !0), g.marker && (b._hasPointMarkers = !0));
                return e
            },
            getClassName: function() {
                return "highcharts-point" + (this.selected ? " highcharts-point-select" : "") + (this.negative ? " highcharts-negative" :
                    "") + (this.isNull ? " highcharts-null-point" : "") + (void 0 !== this.colorIndex ? " highcharts-color-" + this.colorIndex : "") + (this.options.className ? " " + this.options.className : "") + (this.zone && this.zone.className ? " " + this.zone.className.replace("highcharts-negative", "") : "")
            },
            getZone: function() {
                var c = this.series,
                    e = c.zones;
                c = c.zoneAxis || "y";
                var b = 0,
                    d;
                for (d = e[b]; this[c] >= d.value;) d = e[++b];
                this.nonZonedColor || (this.nonZonedColor = this.color);
                this.color = d && d.color && !this.options.color ? d.color : this.nonZonedColor;
                return d
            },
            hasNewShapeType: function() {
                return this.graphic && this.graphic.element.nodeName !== this.shapeType
            },
            destroy: function() {
                var c = this.series.chart,
                    e = c.hoverPoints,
                    b;
                c.pointCount--;
                e && (this.setState(), D(e, this), e.length || (c.hoverPoints = null));
                if (this === c.hoverPoint) this.onMouseOut();
                if (this.graphic || this.dataLabel || this.dataLabels) w(this), this.destroyElements();
                this.legendItem && c.legend.destroyItem(this);
                for (b in this) this[b] = null
            },
            destroyElements: function(c) {
                var e = this,
                    b = [],
                    d;
                c = c || {
                    graphic: 1,
                    dataLabel: 1
                };
                c.graphic && b.push("graphic", "shadowGroup");
                c.dataLabel && b.push("dataLabel", "dataLabelUpper", "connector");
                for (d = b.length; d--;) {
                    var a = b[d];
                    e[a] && (e[a] = e[a].destroy())
                }["dataLabel", "connector"].forEach(function(a) {
                    var b = a + "s";
                    c[a] && e[b] && (e[b].forEach(function(a) {
                        a.element && a.destroy()
                    }), delete e[b])
                })
            },
            getLabelConfig: function() {
                return {
                    x: this.category,
                    y: this.y,
                    color: this.color,
                    colorIndex: this.colorIndex,
                    key: this.name || this.category,
                    series: this.series,
                    point: this,
                    percentage: this.percentage,
                    total: this.total ||
                        this.stackTotal
                }
            },
            tooltipFormatter: function(c) {
                var e = this.series,
                    b = e.tooltipOptions,
                    d = G(b.valueDecimals, ""),
                    a = b.valuePrefix || "",
                    h = b.valueSuffix || "";
                e.chart.styledMode && (c = e.chart.tooltip.styledModeFormat(c));
                (e.pointArrayMap || ["y"]).forEach(function(b) {
                    b = "{point." + b;
                    if (a || h) c = c.replace(RegExp(b + "}", "g"), a + b + "}" + h);
                    c = c.replace(RegExp(b + "}", "g"), b + ":,." + d + "f}")
                });
                return k(c, {
                    point: this,
                    series: this.series
                }, e.chart.time)
            },
            firePointEvent: function(c, e, b) {
                var d = this,
                    a = this.series.options;
                (a.point.events[c] ||
                    d.options && d.options.events && d.options.events[c]) && this.importEvents();
                "click" === c && a.allowPointSelect && (b = function(a) {
                    d.select && d.select(null, a.ctrlKey || a.metaKey || a.shiftKey)
                });
                q(this, c, e, b)
            },
            visible: !0
        }
    });
    K(C, "parts/Series.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.arrayMax,
            D = f.arrayMin,
            A = f.defined,
            E = f.erase,
            p = f.extend,
            y = f.isArray,
            G = f.isNumber,
            v = f.isString,
            q = f.objectEach,
            k = f.pick,
            m = f.splat,
            w = f.syncTimeout,
            g = c.addEvent,
            e = c.animObject,
            b = c.correctFloat,
            d = c.defaultOptions,
            a = c.defaultPlotOptions,
            h = c.fireEvent,
            n = c.merge,
            F = c.removeEvent,
            r = c.SVGElement,
            x = c.win;
        c.Series = c.seriesType("line", null, {
            lineWidth: 2,
            allowPointSelect: !1,
            showCheckbox: !1,
            animation: {
                duration: 1E3
            },
            events: {},
            marker: {
                lineWidth: 0,
                lineColor: "#ffffff",
                enabledThreshold: 2,
                radius: 4,
                states: {
                    normal: {
                        animation: !0
                    },
                    hover: {
                        animation: {
                            duration: 50
                        },
                        enabled: !0,
                        radiusPlus: 2,
                        lineWidthPlus: 1
                    },
                    select: {
                        fillColor: "#cccccc",
                        lineColor: "#000000",
                        lineWidth: 2
                    }
                }
            },
            point: {
                events: {}
            },
            dataLabels: {
                align: "center",
                formatter: function() {
                    return null ===
                        this.y ? "" : c.numberFormat(this.y, -1)
                },
                padding: 5,
                style: {
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: "contrast",
                    textOutline: "1px contrast"
                },
                verticalAlign: "bottom",
                x: 0,
                y: 0
            },
            cropThreshold: 300,
            opacity: 1,
            pointRange: 0,
            softThreshold: !0,
            states: {
                normal: {
                    animation: !0
                },
                hover: {
                    animation: {
                        duration: 50
                    },
                    lineWidthPlus: 1,
                    marker: {},
                    halo: {
                        size: 10,
                        opacity: .25
                    }
                },
                select: {
                    animation: {
                        duration: 0
                    }
                },
                inactive: {
                    animation: {
                        duration: 50
                    },
                    opacity: .2
                }
            },
            stickyTracking: !0,
            turboThreshold: 1E3,
            findNearestPointBy: "x"
        }, {
            axisTypes: ["xAxis", "yAxis"],
            coll: "series",
            colorCounter: 0,
            cropShoulder: 1,
            directTouch: !1,
            isCartesian: !0,
            parallelArrays: ["x", "y"],
            pointClass: c.Point,
            requireSorting: !0,
            sorted: !0,
            init: function(a, b) {
                h(this, "init", {
                    options: b
                });
                var d = this,
                    e = a.series,
                    l;
                this.eventOptions = this.eventOptions || {};
                d.chart = a;
                d.options = b = d.setOptions(b);
                d.linkedSeries = [];
                d.bindAxes();
                p(d, {
                    name: b.name,
                    state: "",
                    visible: !1 !== b.visible,
                    selected: !0 === b.selected
                });
                var t = b.events;
                q(t, function(a, b) {
                    c.isFunction(a) && d.eventOptions[b] !== a && (c.isFunction(d.eventOptions[b]) &&
                        F(d, b, d.eventOptions[b]), d.eventOptions[b] = a, g(d, b, a))
                });
                if (t && t.click || b.point && b.point.events && b.point.events.click || b.allowPointSelect) a.runTrackerClick = !0;
                d.getColor();
                d.getSymbol();
                d.parallelArrays.forEach(function(a) {
                    d[a + "Data"] || (d[a + "Data"] = [])
                });
                d.points || d.data || d.setData(b.data, !1);
                d.isCartesian && (a.hasCartesianSeries = !0);
                e.length && (l = e[e.length - 1]);
                d._i = k(l && l._i, -1) + 1;
                a.orderSeries(this.insert(e));
                h(this, "afterInit")
            },
            insert: function(a) {
                var b = this.options.index,
                    d;
                if (G(b)) {
                    for (d = a.length; d--;)
                        if (b >=
                            k(a[d].options.index, a[d]._i)) {
                            a.splice(d + 1, 0, this);
                            break
                        } - 1 === d && a.unshift(this);
                    d += 1
                } else a.push(this);
                return k(d, a.length - 1)
            },
            bindAxes: function() {
                var a = this,
                    b = a.options,
                    d = a.chart,
                    e;
                h(this, "bindAxes", null, function() {
                    (a.axisTypes || []).forEach(function(l) {
                        d[l].forEach(function(d) {
                            e = d.options;
                            if (b[l] === e.index || void 0 !== b[l] && b[l] === e.id || void 0 === b[l] && 0 === e.index) a.insert(d.series), a[l] = d, d.isDirty = !0
                        });
                        a[l] || a.optionalAxis === l || c.error(18, !0, d)
                    })
                })
            },
            updateParallelArrays: function(a, b) {
                var d = a.series,
                    e = arguments,
                    c = G(b) ? function(e) {
                        var c = "y" === e && d.toYData ? d.toYData(a) : a[e];
                        d[e + "Data"][b] = c
                    } : function(a) {
                        Array.prototype[b].apply(d[a + "Data"], Array.prototype.slice.call(e, 2))
                    };
                d.parallelArrays.forEach(c)
            },
            hasData: function() {
                return this.visible && void 0 !== this.dataMax && void 0 !== this.dataMin || this.visible && this.yData && 0 < this.yData.length
            },
            autoIncrement: function() {
                var a = this.options,
                    b = this.xIncrement,
                    d, e = a.pointIntervalUnit,
                    c = this.chart.time;
                b = k(b, a.pointStart, 0);
                this.pointInterval = d = k(this.pointInterval,
                    a.pointInterval, 1);
                e && (a = new c.Date(b), "day" === e ? c.set("Date", a, c.get("Date", a) + d) : "month" === e ? c.set("Month", a, c.get("Month", a) + d) : "year" === e && c.set("FullYear", a, c.get("FullYear", a) + d), d = a.getTime() - b);
                this.xIncrement = b + d;
                return b
            },
            setOptions: function(a) {
                var b = this.chart,
                    e = b.options,
                    c = e.plotOptions,
                    l = b.userOptions || {};
                a = n(a);
                b = b.styledMode;
                var g = {
                    plotOptions: c,
                    userOptions: a
                };
                h(this, "setOptions", g);
                var f = g.plotOptions[this.type],
                    r = l.plotOptions || {};
                this.userOptions = g.userOptions;
                l = n(f, c.series, l.plotOptions &&
                    l.plotOptions[this.type], a);
                this.tooltipOptions = n(d.tooltip, d.plotOptions.series && d.plotOptions.series.tooltip, d.plotOptions[this.type].tooltip, e.tooltip.userOptions, c.series && c.series.tooltip, c[this.type].tooltip, a.tooltip);
                this.stickyTracking = k(a.stickyTracking, r[this.type] && r[this.type].stickyTracking, r.series && r.series.stickyTracking, this.tooltipOptions.shared && !this.noSharedTooltip ? !0 : l.stickyTracking);
                null === f.marker && delete l.marker;
                this.zoneAxis = l.zoneAxis;
                e = this.zones = (l.zones || []).slice();
                !l.negativeColor && !l.negativeFillColor || l.zones || (c = {
                    value: l[this.zoneAxis + "Threshold"] || l.threshold || 0,
                    className: "highcharts-negative"
                }, b || (c.color = l.negativeColor, c.fillColor = l.negativeFillColor), e.push(c));
                e.length && A(e[e.length - 1].value) && e.push(b ? {} : {
                    color: this.color,
                    fillColor: this.fillColor
                });
                h(this, "afterSetOptions", {
                    options: l
                });
                return l
            },
            getName: function() {
                return k(this.options.name, "Series " + (this.index + 1))
            },
            getCyclic: function(a, b, d) {
                var e = this.chart,
                    c = this.userOptions,
                    l = a + "Index",
                    h = a + "Counter",
                    g = d ? d.length : k(e.options.chart[a + "Count"], e[a + "Count"]);
                if (!b) {
                    var t = k(c[l], c["_" + l]);
                    A(t) || (e.series.length || (e[h] = 0), c["_" + l] = t = e[h] % g, e[h] += 1);
                    d && (b = d[t])
                }
                void 0 !== t && (this[l] = t);
                this[a] = b
            },
            getColor: function() {
                this.chart.styledMode ? this.getCyclic("color") : this.options.colorByPoint ? this.options.color = null : this.getCyclic("color", this.options.color || a[this.type].color, this.chart.options.colors)
            },
            getSymbol: function() {
                this.getCyclic("symbol", this.options.marker.symbol, this.chart.options.symbols)
            },
            findPointIndex: function(a,
                b) {
                var d = a.id;
                a = a.x;
                var e = this.points,
                    c;
                if (d) {
                    var l = (d = this.chart.get(d)) && d.index;
                    void 0 !== l && (c = !0)
                }
                void 0 === l && G(a) && (l = this.xData.indexOf(a, b)); - 1 !== l && void 0 !== l && this.cropped && (l = l >= this.cropStart ? l - this.cropStart : l);
                !c && e[l] && e[l].touched && (l = void 0);
                return l
            },
            drawLegendSymbol: c.LegendSymbolMixin.drawLineMarker,
            updateData: function(a) {
                var b = this.options,
                    d = this.points,
                    e = [],
                    c, l, h, g = this.requireSorting,
                    k = a.length === d.length,
                    f = !0;
                this.xIncrement = null;
                a.forEach(function(a, l) {
                    var t = A(a) && this.pointClass.prototype.optionsToObject.call({
                            series: this
                        },
                        a) || {};
                    var f = t.x;
                    if (t.id || G(f))
                        if (f = this.findPointIndex(t, h), -1 === f || void 0 === f ? e.push(a) : d[f] && a !== b.data[f] ? (d[f].update(a, !1, null, !1), d[f].touched = !0, g && (h = f + 1)) : d[f] && (d[f].touched = !0), !k || l !== f || this.hasDerivedData) c = !0
                }, this);
                if (c)
                    for (a = d.length; a--;)(l = d[a]) && !l.touched && l.remove(!1);
                else k ? a.forEach(function(a, b) {
                    d[b].update && a !== d[b].y && d[b].update(a, !1, null, !1)
                }) : f = !1;
                d.forEach(function(a) {
                    a && (a.touched = !1)
                });
                if (!f) return !1;
                e.forEach(function(a) {
                    this.addPoint(a, !1, null, null, !1)
                }, this);
                return !0
            },
            setData: function(a, b, d, e) {
                var l = this,
                    h = l.points,
                    g = h && h.length || 0,
                    t, f = l.options,
                    r = l.chart,
                    n = null,
                    B = l.xAxis;
                n = f.turboThreshold;
                var x = this.xData,
                    m = this.yData,
                    I = (t = l.pointArrayMap) && t.length,
                    q = f.keys,
                    w = 0,
                    F = 1,
                    p;
                a = a || [];
                t = a.length;
                b = k(b, !0);
                !1 !== e && t && g && !l.cropped && !l.hasGroupedData && l.visible && !l.isSeriesBoosting && (p = this.updateData(a));
                if (!p) {
                    l.xIncrement = null;
                    l.colorCounter = 0;
                    this.parallelArrays.forEach(function(a) {
                        l[a + "Data"].length = 0
                    });
                    if (n && t > n)
                        if (n = l.getFirstValidPoint(a), G(n))
                            for (d = 0; d < t; d++) x[d] =
                                this.autoIncrement(), m[d] = a[d];
                        else if (y(n))
                        if (I)
                            for (d = 0; d < t; d++) e = a[d], x[d] = e[0], m[d] = e.slice(1, I + 1);
                        else
                            for (q && (w = q.indexOf("x"), F = q.indexOf("y"), w = 0 <= w ? w : 0, F = 0 <= F ? F : 1), d = 0; d < t; d++) e = a[d], x[d] = e[w], m[d] = e[F];
                    else c.error(12, !1, r);
                    else
                        for (d = 0; d < t; d++) void 0 !== a[d] && (e = {
                            series: l
                        }, l.pointClass.prototype.applyOptions.apply(e, [a[d]]), l.updateParallelArrays(e, d));
                    m && v(m[0]) && c.error(14, !0, r);
                    l.data = [];
                    l.options.data = l.userOptions.data = a;
                    for (d = g; d--;) h[d] && h[d].destroy && h[d].destroy();
                    B && (B.minRange =
                        B.userMinRange);
                    l.isDirty = r.isDirtyBox = !0;
                    l.isDirtyData = !!h;
                    d = !1
                }
                "point" === f.legendType && (this.processData(), this.generatePoints());
                b && r.redraw(d)
            },
            processData: function(a) {
                var b = this.xData,
                    d = this.yData,
                    e = b.length;
                var l = 0;
                var h = this.xAxis,
                    g = this.options;
                var k = g.cropThreshold;
                var f = this.getExtremesFromAll || g.getExtremesFromAll,
                    r = this.isCartesian;
                g = h && h.val2lin;
                var n = h && h.isLog,
                    x = this.requireSorting;
                if (r && !this.isDirty && !h.isDirty && !this.yAxis.isDirty && !a) return !1;
                if (h) {
                    a = h.getExtremes();
                    var m = a.min;
                    var q = a.max
                }
                if (r && this.sorted && !f && (!k || e > k || this.forceCrop))
                    if (b[e - 1] < m || b[0] > q) b = [], d = [];
                    else if (this.yData && (b[0] < m || b[e - 1] > q)) {
                    l = this.cropData(this.xData, this.yData, m, q);
                    b = l.xData;
                    d = l.yData;
                    l = l.start;
                    var w = !0
                }
                for (k = b.length || 1; --k;)
                    if (e = n ? g(b[k]) - g(b[k - 1]) : b[k] - b[k - 1], 0 < e && (void 0 === F || e < F)) var F = e;
                    else 0 > e && x && (c.error(15, !1, this.chart), x = !1);
                this.cropped = w;
                this.cropStart = l;
                this.processedXData = b;
                this.processedYData = d;
                this.closestPointRange = this.basePointRange = F
            },
            cropData: function(a, b, d, e, c) {
                var l =
                    a.length,
                    h = 0,
                    g = l,
                    f;
                c = k(c, this.cropShoulder);
                for (f = 0; f < l; f++)
                    if (a[f] >= d) {
                        h = Math.max(0, f - c);
                        break
                    }
                for (d = f; d < l; d++)
                    if (a[d] > e) {
                        g = d + c;
                        break
                    }
                return {
                    xData: a.slice(h, g),
                    yData: b.slice(h, g),
                    start: h,
                    end: g
                }
            },
            generatePoints: function() {
                var a = this.options,
                    b = a.data,
                    d = this.data,
                    e, c = this.processedXData,
                    g = this.processedYData,
                    k = this.pointClass,
                    f = c.length,
                    r = this.cropStart || 0,
                    n = this.hasGroupedData;
                a = a.keys;
                var x = [],
                    q;
                d || n || (d = [], d.length = b.length, d = this.data = d);
                a && n && (this.options.keys = !1);
                for (q = 0; q < f; q++) {
                    var w = r + q;
                    if (n) {
                        var F =
                            (new k).init(this, [c[q]].concat(m(g[q])));
                        F.dataGroup = this.groupMap[q];
                        F.dataGroup.options && (F.options = F.dataGroup.options, p(F, F.dataGroup.options), delete F.dataLabels)
                    } else(F = d[w]) || void 0 === b[w] || (d[w] = F = (new k).init(this, b[w], c[q]));
                    F && (F.index = w, x[q] = F)
                }
                this.options.keys = a;
                if (d && (f !== (e = d.length) || n))
                    for (q = 0; q < e; q++) q !== r || n || (q += f), d[q] && (d[q].destroyElements(), d[q].plotX = void 0);
                this.data = d;
                this.points = x;
                h(this, "afterGeneratePoints")
            },
            getXExtremes: function(a) {
                return {
                    min: D(a),
                    max: H(a)
                }
            },
            getExtremes: function(a) {
                var b =
                    this.xAxis,
                    d = this.yAxis,
                    e = this.processedXData || this.xData,
                    c = [],
                    l = 0,
                    g = 0;
                var k = 0;
                var f = this.requireSorting ? this.cropShoulder : 0,
                    r = d ? d.positiveValuesOnly : !1,
                    n;
                a = a || this.stackedYData || this.processedYData || [];
                d = a.length;
                b && (k = b.getExtremes(), g = k.min, k = k.max);
                for (n = 0; n < d; n++) {
                    var x = e[n];
                    var m = a[n];
                    var q = (G(m) || y(m)) && (m.length || 0 < m || !r);
                    x = this.getExtremesFromAll || this.options.getExtremesFromAll || this.cropped || !b || (e[n + f] || x) >= g && (e[n - f] || x) <= k;
                    if (q && x)
                        if (q = m.length)
                            for (; q--;) G(m[q]) && (c[l++] = m[q]);
                        else c[l++] =
                            m
                }
                this.dataMin = D(c);
                this.dataMax = H(c);
                h(this, "afterGetExtremes")
            },
            getFirstValidPoint: function(a) {
                for (var b = null, d = a.length, e = 0; null === b && e < d;) b = a[e], e++;
                return b
            },
            translate: function() {
                this.processedXData || this.processData();
                this.generatePoints();
                var a = this.options,
                    d = a.stacking,
                    e = this.xAxis,
                    c = e.categories,
                    g = this.yAxis,
                    f = this.points,
                    r = f.length,
                    n = !!this.modifyValue,
                    x, m = this.pointPlacementToXValue(),
                    q = G(m),
                    w = a.threshold,
                    F = a.startFromThreshold ? w : 0,
                    p, v = this.zoneAxis || "y",
                    E = Number.MAX_VALUE;
                for (x = 0; x < r; x++) {
                    var D =
                        f[x],
                        H = D.x;
                    var C = D.y;
                    var K = D.low,
                        P = d && g.stacks[(this.negStacks && C < (F ? 0 : w) ? "-" : "") + this.stackKey];
                    g.positiveValuesOnly && null !== C && 0 >= C && (D.isNull = !0);
                    D.plotX = p = b(Math.min(Math.max(-1E5, e.translate(H, 0, 0, 0, 1, m, "flags" === this.type)), 1E5));
                    if (d && this.visible && P && P[H]) {
                        var Y = this.getStackIndicator(Y, H, this.index);
                        if (!D.isNull) {
                            var V = P[H];
                            var Z = V.points[Y.key]
                        }
                    }
                    y(Z) && (K = Z[0], C = Z[1], K === F && Y.key === P[H].base && (K = k(G(w) && w, g.min)), g.positiveValuesOnly && 0 >= K && (K = null), D.total = D.stackTotal = V.total, D.percentage =
                        V.total && D.y / V.total * 100, D.stackY = C, this.irregularWidths || V.setOffset(this.pointXOffset || 0, this.barW || 0));
                    D.yBottom = A(K) ? Math.min(Math.max(-1E5, g.translate(K, 0, 1, 0, 1)), 1E5) : null;
                    n && (C = this.modifyValue(C, D));
                    D.plotY = C = "number" === typeof C && Infinity !== C ? Math.min(Math.max(-1E5, g.translate(C, 0, 1, 0, 1)), 1E5) : void 0;
                    D.isInside = void 0 !== C && 0 <= C && C <= g.len && 0 <= p && p <= e.len;
                    D.clientX = q ? b(e.translate(H, 0, 0, 0, 1, m)) : p;
                    D.negative = D[v] < (a[v + "Threshold"] || w || 0);
                    D.category = c && void 0 !== c[D.x] ? c[D.x] : D.x;
                    if (!D.isNull) {
                        void 0 !==
                            aa && (E = Math.min(E, Math.abs(p - aa)));
                        var aa = p
                    }
                    D.zone = this.zones.length && D.getZone()
                }
                this.closestPointRangePx = E;
                h(this, "afterTranslate")
            },
            getValidPoints: function(a, b, d) {
                var e = this.chart;
                return (a || this.points || []).filter(function(a) {
                    return b && !e.isInsidePlot(a.plotX, a.plotY, e.inverted) ? !1 : d || !a.isNull
                })
            },
            getClipBox: function(a, b) {
                var d = this.options,
                    e = this.chart,
                    c = e.inverted,
                    l = this.xAxis,
                    h = l && this.yAxis;
                a && !1 === d.clip && h ? a = c ? {
                    y: -e.chartWidth + h.len + h.pos,
                    height: e.chartWidth,
                    width: e.chartHeight,
                    x: -e.chartHeight +
                        l.len + l.pos
                } : {
                    y: -h.pos,
                    height: e.chartHeight,
                    width: e.chartWidth,
                    x: -l.pos
                } : (a = this.clipBox || e.clipBox, b && (a.width = e.plotSizeX, a.x = 0));
                return b ? {
                    width: a.width,
                    x: a.x
                } : a
            },
            setClip: function(a) {
                var b = this.chart,
                    d = this.options,
                    e = b.renderer,
                    c = b.inverted,
                    l = this.clipBox,
                    h = this.getClipBox(a),
                    g = this.sharedClipKey || ["_sharedClip", a && a.duration, a && a.easing, h.height, d.xAxis, d.yAxis].join(),
                    k = b[g],
                    f = b[g + "m"];
                k || (a && (h.width = 0, c && (h.x = b.plotSizeX + (!1 !== d.clip ? 0 : b.plotTop)), b[g + "m"] = f = e.clipRect(c ? b.plotSizeX + 99 : -99,
                    c ? -b.plotLeft : -b.plotTop, 99, c ? b.chartWidth : b.chartHeight)), b[g] = k = e.clipRect(h), k.count = {
                    length: 0
                });
                a && !k.count[this.index] && (k.count[this.index] = !0, k.count.length += 1);
                if (!1 !== d.clip || a) this.group.clip(a || l ? k : b.clipRect), this.markerGroup.clip(f), this.sharedClipKey = g;
                a || (k.count[this.index] && (delete k.count[this.index], --k.count.length), 0 === k.count.length && g && b[g] && (l || (b[g] = b[g].destroy()), b[g + "m"] && (b[g + "m"] = b[g + "m"].destroy())))
            },
            animate: function(a) {
                var b = this.chart,
                    d = e(this.options.animation);
                if (a) this.setClip(d);
                else {
                    var c = this.sharedClipKey;
                    a = b[c];
                    var l = this.getClipBox(d, !0);
                    a && a.animate(l, d);
                    b[c + "m"] && b[c + "m"].animate({
                        width: l.width + 99,
                        x: l.x - (b.inverted ? 0 : 99)
                    }, d);
                    this.animate = null
                }
            },
            afterAnimate: function() {
                this.setClip();
                h(this, "afterAnimate");
                this.finishedAnimating = !0
            },
            drawPoints: function() {
                var a = this.points,
                    b = this.chart,
                    d, e = this.options.marker,
                    c = this[this.specialGroup] || this.markerGroup;
                var h = this.xAxis;
                var g = k(e.enabled, !h || h.isRadial ? !0 : null, this.closestPointRangePx >= e.enabledThreshold *
                    e.radius);
                if (!1 !== e.enabled || this._hasPointMarkers)
                    for (h = 0; h < a.length; h++) {
                        var f = a[h];
                        var r = (d = f.graphic) ? "animate" : "attr";
                        var n = f.marker || {};
                        var x = !!f.marker;
                        var m = g && void 0 === n.enabled || n.enabled;
                        var q = !1 !== f.isInside;
                        if (m && !f.isNull) {
                            var w = k(n.symbol, this.symbol);
                            m = this.markerAttribs(f, f.selected && "select");
                            d ? d[q ? "show" : "hide"](q).animate(m) : q && (0 < m.width || f.hasImage) && (f.graphic = d = b.renderer.symbol(w, m.x, m.y, m.width, m.height, x ? n : e).add(c));
                            if (d && !b.styledMode) d[r](this.pointAttribs(f, f.selected &&
                                "select"));
                            d && d.addClass(f.getClassName(), !0)
                        } else d && (f.graphic = d.destroy())
                    }
            },
            markerAttribs: function(a, b) {
                var d = this.options.marker,
                    e = a.marker || {},
                    c = e.symbol || d.symbol,
                    h = k(e.radius, d.radius);
                b && (d = d.states[b], b = e.states && e.states[b], h = k(b && b.radius, d && d.radius, h + (d && d.radiusPlus || 0)));
                a.hasImage = c && 0 === c.indexOf("url");
                a.hasImage && (h = 0);
                a = {
                    x: Math.floor(a.plotX) - h,
                    y: a.plotY - h
                };
                h && (a.width = a.height = 2 * h);
                return a
            },
            pointAttribs: function(a, b) {
                var d = this.options.marker,
                    e = a && a.options,
                    c = e && e.marker || {},
                    h = this.color,
                    l = e && e.color,
                    g = a && a.color;
                e = k(c.lineWidth, d.lineWidth);
                var f = a && a.zone && a.zone.color;
                a = 1;
                h = l || f || g || h;
                l = c.fillColor || d.fillColor || h;
                h = c.lineColor || d.lineColor || h;
                b = b || "normal";
                d = d.states[b];
                b = c.states && c.states[b] || {};
                e = k(b.lineWidth, d.lineWidth, e + k(b.lineWidthPlus, d.lineWidthPlus, 0));
                l = b.fillColor || d.fillColor || l;
                h = b.lineColor || d.lineColor || h;
                a = k(b.opacity, d.opacity, a);
                return {
                    stroke: h,
                    "stroke-width": e,
                    fill: l,
                    opacity: a
                }
            },
            destroy: function(a) {
                var b = this,
                    d = b.chart,
                    e = /AppleWebKit\/533/.test(x.navigator.userAgent),
                    l, g, k = b.data || [],
                    f, n;
                h(b, "destroy");
                a || F(b);
                (b.axisTypes || []).forEach(function(a) {
                    (n = b[a]) && n.series && (E(n.series, b), n.isDirty = n.forceRedraw = !0)
                });
                b.legendItem && b.chart.legend.destroyItem(b);
                for (g = k.length; g--;)(f = k[g]) && f.destroy && f.destroy();
                b.points = null;
                c.clearTimeout(b.animationTimeout);
                q(b, function(a, b) {
                    a instanceof r && !a.survive && (l = e && "group" === b ? "hide" : "destroy", a[l]())
                });
                d.hoverSeries === b && (d.hoverSeries = null);
                E(d.series, b);
                d.orderSeries();
                q(b, function(d, e) {
                    a && "hcEvents" === e || delete b[e]
                })
            },
            getGraphPath: function(a, b, d) {
                var e = this,
                    c = e.options,
                    h = c.step,
                    l, g = [],
                    k = [],
                    f;
                a = a || e.points;
                (l = a.reversed) && a.reverse();
                (h = {
                    right: 1,
                    center: 2
                }[h] || h && 3) && l && (h = 4 - h);
                !c.connectNulls || b || d || (a = this.getValidPoints(a));
                a.forEach(function(l, r) {
                    var t = l.plotX,
                        n = l.plotY,
                        u = a[r - 1];
                    (l.leftCliff || u && u.rightCliff) && !d && (f = !0);
                    l.isNull && !A(b) && 0 < r ? f = !c.connectNulls : l.isNull && !b ? f = !0 : (0 === r || f ? r = ["M", l.plotX, l.plotY] : e.getPointSpline ? r = e.getPointSpline(a, l, r) : h ? (r = 1 === h ? ["L", u.plotX, n] : 2 === h ? ["L", (u.plotX + t) / 2, u.plotY,
                        "L", (u.plotX + t) / 2, n
                    ] : ["L", t, u.plotY], r.push("L", t, n)) : r = ["L", t, n], k.push(l.x), h && (k.push(l.x), 2 === h && k.push(l.x)), g.push.apply(g, r), f = !1)
                });
                g.xMap = k;
                return e.graphPath = g
            },
            drawGraph: function() {
                var a = this,
                    b = this.options,
                    d = (this.gappedPath || this.getGraphPath).call(this),
                    e = this.chart.styledMode,
                    c = [
                        ["graph", "highcharts-graph"]
                    ];
                e || c[0].push(b.lineColor || this.color || "#cccccc", b.dashStyle);
                c = a.getZonesGraphs(c);
                c.forEach(function(c, h) {
                    var l = c[0],
                        g = a[l],
                        k = g ? "animate" : "attr";
                    g ? (g.endX = a.preventGraphAnimation ?
                        null : d.xMap, g.animate({
                            d: d
                        })) : d.length && (a[l] = g = a.chart.renderer.path(d).addClass(c[1]).attr({
                        zIndex: 1
                    }).add(a.group));
                    g && !e && (l = {
                        stroke: c[2],
                        "stroke-width": b.lineWidth,
                        fill: a.fillGraph && a.color || "none"
                    }, c[3] ? l.dashstyle = c[3] : "square" !== b.linecap && (l["stroke-linecap"] = l["stroke-linejoin"] = "round"), g[k](l).shadow(2 > h && b.shadow));
                    g && (g.startX = d.xMap, g.isArea = d.isArea)
                })
            },
            getZonesGraphs: function(a) {
                this.zones.forEach(function(b, d) {
                    d = ["zone-graph-" + d, "highcharts-graph highcharts-zone-graph-" + d + " " + (b.className ||
                        "")];
                    this.chart.styledMode || d.push(b.color || this.color, b.dashStyle || this.options.dashStyle);
                    a.push(d)
                }, this);
                return a
            },
            applyZones: function() {
                var a = this,
                    b = this.chart,
                    d = b.renderer,
                    e = this.zones,
                    c, h, g = this.clips || [],
                    f, r = this.graph,
                    n = this.area,
                    x = Math.max(b.chartWidth, b.chartHeight),
                    m = this[(this.zoneAxis || "y") + "Axis"],
                    q = b.inverted,
                    w, F, p, y = !1;
                if (e.length && (r || n) && m && void 0 !== m.min) {
                    var v = m.reversed;
                    var A = m.horiz;
                    r && !this.showLine && r.hide();
                    n && n.hide();
                    var G = m.getExtremes();
                    e.forEach(function(e, l) {
                        c = v ? A ?
                            b.plotWidth : 0 : A ? 0 : m.toPixels(G.min) || 0;
                        c = Math.min(Math.max(k(h, c), 0), x);
                        h = Math.min(Math.max(Math.round(m.toPixels(k(e.value, G.max), !0) || 0), 0), x);
                        y && (c = h = m.toPixels(G.max));
                        w = Math.abs(c - h);
                        F = Math.min(c, h);
                        p = Math.max(c, h);
                        m.isXAxis ? (f = {
                            x: q ? p : F,
                            y: 0,
                            width: w,
                            height: x
                        }, A || (f.x = b.plotHeight - f.x)) : (f = {
                            x: 0,
                            y: q ? p : F,
                            width: x,
                            height: w
                        }, A && (f.y = b.plotWidth - f.y));
                        q && d.isVML && (f = m.isXAxis ? {
                            x: 0,
                            y: v ? F : p,
                            height: f.width,
                            width: b.chartWidth
                        } : {
                            x: f.y - b.plotLeft - b.spacingBox.x,
                            y: 0,
                            width: f.height,
                            height: b.chartHeight
                        });
                        g[l] ?
                            g[l].animate(f) : g[l] = d.clipRect(f);
                        r && a["zone-graph-" + l].clip(g[l]);
                        n && a["zone-area-" + l].clip(g[l]);
                        y = e.value > G.max;
                        a.resetZones && 0 === h && (h = void 0)
                    });
                    this.clips = g
                } else a.visible && (r && r.show(!0), n && n.show(!0))
            },
            invertGroups: function(a) {
                function b() {
                    ["group", "markerGroup"].forEach(function(b) {
                        d[b] && (e.renderer.isVML && d[b].attr({
                            width: d.yAxis.len,
                            height: d.xAxis.len
                        }), d[b].width = d.yAxis.len, d[b].height = d.xAxis.len, d[b].invert(a))
                    })
                }
                var d = this,
                    e = d.chart;
                if (d.xAxis) {
                    var c = g(e, "resize", b);
                    g(d, "destroy",
                        c);
                    b(a);
                    d.invertGroups = b
                }
            },
            plotGroup: function(a, b, d, e, c) {
                var h = this[a],
                    l = !h;
                l && (this[a] = h = this.chart.renderer.g().attr({
                    zIndex: e || .1
                }).add(c));
                h.addClass("highcharts-" + b + " highcharts-series-" + this.index + " highcharts-" + this.type + "-series " + (A(this.colorIndex) ? "highcharts-color-" + this.colorIndex + " " : "") + (this.options.className || "") + (h.hasClass("highcharts-tracker") ? " highcharts-tracker" : ""), !0);
                h.attr({
                    visibility: d
                })[l ? "attr" : "animate"](this.getPlotBox());
                return h
            },
            getPlotBox: function() {
                var a = this.chart,
                    b = this.xAxis,
                    d = this.yAxis;
                a.inverted && (b = d, d = this.xAxis);
                return {
                    translateX: b ? b.left : a.plotLeft,
                    translateY: d ? d.top : a.plotTop,
                    scaleX: 1,
                    scaleY: 1
                }
            },
            render: function() {
                var a = this,
                    b = a.chart,
                    d = a.options,
                    c = !!a.animate && b.renderer.isSVG && e(d.animation).duration,
                    g = a.visible ? "inherit" : "hidden",
                    k = d.zIndex,
                    f = a.hasRendered,
                    r = b.seriesGroup,
                    n = b.inverted;
                h(this, "render");
                var x = a.plotGroup("group", "series", g, k, r);
                a.markerGroup = a.plotGroup("markerGroup", "markers", g, k, r);
                c && a.animate(!0);
                x.inverted = a.isCartesian || a.invertable ?
                    n : !1;
                a.drawGraph && (a.drawGraph(), a.applyZones());
                a.visible && a.drawPoints();
                a.drawDataLabels && a.drawDataLabels();
                a.redrawPoints && a.redrawPoints();
                a.drawTracker && !1 !== a.options.enableMouseTracking && a.drawTracker();
                a.invertGroups(n);
                !1 === d.clip || a.sharedClipKey || f || x.clip(b.clipRect);
                c && a.animate();
                f || (a.animationTimeout = w(function() {
                    a.afterAnimate()
                }, c || 0));
                a.isDirty = !1;
                a.hasRendered = !0;
                h(a, "afterRender")
            },
            redraw: function() {
                var a = this.chart,
                    b = this.isDirty || this.isDirtyData,
                    d = this.group,
                    e = this.xAxis,
                    c = this.yAxis;
                d && (a.inverted && d.attr({
                    width: a.plotWidth,
                    height: a.plotHeight
                }), d.animate({
                    translateX: k(e && e.left, a.plotLeft),
                    translateY: k(c && c.top, a.plotTop)
                }));
                this.translate();
                this.render();
                b && delete this.kdTree
            },
            kdAxisArray: ["clientX", "plotY"],
            searchPoint: function(a, b) {
                var d = this.xAxis,
                    e = this.yAxis,
                    c = this.chart.inverted;
                return this.searchKDTree({
                    clientX: c ? d.len - a.chartY + d.pos : a.chartX - d.pos,
                    plotY: c ? e.len - a.chartX + e.pos : a.chartY - e.pos
                }, b, a)
            },
            buildKDTree: function(a) {
                function b(a, e, c) {
                    var h;
                    if (h = a &&
                        a.length) {
                        var l = d.kdAxisArray[e % c];
                        a.sort(function(a, b) {
                            return a[l] - b[l]
                        });
                        h = Math.floor(h / 2);
                        return {
                            point: a[h],
                            left: b(a.slice(0, h), e + 1, c),
                            right: b(a.slice(h + 1), e + 1, c)
                        }
                    }
                }
                this.buildingKdTree = !0;
                var d = this,
                    e = -1 < d.options.findNearestPointBy.indexOf("y") ? 2 : 1;
                delete d.kdTree;
                w(function() {
                    d.kdTree = b(d.getValidPoints(null, !d.directTouch), e, e);
                    d.buildingKdTree = !1
                }, d.options.kdNow || a && "touchstart" === a.type ? 0 : 1)
            },
            searchKDTree: function(a, b, d) {
                function e(a, b, d, k) {
                    var f = b.point,
                        r = c.kdAxisArray[d % k],
                        n = f;
                    var t = A(a[h]) &&
                        A(f[h]) ? Math.pow(a[h] - f[h], 2) : null;
                    var x = A(a[l]) && A(f[l]) ? Math.pow(a[l] - f[l], 2) : null;
                    x = (t || 0) + (x || 0);
                    f.dist = A(x) ? Math.sqrt(x) : Number.MAX_VALUE;
                    f.distX = A(t) ? Math.sqrt(t) : Number.MAX_VALUE;
                    r = a[r] - f[r];
                    x = 0 > r ? "left" : "right";
                    t = 0 > r ? "right" : "left";
                    b[x] && (x = e(a, b[x], d + 1, k), n = x[g] < n[g] ? x : f);
                    b[t] && Math.sqrt(r * r) < n[g] && (a = e(a, b[t], d + 1, k), n = a[g] < n[g] ? a : n);
                    return n
                }
                var c = this,
                    h = this.kdAxisArray[0],
                    l = this.kdAxisArray[1],
                    g = b ? "distX" : "dist";
                b = -1 < c.options.findNearestPointBy.indexOf("y") ? 2 : 1;
                this.kdTree || this.buildingKdTree ||
                    this.buildKDTree(d);
                if (this.kdTree) return e(a, this.kdTree, b, b)
            },
            pointPlacementToXValue: function() {
                var a = this.xAxis,
                    b = this.options.pointPlacement;
                "between" === b && (b = a.reversed ? -.5 : .5);
                G(b) && (b *= k(this.options.pointRange || a.pointRange));
                return b
            }
        });
        ""
    });
    K(C, "parts/Stacking.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.defined,
            D = f.destroyObjectProperties,
            A = f.objectEach,
            E = f.pick;
        f = c.Axis;
        var p = c.Chart,
            y = c.correctFloat,
            G = c.format,
            v = c.Series;
        c.StackItem = function(c, f, m, w, g) {
            var e =
                c.chart.inverted;
            this.axis = c;
            this.isNegative = m;
            this.options = f = f || {};
            this.x = w;
            this.total = null;
            this.points = {};
            this.stack = g;
            this.rightCliff = this.leftCliff = 0;
            this.alignOptions = {
                align: f.align || (e ? m ? "left" : "right" : "center"),
                verticalAlign: f.verticalAlign || (e ? "middle" : m ? "bottom" : "top"),
                y: f.y,
                x: f.x
            };
            this.textAlign = f.textAlign || (e ? m ? "right" : "left" : "center")
        };
        c.StackItem.prototype = {
            destroy: function() {
                D(this, this.axis)
            },
            render: function(c) {
                var f = this.axis.chart,
                    m = this.options,
                    q = m.format;
                q = q ? G(q, this, f.time) : m.formatter.call(this);
                this.label ? this.label.attr({
                    text: q,
                    visibility: "hidden"
                }) : (this.label = f.renderer.label(q, null, null, m.shape, null, null, m.useHTML, !1, "stack-labels"), q = {
                    text: q,
                    align: this.textAlign,
                    rotation: m.rotation,
                    padding: E(m.padding, 0),
                    visibility: "hidden"
                }, this.label.attr(q), f.styledMode || this.label.css(m.style), this.label.added || this.label.add(c));
                this.label.labelrank = f.plotHeight
            },
            setOffset: function(c, f, m, w, g) {
                var e = this.axis,
                    b = e.chart;
                w = e.translate(e.usePercentage ? 100 : w ? w : this.total, 0, 0, 0, 1);
                m = e.translate(m ? m :
                    0);
                m = H(w) && Math.abs(w - m);
                c = E(g, b.xAxis[0].translate(this.x)) + c;
                e = H(w) && this.getStackBox(b, this, c, w, f, m, e);
                f = this.label;
                c = this.isNegative;
                g = "justify" === E(this.options.overflow, "justify");
                if (f && e) {
                    m = f.getBBox();
                    var d = b.inverted ? c ? m.width : 0 : m.width / 2,
                        a = b.inverted ? m.height / 2 : c ? -4 : m.height + 4;
                    this.alignOptions.x = E(this.options.x, 0);
                    f.align(this.alignOptions, null, e);
                    w = f.alignAttr;
                    f.show();
                    w.y -= a;
                    g && (w.x -= d, v.prototype.justifyDataLabel.call(this.axis, f, this.alignOptions, w, m, e), w.x += d);
                    w.x = f.alignAttr.x;
                    f.attr({
                        x: w.x,
                        y: w.y
                    });
                    E(!g && this.options.crop, !0) && ((b = b.isInsidePlot(f.x + (b.inverted ? 0 : -m.width / 2), f.y) && b.isInsidePlot(f.x + (b.inverted ? c ? -m.width : m.width : m.width / 2), f.y + m.height)) || f.hide())
                }
            },
            getStackBox: function(c, f, m, w, g, e, b) {
                var d = f.axis.reversed,
                    a = c.inverted;
                c = b.height + b.pos - (a ? c.plotLeft : c.plotTop);
                f = f.isNegative && !d || !f.isNegative && d;
                return {
                    x: a ? f ? w : w - e : m,
                    y: a ? c - m - g : f ? c - w - e : c - w,
                    width: a ? e : g,
                    height: a ? g : e
                }
            }
        };
        p.prototype.getStacks = function() {
            var c = this,
                f = c.inverted;
            c.yAxis.forEach(function(c) {
                c.stacks && c.hasVisibleSeries &&
                    (c.oldStacks = c.stacks)
            });
            c.series.forEach(function(k) {
                var m = k.xAxis && k.xAxis.options || {};
                !k.options.stacking || !0 !== k.visible && !1 !== c.options.chart.ignoreHiddenSeries || (k.stackKey = [k.type, E(k.options.stack, ""), f ? m.top : m.left, f ? m.height : m.width].join())
            })
        };
        f.prototype.buildStacks = function() {
            var c = this.series,
                f = E(this.options.reversedStacks, !0),
                m = c.length,
                w;
            if (!this.isXAxis) {
                this.usePercentage = !1;
                for (w = m; w--;) c[f ? w : m - w - 1].setStackedPoints();
                for (w = 0; w < m; w++) c[w].modifyStacks()
            }
        };
        f.prototype.renderStackTotals =
            function() {
                var c = this.chart,
                    f = c.renderer,
                    m = this.stacks,
                    w = this.stackTotalGroup;
                w || (this.stackTotalGroup = w = f.g("stack-labels").attr({
                    visibility: "visible",
                    zIndex: 6
                }).add());
                w.translate(c.plotLeft, c.plotTop);
                A(m, function(c) {
                    A(c, function(e) {
                        e.render(w)
                    })
                })
            };
        f.prototype.resetStacks = function() {
            var c = this,
                f = c.stacks;
            c.isXAxis || A(f, function(f) {
                A(f, function(k, g) {
                    k.touched < c.stacksTouched ? (k.destroy(), delete f[g]) : (k.total = null, k.cumulative = null)
                })
            })
        };
        f.prototype.cleanStacks = function() {
            if (!this.isXAxis) {
                if (this.oldStacks) var c =
                    this.stacks = this.oldStacks;
                A(c, function(c) {
                    A(c, function(c) {
                        c.cumulative = c.total
                    })
                })
            }
        };
        v.prototype.setStackedPoints = function() {
            if (this.options.stacking && (!0 === this.visible || !1 === this.chart.options.chart.ignoreHiddenSeries)) {
                var f = this.processedXData,
                    k = this.processedYData,
                    m = [],
                    w = k.length,
                    g = this.options,
                    e = g.threshold,
                    b = E(g.startFromThreshold && e, 0),
                    d = g.stack;
                g = g.stacking;
                var a = this.stackKey,
                    h = "-" + a,
                    n = this.negStacks,
                    F = this.yAxis,
                    r = F.stacks,
                    x = F.oldStacks,
                    l, t;
                F.stacksTouched += 1;
                for (t = 0; t < w; t++) {
                    var B = f[t];
                    var I = k[t];
                    var z = this.getStackIndicator(z, B, this.index);
                    var u = z.key;
                    var p = (l = n && I < (b ? 0 : e)) ? h : a;
                    r[p] || (r[p] = {});
                    r[p][B] || (x[p] && x[p][B] ? (r[p][B] = x[p][B], r[p][B].total = null) : r[p][B] = new c.StackItem(F, F.options.stackLabels, l, B, d));
                    p = r[p][B];
                    null !== I ? (p.points[u] = p.points[this.index] = [E(p.cumulative, b)], H(p.cumulative) || (p.base = u), p.touched = F.stacksTouched, 0 < z.index && !1 === this.singleStacks && (p.points[u][0] = p.points[this.index + "," + B + ",0"][0])) : p.points[u] = p.points[this.index] = null;
                    "percent" === g ? (l = l ? a :
                        h, n && r[l] && r[l][B] ? (l = r[l][B], p.total = l.total = Math.max(l.total, p.total) + Math.abs(I) || 0) : p.total = y(p.total + (Math.abs(I) || 0))) : p.total = y(p.total + (I || 0));
                    p.cumulative = E(p.cumulative, b) + (I || 0);
                    null !== I && (p.points[u].push(p.cumulative), m[t] = p.cumulative)
                }
                "percent" === g && (F.usePercentage = !0);
                this.stackedYData = m;
                F.oldStacks = {}
            }
        };
        v.prototype.modifyStacks = function() {
            var c = this,
                f = c.stackKey,
                m = c.yAxis.stacks,
                p = c.processedXData,
                g, e = c.options.stacking;
            c[e + "Stacker"] && [f, "-" + f].forEach(function(b) {
                for (var d = p.length,
                        a, h; d--;)
                    if (a = p[d], g = c.getStackIndicator(g, a, c.index, b), h = (a = m[b] && m[b][a]) && a.points[g.key]) c[e + "Stacker"](h, a, d)
            })
        };
        v.prototype.percentStacker = function(c, f, m) {
            f = f.total ? 100 / f.total : 0;
            c[0] = y(c[0] * f);
            c[1] = y(c[1] * f);
            this.stackedYData[m] = c[1]
        };
        v.prototype.getStackIndicator = function(c, f, m, p) {
            !H(c) || c.x !== f || p && c.key !== p ? c = {
                x: f,
                index: 0,
                key: p
            } : c.index++;
            c.key = [m, f, c.index].join();
            return c
        }
    });
    K(C, "parts/Dynamics.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.defined,
            D = f.erase,
            A = f.extend,
            E = f.isArray,
            p = f.isNumber,
            y = f.isObject,
            G = f.isString,
            v = f.objectEach,
            q = f.pick,
            k = f.setAnimation,
            m = f.splat,
            w = c.addEvent,
            g = c.animate,
            e = c.Axis;
        f = c.Chart;
        var b = c.createElement,
            d = c.css,
            a = c.fireEvent,
            h = c.merge,
            n = c.Point,
            F = c.Series,
            r = c.seriesTypes;
        c.cleanRecursively = function(a, b) {
            var d = {};
            v(a, function(e, h) {
                if (y(a[h], !0) && !a.nodeType && b[h]) e = c.cleanRecursively(a[h], b[h]), Object.keys(e).length && (d[h] = e);
                else if (y(a[h]) || a[h] !== b[h]) d[h] = a[h]
            });
            return d
        };
        A(f.prototype, {
            addSeries: function(b, d, e) {
                var c,
                    h = this;
                b && (d = q(d, !0), a(h, "addSeries", {
                    options: b
                }, function() {
                    c = h.initSeries(b);
                    h.isDirtyLegend = !0;
                    h.linkSeries();
                    a(h, "afterAddSeries", {
                        series: c
                    });
                    d && h.redraw(e)
                }));
                return c
            },
            addAxis: function(a, b, d, e) {
                return this.createAxis(b ? "xAxis" : "yAxis", {
                    axis: a,
                    redraw: d,
                    animation: e
                })
            },
            addColorAxis: function(a, b, d) {
                return this.createAxis("colorAxis", {
                    axis: a,
                    redraw: b,
                    animation: d
                })
            },
            createAxis: function(a, b) {
                var d = this.options,
                    f = "colorAxis" === a,
                    g = b.redraw,
                    l = b.animation;
                b = h(b.axis, {
                    index: this[a].length,
                    isX: "xAxis" ===
                        a
                });
                var k = f ? new c.ColorAxis(this, b) : new e(this, b);
                d[a] = m(d[a] || {});
                d[a].push(b);
                f && (this.isDirtyLegend = !0, this.axes.forEach(function(a) {
                    a.series = []
                }), this.series.forEach(function(a) {
                    a.bindAxes();
                    a.isDirtyData = !0
                }));
                q(g, !0) && this.redraw(l);
                return k
            },
            showLoading: function(a) {
                var e = this,
                    c = e.options,
                    h = e.loadingDiv,
                    f = c.loading,
                    k = function() {
                        h && d(h, {
                            left: e.plotLeft + "px",
                            top: e.plotTop + "px",
                            width: e.plotWidth + "px",
                            height: e.plotHeight + "px"
                        })
                    };
                h || (e.loadingDiv = h = b("div", {
                        className: "highcharts-loading highcharts-loading-hidden"
                    },
                    null, e.container), e.loadingSpan = b("span", {
                    className: "highcharts-loading-inner"
                }, null, h), w(e, "redraw", k));
                h.className = "highcharts-loading";
                e.loadingSpan.innerHTML = q(a, c.lang.loading, "");
                e.styledMode || (d(h, A(f.style, {
                    zIndex: 10
                })), d(e.loadingSpan, f.labelStyle), e.loadingShown || (d(h, {
                    opacity: 0,
                    display: ""
                }), g(h, {
                    opacity: f.style.opacity || .5
                }, {
                    duration: f.showDuration || 0
                })));
                e.loadingShown = !0;
                k()
            },
            hideLoading: function() {
                var a = this.options,
                    b = this.loadingDiv;
                b && (b.className = "highcharts-loading highcharts-loading-hidden",
                    this.styledMode || g(b, {
                        opacity: 0
                    }, {
                        duration: a.loading.hideDuration || 100,
                        complete: function() {
                            d(b, {
                                display: "none"
                            })
                        }
                    }));
                this.loadingShown = !1
            },
            propsRequireDirtyBox: "backgroundColor borderColor borderWidth borderRadius plotBackgroundColor plotBackgroundImage plotBorderColor plotBorderWidth plotShadow shadow".split(" "),
            propsRequireReflow: "margin marginTop marginRight marginBottom marginLeft spacing spacingTop spacingRight spacingBottom spacingLeft".split(" "),
            propsRequireUpdateSeries: "chart.inverted chart.polar chart.ignoreHiddenSeries chart.type colors plotOptions time tooltip".split(" "),
            collectionsWithUpdate: "xAxis yAxis zAxis colorAxis series pane".split(" "),
            update: function(b, d, e, f) {
                var g = this,
                    l = {
                        credits: "addCredits",
                        title: "setTitle",
                        subtitle: "setSubtitle",
                        caption: "setCaption"
                    },
                    k, r, n, t = b.isResponsiveOptions,
                    x = [];
                a(g, "update", {
                    options: b
                });
                t || g.setResponsive(!1, !0);
                b = c.cleanRecursively(b, g.options);
                h(!0, g.userOptions, b);
                if (k = b.chart) {
                    h(!0, g.options.chart, k);
                    "className" in k && g.setClassName(k.className);
                    "reflow" in k && g.setReflow(k.reflow);
                    if ("inverted" in k || "polar" in k || "type" in k) {
                        g.propFromSeries();
                        var F = !0
                    }
                    "alignTicks" in k && (F = !0);
                    v(k, function(a, b) {
                        -1 !== g.propsRequireUpdateSeries.indexOf("chart." + b) && (r = !0); - 1 !== g.propsRequireDirtyBox.indexOf(b) && (g.isDirtyBox = !0);
                        t || -1 === g.propsRequireReflow.indexOf(b) || (n = !0)
                    });
                    !g.styledMode && "style" in k && g.renderer.setStyle(k.style)
                }!g.styledMode && b.colors && (this.options.colors = b.colors);
                b.plotOptions && h(!0, this.options.plotOptions, b.plotOptions);
                b.time && this.time === c.time && (this.time = new c.Time(b.time));
                v(b, function(a, b) {
                    if (g[b] && "function" === typeof g[b].update) g[b].update(a, !1);
                    else if ("function" === typeof g[l[b]]) g[l[b]](a);
                    "chart" !== b && -1 !== g.propsRequireUpdateSeries.indexOf(b) && (r = !0)
                });
                this.collectionsWithUpdate.forEach(function(a) {
                    if (b[a]) {
                        if ("series" === a) {
                            var d = [];
                            g[a].forEach(function(a, b) {
                                a.options.isInternal || d.push(q(a.options.index, b))
                            })
                        }
                        m(b[a]).forEach(function(b, c) {
                            (c = H(b.id) && g.get(b.id) || g[a][d ? d[c] : c]) && c.coll === a && (c.update(b, !1), e && (c.touched = !0));
                            !c && e && g.collectionsWithInit[a] && (g.collectionsWithInit[a][0].apply(g, [b].concat(g.collectionsWithInit[a][1] || []).concat([!1])).touched = !0)
                        });
                        e && g[a].forEach(function(a) {
                            a.touched || a.options.isInternal ? delete a.touched : x.push(a)
                        })
                    }
                });
                x.forEach(function(a) {
                    a.remove && a.remove(!1)
                });
                F && g.axes.forEach(function(a) {
                    a.update({}, !1)
                });
                r && g.series.forEach(function(a) {
                    a.update({}, !1)
                });
                b.loading && h(!0, g.options.loading, b.loading);
                F = k && k.width;
                k = k && k.height;
                G(k) && (k = c.relativeLength(k, F || g.chartWidth));
                n || p(F) && F !== g.chartWidth || p(k) && k !== g.chartHeight ? g.setSize(F, k, f) : q(d, !0) && g.redraw(f);
                a(g, "afterUpdate", {
                    options: b,
                    redraw: d,
                    animation: f
                })
            },
            setSubtitle: function(a, b) {
                this.applyDescription("subtitle", a);
                this.layOutTitles(b)
            },
            setCaption: function(a, b) {
                this.applyDescription("caption", a);
                this.layOutTitles(b)
            }
        });
        f.prototype.collectionsWithInit = {
            xAxis: [f.prototype.addAxis, [!0]],
            yAxis: [f.prototype.addAxis, [!1]],
            colorAxis: [f.prototype.addColorAxis, [!1]],
            series: [f.prototype.addSeries]
        };
        A(n.prototype, {
            update: function(a, b, d, e) {
                function c() {
                    h.applyOptions(a);
                    null === h.y && f && (h.graphic = f.destroy());
                    y(a, !0) && (f && f.element && a &&
                        a.marker && void 0 !== a.marker.symbol && (h.graphic = f.destroy()), a && a.dataLabels && h.dataLabel && (h.dataLabel = h.dataLabel.destroy()), h.connector && (h.connector = h.connector.destroy()));
                    l = h.index;
                    g.updateParallelArrays(h, l);
                    r.data[l] = y(r.data[l], !0) || y(a, !0) ? h.options : q(a, r.data[l]);
                    g.isDirty = g.isDirtyData = !0;
                    !g.fixedBox && g.hasCartesianSeries && (k.isDirtyBox = !0);
                    "point" === r.legendType && (k.isDirtyLegend = !0);
                    b && k.redraw(d)
                }
                var h = this,
                    g = h.series,
                    f = h.graphic,
                    l, k = g.chart,
                    r = g.options;
                b = q(b, !0);
                !1 === e ? c() : h.firePointEvent("update", {
                    options: a
                }, c)
            },
            remove: function(a, b) {
                this.series.removePoint(this.series.data.indexOf(this), a, b)
            }
        });
        A(F.prototype, {
            addPoint: function(b, d, e, c, h) {
                var g = this.options,
                    f = this.data,
                    l = this.chart,
                    k = this.xAxis;
                k = k && k.hasNames && k.names;
                var r = g.data,
                    n = this.xData,
                    t;
                d = q(d, !0);
                var x = {
                    series: this
                };
                this.pointClass.prototype.applyOptions.apply(x, [b]);
                var m = x.x;
                var F = n.length;
                if (this.requireSorting && m < n[F - 1])
                    for (t = !0; F && n[F - 1] > m;) F--;
                this.updateParallelArrays(x, "splice", F, 0, 0);
                this.updateParallelArrays(x, F);
                k && x.name &&
                    (k[m] = x.name);
                r.splice(F, 0, b);
                t && (this.data.splice(F, 0, null), this.processData());
                "point" === g.legendType && this.generatePoints();
                e && (f[0] && f[0].remove ? f[0].remove(!1) : (f.shift(), this.updateParallelArrays(x, "shift"), r.shift()));
                !1 !== h && a(this, "addPoint", {
                    point: x
                });
                this.isDirtyData = this.isDirty = !0;
                d && l.redraw(c)
            },
            removePoint: function(a, b, d) {
                var e = this,
                    c = e.data,
                    h = c[a],
                    g = e.points,
                    f = e.chart,
                    l = function() {
                        g && g.length === c.length && g.splice(a, 1);
                        c.splice(a, 1);
                        e.options.data.splice(a, 1);
                        e.updateParallelArrays(h || {
                            series: e
                        }, "splice", a, 1);
                        h && h.destroy();
                        e.isDirty = !0;
                        e.isDirtyData = !0;
                        b && f.redraw()
                    };
                k(d, f);
                b = q(b, !0);
                h ? h.firePointEvent("remove", null, l) : l()
            },
            remove: function(b, d, e, c) {
                function h() {
                    g.destroy(c);
                    g.remove = null;
                    f.isDirtyLegend = f.isDirtyBox = !0;
                    f.linkSeries();
                    q(b, !0) && f.redraw(d)
                }
                var g = this,
                    f = g.chart;
                !1 !== e ? a(g, "remove", null, h) : h()
            },
            update: function(b, d) {
                b = c.cleanRecursively(b, this.userOptions);
                a(this, "update", {
                    options: b
                });
                var e = this,
                    g = e.chart,
                    f = e.userOptions,
                    l = e.initialType || e.type,
                    k = b.type || f.type || g.options.chart.type,
                    n = !(this.hasDerivedData || b.dataGrouping || k && k !== this.type || void 0 !== b.pointStart || b.pointInterval || b.pointIntervalUnit || b.keys),
                    m = r[l].prototype,
                    x, F = ["group", "markerGroup", "dataLabelsGroup", "transformGroup"],
                    p = ["eventOptions", "navigatorSeries", "baseSeries"],
                    w = e.finishedAnimating && {
                        animation: !1
                    },
                    y = {};
                n && (p.push("data", "isDirtyData", "points", "processedXData", "processedYData", "xIncrement", "_hasPointMarkers", "_hasPointLabels", "mapMap", "mapData", "minY", "maxY", "minX", "maxX"), !1 !== b.visible && p.push("area",
                    "graph"), e.parallelArrays.forEach(function(a) {
                    p.push(a + "Data")
                }), b.data && this.setData(b.data, !1));
                b = h(f, w, {
                    index: void 0 === f.index ? e.index : f.index,
                    pointStart: q(f.pointStart, e.xData[0])
                }, !n && {
                    data: e.options.data
                }, b);
                n && b.data && (b.data = e.options.data);
                p = F.concat(p);
                p.forEach(function(a) {
                    p[a] = e[a];
                    delete e[a]
                });
                e.remove(!1, null, !1, !0);
                for (x in m) e[x] = void 0;
                r[k || l] ? A(e, r[k || l].prototype) : c.error(17, !0, g, {
                    missingModuleFor: k || l
                });
                p.forEach(function(a) {
                    e[a] = p[a]
                });
                e.init(g, b);
                if (n && this.points) {
                    var v = e.options;
                    !1 === v.visible ? (y.graphic = 1, y.dataLabel = 1) : e._hasPointLabels || (k = v.marker, m = v.dataLabels, k && (!1 === k.enabled || "symbol" in k) && (y.graphic = 1), m && !1 === m.enabled && (y.dataLabel = 1));
                    this.points.forEach(function(a) {
                        a && a.series && (a.resolveColor(), Object.keys(y).length && a.destroyElements(y), !1 === v.showInLegend && a.legendItem && g.legend.destroyItem(a))
                    }, this)
                }
                b.zIndex !== f.zIndex && F.forEach(function(a) {
                    e[a] && e[a].attr({
                        zIndex: b.zIndex
                    })
                });
                e.initialType = l;
                g.linkSeries();
                a(this, "afterUpdate");
                q(d, !0) && g.redraw(n ?
                    void 0 : !1)
            },
            setName: function(a) {
                this.name = this.options.name = this.userOptions.name = a;
                this.chart.isDirtyLegend = !0
            }
        });
        A(e.prototype, {
            update: function(a, b) {
                var d = this.chart,
                    e = a && a.events || {};
                a = h(this.userOptions, a);
                d.options[this.coll].indexOf && (d.options[this.coll][d.options[this.coll].indexOf(this.userOptions)] = a);
                v(d.options[this.coll].events, function(a, b) {
                    "undefined" === typeof e[b] && (e[b] = void 0)
                });
                this.destroy(!0);
                this.init(d, A(a, {
                    events: e
                }));
                d.isDirtyBox = !0;
                q(b, !0) && d.redraw()
            },
            remove: function(a) {
                for (var b =
                        this.chart, d = this.coll, e = this.series, c = e.length; c--;) e[c] && e[c].remove(!1);
                D(b.axes, this);
                D(b[d], this);
                E(b.options[d]) ? b.options[d].splice(this.options.index, 1) : delete b.options[d];
                b[d].forEach(function(a, b) {
                    a.options.index = a.userOptions.index = b
                });
                this.destroy();
                b.isDirtyBox = !0;
                q(a, !0) && b.redraw()
            },
            setTitle: function(a, b) {
                this.update({
                    title: a
                }, b)
            },
            setCategories: function(a, b) {
                this.update({
                    categories: a
                }, b)
            }
        })
    });
    K(C, "parts/AreaSeries.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H =
            f.objectEach,
            D = f.pick,
            A = c.color,
            E = c.Series;
        f = c.seriesType;
        f("area", "line", {
            softThreshold: !1,
            threshold: 0
        }, {
            singleStacks: !1,
            getStackPoints: function(c) {
                var f = [],
                    p = [],
                    v = this.xAxis,
                    q = this.yAxis,
                    k = q.stacks[this.stackKey],
                    m = {},
                    w = this.index,
                    g = q.series,
                    e = g.length,
                    b = D(q.options.reversedStacks, !0) ? 1 : -1,
                    d;
                c = c || this.points;
                if (this.options.stacking) {
                    for (d = 0; d < c.length; d++) c[d].leftNull = c[d].rightNull = void 0, m[c[d].x] = c[d];
                    H(k, function(a, b) {
                        null !== a.total && p.push(b)
                    });
                    p.sort(function(a, b) {
                        return a - b
                    });
                    var a = g.map(function(a) {
                        return a.visible
                    });
                    p.forEach(function(c, g) {
                        var h = 0,
                            r, n;
                        if (m[c] && !m[c].isNull) f.push(m[c]), [-1, 1].forEach(function(h) {
                            var f = 1 === h ? "rightNull" : "leftNull",
                                l = 0,
                                x = k[p[g + h]];
                            if (x)
                                for (d = w; 0 <= d && d < e;) r = x.points[d], r || (d === w ? m[c][f] = !0 : a[d] && (n = k[c].points[d]) && (l -= n[1] - n[0])), d += b;
                            m[c][1 === h ? "rightCliff" : "leftCliff"] = l
                        });
                        else {
                            for (d = w; 0 <= d && d < e;) {
                                if (r = k[c].points[d]) {
                                    h = r[1];
                                    break
                                }
                                d += b
                            }
                            h = q.translate(h, 0, 1, 0, 1);
                            f.push({
                                isNull: !0,
                                plotX: v.translate(c, 0, 0, 0, 1),
                                x: c,
                                plotY: h,
                                yBottom: h
                            })
                        }
                    })
                }
                return f
            },
            getGraphPath: function(c) {
                var f = E.prototype.getGraphPath,
                    p = this.options,
                    v = p.stacking,
                    q = this.yAxis,
                    k, m = [],
                    w = [],
                    g = this.index,
                    e = q.stacks[this.stackKey],
                    b = p.threshold,
                    d = Math.round(q.getThreshold(p.threshold));
                p = D(p.connectNulls, "percent" === v);
                var a = function(a, h, f) {
                    var k = c[a];
                    a = v && e[k.x].points[g];
                    var l = k[f + "Null"] || 0;
                    f = k[f + "Cliff"] || 0;
                    k = !0;
                    if (f || l) {
                        var r = (l ? a[0] : a[1]) + f;
                        var x = a[0] + f;
                        k = !!l
                    } else !v && c[h] && c[h].isNull && (r = x = b);
                    void 0 !== r && (w.push({
                        plotX: n,
                        plotY: null === r ? d : q.getThreshold(r),
                        isNull: k,
                        isCliff: !0
                    }), m.push({
                        plotX: n,
                        plotY: null === x ? d : q.getThreshold(x),
                        doCurve: !1
                    }))
                };
                c = c || this.points;
                v && (c = this.getStackPoints(c));
                for (k = 0; k < c.length; k++) {
                    v || (c[k].leftCliff = c[k].rightCliff = c[k].leftNull = c[k].rightNull = void 0);
                    var h = c[k].isNull;
                    var n = D(c[k].rectPlotX, c[k].plotX);
                    var F = D(c[k].yBottom, d);
                    if (!h || p) p || a(k, k - 1, "left"), h && !v && p || (w.push(c[k]), m.push({
                        x: k,
                        plotX: n,
                        plotY: F
                    })), p || a(k, k + 1, "right")
                }
                k = f.call(this, w, !0, !0);
                m.reversed = !0;
                h = f.call(this, m, !0, !0);
                h.length && (h[0] = "L");
                h = k.concat(h);
                f = f.call(this, w, !1, p);
                h.xMap = k.xMap;
                this.areaPath = h;
                return f
            },
            drawGraph: function() {
                this.areaPath = [];
                E.prototype.drawGraph.apply(this);
                var c = this,
                    f = this.areaPath,
                    G = this.options,
                    v = [
                        ["area", "highcharts-area", this.color, G.fillColor]
                    ];
                this.zones.forEach(function(f, k) {
                    v.push(["zone-area-" + k, "highcharts-area highcharts-zone-area-" + k + " " + f.className, f.color || c.color, f.fillColor || G.fillColor])
                });
                v.forEach(function(q) {
                    var k = q[0],
                        m = c[k],
                        p = m ? "animate" : "attr",
                        g = {};
                    m ? (m.endX = c.preventGraphAnimation ? null : f.xMap, m.animate({
                        d: f
                    })) : (g.zIndex = 0, m = c[k] = c.chart.renderer.path(f).addClass(q[1]).add(c.group), m.isArea = !0);
                    c.chart.styledMode || (g.fill = D(q[3], A(q[2]).setOpacity(D(G.fillOpacity, .75)).get()));
                    m[p](g);
                    m.startX = f.xMap;
                    m.shiftUnit = G.step ? 2 : 1
                })
            },
            drawLegendSymbol: c.LegendSymbolMixin.drawRectangle
        });
        ""
    });
    K(C, "parts/SplineSeries.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.pick;
        c = c.seriesType;
        c("spline", "line", {}, {
            getPointSpline: function(c, f, E) {
                var p = f.plotX,
                    y = f.plotY,
                    A = c[E - 1];
                E = c[E + 1];
                if (A && !A.isNull && !1 !== A.doCurve && !f.isCliff && E && !E.isNull && !1 !== E.doCurve && !f.isCliff) {
                    c = A.plotY;
                    var v = E.plotX;
                    E = E.plotY;
                    var q = 0;
                    var k = (1.5 * p + A.plotX) / 2.5;
                    var m = (1.5 * y + c) / 2.5;
                    v = (1.5 * p + v) / 2.5;
                    var w = (1.5 * y + E) / 2.5;
                    v !== k && (q = (w - m) * (v - p) / (v - k) + y - w);
                    m += q;
                    w += q;
                    m > c && m > y ? (m = Math.max(c, y), w = 2 * y - m) : m < c && m < y && (m = Math.min(c, y), w = 2 * y - m);
                    w > E && w > y ? (w = Math.max(E, y), m = 2 * y - w) : w < E && w < y && (w = Math.min(E, y), m = 2 * y - w);
                    f.rightContX = v;
                    f.rightContY = w
                }
                f = ["C", H(A.rightContX, A.plotX), H(A.rightContY, A.plotY), H(k, p), H(m, y), p, y];
                A.rightContX = A.rightContY = null;
                return f
            }
        });
        ""
    });
    K(C, "parts/AreaSplineSeries.js", [C["parts/Globals.js"]],
        function(c) {
            var f = c.seriesTypes.area.prototype,
                H = c.seriesType;
            H("areaspline", "spline", c.defaultPlotOptions.area, {
                getStackPoints: f.getStackPoints,
                getGraphPath: f.getGraphPath,
                drawGraph: f.drawGraph,
                drawLegendSymbol: c.LegendSymbolMixin.drawRectangle
            });
            ""
        });
    K(C, "parts/ColumnSeries.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.defined,
            D = f.extend,
            A = f.isNumber,
            E = f.pick,
            p = c.animObject,
            y = c.color,
            G = c.merge,
            v = c.Series;
        f = c.seriesType;
        var q = c.svg;
        f("column", "line", {
            borderRadius: 0,
            crisp: !0,
            groupPadding: .2,
            marker: null,
            pointPadding: .1,
            minPointLength: 0,
            cropThreshold: 50,
            pointRange: null,
            states: {
                hover: {
                    halo: !1,
                    brightness: .1
                },
                select: {
                    color: "#cccccc",
                    borderColor: "#000000"
                }
            },
            dataLabels: {
                align: null,
                verticalAlign: null,
                y: null
            },
            softThreshold: !1,
            startFromThreshold: !0,
            stickyTracking: !1,
            tooltip: {
                distance: 6
            },
            threshold: 0,
            borderColor: "#ffffff"
        }, {
            cropShoulder: 0,
            directTouch: !0,
            trackerGroups: ["group", "dataLabelsGroup"],
            negStacks: !0,
            init: function() {
                v.prototype.init.apply(this, arguments);
                var c = this,
                    f = c.chart;
                f.hasRendered && f.series.forEach(function(f) {
                    f.type === c.type && (f.isDirty = !0)
                })
            },
            getColumnMetrics: function() {
                var c = this,
                    f = c.options,
                    q = c.xAxis,
                    g = c.yAxis,
                    e = q.options.reversedStacks;
                e = q.reversed && !e || !q.reversed && e;
                var b, d = {},
                    a = 0;
                !1 === f.grouping ? a = 1 : c.chart.series.forEach(function(e) {
                    var h = e.yAxis,
                        f = e.options;
                    if (e.type === c.type && (e.visible || !c.chart.options.chart.ignoreHiddenSeries) && g.len === h.len && g.pos === h.pos) {
                        if (f.stacking) {
                            b = e.stackKey;
                            void 0 === d[b] && (d[b] = a++);
                            var k = d[b]
                        } else !1 !== f.grouping && (k =
                            a++);
                        e.columnIndex = k
                    }
                });
                var h = Math.min(Math.abs(q.transA) * (q.ordinalSlope || f.pointRange || q.closestPointRange || q.tickInterval || 1), q.len),
                    n = h * f.groupPadding,
                    F = (h - 2 * n) / (a || 1);
                f = Math.min(f.maxPointWidth || q.len, E(f.pointWidth, F * (1 - 2 * f.pointPadding)));
                c.columnMetrics = {
                    width: f,
                    offset: (F - f) / 2 + (n + ((c.columnIndex || 0) + (e ? 1 : 0)) * F - h / 2) * (e ? -1 : 1)
                };
                return c.columnMetrics
            },
            crispCol: function(c, f, q, g) {
                var e = this.chart,
                    b = this.borderWidth,
                    d = -(b % 2 ? .5 : 0);
                b = b % 2 ? .5 : 1;
                e.inverted && e.renderer.isVML && (b += 1);
                this.options.crisp &&
                    (q = Math.round(c + q) + d, c = Math.round(c) + d, q -= c);
                g = Math.round(f + g) + b;
                d = .5 >= Math.abs(f) && .5 < g;
                f = Math.round(f) + b;
                g -= f;
                d && g && (--f, g += 1);
                return {
                    x: c,
                    y: f,
                    width: q,
                    height: g
                }
            },
            translate: function() {
                var c = this,
                    f = c.chart,
                    q = c.options,
                    g = c.dense = 2 > c.closestPointRange * c.xAxis.transA;
                g = c.borderWidth = E(q.borderWidth, g ? 0 : 1);
                var e = c.yAxis,
                    b = q.threshold,
                    d = c.translatedThreshold = e.getThreshold(b),
                    a = E(q.minPointLength, 5),
                    h = c.getColumnMetrics(),
                    n = h.width,
                    F = c.barW = Math.max(n, 1 + 2 * g),
                    r = c.pointXOffset = h.offset,
                    x = c.dataMin,
                    l = c.dataMax;
                f.inverted && (d -= .5);
                q.pointPadding && (F = Math.ceil(F));
                v.prototype.translate.apply(c);
                c.points.forEach(function(h) {
                    var g = E(h.yBottom, d),
                        k = 999 + Math.abs(g),
                        t = n;
                    k = Math.min(Math.max(-k, h.plotY), e.len + k);
                    var m = h.plotX + r,
                        q = F,
                        p = Math.min(k, g),
                        w = Math.max(k, g) - p;
                    if (a && Math.abs(w) < a) {
                        w = a;
                        var v = !e.reversed && !h.negative || e.reversed && h.negative;
                        h.y === b && c.dataMax <= b && e.min < b && x !== l && (v = !v);
                        p = Math.abs(p - d) > a ? g - a : d - (v ? a : 0)
                    }
                    H(h.options.pointWidth) && (t = q = Math.ceil(h.options.pointWidth), m -= Math.round((t - n) / 2));
                    h.barX =
                        m;
                    h.pointWidth = t;
                    h.tooltipPos = f.inverted ? [e.len + e.pos - f.plotLeft - k, c.xAxis.len - m - q / 2, w] : [m + q / 2, k + e.pos - f.plotTop, w];
                    h.shapeType = c.pointClass.prototype.shapeType || "rect";
                    h.shapeArgs = c.crispCol.apply(c, h.isNull ? [m, d, q, 0] : [m, p, q, w])
                })
            },
            getSymbol: c.noop,
            drawLegendSymbol: c.LegendSymbolMixin.drawRectangle,
            drawGraph: function() {
                this.group[this.dense ? "addClass" : "removeClass"]("highcharts-dense-data")
            },
            pointAttribs: function(c, f) {
                var k = this.options,
                    g = this.pointAttrToOptions || {};
                var e = g.stroke || "borderColor";
                var b = g["stroke-width"] || "borderWidth",
                    d = c && c.color || this.color,
                    a = c && c[e] || k[e] || this.color || d,
                    h = c && c[b] || k[b] || this[b] || 0;
                g = c && c.options.dashStyle || k.dashStyle;
                var n = E(k.opacity, 1);
                if (c && this.zones.length) {
                    var m = c.getZone();
                    d = c.options.color || m && (m.color || c.nonZonedColor) || this.color;
                    m && (a = m.borderColor || a, g = m.dashStyle || g, h = m.borderWidth || h)
                }
                f && (c = G(k.states[f], c.options.states && c.options.states[f] || {}), f = c.brightness, d = c.color || void 0 !== f && y(d).brighten(c.brightness).get() || d, a = c[e] || a, h = c[b] ||
                    h, g = c.dashStyle || g, n = E(c.opacity, n));
                e = {
                    fill: d,
                    stroke: a,
                    "stroke-width": h,
                    opacity: n
                };
                g && (e.dashstyle = g);
                return e
            },
            drawPoints: function() {
                var c = this,
                    f = this.chart,
                    q = c.options,
                    g = f.renderer,
                    e = q.animationLimit || 250,
                    b;
                c.points.forEach(function(d) {
                    var a = d.graphic,
                        h = a && f.pointCount < e ? "animate" : "attr";
                    if (A(d.plotY) && null !== d.y) {
                        b = d.shapeArgs;
                        a && d.hasNewShapeType() && (a = a.destroy());
                        if (a) a[h](G(b));
                        else d.graphic = a = g[d.shapeType](b).add(d.group || c.group);
                        if (q.borderRadius) a[h]({
                            r: q.borderRadius
                        });
                        f.styledMode ||
                            a[h](c.pointAttribs(d, d.selected && "select")).shadow(!1 !== d.allowShadow && q.shadow, null, q.stacking && !q.borderRadius);
                        a.addClass(d.getClassName(), !0)
                    } else a && (d.graphic = a.destroy())
                })
            },
            animate: function(c) {
                var f = this,
                    k = this.yAxis,
                    g = f.options,
                    e = this.chart.inverted,
                    b = {},
                    d = e ? "translateX" : "translateY";
                if (q)
                    if (c) b.scaleY = .001, c = Math.min(k.pos + k.len, Math.max(k.pos, k.toPixels(g.threshold))), e ? b.translateX = c - k.len : b.translateY = c, f.clipBox && f.setClip(), f.group.attr(b);
                    else {
                        var a = f.group.attr(d);
                        f.group.animate({
                                scaleY: 1
                            },
                            D(p(f.options.animation), {
                                step: function(e, c) {
                                    b[d] = a + c.pos * (k.pos - a);
                                    f.group.attr(b)
                                }
                            }));
                        f.animate = null
                    }
            },
            remove: function() {
                var c = this,
                    f = c.chart;
                f.hasRendered && f.series.forEach(function(f) {
                    f.type === c.type && (f.isDirty = !0)
                });
                v.prototype.remove.apply(c, arguments)
            }
        });
        ""
    });
    K(C, "parts/BarSeries.js", [C["parts/Globals.js"]], function(c) {
        c = c.seriesType;
        c("bar", "column", null, {
            inverted: !0
        });
        ""
    });
    K(C, "parts/ScatterSeries.js", [C["parts/Globals.js"]], function(c) {
        var f = c.Series,
            H = c.seriesType;
        H("scatter", "line", {
            lineWidth: 0,
            findNearestPointBy: "xy",
            jitter: {
                x: 0,
                y: 0
            },
            marker: {
                enabled: !0
            },
            tooltip: {
                headerFormat: '<span style="color:{point.color}">\u25cf</span> <span style="font-size: 10px"> {series.name}</span><br/>',
                pointFormat: "x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>"
            }
        }, {
            sorted: !1,
            requireSorting: !1,
            noSharedTooltip: !0,
            trackerGroups: ["group", "markerGroup", "dataLabelsGroup"],
            takeOrdinalPosition: !1,
            drawGraph: function() {
                this.options.lineWidth && f.prototype.drawGraph.call(this)
            },
            applyJitter: function() {
                var c = this,
                    f = this.options.jitter,
                    E = this.points.length;
                f && this.points.forEach(function(p, y) {
                    ["x", "y"].forEach(function(A, v) {
                        var q = "plot" + A.toUpperCase();
                        if (f[A] && !p.isNull) {
                            var k = c[A + "Axis"];
                            var m = f[A] * k.transA;
                            if (k && !k.isLog) {
                                var w = Math.max(0, p[q] - m);
                                k = Math.min(k.len, p[q] + m);
                                v = 1E4 * Math.sin(y + v * E);
                                p[q] = w + (k - w) * (v - Math.floor(v));
                                "x" === A && (p.clientX = p.plotX)
                            }
                        }
                    })
                })
            }
        });
        c.addEvent(f, "afterTranslate", function() {
            this.applyJitter && this.applyJitter()
        });
        ""
    });
    K(C, "mixins/centered-series.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c,
        f) {
        var H = f.isNumber,
            D = f.pick,
            A = c.deg2rad,
            E = c.relativeLength;
        c.CenteredSeriesMixin = {
            getCenter: function() {
                var c = this.options,
                    f = this.chart,
                    A = 2 * (c.slicedOffset || 0),
                    v = f.plotWidth - 2 * A;
                f = f.plotHeight - 2 * A;
                var q = c.center;
                q = [D(q[0], "50%"), D(q[1], "50%"), c.size || "100%", c.innerSize || 0];
                var k = Math.min(v, f),
                    m;
                for (m = 0; 4 > m; ++m) {
                    var w = q[m];
                    c = 2 > m || 2 === m && /%$/.test(w);
                    q[m] = E(w, [v, f, k, q[2]][m]) + (c ? A : 0)
                }
                q[3] > q[2] && (q[3] = q[2]);
                return q
            },
            getStartAndEndRadians: function(c, f) {
                c = H(c) ? c : 0;
                f = H(f) && f > c && 360 > f - c ? f : c + 360;
                return {
                    start: A *
                        (c + -90),
                    end: A * (f + -90)
                }
            }
        }
    });
    K(C, "parts/PieSeries.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.defined,
            D = f.isNumber,
            A = f.pick,
            E = f.setAnimation,
            p = c.addEvent;
        f = c.CenteredSeriesMixin;
        var y = f.getStartAndEndRadians,
            G = c.merge,
            v = c.noop,
            q = c.Point,
            k = c.Series,
            m = c.seriesType,
            w = c.fireEvent;
        m("pie", "line", {
            center: [null, null],
            clip: !1,
            colorByPoint: !0,
            dataLabels: {
                allowOverlap: !0,
                connectorPadding: 5,
                distance: 30,
                enabled: !0,
                formatter: function() {
                    return this.point.isNull ? void 0 : this.point.name
                },
                softConnector: !0,
                x: 0,
                connectorShape: "fixedOffset",
                crookDistance: "70%"
            },
            fillColor: void 0,
            ignoreHiddenPoint: !0,
            inactiveOtherPoints: !0,
            legendType: "point",
            marker: null,
            size: null,
            showInLegend: !1,
            slicedOffset: 10,
            stickyTracking: !1,
            tooltip: {
                followPointer: !0
            },
            borderColor: "#ffffff",
            borderWidth: 1,
            lineWidth: void 0,
            states: {
                hover: {
                    brightness: .1
                }
            }
        }, {
            isCartesian: !1,
            requireSorting: !1,
            directTouch: !0,
            noSharedTooltip: !0,
            trackerGroups: ["group", "dataLabelsGroup"],
            axisTypes: [],
            pointAttribs: c.seriesTypes.column.prototype.pointAttribs,
            animate: function(c) {
                var e = this,
                    b = e.points,
                    d = e.startAngleRad;
                c || (b.forEach(function(a) {
                    var b = a.graphic,
                        c = a.shapeArgs;
                    b && (b.attr({
                        r: a.startR || e.center[3] / 2,
                        start: d,
                        end: d
                    }), b.animate({
                        r: c.r,
                        start: c.start,
                        end: c.end
                    }, e.options.animation))
                }), e.animate = null)
            },
            hasData: function() {
                return !!this.processedXData.length
            },
            updateTotals: function() {
                var c, e = 0,
                    b = this.points,
                    d = b.length,
                    a = this.options.ignoreHiddenPoint;
                for (c = 0; c < d; c++) {
                    var h = b[c];
                    e += a && !h.visible ? 0 : h.isNull ? 0 : h.y
                }
                this.total = e;
                for (c = 0; c < d; c++) h = b[c], h.percentage =
                    0 < e && (h.visible || !a) ? h.y / e * 100 : 0, h.total = e
            },
            generatePoints: function() {
                k.prototype.generatePoints.call(this);
                this.updateTotals()
            },
            getX: function(c, e, b) {
                var d = this.center,
                    a = this.radii ? this.radii[b.index] : d[2] / 2;
                return d[0] + (e ? -1 : 1) * Math.cos(Math.asin(Math.max(Math.min((c - d[1]) / (a + b.labelDistance), 1), -1))) * (a + b.labelDistance) + (0 < b.labelDistance ? (e ? -1 : 1) * this.options.dataLabels.padding : 0)
            },
            translate: function(f) {
                this.generatePoints();
                var e = 0,
                    b = this.options,
                    d = b.slicedOffset,
                    a = d + (b.borderWidth || 0),
                    h = y(b.startAngle,
                        b.endAngle),
                    g = this.startAngleRad = h.start;
                h = (this.endAngleRad = h.end) - g;
                var k = this.points,
                    r = b.dataLabels.distance;
                b = b.ignoreHiddenPoint;
                var m, l = k.length;
                f || (this.center = f = this.getCenter());
                for (m = 0; m < l; m++) {
                    var t = k[m];
                    var q = g + e * h;
                    if (!b || t.visible) e += t.percentage / 100;
                    var p = g + e * h;
                    t.shapeType = "arc";
                    t.shapeArgs = {
                        x: f[0],
                        y: f[1],
                        r: f[2] / 2,
                        innerR: f[3] / 2,
                        start: Math.round(1E3 * q) / 1E3,
                        end: Math.round(1E3 * p) / 1E3
                    };
                    t.labelDistance = A(t.options.dataLabels && t.options.dataLabels.distance, r);
                    t.labelDistance = c.relativeLength(t.labelDistance,
                        t.shapeArgs.r);
                    this.maxLabelDistance = Math.max(this.maxLabelDistance || 0, t.labelDistance);
                    p = (p + q) / 2;
                    p > 1.5 * Math.PI ? p -= 2 * Math.PI : p < -Math.PI / 2 && (p += 2 * Math.PI);
                    t.slicedTranslation = {
                        translateX: Math.round(Math.cos(p) * d),
                        translateY: Math.round(Math.sin(p) * d)
                    };
                    var z = Math.cos(p) * f[2] / 2;
                    var u = Math.sin(p) * f[2] / 2;
                    t.tooltipPos = [f[0] + .7 * z, f[1] + .7 * u];
                    t.half = p < -Math.PI / 2 || p > Math.PI / 2 ? 1 : 0;
                    t.angle = p;
                    q = Math.min(a, t.labelDistance / 5);
                    t.labelPosition = {
                        natural: {
                            x: f[0] + z + Math.cos(p) * t.labelDistance,
                            y: f[1] + u + Math.sin(p) * t.labelDistance
                        },
                        "final": {},
                        alignment: 0 > t.labelDistance ? "center" : t.half ? "right" : "left",
                        connectorPosition: {
                            breakAt: {
                                x: f[0] + z + Math.cos(p) * q,
                                y: f[1] + u + Math.sin(p) * q
                            },
                            touchingSliceAt: {
                                x: f[0] + z,
                                y: f[1] + u
                            }
                        }
                    }
                }
                w(this, "afterTranslate")
            },
            drawEmpty: function() {
                var c = this.options;
                if (0 === this.total) {
                    var e = this.center[0];
                    var b = this.center[1];
                    this.graph || (this.graph = this.chart.renderer.circle(e, b, 0).addClass("highcharts-graph").add(this.group));
                    this.graph.animate({
                        "stroke-width": c.borderWidth,
                        cx: e,
                        cy: b,
                        r: this.center[2] / 2,
                        fill: c.fillColor ||
                            "none",
                        stroke: c.color || "#cccccc"
                    })
                } else this.graph && (this.graph = this.graph.destroy())
            },
            redrawPoints: function() {
                var c = this,
                    e = c.chart,
                    b = e.renderer,
                    d, a, h, f, k = c.options.shadow;
                this.drawEmpty();
                !k || c.shadowGroup || e.styledMode || (c.shadowGroup = b.g("shadow").attr({
                    zIndex: -1
                }).add(c.group));
                c.points.forEach(function(g) {
                    var r = {};
                    a = g.graphic;
                    if (!g.isNull && a) {
                        f = g.shapeArgs;
                        d = g.getTranslate();
                        if (!e.styledMode) {
                            var l = g.shadowGroup;
                            k && !l && (l = g.shadowGroup = b.g("shadow").add(c.shadowGroup));
                            l && l.attr(d);
                            h = c.pointAttribs(g,
                                g.selected && "select")
                        }
                        g.delayedRendering ? (a.setRadialReference(c.center).attr(f).attr(d), e.styledMode || a.attr(h).attr({
                            "stroke-linejoin": "round"
                        }).shadow(k, l), g.delayedRendering = !1) : (a.setRadialReference(c.center), e.styledMode || G(!0, r, h), G(!0, r, f, d), a.animate(r));
                        a.attr({
                            visibility: g.visible ? "inherit" : "hidden"
                        });
                        a.addClass(g.getClassName())
                    } else a && (g.graphic = a.destroy())
                })
            },
            drawPoints: function() {
                var c = this.chart.renderer;
                this.points.forEach(function(e) {
                    e.graphic || (e.graphic = c[e.shapeType](e.shapeArgs).add(e.series.group),
                        e.delayedRendering = !0)
                })
            },
            searchPoint: v,
            sortByAngle: function(c, e) {
                c.sort(function(b, d) {
                    return void 0 !== b.angle && (d.angle - b.angle) * e
                })
            },
            drawLegendSymbol: c.LegendSymbolMixin.drawRectangle,
            getCenter: f.getCenter,
            getSymbol: v,
            drawGraph: null
        }, {
            init: function() {
                q.prototype.init.apply(this, arguments);
                var c = this;
                c.name = A(c.name, "Slice");
                var e = function(b) {
                    c.slice("select" === b.type)
                };
                p(c, "select", e);
                p(c, "unselect", e);
                return c
            },
            isValid: function() {
                return D(this.y) && 0 <= this.y
            },
            setVisible: function(c, e) {
                var b = this,
                    d = b.series,
                    a = d.chart,
                    h = d.options.ignoreHiddenPoint;
                e = A(e, h);
                c !== b.visible && (b.visible = b.options.visible = c = void 0 === c ? !b.visible : c, d.options.data[d.data.indexOf(b)] = b.options, ["graphic", "dataLabel", "connector", "shadowGroup"].forEach(function(a) {
                    if (b[a]) b[a][c ? "show" : "hide"](!0)
                }), b.legendItem && a.legend.colorizeItem(b, c), c || "hover" !== b.state || b.setState(""), h && (d.isDirty = !0), e && a.redraw())
            },
            slice: function(c, e, b) {
                var d = this.series;
                E(b, d.chart);
                A(e, !0);
                this.sliced = this.options.sliced = H(c) ? c : !this.sliced;
                d.options.data[d.data.indexOf(this)] = this.options;
                this.graphic.animate(this.getTranslate());
                this.shadowGroup && this.shadowGroup.animate(this.getTranslate())
            },
            getTranslate: function() {
                return this.sliced ? this.slicedTranslation : {
                    translateX: 0,
                    translateY: 0
                }
            },
            haloPath: function(c) {
                var e = this.shapeArgs;
                return this.sliced || !this.visible ? [] : this.series.chart.renderer.symbols.arc(e.x, e.y, e.r + c, e.r + c, {
                    innerR: e.r - 1,
                    start: e.start,
                    end: e.end
                })
            },
            connectorShapes: {
                fixedOffset: function(c, e, b) {
                    var d = e.breakAt;
                    e = e.touchingSliceAt;
                    return ["M", c.x, c.y].concat(b.softConnector ? ["C", c.x + ("left" === c.alignment ? -5 : 5), c.y, 2 * d.x - e.x, 2 * d.y - e.y, d.x, d.y] : ["L", d.x, d.y]).concat(["L", e.x, e.y])
                },
                straight: function(c, e) {
                    e = e.touchingSliceAt;
                    return ["M", c.x, c.y, "L", e.x, e.y]
                },
                crookedLine: function(f, e, b) {
                    e = e.touchingSliceAt;
                    var d = this.series,
                        a = d.center[0],
                        h = d.chart.plotWidth,
                        g = d.chart.plotLeft;
                    d = f.alignment;
                    var k = this.shapeArgs.r;
                    b = c.relativeLength(b.crookDistance, 1);
                    b = "left" === d ? a + k + (h + g - a - k) * (1 - b) : g + (a - k) * b;
                    a = ["L", b, f.y];
                    if ("left" === d ? b > f.x || b <
                        e.x : b < f.x || b > e.x) a = [];
                    return ["M", f.x, f.y].concat(a).concat(["L", e.x, e.y])
                }
            },
            getConnectorPath: function() {
                var c = this.labelPosition,
                    e = this.series.options.dataLabels,
                    b = e.connectorShape,
                    d = this.connectorShapes;
                d[b] && (b = d[b]);
                return b.call(this, {
                    x: c.final.x,
                    y: c.final.y,
                    alignment: c.alignment
                }, c.connectorPosition, e)
            }
        });
        ""
    });
    K(C, "parts/DataLabels.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.arrayMax,
            D = f.defined,
            A = f.extend,
            E = f.isArray,
            p = f.objectEach,
            y = f.pick,
            G = f.splat,
            v = c.format,
            q = c.merge;
        f = c.noop;
        var k = c.relativeLength,
            m = c.Series,
            w = c.seriesTypes,
            g = c.stableSort;
        c.distribute = function(e, b, d) {
            function a(a, b) {
                return a.target - b.target
            }
            var h, f = !0,
                k = e,
                r = [];
            var m = 0;
            var l = k.reducedLen || b;
            for (h = e.length; h--;) m += e[h].size;
            if (m > l) {
                g(e, function(a, b) {
                    return (b.rank || 0) - (a.rank || 0)
                });
                for (m = h = 0; m <= l;) m += e[h].size, h++;
                r = e.splice(h - 1, e.length)
            }
            g(e, a);
            for (e = e.map(function(a) {
                    return {
                        size: a.size,
                        targets: [a.target],
                        align: y(a.align, .5)
                    }
                }); f;) {
                for (h = e.length; h--;) f = e[h], m = (Math.min.apply(0, f.targets) +
                    Math.max.apply(0, f.targets)) / 2, f.pos = Math.min(Math.max(0, m - f.size * f.align), b - f.size);
                h = e.length;
                for (f = !1; h--;) 0 < h && e[h - 1].pos + e[h - 1].size > e[h].pos && (e[h - 1].size += e[h].size, e[h - 1].targets = e[h - 1].targets.concat(e[h].targets), e[h - 1].align = .5, e[h - 1].pos + e[h - 1].size > b && (e[h - 1].pos = b - e[h - 1].size), e.splice(h, 1), f = !0)
            }
            k.push.apply(k, r);
            h = 0;
            e.some(function(a) {
                var e = 0;
                if (a.targets.some(function() {
                        k[h].pos = a.pos + e;
                        if (Math.abs(k[h].pos - k[h].target) > d) return k.slice(0, h + 1).forEach(function(a) {
                                delete a.pos
                            }), k.reducedLen =
                            (k.reducedLen || b) - .1 * b, k.reducedLen > .1 * b && c.distribute(k, b, d), !0;
                        e += k[h].size;
                        h++
                    })) return !0
            });
            g(k, a)
        };
        m.prototype.drawDataLabels = function() {
            function e(a, b) {
                var d = b.filter;
                return d ? (b = d.operator, a = a[d.property], d = d.value, ">" === b && a > d || "<" === b && a < d || ">=" === b && a >= d || "<=" === b && a <= d || "==" === b && a == d || "===" === b && a === d ? !0 : !1) : !0
            }
            function b(a, b) {
                var d = [],
                    c;
                if (E(a) && !E(b)) d = a.map(function(a) {
                    return q(a, b)
                });
                else if (E(b) && !E(a)) d = b.map(function(b) {
                    return q(a, b)
                });
                else if (E(a) || E(b))
                    for (c = Math.max(a.length,
                            b.length); c--;) d[c] = q(a[c], b[c]);
                else d = q(a, b);
                return d
            }
            var d = this,
                a = d.chart,
                f = d.options,
                g = f.dataLabels,
                k = d.points,
                r, m = d.hasRendered || 0,
                l = c.animObject(f.animation).duration,
                t = Math.min(l, 200),
                B = !a.renderer.forExport && y(g.defer, 0 < t),
                w = a.renderer;
            g = b(b(a.options.plotOptions && a.options.plotOptions.series && a.options.plotOptions.series.dataLabels, a.options.plotOptions && a.options.plotOptions[d.type] && a.options.plotOptions[d.type].dataLabels), g);
            c.fireEvent(this, "drawDataLabels");
            if (E(g) || g.enabled || d._hasPointLabels) {
                var z =
                    d.plotGroup("dataLabelsGroup", "data-labels", B && !m ? "hidden" : "inherit", g.zIndex || 6);
                B && (z.attr({
                    opacity: +m
                }), m || setTimeout(function() {
                    var a = d.dataLabelsGroup;
                    a && (d.visible && z.show(!0), a[f.animation ? "animate" : "attr"]({
                        opacity: 1
                    }, {
                        duration: t
                    }))
                }, l - t));
                k.forEach(function(c) {
                    r = G(b(g, c.dlOptions || c.options && c.options.dataLabels));
                    r.forEach(function(b, h) {
                        var g = b.enabled && (!c.isNull || c.dataLabelOnNull) && e(c, b),
                            l = c.dataLabels ? c.dataLabels[h] : c.dataLabel,
                            k = c.connectors ? c.connectors[h] : c.connector,
                            r = y(b.distance,
                                c.labelDistance),
                            n = !l;
                        if (g) {
                            var t = c.getLabelConfig();
                            var m = y(b[c.formatPrefix + "Format"], b.format);
                            t = D(m) ? v(m, t, a.time) : (b[c.formatPrefix + "Formatter"] || b.formatter).call(t, b);
                            m = b.style;
                            var q = b.rotation;
                            a.styledMode || (m.color = y(b.color, m.color, d.color, "#FFFFFF"), "contrast" === m.color && (c.contrastColor = w.getContrast(c.color || d.color), m.color = !D(r) && b.inside || 0 > r || f.stacking ? c.contrastColor : "#FFFFFF"), f.cursor && (m.cursor = f.cursor));
                            var x = {
                                r: b.borderRadius || 0,
                                rotation: q,
                                padding: b.padding,
                                zIndex: 1
                            };
                            a.styledMode ||
                                (x.fill = b.backgroundColor, x.stroke = b.borderColor, x["stroke-width"] = b.borderWidth);
                            p(x, function(a, b) {
                                void 0 === a && delete x[b]
                            })
                        }!l || g && D(t) ? g && D(t) && (l ? x.text = t : (c.dataLabels = c.dataLabels || [], l = c.dataLabels[h] = q ? w.text(t, 0, -9999).addClass("highcharts-data-label") : w.label(t, 0, -9999, b.shape, null, null, b.useHTML, null, "data-label"), h || (c.dataLabel = l), l.addClass(" highcharts-data-label-color-" + c.colorIndex + " " + (b.className || "") + (b.useHTML ? " highcharts-tracker" : ""))), l.options = b, l.attr(x), a.styledMode || l.css(m).shadow(b.shadow),
                            l.added || l.add(z), b.textPath && !b.useHTML && l.setTextPath(c.getDataLabelPath && c.getDataLabelPath(l) || c.graphic, b.textPath), d.alignDataLabel(c, l, b, null, n)) : (c.dataLabel = c.dataLabel && c.dataLabel.destroy(), c.dataLabels && (1 === c.dataLabels.length ? delete c.dataLabels : delete c.dataLabels[h]), h || delete c.dataLabel, k && (c.connector = c.connector.destroy(), c.connectors && (1 === c.connectors.length ? delete c.connectors : delete c.connectors[h])))
                    })
                })
            }
            c.fireEvent(this, "afterDrawDataLabels")
        };
        m.prototype.alignDataLabel =
            function(c, b, d, a, f) {
                var e = this.chart,
                    h = this.isCartesian && e.inverted,
                    g = y(c.dlBox && c.dlBox.centerX, c.plotX, -9999),
                    k = y(c.plotY, -9999),
                    l = b.getBBox(),
                    t = d.rotation,
                    m = d.align,
                    q = this.visible && (c.series.forceDL || e.isInsidePlot(g, Math.round(k), h) || a && e.isInsidePlot(g, h ? a.x + 1 : a.y + a.height - 1, h)),
                    p = "justify" === y(d.overflow, "justify");
                if (q) {
                    var u = e.renderer.fontMetrics(e.styledMode ? void 0 : d.style.fontSize, b).b;
                    a = A({
                        x: h ? this.yAxis.len - k : g,
                        y: Math.round(h ? this.xAxis.len - g : k),
                        width: 0,
                        height: 0
                    }, a);
                    A(d, {
                        width: l.width,
                        height: l.height
                    });
                    t ? (p = !1, g = e.renderer.rotCorr(u, t), g = {
                        x: a.x + d.x + a.width / 2 + g.x,
                        y: a.y + d.y + {
                            top: 0,
                            middle: .5,
                            bottom: 1
                        }[d.verticalAlign] * a.height
                    }, b[f ? "attr" : "animate"](g).attr({
                        align: m
                    }), k = (t + 720) % 360, k = 180 < k && 360 > k, "left" === m ? g.y -= k ? l.height : 0 : "center" === m ? (g.x -= l.width / 2, g.y -= l.height / 2) : "right" === m && (g.x -= l.width, g.y -= k ? 0 : l.height), b.placed = !0, b.alignAttr = g) : (b.align(d, null, a), g = b.alignAttr);
                    p && 0 <= a.height ? this.justifyDataLabel(b, d, g, l, a, f) : y(d.crop, !0) && (q = e.isInsidePlot(g.x, g.y) && e.isInsidePlot(g.x +
                        l.width, g.y + l.height));
                    if (d.shape && !t) b[f ? "attr" : "animate"]({
                        anchorX: h ? e.plotWidth - c.plotY : c.plotX,
                        anchorY: h ? e.plotHeight - c.plotX : c.plotY
                    })
                }
                q || (b.hide(!0), b.placed = !1)
            };
        m.prototype.justifyDataLabel = function(c, b, d, a, f, g) {
            var e = this.chart,
                h = b.align,
                k = b.verticalAlign,
                l = c.box ? 0 : c.padding || 0;
            var n = d.x + l;
            if (0 > n) {
                "right" === h ? (b.align = "left", b.inside = !0) : b.x = -n;
                var m = !0
            }
            n = d.x + a.width - l;
            n > e.plotWidth && ("left" === h ? (b.align = "right", b.inside = !0) : b.x = e.plotWidth - n, m = !0);
            n = d.y + l;
            0 > n && ("bottom" === k ? (b.verticalAlign =
                "top", b.inside = !0) : b.y = -n, m = !0);
            n = d.y + a.height - l;
            n > e.plotHeight && ("top" === k ? (b.verticalAlign = "bottom", b.inside = !0) : b.y = e.plotHeight - n, m = !0);
            m && (c.placed = !g, c.align(b, null, f));
            return m
        };
        w.pie && (w.pie.prototype.dataLabelPositioners = {
                radialDistributionY: function(c) {
                    return c.top + c.distributeBox.pos
                },
                radialDistributionX: function(c, b, d, a) {
                    return c.getX(d < b.top + 2 || d > b.bottom - 2 ? a : d, b.half, b)
                },
                justify: function(c, b, d) {
                    return d[0] + (c.half ? -1 : 1) * (b + c.labelDistance)
                },
                alignToPlotEdges: function(c, b, d, a) {
                    c = c.getBBox().width;
                    return b ? c + a : d - c - a
                },
                alignToConnectors: function(c, b, d, a) {
                    var e = 0,
                        f;
                    c.forEach(function(a) {
                        f = a.dataLabel.getBBox().width;
                        f > e && (e = f)
                    });
                    return b ? e + a : d - e - a
                }
            }, w.pie.prototype.drawDataLabels = function() {
                var e = this,
                    b = e.data,
                    d, a = e.chart,
                    f = e.options.dataLabels,
                    g = f.connectorPadding,
                    k, r = a.plotWidth,
                    x = a.plotHeight,
                    l = a.plotLeft,
                    t = Math.round(a.chartWidth / 3),
                    p, w = e.center,
                    z = w[2] / 2,
                    u = w[1],
                    v, A, E, G, C = [
                        [],
                        []
                    ],
                    K, J, O, P, S = [0, 0, 0, 0],
                    U = e.dataLabelPositioners,
                    X;
                e.visible && (f.enabled || e._hasPointLabels) && (b.forEach(function(a) {
                    a.dataLabel &&
                        a.visible && a.dataLabel.shortened && (a.dataLabel.attr({
                            width: "auto"
                        }).css({
                            width: "auto",
                            textOverflow: "clip"
                        }), a.dataLabel.shortened = !1)
                }), m.prototype.drawDataLabels.apply(e), b.forEach(function(a) {
                    a.dataLabel && (a.visible ? (C[a.half].push(a), a.dataLabel._pos = null, !D(f.style.width) && !D(a.options.dataLabels && a.options.dataLabels.style && a.options.dataLabels.style.width) && a.dataLabel.getBBox().width > t && (a.dataLabel.css({
                        width: .7 * t
                    }), a.dataLabel.shortened = !0)) : (a.dataLabel = a.dataLabel.destroy(), a.dataLabels &&
                        1 === a.dataLabels.length && delete a.dataLabels))
                }), C.forEach(function(b, h) {
                    var k = b.length,
                        n = [],
                        t;
                    if (k) {
                        e.sortByAngle(b, h - .5);
                        if (0 < e.maxLabelDistance) {
                            var m = Math.max(0, u - z - e.maxLabelDistance);
                            var q = Math.min(u + z + e.maxLabelDistance, a.plotHeight);
                            b.forEach(function(b) {
                                0 < b.labelDistance && b.dataLabel && (b.top = Math.max(0, u - z - b.labelDistance), b.bottom = Math.min(u + z + b.labelDistance, a.plotHeight), t = b.dataLabel.getBBox().height || 21, b.distributeBox = {
                                    target: b.labelPosition.natural.y - b.top + t / 2,
                                    size: t,
                                    rank: b.y
                                }, n.push(b.distributeBox))
                            });
                            m = q + t - m;
                            c.distribute(n, m, m / 5)
                        }
                        for (P = 0; P < k; P++) {
                            d = b[P];
                            E = d.labelPosition;
                            v = d.dataLabel;
                            O = !1 === d.visible ? "hidden" : "inherit";
                            J = m = E.natural.y;
                            n && D(d.distributeBox) && (void 0 === d.distributeBox.pos ? O = "hidden" : (G = d.distributeBox.size, J = U.radialDistributionY(d)));
                            delete d.positionIndex;
                            if (f.justify) K = U.justify(d, z, w);
                            else switch (f.alignTo) {
                                case "connectors":
                                    K = U.alignToConnectors(b, h, r, l);
                                    break;
                                case "plotEdges":
                                    K = U.alignToPlotEdges(v, h, r, l);
                                    break;
                                default:
                                    K = U.radialDistributionX(e, d, J, m)
                            }
                            v._attr = {
                                visibility: O,
                                align: E.alignment
                            };
                            v._pos = {
                                x: K + f.x + ({
                                    left: g,
                                    right: -g
                                }[E.alignment] || 0),
                                y: J + f.y - 10
                            };
                            E.final.x = K;
                            E.final.y = J;
                            y(f.crop, !0) && (A = v.getBBox().width, m = null, K - A < g && 1 === h ? (m = Math.round(A - K + g), S[3] = Math.max(m, S[3])) : K + A > r - g && 0 === h && (m = Math.round(K + A - r + g), S[1] = Math.max(m, S[1])), 0 > J - G / 2 ? S[0] = Math.max(Math.round(-J + G / 2), S[0]) : J + G / 2 > x && (S[2] = Math.max(Math.round(J + G / 2 - x), S[2])), v.sideOverflow = m)
                        }
                    }
                }), 0 === H(S) || this.verifyDataLabelOverflow(S)) && (this.placeDataLabels(), this.points.forEach(function(b) {
                    X = q(f, b.options.dataLabels);
                    if (k = y(X.connectorWidth, 1)) {
                        var d;
                        p = b.connector;
                        if ((v = b.dataLabel) && v._pos && b.visible && 0 < b.labelDistance) {
                            O = v._attr.visibility;
                            if (d = !p) b.connector = p = a.renderer.path().addClass("highcharts-data-label-connector  highcharts-color-" + b.colorIndex + (b.className ? " " + b.className : "")).add(e.dataLabelsGroup), a.styledMode || p.attr({
                                "stroke-width": k,
                                stroke: X.connectorColor || b.color || "#666666"
                            });
                            p[d ? "attr" : "animate"]({
                                d: b.getConnectorPath()
                            });
                            p.attr("visibility", O)
                        } else p && (b.connector = p.destroy())
                    }
                }))
            }, w.pie.prototype.placeDataLabels =
            function() {
                this.points.forEach(function(c) {
                    var b = c.dataLabel,
                        d;
                    b && c.visible && ((d = b._pos) ? (b.sideOverflow && (b._attr.width = Math.max(b.getBBox().width - b.sideOverflow, 0), b.css({
                        width: b._attr.width + "px",
                        textOverflow: (this.options.dataLabels.style || {}).textOverflow || "ellipsis"
                    }), b.shortened = !0), b.attr(b._attr), b[b.moved ? "animate" : "attr"](d), b.moved = !0) : b && b.attr({
                        y: -9999
                    }));
                    delete c.distributeBox
                }, this)
            }, w.pie.prototype.alignDataLabel = f, w.pie.prototype.verifyDataLabelOverflow = function(c) {
                var b = this.center,
                    d = this.options,
                    a = d.center,
                    e = d.minSize || 80,
                    f = null !== d.size;
                if (!f) {
                    if (null !== a[0]) var g = Math.max(b[2] - Math.max(c[1], c[3]), e);
                    else g = Math.max(b[2] - c[1] - c[3], e), b[0] += (c[3] - c[1]) / 2;
                    null !== a[1] ? g = Math.max(Math.min(g, b[2] - Math.max(c[0], c[2])), e) : (g = Math.max(Math.min(g, b[2] - c[0] - c[2]), e), b[1] += (c[0] - c[2]) / 2);
                    g < b[2] ? (b[2] = g, b[3] = Math.min(k(d.innerSize || 0, g), g), this.translate(b), this.drawDataLabels && this.drawDataLabels()) : f = !0
                }
                return f
            });
        w.column && (w.column.prototype.alignDataLabel = function(c, b, d, a, f) {
            var e =
                this.chart.inverted,
                h = c.series,
                g = c.dlBox || c.shapeArgs,
                k = y(c.below, c.plotY > y(this.translatedThreshold, h.yAxis.len)),
                l = y(d.inside, !!this.options.stacking);
            g && (a = q(g), 0 > a.y && (a.height += a.y, a.y = 0), g = a.y + a.height - h.yAxis.len, 0 < g && (a.height -= g), e && (a = {
                x: h.yAxis.len - a.y - a.height,
                y: h.xAxis.len - a.x - a.width,
                width: a.height,
                height: a.width
            }), l || (e ? (a.x += k ? 0 : a.width, a.width = 0) : (a.y += k ? a.height : 0, a.height = 0)));
            d.align = y(d.align, !e || l ? "center" : k ? "right" : "left");
            d.verticalAlign = y(d.verticalAlign, e || l ? "middle" : k ? "top" :
                "bottom");
            m.prototype.alignDataLabel.call(this, c, b, d, a, f);
            d.inside && c.contrastColor && b.css({
                color: c.contrastColor
            })
        })
    });
    K(C, "modules/overlapping-datalabels.src.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.isArray,
            D = f.objectEach,
            A = f.pick;
        f = c.Chart;
        var E = c.addEvent,
            p = c.fireEvent;
        E(f, "render", function() {
            var c = [];
            (this.labelCollectors || []).forEach(function(f) {
                c = c.concat(f())
            });
            (this.yAxis || []).forEach(function(f) {
                f.options.stackLabels && !f.options.stackLabels.allowOverlap &&
                    D(f.stacks, function(f) {
                        D(f, function(f) {
                            c.push(f.label)
                        })
                    })
            });
            (this.series || []).forEach(function(f) {
                var p = f.options.dataLabels;
                f.visible && (!1 !== p.enabled || f._hasPointLabels) && f.points.forEach(function(f) {
                    f.visible && (H(f.dataLabels) ? f.dataLabels : f.dataLabel ? [f.dataLabel] : []).forEach(function(k) {
                        var m = k.options;
                        k.labelrank = A(m.labelrank, f.labelrank, f.shapeArgs && f.shapeArgs.height);
                        m.allowOverlap || c.push(k)
                    })
                })
            });
            this.hideOverlappingLabels(c)
        });
        f.prototype.hideOverlappingLabels = function(c) {
            var f = this,
                v = c.length,
                q = f.renderer,
                k, m, w;
            var g = function(b) {
                var a = b.box ? 0 : b.padding || 0;
                var d = 0;
                if (b && (!b.alignAttr || b.placed)) {
                    var c = b.attr("x");
                    var e = b.attr("y");
                    c = "number" === typeof c && "number" === typeof e ? {
                        x: c,
                        y: e
                    } : b.alignAttr;
                    e = b.parentGroup;
                    b.width || (d = b.getBBox(), b.width = d.width, b.height = d.height, d = q.fontMetrics(null, b.element).h);
                    return {
                        x: c.x + (e.translateX || 0) + a,
                        y: c.y + (e.translateY || 0) + a - d,
                        width: b.width - 2 * a,
                        height: b.height - 2 * a
                    }
                }
            };
            for (m = 0; m < v; m++)
                if (k = c[m]) k.oldOpacity = k.opacity, k.newOpacity = 1, k.absoluteBox =
                    g(k);
            c.sort(function(b, a) {
                return (a.labelrank || 0) - (b.labelrank || 0)
            });
            for (m = 0; m < v; m++) {
                var e = (g = c[m]) && g.absoluteBox;
                for (k = m + 1; k < v; ++k) {
                    var b = (w = c[k]) && w.absoluteBox;
                    !e || !b || g === w || 0 === g.newOpacity || 0 === w.newOpacity || b.x > e.x + e.width || b.x + b.width < e.x || b.y > e.y + e.height || b.y + b.height < e.y || ((g.labelrank < w.labelrank ? g : w).newOpacity = 0)
                }
            }
            c.forEach(function(b) {
                var a;
                if (b) {
                    var d = b.newOpacity;
                    b.oldOpacity !== d && (b.alignAttr && b.placed ? (d ? b.show(!0) : a = function() {
                        b.hide(!0);
                        b.placed = !1
                    }, b.alignAttr.opacity = d, b[b.isOld ?
                        "animate" : "attr"](b.alignAttr, null, a), p(f, "afterHideOverlappingLabels")) : b.attr({
                        opacity: d
                    }));
                    b.isOld = !0
                }
            })
        }
    });
    K(C, "parts/Interaction.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.defined,
            D = f.extend,
            A = f.isArray,
            E = f.isObject,
            p = f.objectEach,
            y = f.pick,
            G = c.addEvent;
        f = c.Chart;
        var v = c.createElement,
            q = c.css,
            k = c.defaultOptions,
            m = c.defaultPlotOptions,
            w = c.fireEvent,
            g = c.hasTouch,
            e = c.Legend,
            b = c.merge,
            d = c.Point,
            a = c.Series,
            h = c.seriesTypes,
            n = c.svg;
        var F = c.TrackerMixin = {
            drawTrackerPoint: function() {
                var a =
                    this,
                    b = a.chart,
                    d = b.pointer,
                    c = function(a) {
                        var b = d.getPointFromEvent(a);
                        void 0 !== b && (d.isDirectTouch = !0, b.onMouseOver(a))
                    },
                    e;
                a.points.forEach(function(a) {
                    e = A(a.dataLabels) ? a.dataLabels : a.dataLabel ? [a.dataLabel] : [];
                    a.graphic && (a.graphic.element.point = a);
                    e.forEach(function(b) {
                        b.div ? b.div.point = a : b.element.point = a
                    })
                });
                a._hasTracking || (a.trackerGroups.forEach(function(e) {
                    if (a[e]) {
                        a[e].addClass("highcharts-tracker").on("mouseover", c).on("mouseout", function(a) {
                            d.onTrackerMouseOut(a)
                        });
                        if (g) a[e].on("touchstart",
                            c);
                        !b.styledMode && a.options.cursor && a[e].css(q).css({
                            cursor: a.options.cursor
                        })
                    }
                }), a._hasTracking = !0);
                w(this, "afterDrawTracker")
            },
            drawTrackerGraph: function() {
                var a = this,
                    b = a.options,
                    d = b.trackByArea,
                    c = [].concat(d ? a.areaPath : a.graphPath),
                    e = c.length,
                    f = a.chart,
                    h = f.pointer,
                    k = f.renderer,
                    m = f.options.tooltip.snap,
                    q = a.tracker,
                    p, v = function() {
                        if (f.hoverSeries !== a) a.onMouseOver()
                    },
                    F = "rgba(192,192,192," + (n ? .0001 : .002) + ")";
                if (e && !d)
                    for (p = e + 1; p--;) "M" === c[p] && c.splice(p + 1, 0, c[p + 1] - m, c[p + 2], "L"), (p && "M" === c[p] || p ===
                        e) && c.splice(p, 0, "L", c[p - 2] + m, c[p - 1]);
                q ? q.attr({
                    d: c
                }) : a.graph && (a.tracker = k.path(c).attr({
                    visibility: a.visible ? "visible" : "hidden",
                    zIndex: 2
                }).addClass(d ? "highcharts-tracker-area" : "highcharts-tracker-line").add(a.group), f.styledMode || a.tracker.attr({
                    "stroke-linejoin": "round",
                    stroke: F,
                    fill: d ? F : "none",
                    "stroke-width": a.graph.strokeWidth() + (d ? 0 : 2 * m)
                }), [a.tracker, a.markerGroup].forEach(function(a) {
                    a.addClass("highcharts-tracker").on("mouseover", v).on("mouseout", function(a) {
                        h.onTrackerMouseOut(a)
                    });
                    b.cursor &&
                        !f.styledMode && a.css({
                            cursor: b.cursor
                        });
                    if (g) a.on("touchstart", v)
                }));
                w(this, "afterDrawTracker")
            }
        };
        h.column && (h.column.prototype.drawTracker = F.drawTrackerPoint);
        h.pie && (h.pie.prototype.drawTracker = F.drawTrackerPoint);
        h.scatter && (h.scatter.prototype.drawTracker = F.drawTrackerPoint);
        D(e.prototype, {
            setItemEvents: function(a, c, e) {
                var f = this,
                    h = f.chart.renderer.boxWrapper,
                    g = a instanceof d,
                    k = "highcharts-legend-" + (g ? "point" : "series") + "-active",
                    l = f.chart.styledMode;
                (e ? c : a.legendGroup).on("mouseover", function() {
                    a.visible &&
                        f.allItems.forEach(function(b) {
                            a !== b && b.setState("inactive", !g)
                        });
                    a.setState("hover");
                    a.visible && h.addClass(k);
                    l || c.css(f.options.itemHoverStyle)
                }).on("mouseout", function() {
                    f.chart.styledMode || c.css(b(a.visible ? f.itemStyle : f.itemHiddenStyle));
                    f.allItems.forEach(function(b) {
                        a !== b && b.setState("", !g)
                    });
                    h.removeClass(k);
                    a.setState()
                }).on("click", function(b) {
                    var d = function() {
                        a.setVisible && a.setVisible();
                        f.allItems.forEach(function(b) {
                            a !== b && b.setState(a.visible ? "inactive" : "", !g)
                        })
                    };
                    h.removeClass(k);
                    b = {
                        browserEvent: b
                    };
                    a.firePointEvent ? a.firePointEvent("legendItemClick", b, d) : w(a, "legendItemClick", b, d)
                })
            },
            createCheckboxForItem: function(a) {
                a.checkbox = v("input", {
                    type: "checkbox",
                    className: "highcharts-legend-checkbox",
                    checked: a.selected,
                    defaultChecked: a.selected
                }, this.options.itemCheckboxStyle, this.chart.container);
                G(a.checkbox, "click", function(b) {
                    w(a.series || a, "checkboxClick", {
                        checked: b.target.checked,
                        item: a
                    }, function() {
                        a.select()
                    })
                })
            }
        });
        D(f.prototype, {
            showResetZoom: function() {
                function a() {
                    b.zoomOut()
                }
                var b = this,
                    d = k.lang,
                    c = b.options.chart.resetZoomButton,
                    e = c.theme,
                    f = e.states,
                    h = "chart" === c.relativeTo || "spaceBox" === c.relativeTo ? null : "plotBox";
                w(this, "beforeShowResetZoom", null, function() {
                    b.resetZoomButton = b.renderer.button(d.resetZoom, null, null, a, e, f && f.hover).attr({
                        align: c.position.align,
                        title: d.resetZoomTitle
                    }).addClass("highcharts-reset-zoom").add().align(c.position, !1, h)
                });
                w(this, "afterShowResetZoom")
            },
            zoomOut: function() {
                w(this, "selection", {
                    resetSelection: !0
                }, this.zoom)
            },
            zoom: function(a) {
                var b =
                    this,
                    d, c = b.pointer,
                    e = !1,
                    f = b.inverted ? c.mouseDownX : c.mouseDownY;
                !a || a.resetSelection ? (b.axes.forEach(function(a) {
                    d = a.zoom()
                }), c.initiated = !1) : a.xAxis.concat(a.yAxis).forEach(function(a) {
                    var h = a.axis,
                        g = b.inverted ? h.left : h.top,
                        k = b.inverted ? g + h.width : g + h.height,
                        l = h.isXAxis,
                        r = !1;
                    if (!l && f >= g && f <= k || l || !H(f)) r = !0;
                    c[l ? "zoomX" : "zoomY"] && r && (d = h.zoom(a.min, a.max), h.displayBtn && (e = !0))
                });
                var h = b.resetZoomButton;
                e && !h ? b.showResetZoom() : !e && E(h) && (b.resetZoomButton = h.destroy());
                d && b.redraw(y(b.options.chart.animation,
                    a && a.animation, 100 > b.pointCount))
            },
            pan: function(a, b) {
                var d = this,
                    c = d.hoverPoints,
                    e;
                w(this, "pan", {
                    originalEvent: a
                }, function() {
                    c && c.forEach(function(a) {
                        a.setState()
                    });
                    ("xy" === b ? [1, 0] : [1]).forEach(function(b) {
                        b = d[b ? "xAxis" : "yAxis"][0];
                        var c = b.horiz,
                            f = a[c ? "chartX" : "chartY"];
                        c = c ? "mouseDownX" : "mouseDownY";
                        var h = d[c],
                            g = (b.pointRange || 0) / 2,
                            k = b.reversed && !d.inverted || !b.reversed && d.inverted ? -1 : 1,
                            l = b.getExtremes(),
                            r = b.toValue(h - f, !0) + g * k;
                        k = b.toValue(h + b.len - f, !0) - g * k;
                        var n = k < r;
                        h = n ? k : r;
                        r = n ? r : k;
                        k = Math.min(l.dataMin,
                            g ? l.min : b.toValue(b.toPixels(l.min) - b.minPixelPadding));
                        g = Math.max(l.dataMax, g ? l.max : b.toValue(b.toPixels(l.max) + b.minPixelPadding));
                        n = k - h;
                        0 < n && (r += n, h = k);
                        n = r - g;
                        0 < n && (r = g, h -= n);
                        b.series.length && h !== l.min && r !== l.max && (b.setExtremes(h, r, !1, !1, {
                            trigger: "pan"
                        }), e = !0);
                        d[c] = f
                    });
                    e && d.redraw(!1);
                    q(d.container, {
                        cursor: "move"
                    })
                })
            }
        });
        D(d.prototype, {
            select: function(a, b) {
                var d = this,
                    c = d.series,
                    e = c.chart;
                this.selectedStaging = a = y(a, !d.selected);
                d.firePointEvent(a ? "select" : "unselect", {
                    accumulate: b
                }, function() {
                    d.selected =
                        d.options.selected = a;
                    c.options.data[c.data.indexOf(d)] = d.options;
                    d.setState(a && "select");
                    b || e.getSelectedPoints().forEach(function(a) {
                        var b = a.series;
                        a.selected && a !== d && (a.selected = a.options.selected = !1, b.options.data[b.data.indexOf(a)] = a.options, a.setState(e.hoverPoints && b.options.inactiveOtherPoints ? "inactive" : ""), a.firePointEvent("unselect"))
                    })
                });
                delete this.selectedStaging
            },
            onMouseOver: function(a) {
                var b = this.series.chart,
                    d = b.pointer;
                a = a ? d.normalize(a) : d.getChartCoordinatesFromPoint(this, b.inverted);
                d.runPointActions(a, this)
            },
            onMouseOut: function() {
                var a = this.series.chart;
                this.firePointEvent("mouseOut");
                this.series.options.inactiveOtherPoints || (a.hoverPoints || []).forEach(function(a) {
                    a.setState()
                });
                a.hoverPoints = a.hoverPoint = null
            },
            importEvents: function() {
                if (!this.hasImportedEvents) {
                    var a = this,
                        d = b(a.series.options.point, a.options).events;
                    a.events = d;
                    p(d, function(b, d) {
                        c.isFunction(b) && G(a, d, b)
                    });
                    this.hasImportedEvents = !0
                }
            },
            setState: function(a, b) {
                var d = this.series,
                    c = this.state,
                    e = d.options.states[a ||
                        "normal"] || {},
                    f = m[d.type].marker && d.options.marker,
                    h = f && !1 === f.enabled,
                    g = f && f.states && f.states[a || "normal"] || {},
                    k = !1 === g.enabled,
                    n = d.stateMarkerGraphic,
                    r = this.marker || {},
                    q = d.chart,
                    p = d.halo,
                    x, v = f && d.markerAttribs;
                a = a || "";
                if (!(a === this.state && !b || this.selected && "select" !== a || !1 === e.enabled || a && (k || h && !1 === g.enabled) || a && r.states && r.states[a] && !1 === r.states[a].enabled)) {
                    this.state = a;
                    v && (x = d.markerAttribs(this, a));
                    if (this.graphic) {
                        c && this.graphic.removeClass("highcharts-point-" + c);
                        a && this.graphic.addClass("highcharts-point-" +
                            a);
                        if (!q.styledMode) {
                            var F = d.pointAttribs(this, a);
                            var A = y(q.options.chart.animation, e.animation);
                            d.options.inactiveOtherPoints && ((this.dataLabels || []).forEach(function(a) {
                                a && a.animate({
                                    opacity: F.opacity
                                }, A)
                            }), this.connector && this.connector.animate({
                                opacity: F.opacity
                            }, A));
                            this.graphic.animate(F, A)
                        }
                        x && this.graphic.animate(x, y(q.options.chart.animation, g.animation, f.animation));
                        n && n.hide()
                    } else {
                        if (a && g) {
                            c = r.symbol || d.symbol;
                            n && n.currentSymbol !== c && (n = n.destroy());
                            if (x)
                                if (n) n[b ? "animate" : "attr"]({
                                    x: x.x,
                                    y: x.y
                                });
                                else c && (d.stateMarkerGraphic = n = q.renderer.symbol(c, x.x, x.y, x.width, x.height).add(d.markerGroup), n.currentSymbol = c);
                                !q.styledMode && n && n.attr(d.pointAttribs(this, a))
                        }
                        n && (n[a && this.isInside ? "show" : "hide"](), n.element.point = this)
                    }
                    a = e.halo;
                    e = (n = this.graphic || n) && n.visibility || "inherit";
                    a && a.size && n && "hidden" !== e ? (p || (d.halo = p = q.renderer.path().add(n.parentGroup)), p.show()[b ? "animate" : "attr"]({
                        d: this.haloPath(a.size)
                    }), p.attr({
                        "class": "highcharts-halo highcharts-color-" + y(this.colorIndex, d.colorIndex) +
                            (this.className ? " " + this.className : ""),
                        visibility: e,
                        zIndex: -1
                    }), p.point = this, q.styledMode || p.attr(D({
                        fill: this.color || d.color,
                        "fill-opacity": a.opacity
                    }, a.attributes))) : p && p.point && p.point.haloPath && p.animate({
                        d: p.point.haloPath(0)
                    }, null, p.hide);
                    w(this, "afterSetState")
                }
            },
            haloPath: function(a) {
                return this.series.chart.renderer.symbols.circle(Math.floor(this.plotX) - a, this.plotY - a, 2 * a, 2 * a)
            }
        });
        D(a.prototype, {
            onMouseOver: function() {
                var a = this.chart,
                    b = a.hoverSeries;
                if (b && b !== this) b.onMouseOut();
                this.options.events.mouseOver &&
                    w(this, "mouseOver");
                this.setState("hover");
                a.hoverSeries = this
            },
            onMouseOut: function() {
                var a = this.options,
                    b = this.chart,
                    d = b.tooltip,
                    c = b.hoverPoint;
                b.hoverSeries = null;
                if (c) c.onMouseOut();
                this && a.events.mouseOut && w(this, "mouseOut");
                !d || this.stickyTracking || d.shared && !this.noSharedTooltip || d.hide();
                b.series.forEach(function(a) {
                    a.setState("", !0)
                })
            },
            setState: function(a, b) {
                var d = this,
                    c = d.options,
                    e = d.graph,
                    f = c.inactiveOtherPoints,
                    h = c.states,
                    g = c.lineWidth,
                    k = c.opacity,
                    n = y(h[a || "normal"] && h[a || "normal"].animation,
                        d.chart.options.chart.animation);
                c = 0;
                a = a || "";
                if (d.state !== a && ([d.group, d.markerGroup, d.dataLabelsGroup].forEach(function(b) {
                        b && (d.state && b.removeClass("highcharts-series-" + d.state), a && b.addClass("highcharts-series-" + a))
                    }), d.state = a, !d.chart.styledMode)) {
                    if (h[a] && !1 === h[a].enabled) return;
                    a && (g = h[a].lineWidth || g + (h[a].lineWidthPlus || 0), k = y(h[a].opacity, k));
                    if (e && !e.dashstyle)
                        for (h = {
                                "stroke-width": g
                            }, e.animate(h, n); d["zone-graph-" + c];) d["zone-graph-" + c].attr(h), c += 1;
                    f || [d.group, d.markerGroup, d.dataLabelsGroup,
                        d.labelBySeries
                    ].forEach(function(a) {
                        a && a.animate({
                            opacity: k
                        }, n)
                    })
                }
                b && f && d.points && d.setAllPointsToState(a)
            },
            setAllPointsToState: function(a) {
                this.points.forEach(function(b) {
                    b.setState && b.setState(a)
                })
            },
            setVisible: function(a, b) {
                var d = this,
                    c = d.chart,
                    e = d.legendItem,
                    f = c.options.chart.ignoreHiddenSeries,
                    h = d.visible;
                var g = (d.visible = a = d.options.visible = d.userOptions.visible = void 0 === a ? !h : a) ? "show" : "hide";
                ["group", "dataLabelsGroup", "markerGroup", "tracker", "tt"].forEach(function(a) {
                    if (d[a]) d[a][g]()
                });
                if (c.hoverSeries ===
                    d || (c.hoverPoint && c.hoverPoint.series) === d) d.onMouseOut();
                e && c.legend.colorizeItem(d, a);
                d.isDirty = !0;
                d.options.stacking && c.series.forEach(function(a) {
                    a.options.stacking && a.visible && (a.isDirty = !0)
                });
                d.linkedSeries.forEach(function(b) {
                    b.setVisible(a, !1)
                });
                f && (c.isDirtyBox = !0);
                w(d, g);
                !1 !== b && c.redraw()
            },
            show: function() {
                this.setVisible(!0)
            },
            hide: function() {
                this.setVisible(!1)
            },
            select: function(a) {
                this.selected = a = this.options.selected = void 0 === a ? !this.selected : a;
                this.checkbox && (this.checkbox.checked = a);
                w(this, a ? "select" : "unselect")
            },
            drawTracker: F.drawTrackerGraph
        })
    });
    K(C, "parts/Responsive.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H = f.isArray,
            D = f.isObject,
            A = f.objectEach,
            E = f.pick,
            p = f.splat;
        f = c.Chart;
        f.prototype.setResponsive = function(f, p) {
            var v = this.options.responsive,
                q = [],
                k = this.currentResponsive;
            !p && v && v.rules && v.rules.forEach(function(f) {
                void 0 === f._id && (f._id = c.uniqueKey());
                this.matchResponsiveRule(f, q)
            }, this);
            p = c.merge.apply(0, q.map(function(f) {
                return c.find(v.rules,
                    function(c) {
                        return c._id === f
                    }).chartOptions
            }));
            p.isResponsiveOptions = !0;
            q = q.toString() || void 0;
            q !== (k && k.ruleIds) && (k && this.update(k.undoOptions, f, !0), q ? (k = this.currentOptions(p), k.isResponsiveOptions = !0, this.currentResponsive = {
                ruleIds: q,
                mergedOptions: p,
                undoOptions: k
            }, this.update(p, f, !0)) : this.currentResponsive = void 0)
        };
        f.prototype.matchResponsiveRule = function(c, f) {
            var p = c.condition;
            (p.callback || function() {
                return this.chartWidth <= E(p.maxWidth, Number.MAX_VALUE) && this.chartHeight <= E(p.maxHeight, Number.MAX_VALUE) &&
                    this.chartWidth >= E(p.minWidth, 0) && this.chartHeight >= E(p.minHeight, 0)
            }).call(this) && f.push(c._id)
        };
        f.prototype.currentOptions = function(c) {
            function f(c, m, q, g) {
                var e;
                A(c, function(b, d) {
                    if (!g && -1 < v.collectionsWithUpdate.indexOf(d))
                        for (b = p(b), q[d] = [], e = 0; e < b.length; e++) m[d][e] && (q[d][e] = {}, f(b[e], m[d][e], q[d][e], g + 1));
                    else D(b) ? (q[d] = H(b) ? [] : {}, f(b, m[d] || {}, q[d], g + 1)) : q[d] = void 0 === m[d] ? null : m[d]
                })
            }
            var v = this,
                q = {};
            f(c, this.options, q, 0);
            return q
        }
    });
    K(C, "masters/highcharts.src.js", [C["parts/Globals.js"],
        C["parts/Utilities.js"]
    ], function(c, f) {
        var H = f.extend;
        H(c, {
            arrayMax: f.arrayMax,
            arrayMin: f.arrayMin,
            attr: f.attr,
            defined: f.defined,
            erase: f.erase,
            extend: f.extend,
            isArray: f.isArray,
            isClass: f.isClass,
            isDOMElement: f.isDOMElement,
            isNumber: f.isNumber,
            isObject: f.isObject,
            isString: f.isString,
            objectEach: f.objectEach,
            pick: f.pick,
            pInt: f.pInt,
            setAnimation: f.setAnimation,
            splat: f.splat,
            syncTimeout: f.syncTimeout
        });
        return c
    });
    K(C, "parts-map/MapAxis.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var H =
            f.pick;
        f = c.addEvent;
        c = c.Axis;
        f(c, "getSeriesExtremes", function() {
            var c = [];
            this.isXAxis && (this.series.forEach(function(f, E) {
                f.useMapGeometry && (c[E] = f.xData, f.xData = [])
            }), this.seriesXData = c)
        });
        f(c, "afterGetSeriesExtremes", function() {
            var c = this.seriesXData,
                f;
            if (this.isXAxis) {
                var E = H(this.dataMin, Number.MAX_VALUE);
                var p = H(this.dataMax, -Number.MAX_VALUE);
                this.series.forEach(function(A, D) {
                    A.useMapGeometry && (E = Math.min(E, H(A.minX, E)), p = Math.max(p, H(A.maxX, p)), A.xData = c[D], f = !0)
                });
                f && (this.dataMin = E, this.dataMax =
                    p);
                delete this.seriesXData
            }
        });
        f(c, "afterSetAxisTranslation", function() {
            var c = this.chart;
            var f = c.plotWidth / c.plotHeight;
            c = c.xAxis[0];
            var E;
            "yAxis" === this.coll && void 0 !== c.transA && this.series.forEach(function(c) {
                c.preserveAspectRatio && (E = !0)
            });
            if (E && (this.transA = c.transA = Math.min(this.transA, c.transA), f /= (c.max - c.min) / (this.max - this.min), f = 1 > f ? this : c, c = (f.max - f.min) * f.transA, f.pixelPadding = f.len - c, f.minPixelPadding = f.pixelPadding / 2, c = f.fixTo)) {
                c = c[1] - f.toValue(c[0], !0);
                c *= f.transA;
                if (Math.abs(c) > f.minPixelPadding ||
                    f.min === f.dataMin && f.max === f.dataMax) c = 0;
                f.minPixelPadding -= c
            }
        });
        f(c, "render", function() {
            this.fixTo = null
        })
    });
    K(C, "parts-map/ColorSeriesMixin.js", [C["parts/Globals.js"]], function(c) {
        c.colorPointMixin = {
            setVisible: function(c) {
                var f = this,
                    D = c ? "show" : "hide";
                f.visible = !!c;
                ["graphic", "dataLabel"].forEach(function(c) {
                    if (f[c]) f[c][D]()
                })
            }
        };
        c.colorSeriesMixin = {
            optionalAxis: "colorAxis",
            colorAxis: 0,
            translateColors: function() {
                var c = this,
                    C = this.options.nullColor,
                    D = this.colorAxis,
                    A = this.colorKey;
                (this.data.length ?
                    this.data : this.points).forEach(function(f) {
                    var p = f[A];
                    if (p = f.options.color || (f.isNull ? C : D && void 0 !== p ? D.toColor(p, f) : f.color || c.color)) f.color = p
                })
            }
        }
    });
    K(C, "parts-map/ColorAxis.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var C = f.erase,
            D = f.extend,
            A = f.isNumber,
            E = f.pick,
            p = f.splat;
        f = c.addEvent;
        var y = c.Axis,
            G = c.Chart,
            v = c.Series,
            q = c.Point,
            k = c.color,
            m = c.Legend,
            w = c.LegendSymbolMixin,
            g = c.colorPointMixin,
            e = c.noop,
            b = c.merge;
        D(v.prototype, c.colorSeriesMixin);
        D(q.prototype, g);
        var d = c.ColorAxis =
            function() {
                this.init.apply(this, arguments)
            };
        D(d.prototype, y.prototype);
        D(d.prototype, {
            defaultColorAxisOptions: {
                lineWidth: 0,
                minPadding: 0,
                maxPadding: 0,
                gridLineWidth: 1,
                tickPixelInterval: 72,
                startOnTick: !0,
                endOnTick: !0,
                offset: 0,
                marker: {
                    animation: {
                        duration: 50
                    },
                    width: .01,
                    color: "#999999"
                },
                labels: {
                    overflow: "justify",
                    rotation: 0
                },
                minColor: "#e6ebf5",
                maxColor: "#003399",
                tickLength: 5,
                showInLegend: !0
            },
            keepProps: ["legendGroup", "legendItemHeight", "legendItemWidth", "legendItem", "legendSymbol"].concat(y.prototype.keepProps),
            init: function(a, b) {
                this.coll = "colorAxis";
                var d = this.buildOptions.call(a, this.defaultColorAxisOptions, b);
                y.prototype.init.call(this, a, d);
                b.dataClasses && this.initDataClasses(b);
                this.initStops();
                this.horiz = !d.opposite;
                this.zoomEnabled = !1;
                this.defaultLegendLength = 200
            },
            initDataClasses: function(a) {
                var d = this.chart,
                    c, e = 0,
                    f = d.options.chart.colorCount,
                    g = this.options,
                    l = a.dataClasses.length;
                this.dataClasses = c = [];
                this.legendItems = [];
                a.dataClasses.forEach(function(a, h) {
                    a = b(a);
                    c.push(a);
                    if (d.styledMode || !a.color) "category" ===
                        g.dataClassColor ? (d.styledMode || (h = d.options.colors, f = h.length, a.color = h[e]), a.colorIndex = e, e++, e === f && (e = 0)) : a.color = k(g.minColor).tweenTo(k(g.maxColor), 2 > l ? .5 : h / (l - 1))
                })
            },
            hasData: function() {
                return !(!this.tickPositions || !this.tickPositions.length)
            },
            setTickPositions: function() {
                if (!this.dataClasses) return y.prototype.setTickPositions.call(this)
            },
            initStops: function() {
                this.stops = this.options.stops || [
                    [0, this.options.minColor],
                    [1, this.options.maxColor]
                ];
                this.stops.forEach(function(a) {
                    a.color = k(a[1])
                })
            },
            buildOptions: function(a, d) {
                var c = this.options.legend,
                    e = d.layout ? "vertical" !== d.layout : "vertical" !== c.layout;
                return b(a, {
                    side: e ? 2 : 1,
                    reversed: !e
                }, d, {
                    opposite: !e,
                    showEmpty: !1,
                    title: null,
                    visible: c.enabled && (d ? !1 !== d.visible : !0)
                })
            },
            setOptions: function(a) {
                y.prototype.setOptions.call(this, a);
                this.options.crosshair = this.options.marker
            },
            setAxisSize: function() {
                var a = this.legendSymbol,
                    b = this.chart,
                    d = b.options.legend || {},
                    c, e;
                a ? (this.left = d = a.attr("x"), this.top = c = a.attr("y"), this.width = e = a.attr("width"), this.height =
                    a = a.attr("height"), this.right = b.chartWidth - d - e, this.bottom = b.chartHeight - c - a, this.len = this.horiz ? e : a, this.pos = this.horiz ? d : c) : this.len = (this.horiz ? d.symbolWidth : d.symbolHeight) || this.defaultLegendLength
            },
            normalizedValue: function(a) {
                this.isLog && (a = this.val2lin(a));
                return 1 - (this.max - a) / (this.max - this.min || 1)
            },
            toColor: function(a, b) {
                var d = this.stops,
                    c = this.dataClasses,
                    e;
                if (c)
                    for (e = c.length; e--;) {
                        var f = c[e];
                        var h = f.from;
                        d = f.to;
                        if ((void 0 === h || a >= h) && (void 0 === d || a <= d)) {
                            var g = f.color;
                            b && (b.dataClass = e,
                                b.colorIndex = f.colorIndex);
                            break
                        }
                    } else {
                        a = this.normalizedValue(a);
                        for (e = d.length; e-- && !(a > d[e][0]););
                        h = d[e] || d[e + 1];
                        d = d[e + 1] || h;
                        a = 1 - (d[0] - a) / (d[0] - h[0] || 1);
                        g = h.color.tweenTo(d.color, a)
                    }
                return g
            },
            getOffset: function() {
                var a = this.legendGroup,
                    b = this.chart.axisOffset[this.side];
                a && (this.axisParent = a, y.prototype.getOffset.call(this), this.added || (this.added = !0, this.labelLeft = 0, this.labelRight = this.width), this.chart.axisOffset[this.side] = b)
            },
            setLegendColor: function() {
                var a = this.reversed;
                var b = a ? 1 : 0;
                a = a ? 0 :
                    1;
                b = this.horiz ? [b, 0, a, 0] : [0, a, 0, b];
                this.legendColor = {
                    linearGradient: {
                        x1: b[0],
                        y1: b[1],
                        x2: b[2],
                        y2: b[3]
                    },
                    stops: this.stops
                }
            },
            drawLegendSymbol: function(a, b) {
                var d = a.padding,
                    c = a.options,
                    e = this.horiz,
                    f = E(c.symbolWidth, e ? this.defaultLegendLength : 12),
                    h = E(c.symbolHeight, e ? 12 : this.defaultLegendLength),
                    g = E(c.labelPadding, e ? 16 : 30);
                c = E(c.itemDistance, 10);
                this.setLegendColor();
                b.legendSymbol = this.chart.renderer.rect(0, a.baseline - 11, f, h).attr({
                    zIndex: 1
                }).add(b.legendGroup);
                this.legendItemWidth = f + d + (e ? c : g);
                this.legendItemHeight =
                    h + d + (e ? g : 0)
            },
            setState: function(a) {
                this.series.forEach(function(b) {
                    b.setState(a)
                })
            },
            visible: !0,
            setVisible: e,
            getSeriesExtremes: function() {
                var a = this.series,
                    b = a.length,
                    d;
                this.dataMin = Infinity;
                for (this.dataMax = -Infinity; b--;) {
                    var c = a[b];
                    var e = c.colorKey = E(c.options.colorKey, c.colorKey, c.pointValKey, c.zoneAxis, "y");
                    var f = c.pointArrayMap;
                    var g = c[e + "Min"] && c[e + "Max"];
                    if (c[e + "Data"]) var k = c[e + "Data"];
                    else if (f) {
                        k = [];
                        f = f.indexOf(e);
                        var m = c.yData;
                        if (0 <= f && m)
                            for (d = 0; d < m.length; d++) k.push(E(m[d][f], m[d]))
                    } else k =
                        c.yData;
                    g ? (c.minColorValue = c[e + "Min"], c.maxColorValue = c[e + "Max"]) : (v.prototype.getExtremes.call(c, k), c.minColorValue = c.dataMin, c.maxColorValue = c.dataMax);
                    void 0 !== c.minColorValue && (this.dataMin = Math.min(this.dataMin, c.minColorValue), this.dataMax = Math.max(this.dataMax, c.maxColorValue));
                    g || v.prototype.getExtremes.call(c)
                }
            },
            drawCrosshair: function(a, b) {
                var d = b && b.plotX,
                    c = b && b.plotY,
                    e = this.pos,
                    f = this.len;
                if (b) {
                    var h = this.toPixels(b[b.series.colorKey]);
                    h < e ? h = e - 2 : h > e + f && (h = e + f + 2);
                    b.plotX = h;
                    b.plotY = this.len -
                        h;
                    y.prototype.drawCrosshair.call(this, a, b);
                    b.plotX = d;
                    b.plotY = c;
                    this.cross && !this.cross.addedToColorAxis && this.legendGroup && (this.cross.addClass("highcharts-coloraxis-marker").add(this.legendGroup), this.cross.addedToColorAxis = !0, this.chart.styledMode || this.cross.attr({
                        fill: this.crosshair.color
                    }))
                }
            },
            getPlotLinePath: function(a) {
                var b = a.translatedValue;
                return A(b) ? this.horiz ? ["M", b - 4, this.top - 6, "L", b + 4, this.top - 6, b, this.top, "Z"] : ["M", this.left, b, "L", this.left - 6, b + 6, this.left - 6, b - 6, "Z"] : y.prototype.getPlotLinePath.apply(this,
                    arguments)
            },
            update: function(a, d) {
                var c = this.chart,
                    e = c.legend,
                    f = this.buildOptions.call(c, {}, a);
                this.series.forEach(function(a) {
                    a.isDirtyData = !0
                });
                (a.dataClasses && e.allItems || this.dataClasses) && this.destroyItems();
                c.options[this.coll] = b(this.userOptions, f);
                y.prototype.update.call(this, f, d);
                this.legendItem && (this.setLegendColor(), e.colorizeItem(this, !0))
            },
            destroyItems: function() {
                var a = this.chart;
                this.legendItem ? a.legend.destroyItem(this) : this.legendItems && this.legendItems.forEach(function(b) {
                    a.legend.destroyItem(b)
                });
                a.isDirtyLegend = !0
            },
            remove: function(a) {
                this.destroyItems();
                y.prototype.remove.call(this, a)
            },
            getDataClassLegendSymbols: function() {
                var a = this,
                    b = this.chart,
                    d = this.legendItems,
                    f = b.options.legend,
                    g = f.valueDecimals,
                    k = f.valueSuffix || "",
                    l;
                d.length || this.dataClasses.forEach(function(f, h) {
                    var n = !0,
                        m = f.from,
                        r = f.to;
                    l = "";
                    void 0 === m ? l = "< " : void 0 === r && (l = "> ");
                    void 0 !== m && (l += c.numberFormat(m, g) + k);
                    void 0 !== m && void 0 !== r && (l += " - ");
                    void 0 !== r && (l += c.numberFormat(r, g) + k);
                    d.push(D({
                        chart: b,
                        name: l,
                        options: {},
                        drawLegendSymbol: w.drawRectangle,
                        visible: !0,
                        setState: e,
                        isDataClass: !0,
                        setVisible: function() {
                            n = this.visible = !n;
                            a.series.forEach(function(a) {
                                a.points.forEach(function(a) {
                                    a.dataClass === h && a.setVisible(n)
                                })
                            });
                            b.legend.colorizeItem(this, n)
                        }
                    }, f))
                });
                return d
            },
            beforePadding: !1,
            name: ""
        });
        ["fill", "stroke"].forEach(function(a) {
            c.Fx.prototype[a + "Setter"] = function() {
                this.elem.attr(a, k(this.start).tweenTo(k(this.end), this.pos), null, !0)
            }
        });
        f(G, "afterGetAxes", function() {
            var a = this,
                b = a.options;
            this.colorAxis = [];
            b.colorAxis && (b.colorAxis = p(b.colorAxis),
                b.colorAxis.forEach(function(b, c) {
                    b.index = c;
                    new d(a, b)
                }))
        });
        f(v, "bindAxes", function() {
            var a = this.axisTypes;
            a ? -1 === a.indexOf("colorAxis") && a.push("colorAxis") : this.axisTypes = ["colorAxis"]
        });
        f(m, "afterGetAllItems", function(a) {
            var b = [],
                d, c;
            (this.chart.colorAxis || []).forEach(function(c) {
                (d = c.options) && d.showInLegend && (d.dataClasses && d.visible ? b = b.concat(c.getDataClassLegendSymbols()) : d.visible && b.push(c), c.series.forEach(function(b) {
                    if (!b.options.showInLegend || d.dataClasses) "point" === b.options.legendType ?
                        b.points.forEach(function(b) {
                            C(a.allItems, b)
                        }) : C(a.allItems, b)
                }))
            });
            for (c = b.length; c--;) a.allItems.unshift(b[c])
        });
        f(m, "afterColorizeItem", function(a) {
            a.visible && a.item.legendColor && a.item.legendSymbol.attr({
                fill: a.item.legendColor
            })
        });
        f(m, "afterUpdate", function() {
            var a = this.chart.colorAxis;
            a && a.forEach(function(a, b, d) {
                a.update({}, d)
            })
        });
        f(v, "afterTranslate", function() {
            (this.chart.colorAxis && this.chart.colorAxis.length || this.colorAttribs) && this.translateColors()
        })
    });
    K(C, "parts-map/ColorMapSeriesMixin.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var C = f.defined;
        f = c.noop;
        var D = c.seriesTypes;
        c.colorMapPointMixin = {
            dataLabelOnNull: !0,
            isValid: function() {
                return null !== this.value && Infinity !== this.value && -Infinity !== this.value
            },
            setState: function(f) {
                c.Point.prototype.setState.call(this, f);
                this.graphic && this.graphic.attr({
                    zIndex: "hover" === f ? 1 : 0
                })
            }
        };
        c.colorMapSeriesMixin = {
            pointArrayMap: ["value"],
            axisTypes: ["xAxis", "yAxis", "colorAxis"],
            trackerGroups: ["group", "markerGroup", "dataLabelsGroup"],
            getSymbol: f,
            parallelArrays: ["x", "y", "value"],
            colorKey: "value",
            pointAttribs: D.column.prototype.pointAttribs,
            colorAttribs: function(c) {
                var f = {};
                C(c.color) && (f[this.colorProp || "fill"] = c.color);
                return f
            }
        }
    });
    K(C, "parts-map/MapNavigation.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        function C(c) {
            c && (c.preventDefault && c.preventDefault(), c.stopPropagation && c.stopPropagation(), c.cancelBubble = !0)
        }
        function D(c) {
            this.init(c)
        }
        var A = f.extend,
            E = f.objectEach,
            p = f.pick,
            y = c.addEvent;
        f = c.Chart;
        var G =
            c.doc,
            v = c.merge;
        D.prototype.init = function(c) {
            this.chart = c;
            c.mapNavButtons = []
        };
        D.prototype.update = function(c) {
            var f = this.chart,
                m = f.options.mapNavigation,
                q, g, e, b, d, a = function(a) {
                    this.handler.call(f, a);
                    C(a)
                },
                h = f.mapNavButtons;
            c && (m = f.options.mapNavigation = v(f.options.mapNavigation, c));
            for (; h.length;) h.pop().destroy();
            p(m.enableButtons, m.enabled) && !f.renderer.forExport && E(m.buttons, function(c, k) {
                q = v(m.buttonOptions, c);
                f.styledMode || (g = q.theme, g.style = v(q.theme.style, q.style), b = (e = g.states) && e.hover, d =
                    e && e.select);
                c = f.renderer.button(q.text, 0, 0, a, g, b, d, 0, "zoomIn" === k ? "topbutton" : "bottombutton").addClass("highcharts-map-navigation highcharts-" + {
                    zoomIn: "zoom-in",
                    zoomOut: "zoom-out"
                }[k]).attr({
                    width: q.width,
                    height: q.height,
                    title: f.options.lang[k],
                    padding: q.padding,
                    zIndex: 5
                }).add();
                c.handler = q.onclick;
                c.align(A(q, {
                    width: c.width,
                    height: 2 * c.height
                }), null, q.alignTo);
                y(c.element, "dblclick", C);
                h.push(c)
            });
            this.updateEvents(m)
        };
        D.prototype.updateEvents = function(c) {
            var f = this.chart;
            p(c.enableDoubleClickZoom,
                c.enabled) || c.enableDoubleClickZoomTo ? this.unbindDblClick = this.unbindDblClick || y(f.container, "dblclick", function(c) {
                f.pointer.onContainerDblClick(c)
            }) : this.unbindDblClick && (this.unbindDblClick = this.unbindDblClick());
            p(c.enableMouseWheelZoom, c.enabled) ? this.unbindMouseWheel = this.unbindMouseWheel || y(f.container, void 0 === G.onmousewheel ? "DOMMouseScroll" : "mousewheel", function(c) {
                f.pointer.onContainerMouseWheel(c);
                C(c);
                return !1
            }) : this.unbindMouseWheel && (this.unbindMouseWheel = this.unbindMouseWheel())
        };
        A(f.prototype, {
            fitToBox: function(c, f) {
                [
                    ["x", "width"],
                    ["y", "height"]
                ].forEach(function(k) {
                    var m = k[0];
                    k = k[1];
                    c[m] + c[k] > f[m] + f[k] && (c[k] > f[k] ? (c[k] = f[k], c[m] = f[m]) : c[m] = f[m] + f[k] - c[k]);
                    c[k] > f[k] && (c[k] = f[k]);
                    c[m] < f[m] && (c[m] = f[m])
                });
                return c
            },
            mapZoom: function(c, f, m, v, g) {
                var e = this.xAxis[0],
                    b = e.max - e.min,
                    d = p(f, e.min + b / 2),
                    a = b * c;
                b = this.yAxis[0];
                var h = b.max - b.min,
                    k = p(m, b.min + h / 2);
                h *= c;
                d = this.fitToBox({
                    x: d - a * (v ? (v - e.pos) / e.len : .5),
                    y: k - h * (g ? (g - b.pos) / b.len : .5),
                    width: a,
                    height: h
                }, {
                    x: e.dataMin,
                    y: b.dataMin,
                    width: e.dataMax -
                        e.dataMin,
                    height: b.dataMax - b.dataMin
                });
                a = d.x <= e.dataMin && d.width >= e.dataMax - e.dataMin && d.y <= b.dataMin && d.height >= b.dataMax - b.dataMin;
                v && (e.fixTo = [v - e.pos, f]);
                g && (b.fixTo = [g - b.pos, m]);
                void 0 === c || a ? (e.setExtremes(void 0, void 0, !1), b.setExtremes(void 0, void 0, !1)) : (e.setExtremes(d.x, d.x + d.width, !1), b.setExtremes(d.y, d.y + d.height, !1));
                this.redraw()
            }
        });
        y(f, "beforeRender", function() {
            this.mapNavigation = new D(this);
            this.mapNavigation.update()
        });
        c.MapNavigation = D
    });
    K(C, "parts-map/MapPointer.js", [C["parts/Globals.js"],
        C["parts/Utilities.js"]
    ], function(c, f) {
        var C = f.extend,
            D = f.pick;
        f = c.Pointer;
        c = c.wrap;
        C(f.prototype, {
            onContainerDblClick: function(c) {
                var f = this.chart;
                c = this.normalize(c);
                f.options.mapNavigation.enableDoubleClickZoomTo ? f.pointer.inClass(c.target, "highcharts-tracker") && f.hoverPoint && f.hoverPoint.zoomTo() : f.isInsidePlot(c.chartX - f.plotLeft, c.chartY - f.plotTop) && f.mapZoom(.5, f.xAxis[0].toValue(c.chartX), f.yAxis[0].toValue(c.chartY), c.chartX, c.chartY)
            },
            onContainerMouseWheel: function(c) {
                var f = this.chart;
                c =
                    this.normalize(c);
                var p = c.detail || -(c.wheelDelta / 120);
                f.isInsidePlot(c.chartX - f.plotLeft, c.chartY - f.plotTop) && f.mapZoom(Math.pow(f.options.mapNavigation.mouseWheelSensitivity, p), f.xAxis[0].toValue(c.chartX), f.yAxis[0].toValue(c.chartY), c.chartX, c.chartY)
            }
        });
        c(f.prototype, "zoomOption", function(c) {
            var f = this.chart.options.mapNavigation;
            D(f.enableTouchZoom, f.enabled) && (this.chart.options.chart.pinchType = "xy");
            c.apply(this, [].slice.call(arguments, 1))
        });
        c(f.prototype, "pinchTranslate", function(c, f, p, y,
            D, v, q) {
            c.call(this, f, p, y, D, v, q);
            "map" === this.chart.options.chart.type && this.hasZoom && (c = y.scaleX > y.scaleY, this.pinchTranslateDirection(!c, f, p, y, D, v, q, c ? y.scaleX : y.scaleY))
        })
    });
    K(C, "parts-map/MapSeries.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var C = f.extend,
            D = f.isArray,
            A = f.isNumber,
            E = f.objectEach,
            p = f.pick,
            y = f.splat;
        f = c.colorMapPointMixin;
        var G = c.merge,
            v = c.noop,
            q = c.fireEvent,
            k = c.Point,
            m = c.Series,
            w = c.seriesType,
            g = c.seriesTypes;
        w("map", "scatter", {
            animation: !1,
            dataLabels: {
                crop: !1,
                formatter: function() {
                    return this.point.value
                },
                inside: !0,
                overflow: !1,
                padding: 0,
                verticalAlign: "middle"
            },
            marker: null,
            nullColor: "#f7f7f7",
            stickyTracking: !1,
            tooltip: {
                followPointer: !0,
                pointFormat: "{point.name}: {point.value}<br/>"
            },
            turboThreshold: 0,
            allAreas: !0,
            borderColor: "#cccccc",
            borderWidth: 1,
            joinBy: "hc-key",
            states: {
                hover: {
                    halo: null,
                    brightness: .2
                },
                normal: {
                    animation: !0
                },
                select: {
                    color: "#cccccc"
                },
                inactive: {
                    opacity: 1
                }
            }
        }, G(c.colorMapSeriesMixin, {
            type: "map",
            getExtremesFromAll: !0,
            useMapGeometry: !0,
            forceDL: !0,
            searchPoint: v,
            directTouch: !0,
            preserveAspectRatio: !0,
            pointArrayMap: ["value"],
            setOptions: function(c) {
                c = m.prototype.setOptions.call(this, c);
                var b = c.joinBy;
                null === b && (b = "_i");
                b = this.joinBy = y(b);
                b[1] || (b[1] = b[0]);
                return c
            },
            getBox: function(e) {
                var b = Number.MAX_VALUE,
                    d = -b,
                    a = b,
                    f = -b,
                    g = b,
                    k = b,
                    m = this.xAxis,
                    q = this.yAxis,
                    l;
                (e || []).forEach(function(e) {
                    if (e.path) {
                        "string" === typeof e.path && (e.path = c.splitPath(e.path));
                        var h = e.path || [],
                            n = h.length,
                            m = !1,
                            r = -b,
                            q = b,
                            t = -b,
                            x = b,
                            v = e.properties;
                        if (!e._foundBox) {
                            for (; n--;) A(h[n]) &&
                                (m ? (r = Math.max(r, h[n]), q = Math.min(q, h[n])) : (t = Math.max(t, h[n]), x = Math.min(x, h[n])), m = !m);
                            e._midX = q + (r - q) * p(e.middleX, v && v["hc-middle-x"], .5);
                            e._midY = x + (t - x) * p(e.middleY, v && v["hc-middle-y"], .5);
                            e._maxX = r;
                            e._minX = q;
                            e._maxY = t;
                            e._minY = x;
                            e.labelrank = p(e.labelrank, (r - q) * (t - x));
                            e._foundBox = !0
                        }
                        d = Math.max(d, e._maxX);
                        a = Math.min(a, e._minX);
                        f = Math.max(f, e._maxY);
                        g = Math.min(g, e._minY);
                        k = Math.min(e._maxX - e._minX, e._maxY - e._minY, k);
                        l = !0
                    }
                });
                l && (this.minY = Math.min(g, p(this.minY, b)), this.maxY = Math.max(f, p(this.maxY, -b)), this.minX = Math.min(a, p(this.minX, b)), this.maxX = Math.max(d, p(this.maxX, -b)), m && void 0 === m.options.minRange && (m.minRange = Math.min(5 * k, (this.maxX - this.minX) / 5, m.minRange || b)), q && void 0 === q.options.minRange && (q.minRange = Math.min(5 * k, (this.maxY - this.minY) / 5, q.minRange || b)))
            },
            hasData: function() {
                return !!this.processedXData.length
            },
            getExtremes: function() {
                m.prototype.getExtremes.call(this, this.valueData);
                this.chart.hasRendered && this.isDirtyData && this.getBox(this.options.data);
                this.valueMin = this.dataMin;
                this.valueMax = this.dataMax;
                this.dataMin = this.minY;
                this.dataMax = this.maxY
            },
            translatePath: function(c) {
                var b = !1,
                    d = this.xAxis,
                    a = this.yAxis,
                    e = d.min,
                    f = d.transA;
                d = d.minPixelPadding;
                var g = a.min,
                    k = a.transA;
                a = a.minPixelPadding;
                var m, l = [];
                if (c)
                    for (m = c.length; m--;) A(c[m]) ? (l[m] = b ? (c[m] - e) * f + d : (c[m] - g) * k + a, b = !b) : l[m] = c[m];
                return l
            },
            setData: function(e, b, d, a) {
                var f = this.options,
                    g = this.chart.options.chart,
                    k = g && g.map,
                    r = f.mapData,
                    q = this.joinBy,
                    l = f.keys || this.pointArrayMap,
                    p = [],
                    v = {},
                    w = this.chart.mapTransforms;
                !r && k &&
                    (r = "string" === typeof k ? c.maps[k] : k);
                e && e.forEach(function(a, b) {
                    var d = 0;
                    if (A(a)) e[b] = {
                        value: a
                    };
                    else if (D(a)) {
                        e[b] = {};
                        !f.keys && a.length > l.length && "string" === typeof a[0] && (e[b]["hc-key"] = a[0], ++d);
                        for (var h = 0; h < l.length; ++h, ++d) l[h] && void 0 !== a[d] && (0 < l[h].indexOf(".") ? c.Point.prototype.setNestedProperty(e[b], a[d], l[h]) : e[b][l[h]] = a[d])
                    }
                    q && "_i" === q[0] && (e[b]._i = b)
                });
                this.getBox(e);
                (this.chart.mapTransforms = w = g && g.mapTransforms || r && r["hc-transform"] || w) && E(w, function(a) {
                    a.rotation && (a.cosAngle = Math.cos(a.rotation),
                        a.sinAngle = Math.sin(a.rotation))
                });
                if (r) {
                    "FeatureCollection" === r.type && (this.mapTitle = r.title, r = c.geojson(r, this.type, this));
                    this.mapData = r;
                    this.mapMap = {};
                    for (w = 0; w < r.length; w++) g = r[w], k = g.properties, g._i = w, q[0] && k && k[q[0]] && (g[q[0]] = k[q[0]]), v[g[q[0]]] = g;
                    this.mapMap = v;
                    e && q[1] && e.forEach(function(a) {
                        v[a[q[1]]] && p.push(v[a[q[1]]])
                    });
                    f.allAreas ? (this.getBox(r), e = e || [], q[1] && e.forEach(function(a) {
                        p.push(a[q[1]])
                    }), p = "|" + p.map(function(a) {
                        return a && a[q[0]]
                    }).join("|") + "|", r.forEach(function(b) {
                        q[0] &&
                            -1 !== p.indexOf("|" + b[q[0]] + "|") || (e.push(G(b, {
                                value: null
                            })), a = !1)
                    })) : this.getBox(p)
                }
                m.prototype.setData.call(this, e, b, d, a)
            },
            drawGraph: v,
            drawDataLabels: v,
            doFullTranslate: function() {
                return this.isDirtyData || this.chart.isResizing || this.chart.renderer.isVML || !this.baseTrans
            },
            translate: function() {
                var c = this,
                    b = c.xAxis,
                    d = c.yAxis,
                    a = c.doFullTranslate();
                c.generatePoints();
                c.data.forEach(function(e) {
                    A(e._midX) && A(e._midY) && (e.plotX = b.toPixels(e._midX, !0), e.plotY = d.toPixels(e._midY, !0));
                    a && (e.shapeType = "path",
                        e.shapeArgs = {
                            d: c.translatePath(e.path)
                        })
                });
                q(c, "afterTranslate")
            },
            pointAttribs: function(c, b) {
                b = c.series.chart.styledMode ? this.colorAttribs(c) : g.column.prototype.pointAttribs.call(this, c, b);
                b["stroke-width"] = p(c.options[this.pointAttrToOptions && this.pointAttrToOptions["stroke-width"] || "borderWidth"], "inherit");
                return b
            },
            drawPoints: function() {
                var c = this,
                    b = c.xAxis,
                    d = c.yAxis,
                    a = c.group,
                    f = c.chart,
                    k = f.renderer,
                    m = this.baseTrans;
                c.transformGroup || (c.transformGroup = k.g().attr({
                    scaleX: 1,
                    scaleY: 1
                }).add(a), c.transformGroup.survive = !0);
                if (c.doFullTranslate()) f.hasRendered && !f.styledMode && c.points.forEach(function(a) {
                    a.shapeArgs && (a.shapeArgs.fill = c.pointAttribs(a, a.state).fill)
                }), c.group = c.transformGroup, g.column.prototype.drawPoints.apply(c), c.group = a, c.points.forEach(function(a) {
                    if (a.graphic) {
                        var b = "";
                        a.name && (b += "highcharts-name-" + a.name.replace(/ /g, "-").toLowerCase());
                        a.properties && a.properties["hc-key"] && (b += " highcharts-key-" + a.properties["hc-key"].toLowerCase());
                        b && a.graphic.addClass(b);
                        f.styledMode && a.graphic.css(c.pointAttribs(a,
                            a.selected && "select"))
                    }
                }), this.baseTrans = {
                    originX: b.min - b.minPixelPadding / b.transA,
                    originY: d.min - d.minPixelPadding / d.transA + (d.reversed ? 0 : d.len / d.transA),
                    transAX: b.transA,
                    transAY: d.transA
                }, this.transformGroup.animate({
                    translateX: 0,
                    translateY: 0,
                    scaleX: 1,
                    scaleY: 1
                });
                else {
                    var r = b.transA / m.transAX;
                    var q = d.transA / m.transAY;
                    var l = b.toPixels(m.originX, !0);
                    var t = d.toPixels(m.originY, !0);
                    .99 < r && 1.01 > r && .99 < q && 1.01 > q && (q = r = 1, l = Math.round(l), t = Math.round(t));
                    var v = this.transformGroup;
                    if (f.renderer.globalAnimation) {
                        var w =
                            v.attr("translateX");
                        var z = v.attr("translateY");
                        var u = v.attr("scaleX");
                        var y = v.attr("scaleY");
                        v.attr({
                            animator: 0
                        }).animate({
                            animator: 1
                        }, {
                            step: function(a, b) {
                                v.attr({
                                    translateX: w + (l - w) * b.pos,
                                    translateY: z + (t - z) * b.pos,
                                    scaleX: u + (r - u) * b.pos,
                                    scaleY: y + (q - y) * b.pos
                                })
                            }
                        })
                    } else v.attr({
                        translateX: l,
                        translateY: t,
                        scaleX: r,
                        scaleY: q
                    })
                }
                f.styledMode || a.element.setAttribute("stroke-width", p(c.options[c.pointAttrToOptions && c.pointAttrToOptions["stroke-width"] || "borderWidth"], 1) / (r || 1));
                this.drawMapDataLabels()
            },
            drawMapDataLabels: function() {
                m.prototype.drawDataLabels.call(this);
                this.dataLabelsGroup && this.dataLabelsGroup.clip(this.chart.clipRect)
            },
            render: function() {
                var c = this,
                    b = m.prototype.render;
                c.chart.renderer.isVML && 3E3 < c.data.length ? setTimeout(function() {
                    b.call(c)
                }) : b.call(c)
            },
            animate: function(c) {
                var b = this.options.animation,
                    d = this.group,
                    a = this.xAxis,
                    e = this.yAxis,
                    f = a.pos,
                    g = e.pos;
                this.chart.renderer.isSVG && (!0 === b && (b = {
                    duration: 1E3
                }), c ? d.attr({
                    translateX: f + a.len / 2,
                    translateY: g + e.len / 2,
                    scaleX: .001,
                    scaleY: .001
                }) : (d.animate({
                        translateX: f,
                        translateY: g,
                        scaleX: 1,
                        scaleY: 1
                    },
                    b), this.animate = null))
            },
            animateDrilldown: function(c) {
                var b = this.chart.plotBox,
                    d = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1],
                    a = d.bBox,
                    e = this.chart.options.drilldown.animation;
                c || (c = Math.min(a.width / b.width, a.height / b.height), d.shapeArgs = {
                    scaleX: c,
                    scaleY: c,
                    translateX: a.x,
                    translateY: a.y
                }, this.points.forEach(function(a) {
                    a.graphic && a.graphic.attr(d.shapeArgs).animate({
                        scaleX: 1,
                        scaleY: 1,
                        translateX: 0,
                        translateY: 0
                    }, e)
                }), this.animate = null)
            },
            drawLegendSymbol: c.LegendSymbolMixin.drawRectangle,
            animateDrillupFrom: function(c) {
                g.column.prototype.animateDrillupFrom.call(this, c)
            },
            animateDrillupTo: function(c) {
                g.column.prototype.animateDrillupTo.call(this, c)
            }
        }), C({
            applyOptions: function(c, b) {
                var d = this.series;
                c = k.prototype.applyOptions.call(this, c, b);
                b = d.joinBy;
                d.mapData && ((b = void 0 !== c[b[1]] && d.mapMap[c[b[1]]]) ? (d.xyFromShape && (c.x = b._midX, c.y = b._midY), C(c, b)) : c.value = c.value || null);
                return c
            },
            onMouseOver: function(e) {
                c.clearTimeout(this.colorInterval);
                if (null !== this.value || this.series.options.nullInteraction) k.prototype.onMouseOver.call(this,
                    e);
                else this.series.onMouseOut(e)
            },
            zoomTo: function() {
                var c = this.series;
                c.xAxis.setExtremes(this._minX, this._maxX, !1);
                c.yAxis.setExtremes(this._minY, this._maxY, !1);
                c.chart.redraw()
            }
        }, f));
        ""
    });
    K(C, "parts-map/MapLineSeries.js", [C["parts/Globals.js"]], function(c) {
        var f = c.seriesType,
            C = c.seriesTypes;
        f("mapline", "map", {
            lineWidth: 1,
            fillColor: "none"
        }, {
            type: "mapline",
            colorProp: "stroke",
            pointAttrToOptions: {
                stroke: "color",
                "stroke-width": "lineWidth"
            },
            pointAttribs: function(c, f) {
                c = C.map.prototype.pointAttribs.call(this,
                    c, f);
                c.fill = this.options.fillColor;
                return c
            },
            drawLegendSymbol: C.line.prototype.drawLegendSymbol
        });
        ""
    });
    K(C, "parts-map/MapPointSeries.js", [C["parts/Globals.js"]], function(c) {
        var f = c.merge,
            C = c.Point;
        c = c.seriesType;
        c("mappoint", "scatter", {
            dataLabels: {
                crop: !1,
                defer: !1,
                enabled: !0,
                formatter: function() {
                    return this.point.name
                },
                overflow: !1,
                style: {
                    color: "#000000"
                }
            }
        }, {
            type: "mappoint",
            forceDL: !0
        }, {
            applyOptions: function(c, A) {
                c = void 0 !== c.lat && void 0 !== c.lon ? f(c, this.series.chart.fromLatLonToPoint(c)) : c;
                return C.prototype.applyOptions.call(this,
                    c, A)
            }
        });
        ""
    });
    K(C, "parts-more/BubbleLegend.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var C = f.arrayMax,
            D = f.arrayMin,
            A = f.isNumber,
            E = f.objectEach,
            p = f.pick;
        f = c.Series;
        var y = c.Legend,
            G = c.Chart,
            v = c.addEvent,
            q = c.wrap,
            k = c.color,
            m = c.numberFormat,
            w = c.merge,
            g = c.noop,
            e = c.stableSort,
            b = c.setOptions;
        b({
            legend: {
                bubbleLegend: {
                    borderColor: void 0,
                    borderWidth: 2,
                    className: void 0,
                    color: void 0,
                    connectorClassName: void 0,
                    connectorColor: void 0,
                    connectorDistance: 60,
                    connectorWidth: 1,
                    enabled: !1,
                    labels: {
                        className: void 0,
                        allowOverlap: !1,
                        format: "",
                        formatter: void 0,
                        align: "right",
                        style: {
                            fontSize: 10,
                            color: void 0
                        },
                        x: 0,
                        y: 0
                    },
                    maxSize: 60,
                    minSize: 10,
                    legendIndex: 0,
                    ranges: {
                        value: void 0,
                        borderColor: void 0,
                        color: void 0,
                        connectorColor: void 0
                    },
                    sizeBy: "area",
                    sizeByAbsoluteValue: !1,
                    zIndex: 1,
                    zThreshold: 0
                }
            }
        });
        c.BubbleLegend = function(b, a) {
            this.init(b, a)
        };
        c.BubbleLegend.prototype = {
            init: function(b, a) {
                this.options = b;
                this.visible = !0;
                this.chart = a.chart;
                this.legend = a
            },
            setState: g,
            addToLegend: function(b) {
                b.splice(this.options.legendIndex, 0, this)
            },
            drawLegendSymbol: function(b) {
                var a = this.chart,
                    c = this.options,
                    d = p(b.options.itemDistance, 20),
                    f = c.ranges;
                var g = c.connectorDistance;
                this.fontMetrics = a.renderer.fontMetrics(c.labels.style.fontSize.toString() + "px");
                f && f.length && A(f[0].value) ? (e(f, function(a, b) {
                        return b.value - a.value
                    }), this.ranges = f, this.setOptions(), this.render(), a = this.getMaxLabelSize(), f = this.ranges[0].radius, b = 2 * f, g = g - f + a.width, g = 0 < g ? g : 0, this.maxLabel = a, this.movementX = "left" === c.labels.align ? g : 0, this.legendItemWidth = b + g + d, this.legendItemHeight =
                    b + this.fontMetrics.h / 2) : b.options.bubbleLegend.autoRanges = !0
            },
            setOptions: function() {
                var b = this.ranges,
                    a = this.options,
                    c = this.chart.series[a.seriesIndex],
                    e = this.legend.baseline,
                    f = {
                        "z-index": a.zIndex,
                        "stroke-width": a.borderWidth
                    },
                    g = {
                        "z-index": a.zIndex,
                        "stroke-width": a.connectorWidth
                    },
                    m = this.getLabelStyles(),
                    l = c.options.marker.fillOpacity,
                    q = this.chart.styledMode;
                b.forEach(function(d, h) {
                    q || (f.stroke = p(d.borderColor, a.borderColor, c.color), f.fill = p(d.color, a.color, 1 !== l ? k(c.color).setOpacity(l).get("rgba") :
                        c.color), g.stroke = p(d.connectorColor, a.connectorColor, c.color));
                    b[h].radius = this.getRangeRadius(d.value);
                    b[h] = w(b[h], {
                        center: b[0].radius - b[h].radius + e
                    });
                    q || w(!0, b[h], {
                        bubbleStyle: w(!1, f),
                        connectorStyle: w(!1, g),
                        labelStyle: m
                    })
                }, this)
            },
            getLabelStyles: function() {
                var b = this.options,
                    a = {},
                    c = "left" === b.labels.align,
                    e = this.legend.options.rtl;
                E(b.labels.style, function(b, c) {
                    "color" !== c && "fontSize" !== c && "z-index" !== c && (a[c] = b)
                });
                return w(!1, a, {
                    "font-size": b.labels.style.fontSize,
                    fill: p(b.labels.style.color, "#FFFFFF"),
                    "z-index": b.zIndex,
                    align: e || c ? "right" : "left"
                })
            },
            getRangeRadius: function(b) {
                var a = this.options;
                return this.chart.series[this.options.seriesIndex].getRadius.call(this, a.ranges[a.ranges.length - 1].value, a.ranges[0].value, a.minSize, a.maxSize, b)
            },
            render: function() {
                var b = this.chart.renderer,
                    a = this.options.zThreshold;
                this.symbols || (this.symbols = {
                    connectors: [],
                    bubbleItems: [],
                    labels: []
                });
                this.legendSymbol = b.g("bubble-legend");
                this.legendItem = b.g("bubble-legend-item");
                this.legendSymbol.translateX = 0;
                this.legendSymbol.translateY =
                    0;
                this.ranges.forEach(function(b) {
                    b.value >= a && this.renderRange(b)
                }, this);
                this.legendSymbol.add(this.legendItem);
                this.legendItem.add(this.legendGroup);
                this.hideOverlappingLabels()
            },
            renderRange: function(b) {
                var a = this.options,
                    c = a.labels,
                    d = this.chart.renderer,
                    e = this.symbols,
                    f = e.labels,
                    g = b.center,
                    k = Math.abs(b.radius),
                    m = a.connectorDistance,
                    q = c.align,
                    p = c.style.fontSize;
                m = this.legend.options.rtl || "left" === q ? -m : m;
                c = a.connectorWidth;
                var v = this.ranges[0].radius,
                    u = g - k - a.borderWidth / 2 + c / 2;
                p = p / 2 - (this.fontMetrics.h -
                    p) / 2;
                var w = d.styledMode;
                "center" === q && (m = 0, a.connectorDistance = 0, b.labelStyle.align = "center");
                q = u + a.labels.y;
                var y = v + m + a.labels.x;
                e.bubbleItems.push(d.circle(v, g + ((u % 1 ? 1 : .5) - (c % 2 ? 0 : .5)), k).attr(w ? {} : b.bubbleStyle).addClass((w ? "highcharts-color-" + this.options.seriesIndex + " " : "") + "highcharts-bubble-legend-symbol " + (a.className || "")).add(this.legendSymbol));
                e.connectors.push(d.path(d.crispLine(["M", v, u, "L", v + m, u], a.connectorWidth)).attr(w ? {} : b.connectorStyle).addClass((w ? "highcharts-color-" + this.options.seriesIndex +
                    " " : "") + "highcharts-bubble-legend-connectors " + (a.connectorClassName || "")).add(this.legendSymbol));
                b = d.text(this.formatLabel(b), y, q + p).attr(w ? {} : b.labelStyle).addClass("highcharts-bubble-legend-labels " + (a.labels.className || "")).add(this.legendSymbol);
                f.push(b);
                b.placed = !0;
                b.alignAttr = {
                    x: y,
                    y: q + p
                }
            },
            getMaxLabelSize: function() {
                var b, a;
                this.symbols.labels.forEach(function(c) {
                    a = c.getBBox(!0);
                    b = b ? a.width > b.width ? a : b : a
                });
                return b || {}
            },
            formatLabel: function(b) {
                var a = this.options,
                    d = a.labels.formatter;
                return (a =
                    a.labels.format) ? c.format(a, b) : d ? d.call(b) : m(b.value, 1)
            },
            hideOverlappingLabels: function() {
                var b = this.chart,
                    a = this.symbols;
                !this.options.labels.allowOverlap && a && (b.hideOverlappingLabels(a.labels), a.labels.forEach(function(b, c) {
                    b.newOpacity ? b.newOpacity !== b.oldOpacity && a.connectors[c].show() : a.connectors[c].hide()
                }))
            },
            getRanges: function() {
                var b = this.legend.bubbleLegend,
                    a = b.options.ranges,
                    c, e = Number.MAX_VALUE,
                    f = -Number.MAX_VALUE;
                b.chart.series.forEach(function(a) {
                    a.isBubble && !a.ignoreSeries && (c = a.zData.filter(A),
                        c.length && (e = p(a.options.zMin, Math.min(e, Math.max(D(c), !1 === a.options.displayNegative ? a.options.zThreshold : -Number.MAX_VALUE))), f = p(a.options.zMax, Math.max(f, C(c)))))
                });
                var g = e === f ? [{
                    value: f
                }] : [{
                    value: e
                }, {
                    value: (e + f) / 2
                }, {
                    value: f,
                    autoRanges: !0
                }];
                a.length && a[0].radius && g.reverse();
                g.forEach(function(b, c) {
                    a && a[c] && (g[c] = w(!1, a[c], b))
                });
                return g
            },
            predictBubbleSizes: function() {
                var b = this.chart,
                    a = this.fontMetrics,
                    c = b.legend.options,
                    e = "horizontal" === c.layout,
                    f = e ? b.legend.lastLineHeight : 0,
                    g = b.plotSizeX,
                    k =
                    b.plotSizeY,
                    l = b.series[this.options.seriesIndex];
                b = Math.ceil(l.minPxSize);
                var m = Math.ceil(l.maxPxSize);
                l = l.options.maxSize;
                var q = Math.min(k, g);
                if (c.floating || !/%$/.test(l)) a = m;
                else if (l = parseFloat(l), a = (q + f - a.h / 2) * l / 100 / (l / 100 + 1), e && k - a >= g || !e && g - a >= k) a = m;
                return [b, Math.ceil(a)]
            },
            updateRanges: function(b, a) {
                var c = this.legend.options.bubbleLegend;
                c.minSize = b;
                c.maxSize = a;
                c.ranges = this.getRanges()
            },
            correctSizes: function() {
                var b = this.legend,
                    a = this.chart.series[this.options.seriesIndex];
                1 < Math.abs(Math.ceil(a.maxPxSize) -
                    this.options.maxSize) && (this.updateRanges(this.options.minSize, a.maxPxSize), b.render())
            }
        };
        v(c.Legend, "afterGetAllItems", function(b) {
            var a = this.bubbleLegend,
                d = this.options,
                e = d.bubbleLegend,
                f = this.chart.getVisibleBubbleSeriesIndex();
            a && a.ranges && a.ranges.length && (e.ranges.length && (e.autoRanges = !!e.ranges[0].autoRanges), this.destroyItem(a));
            0 <= f && d.enabled && e.enabled && (e.seriesIndex = f, this.bubbleLegend = new c.BubbleLegend(e, this), this.bubbleLegend.addToLegend(b.allItems))
        });
        G.prototype.getVisibleBubbleSeriesIndex =
            function() {
                for (var b = this.series, a = 0; a < b.length;) {
                    if (b[a] && b[a].isBubble && b[a].visible && b[a].zData.length) return a;
                    a++
                }
                return -1
            };
        y.prototype.getLinesHeights = function() {
            var b = this.allItems,
                a = [],
                c = b.length,
                e, f = 0;
            for (e = 0; e < c; e++)
                if (b[e].legendItemHeight && (b[e].itemHeight = b[e].legendItemHeight), b[e] === b[c - 1] || b[e + 1] && b[e]._legendItemPos[1] !== b[e + 1]._legendItemPos[1]) {
                    a.push({
                        height: 0
                    });
                    var g = a[a.length - 1];
                    for (f; f <= e; f++) b[f].itemHeight > g.height && (g.height = b[f].itemHeight);
                    g.step = e
                }
            return a
        };
        y.prototype.retranslateItems =
            function(b) {
                var a, c, d, e = this.options.rtl,
                    f = 0;
                this.allItems.forEach(function(g, h) {
                    a = g.legendGroup.translateX;
                    c = g._legendItemPos[1];
                    if ((d = g.movementX) || e && g.ranges) d = e ? a - g.options.maxSize / 2 : a + d, g.legendGroup.attr({
                        translateX: d
                    });
                    h > b[f].step && f++;
                    g.legendGroup.attr({
                        translateY: Math.round(c + b[f].height / 2)
                    });
                    g._legendItemPos[1] = c + b[f].height / 2
                })
            };
        v(f, "legendItemClick", function() {
            var b = this.chart,
                a = this.visible,
                c = this.chart.legend;
            c && c.bubbleLegend && (this.visible = !a, this.ignoreSeries = a, b = 0 <= b.getVisibleBubbleSeriesIndex(),
                c.bubbleLegend.visible !== b && (c.update({
                    bubbleLegend: {
                        enabled: b
                    }
                }), c.bubbleLegend.visible = b), this.visible = a)
        });
        q(G.prototype, "drawChartBox", function(b, a, c) {
            var d = this.legend,
                e = 0 <= this.getVisibleBubbleSeriesIndex();
            if (d && d.options.enabled && d.bubbleLegend && d.options.bubbleLegend.autoRanges && e) {
                var f = d.bubbleLegend.options;
                e = d.bubbleLegend.predictBubbleSizes();
                d.bubbleLegend.updateRanges(e[0], e[1]);
                f.placed || (d.group.placed = !1, d.allItems.forEach(function(a) {
                    a.legendGroup.translateY = null
                }));
                d.render();
                this.getMargins();
                this.axes.forEach(function(a) {
                    a.visible && a.render();
                    f.placed || (a.setScale(), a.updateNames(), E(a.ticks, function(a) {
                        a.isNew = !0;
                        a.isNewLabel = !0
                    }))
                });
                f.placed = !0;
                this.getMargins();
                b.call(this, a, c);
                d.bubbleLegend.correctSizes();
                d.retranslateItems(d.getLinesHeights())
            } else b.call(this, a, c), d && d.options.enabled && d.bubbleLegend && (d.render(), d.retranslateItems(d.getLinesHeights()))
        })
    });
    K(C, "parts-more/BubbleSeries.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var C = f.arrayMax,
            D = f.arrayMin,
            A = f.extend,
            E = f.isNumber,
            p = f.pick,
            y = f.pInt;
        f = c.Axis;
        var G = c.color,
            v = c.noop,
            q = c.Point,
            k = c.Series,
            m = c.seriesType,
            w = c.seriesTypes;
        m("bubble", "scatter", {
            dataLabels: {
                formatter: function() {
                    return this.point.z
                },
                inside: !0,
                verticalAlign: "middle"
            },
            animationLimit: 250,
            marker: {
                lineColor: null,
                lineWidth: 1,
                fillOpacity: .5,
                radius: null,
                states: {
                    hover: {
                        radiusPlus: 0
                    }
                },
                symbol: "circle"
            },
            minSize: 8,
            maxSize: "20%",
            softThreshold: !1,
            states: {
                hover: {
                    halo: {
                        size: 5
                    }
                }
            },
            tooltip: {
                pointFormat: "({point.x}, {point.y}), Size: {point.z}"
            },
            turboThreshold: 0,
            zThreshold: 0,
            zoneAxis: "z"
        }, {
            pointArrayMap: ["y", "z"],
            parallelArrays: ["x", "y", "z"],
            trackerGroups: ["group", "dataLabelsGroup"],
            specialGroup: "group",
            bubblePadding: !0,
            zoneAxis: "z",
            directTouch: !0,
            isBubble: !0,
            pointAttribs: function(c, e) {
                var b = this.options.marker.fillOpacity;
                c = k.prototype.pointAttribs.call(this, c, e);
                1 !== b && (c.fill = G(c.fill).setOpacity(b).get("rgba"));
                return c
            },
            getRadii: function(c, e, b) {
                var d = this.zData,
                    a = this.yData,
                    f = b.minPxSize,
                    g = b.maxPxSize,
                    k = [];
                var m = 0;
                for (b = d.length; m < b; m++) {
                    var q =
                        d[m];
                    k.push(this.getRadius(c, e, f, g, q, a[m]))
                }
                this.radii = k
            },
            getRadius: function(c, e, b, d, a, f) {
                var g = this.options,
                    h = "width" !== g.sizeBy,
                    k = g.zThreshold,
                    m = e - c,
                    l = .5;
                if (null === f || null === a) return null;
                if (E(a)) {
                    g.sizeByAbsoluteValue && (a = Math.abs(a - k), m = Math.max(e - k, Math.abs(c - k)), c = 0);
                    if (a < c) return b / 2 - 1;
                    0 < m && (l = (a - c) / m)
                }
                h && 0 <= l && (l = Math.sqrt(l));
                return Math.ceil(b + l * (d - b)) / 2
            },
            animate: function(c) {
                !c && this.points.length < this.options.animationLimit && (this.points.forEach(function(c) {
                    var b = c.graphic;
                    if (b && b.width) {
                        var d = {
                            x: b.x,
                            y: b.y,
                            width: b.width,
                            height: b.height
                        };
                        b.attr({
                            x: c.plotX,
                            y: c.plotY,
                            width: 1,
                            height: 1
                        });
                        b.animate(d, this.options.animation)
                    }
                }, this), this.animate = null)
            },
            hasData: function() {
                return !!this.processedXData.length
            },
            translate: function() {
                var c, e = this.data,
                    b = this.radii;
                w.scatter.prototype.translate.call(this);
                for (c = e.length; c--;) {
                    var d = e[c];
                    var a = b ? b[c] : 0;
                    E(a) && a >= this.minPxSize / 2 ? (d.marker = A(d.marker, {
                            radius: a,
                            width: 2 * a,
                            height: 2 * a
                        }), d.dlBox = {
                            x: d.plotX - a,
                            y: d.plotY - a,
                            width: 2 * a,
                            height: 2 * a
                        }) : d.shapeArgs = d.plotY =
                        d.dlBox = void 0
                }
            },
            alignDataLabel: w.column.prototype.alignDataLabel,
            buildKDTree: v,
            applyZones: v
        }, {
            haloPath: function(c) {
                return q.prototype.haloPath.call(this, 0 === c ? 0 : (this.marker ? this.marker.radius || 0 : 0) + c)
            },
            ttBelow: !1
        });
        f.prototype.beforePadding = function() {
            var c = this,
                e = this.len,
                b = this.chart,
                d = 0,
                a = e,
                f = this.isXAxis,
                k = f ? "xData" : "yData",
                m = this.min,
                q = {},
                v = Math.min(b.plotWidth, b.plotHeight),
                l = Number.MAX_VALUE,
                t = -Number.MAX_VALUE,
                w = this.max - m,
                A = e / w,
                z = [];
            this.series.forEach(function(a) {
                var d = a.options;
                !a.bubblePadding ||
                    !a.visible && b.options.chart.ignoreHiddenSeries || (c.allowZoomOutside = !0, z.push(a), f && (["minSize", "maxSize"].forEach(function(a) {
                        var b = d[a],
                            c = /%$/.test(b);
                        b = y(b);
                        q[a] = c ? v * b / 100 : b
                    }), a.minPxSize = q.minSize, a.maxPxSize = Math.max(q.maxSize, q.minSize), a = a.zData.filter(E), a.length && (l = p(d.zMin, Math.min(l, Math.max(D(a), !1 === d.displayNegative ? d.zThreshold : -Number.MAX_VALUE))), t = p(d.zMax, Math.max(t, C(a))))))
            });
            z.forEach(function(b) {
                var e = b[k],
                    g = e.length;
                f && b.getRadii(l, t, b);
                if (0 < w)
                    for (; g--;)
                        if (E(e[g]) && c.dataMin <=
                            e[g] && e[g] <= c.dataMax) {
                            var h = b.radii ? b.radii[g] : 0;
                            d = Math.min((e[g] - m) * A - h, d);
                            a = Math.max((e[g] - m) * A + h, a)
                        }
            });
            z.length && 0 < w && !this.isLog && (a -= e, A *= (e + Math.max(0, d) - Math.min(a, e)) / e, [
                ["min", "userMin", d],
                ["max", "userMax", a]
            ].forEach(function(a) {
                void 0 === p(c.options[a[0]], c[a[1]]) && (c[a[0]] += a[2] / A)
            }))
        };
        ""
    });
    K(C, "parts-map/MapBubbleSeries.js", [C["parts/Globals.js"]], function(c) {
        var f = c.merge,
            C = c.Point,
            D = c.seriesType,
            A = c.seriesTypes;
        A.bubble && D("mapbubble", "bubble", {
            animationLimit: 500,
            tooltip: {
                pointFormat: "{point.name}: {point.z}"
            }
        }, {
            xyFromShape: !0,
            type: "mapbubble",
            pointArrayMap: ["z"],
            getMapData: A.map.prototype.getMapData,
            getBox: A.map.prototype.getBox,
            setData: A.map.prototype.setData,
            setOptions: A.map.prototype.setOptions
        }, {
            applyOptions: function(c, p) {
                return c && void 0 !== c.lat && void 0 !== c.lon ? C.prototype.applyOptions.call(this, f(c, this.series.chart.fromLatLonToPoint(c)), p) : A.map.prototype.pointClass.prototype.applyOptions.call(this, c, p)
            },
            isValid: function() {
                return "number" === typeof this.z
            },
            ttBelow: !1
        });
        ""
    });
    K(C, "parts-map/HeatmapSeries.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        var C = f.extend,
            D = f.pick;
        f = c.colorMapPointMixin;
        var A = c.merge,
            E = c.noop,
            p = c.fireEvent,
            y = c.Series,
            G = c.seriesType,
            v = c.seriesTypes;
        G("heatmap", "scatter", {
                animation: !1,
                borderWidth: 0,
                nullColor: "#f7f7f7",
                dataLabels: {
                    formatter: function() {
                        return this.point.value
                    },
                    inside: !0,
                    verticalAlign: "middle",
                    crop: !1,
                    overflow: !1,
                    padding: 0
                },
                marker: null,
                pointRange: null,
                tooltip: {
                    pointFormat: "{point.x}, {point.y}: {point.value}<br/>"
                },
                states: {
                    hover: {
                        halo: !1,
                        brightness: .2
                    }
                }
            },
            A(c.colorMapSeriesMixin, {
                pointArrayMap: ["y", "value"],
                hasPointSpecificOptions: !0,
                getExtremesFromAll: !0,
                directTouch: !0,
                init: function() {
                    v.scatter.prototype.init.apply(this, arguments);
                    var c = this.options;
                    c.pointRange = D(c.pointRange, c.colsize || 1);
                    this.yAxis.axisPointRange = c.rowsize || 1
                },
                translate: function() {
                    var c = this.options,
                        f = this.xAxis,
                        m = this.yAxis,
                        v = c.pointPadding || 0,
                        g = function(b, c, a) {
                            return Math.min(Math.max(c, b), a)
                        },
                        e = this.pointPlacementToXValue();
                    this.generatePoints();
                    this.points.forEach(function(b) {
                        var d =
                            (c.colsize || 1) / 2,
                            a = (c.rowsize || 1) / 2,
                            h = g(Math.round(f.len - f.translate(b.x - d, 0, 1, 0, 1, -e)), -f.len, 2 * f.len);
                        d = g(Math.round(f.len - f.translate(b.x + d, 0, 1, 0, 1, -e)), -f.len, 2 * f.len);
                        var k = g(Math.round(m.translate(b.y - a, 0, 1, 0, 1)), -m.len, 2 * m.len);
                        a = g(Math.round(m.translate(b.y + a, 0, 1, 0, 1)), -m.len, 2 * m.len);
                        var q = D(b.pointPadding, v);
                        b.plotX = b.clientX = (h + d) / 2;
                        b.plotY = (k + a) / 2;
                        b.shapeType = "rect";
                        b.shapeArgs = {
                            x: Math.min(h, d) + q,
                            y: Math.min(k, a) + q,
                            width: Math.max(Math.abs(d - h) - 2 * q, 0),
                            height: Math.max(Math.abs(a - k) - 2 * q, 0)
                        }
                    });
                    p(this, "afterTranslate")
                },
                drawPoints: function() {
                    var c = this.chart.styledMode ? "css" : "animate";
                    v.column.prototype.drawPoints.call(this);
                    this.points.forEach(function(f) {
                        f.graphic[c](this.colorAttribs(f))
                    }, this)
                },
                hasData: function() {
                    return !!this.processedXData.length
                },
                getValidPoints: function(c, f) {
                    return y.prototype.getValidPoints.call(this, c, f, !0)
                },
                animate: E,
                getBox: E,
                drawLegendSymbol: c.LegendSymbolMixin.drawRectangle,
                alignDataLabel: v.column.prototype.alignDataLabel,
                getExtremes: function() {
                    y.prototype.getExtremes.call(this,
                        this.valueData);
                    this.valueMin = this.dataMin;
                    this.valueMax = this.dataMax;
                    y.prototype.getExtremes.call(this)
                }
            }), C({
                haloPath: function(c) {
                    if (!c) return [];
                    var f = this.shapeArgs;
                    return ["M", f.x - c, f.y - c, "L", f.x - c, f.y + f.height + c, f.x + f.width + c, f.y + f.height + c, f.x + f.width + c, f.y - c, "Z"]
                }
            }, f));
        ""
    });
    K(C, "parts-map/GeoJSON.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        function C(c, f) {
            var q, k = !1,
                m = c.x,
                p = c.y;
            c = 0;
            for (q = f.length - 1; c < f.length; q = c++) {
                var g = f[c][1] > p;
                var e = f[q][1] > p;
                g !== e && m < (f[q][0] - f[c][0]) *
                    (p - f[c][1]) / (f[q][1] - f[c][1]) + f[c][0] && (k = !k)
            }
            return k
        }
        var D = f.extend;
        f = c.Chart;
        var A = c.format,
            E = c.merge,
            p = c.win,
            y = c.wrap;
        f.prototype.transformFromLatLon = function(f, v) {
            if (void 0 === p.proj4) return c.error(21, !1, this), {
                x: 0,
                y: null
            };
            f = p.proj4(v.crs, [f.lon, f.lat]);
            var q = v.cosAngle || v.rotation && Math.cos(v.rotation),
                k = v.sinAngle || v.rotation && Math.sin(v.rotation);
            f = v.rotation ? [f[0] * q + f[1] * k, -f[0] * k + f[1] * q] : f;
            return {
                x: ((f[0] - (v.xoffset || 0)) * (v.scale || 1) + (v.xpan || 0)) * (v.jsonres || 1) + (v.jsonmarginX || 0),
                y: (((v.yoffset ||
                    0) - f[1]) * (v.scale || 1) + (v.ypan || 0)) * (v.jsonres || 1) - (v.jsonmarginY || 0)
            }
        };
        f.prototype.transformToLatLon = function(f, v) {
            if (void 0 === p.proj4) c.error(21, !1, this);
            else {
                f = {
                    x: ((f.x - (v.jsonmarginX || 0)) / (v.jsonres || 1) - (v.xpan || 0)) / (v.scale || 1) + (v.xoffset || 0),
                    y: ((-f.y - (v.jsonmarginY || 0)) / (v.jsonres || 1) + (v.ypan || 0)) / (v.scale || 1) + (v.yoffset || 0)
                };
                var q = v.cosAngle || v.rotation && Math.cos(v.rotation),
                    k = v.sinAngle || v.rotation && Math.sin(v.rotation);
                v = p.proj4(v.crs, "WGS84", v.rotation ? {
                    x: f.x * q + f.y * -k,
                    y: f.x * k + f.y * q
                } : f);
                return {
                    lat: v.y,
                    lon: v.x
                }
            }
        };
        f.prototype.fromPointToLatLon = function(f) {
            var p = this.mapTransforms,
                q;
            if (p) {
                for (q in p)
                    if (Object.hasOwnProperty.call(p, q) && p[q].hitZone && C({
                            x: f.x,
                            y: -f.y
                        }, p[q].hitZone.coordinates[0])) return this.transformToLatLon(f, p[q]);
                return this.transformToLatLon(f, p["default"])
            }
            c.error(22, !1, this)
        };
        f.prototype.fromLatLonToPoint = function(f) {
            var p = this.mapTransforms,
                q;
            if (!p) return c.error(22, !1, this), {
                x: 0,
                y: null
            };
            for (q in p)
                if (Object.hasOwnProperty.call(p, q) && p[q].hitZone) {
                    var k = this.transformFromLatLon(f,
                        p[q]);
                    if (C({
                            x: k.x,
                            y: -k.y
                        }, p[q].hitZone.coordinates[0])) return k
                }
            return this.transformFromLatLon(f, p["default"])
        };
        c.geojson = function(c, f, q) {
            var k = [],
                m = [],
                p = function(c) {
                    var e, b = c.length;
                    m.push("M");
                    for (e = 0; e < b; e++) 1 === e && m.push("L"), m.push(c[e][0], -c[e][1])
                };
            f = f || "map";
            c.features.forEach(function(c) {
                var e = c.geometry,
                    b = e.type;
                e = e.coordinates;
                c = c.properties;
                var d;
                m = [];
                "map" === f || "mapbubble" === f ? ("Polygon" === b ? (e.forEach(p), m.push("Z")) : "MultiPolygon" === b && (e.forEach(function(a) {
                        a.forEach(p)
                    }), m.push("Z")),
                    m.length && (d = {
                        path: m
                    })) : "mapline" === f ? ("LineString" === b ? p(e) : "MultiLineString" === b && e.forEach(p), m.length && (d = {
                    path: m
                })) : "mappoint" === f && "Point" === b && (d = {
                    x: e[0],
                    y: -e[1]
                });
                d && k.push(D(d, {
                    name: c.name || c.NAME,
                    properties: c
                }))
            });
            q && c.copyrightShort && (q.chart.mapCredits = A(q.chart.options.credits.mapText, {
                geojson: c
            }), q.chart.mapCreditsFull = A(q.chart.options.credits.mapTextFull, {
                geojson: c
            }));
            return k
        };
        y(f.prototype, "addCredits", function(c, f) {
            f = E(!0, this.options.credits, f);
            this.mapCredits && (f.href = null);
            c.call(this,
                f);
            this.credits && this.mapCreditsFull && this.credits.attr({
                title: this.mapCreditsFull
            })
        })
    });
    K(C, "parts-map/Map.js", [C["parts/Globals.js"], C["parts/Utilities.js"]], function(c, f) {
        function C(c, f, m, p, g, e, b, d) {
            return ["M", c + g, f, "L", c + m - e, f, "C", c + m - e / 2, f, c + m, f + e / 2, c + m, f + e, "L", c + m, f + p - b, "C", c + m, f + p - b / 2, c + m - b / 2, f + p, c + m - b, f + p, "L", c + d, f + p, "C", c + d / 2, f + p, c, f + p - d / 2, c, f + p - d, "L", c, f + g, "C", c, f + g / 2, c + g / 2, f, c + g, f, "Z"]
        }
        var D = f.extend,
            A = f.pick,
            E = c.Chart;
        f = c.defaultOptions;
        var p = c.merge,
            y = c.Renderer,
            G = c.SVGRenderer,
            v = c.VMLRenderer;
        D(f.lang, {
            zoomIn: "Zoom in",
            zoomOut: "Zoom out"
        });
        f.mapNavigation = {
            buttonOptions: {
                alignTo: "plotBox",
                align: "left",
                verticalAlign: "top",
                x: 0,
                width: 18,
                height: 18,
                padding: 5,
                style: {
                    fontSize: "15px",
                    fontWeight: "bold"
                },
                theme: {
                    "stroke-width": 1,
                    "text-align": "center"
                }
            },
            buttons: {
                zoomIn: {
                    onclick: function() {
                        this.mapZoom(.5)
                    },
                    text: "+",
                    y: 0
                },
                zoomOut: {
                    onclick: function() {
                        this.mapZoom(2)
                    },
                    text: "-",
                    y: 28
                }
            },
            mouseWheelSensitivity: 1.1
        };
        c.splitPath = function(c) {
            var f;
            c = c.replace(/([A-Za-z])/g, " $1 ");
            c = c.replace(/^\s*/, "").replace(/\s*$/,
                "");
            c = c.split(/[ ,]+/);
            for (f = 0; f < c.length; f++) /[a-zA-Z]/.test(c[f]) || (c[f] = parseFloat(c[f]));
            return c
        };
        c.maps = {};
        G.prototype.symbols.topbutton = function(c, f, m, p, g) {
            return C(c - 1, f - 1, m, p, g.r, g.r, 0, 0)
        };
        G.prototype.symbols.bottombutton = function(c, f, m, p, g) {
            return C(c - 1, f - 1, m, p, 0, 0, g.r, g.r)
        };
        y === v && ["topbutton", "bottombutton"].forEach(function(c) {
            v.prototype.symbols[c] = G.prototype.symbols[c]
        });
        c.Map = c.mapChart = function(f, k, m) {
            var q = "string" === typeof f || f.nodeName,
                g = arguments[q ? 1 : 0],
                e = g,
                b = {
                    endOnTick: !1,
                    visible: !1,
                    minPadding: 0,
                    maxPadding: 0,
                    startOnTick: !1
                },
                d = c.getOptions().credits;
            var a = g.series;
            g.series = null;
            g = p({
                chart: {
                    panning: "xy",
                    type: "map"
                },
                credits: {
                    mapText: A(d.mapText, ' \u00a9 <a href="{geojson.copyrightUrl}">{geojson.copyrightShort}</a>'),
                    mapTextFull: A(d.mapTextFull, "{geojson.copyright}")
                },
                tooltip: {
                    followTouchMove: !1
                },
                xAxis: b,
                yAxis: p(b, {
                    reversed: !0
                })
            }, g, {
                chart: {
                    inverted: !1,
                    alignTicks: !1
                }
            });
            g.series = e.series = a;
            return q ? new E(f, g, m) : new E(g, k)
        }
    });
    K(C, "masters/modules/map.src.js", [], function() {});
    K(C, "masters/highmaps.src.js", [C["masters/highcharts.src.js"]], function(c) {
        c.product = "Highmaps";
        return c
    });
    C["masters/highmaps.src.js"]._modules = C;
    return C["masters/highmaps.src.js"]
});