/* jshint indent: false, maxlen: false, unused: false */
// fix unescaped commas in SRCSET image URLs

(function (w, d, n, a) {
  var $ = w[a.k] = {
    'w': w,
    'd': d,
    'n': n,
    'a': a,
    's': {},
    'f': (function () {
      return {
        // an empty array of callbacks to be populated later
        callback: [],
        // return the SHA-1 hash of a string
        sha: function (str) {
          function rstr2binb (input) {
            var output = Array(input.length >> 2);
            for (var i = 0; i < output.length; i++) {
              output[i] = 0;
            }
            for (i = 0; i < input.length * 8; i += 8) {
              output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
            }
            return output;
          }
          function binb2rstr (input) {
            var output = "";
            for (var i = 0; i < input.length * 32; i += 8) {
              output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
            }
            return output;
          }
          function safe_add (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
          }
          function bit_rol (num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
          }
          function binb_sha1 (x, len) {
            x[len >> 5] |= 0x80 << (24 - len % 32);
            x[((len + 64 >> 9) << 4) + 15] = len;
            var w = Array(80);
            var a =  1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d =  271733878;
            var e = -1009589776;
            for (var i = 0; i < x.length; i += 16) {
              var olda = a;
              var oldb = b;
              var oldc = c;
              var oldd = d;
              var olde = e;
              for (var j = 0; j < 80; j++) {
                if (j < 16) {
                  w[j] = x[i + j];
                } else {
                  w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
                }
                var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
                e = d;
                d = c;
                c = bit_rol(b, 30);
                b = a;
                a = t;
              }
              a = safe_add(a, olda);
              b = safe_add(b, oldb);
              c = safe_add(c, oldc);
              d = safe_add(d, oldd);
              e = safe_add(e, olde);
            }
            return Array(a, b, c, d, e);
          }
          function sha1_ft (t, b, c, d) {
            if (t < 20) return (b & c) | ((~b) & d);
            if (t < 40) return b ^ c ^ d;
            if (t < 60) return (b & c) | (b & d) | (c & d);
            return b ^ c ^ d;
          }
          function sha1_kt (t) {
            return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 : (t < 60) ? -1894007588 : -899497514;
          }
          function rstr_sha1 (s) {
            return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
          }
          function rstr2hex (input) {
            var hex_tab = "0123456789abcdef";
            var output = "";
            var x;
            for (var i = 0; i < input.length; i++) {
              x = input.charCodeAt(i);
              output = output + hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F);
            }
            return output;
          }
          if (str) {
            return rstr2hex(rstr_sha1(str));
          } else {
            return '';
          }
        },
        // safe alert for non-ASCII strings
        alert: function (str) {
          alert($.f.make({'SPAN': {'innerHTML': str}}).textContent);
        },
        // get a DOM property or text attribute
        get: function (el, att) {
          var v = null;
          if (typeof el[att] !== 'undefined') {
            v = el[att];
          } else {
            v = el.getAttribute(att);
          }
          return v;
        },
        // set a DOM property or text attribute
        set: function (el, att, string) {
          if (typeof el[att] === 'string') {
            el[att] = string;
          } else {
            el.setAttribute(att, string);
          }
        },
        // find an event's target element
        getEl: function (e) {
          var el = null;
          if (e.target) {
            el = (e.target.nodeType === 3) ? e.target.parentNode : e.target;
          } else {
            el = e.srcElement;
          }
          return el;
        },
        // parse an URL, return values for specified keys
        parse: function (str, keys) {
          var query, pair, part, i, n, ret;
          ret = {};
          // remove url hash, split to find query
          query = str.split('#')[0].split('?');
          // found query?
          if (query[1]) {
            // split to pairs
            pair = query[1].split('&');
            // loop through pairs
            for (i = 0, n = pair.length; i < n; i = i + 1){
              // split on equals
              part = pair[i].split('=');
              // found exactly two parts?
              if (part.length === 2) {
                // first part is key; do we have a match in keys?
                if (keys[part[0]]) {
                  // yes: set return value for key to second part, which is value
                  ret[part[0]] = part[1];
                }
              }
            }
          }
          return ret;
        },
        // create a DOM element
        make: function (obj) {
          var el = false, tag, att, key;
          for (tag in obj) {
            if (obj[tag].hasOwnProperty) {
              el = $.d.createElement(tag);
              for (att in obj[tag]) {
                if (obj[tag][att] && obj[tag][att].hasOwnProperty) {
                  if (typeof obj[tag][att] === 'string') {
                    $.f.set(el, att, obj[tag][att]);
                  } else {
                    if (att === 'style') {
                      for (key in obj[tag][att]) {
                        if (el.style.setProperty) {
                          // modern browsers
                          el.style.setProperty(key, obj[tag][att][key], 'important');
                        } else {
                          // be nice to IE8
                          el.style[key] = obj[tag][att][key];
                        }
                      }
                    }
                  }
                }
              }
              break;
            }
          }
          return el;
        },
        // remove a DOM element
        kill: function (obj) {
          if (typeof obj === 'string') {
            obj = $.d.getElementById(obj);
          }
          if (obj && obj.parentNode) {
            obj.parentNode.removeChild(obj);
          }
        },
        // talk to an outside API
        call: function (url, func) {
          var n, id, sep = '?';
          // next available callback
          if (!$.v.nextCallback) {
            $.v.nextCallback = 0;
          }
          n = $.v.nextCallback;
          $.v.nextCallback = $.v.nextCallback + 1;
          // id will help us remove the SCRIPT tag later
          id = $.a.k + '.f.callback[' + n + ']';
          // create the callback
          $.f.callback[n] = function (r) {
            func(r, n);
            $.f.kill(id);
            $.v.callbackLoadingCount = $.v.callbackLoadingCount - 1;
          };
          // some calls may come with a query string already set
          if (url.match(/\?/)) {
            sep = '&';
          }
          // make and call the new script node
          $.d.b.appendChild($.f.make({'SCRIPT': {'id': id, 'type': 'text/javascript', 'charset': 'utf-8', 'src': url + sep + 'callback=' + id}}));
          $.v.callbackLoadingCount = $.v.callbackLoadingCount + 1;
          $.f.debug('Calling: ' + url + sep + 'callback=' + id);
        },
        // add and remove event listeners in a cross-browser fashion
        listen : function (el, ev, fn, detach) {
          if (!detach) {
            // add listener
            if (typeof $.w.addEventListener !== 'undefined') {
              el.addEventListener(ev, fn, false);
            } else if (typeof $.w.attachEvent !== 'undefined') {
              el.attachEvent('on' + ev, fn);
            }
          } else {
            // remove listener
            if (typeof el.removeEventListener !== 'undefined') {
              el.removeEventListener(ev, fn, false);
            } else if (typeof el.detachEvent !== 'undefined') {
              el.detachEvent('on' + ev, fn);
            }
          }
        },
        // console.log only if debug is on
        debug: function (obj) {
          if ($.w.console && $.w.console.log && $.v.config.debug) {
            $.w.console.log(obj);
          }
        },
        // look for special instructions on the SCRIPT tag that created us
        getConfig: function () {
          var s = $.d.getElementsByTagName('SCRIPT'), n = s.length, i = 0, j = 0, k = $.a.validConfigParam.length, t = null, p = '';
          var remindMeToKillYouLater = function (el) {
            $.w.setTimeout(function () {
              $.f.kill(el);
            }, 10);
          };
          for (i = 0; i < n; i = i + 1) {
            if (s[i].src.match($.a.me)) {
              for (j = 0; j < k; j = j + 1 ) {
                p = $.a.validConfigParam[j];
                t = s[i].getAttribute(p);
                if (t) {
                  $.v.config[p] = t;
                }
              }
              remindMeToKillYouLater(s[i]);
              break;
            }
          }
        },
        // return the selected text, if any
        getSelection: function () {
          return ("" + ($.w.getSelection ? $.w.getSelection() : $.d.getSelection ? $.d.getSelection() : $.d.selection.createRange().text)).replace(/(^\s+|\s+$)/g, "");
        },
        // return image dimensions
        getDim: function (img) {
          var h, w;
          h = 0;
          w = 0;
          if (typeof img.naturalHeight === 'number') {
            h = img.naturalHeight;
          } else {
            if (typeof img.height === 'number') {
              h = img.height;
            }
          }
          if (typeof img.naturalWidth === 'number') {
            w = img.naturalWidth;
          } else {
            if (typeof img.width === 'number') {
              w = img.width;
            }
          }
          $.f.debug('dimensions for ' + img.src + ' ' + h  + ' ' + w);
          return {'h': h, 'w': w};
        },
        hsvToRgb: function (h, s, v) {

          var r, g, b;
          var i;
          var f, p, q, t;

          h = Math.max(0, Math.min(360, h));
          s = Math.max(0, Math.min(100, s));
          v = Math.max(0, Math.min(100, v));

          s /= 100;
          v /= 100;

          if(s == 0) {
            r = g = b = v;
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
          }

          h /= 60; // sector 0 to 5
          i = Math.floor(h);
          f = h - i; // factorial part of h
          p = v * (1 - s);
          q = v * (1 - s * f);
          t = v * (1 - s * (1 - f));

          switch(i) {
            case 0:
              r = v;
              g = t;
              b = p;
              break;

            case 1:
              r = q;
              g = v;
              b = p;
              break;

            case 2:
              r = p;
              g = v;
              b = t;
              break;

            case 3:
              r = p;
              g = q;
              b = v;
              break;

            case 4:
              r = t;
              g = p;
              b = v;
              break;

            default: // case 5:
              r = v;
              g = p;
              b = q;
          }

          r = Math.round(r * 255).toString(16);
          if (r.length < 2) { r = '0' + r; }
          g = Math.round(g * 255).toString(16);
          if (g.length < 2) { g = '0' + g; }
          b = Math.round(b * 255).toString(16);
          if (b.length < 2) { b = '0' + b; }
          return '#' + r + g + b;
        },
        rgbToHsv: function (arr) {
          var rr, gg, bb,
            r = parseInt(arr[0]),
            g = parseInt(arr[1]),
            b = parseInt(arr[2]),
            h, s, v = Math.max(r, g, b),
            diff = v - Math.min(r, g, b),
            diffc = function(z) {
              return (v - z) / 6 / diff + 1 / 2;
            };

          if (diff == 0) {
            h = s = 0;
          } else {
            s = diff / v;
            rr = diffc(r);
            gg = diffc(g);
            bb = diffc(b);
            if (r === v) {
              h = bb - gg;
            } else if (g === v) {
              h = (1 / 3) + rr - bb;
            } else if (b === v) {
              h = (2 / 3) + gg - rr;
            }
            if (h < 0) {
              h = h + 1;
            } else if (h > 1) {
              h = h - 1;
            }
          }
          return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            v: Math.round(v / 2)
          };
        },

        clean: function (str) {
          var fixThese, r = '';
          if (str) {
            // thank you: Jan Lenhart
            // https://github.com/janl/mustache.js/blob/master/mustache.js
            fixThese = {
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              '"': '&quot;',
              "'": '&#39;',
              '/': '&#x2F;',
              '`': '&#x60;',
              '=': '&#x3D;',
              '\n': ' ',
              '\r': ' ',
              '\t': ' '
            };
            r = str.replace(/[&<>"'`=\/\n\r\t]/g, function (s) {
              return fixThese[s];
            });
          }
          return r;
        },

        // NON UTILS START HERE

        makeImageless: function () {
          var hue = -1;
          var domain, rawDescription, descriptionContainer, filteredDescription;

          domain = $.d.URL.split('/')[2];

          var getHsv = function (rgb) {
            var t = rgb.split('(');
            if (t[1]) {
              t = t[1].split(')');
              var t = t[0].split(',');
              if (t.length === 3) {
                return $.f.rgbToHsv(t);
              } else {
                return false;
              }
            }
          };

          rawDescription = $.f.getSelection() || $.v.meta.og.title || $.v.meta.og.description || $.v.title || $.d.URL.split('//')[1].split('#')[0].replace(/\//g, ' ');
          rawDescription = $.f.clean(rawDescription);
          rawDescription = rawDescription.replace(/^\s+|\s+$/g, '');
          descriptionContainer = $.f.make({'SPAN':{'innerHTML': rawDescription}});
          filteredDescription = descriptionContainer.textContent || '';

          // default to black
          $.v.data.imageless = {
            "description": filteredDescription,
            "height": $.a.thumbCellSize,
            "width": $.a.thumbCellSize,
            "url": $.d.URL,
            "src": "imageless",
            "color": "#000000",
            "siteName": domain
          };

          // get all links
          var a = $.d.getElementsByTagName('A');

          // found some links? start checking colors
          if (a.length) {

            var k = {};

            // count incidences of links with each background color
            for (var i = 0; i < a.length; i = i + 1) {
              var style = a[i].currentStyle || $.w.getComputedStyle(a[i], false);
              if (style && style.color) {
                var c = style.color + '';
                if (!k[c]) {
                  var hsv = getHsv(c);
                  if (hsv) {
                    k[c] = {'c': 0, 'h': hsv.h, 's': hsv.s, 'v': hsv.v};
                  }
                }
                if (k[c]) {
                  k[c].c = k[c].c + 1;
                }
              }
            }

            // flatten into an array for easy sorting
            var r = [];
            for (var i in k) {
              r.push(k[i]);
            }

            // if we don't have anything here, we'll make up a color from the domain
            if (r.length) {

              // reverse sort by saturation
              r.sort(function (a, b) {
                var v = 0;
                if (a.s < b.s) {
                  v = 1;
                } else {
                  if (a.s > b.s) {
                    v = -1;
                  }
                }
                return v;
              });

              // see if we have a tie for highest saturation
              var maxS = r[0].s;
              var j = [];
              for (var i = 0; i < r.length; i = i + 1) {
                if (r[i].s === maxS) {
                  j.push(r[i]);
                } else {
                  break;
                }
              }

              // if there's a tie, sort by count
              if (j.length > 1) {
                j.sort(function (a, b) {
                  var v = 0;
                  if (a.c < b.c) {
                    v = 1;
                  } else {
                    if (a.c > b.c) {
                      v = -1;
                    }
                  }
                  return v;
                });
              }
              hue = j[0].h;
            }
          }

          // no links were found; pick a color based on domain
          if (hue < 0) {
            var hash = $.f.sha(domain);
            // got a hash?
            if (hash) {
              hue = parseInt(hash.substr(0, 4), 16) % 360;
            }
          }

          $.v.data.imageless.color = $.f.hsvToRgb(hue, 25, 75);

        },
        check: {
          // does the image have an invalid file type (.svg)?
          fileType: function (el) {
            if (typeof el === 'string') {
              el = {'src': el};
            }
            var r, f;
            r = true;
            if (el.src) {
              f = el.src.split('#')[0].split('?')[0].split('.').pop();
              if ($.a.invalidImageFileType[f]) {
                r = false;
                $.f.debug(f + ' is not a valid image file type.');
              }
            }
            return r;
          },
          // Is the element visible?
          visibility: function (el) {
            // $.f.debug('checking visibility');
            var r, p, v, reason;
            p = el.parentNode;
            r = true;
            while (p && p.tagName !== 'HTML') {
              if (p.currentStyle) {
                if (
                  p.currentStyle['display'] === 'none' ||
                  p.currentStyle['visibility'] === 'hidden'
                ) {
                  r = false;
                }
              } else {
                if ($.w.getComputedStyle) {
                  if (
                    $.w.getComputedStyle(el).getPropertyValue('display') === 'none' ||
                    $.w.getComputedStyle(el).getPropertyValue('visibility') === 'hidden'
                  ) {
                    r = false;
                  }
                }
              }
              if (r === false) {
                reason = el.src + ': is invisible';
                break;
              }
              p = p.parentNode;
            }
            if (reason) {
              $.f.debug(reason);
            }
            return r;
          },
          // do we see a nopin (ours or theirs) on an image?
          noPin: function (el) {
            // $.f.debug('checking nopin');
            var r, reason;
            r = true;
            if ($.f.get(el, 'data-pin-nopin')) {
              r = false;
              reason =  el.src + ': data-pin-nopin=true';
            }
            if ($.f.get(el, 'nopin')) {
              r = false;
              reason =  el.src + ': nopin=nopin';
              $.f.log({'reason': 'image_with_inline_nopin', 'img': el.src});
            }
            if (reason) {
              $.f.debug(reason);
            }
            return r;
          },
          // Is the image big enough and the right aspect ractio?
          size: function (img) {
            // $.f.debug('checking size');
            var r, reason, dim;
            r = false;
            dim = $.f.getDim(img);
            if (dim.h > $.a.imgLimitFloor && dim.w > $.a.imgLimitFloor) {
              if (dim.h > $.a.imgLimitMin || dim.w > $.a.imgLimitMin) {
                if (dim.w < dim.h * $.a.imgLimitHorz) {
                  r = true;
                } else {
                  reason = img.src + ' too wide';
                }
              } else {
                reason =  img.src + ' one dimension <= ' + $.a.imgLimitMin;
              }
            } else {
              reason =  img.src + ' one dimension <= ' + $.a.imgLimitFloor;
            }
            if (reason) {
              $.f.debug(reason);
            }
            return r;
          },
          // Do we know about this image already?
          dupe: function (el) {
            var url = el;
            if (typeof el === 'object') {
              url = el.src;
            }
            // $.f.debug('checking dupe');
            var r = true;
            if (!$.v.src[url]) {
              $.v.src[url] = true;
            } else {
              $.f.debug(url + ': is a duplicate');
              r = false;
            }
            return r;
          },
          // check that source is valid
          source: function (t, checkExt) {
            var r, f, reason, url;
            r = false;
            if (typeof t === 'string') {
              url = t;
            } else {
              url = t.src || t.href;
            }
            if (url) {
              if (url.match(/^http/)) {
                if (!url.match(/File:/)) {
                  if (checkExt) {
                    f = url.split('#')[0].split('?')[0].split('.').pop();
                    if ($.a.validImageFileType[f]) {
                      r = true;
                    }
                  } else {
                    r = true;
                  }
                }
              } else {
                // images with data:URLs can't be pinned unless they have srcsets
                if (t.srcset) {
                  r = true;
                }
              }
            }
            if (r === true) {
              $.f.debug('Found valid image source: ' + url);
            }
            return r;
          },
          // check a domain against hashlist
          domain: function (el) {
            var i, h, r, d, url;
            url = el;
            if (typeof el === 'object') {
              url = el.src;
            }
            d = url.split('/')[2];
            r = true;
            // have we checked this domain already?
            if (typeof $.v.srcDomain[d] === 'undefined') {
              $.f.debug('checking hashlist against ' + d);
              var h = $.f.sha(d);
              for (var i = 0, n = $.a.hashList.length; i < n; i = i + 1) {
                if (h.match($.a.hashList[i])) {
                  $.f.debug('found a blacklisted domain: ' + d);
                  $.f.log({'reason': 'domain_blacklisted'});
                  r = false;
                  break;
                }
              }
              // set to true or false
              $.v.srcDomain[d] = { 'bad': r };
            } else {
              // return the result we found before
              r = $.v.srcDomain[d].bad;
            }
            return r;
          }
        },
        tag: {
          img: function (el) {
            var r, f;
            r = true;
            for (f in $.f.check) {
              if (!$.f.check[f](el)) {
                r = false;
                break;
              }
            }
            return r;
          },
          iframe: function (el) {
            var o, p;

            // instagram
            if (el.src.match($.a.pattern.instagram.url)) {
              p = el.src.split('#')[0].split('?')[0].split('/');
              if (p[3] === 'p' && p[4]) {
                o = {
                  'media': 'https://www.instagram.com/p/' + p[4] + '/media/?size=l',
                  'set': {
                    'url': 'https://www.instagram.com/p/' + p[4],
                    'description': $.v.title
                  }
                };
                $.f.loadImg(o);
              }
            }

            // youtube
            if (el.src.match($.a.pattern.youtube.iframe)) {
              var p = el.src.split('#')[0].split('?')[0].split('/')[4];
              if (p) {
                $.f.debug('found a YouTube player: ' + el.src);
                o = {
                  'media': 'http://i.ytimg.com/vi/' + p + '/hqdefault.jpg',
                  'set': {
                    'description': $.v.title,
                    'url': 'http://www.youtube.com/watch?v=' + p,
                    'isVideo': true,
                    'attrib': 'youtube'
                  }
                };
                $.f.loadImg(o);
              }
            }
            // vimeo
            if (el.src.match($.a.pattern.vimeo.iframe)) {
              p = function (r) {
                if (r.thumbnail_url) {
                  $.f.debug('got a Vimeo API reply for iframe: ' + el.src);
                  o = {
                    'media': r.thumbnail_url.split('_')[0] + '.jpg',
                    'set': {
                      'url': 'https://vimeo.com/' + r.video_id,
                      'description': r.title,
                      'isVideo': true,
                      'attrib': 'vimeo'
                    }
                  };
                  $.f.loadImg(o);
                }
              };
              o = 'https://vimeo.com/api/oembed.json?url=' + encodeURIComponent(el.src);
              $.f.call(o, p);
            }
          },
          a: function (el) {
            var o, p, q, id;
            p = $.f.get(el, 'data-pin-href');
            if (p) {
              q = $.f.parse(p, {'url': true, 'media': true, 'description': true});
              if (q.media) {
                $.f.debug('found a Pin It button: ' + p);
                o = {
                  'media': decodeURIComponent(q.media),
                  'set': {
                    'pinItButton': true,
                    'url': decodeURIComponent(q.url) || undefined,
                    'description': decodeURIComponent(q.description) || undefined
                  }
                }
                id = $.f.get(el, 'data-pin-id');
                if (id) {
                  o.set['dataPinId'] = id;
                }
                $.f.loadImg(o);
                if (!$.v.hazLoggedPinItButton) {
                  $.v.hazLoggedPinItButton = true;
                  $.f.log({'reason': 'pinit_found'});
                }
              }
            }
          },
          link: function (el) {
            var rel, href;
            rel = el.rel;
            href = el.href;
            if (rel && href) {
              rel = rel.toLowerCase();
              if (rel === 'canonical') {
                $.f.debug('found link rel=canonical: ' + href);
                if (!$.v.canonicalUrl) {
                  $.v.canonicalUrl = href;
                }
              }
            }
          },
          meta: function (el) {
            var content, description, property, name, equiv, lang;
            content = $.f.get(el, 'content');
            description = $.f.clean($.f.get(el, 'description'));
            property = $.f.get(el, 'property');
            equiv = $.f.get(el, 'http-equiv');
            lang = $.f.get(el, 'content-language');
            name = $.f.get(el, 'name');
            if (equiv && lang) {
              $.f.debug('got language ' + lang + ' from http-equiv meta');
              $.f.setLang(lang);
            }
            if (content) {
              if (name) {
                // old-school Pinterest no-pin, and no-rich-pin guidance
                if (name === 'pinterest') {
                  if (content.toLowerCase() === 'nopin') {
                    $.v.data.close = description || $.v.msg.noPinMeta;
                    $.f.log({'reason': 'found_nopin_meta'});
                    $.f.debug('found pinterest nopin meta');
                  }
                  if (content.toLowerCase() === 'nohover') {
                    $.v.noHoverMeta = true;
                    $.f.debug('found pinterest nohover meta');
                    $.f.log({'reason': 'found_no_hover_meta'});
                  }
                }
                if (name === 'pinterest-rich-pin' && content.toLowerCase() === 'false') {
                  $.f.debug('found pinterest no-rich-pin meta');
                  $.f.log({'reason': 'found_no_rich_pin_meta'});
                }
              } // end name
              if (property) {
                // open graph (Facebook) guidance
                if (property === 'og:site_name') {
                  $.v.meta.og.siteName = $.f.clean(content);
                  $.v.data.imageless.siteName = $.f.clean(content);
                  $.f.debug('found og:site_name meta: ' + content);
                }
                if (property === 'og:image') {
                  if ($.f.check.fileType(content)) {
                    $.v.meta.og.media = content;
                    $.f.debug('found og:image meta: ' + content);
                  }
                }
                if (property === 'og:url') {
                  if (content.match(/^https?:\/\//)) {
                    $.v.meta.og.url = content;
                    $.f.debug('found og:url meta: ' + content);
                  }
                }
                if (property === 'og:description') {
                  $.v.meta.og.description = $.f.clean(content);
                  $.f.debug('found og:description meta: ' + content);
                }
                if (property === 'og:title') {
                  $.v.meta.og.title = $.f.clean(content);
                  $.f.debug('found og:title meta: ' + content);
                }
                // pinterest guidance
                if (property === 'pin:media') {
                  $.v.meta.pinterest.media = content;
                  $.f.debug('found pin:media meta: ' + content);
                }
                if (property === 'pin:url') {
                  $.v.meta.pinterest.url = content;
                  $.f.debug('found pin:url meta: ' + content);
                }
                if (property === 'pin:description') {
                  $.v.meta.pinterest.description = $.f.clean(content);
                  $.f.debug('found pin:description meta: ' + content);
                }
                if (property === 'pin:id') {
                  $.v.meta.pinterest.id = content;
                  $.f.debug('found pin:id meta: ' + content);
                }
              } // end property
            } // end content
          }
        },
        // load an image
        loadImg: function (o) {
          $.f.debug('loading image ' + o.media);
          var img, safety, r, i, n;
          $.v.imgLoadingCount = $.v.imgLoadingCount + 1;
          img = $.d.createElement('IMG');
          img.onerror = function () {
            $.w.clearTimeout(safety);
            $.v.imgLoadingCount = $.v.imgLoadingCount - 1;
          };
          img.onload = function () {
            var i, n, r, pageDomain, srcDomain, dim;
            $.w.clearTimeout(safety);
            r = {};
            $.f.debug(this.src + ' has loaded');
            $.v.imgLoadingCount = $.v.imgLoadingCount - 1;
            r.loaded = true;
            dim = $.f.getDim(this);
            r.height = dim.h;
            r.width = dim.w;
            r.media = this.src;
            if (o.set) {
              if (typeof o.set === 'string') {
                r[o.set] = true;
                $.v.hazSet[o.set] = true;
              } else {
                for (i in o.set) {
                  r[i] = o.set[i];
                  $.v.hazSet[i] = true;
                }
              }
            }
            if (o.url && $.v.canonicalUrl) {
              if (o.url !== $.v.canonicalUrl) {
                pageDomain = $.v.canonicalUrl.split('/')[2];
                srcDomain = o.url.split('/')[2];
                if (pageDomain === srcDomain) {
                  // this may be a link from a blog index page
                  r.url = o.url;
                  $.f.debug('Fixing on-domain link ' + r.url);
                  r.linkOffPage = true;
                } else {
                  // this is a link to an external domain
                  // not changing it yet because we would steal the link from the page it was found on
                  // TODO: add via to pin/create call and attribute properly
                  r.url = o.url;
                  r.via = $.v.canonicalUrl;
                  r.linkOffDomain = true;
                }
              } else {
                // if the iframe URL matches the page URL, we are on the video page
                if (r.isVideo) {
                  r.isCanonical = true;
                }
              }
              $.f.kill(this);
            }
            if (o.description) {
              r.description = o.description;
            }
            // add to front
            $.v.found.unshift(r);
            // de-dupe
            for (i = 1, n = $.v.found.length;  i < n; i = i + 1) {
              if ($.v.found[i].media === this.src) {
                // we have a duplicate image from OG
                if (r.metaOg) {
                  if (r.description) {
                    // improve the description
                    $.v.found[i].description = r.description;
                  }
                  if (r.url) {
                    $.v.found[i].url = r.url;
                  }
                  // bump it up in order
                  $.v.found[i].isCanonical = true;
                  // remove the OG image
                  $.v.found.shift();
                } else {
                  $.v.found.splice(i, 1);
                }
                break;
              }
            }
          };
          safety = $.w.setTimeout(function () {
            img = null;
            $.v.imgLoadingCount = $.v.imgLoadingCount - 1;
          }, $.a.maxWait);
          img.src = o.media;
        },
        // foreign API return handlers
        handlers: {
          instagram: function (r) {
            if (r && r.thumbnail_url && r.title && r.html) {
              o = {
                'media': r.thumbnail_url,
                'set': {
                  'url': r.html.split('<a href="')[1].split('"')[0],
                  'description': r.title
                }
              };
              $.f.loadImg(o);
            }
          }
        },
        // substitute last element in img.srcset for img.src if found
        srcSet: function (el) {
          var t, i, file, p, src = '', max = 0, srcset = $.f.get(el, 'srcset');
          if (srcset) {
            // split by comma + space in case there are unescaped commas in image URLs
            t = srcset.split(', ');
            if (t.length) {
              for (i = 0; i < t.length; i = i + 1) {
                // clean up whitespace on each pair
                p = t[i].replace(/^\s+|\s+$/g,'').replace(/\s\s+/g, ' ').split(' ');
                // images without widths can't be compared to the rest of the list; skipped
                if (p[1]) {
                  p[1] = p[1].replace(/[^0-9.]/g, '') - 0;
                  if (max < p[1]) {
                    max = p[1];
                    src = p[0];
                  }
                }
              }
              // got src?
              if (src) {
                // take care of schemeless URLs first
                if (src.match(/^\/\//)) {
                  // scheme should match that of window.location.origin
                  // window.location.origin is a string
                  // splitting on // gets us http: or https: in position 0
                  // which we then add to the existing src, which we know starts with //
                  src = $.w.location.origin.split('//')[0] + src;
                } else {
                  // if we don't see http or data in front, we'll assume it's a relative path
                  if (!src.match(/^(http|data)/)) {
                    src = $.w.location.origin + src;
                  }
                }
                // do we already have data-pin-media?
                if (!el.getAttribute('data-pin-media')) {
                  el.setAttribute('data-pin-media', src);
                  $.f.debug('setting data-pin-media to srcset: ' + src);
                }
              }
            }
          }
        },
        // arrays of functions to be run in a loop on a particular kind of tag
        // if a function returns true, the loop breaks and no more are run
        modifiers: {
          page: [
            // Vimeo video pages
            function () {
              var o, v, thumb;
              if ($.d.URL.match($.a.pattern.vimeo.page)) {
                v = $.d.getElementsByTagName('VIDEO')[0];
                if (v) {
                  thumb = v.parentNode.parentNode.getAttribute('data-thumb');
                  if (thumb) {
                    o = {
                      'media': thumb,
                      'set': {
                        'sourceBump': true,
                        'url': $.d.URL,
                        'description': $.v.title
                      }
                    }
                    $.f.loadImg(o);
                  }
                }
              }
            },
            // Amazon product pages
            function () {
              var p, a, i, n, t, o, q;
              if ($.d.URL.match($.a.pattern.amazon.page)) {
                var a = $.d.getElementsByTagName('A');
                for (i = 0, n = a.length; i < n; i = i + 1) {
                  if (a[i].href && a[i].href.match('pinterest.com%2Fpin%2Fcreate%2Fbutton%3F')) {
                    p = a[i].href.split('&token=')[0].split('pinterest.com%2Fpin%2Fcreate%2Fbutton%3F');
                    if (p[1]) {
                      try {
                        t = decodeURIComponent(p[1]);
                        if (t) {
                          q = $.f.parse('?' + t, {'url': true, 'media': true, 'description': true});
                          if (q.media && q.url && q.description) {
                            q.url = q.url.split('ref%3D')[0];
                            q.description = q.description.split('http')[0];
                            o = {
                              'media': decodeURIComponent(q.media),
                              'set': {
                                'sourceBump': true,
                                'url': decodeURIComponent(q.url),
                                'description': decodeURIComponent(q.description)
                              }
                            }
                            $.f.loadImg(o);
                          }
                        }
                      } catch (e) {
                      }
                    }
                    break;
                  }
                }
              }
            },
            // YouTube player pages don't have thumbnails for canonical video
            function () {
              var q, p, o, i, n, t, z, j, k, loadYouTube;
              loadYouTube = function (q) {
                var o = {};
                o.media = 'https://i.ytimg.com/vi/' + q.id + '/hqdefault.jpg';
                o.url = 'http://www.youtube.com/watch?v=' + q.id;
                o.set = {
                  'isVideo': true,
                  'attrib': 'youtube',
                  'url': o.url,
                  'description': $.v.title
                };
                if (q.sourceBump) {
                  o.set.sourceBump = true;
                }
                if (q.sourceOrder) {
                  o.set.sourceOrder = q.sourceOrder;
                }
                $.f.loadImg(o);
              }
              if ($.d.URL.match($.a.pattern.youtube.page)) {
                // get canonical movie from page URL
                p = $.d.URL.split('#')[0].split('?v=');
                if (p[1]) {
                  // settting sourceBump to be sure this image appears on top
                  loadYouTube({ 'id': p[1].split('&')[0], 'sourceBump': true });
                }
                // are we on mobile?
                p = $.d.getElementsByClassName('_mfw');
                for (i = 0, n = p.length; i < n; i = i + 1) {
                  t = p[i].currentStyle || $.w.getComputedStyle(p[i], false);
                  // background-image is a list of YouTube IDs
                  if (t && t.backgroundImage && t.backgroundImage !== 'none') {
                    q = t.backgroundImage.split('&')[0].split('=');
                    if (q[1]) {
                      z = q[1].split(',');
                      // got YouTube IDs
                      for (j = z.length - 1, k = -1 ; j > k; j = j - 1) {
                        loadYouTube({ 'id': z[j], 'sourceOrder': j });
                      }
                      break;
                    }
                  }
                }
              }
            },
            // Google image search
            function () {
              var results, links, i, n, images, parts, url, div, meta, j;
              if ($.d.URL.match($.a.pattern.google.page)) {
                $.v.doNotSort = true;
                results = $.d.getElementById('ires');
                if (results) {
                  links = results.getElementsByTagName('A');
                  for (i = 0, n = links.length; i < n; i = i + 1) {
                    // find the url and media in the link href
                    url = '';
                    media = '';
                    // got href?
                    if (links[i].href) {
                      parts = links[i].href.split('imgrefurl=');
                      if (parts[1]) {
                        // got url
                        url = parts[1].split('&')[0];
                      }
                      parts = links[i].href.split('imgurl=');
                      if (parts[1]) {
                        // got media
                        media = parts[1].split('&')[0];
                      }
                    }
                    // we have original page URL and media links; find the image and apply them
                    if (url && media) {
                      // find images in link
                      images = links[i].getElementsByTagName('IMG');
                      // got first image?
                      if (images[0]) {
                        // apply url and media as data-pin attributes
                        // these will be picked up and suggested on our image collection run
                        $.f.set(images[0], 'data-pin-url', decodeURIComponent(url));
                        $.f.set(images[0], 'data-pin-media', decodeURIComponent(media));
                        // since these are already parts of URLs, we need to decode them
                      }
                    }
                    div = links[i].parentNode.getElementsByTagName('DIV');
                    if (div[2]) {
                      meta = div[2].textContent;
                      if (meta) {
                        try {
                          j = JSON.parse(meta);
                          if (typeof j === 'object') {
                            if (j.s || j.pt) {
                              $.f.set(images[0], 'data-pin-description', j.s || j.pt);
                            }
                          }
                        } catch (e) {
                        }
                      }
                    }
                  }
                }
              }
            },
            // Pinterest home page
            function () {
              if ($.d.URL.match($.a.pattern.pinterest.page)) {
                $.v.data.close = $.v.msg.noPinningFromPinterest;
              }
            },
            // Facebook
            function () {
              if ($.d.URL.match($.a.pattern.facebook.page)) {
                $.f.log({'reason': 'facebook_nopin'});
                $.v.data.close = $.v.msg.noPinDomain.replace(/%noPinDomain%/, 'Facebook');
              }
            },
            // Craigslist
            function () {
              if ($.d.URL.match($.a.pattern.craigslist.page)) {
                $.v.data.close = $.v.msg.noPinDomain.replace(/%noPinDomain%/, 'Craigslist');
              }
            }
          ],
          img: [
            // don't show things like "iPhone Screenshot 1" for descriptions on iTunes
            function (o, el) {
              if ($.d.URL.match($.a.pattern.itunes.page)) {
                // should default to app title
                o.description = $.v.title.split(' on the App Store')[0];
                var titleContainer = $.d.getElementById('title');
                if (titleContainer) {
                  var h1 = titleContainer.getElementsByTagName('H1');
                  var h2 = titleContainer.getElementsByTagName('H2');
                  if (h1[0] && h2[0]) {
                    var title = h1[0].innerHTML;
                    var author = h2[0].innerHTML;
                    if (title && author) {
                      author = author.charAt(0).toLowerCase() + author.substr(1);
                      o.description = title + ' ' + author;
                    }
                  }
                }
              }
            },
            // is this a Twitter card image?
            function (o, el) {
              var a, p;
              if ($.d.URL.match($.a.pattern.twitter.page)) {
                a = el.parentNode.parentNode;
                if (a && a.tagName === 'A' && $.f.get(a, 'data-resolved-url-large')) {
                  o.media = $.f.get(a, 'data-resolved-url-large');
                  o.url = a.href;
                  p = a.parentNode.parentNode.parentNode.getElementsByClassName('tweet-text')[0];
                  if (p && p.tagName === 'P') {
                    o.description = p.innerText;
                  }
                }
              }
            },
            // is this a Flickr image?
            function(o, el) {
              var r, p, v;
              r = false;
              if (o.media.match($.a.pattern.flickr.media)) {
                o.getsAttribution = true;
                o.attrib = 'flickr';
                o.url = $.v.canonicalUrl;
                r = true;
              }
              return r;
            },
            // is this a 500px image?
            function(o, el) {
              var r, p, v;
              r = false;
              if (o.media.match($.a.pattern['500px'].media)) {
                o.getsAttribution = true;
                p = o.media.split('#')[0].split('?')[0].split('/');
                v = p.pop();
                if (v.match(/.jpg/)) {
                  o.media = p.join('/') + '/2048.jpg';
                  o.set = {
                    'getsAttribution': true,
                    'attrib': 'fivehundredpx',
                    'url': $.v.canonicalUrl
                  };
                  $.f.loadImg(o);
                  r = true;
                }
              }
              return r;
            },
            // is this a YouTube thumb?
            function (o, el) {
              var r, p;
              r = false;
              if (o.media.match($.a.pattern.youtube.media)) {
                p = o.media.split('/')[4];
                o.media = 'https://i.ytimg.com/vi/' + p + '/hqdefault.jpg';
                // are we on a YouTube player page pinning an image from a DIFFERENT page?
                o.url = $.v.canonicalUrl;
                // if we're ON youtube right now, normalize the link
                if (o.url.match($.a.pattern.youtube.page)) {
                  o.url = 'https://www.youtube.com/watch?v=' + p;
                }
                o.set = {
                  'isVideo': true,
                  'attrib': 'youtube',
                  'url': o.url
                };
                $.f.loadImg(o);
                r = true;
              }
              return r;
            },
            // data-pin-*
            function(o, el) {
              var r, p;
              r = false;
              if (!o.url) {
                o.url = $.v.canonicalUrl;
              }
              p = o['data-pin-url'];
              if (p) {
                delete o['data-pin-url'];
                o['dataPinUrl'] = p;
                o.url = p;
              }
              p = o['data-pin-id'];
              if (p) {
                delete o['data-pin-id'];
                o['dataPinId'] = p;
              }
              p = o['data-pin-description'];
              if (p) {
                delete o['data-pin-description'];
                o['dataPinDescription'] = p;
              }
              // if we need to reload, reset dataPinMedia, dataPinUrl, and dataPinId
              p = o['data-pin-media'];
              if (p) {
                delete o['data-pin-media'];
                if ($.f.check.source(p)) {
                  o.media = p;
                  o.set = {
                    'dataPinMedia': true,
                    'url': o.url
                  }
                  if (o['dataPinUrl']) {
                    o.set['dataPinUrl'] = o['dataPinUrl'];
                  }
                  if (o['dataPinDescription']) {
                    o.set['dataPinDescription'] = o['dataPinDescription'];
                  }
                  if (o['dataPinId']) {
                    o.set['dataPinId'] = o['dataPinId'];
                  }
                  $.f.loadImg(o);
                  r = true;
                }
              }
              return r;
            },
            // does this image link directly to another image?
            function (o, el) {
              var r, p, pageDomain, srcDomain;
              r = false;
              p = el.parentNode;
              if (p.tagName === 'A') {
                if (p.href) {
                  // if we get a valid filetype back, it's an image
                  if ($.f.check.source(p, true) && !$.d.URL.match($.a.pattern.wikipedia.page)) {
                    if (!o.url) {
                      o.url = $.v.canonicalUrl;
                    }
                    o.media = p.href;
                    o.set = {
                      'linkedImg': true,
                      'url': o.url
                    };
                    $.f.loadImg(o);
                    r = true;
                  }
                }
              }
              return r;
            }
          ],
          meta: [
            // pinterest meta
            function () {
              var r, o;
              r = false;
              if ($.v.meta.pinterest) {
                if ($.v.meta.pinterest.media) {
                  if ($.f.check.source($.v.meta.pinterest.media)) {
                    o = {
                      'media': $.v.meta.pinterest.media,
                      'set': {
                        'metaPinterest': true,
                        'url': $.v.meta.pinterest.url || $.v.canonicalUrl,
                        'description': $.v.meta.pinterest.description || $.v.title || undefined
                      }
                    };
                    if ($.v.meta.pinterest.id) {
                      o.set['dataPinId'] = $.v.meta.pinterest.id;
                    }
                    $.f.loadImg(o);
                    r = true;
                    $.f.debug('loading pinterest meta image: ' + o.media);
                  }
                }
              }
              return r;
            },
            // facebook (OG) meta
            function () {
              var r, o;
              if ($.v.meta.og) {
                if ($.v.meta.og.media) {
                  if ($.f.check.source($.v.meta.og.media)) {
                    o = {
                      'media': $.v.meta.og.media,
                      'set': {
                        'metaOg': true,
                        'url': $.v.meta.og.url || $.v.canonicalUrl,
                        'description': $.v.meta.og.description || $.v.meta.og.title || $.v.title || undefined
                      }
                    };
                    $.f.loadImg(o);
                    r = true;
                    $.f.debug('loading og meta image: ' + o.media);
                  }
                }
              }
              r = false;
              return r;
            }
          ]
        },
        // run a list of functions in order and stop if any returns true
        runMods: function (t, obj, el) {
          if ($.f.modifiers[t]) {
            for (var i = 0; i < $.f.modifiers[t].length; i = i + 1) {
              if ($.f.modifiers[t][i](obj, el)) {
                break;
              }
            }
          }
        },
        // grovel through the DOM and look for tags
        getTags: function () {
          var k, t, n, a, i, o, j, v, p, fn, fp;
          for (k in $.a.tag) {
            t = $.d.getElementsByTagName(k);
            n = t.length;
            if (n) {
              a = $.a.tag[k];
              // loop through tags of type k
              for (i = 0; i < n; i = i + 1) {
                if (k === 'img') {
                  $.f.srcSet(t[i]);
                }
                o = null;
                // loop through attributes
                for (j = 0; j < a.length; j = j + 1) {
                  v = $.f.get(t[i], a[j]);
                  // found one of the attributes we are looking for
                  if (v) {
                    // first attribute: new object
                    if (!o) {
                      o = {};
                    }
                    // set attribute
                    o[a[j]] = v;
                  }
                }
                if (o) {
                  // check it
                  if (typeof $.f.tag[k] === 'function') {
                    if ($.f.tag[k](t[i])) {
                      // found an image
                      if (k === 'img') {
                        o.sourceOrder = $.v.sourceOrder;
                        $.v.sourceOrder = $.v.sourceOrder + 1;
                        if (o.src) {
                          o.media = o.src;
                          delete o.src;
                        }
                        // look for special goodies like attribution partners, bigger images, etc
                        $.f.runMods(k, o, t[i]);
                        if (!o.description) {
                          // get file name and file part of file name
                          fn = o.media.split('/').pop();
                          fp = fn.split('.')[0];
                          // null out title and alt if they match
                          if (o.title === fn || o.title === fp) {
                            o.title = null;
                          }
                          if (o.alt === fn || o.alt === fp) {
                            o.alt = null;
                          }
                          o.description = o.title || o.alt || $.v.meta.pinterest.description || $.v.meta.og.description || $.v.meta.og.title || $.v.title || undefined;
                        }
                        $.v.found.push(o);
                      }
                    }
                  }
                }
              }
            }
          }
        },
        // set priority
        arrange: function () {
          // we may have $.v.canonicalURL
          var i, n, o, h, w, a;
          for (i = 0, n = $.v.found.length; i < n; i = i + 1) {
            a = 0;
            o = $.v.found[i];

            if (o.dataPinDescription) {
              o.description = o.dataPinDescription;
            }

            o.description = o.description.substring(0, 497);
            if (o.description.length === 497) {
              o.description = o.description + '...';
            }

            if (typeof o.naturalHeight === 'number' && o.naturalHeight) {
              o.height = o.naturalHeight;
              delete o.naturalHeight;
            }
            if (typeof o.naturalWidth === 'number' && o.naturalWidth) {
              o.width = o.naturalWidth;
              delete o.naturalWidth;
            }
            h = parseInt(o.height);
            w = parseInt(o.width);
            // penalize landscape images
            if (w > h) {
              w = h;
            }
            // penalize very tall images
            if (h > w * 3) {
              h = w * 3;
            }
            // compute base area
            a = h * w;
            // site has said "pin this image"
            if (o.isCanonical) {
              a = a * 3;
            }
            // site has said "pin this image"
            if (o.dataPinId || o.pinItButton || o.dataPinMedia || o.dataPinUrl || o.metaPinterest) {
              a = a * 3;
            }
            // video
            if (o.isVideo) {
              a = a * 3;
            }
            // promote images from special sources
            if (o.sourceBump) {
              a = a * 3;
            }
            // penalize images that are narrower than the Pinterest grid
            if (w < $.a.thumbCellSize) {
              a = a / 2;
              // heavily penalize small images on pages containing images with sourceBump (Amazon)
              if ($.v.hazSet.sourceBump) {
                a = a / 10;
              }
            }

            // OG images: penalize if tiny
            if (o.metaOg && n > 1 && w < $.a.thumbCellSize) {
              a = a / 100;
            }

            // penalize usemap images
            if (o.usemap) {
              a = a / 100;
            }

            // in cases where the thumbs are all the same size, this will help put them in order
            if (o.sourceOrder) {
              a = a - o.sourceOrder * 100;
            }
            o.order = a;
          }
          if ($.v.found.length) {
            // do not sort from pages like Google Image Search
            if (!$.v.doNotSort) {
              var sf = function (b, a) {
                return a.order - b.order;
              };
              $.v.found.sort(sf);
              a = $.v.found[0].order;
              for (i = 1, n = $.v.found.length; i < n; i = i + 1) {
                if ($.v.found[i].order < a / $.v.config.quality) {
                  $.v.found[i].halt = true;
                  break;
                }
              }
            }
          }
        },
        // logging without json-p
        log: function (obj){
          var q, url, call;
          url = obj.url || $.d.URL;
          q = '?type=pinmarklet&pmUrl=' + encodeURIComponent(url) + '&pmReason=' + encodeURIComponent(obj.reason);
          if (obj.time) {
            q = q + '&pmTime=' + obj.time;
          }
          if (obj.img) {
            q = q + '&pmImg=' + encodeURIComponent(obj.img);
          }
          if (obj.reason === 'bookmarklet_rendered') {
            // generated by a third party kind enough to tell us who they are (addthis)
            if ($.v.config.via) {
              q = q + '&pmVia=' + encodeURIComponent($.v.config.via);
            }
            // generated by a browser extension
            if ($.v.config.xuid) {
              q = q + '&pmXuid=' + encodeURIComponent($.v.config.xuid);
            }
            // generated by pinit.js
            if ($.v.config.guid) {
              q = q + '&pmGuid=' + encodeURIComponent($.v.config.guid);
            }
          }
          $.w.setTimeout(function () {
            call = new Image();
            call.src = $.a.log + q;
            $.f.debug('Logging: ' + call.src);
          }, $.a.maxWait);
        },
        // given window.navigator.language, return appropriate strings and domain
        langLocLookup: function (str) {

          var t, i, lang, locale, hazAltDomain, q;

          // default to window.navigator.language if no value
          if (!str) {
            str = $.n.language;
          }
          $.f.debug('Looking up language and domain for ' + str);

          // defaults: English, WWW
          $.v.lang = 'en';
          $.v.domain = 'www';

          // clean and split
          t = str.toLowerCase();
          t = t.replace(/[^a-z0-9]/g, ' ');
          t = t.replace(/^\s+|\s+$/g, '');
          t = t.replace(/\s+/g, ' ');
          t = t.split(' ');

          // fix three-parters like bs-latn-ba
          if (t.length > 2) {
            for (i = t.length-1; i > -1; i = i - 1) {
              if (t[i].length !== 2) {
                t.splice(i, 1);
              }
            }
          }

          // do we have strings that match t[0];
          if (t[0]) {
            lang = t[0];
            // is there an immediate match for language in strings?
            if ($.a.msg[lang]) {
              $.v.lang = lang;
            }
            // is there an immediate match for language in domains?
            if ($.a.save.domain[lang]) {
              $.v.domain = lang;
            }
            // do we have a locale?
            if (t[1]) {
              locale = t[1];
              if (locale !== lang) {
                hazAltDomain = false;
                q = $.a.save.lookup[lang];
                // find it in list?
                if (q) {
                  // bare domain like fi needs to allow fi-us
                  if (q === true) {
                    if (!$.a.save.domain[locale]) {
                      $.v.domain = 'www';
                    }
                  } else {
                    // some domains don't match string abbreviation
                    if (q.d === locale) {
                      // domain matches main default, as for hi-in
                      $.v.domain = q.d;
                    } else {
                      // got alt?
                      if (q.alt) {
                        if (q.alt[locale]) {
                          if (typeof q.alt[locale] === 'string') {
                            // alt dom is a string, as for gb = uk, no lookup needed
                            $.v.domain = q.alt[locale];
                          } else {
                            if (q.alt[locale].d) {
                              // domain is different, as for pt-br
                              $.v.domain = q.alt[locale].d;
                              hazAltDom = true;
                            }
                            if (q.alt[locale].s) {
                              // strings are different as for fr-be or tr-cy
                              $.v.lang = q.alt[locale].s;
                            }
                          }
                        }
                      }
                    }
                  }
                }
                // if we don't have an alternate domain, use the default for this domain
                if (!hazAltDomain) {
                  if ($.a.save.domain[locale]) {
                    $.v.domain = locale;
                  }
                }
              }
            }
          }
          $.f.debug('Lang: ' + $.v.lang);
          $.f.debug('Domain: ' + $.v.domain);
          return { 's': $.v.lang, 'd': $.v.domain};
        },
        // finished, render if needed
        done: function() {
          var i, n;
          $.f.debug('done');
          // do we need to close instead of pinning
          if ($.v.data.close) {
            // if we've rendered the grid from the extension, close it
            if (typeof $.f.extendedClose === 'function') {
              $.f.extendedClose();
            }
            // have we been instructed not to say anything?
            if (!$.v.config.quiet) {
              $.w.setTimeout(function () {
                $.f.alert($.v.data.close);
              }, 10);
            }
          } else {

            $.f.langLocLookup();
            $.v.config.domain = $.v.domain;
            $.v.config.lang = $.v.lang;

            // we are pinning
            if ($.v.data.imageless) {
              $.v.found.unshift($.v.data.imageless);
            }
            $.f.arrange();

            // backwards compatibility with previous IOS/Android releases
            $.v.data.thumb = $.v.found;
            for (i = 0, n = $.v.data.thumb.length; i < n; i = i + 1) {
              $.v.data.thumb[i].src = $.v.data.thumb[i].media;
              if ($.v.data.thumb[i].isVideo) {
                $.v.data.thumb[i].multimedia = true;
              }
            }

            // IOS share sheet
            if ($.v.config.share) {
              $.f.debug('ios share');
              $.d.b.setAttribute($.v.config.share, JSON.stringify($.v.data));
              if (!$.v.data.thumb.length && !$.v.config.quiet) {
                $.f.alert($.v.msg.noPinnablesFound);
              }
              return;
            }

            // other headless rendering
            if ($.w[$.v.config.render] && typeof $.w[$.v.config.render] === 'function') {
              $.f.debug('custom render');
              $.w[$.v.config.render]($.v.data);
              return;
            }

            // load and activate grid.html

            // get the page's current overflow style; we're going to set it to hidden to freeze background scrolling
            $.v.defaultBodyOverflow = '';

            // be nicer to IE8
            if (typeof $.w.getComputedStyle === 'function' && $.w.getComputedStyle($.d.b).getPropertyValue === 'function') {
              $.v.defaultBodyOverflow = $.w.getComputedStyle($.d.b).getPropertyValue('overflow');
            }

            // don't leave "visible" as an inline style; it's the default
            if ($.v.defaultBodyOverflow === 'visible') {
              $.v.defaultBodyOverflow = '';
            }

            // freeze the page underneath the modal
            $.d.b.style.overflow = 'hidden';

            $.f.debug('darkmark share');
            $.v.data.config = $.v.config;

            $.v.data.hazExtension = $.f.get($.d.b, 'data-pinterest-extension-installed');

            var k = JSON.stringify($.v.data);
            $.s.dark = $.f.make({'IFRAME':{
              'id': $.a.k + '_grid',
              'src': $.a.grid + '?' + new Date().getTime(),
              'frameBorder': '0',
              'style': {
                'display': 'block',
                'position': 'fixed',
                'height': '100%',
                'width': '100%',
                'top': '0',
                'left': '0',
                'bottom': '0',
                'right': '0',
                'margin': '0',
                'clip': 'auto',
                'opacity': '1',
                'z-index': '9223372036854775807'
              }
            }});

            var closeGrid = function() {
              $.d.b.style.overflow = $.v.defaultBodyOverflow;
              $.d.b.removeAttribute($.a.hazPinningNow);
              $.f.kill($.s.dark);
            };
            var startTime = new Date().getTime();
            $.s.dark.onload = function() {
              var renderTime = new Date().getTime() - startTime;
              $.f.debug('Grid render time: ' + renderTime);
              $.f.log({'reason': 'bookmarklet_rendered', 'time': renderTime});
              $.v.receiver = $.s.dark.contentWindow;
              $.v.receiver.postMessage(k, $.s.dark.src);
              $.f.listen($.w, 'message', function (e) {
                $.w.clearTimeout($.v.renderFailed);
                if (e.data === 'x') {
                  closeGrid();
                }
              });
              this.focus();
            };
            $.f.set($.d.b, $.a.hazPinningNow, 'true');
            $.d.b.appendChild($.s.dark);
            // iframe has five seconds to reply with "rendered" or we kill it
            $.v.renderFailed = $.w.setTimeout(function() {
              $.f.log({'reason': 'iframe_timeout'});
              $.f.alert($.v.msg.noPinnablesFound);
              closeGrid();
            }, $.a.maxWait);
          }
        },
        // set language
        setLang: function (lang) {
          // got lang? see if we have a set of messages that match
          // $.v.msg has already been filled with English during init
          if (lang) {
            if (typeof $.a.msg[lang] === 'object') {
              // direct match for compounds like br-pt
              $.f.debug('Set language ' + lang);
              $.v.msg = $.a.msg[lang];
            } else {
              // match first part: en-uk or en-gb = en
              lang = lang.split('-')[0];
              if (typeof $.a.msg[lang] === 'object') {
                $.f.debug('Set language ' + lang);
                $.v.msg = $.a.msg[lang];
              } else {
                $.f.debug('Default language to en');
                $.v.msg = $.a.msg['en'];
              }
            }
          }
        },
        // check for non-default language
        getLang: function () {
          var lang;
          // check for lang attribute on HTML
          lang = $.d.getElementsByTagName('HTML')[0].getAttribute('lang') || 'en';
          if (lang) {
            // lang comes from HTML attribute
            lang = lang.toLowerCase();
            $.f.setLang(lang);
          }
        },
        // special handlers for browser extensions and mobile applications
        extend: {
          browser: function () {
            var b, v, i, p;
            if (typeof chrome !== 'undefined') {
              b = chrome;
            } else {
              if (typeof browser !== 'undefined') {
                b = browser;
              }
            }
            if (b && b.runtime && b.runtime.getManifest && b.runtime.sendMessage) {
              v = b.runtime.getManifest().version;
              p = v.split('.');
              for (var i = 0; i < p.length; i = i + 1) {
                p[i] = p[i] - 0;
              }
              // are we on a v2 extension?
              if (p[0] > 1) {
                // this will be overwritten later by getConfig for other clients
                $.v.config.render = 'openGrid';
                $.w.openGrid = function () {
                  $.v.data.config = $.v.config;
                  b.runtime.sendMessage({'to': 'background', 'act': 'populateGrid', 'data': $.v.data}, function() {});
                };
                // fire this if $.v.data.close alerts anything
                $.f.extendedClose = function () {
                  b.runtime.sendMessage({'to': 'background', 'act': 'closeGrid'}, function() {});
                };
                $.f.debug('advanced browser extension found');
                // only do extended behaviors for v2 extensions
                $.v.extended = true;
              }
            }
          },
          ios: function () {
            // look for IOS callback
            if ($.w.webkit &&
                $.w.webkit.messageHandlers &&
                $.w.webkit.messageHandlers.pinmarkletCompletionHandler &&
                $.w.webkit.messageHandlers.pinmarkletCompletionHandler.postMessage) {
              $.v.config.render = 'openIOSAppShare';
              $.w.openIOSAppShare = function () {
                $.w.webkit.messageHandlers.pinmarkletCompletionHandler.postMessage($.v.data);
              };
              $.v.config.quiet = true;
              // fire this if $.v.data.close alerts anything
              $.f.extendedClose = function () {
                $.w.webkit.messageHandlers.pinmarkletCompletionHandler.postMessage({'pinmarkletClosedReason': $.v.data.close});
              };
              $.f.debug('IOS app found');
              $.v.extended = true;
            }
          },
          android: function () {
            // look for Android callback
            if ($.w.JavaScriptInterface && $.w.JavaScriptInterface.onPinsLoaded) {
              $.v.config.render = 'openAndroidAppShare';
              $.w.openAndroidAppShare = function () {
                $.w.JavaScriptInterface.onPinsLoaded(JSON.stringify($.v.data));
              };
              // fire this if $.v.data.close alerts anything
              $.f.extendedClose = function () {
                $.w.JavaScriptInterface.onPinsLoaded(JSON.stringify({'pinmarkletClosedReason': $.v.data.close}));
              };
              $.f.debug('Android app found');
              $.v.extended = true;
            }
          }
        },

        // get started
        init: function () {
          var i, n, o, check, xf, t, title;

          $.d.b = $.d.getElementsByTagName('BODY')[0];
          if (!$.d.b) {
            return;
          }
          if (!$.w.getComputedStyle) {
            $.w.getComputedStyle = function () {
              return false;
            };
          }
          if (!$.f.get($.d.b, $.a.hazPinningNow)) {
            $.d.d = $.d.documentElement;
            $.d.h = $.d.getElementsByTagName('HEAD')[0];

            // special love for sites that have more than one TITLE tag
            title = $.d.URL.split('//')[1].split('#')[0].replace(/\//g, ' ');
            if ($.d.h) {
              t = $.d.h.getElementsByTagName('TITLE');
              for (i = 0, n = t.length; i < n; i = i + 1) {
                if (t[i].textContent) {
                  title = t[i].textContent;
                }
              }
            }

            $.v = {
              'title': $.f.clean(title),
              'sourceOrder': 0,
              'canonicalUrl': $.d.URL,
              'src': {},
              'config': {
                'pinMethod': 'bookmarklet',
                // Empty field for iOS share extension hook.
                'share': '',
                'quality': $.a.quality,
                'xv': $.d.b.getAttribute($.a.xv)
              },
              'hazSet': {},
              'meta': {
                'og': {},
                'pinterest': {}
              },
              'imgLoadingCount': 0,
              'callbackLoadingCount': 0,
              'srcDomain': {},
              'extensionVer': $.f.get($.d.b, 'data-pinterest-extension-installed') || undefined,
              'msg': $.a.msg.en,
              'css': '',
              'data': {
                'blacklistedSource': {},
                'thumb': [],
                'url': $.d.URL
              },
              'found': []
            };

            // add behaviors for known extensions and apps
            for (xf in $.f.extend) {
              if (typeof $.f.extend[xf] === 'function' && !$.v.extended) {
                $.f.extend[xf]();
              }
            }

            // always make the imageless pin
            $.f.makeImageless();

            $.f.getLang();
            $.f.getConfig();

            // internal debugging
            if ($.v.config.pinbox) {
              $.v.data.pinbox = $.v.config.pinbox;
            }

            if (!$.f.check.domain($.d.URL)) {
              // don't pin anything from this domain
              $.v.data.close = $.v.msg.noPinDomain;
              $.f.done();
            } else {

              $.f.runMods('page');
              $.f.getTags();
              $.f.runMods('meta');

              // if we go too long, stop
              $.v.safety = $.w.setTimeout(function () {
                // we've timed out, cancel check loop
                if ($.v.check) {
                  $.w.clearTimeout($.v.check);
                }
                $.f.done();
              }, $.a.maxWait);
              // check every 100ms for done
              check = function () {
                if ($.v.imgLoadingCount > 0 || $.v.callbackLoadingCount > 0) {
                  $.v.check = $.w.setTimeout(check, 100);
                } else {
                  // we're done, cancel safety function
                  if ($.v.safety) {
                    $.w.clearTimeout($.v.safety);
                  }
                  $.f.done();
                }
              };
              // start checking for remote image load
              check();
            }
          }
        }
      };
    }())
  };
  $.f.init();
}(window, document, navigator, {
  'k': 'PIN_' + new Date().getTime(),
  'me': /\/\/assets\.pinterest\.com\/js\/pinmarklet\.js/,
  'grid': 'https://assets.pinterest.com/ext/grid.html?' + new Date().getTime(),
  'save': {
    'domain': {
      'www': true,
      'uk': true,
      'br': true,
      'jp': true,
      'fr': true,
      'es': true,
      'pl': true,
      'de': true,
      'ru': true,
      'it': true,
      'au': true,
      'nl': true,
      'tr': true,
      'id': true,
      'hu': true,
      'pt': true,
      'se': true,
      'cz': true,
      'gr': true,
      'kr': true,
      'ro': true,
      'dk': true,
      'sk': true,
      'fi': true,
      'in': true,
      'no': true,
      'za': true,
      'nz': true
    },
    'lookup': {
      // alt location: cs
      'cs': {
        'd': 'cz'
      },
      // alt location: dk
      'da': {
        'd': 'dk'
      },
      // default de / de-de; alt de-at
      'de': {
        'alt': {
          // Austria
          'at': 'de'
        }
      },
      // alt locale: gr; Greece also gets requests for el-cy
      'el': {
        'd': 'gr',
        'alt': {
          // Cyprus
          'cy': 'gr'
        }
      },
      // English has many alt domains
      'en': {
        'alt': {
          // Australia
          'au': 'au',
          // Great Britain
          'gb': 'uk',
          // Ireland
          'ie': 'uk',
          // India
          'in': 'in',
          // New Zealand
          'nz': 'nz',
          // United Kingdom
          'uk': 'uk',
          // South Africa
          'za': 'za'
        }
      },
      // Spanish also has many alt domains
      'es': {
        'alt': {
          // Latin America
          '419': 'www',
          // Argentina
          'ar': 'www',
          // Chile
          'cl': 'www',
          // Columbia
          'co': 'www',
          // Latin America
          'la': 'www',
          // Mexico
          'mx': 'www',
          // Peru
          'pe': 'www',
          // USA
          'us': 'www',
          // Uruguay
          'uy': 'www',
          // Venezuela
          've': 'www',
          // Latin America
          'xl': 'www'
        }
      },
      // Finnish: fi and fi-fi work; all others go to lang-domain
      'fi': true,
      // French: auto-default to France, but do the right things for Belgium and Canada
      'fr': {
        'alt': {
          'be': 'fr',
          'ca': 'www'
        }
      },
      // Hindu: redirect to India (so does en-in)
      'hi': {
        'd': 'in'
      },
      'hu': true,
      'id': true,
      'it': true,
      'ja': {
        'd': 'jp'
      },
      'ko': {
        'd': 'kr'
      },
      // Malaysian: send to WWW
      'ms': {
        'd': 'www'
      },
      'nl': {
        'alt': {
          'be': 'nl'
        }
      },
      'nb': {
        'd': 'no'
      },
      'pl': true,
      'pt': {
        'alt': {
          // Brazil
          'br': {
            'd': 'br',
            's': 'pt-br'
          }
        }
      },
      'ro': true,
      'ru': true,
      'sk': true,
      'sv': {
        'd': 'se'
      },
      'tl': {
        'd': 'www'
      },
      'th': {
        'd': 'www'
      },
      'tr': {
        'alt': {
          // Cyprus
          'cy': 'tr'
        }
      },
      'uk': true,
      'vi': true
    }
  },
  'maxWait': 5000,
  'quality': 30,
  'xv': 'data-pinterest-extension-installed',
  'log': 'https://log.pinterest.com/',
  'hazPinningNow': 'data-pinterest-pinmarklet-rendered',
  'pattern': {
    'instagram': {
      'page': /^https?:\/\/(.*?\.|)instagram\.com\//,
      'url': /^https?:\/\/(.*?\.|)instagram\.com\/p\//
    },
    'amazon': {
      'media': /^https?:\/\/(.*?\.|)images-amazon\.com\/images\//,
      'page': /^https?:\/\/(.*?\.|)amazon\.com\//
    },
    'pinterest': {
      'page': /^https?:\/\/(([a-z]{1,3})\.)?pinterest\.com\//
    },
    'facebook': {
      'page': /^https?:\/\/([a-zA-Z0-9]*\.|)facebook\.com\//
    },
    'craigslist': {
      'page': /^https?:\/\/(.*?\.|)craigslist\.org\//
    },
    'itunes': {
      'page': /^https?:\/\/itunes\.apple\.com\//
    },
    'youtube': {
      'iframe': /^https?:\/\/www\.youtube\.com\/embed/,
      'media': /^https?:\/\/(.*?\.|)ytimg\.com\/(vi|li)\//,
      'page': /^https?:\/\/(.*?\.|)youtube\.com\//
    },
    'flickr': {
      'media': /^https?:\/\/(.*?)\.staticflickr\.com\//,
      'page': /^https?:\/\/www\.flickr\.com\//
    },
    '500px': {
      'media': /^https?:\/\/(.*?)\.500px\.org\//
    },
    'vimeo': {
      'iframe': /^https?:\/\/player\.vimeo\.com\/video\//,
      'media': /^https?:\/\/i\.vimeocdn\.com\/video\//,
      'page': /^https?:\/\/vimeo\.com\//
    },
    'google': {
      'page': /^https?:\/\/www\.google\.com\/search(.*&tbm=isch.*)/
    },
    'twitter': {
      'page': /^https?:\/\/twitter\.com\//
    },
    'wikipedia': {
      'page': /^https?:\/\/(.*?\.|)wikipedia\.org\//
    }
  },
  'validConfigParam': ['debug', 'noCancel', 'noHeader', 'pinMethod', 'render', 'share', 'quiet', 'quality', 'pinbox', 'via', 'xuid', 'edu', 'guid'],
  'validImageFileType': {'gif': 1, 'jpg': 1, 'jpeg': 1, 'png': 1},
  'invalidImageFileType': {'svg': 1},
  'imgLimitMin': 119,
  'imgLimitFloor': 79,
  'imgLimitHorz': 3,
  'thumbCellSize': 236,
  'thumbCellMargin': 14,
  'tag': {
    'link': [
      'rel',
      'href'
    ],
    'meta': [
      'name',
      'content',
      'property',
      'http-equiv',
      'content-language'
    ],
    'a': [
      'data-pin-href',
      'data-pin-id'
    ],
    'iframe': [
      'src'
    ],
    'img': [
      'src',
      'title',
      'alt',
      'naturalHeight',
      'naturalWidth',
      'nopin',
      'data-pin-nopin',
      'data-pin-id',
      'data-pin-media',
      'data-pin-url',
      'data-pin-description',
      'usemap'
    ]
  },
  'msg': {
    "en": {
      "noPinDomain": "Sorry, pinning is not allowed from this domain. Please contact the site operator if you have any questions.",
      "noPinMeta": "Sorry, pinning is not allowed from this page. Please contact the site operator if you have any questions.",
      "noPinnablesFound": "Sorry, couldn't find any pinnable things on this page.",
      "noPinningFromPinterest": "Oops! That button doesn't work on Pinterest. Try using the red Save button at the top of any Pin."
    },
    "cs": {
      "noPinDomain": "Je n&#xE1;m l&#xED;to. Z t&#xE9;to dom&#xE9;ny nen&#xED; mo&#x17E;n&#xE9; p&#x159;id&#xE1;vat piny. S dotazy se obracejte na provozovatele webu.",
      "noPinMeta": "Je n&#xE1;m l&#xED;to. Z t&#xE9;to str&#xE1;nky nen&#xED; mo&#x17E;n&#xE9; p&#x159;id&#xE1;vat piny. S dotazy se obracejte na provozovatele webu.",
      "noPinnablesFound": "Je n&#xE1;m l&#xED;to. Na t&#xE9;to str&#xE1;nce jsme nenalezli &#x17E;&#xE1;dn&#xFD; obsah, kter&#xFD; by bylo mo&#x17E;n&#xE9; p&#x159;ipnout.",
      "noPinningFromPinterest": "Jejda. Tohle tla&#x10D;&#xED;tko na Pinterestu nefunguje. Zkuste pou&#x17E;&#xED;t &#x10D;erven&#xE9; tla&#x10D;&#xED;tko Pin It v horn&#xED; &#x10D;&#xE1;sti kter&#xE9;hokoliv pinu."
    },
    "da": {
      "noPinDomain": "Det er ikke muligt at tilf&#xF8;je pins fra dom&#xE6;net. Kontakt websitets ejer, hvis du har sp&#xF8;rgsm&#xE5;l.",
      "noPinMeta": "Det er ikke tilladt at s&#xE6;tte pins op fra denne side. Kontakt websitets ejer, hvis du har sp&#xF8;rgsm&#xE5;l.",
      "noPinnablesFound": "Der er ikke rigtigt noget at s&#xE6;tte op p&#xE5; denne side.",
      "noPinningFromPinterest": "Den knap virker desv&#xE6;rre ikke p&#xE5; Pinterest. Pr&#xF8;v den r&#xF8;de Pin It-knap &#xF8;verst p&#xE5; en pin i stedet for."
    },
    "de": {
      "noPinDomain": "Es tut uns leid, aber von dieser Domain kann nichts gepinnt werden. Bitte kontaktiere den Website-Betreiber, falls du weitere Fragen hast.",
      "noPinMeta": "Es tut uns leid, aber von dieser Seite kann nichts gepinnt werden. Bitte kontaktiere den Website-Betreiber, falls du weitere Fragen hast.",
      "noPinnablesFound": "Es tut uns leid, aber wir konnten auf dieser Seite nichts finden, was du pinnen k&#xF6;nntest.",
      "noPinningFromPinterest": "Hoppla!\nDieser Button funktioniert auf Pinterest nicht.\nVersuchen Sie es stattdessen mit dem roten &#x201E;Pin It\"-Button, der sich oberhalb jedes Pins befindet."
    },
    "es": {
      "noPinDomain": "Lo sentimos, no est&#xE1; permitido pinear desde este dominio. Ponte en contacto con el operador del sitio si tienes alguna pregunta.",
      "noPinMeta": "Lo sentimos, no est&#xE1; permitido pinear desde esta p&#xE1;gina. Ponte en contacto con el operador del sitio si tienes alguna pregunta.",
      "noPinnablesFound": "Lo sentimos, no hemos encontrado ning&#xFA;n elemento que se pueda pinear en esta p&#xE1;gina.",
      "noPinningFromPinterest": "&#xA1;Vaya! \nEse bot&#xF3;n no funciona en Pinterest. \nUsa el bot&#xF3;n Pin It rojo que se encuentra en la parte superior de cualquier Pin."
    },
    "es-mx": {
      "noPinDomain": "Lamentablemente, no est&#xE1; permitido pinear desde este dominio. Si quieres hacer consultas, comun&#xED;cate con el operador del sitio.",
      "noPinMeta": "Lamentablemente, no est&#xE1; permitido pinear desde esta p&#xE1;gina. Si quieres hacer consultas, comun&#xED;cate con el operador del sitio.",
      "noPinnablesFound": "Lamentablemente, no se encontraron cosas para pinear en esta p&#xE1;gina.",
      "noPinningFromPinterest": "&#xA1;Uy! \nEse bot&#xF3;n no funciona en Pinterest.\nIntenta con el bot&#xF3;n rojo de Pin It, ubicado en la parte superior de cualquier Pin."
    },
    "el": {
      "noPinDomain": "&#x39B;&#x3C5;&#x3C0;&#x3AC;&#x3BC;&#x3B1;&#x3B9;, &#x3B4;&#x3B5;&#x3BD; &#x3B5;&#x3C0;&#x3B9;&#x3C4;&#x3C1;&#x3AD;&#x3C0;&#x3B5;&#x3C4;&#x3B1;&#x3B9; &#x3C4;&#x3BF; &#x3BA;&#x3B1;&#x3C1;&#x3C6;&#x3AF;&#x3C4;&#x3C3;&#x3C9;&#x3BC;&#x3B1; &#x3B1;&#x3C0;&#x3CC; &#x3B1;&#x3C5;&#x3C4;&#x3CC;&#x3BD; &#x3C4;&#x3BF;&#x3BD; &#x3C4;&#x3BF;&#x3BC;&#x3AD;&#x3B1;. &#x395;&#x3C0;&#x3B9;&#x3BA;&#x3BF;&#x3B9;&#x3BD;&#x3C9;&#x3BD;&#x3AE;&#x3C3;&#x3C4;&#x3B5; &#x3BC;&#x3B5; &#x3C4;&#x3BF; &#x3B4;&#x3B9;&#x3B1;&#x3C7;&#x3B5;&#x3B9;&#x3C1;&#x3B9;&#x3C3;&#x3C4;&#x3AE; &#x3C4;&#x3B7;&#x3C2; &#x3B9;&#x3C3;&#x3C4;&#x3BF;&#x3C3;&#x3B5;&#x3BB;&#x3AF;&#x3B4;&#x3B1;&#x3C2; &#x3B1;&#x3BD; &#x3AD;&#x3C7;&#x3B5;&#x3C4;&#x3B5; &#x3B1;&#x3C0;&#x3BF;&#x3C1;&#x3AF;&#x3B5;&#x3C2;.",
      "noPinMeta": "&#x39B;&#x3C5;&#x3C0;&#x3AC;&#x3BC;&#x3B1;&#x3B9;, &#x3B4;&#x3B5;&#x3BD; &#x3B5;&#x3C0;&#x3B9;&#x3C4;&#x3C1;&#x3AD;&#x3C0;&#x3B5;&#x3C4;&#x3B1;&#x3B9; &#x3C4;&#x3BF; &#x3BA;&#x3B1;&#x3C1;&#x3C6;&#x3AF;&#x3C4;&#x3C3;&#x3C9;&#x3BC;&#x3B1; &#x3B1;&#x3C0;&#x3CC; &#x3B1;&#x3C5;&#x3C4;&#x3AE;&#x3BD; &#x3C4;&#x3B7; &#x3C3;&#x3B5;&#x3BB;&#x3AF;&#x3B4;&#x3B1;. &#x395;&#x3C0;&#x3B9;&#x3BA;&#x3BF;&#x3B9;&#x3BD;&#x3C9;&#x3BD;&#x3AE;&#x3C3;&#x3C4;&#x3B5; &#x3BC;&#x3B5; &#x3C4;&#x3BF; &#x3B4;&#x3B9;&#x3B1;&#x3C7;&#x3B5;&#x3B9;&#x3C1;&#x3B9;&#x3C3;&#x3C4;&#x3AE; &#x3C4;&#x3B7;&#x3C2; &#x3B9;&#x3C3;&#x3C4;&#x3BF;&#x3C3;&#x3B5;&#x3BB;&#x3AF;&#x3B4;&#x3B1;&#x3C2; &#x3B1;&#x3BD; &#x3AD;&#x3C7;&#x3B5;&#x3C4;&#x3B5; &#x3B1;&#x3C0;&#x3BF;&#x3C1;&#x3AF;&#x3B5;&#x3C2;.",
      "noPinnablesFound": "&#x39B;&#x3C5;&#x3C0;&#x3AC;&#x3BC;&#x3B1;&#x3B9;, &#x3B4;&#x3B5;&#x3BD; &#x3AE;&#x3C4;&#x3B1;&#x3BD; &#x3B4;&#x3C5;&#x3BD;&#x3B1;&#x3C4;&#x3AE; &#x3B7; &#x3B5;&#x3CD;&#x3C1;&#x3B5;&#x3C3;&#x3B7; &#x3C3;&#x3C4;&#x3BF;&#x3B9;&#x3C7;&#x3B5;&#x3AF;&#x3C9;&#x3BD; &#x3C0;&#x3BF;&#x3C5; &#x3BC;&#x3C0;&#x3BF;&#x3C1;&#x3BF;&#x3CD;&#x3BD; &#x3BD;&#x3B1; &#x3BA;&#x3B1;&#x3C1;&#x3C6;&#x3B9;&#x3C4;&#x3C3;&#x3C9;&#x3B8;&#x3BF;&#x3CD;&#x3BD; &#x3C3;&#x3B5; &#x3B1;&#x3C5;&#x3C4;&#x3AE;&#x3BD; &#x3C4;&#x3B7; &#x3C3;&#x3B5;&#x3BB;&#x3AF;&#x3B4;&#x3B1;.",
      "noPinningFromPinterest": "&#x394;&#x3C5;&#x3C3;&#x3C4;&#x3C5;&#x3C7;&#x3CE;&#x3C2;, &#x3B1;&#x3C5;&#x3C4;&#x3CC; &#x3C4;&#x3BF; &#x3BA;&#x3BF;&#x3C5;&#x3BC;&#x3C0;&#x3AF; &#x3B4;&#x3B5;&#x3BD; &#x3BB;&#x3B5;&#x3B9;&#x3C4;&#x3BF;&#x3C5;&#x3C1;&#x3B3;&#x3B5;&#x3AF; &#x3C3;&#x3C4;&#x3BF; Pinterest. &#x394;&#x3BF;&#x3BA;&#x3B9;&#x3BC;&#x3AC;&#x3C3;&#x3C4;&#x3B5; &#x3BD;&#x3B1; &#x3C7;&#x3C1;&#x3B7;&#x3C3;&#x3B9;&#x3BC;&#x3BF;&#x3C0;&#x3BF;&#x3B9;&#x3AE;&#x3C3;&#x3B5;&#x3C4;&#x3B5; &#x3C4;&#x3BF; &#x3BA;&#x3CC;&#x3BA;&#x3BA;&#x3B9;&#x3BD;&#x3BF; &#x3BA;&#x3BF;&#x3C5;&#x3BC;&#x3C0;&#x3AF; Pin It &#x3C3;&#x3C4;&#x3BF; &#x3B5;&#x3C0;&#x3AC;&#x3BD;&#x3C9; &#x3BC;&#x3AD;&#x3C1;&#x3BF;&#x3C2; &#x3BF;&#x3C0;&#x3BF;&#x3B9;&#x3BF;&#x3C5;&#x3B4;&#x3AE;&#x3C0;&#x3BF;&#x3C4;&#x3B5; pin.",
      "choosePin": "&#x395;&#x3C0;&#x3B9;&#x3BB;&#x3AD;&#x3BE;&#x3C4;&#x3B5; &#x3AD;&#x3BD;&#x3B1; pin &#x3B3;&#x3B9;&#x3B1; &#x3B1;&#x3C0;&#x3BF;&#x3B8;&#x3AE;&#x3BA;&#x3B5;&#x3C5;&#x3C3;&#x3B7;"
    },
    "fi": {
      "noPinDomain": "Et voi tehd&#xE4; Pin-lis&#xE4;yksi&#xE4; t&#xE4;st&#xE4; verkkotunnuksesta. Jos sinulla on kysytt&#xE4;v&#xE4;&#xE4;, ota yhteytt&#xE4; sivuston yll&#xE4;pit&#xE4;j&#xE4;&#xE4;n.",
      "noPinMeta": "Et voi tehd&#xE4; Pin-lis&#xE4;yksi&#xE4; t&#xE4;lt&#xE4; sivulta. Jos sinulla on kysytt&#xE4;v&#xE4;&#xE4;, ota yhteytt&#xE4; sivuston yll&#xE4;pit&#xE4;j&#xE4;&#xE4;n.",
      "noPinnablesFound": "Sivulta ei valitettavasti l&#xF6;ydy sis&#xE4;lt&#xF6;&#xE4;, jota voi lis&#xE4;t&#xE4;.",
      "noPinningFromPinterest": "Hups! Painike ei toimi Pinterestiss&#xE4;. K&#xE4;yt&#xE4; Pin-lis&#xE4;yksen yl&#xE4;osassa n&#xE4;kyv&#xE4;&#xE4; punaista Pin it -painiketta."
    },
    "fr": {
      "noPinDomain": "D&#xE9;sol&#xE9;, mais vous ne pouvez pas &#xE9;pingler les contenus de ce domaine. Pour toute question, veuillez contacter l'administrateur du site.",
      "noPinMeta": "D&#xE9;sol&#xE9;, mais vous ne pouvez pas &#xE9;pingler les contenus de cette page. Pour toute question, veuillez contacter l'administrateur du site.",
      "noPinnablesFound": "D&#xE9;sol&#xE9;, mais aucun contenu susceptible d'&#xEA;tre &#xE9;pingl&#xE9; n'a &#xE9;t&#xE9; trouv&#xE9; sur cette page.",
      "noPinningFromPinterest": "Oups&#x2026;\nCe bouton ne fonctionne pas sur Pinterest.\nEssayez d'utiliser le bouton rouge Pin It en haut de chaque &#xE9;pingle."
    },
    "id": {
      "noPinDomain": "Maaf, Anda tidak diizinkan mengepin dari domain ini. Hubungi operator situs jika Anda memiliki pertanyaan.",
      "noPinMeta": "Maaf, Anda tidak diizinkan mengepin dari halaman ini. Silakan hubungi operator situs jika Anda memiliki pertanyaan.",
      "noPinnablesFound": "Maaf, tidak ada yang bisa dipin dari halaman ini.",
      "noPinningFromPinterest": "Duh! Tombol itu tidak bisa berfungsi di Pinterest. Cobalah menggunakan tombol Pin It di Pin mana saja"
    },
    "it": {
      "noPinDomain": "Ci dispiace, ma l'aggiunta di Pin non &#xE8; consentita da questo dominio. Se hai domande, contatta il gestore del sito.",
      "noPinMeta": "Ci dispiace, ma l'aggiunta di Pin non &#xE8; consentita da questa pagina. Se hai domande, contatta il gestore del sito.",
      "noPinnablesFound": "Spiacenti, impossibile trovare immagini o video che &#xE8; possibile aggiungere ai Pin in questa pagina.",
      "noPinningFromPinterest": "Spiacenti! Questo pulsante non funziona su Pinterest. Prova a utilizzare il pulsante rosso Pin It nella parte superiore di qualsiasi Pin."
    },
    "hi": {
      "noPinDomain": "&#x915;&#x94D;&#x937;&#x92E;&#x93E; &#x915;&#x930;&#x947;&#x902;, &#x907;&#x938; &#x921;&#x94B;&#x92E;&#x947;&#x928; &#x938;&#x947; &#x92A;&#x93F;&#x928; &#x932;&#x917;&#x93E;&#x928;&#x947; &#x915;&#x940; &#x905;&#x928;&#x941;&#x92E;&#x924;&#x93F; &#x928;&#x939;&#x940;&#x902; &#x939;&#x948;&#x964; &#x905;&#x917;&#x930; &#x906;&#x92A;&#x915;&#x93E; &#x915;&#x94B;&#x908; &#x92A;&#x94D;&#x930;&#x936;&#x94D;&#x928; &#x939;&#x948;&#x902;, &#x924;&#x94B; &#x915;&#x943;&#x92A;&#x92F;&#x93E; &#x938;&#x93E;&#x907;&#x91F; &#x911;&#x92A;&#x930;&#x947;&#x91F;&#x930; &#x938;&#x947; &#x938;&#x902;&#x92A;&#x930;&#x94D;&#x915; &#x915;&#x930;&#x947;&#x902;&#x964;",
      "noPinMeta": "&#x915;&#x94D;&#x937;&#x92E;&#x93E; &#x915;&#x930;&#x947;&#x902;, &#x907;&#x938; &#x92A;&#x947;&#x91C; &#x938;&#x947; &#x92A;&#x93F;&#x928; &#x932;&#x917;&#x93E;&#x928;&#x947; &#x915;&#x940; &#x905;&#x928;&#x941;&#x92E;&#x924;&#x93F; &#x928;&#x939;&#x940;&#x902; &#x939;&#x948;&#x964; &#x905;&#x917;&#x930; &#x906;&#x92A;&#x915;&#x93E; &#x915;&#x94B;&#x908; &#x92A;&#x94D;&#x930;&#x936;&#x94D;&#x928; &#x939;&#x948;&#x902;, &#x924;&#x94B; &#x915;&#x943;&#x92A;&#x92F;&#x93E; &#x938;&#x93E;&#x907;&#x91F; &#x911;&#x92A;&#x930;&#x947;&#x91F;&#x930; &#x938;&#x947; &#x938;&#x902;&#x92A;&#x930;&#x94D;&#x915; &#x915;&#x930;&#x947;&#x902;&#x964;",
      "noPinnablesFound": "&#x915;&#x94D;&#x937;&#x92E;&#x93E; &#x915;&#x930;&#x947;&#x902;, &#x907;&#x938; &#x92A;&#x947;&#x91C; &#x92A;&#x930; &#x915;&#x94B;&#x908; &#x92D;&#x940; &#x92A;&#x93F;&#x928; &#x932;&#x917;&#x93E;&#x928;&#x947; &#x935;&#x93E;&#x932;&#x940; &#x91A;&#x940;&#x95B; &#x928;&#x939;&#x940;&#x902; &#x92E;&#x93F;&#x932; &#x938;&#x915;&#x940;&#x964;",
      "noPinningFromPinterest": "&#x913;&#x939;! &#x935;&#x939; &#x92C;&#x91F;&#x928; Pinterest &#x92A;&#x930; &#x915;&#x93E;&#x92E; &#x928;&#x939;&#x940;&#x902; &#x915;&#x930;&#x924;&#x93E;&#x964; &#x915;&#x93F;&#x938;&#x940; &#x92D;&#x940; &#x92A;&#x93F;&#x928; &#x915;&#x947; &#x91F;&#x949;&#x92A; &#x92A;&#x930; &#x932;&#x93E;&#x932; &#x92A;&#x93F;&#x928; &#x907;&#x91F; &#x92C;&#x91F;&#x928; &#x915;&#x93E; &#x907;&#x938;&#x94D;&#x924;&#x947;&#x92E;&#x93E;&#x932; &#x915;&#x930;&#x928;&#x947; &#x915;&#x940; &#x915;&#x94B;&#x936;&#x93F;&#x936; &#x915;&#x930;&#x947;&#x902;&#x964;"
    },
    "hu": {
      "noPinDomain": "Sajn&#xE1;ljuk, ebb&#x151;l a tartom&#xE1;nyb&#xF3;l nem lehet pinelni. K&#xE9;rj&#xFC;k, k&#xE9;rd&#xE9;seiddel fordulj az oldal &#xFC;zemeltet&#x151;j&#xE9;hez.",
      "noPinMeta": "Sajn&#xE1;ljuk, err&#x151;l az oldalr&#xF3;l nem lehet pinelni. K&#xE9;rj&#xFC;k, k&#xE9;rd&#xE9;seiddel fordulj az oldal &#xFC;zemeltet&#x151;j&#xE9;hez.",
      "noPinnablesFound": "Sajn&#xE1;ljuk, ezen az oldalon nem tal&#xE1;lhat&#xF3; semmilyen pinelhet&#x151; dolog.",
      "noPinningFromPinterest": "Hopp&#xE1;! Ez a gomb nem m&#x171;k&#xF6;dik a Pinteresten. Pr&#xF3;b&#xE1;ld meg a pinek bal fels&#x151; sark&#xE1;ban l&#xE9;v&#x151; piros Pin It gombot haszn&#xE1;lni."
    },
    "ja": {
      "noPinDomain": "&#x3057;&#x8A33;&#x3042;&#x308A;&#x307E;&#x305B;&#x3093;&#x3002;HTML &#x4EE5;&#x5916;&#x306E;&#x30DA;&#x30FC;&#x30B8;&#x3067;&#x30D4;&#x30F3;&#x3059;&#x308B;&#x3053;&#x3068;&#x306F;&#x3067;&#x304D;&#x307E;&#x305B;&#x3093;&#x3002;&#x753B;&#x50CF;&#x3092;&#x30A2;&#x30C3;&#x30D7;&#x30ED;&#x30FC;&#x30C9;&#x3057;&#x3088;&#x3046;&#x3068;&#x8A66;&#x307F;&#x3066;&#x3044;&#x308B;&#x5834;&#x5408;&#x306F;&#x3001;pinterest.com &#x306B;&#x30A2;&#x30AF;&#x30BB;&#x30B9;&#x3057;&#x3066;&#x304F;&#x3060;&#x3055;&#x3044;&#x3002;",
      "noPinMeta": "&#x3053;&#x306E;&#x30DA;&#x30FC;&#x30B8;&#x304B;&#x3089;&#x306E;&#x30D4;&#x30F3;&#x306F;&#x8A31;&#x53EF;&#x3055;&#x308C;&#x3066;&#x3044;&#x307E;&#x305B;&#x3093;&#x3002;&#x3054;&#x8CEA;&#x554F;&#x304C;&#x3042;&#x308B;&#x5834;&#x5408;&#x306F;&#x3001;&#x30B5;&#x30A4;&#x30C8;&#x904B;&#x55B6;&#x8005;&#x306B;&#x304A;&#x554F;&#x3044;&#x5408;&#x308F;&#x305B;&#x304F;&#x3060;&#x3055;&#x3044;&#x3002;",
      "noPinnablesFound": "&#x7533;&#x3057;&#x8A33;&#x3054;&#x3056;&#x3044;&#x307E;&#x305B;&#x3093;&#x3001;&#x3053;&#x306E;&#x30DA;&#x30FC;&#x30B8;&#x3067;&#x30D4;&#x30F3;&#x3067;&#x304D;&#x308B;&#x30A2;&#x30A4;&#x30C6;&#x30E0;&#x306F;&#x898B;&#x3064;&#x304B;&#x308A;&#x307E;&#x305B;&#x3093;&#x3067;&#x3057;&#x305F;&#x3002;",
      "noPinningFromPinterest": "Pinterest &#x3067;&#x306F;&#x3053;&#x306E;&#x30DC;&#x30BF;&#x30F3;&#x306F;&#x4F7F;&#x3048;&#x307E;&#x305B;&#x3093;&#x3002;\n&#x30D4;&#x30F3;&#x306E;&#x4E0A;&#x90E8;&#x306B;&#x3042;&#x308B;&#x8D64;&#x3044; [&#x30D4;&#x30F3;] &#x30DC;&#x30BF;&#x30F3;&#x3092;&#x304A;&#x4F7F;&#x3044;&#x304F;&#x3060;&#x3055;&#x3044;&#x3002;"
    },
    "ko": {
      "noPinDomain": "&#xC8C4;&#xC1A1;&#xD569;&#xB2C8;&#xB2E4;. &#xC774; &#xB3C4;&#xBA54;&#xC778;&#xC5D0;&#xC11C;&#xB294; &#xD540;&#xD558;&#xAE30;&#xAC00; &#xD5C8;&#xC6A9;&#xB418;&#xC9C0; &#xC54A;&#xC2B5;&#xB2C8;&#xB2E4;. &#xC9C8;&#xBB38;&#xC774; &#xC788;&#xC73C;&#xC2DC;&#xBA74; &#xC0AC;&#xC774;&#xD2B8; &#xC6B4;&#xC601;&#xC790;&#xC5D0;&#xAC8C; &#xBB38;&#xC758;&#xD558;&#xC2DC;&#xAE30; &#xBC14;&#xB78D;&#xB2C8;&#xB2E4;.",
      "noPinMeta": "&#xC8C4;&#xC1A1;&#xD569;&#xB2C8;&#xB2E4;. &#xC774; &#xD398;&#xC774;&#xC9C0;&#xC5D0;&#xC11C;&#xB294; &#xD540;&#xD558;&#xAE30;&#xAC00; &#xD5C8;&#xC6A9;&#xB418;&#xC9C0; &#xC54A;&#xC2B5;&#xB2C8;&#xB2E4;. &#xC9C8;&#xBB38;&#xC774; &#xC788;&#xC73C;&#xC2DC;&#xBA74; &#xC0AC;&#xC774;&#xD2B8; &#xC6B4;&#xC601;&#xC790;&#xC5D0;&#xAC8C; &#xBB38;&#xC758;&#xD558;&#xC2DC;&#xAE30; &#xBC14;&#xB78D;&#xB2C8;&#xB2E4;.",
      "noPinnablesFound": "&#xC8C4;&#xC1A1;&#xD569;&#xB2C8;&#xB2E4;. &#xC774; &#xD398;&#xC774;&#xC9C0;&#xC5D0;&#xC11C; &#xD540;&#xD560; &#xC218; &#xC788;&#xB294; &#xAC83;&#xC744; &#xCC3E;&#xC9C0; &#xBABB;&#xD588;&#xC2B5;&#xB2C8;&#xB2E4;.",
      "noPinningFromPinterest": "&#xC8C4;&#xC1A1;&#xD569;&#xB2C8;&#xB2E4;. Pinterest&#xC5D0;&#xC11C; &#xC0AC;&#xC6A9;&#xD560; &#xC218; &#xC5C6;&#xB294; &#xBC84;&#xD2BC;&#xC785;&#xB2C8;&#xB2E4;. &#xD540; &#xC0C1;&#xB2E8;&#xC5D0; &#xC788;&#xB294; &#xBE68;&#xAC04;&#xC0C9; Pin It &#xBC84;&#xD2BC;&#xC744; &#xC0AC;&#xC6A9;&#xD574; &#xBCF4;&#xC138;&#xC694;."
    },
    "ms": {
      "noPinDomain": "Maaf, mengepin tidak dibenarkan dari domain ini. Sila hubungi pengendali laman jika anda ada sebarang solan.",
      "noPinMeta": "Maaf, mengepin tidak dibenarkan dari halaman ini. Sila hubungi pengendali laman jika anda ada sebarang soalan.",
      "noPinnablesFound": "Maaf, tidak dapat mencari sebarang imej yang boleh dipin pada halaman ini.",
      "noPinningFromPinterest": "Alamak! Butang itu tidak berfungsi di Pinterest. Sila cuba menggunakan butang Pin It merah di atas mana-mana Pin."
    },
    "nb": {
      "noPinDomain": "Beklager, pinning er ikke tillatt fra dette domenet. Ta kontakt med webmasteren hvis du har sp&#xF8;rsm&#xE5;l.",
      "noPinMeta": "Beklager, pinning er ikke tillatt fra denne siden. Ta kontakt med webmasteren hvis du har sp&#xF8;rsm&#xE5;l.",
      "noPinnablesFound": "Beklager, kunne ikke finne noen ting som kunne pinnes p&#xE5; denne siden.",
      "noPinningFromPinterest": "Oops! Den knappen fungerer ikke p&#xE5; Pinterest. Pr&#xF8;v &#xE5; bruke den r&#xF8;de Pin It-knappen som er p&#xE5; toppen av alle Pins."
    },
    "nl": {
      "noPinDomain": "Sorry, het is niet toegestaan om vanaf dit domein te pinnen. Neem contact op met de beheerder van deze website als je vragen hebt.",
      "noPinMeta": "Sorry, het is niet toegestaan om vanaf dit domein te pinnen. Neem contact op met de beheerder van deze website als je vragen hebt.",
      "noPinnablesFound": "Sorry, er is niets wat je kunt pinnen op deze pagina.",
      "noPinningFromPinterest": "Oeps!\nDie knop werkt niet op Pinterest.\nProbeer de rode Pin It-knoppen die boven pins zweven."
    },
    "pl": {
      "noPinDomain": "Niestety przypinanie z tej domeny jest niedozwolone. Skontaktuj si&#x119; z operatorem witryny, je&#x15B;li masz pytania.",
      "noPinMeta": "Niestety przypinanie z tej strony jest niedozwolone. Skontaktuj si&#x119; z operatorem witryny, je&#x15B;li masz pytania.",
      "noPinnablesFound": "Niestety na tej stronie nie ma &#x17C;adnych rzeczy do przypinania.",
      "noPinningFromPinterest": "Ups! Ten przycisk nie dzia&#x142;a na Pintere&#x15B;cie. Spr&#xF3;buj u&#x17C;y&#x107; czerwonego przycisku Pin It u g&#xF3;ry dowolnego Pina."
    },
    "pt": {
      "noPinDomain": "Lamentamos, mas n&#xE3;o &#xE9; permitido afixar pins a partir deste dom&#xED;nio. Em caso de d&#xFA;vidas, contacta o operador do site.",
      "noPinMeta": "Lamentamos, mas n&#xE3;o &#xE9; permitido afixar pins a partir desta p&#xE1;gina. Em caso de d&#xFA;vidas, contacta o operador do site.",
      "noPinnablesFound": "Lamentamos, mas n&#xE3;o foi poss&#xED;vel encontrar nesta p&#xE1;gina nenhum conte&#xFA;do que possa ser afixado.",
      "noPinningFromPinterest": "Ups! \nEsse bot&#xE3;o n&#xE3;o funciona no Pinterest. \nTenta utilizar o bot&#xE3;o vermelho Pin It, que se encontra na parte superior de cada Pin."
    },
    "pt-br": {
      "noPinDomain": "N&#xE3;o &#xE9; poss&#xED;vel pinar a partir deste dom&#xED;nio. Entre em contato com o operador do site se tiver d&#xFA;vidas.",
      "noPinMeta": "N&#xE3;o &#xE9; poss&#xED;vel pinar a partir desta p&#xE1;gina. Entre em contato com o operador do site se tiver d&#xFA;vidas.",
      "noPinnablesFound": "N&#xE3;o foi poss&#xED;vel encontrar nesta p&#xE1;gina conte&#xFA;do que possa ser pinado.",
      "noPinningFromPinterest": "Opa!\nEste bot&#xE3;o n&#xE3;o funciona no Pinterest.\nTente usar o bot&#xE3;o vermelho Pin It, localizado na parte superior de qualquer Pin."
    },
    "ro": {
      "noPinDomain": "Ne pare r&#x103;u, nu se pot ad&#x103;uga Pinuri de pe acest site. Te rug&#x103;m s&#x103;-l contactezi pe operatorul site-ului dac&#x103; ai &#xEE;ntreb&#x103;ri.",
      "noPinMeta": "Ne pare r&#x103;u, nu se pot ad&#x103;uga Pinuri de pe aceast&#x103; pagin&#x103;. Te rug&#x103;m s&#x103;-l contactezi pe operatorul site-ului dac&#x103; ai &#xEE;ntreb&#x103;ri.",
      "noPinnablesFound": "Ne pare r&#x103;u, nu am putut g&#x103;si con&#x21B;inut pentru ad&#x103;ugat ca Pinuri pe aceast&#x103; pagin&#x103;.",
      "noPinningFromPinterest": "Oops! Acest buton nu func&#x21B;ioneaz&#x103; pe Pinterest. &#xCE;ncearc&#x103; s&#x103; folose&#x219;ti butonul ro&#x219;u Pin It din partea de sus a oric&#x103;rui Pin."
    },
    "ru": {
      "noPinDomain": "&#x41A; &#x441;&#x43E;&#x436;&#x430;&#x43B;&#x435;&#x43D;&#x438;&#x44E;, &#x43F;&#x440;&#x438;&#x43A;&#x430;&#x43B;&#x44B;&#x432;&#x430;&#x43D;&#x438;&#x435; &#x41F;&#x438;&#x43D;&#x43E;&#x432; &#x432; &#x434;&#x430;&#x43D;&#x43D;&#x43E;&#x43C; &#x434;&#x43E;&#x43C;&#x435;&#x43D;&#x435; &#x43D;&#x435;&#x432;&#x43E;&#x437;&#x43C;&#x43E;&#x436;&#x43D;&#x43E;. &#x421;&#x43E; &#x432;&#x441;&#x435;&#x43C;&#x438; &#x432;&#x43E;&#x43F;&#x440;&#x43E;&#x441;&#x430;&#x43C;&#x438; &#x43E;&#x431;&#x440;&#x430;&#x449;&#x430;&#x439;&#x442;&#x435;&#x441;&#x44C; &#x43A; &#x430;&#x434;&#x43C;&#x438;&#x43D;&#x438;&#x441;&#x442;&#x440;&#x430;&#x442;&#x43E;&#x440;&#x443; &#x432;&#x435;&#x431;-&#x441;&#x430;&#x439;&#x442;&#x430;.",
      "noPinMeta": "&#x41A; &#x441;&#x43E;&#x436;&#x430;&#x43B;&#x435;&#x43D;&#x438;&#x44E;, &#x43F;&#x440;&#x438;&#x43A;&#x430;&#x43B;&#x44B;&#x432;&#x430;&#x43D;&#x438;&#x435; &#x41F;&#x438;&#x43D;&#x43E;&#x432; &#x441; &#x434;&#x430;&#x43D;&#x43D;&#x43E;&#x439; &#x441;&#x442;&#x440;&#x430;&#x43D;&#x438;&#x446;&#x44B; &#x43D;&#x435;&#x432;&#x43E;&#x437;&#x43C;&#x43E;&#x436;&#x43D;&#x43E;. &#x421;&#x43E; &#x432;&#x441;&#x435;&#x43C;&#x438; &#x432;&#x43E;&#x43F;&#x440;&#x43E;&#x441;&#x430;&#x43C;&#x438; &#x43E;&#x431;&#x440;&#x430;&#x449;&#x430;&#x439;&#x442;&#x435;&#x441;&#x44C; &#x43A; &#x430;&#x434;&#x43C;&#x438;&#x43D;&#x438;&#x441;&#x442;&#x440;&#x430;&#x442;&#x43E;&#x440;&#x443; &#x432;&#x435;&#x431;-&#x441;&#x430;&#x439;&#x442;&#x430;.",
      "noPinnablesFound": "&#x41D;&#x430; &#x44D;&#x442;&#x43E;&#x439; &#x441;&#x442;&#x440;&#x430;&#x43D;&#x438;&#x446;&#x435; &#x43D;&#x435;&#x442; &#x43D;&#x438;&#x447;&#x435;&#x433;&#x43E;, &#x447;&#x442;&#x43E; &#x43C;&#x43E;&#x436;&#x43D;&#x43E; &#x431;&#x44B;&#x43B;&#x43E; &#x431;&#x44B; &#x43F;&#x440;&#x438;&#x43A;&#x43E;&#x43B;&#x43E;&#x442;&#x44C;.",
      "noPinningFromPinterest": "&#x41A; &#x441;&#x43E;&#x436;&#x430;&#x43B;&#x435;&#x43D;&#x438;&#x44E;, &#x434;&#x430;&#x43D;&#x43D;&#x430;&#x44F; &#x43A;&#x43D;&#x43E;&#x43F;&#x43A;&#x430; &#x43D;&#x435; &#x440;&#x430;&#x431;&#x43E;&#x442;&#x430;&#x435;&#x442; &#x432; Pinterest. &#x41F;&#x43E;&#x43F;&#x440;&#x43E;&#x431;&#x443;&#x439;&#x442;&#x435; &#x438;&#x441;&#x43F;&#x43E;&#x43B;&#x44C;&#x437;&#x43E;&#x432;&#x430;&#x442;&#x44C; &#x43A;&#x440;&#x430;&#x441;&#x43D;&#x443;&#x44E; &#x43A;&#x43D;&#x43E;&#x43F;&#x43A;&#x443; Pin It, &#x43D;&#x430;&#x445;&#x43E;&#x434;&#x44F;&#x449;&#x443;&#x44E;&#x441;&#x44F; &#x432; &#x432;&#x435;&#x440;&#x445;&#x43D;&#x435;&#x439; &#x447;&#x430;&#x441;&#x442;&#x438; &#x43B;&#x44E;&#x431;&#x43E;&#x433;&#x43E; &#x41F;&#x438;&#x43D;&#x430;."
    },
    "sk": {
      "noPinDomain": "Prep&#xE1;&#x10D;te, z tejto dom&#xE9;ny si nem&#xF4;&#x17E;ete prip&#xED;na&#x165; piny. Kontaktujte prev&#xE1;dzkovate&#x13E;a str&#xE1;nky, ak m&#xE1;te nejak&#xE9; ot&#xE1;zky.",
      "noPinMeta": "Prep&#xE1;&#x10D;te, z tejto str&#xE1;nky si nem&#xF4;&#x17E;ete prip&#xED;na&#x165; piny. Kontaktujte prev&#xE1;dzkovate&#x13E;a str&#xE1;nky, ak m&#xE1;te nejak&#xE9; ot&#xE1;zky.",
      "noPinnablesFound": "Prep&#xE1;&#x10D;te, na tejto str&#xE1;nke sme nena&#x161;li ni&#x10D; na pripnutie.",
      "noPinningFromPinterest": "Hopla! To tla&#x10D;idlo nefunguje na Pintereste. Sk&#xFA;ste pou&#x17E;i&#x165; &#x10D;erven&#xE9; tla&#x10D;idlo Pin It navrchu hociktor&#xE9;ho pinu."
    },
    "sv": {
      "noPinDomain": "Tyv&#xE4;rr g&#xE5;r det inte att pinna fr&#xE5;n den h&#xE4;r dom&#xE4;nen. Kontakta webbplatsoperat&#xF6;ren om du har fr&#xE5;gor.",
      "noPinMeta": "Det g&#xE5;r inte att pinna fr&#xE5;n den h&#xE4;r sidan. Kontakta webbplatsoperat&#xF6;ren om du har fr&#xE5;gor.",
      "noPinnablesFound": "Det gick inte att hitta n&#xE5;got p&#xE5; den h&#xE4;r sidan som g&#xE5;r att pinna.",
      "noPinningFromPinterest": "Hoppsan! Den knappen fungerar inte p&#xE5; Pinterest. F&#xF6;rs&#xF6;k anv&#xE4;nda den r&#xF6;da Pin It-knappen &#xF6;verst p&#xE5; varje pin."
    },
    "th": {
      "noPinDomain": "&#xE02;&#xE2D;&#xE2D;&#xE20;&#xE31;&#xE22; &#xE42;&#xE14;&#xE40;&#xE21;&#xE19;&#xE19;&#xE35;&#xE49;&#xE44;&#xE21;&#xE48;&#xE2D;&#xE19;&#xE38;&#xE0D;&#xE32;&#xE15;&#xE43;&#xE2B;&#xE49;&#xE1B;&#xE31;&#xE01;&#xE1E;&#xE34;&#xE19; &#xE01;&#xE23;&#xE38;&#xE13;&#xE32;&#xE15;&#xE34;&#xE14;&#xE15;&#xE48;&#xE2D;&#xE1C;&#xE39;&#xE49;&#xE14;&#xE39;&#xE41;&#xE25;&#xE40;&#xE27;&#xE47;&#xE1A;&#xE44;&#xE0B;&#xE15;&#xE4C;&#xE2B;&#xE32;&#xE01;&#xE21;&#xE35;&#xE02;&#xE49;&#xE2D;&#xE2A;&#xE07;&#xE2A;&#xE31;&#xE22;",
      "noPinMeta": "&#xE02;&#xE2D;&#xE2D;&#xE20;&#xE31;&#xE22; &#xE40;&#xE1E;&#xE08;&#xE19;&#xE35;&#xE49;&#xE44;&#xE21;&#xE48;&#xE2D;&#xE19;&#xE38;&#xE0D;&#xE32;&#xE15;&#xE43;&#xE2B;&#xE49;&#xE1B;&#xE31;&#xE01;&#xE1E;&#xE34;&#xE19; &#xE01;&#xE23;&#xE38;&#xE13;&#xE32;&#xE15;&#xE34;&#xE14;&#xE15;&#xE48;&#xE2D;&#xE1C;&#xE39;&#xE49;&#xE14;&#xE39;&#xE41;&#xE25;&#xE40;&#xE27;&#xE47;&#xE1A;&#xE44;&#xE0B;&#xE15;&#xE4C;&#xE2B;&#xE32;&#xE01;&#xE21;&#xE35;&#xE02;&#xE49;&#xE2D;&#xE2A;&#xE07;&#xE2A;&#xE31;&#xE22;",
      "noPinnablesFound": "&#xE02;&#xE2D;&#xE2D;&#xE20;&#xE31;&#xE22; &#xE44;&#xE21;&#xE48;&#xE1E;&#xE1A;&#xE2D;&#xE30;&#xE44;&#xE23;&#xE17;&#xE35;&#xE48;&#xE1B;&#xE31;&#xE01;&#xE1E;&#xE34;&#xE19;&#xE44;&#xE14;&#xE49;&#xE43;&#xE19;&#xE40;&#xE1E;&#xE08;&#xE19;&#xE35;&#xE49;",
      "noPinningFromPinterest": "&#xE42;&#xE2D;&#xE4A;&#xE30;! &#xE1B;&#xE38;&#xE48;&#xE21;&#xE19;&#xE31;&#xE49;&#xE19;&#xE43;&#xE0A;&#xE49;&#xE44;&#xE21;&#xE48;&#xE44;&#xE14;&#xE49;&#xE01;&#xE31;&#xE1A; Pinterest &#xE25;&#xE2D;&#xE07;&#xE43;&#xE0A;&#xE49;&#xE1B;&#xE38;&#xE48;&#xE21; Pin It &#xE2A;&#xE35;&#xE41;&#xE14;&#xE07;&#xE14;&#xE49;&#xE32;&#xE19;&#xE1A;&#xE19;&#xE02;&#xE2D;&#xE07;&#xE1E;&#xE34;&#xE19;&#xE2A;&#xE34;"
    },
    "tl": {
      "noPinDomain": "Sorry, hindi allowed ang pinning sa domain na 'to. Paki-contact ang site operator kung may tanong ka.",
      "noPinMeta": "Sorry, hindi allowed ang pinning mula sa page na 'to. Paki-contact ang site operator kung may tanong ka.",
      "noPinnablesFound": "Sorry, walang makitang puwedeng i-pin sa page na 'to.",
      "noPinningFromPinterest": "Ay, teka! Hindi gumagana ang button na 'yan sa Pinterest. Subukan ang pulang Pin It button sa itaas ng anumang Pin."
    },
    "tr": {
      "noPinDomain": "&#xDC;zg&#xFC;n&#xFC;z, bu alan ad&#x131;ndan pinlemeye izin verilmiyor. Sorular&#x131;n&#x131;z varsa, l&#xFC;tfen site operat&#xF6;r&#xFC;ne ba&#x15F;vurun.",
      "noPinMeta": "&#xDC;zg&#xFC;n&#xFC;z, bu sayfadan pinlemeye izin verilmiyor. Sorular&#x131;n&#x131;z varsa, l&#xFC;tfen site operat&#xF6;r&#xFC;ne ba&#x15F;vurun.",
      "noPinnablesFound": "&#xDC;zg&#xFC;n&#xFC;z, bu sayfada pinlenebilecek bir &#x15F;ey bulunamad&#x131;.",
      "noPinningFromPinterest": "Dikkat! Bu d&#xFC;&#x11F;me Pinterest'te &#xE7;al&#x131;&#x15F;maz. Herhangi bir Pinin &#xFC;st taraf&#x131;ndaki k&#x131;rm&#x131;z&#x131; Pin It d&#xFC;&#x11F;mesini kullanmay&#x131; deneyin."
    },
    "uk": {
      "noPinDomain": "&#x41D;&#x430; &#x436;&#x430;&#x43B;&#x44C;, &#x43F;&#x440;&#x438;&#x43A;&#x43E;&#x43B;&#x44E;&#x432;&#x430;&#x442;&#x438; &#x43F;&#x456;&#x43D;&#x438; &#x437; &#x446;&#x44C;&#x43E;&#x433;&#x43E; &#x434;&#x43E;&#x43C;&#x435;&#x43D;&#x443; &#x43D;&#x435; &#x43C;&#x43E;&#x436;&#x43D;&#x430;. &#x42F;&#x43A;&#x449;&#x43E; &#x443; &#x432;&#x430;&#x441; &#x432;&#x438;&#x43D;&#x438;&#x43A;&#x43B;&#x438; &#x437;&#x430;&#x43F;&#x438;&#x442;&#x430;&#x43D;&#x43D;&#x44F;, &#x437;&#x432;'&#x44F;&#x436;&#x456;&#x442;&#x44C;&#x441;&#x44F; &#x437; &#x43E;&#x43F;&#x435;&#x440;&#x430;&#x442;&#x43E;&#x440;&#x43E;&#x43C; &#x432;&#x435;&#x431;-&#x441;&#x430;&#x439;&#x442;&#x443;.",
      "noPinMeta": "&#x41D;&#x430; &#x436;&#x430;&#x43B;&#x44C;, &#x43F;&#x440;&#x438;&#x43A;&#x43E;&#x43B;&#x44E;&#x432;&#x430;&#x442;&#x438; &#x43F;&#x456;&#x43D;&#x438; &#x437; &#x446;&#x456;&#x454;&#x457; &#x441;&#x442;&#x43E;&#x440;&#x456;&#x43D;&#x43A;&#x438; &#x43D;&#x435; &#x43C;&#x43E;&#x436;&#x43D;&#x430;. &#x42F;&#x43A;&#x449;&#x43E; &#x443; &#x432;&#x430;&#x441; &#x432;&#x438;&#x43D;&#x438;&#x43A;&#x43B;&#x438; &#x437;&#x430;&#x43F;&#x438;&#x442;&#x430;&#x43D;&#x43D;&#x44F;, &#x437;&#x432;'&#x44F;&#x436;&#x456;&#x442;&#x44C;&#x441;&#x44F; &#x437; &#x43E;&#x43F;&#x435;&#x440;&#x430;&#x442;&#x43E;&#x440;&#x43E;&#x43C; &#x432;&#x435;&#x431;-&#x441;&#x430;&#x439;&#x442;&#x443;.",
      "noPinnablesFound": "&#x41D;&#x430; &#x436;&#x430;&#x43B;&#x44C;, &#x43C;&#x438; &#x43D;&#x435; &#x437;&#x43C;&#x43E;&#x433;&#x43B;&#x438; &#x437;&#x43D;&#x430;&#x439;&#x442;&#x438; &#x43D;&#x430; &#x446;&#x456;&#x439; &#x441;&#x442;&#x43E;&#x440;&#x456;&#x43D;&#x446;&#x456; &#x437;&#x43E;&#x431;&#x440;&#x430;&#x436;&#x435;&#x43D;&#x44C;, &#x44F;&#x43A;&#x456; &#x43C;&#x43E;&#x436;&#x43D;&#x430; &#x431;&#x443;&#x43B;&#x43E; &#x431; &#x43F;&#x440;&#x438;&#x43A;&#x43E;&#x43B;&#x43E;&#x442;&#x438;.",
      "noPinningFromPinterest": "&#x41E;&#x439;! &#x426;&#x44F; &#x43A;&#x43D;&#x43E;&#x43F;&#x43A;&#x430; &#x43D;&#x435; &#x43F;&#x440;&#x430;&#x446;&#x44E;&#x454; &#x443; Pinterest. &#x421;&#x43F;&#x440;&#x43E;&#x431;&#x443;&#x439;&#x442;&#x435; &#x441;&#x43A;&#x43E;&#x440;&#x438;&#x441;&#x442;&#x430;&#x442;&#x438;&#x441;&#x44F; &#x447;&#x435;&#x440;&#x432;&#x43E;&#x43D;&#x43E;&#x44E; &#x43A;&#x43D;&#x43E;&#x43F;&#x43A;&#x43E;&#x44E; &#xAB;Pin It&#xBB;, &#x449;&#x43E; &#x437;&#x43D;&#x430;&#x445;&#x43E;&#x434;&#x438;&#x442;&#x44C;&#x441;&#x44F; &#x443; &#x432;&#x435;&#x440;&#x445;&#x43D;&#x456;&#x439; &#x447;&#x430;&#x441;&#x442;&#x438;&#x43D;&#x456; &#x43A;&#x43E;&#x436;&#x43D;&#x43E;&#x433;&#x43E; &#x43F;&#x456;&#x43D;&#x430;."
    },
    "vi": {
      "noPinDomain": "R&#x1EA5;t ti&#x1EBF;c, kh&#xF4;ng cho ph&#xE9;p ghim t&#x1EEB; mi&#x1EC1;n n&#xE0;y. Vui l&#xF2;ng li&#xEA;n h&#x1EC7; ng&#x1B0;&#x1EDD;i &#x111;i&#x1EC1;u h&#xE0;nh trang web n&#x1EBF;u b&#x1EA1;n c&#xF3; th&#x1EAF;c m&#x1EAF;c.",
      "noPinMeta": "R&#x1EA5;t ti&#x1EBF;c, kh&#xF4;ng cho ph&#xE9;p ghim t&#x1EEB; trang n&#xE0;y. Vui l&#xF2;ng li&#xEA;n h&#x1EC7; ng&#x1B0;&#x1EDD;i &#x111;i&#x1EC1;u h&#xE0;nh trang web n&#x1EBF;u b&#x1EA1;n c&#xF3; th&#x1EAF;c m&#x1EAF;c.",
      "noPinnablesFound": "R&#x1EA5;t ti&#x1EBF;c, kh&#xF4;ng th&#x1EC3; t&#xEC;m th&#x1EA5;y th&#x1EE9; g&#xEC; ghim &#x111;&#x1B0;&#x1EE3;c tr&#xEA;n trang n&#xE0;y.",
      "noPinningFromPinterest": "R&#x1EA5;t ti&#x1EBF;c! N&#xFA;t &#x111;&#xF3; kh&#xF4;ng ho&#x1EA1;t &#x111;&#x1ED9;ng tr&#xEA;n Pinterest. H&#xE3;y th&#x1EED; s&#x1EED; d&#x1EE5;ng n&#xFA;t Pin It m&#xE0;u &#x111;&#x1ECF; &#x1EDF; ph&#xED;a tr&#xEA;n b&#x1EA5;t k&#x1EF3; Ghim n&#xE0;o."
    }
  },
  'hashList': [
    /efa3a2deb839/,
    /20c46b653b00/,
    /9e2089d8b8f2/,
    /820a6e7baa0f/,
    /293aa4f9b3d0/,
    /1529ad2b2cc8/,
    /8de5d416e5d2/,
    /8c2d5961f7af/,
    /540b2374abf1/,
    /415215dcadbf/,
    /dbafdf055617/,
    /871de03c9980/,
    /85ae87da6618/,
    /1d1d5ffa1d50/,
    /1847807c0ea1/,
    /08fb2eb6424d/,
    /a32353817e45/,
    /71c1f4783e6d/,
    /79f57d83d54a/,
    /eefa602a72ed/,
    /32aa39d04eb4/,
    /25f7c9982cea/
  ]
}));
