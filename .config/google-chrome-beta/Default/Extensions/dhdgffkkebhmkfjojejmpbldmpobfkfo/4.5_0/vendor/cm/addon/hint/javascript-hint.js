(function(k){"object"==typeof exports&&"object"==typeof module?k(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],k):k(CodeMirror)})(function(k){function m(b,a){for(var c=0,f=b.length;c<f;++c)a(b[c])}function q(b,a,c,f){var d=b.getCursor(),e=c(b,d);if(!/\b(?:string|comment)\b/.test(e.type)){e.state=k.innerMode(b.getMode(),e.state).state;/^[\w$_]*$/.test(e.string)?e.end>d.ch&&(e.end=d.ch,e.string=e.string.slice(0,d.ch-e.start)):e={start:d.ch,end:d.ch,
string:"",state:e.state,type:"."==e.string?"property":null};for(var g=e;"property"==g.type;){g=c(b,n(d.line,g.start));if("."!=g.string)return;g=c(b,n(d.line,g.start));if(!p)var p=[];p.push(g)}return{list:r(e,p,a,f),from:n(d.line,e.start),to:n(d.line,e.end)}}}function t(b,a){var c=b.getTokenAt(a);a.ch==c.start+1&&"."==c.string.charAt(0)?(c.end=c.start,c.string=".",c.type="property"):/^\.[\w$_]*$/.test(c.string)&&(c.type="property",c.start++,c.string=c.string.replace(/\./,""));return c}function r(b,
a,c,f){function d(b){var a;if(a=0==b.lastIndexOf(k,0)){a:if(Array.prototype.indexOf)a=-1!=g.indexOf(b);else{for(a=g.length;a--;)if(g[a]===b){a=!0;break a}a=!1}a=!a}a&&g.push(b)}function e(a){"string"==typeof a?m(u,d):a instanceof Array?m(v,d):a instanceof Function&&m(w,d);if(Object.getOwnPropertyNames&&Object.getPrototypeOf)for(;a;a=Object.getPrototypeOf(a))Object.getOwnPropertyNames(a).forEach(d);else for(var b in a)d(b)}var g=[],k=b.string,l=f&&f.globalScope||window;if(a&&a.length){b=a.pop();var h;
b.type&&0===b.type.indexOf("variable")?(f&&f.additionalContext&&(h=f.additionalContext[b.string]),f&&!1===f.useGlobalScope||(h=h||l[b.string])):"string"==b.type?h="":"atom"==b.type?h=1:"function"==b.type&&(null==l.jQuery||"$"!=b.string&&"jQuery"!=b.string||"function"!=typeof l.jQuery?null!=l._&&"_"==b.string&&"function"==typeof l._&&(h=l._()):h=l.jQuery());for(;null!=h&&a.length;)h=h[a.pop().string];null!=h&&e(h)}else{for(a=b.state.localVars;a;a=a.next)d(a.name);for(a=b.state.globalVars;a;a=a.next)d(a.name);
f&&!1===f.useGlobalScope||e(l);m(c,d)}return g}var n=k.Pos;k.registerHelper("hint","javascript",function(b,a){var c=x;a.keywords&&(c=c.concat(a.keywords));return q(b,c,function(a,b){return a.getTokenAt(b)},a)});k.registerHelper("hint","coffeescript",function(b,a){return q(b,y,t,a)});var u="charAt charCodeAt indexOf lastIndexOf substring substr slice trim trimLeft trimRight toUpperCase toLowerCase split concat match replace search".split(" "),v="length concat join splice push pop shift unshift slice reverse sort indexOf lastIndexOf every some filter forEach map reduce reduceRight ".split(" "),
w=["prototype","apply","call","bind"],x="break case catch continue debugger default delete do else false finally for function if in instanceof new null return switch throw true try typeof var void while with".split(" "),y="and break catch class continue delete do else extends false finally for if in instanceof isnt new no not null of off on or return switch then throw true try typeof until void while with yes".split(" ")});
