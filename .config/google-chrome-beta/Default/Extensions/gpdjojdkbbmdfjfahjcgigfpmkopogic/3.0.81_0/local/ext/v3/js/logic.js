// support inline srcsets for hoverbuttons and right-click-to-pin

const VERSION = 2017091501;

// only signifies if SEARCH_UNAUTH_REQUIRED = true
const SEARCH_UNAUTH_PERCENT = 100;

// set SEARCH_AUTH_REQUIRED to false for open unauthed search
// set SEARCH_AUTH_REQUIRED to true and SEARCH_UNAUTH_PERCENT to 0 to completely hide unauthed search
// set SEARCH_AUTH_REQUIRED to true and SEARCH_UNAUTH_PERCENT to some number less than 100 to limit unauthed search to that segment
const SEARCH_AUTH_REQUIRED = true;

((w, d, a) => {
  var $ = w[a.k] = {
    w,
    d,
    a,
    b: chrome || browser,
    // local global variables
    v: {
      debug: false,
      lang: 'en',
      domain: 'www',
      hazButton: false,
      nopin: false
    },
    // Structure: button and iframe overlays will live here
    s: {},
    f: {
      // console.log to background window
      debug: o => {
        if (o && $.v.debug) {
          console.log(o);
        }
      },
      // get a DOM property or text attribute
      get: o => {
        var v = null;
        if (typeof o.el[o.att] === 'string') {
          v = o.el[o.tt];
        } else {
          v = o.el.getAttribute(o.att);
        }
        return v;
      },
      // set a DOM property or text attribute
      set: o =>  {
        if (typeof o.el[o.att] === 'string') {
          o.el[o.att] = o.string;
        } else {
          o.el.setAttribute(o.att, o.string);
        }
      },
      // remove a DOM element
      kill: o => {
        if (o.el && o.el.parentNode) {
          o.el.parentNode.removeChild(o.el);
        }
      },
      // create a DOM element
      make: o => {
        var el = false, t, a, k;
        for (t in o) {
          el = $.d.createElement(t);
          for (a in o[t]) {
            if (typeof o[t][a] === 'string') {
              $.f.set({el: el, att: a, string: o[t][a]});
            } else {
              if (a === 'style') {
                for (k in o[t][a]) {
                  el.style[k] = o[t][a][k];
                }
              }
            }
          }
          break;
        }
        return el;
      },
      // send a message
      sendMessage: o => {
        $.f.debug('Sending message');
        o.via = $.v.me;
        if (!o.to) {
          o.to = 'background'
        }
        $.f.debug(JSON.stringify(o));
        $.b.runtime.sendMessage(o, ()=>{});
      },
      // send a ping from the background process to log.pinterest.com
      log: o => {
        o.lv = $.a.version;
        o.via = $.d.URL;
        $.f.sendMessage({
          act: 'log',
          data: o
        });
      },
      // make a base-60 number of length n
      random60: n => {
        let i, r;
        r  = '';
        n = n - 0;
        if (!n) {
          n = 12;
        }
        for (i = 0; i < n; i = i + 1) {
          r = r + $.a.digits.substr(Math.floor(Math.random() * 60), 1);
        }
        return r;
      },
      // determine our experimental segment
      getSegment: () => {
        let t = $.v.xuid.split('');
        $.v.segment = ($.a.version + $.a.digits.indexOf(t[0]) + $.a.digits.indexOf(t[1]) + $.a.digits.indexOf(t[2])) % 100;
        $.f.debug('Your segment: ' + $.v.segment);
      },
      // if we're right-clicking on an image, save it to $.v.contextEl
      context: e => {
        let t;
        if (e.button === 2) {
          t = e.target;
          if (t && t.tagName && t.tagName === 'IMG') {
            $.v.contextEl = t;
          }
        }
      },
      // get the position of a DOM element
      getPos: o => {
        var positionTop = 0, positionLeft = 0, positionOffsetTop = 0, positionOffsetLeft = 0;

        positionOffsetTop = $.w.getComputedStyle(o.el, null).getPropertyValue("top").replace(/[A-Za-z]/g, '') - 0;
        positionOffsetLeft = $.w.getComputedStyle(o.el, null).getPropertyValue("left").replace(/[A-Za-z]/g, '') - 0;

        if (o.el.offsetParent) {
          do {
            positionLeft = positionLeft + o.el.offsetLeft;
            positionTop = positionTop + o.el.offsetTop;
          } while (o.el = o.el.offsetParent);

          if (positionOffsetTop < 0) {
            positionTop = positionTop + positionOffsetTop;
          }
          if (positionOffsetLeft < 0) {
            positionLeft = positionLeft + positionOffsetLeft;
          }

          return {top: positionTop, left: positionLeft};
        }
      },
      // return an event's target element
      getEl: e => {
        var r = e.target;
        // text node; return parent
        if (r.targetNodeType === 3) {
          r = r.parentNode;
        }
        return r;
      },
      // get the last source URL from a srcset attribute
      getSrcFromSourceSet: ss => {
        let t, i, p, max, src;
        max = 0;
        src = '';
        // split by comma + space (in case there are unescaped commas in image URLs)
        t = ss.split(', ');
        if (t.length) {
          // check each entry
          for (i = 0; i < t.length; i = i + 1) {
            // clean up whitespace on each pair
            p = t[i].replace(/^\s+|\s+$/g,'').replace(/\s\s+/g, ' ').split(' ');
            // if we have a width, compare to the best you've found so far
            if (p[1]) {
              p[1] = p[1].replace(/[^0-9.]/g, '') - 0;
              if (max < p[1]) {
                max = p[1];
                src = p[0];
              }
            } else {
              // no width; go with it
              src = p[0];
            }
          }
        }
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
        return src;
      },
      // get image data for save/search
      getImageData: img => {
        let i, r, dataPinId, src, srcFromInlineSourceSet, srcFromSourceSetElement, lastSrcFromSourceSetElement;
        r = {};
        src = img.src;
        // deal with srcrset if present
        if (img.srcset) {
          srcFromInlineSourceSet = $.f.getSrcFromSourceSet(img.srcset);
          if (srcFromInlineSourceSet) {
            src = srcFromInlineSourceSet;
          }
        } else {
          // are we the immediate child of a PICTURE tag with SOURCE children?
          if (img.parentNode.tagName === 'PICTURE') {
            source = img.parentNode.getElementsByTagName('SOURCE');
            // find the last SOURCE tag and use it
            if (source.length) {
              for (i = 0; i < source.length; i = i + 1) {
                if (source[i].srcset) {
                  lastSrcFromSourceSetElement = source[i].srcset;
                }
              }
            }
            // did we find one?
            if (lastSrcFromSourceSetElement) {
              // make sure there are not multiple sources or other foolishniess inside
              srcFromSourceSetElement = $.f.getSrcFromSourceSet(lastSrcFromSourceSetElement);
              if (srcFromSourceSetElement) {
                // go with it
                src = srcFromSourceSetElement;
              }
            }
          }
        }
        dataPinId = $.f.get({el: img, att: 'data-pin-id'});
        r.media = $.f.get({el: img, att: 'data-pin-media'}) || src;
        r.description = $.f.get({el: img, att: 'data-pin-description'}) || img.title || img.alt || $.d.title;
        if (dataPinId) {
          r.id = dataPinId;
        } else {
          r.url = $.f.get({el: img, att: 'data-pin-url'}) || $.d.URL;
        }
        return r;
      },
      // open the pin create form
      pop: o => {
        let query, data, logMe, dualScreenLeft, dualScreenTop, height, width, left, top;

        dualScreenLeft = $.w.screenLeft != undefined ? $.w.screenLeft : screen.left;
        dualScreenTop = $.w.screenTop != undefined ? $.w.screenTop : screen.top;

        width = $.w.outerWidth ? $.w.outerWidth : $.w.defaultStatus.documentElement.clientWidth ? $.w.defaultStatus.documentElement.clientWidth : screen.width;
        height = $.w.outerHeight ? $.w.outerHeight : $.w.defaultStatus.documentElement.clientHeight ? $.w.defaultStatus.documentElement.clientHeight : screen.height;
        left = ((width - $.a.pop.width) / 2) + dualScreenLeft;
        top = ((height - $.a.pop.height) / 2) + dualScreenTop;

        if (!o.method) {
          // default to hoverbutton method
          o.method = 'h';
        }
        data = $.f.getImageData(o.img);
        data.method = o.method;
        // what to log
        logMe = {'event': 'click', 'xm': data.method};
        if (data.id) {
          // repin
          query = $.v.rePinCreate.replace(/%s/, data.id);
          // log the pin ID
          logMe.repin = data.id;
        } else {
          query = $.v.pinCreate + '?url=' + encodeURIComponent(data.url) + '&media=' + encodeURIComponent(data.media) + '&xm=' + data.method + '&xv=' + $.v.xv + '&xuid=' + $.v.xuid + '&description=' + encodeURIComponent(data.description);
        }
        // open pop-up window
        $.w.open(query, 'pin' + new Date().getTime(), 'status=no,resizable=yes,scrollbars=yes,personalbar=no,directories=no,location=no,toolbar=no,menubar=no,height=' + $.a.pop.height + ',width=' + $.a.pop.width + ',left=' + left + ',top=' + top);
        // log it
        $.f.log(logMe);
      },
      // context click will pin this image
      checkImage: o => {
        let r, f, i;
        // an array of functions to be run in order
        f = [
          // be sure we have an image
          () => {
            if (!o.img) { return true; }
          },
          // be sure our image has a source
          () => {
            let ss;
            if (!o.img.src) {
              // we might have a srcset
              if (!o.img.srcset) {
                return true;
              } else {
                ss = $.f.getSrcFromSourceSet(o.img.srcset);
                if (!ss) {
                  return true;
                } else {
                  o.img.src = ss;
                }
              }
            }
          },
          // be sure our source comes from a server so we can verify
          () => {
            if (!o.img.src.match(/^http/) && !o.img.src.match(/^data/)) { return true; }
          },
          // be sure height AND width are greater than 90px
          () => {
            if (o.img.naturalHeight < 90 || o.img.naturalWidth < 90) { return true; }
          },
          // if we're at least 90x90, check that height OR width > 119
          () => {
            if (o.img.naturalHeight > 119 || o.img.naturalWidth > 119) { return false; } else { return true; }
          },
          // some images are resized using img.height and img.width; don't hover over these if they are too small
          () => {
            if (o.img.height < 90 || o.img.height < 90) { return true; }
          },
          // if we're at least 90x90, check that height OR width > 119
          () => {
            if (o.img.height > 119 || o.img.height > 119) { return false; } else { return true; }
          },
          // don't offer to pin images that are more than 3x wider than they are tall
          () => {
            if (o.img.naturalHeight < o.img.naturalWidth / 3) { return true; }
          },
          // don't pin if our image has nopin or data-pin-nopin
          () => {
            if (o.img.getAttribute('nopin') || o.img.getAttribute('data-pin-nopin')) { return true; }
          }
        ];

        // assume the image is good
        r = false;

        // if r turns true at any point, quit checking
        for (i = 0; i < f.length; i = i + 1) {
          r = f[i](o);
          if (r) {
            break;
          }
        }

        return r;
      },
      // warn that you can't pin
      warn: o => {
        // don't pop alerts from iframes
        if ($.w.self === $.w.top) {
          if (!o.msg) {
            o.msg = $.b.i18n.getMessage("errorPin");
          }
          $.w.alert(o.msg);
        }
      },
      // open an iframe overlay
      openOverlay: o => {
        // don't open overlays in iframes; be sure there's an ID; be sure the overlay with that ID isn't already showing
        if ($.w.self === $.w.top && o.id && !$.s[o.id]) {
          // save scroll position
          $.v.pageX = $.w.pageXOffset;
          $.v.pageY = $.w.pageYOffset;
          var path = '/ext/v3/html/' + o.id + '.html';
          if ($.v.local === true) {
            path = '/local' + path;
          } else {
            path = '/remote' + path;
          }
          $.s[o.id] = $.f.make({'IFRAME':{
            'src': $.b.extension.getURL(path),
            'style': $.a.overlay.style
          }});
          $.s[o.id].onload = () => {
            // optional background thing to do after loading
            if (o.act) {
              $.f.sendMessage({'to': 'background', 'act': o.act});
            }
            // populate the overlay with whatever we're showing
            if (o.data) {
              $.f.sendMessage({
                to: 'background',
                act: 'populate' + o.id.charAt(0).toUpperCase() + o.id.slice(1),
                data: o.data
              });
            }
            // might be able to combine this with o.act
            if (o.callback) {
              o.callback();
            }
            // always steal focus
            $.s[o.id].focus();
            $.f.log({
              event: 'open',
              overlay: o.id
            });
          };
          // show it
          $.d.b.appendChild($.s[o.id]);
        }
      },
      // close an iframe overlay
      closeOverlay: o => {
        if (o.id && $.s[o.id]) {
          $.f.debug('closing ' + o.id);
          $.f.kill({el: $.s[o.id]});
          delete $.s[o.id];
          $.f.log({
            event: 'close',
            overlay: o.id
          });
          $.w.scrollTo($.v.pageX, $.v.pageY);
        }
      },
      // functions that may be called by messages from the background process
      act: {
        // ask for fresh context menus
        refreshContext: () => {
          // start with the nosearch flag
          let hideSearch = $.v.nosearch;
          // should we hide search because we're not logged in?
          if (!$.v.hazLogin && $.v.searchAuthRequired) {
            hideSearch = true;
          }
          $.f.sendMessage({
            to: 'background',
            act: 'refreshContextMenus',
            data: {
              nopin: $.v.nopin,
              nosearch: hideSearch
            }
          });
        },
        // background process says we've right-clicked and chosen Save
        contextSave: () => {
          let data;
          if ($.v.contextEl) {
            if ($.v.nopin || $.f.checkImage({img: $.v.contextEl})) {
              $.f.warn({});
            } else {
              if ($.v.hazLogin) {
                data = $.f.getImageData($.v.hoverImage);
                data.method = 'r';
                $.f.act.openCreate({data: data});
              } else {
                $.f.pop({img: $.v.hoverImage, method: 'r'});
              }
            }
          } else {
            $.f.debug('No context element');
          }
        },
        // background has sent us the hash of a string
        pongHash: o => {
          let i;
          for (i = 0; i < $.v.hashList.theOtherList.length; i = i + 1) {
            if (o.data.digest.match($.v.hashList.theOtherList[i])) {
              $.f.debug('Hash match; pin and hover disabled');
              $.v.nopin = true;
              $.v.nosearch = true;
              $.v.nohover = true;
              break;
            }
          }
          for (i = 0; i < $.v.hashList.theList.length; i = i + 1) {
            if (o.data.digest.match($.v.hashList.theList[i])) {
              $.f.debug('Hash match; hover disabled');
              $.v.nohover = true;
              break;
            }
          }
          if (!$.v.nopin && $.v.nohover) {
            $.f.debug('No hash match; pin and hover should be fine');
          }
          // re-flag the browser button
          $.f.act.refreshContext();
        },
        // open the search form
        openSearch: o => {
          if (o.data) {
            $.f.openOverlay({id: 'search', data: o.data});
          }
        },
        // close the search form
        closeSearch: () => {
          $.f.closeOverlay({id: 'search'});
        },
        // open the pin create form
        openCreate: o => {
          if (o.data) {
            $.f.openOverlay({id: 'create', act: 'getBoards', data: o.data});
          }
        },
        // close the pin create form
        closeCreate: () => {
          $.f.closeOverlay({id: 'create'});
        },
        // open the thumbnail grid
        openGrid: o => {
          if ($.v.nopin) {
            $.f.log({
              event: 'click',
              action: 'open_grid',
              error: 'nopin_domain'
            });
            $.f.warn({msg: $.v.customNoPinDomain || $.a.warn[$.v.lang].noPinDomain});
          } else {
            $.f.openOverlay({id: 'grid', callback: () => {
              if ($.v.pinmarklet) {
                try {
                  eval($.v.pinmarklet);
                } catch (err) {
                  $.f.debug(err);
                }
              }
            }});
          }
        },
        // close the thumbnail grid
        closeGrid: () => {
          $.f.closeOverlay({id: 'grid'});
        },
        pongLogin: o => {
          $.f.debug('Login check has returned!');
          $.f.debug(o);
          $.v.hazLogin = o.data.hazLogin;
        }
      },
      // hide hoverbuttons
      hide: () => {
        // this timeout is global, so we can cancel it when we're over the image and we move over the button
        $.v.hazFade = $.w.setTimeout(() => {
          $.s.buttonSave.style.display = 'none';
          $.s.buttonSearch.style.display = 'none';
          $.v.hazButton = false;
        }, 10);
      },
      // mouse over
      over: e => {
        var p, m, el = $.f.getEl(e);
        if (el && el.tagName) {
          if (el === $.s.buttonSave || el === $.s.buttonSearch) {
            // we've just moved from inside an image to the visible button
            // stop hiding the button and exit
            $.w.clearTimeout($.v.hazFade);
          } else {
            if (el.tagName === 'IMG') {
              if (!$.v.nopin) {
                if (!$.f.checkImage({img: el})) {
                  $.v.hoverImage = el;
                  p = $.f.getPos({el: el});
                  if (!$.v.nohover) {
                    $.s.buttonSave.style.top = p.top + $.a.save.offset.top + 'px';
                    $.s.buttonSave.style.left = p.left + $.a.save.offset.left + 'px';
                    $.s.buttonSave.style.display = 'block';
                  }
                  // only show Search button if we're logged in
                  if (!$.v.nosearch && !$.v.nohover) {
                    if ($.v.hazLogin || !$.v.searchAuthRequired) {
                      $.s.buttonSearch.style.display = 'block';
                      $.s.buttonSearch.style.top = (p.top + $.a.save.offset.top - 2) + 'px';
                      $.s.buttonSearch.style.left = (p.left + el.width - 32) + 'px';
                    }
                  }
                  $.v.hazButton = true;
                }
              }
            }
          }
        }
      },
      // mouse out
      out: (e) => {
        var el = $.f.getEl(e);
        if (el !== $.s.buttonSave && el !== $.s.buttonSearch) {
          if ($.v.hazButton) {
            $.f.hide();
          }
        }
      },
      // click
      click: (e) => {
        let el, data;
        el = $.f.getEl(e);
        if (el === $.s.buttonSave) {
          if ($.v.hoverImage) {
            data = $.f.getImageData($.v.hoverImage);
            if ($.v.hazLogin) {
              data.method = 'h';
              $.f.act.openCreate({data: data});
            } else {
              $.f.pop({img: $.v.hoverImage, method: 'h'});
            }
          }
        }
        if (el === $.s.buttonSearch) {
          if ($.v.hoverImage) {
            data = $.f.getImageData($.v.hoverImage);
            $.f.act.openSearch({data: {method: 'h' , searchMe: data.media}});
          }
        }
      },
      // given window.navigator.language, set the right strings in $.v.lang and $.v.domain
      langLocLookup: () => {
        // defaults are already set to en / www
        if ($.w.navigator.language) {
          var str, t, i, lang, locale, hazAltDomain, q;
          str = $.w.navigator.language;
          $.f.debug('Looking up language and domain for ' + str);
          // clean and split
          t = str.toLowerCase();
          t = t.replace(/[^a-z0-9]/g, ' ');
          t = t.replace(/^\s+|\s+$/g, '')
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
            if ($.a.save.string[lang]) {
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
        }
        $.f.debug('Language: ' + $.v.lang + ' Domain: ' + $.v.domain);
      },
      // check page for reasons we might not want to pin or show hoverbuttons
      check: () => {
        let i, f;
        f = [
          // init $.v.nopin and $.v.nohover
          () => {
            for (let i = 0; i < $.a.seek.length; i = i + 1) {
              $.v[$.a.seek[i]] = false;
            }
            // do we have hoverbuttons hidden in preferences?
            if ($.v.hideHoverButtons) {
              $.v.nohover = true;
            }
          },
          // no pinning from Pinterest
          () => {
            let pinterestMatch = /^https?:\/\/(([a-z]{1,3})\.)?pinterest\.([a-z]{0,2}\.)?([a-z]{1,3})\//;

            /*
              ^ = only look at the beginning of the string
              https? = http or https
              \/\/ = escaped //
              (([a-z]{1,3})\.)? = one to three characters of lowercase letters followed by a dot, OR nothing
              pinterest\. = pinterest followed by an escaped dot
              ([a-z]{0,2}\.)? = zero to two lowercase letters followed by a dot, OR nothing (the co. in co.uk)
              ([a-z]{2,3}) = two or three lower-case characters (br, de, com)
              \/ = trailing forward-slash after top-level domain (so we don't get caught by pinterest.completelybogus.org)
            */

            // important: test document.URL, not document.domain, which won't have the http/https protocol
            if ($.d.URL.match(pinterestMatch)) {
              $.f.debug('Nopin: Pinterest app');
              $.v.nopin = true;
            }
          },
          // check our onboard nopin / nohover lists
          () => {
            var i, n;
            for (i = 0, n = $.a.noPinList.length; i < n; i = i + 1) {
              if ($.d.domain.match($.a.noPinList[i])) {
                $.f.debug('Nopin: ' + $.d.domain + ' matches ' + $.a.noPinList[i]);
                $.v.nopin = true;
                break;
              }
            }
            for (i = 0, n = $.a.noHoverList.length; i < n; i = i + 1) {
              // we're using $.d.URL because it includes the protocol
              if ($.d.URL.match($.a.noHoverList[i])) {
                $.f.debug('Nohover: ' + $.d.domain + ' matches ' + $.a.noHoverList[i]);
                $.v.nohover = true;
              }
            }
          },
          // check for nopin, hover, and nosearch metas
          () => {
            var meta, name, content, description, property, i, j;
            meta = $.d.getElementsByTagName('META');
            for (i = 0; i < meta.length; i = i + 1) {
              name = meta[i].getAttribute('name');
              content = meta[i].getAttribute('content');
              description = meta[i].getAttribute('description');
              if (name && content && name.toLowerCase() === 'pinterest') {
                content = content.toLowerCase();
                for (j = 0; j < $.a.seek.length; j = j + 1) {
                  if (content === $.a.seek[j]) {
                    $.f.debug('Meta ' + $.a.seek[j] + ' found!');
                    $.v[$.a.seek[j]] = true;
                    if (content === 'nopin' && description) {
                      $.v.customNoPinDomain = description;
                    }
                  }
                }
              }
            }
          },
          // don't overwrite hoverbuttons made by pinit.js, which may be customized
          () => {
            if ($.d.b && $.d.b.getAttribute('data-pin-hover')) {
              $.f.debug('data-pin-hover found!');
              $.v.nohover = true;
            }
          },
          // send our domain variations to background for hashing
          () => {
            var i, t, p, k;
            k = [];
            p = $.d.domain.split('.');
            // start with the tld
            t = p.pop();
            for (i = 0; i < p.length + 1; i = i + 1) {
              // add the next path level
              t = p.pop() + '.' + t;
              // save it
              k.push(t);
            }
            // hash all the variations
            for (i = 0; i < k.length; i = i + 1) {
              $.f.sendMessage({act: 'hash', str: k[i] }, ()=>{});
            }
          }
        ];
        for (let i = 0; i < f.length; i = i + 1) {
          f[i]();
        }
      },
      init: () => {
        // shall we hide search from users who are not signed in to Pinterest?
        $.v.searchAuthRequired = $.a.searchAuthRequired;
        if ($.v.searchAuthRequired) {
          // give me a number from 0 to 99, based on $.a.version + $.v.xuid
          $.f.getSegment();
          if ($.v.segment < $.a.searchUnauthPercent) {
            $.v.searchAuthRequired = false;
          }
        }
        $.d.b = $.d.getElementsByTagName('BODY')[0];
        // get the right strings and domain
        $.f.langLocLookup();
        // identity changes with each page load so we avoid weird conditions such as delayed messages from background
        $.v.me = $.f.random60();
        // pin and repin create pop-ups may have different domains
        $.v.pinCreate = $.a.endpoint.pinCreate.replace(/www/, $.v.domain);
        $.v.rePinCreate = $.a.endpoint.rePinCreate.replace(/www/, $.v.domain);
        // check for logins
        $.f.sendMessage({'to': 'background', 'act': 'login'});
        $.d.addEventListener('mousedown', $.f.context);
        // check for nopin / nohover metas;
        if ($.d.domain) {
          // go look for reasons why we might not want to show hoverbuttons or allow pinning
          $.f.check();
        }
        // make Save button
        $.s.buttonSave = $.f.make({'SPAN': {
          'style': $.a.save.style,
          'innerHTML': $.a.save.string[$.v.lang]
        }});
        $.d.b.appendChild($.s.buttonSave);
        // make Search button
        $.s.buttonSearch = $.f.make({'SPAN':{'style': $.a.search.style}});
        $.d.b.appendChild($.s.buttonSearch);

        // if we click, check if we need to pin
        $.d.b.addEventListener('click', $.f.click);
        // if we mouse over an element, check if we need to show hoverbuttons
        $.d.b.addEventListener('mouseover', $.f.over);
        // if we mouse out of an element, check if we need to hide hoverbuttons
        $.d.b.addEventListener('mouseout', $.f.out);
        // if the tab changes, hide hoverbuttons
        $.w.addEventListener('blur', $.f.hide);
        // if an incoming message from script is for us and triggers a function in $.f.act, run it
        $.b.runtime.onMessage.addListener(r => {
          if (r.to && (r.to === $.v.me || r.to === 'content')) {
            if (r.act && typeof $.f.act[r.act] === 'function') {
              $.f.act[r.act](r);
            }
          }
        });
      }
    }
  };
  // get everything in local storage and then init
  $.b.storage.local.get(null, r => {
    for (let i in r) {
      $.v[i] = r[i];
    }
    $.f.init();
  });
})(window, document, {
  k: 'LOGIC',
  version: VERSION,
  searchAuthRequired: SEARCH_AUTH_REQUIRED,
  searchUnauthPercent: SEARCH_UNAUTH_PERCENT,
  digits: '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghijkmnopqrstuvwxyz',
  'endpoint': {
    'pinCreate': 'https://www.pinterest.com/pin/create/extension/',
    'rePinCreate': 'https://www.pinterest.com/pin/%s/repin/x/'
  },
  overlay: {
    style: {
      'border': 'none',
      'display': 'block',
      'position': 'fixed',
      'height': '100%',
      'width': '100%',
      'top': '0',
      'right': '0',
      'bottom': '0',
      'left': '0',
      'margin': '0',
      'clip': 'auto',
      'zIndex': '9223372036854775807'
    }
  },
  // TO DO: get new strings that don't use "pin" as a verb
  warn: {
    'en': {
      noPinDomain: "Sorry, pinning is not allowed from this domain. Please contact the site operator if you have any questions."
    },
    'cs': {
      noPinDomain: "Je n&#xE1;m l&#xED;to. Z t&#xE9;to dom&#xE9;ny nen&#xED; mo&#x17E;n&#xE9; p&#x159;id&#xE1;vat piny. S dotazy se obracejte na provozovatele webu."
    },
    'da': {
      noPinDomain: "Det er ikke muligt at tilf&#xF8;je pins fra dom&#xE6;net. Kontakt websitets ejer, hvis du har sp&#xF8;rgsm&#xE5;l."
    },
    'de': {
      noPinDomain: "Es tut uns leid, aber von dieser Domain kann nichts gepinnt werden. Bitte kontaktiere den Website-Betreiber, falls du weitere Fragen hast."
    },
    'es': {
      noPinDomain: "Lo sentimos, no est&#xE1; permitido pinear desde este dominio. Ponte en contacto con el operador del sitio si tienes alguna pregunta."
    },
    'es-mx': {
      noPinDomain: "Lamentablemente, no est&#xE1; permitido pinear desde este dominio. Si quieres hacer consultas, comun&#xED;cate con el operador del sitio."
    },
    'el': {
      noPinDomain: "&#x39B;&#x3C5;&#x3C0;&#x3AC;&#x3BC;&#x3B1;&#x3B9;, &#x3B4;&#x3B5;&#x3BD; &#x3B5;&#x3C0;&#x3B9;&#x3C4;&#x3C1;&#x3AD;&#x3C0;&#x3B5;&#x3C4;&#x3B1;&#x3B9; &#x3C4;&#x3BF; &#x3BA;&#x3B1;&#x3C1;&#x3C6;&#x3AF;&#x3C4;&#x3C3;&#x3C9;&#x3BC;&#x3B1; &#x3B1;&#x3C0;&#x3CC; &#x3B1;&#x3C5;&#x3C4;&#x3CC;&#x3BD; &#x3C4;&#x3BF;&#x3BD; &#x3C4;&#x3BF;&#x3BC;&#x3AD;&#x3B1;. &#x395;&#x3C0;&#x3B9;&#x3BA;&#x3BF;&#x3B9;&#x3BD;&#x3C9;&#x3BD;&#x3AE;&#x3C3;&#x3C4;&#x3B5; &#x3BC;&#x3B5; &#x3C4;&#x3BF; &#x3B4;&#x3B9;&#x3B1;&#x3C7;&#x3B5;&#x3B9;&#x3C1;&#x3B9;&#x3C3;&#x3C4;&#x3AE; &#x3C4;&#x3B7;&#x3C2; &#x3B9;&#x3C3;&#x3C4;&#x3BF;&#x3C3;&#x3B5;&#x3BB;&#x3AF;&#x3B4;&#x3B1;&#x3C2; &#x3B1;&#x3BD; &#x3AD;&#x3C7;&#x3B5;&#x3C4;&#x3B5; &#x3B1;&#x3C0;&#x3BF;&#x3C1;&#x3AF;&#x3B5;&#x3C2;."
    },
    'fi': {
      noPinDomain: "Et voi tehd&#xE4; Pin-lis&#xE4;yksi&#xE4; t&#xE4;st&#xE4; verkkotunnuksesta. Jos sinulla on kysytt&#xE4;v&#xE4;&#xE4;, ota yhteytt&#xE4; sivuston yll&#xE4;pit&#xE4;j&#xE4;&#xE4;n."
    },
    'fr': {
      noPinDomain: "D&#xE9;sol&#xE9;, mais vous ne pouvez pas &#xE9;pingler les contenus de ce domaine. Pour toute question, veuillez contacter l'administrateur du site."
    },
    'id': {
      noPinDomain: "Maaf, Anda tidak diizinkan mengepin dari domain ini. Hubungi operator situs jika Anda memiliki pertanyaan."
    },
    'it': {
      noPinDomain: "Ci dispiace, ma l'aggiunta di Pin non &#xE8; consentita da questo dominio. Se hai domande, contatta il gestore del sito."
    },
    'hi': {
      noPinDomain: "&#x915;&#x94D;&#x937;&#x92E;&#x93E; &#x915;&#x930;&#x947;&#x902;, &#x907;&#x938; &#x921;&#x94B;&#x92E;&#x947;&#x928; &#x938;&#x947; &#x92A;&#x93F;&#x928; &#x932;&#x917;&#x93E;&#x928;&#x947; &#x915;&#x940; &#x905;&#x928;&#x941;&#x92E;&#x924;&#x93F; &#x928;&#x939;&#x940;&#x902; &#x939;&#x948;&#x964; &#x905;&#x917;&#x930; &#x906;&#x92A;&#x915;&#x93E; &#x915;&#x94B;&#x908; &#x92A;&#x94D;&#x930;&#x936;&#x94D;&#x928; &#x939;&#x948;&#x902;, &#x924;&#x94B; &#x915;&#x943;&#x92A;&#x92F;&#x93E; &#x938;&#x93E;&#x907;&#x91F; &#x911;&#x92A;&#x930;&#x947;&#x91F;&#x930; &#x938;&#x947; &#x938;&#x902;&#x92A;&#x930;&#x94D;&#x915; &#x915;&#x930;&#x947;&#x902;&#x964;"
    },
    'hu': {
      noPinDomain: "Sajn&#xE1;ljuk, ebb&#x151;l a tartom&#xE1;nyb&#xF3;l nem lehet pinelni. K&#xE9;rj&#xFC;k, k&#xE9;rd&#xE9;seiddel fordulj az oldal &#xFC;zemeltet&#x151;j&#xE9;hez."
    },
    'ja': {
      noPinDomain: "&#x3057;&#x8A33;&#x3042;&#x308A;&#x307E;&#x305B;&#x3093;&#x3002;HTML &#x4EE5;&#x5916;&#x306E;&#x30DA;&#x30FC;&#x30B8;&#x3067;&#x30D4;&#x30F3;&#x3059;&#x308B;&#x3053;&#x3068;&#x306F;&#x3067;&#x304D;&#x307E;&#x305B;&#x3093;&#x3002;&#x753B;&#x50CF;&#x3092;&#x30A2;&#x30C3;&#x30D7;&#x30ED;&#x30FC;&#x30C9;&#x3057;&#x3088;&#x3046;&#x3068;&#x8A66;&#x307F;&#x3066;&#x3044;&#x308B;&#x5834;&#x5408;&#x306F;&#x3001;pinterest.com &#x306B;&#x30A2;&#x30AF;&#x30BB;&#x30B9;&#x3057;&#x3066;&#x304F;&#x3060;&#x3055;&#x3044;&#x3002;"
    },
    'ko': {
      noPinDomain: "&#xC8C4;&#xC1A1;&#xD569;&#xB2C8;&#xB2E4;. &#xC774; &#xB3C4;&#xBA54;&#xC778;&#xC5D0;&#xC11C;&#xB294; &#xD540;&#xD558;&#xAE30;&#xAC00; &#xD5C8;&#xC6A9;&#xB418;&#xC9C0; &#xC54A;&#xC2B5;&#xB2C8;&#xB2E4;. &#xC9C8;&#xBB38;&#xC774; &#xC788;&#xC73C;&#xC2DC;&#xBA74; &#xC0AC;&#xC774;&#xD2B8; &#xC6B4;&#xC601;&#xC790;&#xC5D0;&#xAC8C; &#xBB38;&#xC758;&#xD558;&#xC2DC;&#xAE30; &#xBC14;&#xB78D;&#xB2C8;&#xB2E4;."
    },
    'ms': {
      noPinDomain: "Maaf, mengepin tidak dibenarkan dari domain ini. Sila hubungi pengendali laman jika anda ada sebarang solan."
    },
    'nb': {
      noPinDomain: "Beklager, pinning er ikke tillatt fra dette domenet. Ta kontakt med webmasteren hvis du har sp&#xF8;rsm&#xE5;l."
    },
    'nl': {
      noPinDomain: "Sorry, het is niet toegestaan om vanaf dit domein te pinnen. Neem contact op met de beheerder van deze website als je vragen hebt."
    },
    'pl': {
      noPinDomain: "Niestety przypinanie z tej domeny jest niedozwolone. Skontaktuj si&#x119; z operatorem witryny, je&#x15B;li masz pytania."
    },
    'pt': {
      noPinDomain: "Lamentamos, mas n&#xE3;o &#xE9; permitido afixar pins a partir deste dom&#xED;nio. Em caso de d&#xFA;vidas, contacta o operador do site."
    },
    'pt-br': {
      noPinDomain: "N&#xE3;o &#xE9; poss&#xED;vel pinar a partir deste dom&#xED;nio. Entre em contato com o operador do site se tiver d&#xFA;vidas."
    },
    'ro': {
      noPinDomain: "Ne pare r&#x103;u, nu se pot ad&#x103;uga Pinuri de pe acest site. Te rug&#x103;m s&#x103;-l contactezi pe operatorul site-ului dac&#x103; ai &#xEE;ntreb&#x103;ri."
    },
    'ru': {
      noPinDomain: "&#x41A; &#x441;&#x43E;&#x436;&#x430;&#x43B;&#x435;&#x43D;&#x438;&#x44E;, &#x43F;&#x440;&#x438;&#x43A;&#x430;&#x43B;&#x44B;&#x432;&#x430;&#x43D;&#x438;&#x435; &#x41F;&#x438;&#x43D;&#x43E;&#x432; &#x432; &#x434;&#x430;&#x43D;&#x43D;&#x43E;&#x43C; &#x434;&#x43E;&#x43C;&#x435;&#x43D;&#x435; &#x43D;&#x435;&#x432;&#x43E;&#x437;&#x43C;&#x43E;&#x436;&#x43D;&#x43E;. &#x421;&#x43E; &#x432;&#x441;&#x435;&#x43C;&#x438; &#x432;&#x43E;&#x43F;&#x440;&#x43E;&#x441;&#x430;&#x43C;&#x438; &#x43E;&#x431;&#x440;&#x430;&#x449;&#x430;&#x439;&#x442;&#x435;&#x441;&#x44C; &#x43A; &#x430;&#x434;&#x43C;&#x438;&#x43D;&#x438;&#x441;&#x442;&#x440;&#x430;&#x442;&#x43E;&#x440;&#x443; &#x432;&#x435;&#x431;-&#x441;&#x430;&#x439;&#x442;&#x430;."
    },
    'sk': {
      noPinDomain: "Prep&#xE1;&#x10D;te, z tejto dom&#xE9;ny si nem&#xF4;&#x17E;ete prip&#xED;na&#x165; piny. Kontaktujte prev&#xE1;dzkovate&#x13E;a str&#xE1;nky, ak m&#xE1;te nejak&#xE9; ot&#xE1;zky."
    },
    'sv': {
      noPinDomain: "Tyv&#xE4;rr g&#xE5;r det inte att pinna fr&#xE5;n den h&#xE4;r dom&#xE4;nen. Kontakta webbplatsoperat&#xF6;ren om du har fr&#xE5;gor."
    },
    'th': {
      noPinDomain: "&#xE02;&#xE2D;&#xE2D;&#xE20;&#xE31;&#xE22; &#xE42;&#xE14;&#xE40;&#xE21;&#xE19;&#xE19;&#xE35;&#xE49;&#xE44;&#xE21;&#xE48;&#xE2D;&#xE19;&#xE38;&#xE0D;&#xE32;&#xE15;&#xE43;&#xE2B;&#xE49;&#xE1B;&#xE31;&#xE01;&#xE1E;&#xE34;&#xE19; &#xE01;&#xE23;&#xE38;&#xE13;&#xE32;&#xE15;&#xE34;&#xE14;&#xE15;&#xE48;&#xE2D;&#xE1C;&#xE39;&#xE49;&#xE14;&#xE39;&#xE41;&#xE25;&#xE40;&#xE27;&#xE47;&#xE1A;&#xE44;&#xE0B;&#xE15;&#xE4C;&#xE2B;&#xE32;&#xE01;&#xE21;&#xE35;&#xE02;&#xE49;&#xE2D;&#xE2A;&#xE07;&#xE2A;&#xE31;&#xE22;"
    },
    'tl': {
      noPinDomain: "Sorry, hindi allowed ang pinning sa domain na 'to. Paki-contact ang site operator kung may tanong ka."
    },
    'tr': {
      noPinDomain: "&#xDC;zg&#xFC;n&#xFC;z, bu alan ad&#x131;ndan pinlemeye izin verilmiyor. Sorular&#x131;n&#x131;z varsa, l&#xFC;tfen site operat&#xF6;r&#xFC;ne ba&#x15F;vurun."
    },
    'uk': {
      noPinDomain: "&#x41D;&#x430; &#x436;&#x430;&#x43B;&#x44C;, &#x43F;&#x440;&#x438;&#x43A;&#x43E;&#x43B;&#x44E;&#x432;&#x430;&#x442;&#x438; &#x43F;&#x456;&#x43D;&#x438; &#x437; &#x446;&#x44C;&#x43E;&#x433;&#x43E; &#x434;&#x43E;&#x43C;&#x435;&#x43D;&#x443; &#x43D;&#x435; &#x43C;&#x43E;&#x436;&#x43D;&#x430;. &#x42F;&#x43A;&#x449;&#x43E; &#x443; &#x432;&#x430;&#x441; &#x432;&#x438;&#x43D;&#x438;&#x43A;&#x43B;&#x438; &#x437;&#x430;&#x43F;&#x438;&#x442;&#x430;&#x43D;&#x43D;&#x44F;, &#x437;&#x432;'&#x44F;&#x436;&#x456;&#x442;&#x44C;&#x441;&#x44F; &#x437; &#x43E;&#x43F;&#x435;&#x440;&#x430;&#x442;&#x43E;&#x440;&#x43E;&#x43C; &#x432;&#x435;&#x431;-&#x441;&#x430;&#x439;&#x442;&#x443;."
    },
    'vi': {
      noPinDomain: "R&#x1EA5;t ti&#x1EBF;c, kh&#xF4;ng cho ph&#xE9;p ghim t&#x1EEB; mi&#x1EC1;n n&#xE0;y. Vui l&#xF2;ng li&#xEA;n h&#x1EC7; ng&#x1B0;&#x1EDD;i &#x111;i&#x1EC1;u h&#xE0;nh trang web n&#x1EBF;u b&#x1EA1;n c&#xF3; th&#x1EAF;c m&#x1EAF;c."
    }
  },
  search: {
    style: {
      'width': '24px',
      'height': '24px',
      'background': 'rgba(0,0,0,.4) url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pjxzdmcgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxtYXNrIGlkPSJtIj48cmVjdCBmaWxsPSIjZmZmIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI2IiByeT0iNiIvPjxyZWN0IGZpbGw9IiMwMDAiIHg9IjUiIHk9IjUiIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgcng9IjEiIHJ5PSIxIi8+PHJlY3QgZmlsbD0iIzAwMCIgeD0iMTAiIHk9IjAiIHdpZHRoPSI0IiBoZWlnaHQ9IjI0Ii8+PHJlY3QgZmlsbD0iIzAwMCIgeD0iMCIgeT0iMTAiIHdpZHRoPSIyNCIgaGVpZ2h0PSI0Ii8+PC9tYXNrPjwvZGVmcz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNmZmYiIG1hc2s9InVybCgjbSkiLz48L3N2Zz4=) 50% 50% no-repeat',
      'background-size': '14px 14px',
      'position': 'absolute',
      'opacity': '1',
      'zIndex': '8675309',
      'display': 'none',
      'cursor': 'pointer',
      'border': 'none',
      'border-radius': '12px'
    }
  },
  save: {
    domain: {
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
    lookup: {
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
    },
    string: {
      // Czech
      'cs': 'Ulo&#382;it',
      // Danish
      'da': 'Gem',
      // German
      'de': 'Merken',
      // Greek
      'el': '&Kappa;&rho;&#940;&tau;&alpha; &tau;&omicron;',
      // English
      'en': 'Save',
      // Spanish
      'es': 'Guardar',
      // Finnish
      'fi': 'Tallenna',
      // French
      'fr': 'Enregistrer',
      // Hindi
      'hi': '&#2360;&#2375;&#2357; &#2325;&#2352;&#2375;&#2306;',
      // Hungarian
      'hu': 'Ment&eacute;s',
      // Indonesian
      'id': 'Simpan',
      // Italian
      'it': 'Salva',
      // Japanese
      'ja': '&#20445;&#23384;',
      // Korean
      'ko': '&#51200;&#51109;',
      // Malaysian
      'ms': 'Simpan',
      // Norwegian
      'nb': 'Lagre',
      // Dutch
      'nl': 'Bewaren',
      // Polish
      'pl': 'Zapisz',
      // Portuguese
      'pt': 'Guardar',
      // Portuguese (Brazil)
      'pt-br': 'Salvar',
      // Romanian
      'ro': 'Salveaz&#259;',
      // Russian
      'ru': '&#1057;&#1086;&#1093;&#1088;&#1072;&#1085;&#1080;&#1090;&#1100;',
      // Slovak
      'sk': 'Ulo&#382;i&#357;',
      // Swedish
      'sv': 'Spara',
      // Tagalog (Philippines)
      'tl': 'I-save',
      // Thai
      'th': '&#3610;&#3633;&#3609;&#3607;&#3638;&#3585;',
      // Turkish
      'tr': 'Kaydet',
      // Ukrainian
      'uk': '&#1047;&#1073;&#1077;&#1088;&#1077;&#1075;&#1090;&#1080;',
      // Vietnamese
      'vi': 'L&#432;u'
    },
    style: {
      // base rules for all Save buttons
      'border-radius': '3px',
      'text-indent': '20px',
      'width': 'auto',
      'padding': '0 4px 0 0',
      'text-align': 'center',
      'font': '11px/20px "Helvetica Neue", Helvetica, sans-serif',
      'font-weight': 'bold',
      'color': '#fff',
      'background': '#bd081c url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMzBweCIgd2lkdGg9IjMwcHgiIHZpZXdCb3g9Ii0xIC0xIDMxIDMxIj48Zz48cGF0aCBkPSJNMjkuNDQ5LDE0LjY2MiBDMjkuNDQ5LDIyLjcyMiAyMi44NjgsMjkuMjU2IDE0Ljc1LDI5LjI1NiBDNi42MzIsMjkuMjU2IDAuMDUxLDIyLjcyMiAwLjA1MSwxNC42NjIgQzAuMDUxLDYuNjAxIDYuNjMyLDAuMDY3IDE0Ljc1LDAuMDY3IEMyMi44NjgsMC4wNjcgMjkuNDQ5LDYuNjAxIDI5LjQ0OSwxNC42NjIiIGZpbGw9IiNmZmYiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+PHBhdGggZD0iTTE0LjczMywxLjY4NiBDNy41MTYsMS42ODYgMS42NjUsNy40OTUgMS42NjUsMTQuNjYyIEMxLjY2NSwyMC4xNTkgNS4xMDksMjQuODU0IDkuOTcsMjYuNzQ0IEM5Ljg1NiwyNS43MTggOS43NTMsMjQuMTQzIDEwLjAxNiwyMy4wMjIgQzEwLjI1MywyMi4wMSAxMS41NDgsMTYuNTcyIDExLjU0OCwxNi41NzIgQzExLjU0OCwxNi41NzIgMTEuMTU3LDE1Ljc5NSAxMS4xNTcsMTQuNjQ2IEMxMS4xNTcsMTIuODQyIDEyLjIxMSwxMS40OTUgMTMuNTIyLDExLjQ5NSBDMTQuNjM3LDExLjQ5NSAxNS4xNzUsMTIuMzI2IDE1LjE3NSwxMy4zMjMgQzE1LjE3NSwxNC40MzYgMTQuNDYyLDE2LjEgMTQuMDkzLDE3LjY0MyBDMTMuNzg1LDE4LjkzNSAxNC43NDUsMTkuOTg4IDE2LjAyOCwxOS45ODggQzE4LjM1MSwxOS45ODggMjAuMTM2LDE3LjU1NiAyMC4xMzYsMTQuMDQ2IEMyMC4xMzYsMTAuOTM5IDE3Ljg4OCw4Ljc2NyAxNC42NzgsOC43NjcgQzEwLjk1OSw4Ljc2NyA4Ljc3NywxMS41MzYgOC43NzcsMTQuMzk4IEM4Ljc3NywxNS41MTMgOS4yMSwxNi43MDkgOS43NDksMTcuMzU5IEM5Ljg1NiwxNy40ODggOS44NzIsMTcuNiA5Ljg0LDE3LjczMSBDOS43NDEsMTguMTQxIDkuNTIsMTkuMDIzIDkuNDc3LDE5LjIwMyBDOS40MiwxOS40NCA5LjI4OCwxOS40OTEgOS4wNCwxOS4zNzYgQzcuNDA4LDE4LjYyMiA2LjM4NywxNi4yNTIgNi4zODcsMTQuMzQ5IEM2LjM4NywxMC4yNTYgOS4zODMsNi40OTcgMTUuMDIyLDYuNDk3IEMxOS41NTUsNi40OTcgMjMuMDc4LDkuNzA1IDIzLjA3OCwxMy45OTEgQzIzLjA3OCwxOC40NjMgMjAuMjM5LDIyLjA2MiAxNi4yOTcsMjIuMDYyIEMxNC45NzMsMjIuMDYyIDEzLjcyOCwyMS4zNzkgMTMuMzAyLDIwLjU3MiBDMTMuMzAyLDIwLjU3MiAxMi42NDcsMjMuMDUgMTIuNDg4LDIzLjY1NyBDMTIuMTkzLDI0Ljc4NCAxMS4zOTYsMjYuMTk2IDEwLjg2MywyNy4wNTggQzEyLjA4NiwyNy40MzQgMTMuMzg2LDI3LjYzNyAxNC43MzMsMjcuNjM3IEMyMS45NSwyNy42MzcgMjcuODAxLDIxLjgyOCAyNy44MDEsMTQuNjYyIEMyNy44MDEsNy40OTUgMjEuOTUsMS42ODYgMTQuNzMzLDEuNjg2IiBmaWxsPSIjYmQwODFjIj48L3BhdGg+PC9nPjwvc3ZnPg==) 3px 50% no-repeat',
      'background-size': '14px 14px',
      // extra rules for extensions only
      'position': 'absolute',
      'opacity': '1',
      'zIndex': '8675309',
      'display': 'none',
      'cursor': 'pointer',
      'border': 'none',
      'font-weight': 'bold',
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale'
    },
    offset: {
      top: 10,
      left: 10
    }
  },
  pop: {
    height: 650,
    width: 800
  },
  // metas to observe
  seek: ['nopin', 'nohover', 'nosearch'],
  // don't pin on domains matching these
  noPinList: [
    /^(.*?\.|)craigslist\.org/,
    /^(.*?\.|)chase\.com/,
    /^(.*?\.|)facebook\.com/,
    /^(.*?\.|)mail\.aol\.com/,
    /^(.*?\.|)atmail\.com/,
    /^(.*?\.|)contactoffice\.com/,
    /^(.*?\.|)fastmail\.fm/,
    /^(.*?\.|)webmail\.gandi\.net/,
    /^(.*?\.|)accounts\.google\.com/,
    /^(.*?\.|)mail\.google\.com/,
    /^(.*?\.|)docs\.google\.com/,
    /^(.*?\.|)gmx\.com/,
    /^(.*?\.|)hushmail\.com/,
    /^(.*?\.|)laposte\.fr/,
    /^(.*?\.|)mail\.lycos\.com/,
    /^(.*?\.|)mail\.com/,
    /^(.*?\.|)mail\.ru/,
    /^(.*?\.|)opolis\.eu/,
    /^(.*?\.|)outlook\.com/,
    /^(.*?\.|)nokiamail\.com/,
    /^(.*?\.|)apps\.rackspace\.com/,
    /^(.*?\.|)rediffmail\.com/,
    /^(.*?\.|)runbox\.com/,
    /^(.*?\.|)mail\.sify\.com/,
    /^(.*?\.|)webmail\.thexyz\.com/,
    /^(.*?\.|)mail\.yahoo\.com/,
    /^(.*?\.|)mail\.yandex\.com/
  ],
  // don't hover on domains matching these
  noHoverList: [
    /^https?:\/\/ramandel\.com\//,
    /^https?:\/\/www\.google\.com\/$/,
    /^https?:\/\/www\.google\.com\/_/
  ]
});
