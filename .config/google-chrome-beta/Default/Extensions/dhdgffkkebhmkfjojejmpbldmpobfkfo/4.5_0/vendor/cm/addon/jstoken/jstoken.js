(function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)})(function(a){a.defineOption("specifyMoreJsTokens",!1,function(e,f,c){c==a.Init&&(c=!1);c&&!f?e.removeOverlay("jstoken"):!c&&f&&e.addOverlay({token:function(b){var a={"js-function-def":/(["']{1,1}[^\r\n\t'"]*["']{1,1}[\s\t\r\n]*:|[$a-zA-Z_0-9]+[\s\t\r\n]*:|[a-zA-Z_0-9]+[\s\t\r\n]*=)?[\s\t\r\n]*function[\s\t\r\n]*([$a-zA-Z_0-9]*)[\s\t\r\n]*\([\s\t\r\n]*([a-zA-Z_0-9,$\s\r\n\t]*)[\s\t\r\n]*\)/g,
"js-var":/var /g,"js-well-known":/window|document|Math|Number|String|Object|Array/g,"global-property":/eval|alert|prompt|confirm/g},d,c=b.string.length,h=Object.keys(a),g=c,e,f;for(d=0;d<h.length&&!(a[h[d]].lastIndex=b.pos,(p=a[h[d]].exec(b.string))&&p.index<g&&(g=p.index,e=d,f=p[0].length,p.index==b.pos));d++);if(g==c)b.skipToEnd();else{if(g==b.pos)return b.pos+=f||1,h[e];b.pos=g}},name:"jstoken"})})});
