!function(){"use strict";function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function e(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}function r(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function n(t,e,n){return e&&r(t.prototype,e),n&&r(t,n),t}function i(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e}function o(t,e){return(t.constructor.displayName||t.constructor.name)+"."+e}function s(t,e){Object.defineProperty(t,"name",{value:e,writable:!1}),t.displayName=e}function a(t){return new Proxy(t,Tt)}function l(t,e,r,n){if(void 0===n&&(n=[]),t===e)return e;if(r||!t||"object"!=typeof t||!e||"object"!=typeof e||t instanceof Error||e instanceof Error||t.constructor!==e.constructor||Pt.has(t))return t;Pt.set(t,!0);var i=zt.get(t.constructor);if(!i)return t;if(-1!==n.indexOf(t))return t;n.push(t);var o=i(t,e,n);return n.pop(),o}function u(t){t.check()}function c(t){t.obsolete()}function d(t){t.dislead(this)}function h(t){this.status===Ct&&t.actualize()}function p(t,e,r){try{switch(r.length){case 0:return t[e]();case 1:return t[e](r[0]);case 2:return t[e](r[0],r[1]);case 3:return t[e](r[0],r[1],r[2]);case 4:return t[e](r[0],r[1],r[2],r[3]);case 5:return t[e](r[0],r[1],r[2],r[3],r[4]);default:return t[e].apply(t,r)}}catch(t){if(!(t instanceof St))throw t}}function f(t,e,r,n){var i=e+"$";if(void 0===r.value)throw new TypeError(o(t,e)+" is not an function (next?: V)");t[i]=r.value;var a=!1,l=o(t,e);return{enumerable:r.enumerable,configurable:r.configurable,get:function(){var t=this;if(a)return this[i].bind(this);var r=n?function(){for(var e=arguments.length,r=new Array(e),n=0;n<e;n++)r[n]=arguments[n];return Nt(function(){return p(t,i,r)})}:function(){for(var e=arguments.length,r=new Array(e),n=0;n<e;n++)r[n]=arguments[n];return p(t,i,r)};return s(r,l),a=!0,Object.defineProperty(this,e,{configurable:!0,enumerable:!1,value:r}),a=!1,r}}}function v(t,e,r){return f(t,e,r,!0)}function _(t,e,r){r.delete(t),t.slaves||t.destructor()}function m(t,e,r){t[e+"$"]=r.value;var n=new WeakMap;return Object.defineProperty(t,e+"()",{get:function(){return n.get(this)}}),{enumerable:r.enumerable,configurable:r.configurable,value:function(t){var r=n.get(this);return void 0===r&&(r=new At(e,this,Mt,n,!1,void 0,void 0,!0),n.set(this,r)),t&&(r.status=wt),r.value()}}}function y(t,e){return function(r){return void 0===r?t.call(this):(e.call(this,r),r)}}function g(t){return function(e){return void 0===e&&t?t.call(this):e}}function b(t,e,r,n){function i(t){var r=l.get(this);return void 0===r&&(r=new At(e,this,Mt,l,n),l.set(this,r)),It===xt?r:r.value(t,It)}var a=e+"$";if(void 0!==t[a])return r;var l=new WeakMap;if(Object.defineProperty(t,e+"()",{get:function(){return l.get(this)}}),void 0!==r.value)return t[a]=r.value,r.value=i,r;var u=o(t,e);return r.initializer&&s(r.initializer,u),r.get&&s(r.get,"get#"+u),r.set&&s(r.set,"set#"+u),t[a]=void 0===r.get&&void 0===r.set?g(r.initializer):y(r.get,r.set),{enumerable:r.enumerable,configurable:r.configurable,get:i,set:i}}function w(t,e,r){return b(t,e,r,!0)}function C(t){for(var e=Object.keys(t).sort(),r="",n=0;n<e.length;n++){var i=e[n],o=t[i];r+="."+i+":"+("object"==typeof o?JSON.stringify(o):o)}return r}function k(t){return t?t instanceof Array?JSON.stringify(t):"object"==typeof t?C(t):""+t:""}function x(t,e,r,n){var i=o(t,e),s=r.value;if(void 0===s)throw new TypeError(i+" is not an function (rawKey: K, next?: V)");t[e+"$"]=s;var a=new WeakMap;return Object.defineProperty(t,e+"()",{get:function(){return a.get(this)}}),r.value=function(t,r){var i=a.get(this);void 0===i&&(i=new Map,a.set(this,i));var o=k(t),s=i.get(o);return void 0===s&&(s=new At(e,this,Mt,i,n,t,o),i.set(o,s)),It===xt?s:s.value(r,It)},r}function O(t,e,r){return x(t,e,r,!0)}function S(t){return It=kt,t}function N(t){return It=kt,t.getRetry()}function j(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function T(t,e,r){return e&&j(t.prototype,e),r&&j(t,r),t}function z(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e}function P(t,e,r,n,i){var o={};return Object.keys(n).forEach(function(t){o[t]=n[t]}),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=r.slice().reverse().reduce(function(r,n){return n(t,e,r)||r},o),i&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(i):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(t,e,o),o=null),o}function E(t,e,r,n,i){var o,s,a;void 0===n&&(n=new Ft),void 0===i&&(i=!1);var l=(a=s=function(t){function r(e,r){var i;(i=t.call(this,e,r)||this)._propsChanged=!0,i._el=void 0,i._lastData=null;var o=n;i._keys=void 0;var s=i.constructor,a=s.displayName;return e&&(i._keys=Object.keys(e),0===i._keys.length&&(i._keys=void 0),void 0!==e.__lom_ctx&&(o=e.__lom_ctx),e.id&&(a=e.id)),i._render=s.render,i._injector=o.copy(s.displayName,s.instance,i._render.aliases),i._injector.id=a,s.instance++,i}z(r,t);var i=r.prototype;return i.toString=function(){return this._injector.toString()},i.shouldComponentUpdate=function(t){if(void 0===this._keys)return!1;for(var e=this.props,r=this._keys,n=0,i=r.length;n<i;n++){var o=r[n];if(e[o]!==t[o])return this._propsChanged=!0,!0}return!0===this.constructor.isFullEqual&&(this._keys=Object.keys(t),this._propsChanged=r.length!==this._keys.length,this._propsChanged)},i.componentWillUnmount=function(){this["r()"].destructor(),this._el=void 0,this._keys=void 0,this.props=void 0,this._lastData=null,void 0!==this._render&&(this.constructor.instance--,this._injector.destructor(),this._injector=void 0)},i.r=function(t){var r=null,n=this._render,i=Ft.parentContext,o=Ft.parentContext=this._injector;try{r=o.invokeWithProps(n,this.props,this._propsChanged),this._lastData=r}catch(t){r=o.invokeWithProps(n.onError||e,{error:t,children:this._lastData}),t[Ut]=!0}return o.rendered="",Ft.parentContext=i,this._propsChanged||(this._el=r,this.forceUpdate(),this._el=void 0),this._propsChanged=!1,r},i.render=function(){return void 0===this._el?this.r(this._propsChanged):this._el},T(r,[{key:"displayName",get:function(){return this.toString()}}]),r}(t),s.isFullEqual=i,o=a,P(o.prototype,"r",[r],Object.getOwnPropertyDescriptor(o.prototype,"r"),o.prototype),o);return function(t){var e=function(t,e){l.call(this,t,e)};return e._r=[2],e.instance=0,e.render=t,e.isFullEqual=t.isFullEqual||i,e.displayName=t.displayName||t.name,e.prototype=Object.create(l.prototype),e.prototype.constructor=e,e}}function D(t,e,r){return function(){var n,i=arguments,o=i[1],s=i[0],a="function"==typeof s&&void 0===s.constructor.render,l=o?o._id||o.id:void 0,u=Ft.parentContext;if(!0===r){if(o||(o={}),o.id)u.id&&(o.id=u.id+"."+o.id);else{if(u.rendered)throw new Error(u.rendered+" need id");o.id=u.id,u.rendered=u.displayName+"."+s}o.key||(o.key=o.id)}if(a){if(null===(n=u.alias(s,l)))return null;void 0!==n&&(s=n),o?o.__lom_ctx=u:o={__lom_ctx:u},void 0===s.__lom&&(s.__lom=t(s)),n=s.__lom}else{if(l){if(null===(n=u.alias(s,l)))return null;void 0!==n&&(s=n)}n=s}switch(i.length){case 2:return e(n,o);case 3:return e(n,o,i[2]);case 4:return e(n,o,i[2],i[3]);case 5:return e(n,o,i[2],i[3],i[4]);case 6:return e(n,o,i[2],i[3],i[4],i[5]);case 7:return e(n,o,i[2],i[3],i[4],i[5],i[6]);case 8:return e(n,o,i[2],i[3],i[4],i[5],i[6],i[7]);case 9:return e(n,o,i[2],i[3],i[4],i[5],i[6],i[7],i[8]);default:if(!1===a)return e.apply(null,i);for(var c=[n,o],d=2,h=i.length;d<h;d++)c.push(i[d]);return e.apply(null,c)}}}function A(){}function M(t,e){var r,n,i,o,s=$t;for(o=arguments.length;o-- >2;)Kt.push(arguments[o]);for(e&&null!=e.children&&(Kt.length||Kt.push(e.children),delete e.children);Kt.length;)if((n=Kt.pop())&&void 0!==n.pop)for(o=n.length;o--;)Kt.push(n[o]);else"boolean"==typeof n&&(n=null),(i="function"!=typeof t)&&(null==n?n="":"number"==typeof n?n=String(n):"string"!=typeof n&&(i=!1)),i&&r?s[s.length-1]+=n:s===$t?s=[n]:s.push(n),r=i;var a=new A;return a.nodeName=t,a.children=s,a.attributes=null==e?void 0:e,a.key=null==e?void 0:e.key,void 0!==Bt.vnode&&Bt.vnode(a),a}function I(t,e){for(var r in e)t[r]=e[r];return t}function U(t){!t._dirty&&(t._dirty=!0)&&1==Gt.push(t)&&(Bt.debounceRendering||Jt)(W)}function W(){var t,e=Gt;for(Gt=[];t=e.pop();)t._dirty&&it(t)}function R(t,e,r){return"string"==typeof e||"number"==typeof e?void 0!==t.splitText:"string"==typeof e.nodeName?!t._componentConstructor&&L(t,e.nodeName):r||t._componentConstructor===e.nodeName}function L(t,e){return t.normalizedNodeName===e||t.nodeName.toLowerCase()===e.toLowerCase()}function H(t){var e=I({},t.attributes);e.children=t.children;var r=t.nodeName.defaultProps;if(void 0!==r)for(var n in r)void 0===e[n]&&(e[n]=r[n]);return e}function V(t,e){var r=e?document.createElementNS("http://www.w3.org/2000/svg",t):document.createElement(t);return r.normalizedNodeName=t,r}function F(t){var e=t.parentNode;e&&e.removeChild(t)}function B(t,e,r,n,i){if("className"===e&&(e="class"),"key"===e);else if("ref"===e)r&&r(null),n&&n(t);else if("class"!==e||i)if("style"===e){if(n&&"string"!=typeof n&&"string"!=typeof r||(t.style.cssText=n||""),n&&"object"==typeof n){if("string"!=typeof r)for(var o in r)o in n||(t.style[o]="");for(var o in n)t.style[o]="number"==typeof n[o]&&!1===qt.test(o)?n[o]+"px":n[o]}}else if("dangerouslySetInnerHTML"===e)n&&(t.innerHTML=n.__html||"");else if("o"==e[0]&&"n"==e[1]){var s=e!==(e=e.replace(/Capture$/,""));e=e.toLowerCase().substring(2),n?r||t.addEventListener(e,$,s):t.removeEventListener(e,$,s),(t._listeners||(t._listeners={}))[e]=n}else if("list"!==e&&"type"!==e&&!i&&e in t)K(t,e,null==n?"":n),null!=n&&!1!==n||t.removeAttribute(e);else{var a=i&&e!==(e=e.replace(/^xlink\:?/,""));null==n||!1===n?a?t.removeAttributeNS("http://www.w3.org/1999/xlink",e.toLowerCase()):t.removeAttribute(e):"function"!=typeof n&&(a?t.setAttributeNS("http://www.w3.org/1999/xlink",e.toLowerCase(),n):t.setAttribute(e,n))}else t.className=n||""}function K(t,e,r){try{t[e]=r}catch(t){}}function $(t){return this._listeners[t.type](Bt.event&&Bt.event(t)||t)}function J(){for(var t;t=Qt.pop();)Bt.afterMount&&Bt.afterMount(t),t.componentDidMount&&t.componentDidMount()}function q(t,e,r,n,i,o){Xt++||(Yt=null!=i&&void 0!==i.ownerSVGElement,Zt=null!=t&&!("__preactattr_"in t));var s=G(t,e,r,n,o);return i&&s.parentNode!==i&&i.appendChild(s),--Xt||(Zt=!1,o||J()),s}function G(t,e,r,n,i){var o=t,s=Yt;if(null!=e&&"boolean"!=typeof e||(e=""),"string"==typeof e||"number"==typeof e)return t&&void 0!==t.splitText&&t.parentNode&&(!t._component||i)?t.nodeValue!=e&&(t.nodeValue=e):(o=document.createTextNode(e),t&&(t.parentNode&&t.parentNode.replaceChild(o,t),X(t,!0))),o.__preactattr_=!0,o;var a=e.nodeName;if("function"==typeof a)return ot(t,e,r,n);if(Yt="svg"===a||"foreignObject"!==a&&Yt,a=String(a),(!t||!L(t,a))&&(o=V(a,Yt),t)){for(;t.firstChild;)o.appendChild(t.firstChild);t.parentNode&&t.parentNode.replaceChild(o,t),X(t,!0)}var l=o.firstChild,u=o.__preactattr_,c=e.children;if(null==u){u=o.__preactattr_={};for(var d=o.attributes,h=d.length;h--;)u[d[h].name]=d[h].value}return!Zt&&c&&1===c.length&&"string"==typeof c[0]&&null!=l&&void 0!==l.splitText&&null==l.nextSibling?l.nodeValue!=c[0]&&(l.nodeValue=c[0]):(c&&c.length||null!=l)&&Q(o,c,r,n,Zt||null!=u.dangerouslySetInnerHTML),Z(o,e.attributes,u),Yt=s,o}function Q(t,e,r,n,i){var o,s,a,l,u,c=t.childNodes,d=[],h={},p=0,f=0,v=c.length,_=0,m=e?e.length:0;if(0!==v)for(var y=0;y<v;y++){var g=c[y],b=g.__preactattr_;null!=(w=m&&b?g._component?g._component.__key:b.key:null)?(p++,h[w]=g):(b||(void 0!==g.splitText?!i||g.nodeValue.trim():i))&&(d[_++]=g)}if(0!==m)for(y=0;y<m;y++){u=null;var w;if(null!=(w=(l=e[y]).key))p&&void 0!==h[w]&&(u=h[w],h[w]=void 0,p--);else if(!u&&f<_)for(o=f;o<_;o++)if(void 0!==d[o]&&R(s=d[o],l,i)){u=s,d[o]=void 0,o===_-1&&_--,o===f&&f++;break}u=G(u,l,r,n),a=c[y],u&&u!==t&&u!==a&&(null==a?t.appendChild(u):u===a.nextSibling?F(a):t.insertBefore(u,a))}if(p)for(var y in h)void 0!==h[y]&&X(h[y],!1);for(;f<=_;)void 0!==(u=d[_--])&&X(u,!1)}function X(t,e){var r=t._component;r?st(r):(null!=t.__preactattr_&&t.__preactattr_.ref&&t.__preactattr_.ref(null),!1!==e&&null!=t.__preactattr_||F(t),Y(t))}function Y(t){for(t=t.lastChild;t;){var e=t.previousSibling;X(t,!0),t=e}}function Z(t,e,r){var n;for(n in r)e&&null!=e[n]||null==r[n]||B(t,n,r[n],r[n]=void 0,Yt);for(n in e)"children"===n||"innerHTML"===n||n in r&&e[n]===("value"===n||"checked"===n?t[n]:r[n])||B(t,n,r[n],r[n]=e[n],Yt)}function tt(t){var e=t.constructor.name;(te[e]||(te[e]=[])).push(t)}function et(t,e,r){var n,i=te[t.name];if(t.prototype&&t.prototype.render?(n=new t(e,r),at.call(n,e,r)):((n=new at(e,r)).constructor=t,n.render=rt),i)for(var o=i.length;o--;)if(i[o].constructor===t){n.nextBase=i[o].nextBase,i.splice(o,1);break}return n}function rt(t,e,r){return this.constructor(t,r)}function nt(t,e,r,n,i){t._disable||(t._disable=!0,(t.__ref=e.ref)&&delete e.ref,(t.__key=e.key)&&delete e.key,!t.base||i?t.componentWillMount&&t.componentWillMount():t.componentWillReceiveProps&&t.componentWillReceiveProps(e,n),n&&n!==t.context&&(t.prevContext||(t.prevContext=t.context),t.context=n),t.prevProps||(t.prevProps=t.props),t.props=e,t._disable=!1,0!==r&&(1!==r&&!1===Bt.syncComponentUpdates&&t.base?U(t):it(t,1,i)),t.__ref&&t.__ref(t))}function it(t,e,r,n){if(!t._disable){var i,o,s,a=t.props,l=t.state,u=t.context,c=t.prevProps||a,d=t.prevState||l,h=t.prevContext||u,p=t.base,f=t.nextBase,v=p||f,_=t._component,m=!1;if(p&&(t.props=c,t.state=d,t.context=h,2!==e&&t.shouldComponentUpdate&&!1===t.shouldComponentUpdate(a,l,u)?m=!0:t.componentWillUpdate&&t.componentWillUpdate(a,l,u),t.props=a,t.state=l,t.context=u),t.prevProps=t.prevState=t.prevContext=t.nextBase=null,t._dirty=!1,!m){i=t.render(a,l,u),t.getChildContext&&(u=I(I({},u),t.getChildContext()));var y,g,b=i&&i.nodeName;if("function"==typeof b){var w=H(i);(o=_)&&o.constructor===b&&w.key==o.__key?nt(o,w,1,u,!1):(y=o,t._component=o=et(b,w,u),o.nextBase=o.nextBase||f,o._parentComponent=t,nt(o,w,0,u,!1),it(o,1,r,!0)),g=o.base}else s=v,(y=_)&&(s=t._component=null),(v||1===e)&&(s&&(s._component=null),g=q(s,i,u,r||!p,v&&v.parentNode,!0));if(v&&g!==v&&o!==_){var C=v.parentNode;C&&g!==C&&(C.replaceChild(g,v),y||(v._component=null,X(v,!1)))}if(y&&st(y),t.base=g,g&&!n){for(var k=t,x=t;x=x._parentComponent;)(k=x).base=g;g._component=k,g._componentConstructor=k.constructor}}if(!p||r?Qt.unshift(t):m||(t.componentDidUpdate&&t.componentDidUpdate(c,d,h),Bt.afterUpdate&&Bt.afterUpdate(t)),null!=t._renderCallbacks)for(;t._renderCallbacks.length;)t._renderCallbacks.pop().call(t);Xt||n||J()}}function ot(t,e,r,n){for(var i=t&&t._component,o=i,s=t,a=i&&t._componentConstructor===e.nodeName,l=a,u=H(e);i&&!l&&(i=i._parentComponent);)l=i.constructor===e.nodeName;return i&&l&&(!n||i._component)?(nt(i,u,3,r,n),t=i.base):(o&&!a&&(st(o),t=s=null),i=et(e.nodeName,u,r),t&&!i.nextBase&&(i.nextBase=t,s=null),nt(i,u,1,r,n),t=i.base,s&&t!==s&&(s._component=null,X(s,!1))),t}function st(t){Bt.beforeUnmount&&Bt.beforeUnmount(t);var e=t.base;t._disable=!0,t.componentWillUnmount&&t.componentWillUnmount(),t.base=null;var r=t._component;r?st(r):e&&(e.__preactattr_&&e.__preactattr_.ref&&e.__preactattr_.ref(null),t.nextBase=e,F(e),tt(t),Y(e)),t.__ref&&t.__ref(null)}function at(t,e){this._dirty=!0,this.context=e,this.props=t,this.state=this.state||{}}function lt(t,e,r){return q(r,t,{},!1,e,!1)}function ut(){for(var t="",e=0;e<32;e++){var r=16*Math.random()|0;8!==e&&12!==e&&16!==e&&20!==e||(t+="-"),t+=(12===e?4:16===e?3&r|8:r).toString(16)}return t}function ct(t,e){return 1===t?e:e+"s"}function dt(t){var e=t.error;return lom_h("div",null,e instanceof St?lom_h("div",null,"Loading..."):lom_h("div",null,lom_h("h3",null,"Fatal error !"),lom_h("div",null,e.message),lom_h("pre",null,e.stack.toString())))}function ht(t,e,r,n,i){var o={};return Object.keys(n).forEach(function(t){o[t]=n[t]}),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=r.slice().reverse().reduce(function(r,n){return n(t,e,r)||r},o),i&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(i):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(t,e,o),o=null),o}function pt(t,e,r,n,i){var o={};return Object.keys(n).forEach(function(t){o[t]=n[t]}),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=r.slice().reverse().reduce(function(r,n){return n(t,e,r)||r},o),i&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(i):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(t,e,o),o=null),o}function ft(t){var e=t.todoHeaderService;return lom_h("header",{id:"header"},lom_h("h1",null,"todos"),lom_h("input",{id:"new-todo",placeholder:"What needs to be done?",onInput:e.onInput,value:e.title,onKeyDown:e.onKeyDown,autoFocus:!0}))}function vt(t){var e=t.nowShowing,r=t.count,n=t.completedCount,i=t.onClearCompleted;return lom_h("footer",{id:"footer"},lom_h("span",{id:"todo-count"},lom_h("strong",null,r)," ",ct(r,"item")," left"),lom_h("ul",{id:"filters"},lom_h("li",null,lom_h("a",{href:"./?todo_filter=all",className:{selected:e===ye}},"All"))," ",lom_h("li",null,lom_h("a",{href:"./?todo_filter=active",className:{selected:e===ge}},"Active"))," ",lom_h("li",null,lom_h("a",{href:"./?todo_filter=completed",className:{selected:e===be}},"Completed"))),n>0?lom_h("button",{id:"clear-completed",onClick:i},"Clear completed"):null)}function _t(t,e,r,n){r&&Object.defineProperty(t,e,{enumerable:r.enumerable,configurable:r.configurable,writable:r.writable,value:r.initializer?r.initializer.call(n):void 0})}function mt(t,e,r,n,i){var o={};return Object.keys(n).forEach(function(t){o[t]=n[t]}),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=r.slice().reverse().reduce(function(r,n){return n(t,e,r)||r},o),i&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(i):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(t,e,o),o=null),o}function yt(t){var e=t.todo,r=Se.editingId===e.id;return lom_h("li",{className:(e.completed?"completed ":" ")+(r?"editing":"")},lom_h("div",{className:"view"},lom_h("input",{className:"toggle",type:"checkbox",checked:e.completed||0,onClick:e.toggle}),lom_h("label",{onDblClick:function(){return Se.beginEdit(e)}},e.title),lom_h("button",{className:"destroy",onClick:e.destroy})),r?lom_h("input",{ref:Se.setFocus,className:"edit",value:Se.editingId&&Se.editText||e.title,onBlur:Se.submit,onInput:Se.setEditText,onKeyDown:Se.onKey}):null)}function gt(t){var e=t.todoService,r=t.todoFilterService,n=t.todoHeaderService,i=e.todos;return lom_h("div",null,lom_h(ft,{todoHeaderService:n}),i.length?lom_h("section",{id:"main"},lom_h("input",{id:"toggle-all",type:"checkbox",onChange:e.toggleAll,checked:0===e.activeTodoCount}),lom_h("ul",{id:"todo-list"},r.filteredTodos.map(function(t){return lom_h(yt,{key:t.id,todo:t})}))):null,e.activeTodoCount||e.completedCount?lom_h(vt,{count:e.activeTodoCount,completedCount:e.completedCount,nowShowing:r.filter,onClearCompleted:e.clearCompleted}):null)}var bt="undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{};r._r=[2],n._r=[2],i._r=[2];var wt=1,Ct=2,kt=0,xt=3,Ot=Symbol("lom_cached"),St=function(t){function e(e){var r;return void 0===e&&(e="Wait..."),r=t.call(this,e)||this,r.__proto__=new.target.prototype,r[Ot]=!0,r}return i(e,t),e}(Error);o._r=[2],s._r=[2];var Nt="function"==typeof requestAnimationFrame?function(t){return requestAnimationFrame(t)}:function(t){return setTimeout(t,16)},jt=Symbol("lom_error_orig"),Tt={get:function(t,e){if(e===jt)return t.valueOf();throw t.valueOf()},ownKeys:function(t){throw t.valueOf()}};a._r=[2];var zt=new Map([[Array,function(t,e,r){for(var n=t.length===e.length,i=0;i<t.length;++i){var o=t[i]=l(t[i],e[i],!1,r);n&&o!==e[i]&&(n=!1)}return n?e:t}],[Object,function(t,e,r){var n=0,i=!0;for(var o in t){var s=t[o]=l(t[o],e[o],!1,r);i&&s!==e[o]&&(i=!1),++n}for(var a in e)if(--n<0)break;return i&&0===n?e:t}],[Date,function(t,e){return t.getTime()===e.getTime()?e:t}],[RegExp,function(t,e){return t.toString()===e.toString()?e:t}]]),Pt=new WeakMap;l._r=[2];var Et,Dt;u._r=[2],c._r=[2],d._r=[2],h._r=[2];var At=(Dt=Et=function(){function t(t,e,r,n,i,o,s,a){this._masters=null,this._slaves=null,this._keyHash=s,this.key=o,this.field=t,this.owner=e,this.isComponent=a||!1,this.manualReset=i||!1,this._context=r,this.current=void 0,this._next=void 0,this._suggested=void 0,this._hostAtoms=n,this.status=wt}var e=t.prototype;return e.toString=function(){var t=this.key,e=this.owner,r=e.displayName||e.constructor.displayName||e.constructor.name;return String(r)+"."+this.field+(t?"("+("function"==typeof t?t.displayName||t.name:String(t))+")":"")},e.toJSON=function(){return this.current},e.destructor=function(){0!==this.status&&(this._masters&&this._masters.forEach(d,this),this._masters=null,this._checkSlaves(),this._slaves=null,this._hostAtoms.delete(this._keyHash||this.owner),this._context.destroyHost(this),this.current=void 0,this._next=void 0,this._suggested=void 0,this.status=0,this._hostAtoms=void 0,this.key=void 0,this._keyHash=void 0,this._retry=void 0)},e.value=function(t,e){var r=this._context,n=this.current;if(1===e)void 0===t?(this._suggested=this._next,this._next=void 0,this.status=5,this._slaves&&this._slaves.forEach(c)):this._push(t);else{var i=r.current;if(i&&(!i.isComponent||!this.isComponent)){var o=this._slaves;o||(o=this._slaves=new Set,r.unreap(this)),o.add(i),i.addMaster(this)}var s;void 0!==t&&(s=l(t,this._suggested,this.isComponent))!==this._suggested&&(n instanceof Error||(s=l(t,n,this.isComponent))!==n)&&(this._suggested=this._next=s,this.status=wt),this.actualize()}if((n=this.current)instanceof Error){if(e!==kt)return a(n);throw n}return n},e.actualize=function(){if(3===this.status)throw new Error("Cyclic atom dependency of "+String(this));this.status===Ct&&(this._masters&&this._masters.forEach(h,this),this.status===Ct&&(this.status=4));var e=t.deepReset;5!==this.status||this.isComponent?void 0===e||this.manualReset||e.has(this)?4!==this.status&&this.refresh():(e.add(this),this.refresh()):(t.deepReset=e||new Set,this.refresh(),t.deepReset=e)},e._push=function(t){this.status=4;var e,r=this.current;t instanceof Error?(t[jt]&&(t=t[jt]),e=t):(e=l(t,r,this.isComponent),this._suggested=this._next,this._next=void 0),r!==e&&(this.current=e,this._context.newValue(this,r,e),this._slaves&&this._slaves.forEach(c))},e.refresh=function(){var t=this._masters;t&&(t.forEach(d,this),this._masters=null);var e;this.status=3;var r=this._context,n=r.current;r.current=this;var i=this.field+"$",o=this._next;try{e=void 0===this.key?this.owner[i](o):this.owner[i](this.key,o)}catch(t){void 0===t[Ot]&&(t[Ot]=!0,console.error(t.stack||t)),e=t}r.current=n,5!==this.status&&this._push(e)},e.dislead=function(t){var e=this._slaves;e&&(e.delete(t),0===e.size&&(this._slaves=null,this._context.proposeToReap(this)))},e._checkSlaves=function(){this._slaves?this._slaves.forEach(u):this._context.proposeToPull(this)},e.check=function(){4===this.status&&(this.status=Ct,this._checkSlaves())},e.obsolete=function(){this.status!==wt&&(this.status=wt,this._checkSlaves())},e.addMaster=function(t){this._masters||(this._masters=new Set),this._masters.add(t)},e.getRetry=function(){var t=this;if(void 0===this._retry){var e=function(){return t.refresh()};e._r=[2],s(e,"atom("+this.displayName+").retry()"),this._retry=e}return this._retry},n(t,[{key:"displayName",get:function(){return this.toString()}}]),t}(),Et.deepReset=void 0,Dt);p._r=[2],f._r=[2],v._r=[2],f.defer=v,_._r=[2];var Mt=new(function(){function t(){var t=this;this.current=null,this._logger=void 0,this._updating=[],this._reaping=new Set,this._scheduled=!1,this._namespace="$",this._owners=new WeakMap,this.__run=function(){t._scheduled&&(t._scheduled=!1,t._run())},this._start=0,this._pendCount=0}var e=t.prototype;return e._destroyValue=function(t,e){if(this._owners.get(e)===t){try{e.destructor()}catch(e){console.error(e),this._logger&&this._logger.error(t,e)}this._owners.delete(e)}},e.destroyHost=function(t){this._destroyValue(t,t.current),void 0!==this._logger&&this._logger.onDestruct(t)},e.setLogger=function(t){this._logger=t},e.newValue=function(t,e,r){this._destroyValue(t,e),!r||"object"!=typeof r||r instanceof Error||"function"!=typeof r.destructor||this._owners.set(r,t);var n=this._logger;if(void 0!==n)try{n.newValue(t,e,r)}catch(e){console.error(e),n.error(t,e)}},e.proposeToPull=function(t){this._updating.push(t),this._schedule()},e.proposeToReap=function(t){this._reaping.add(t),this._schedule()},e.unreap=function(t){this._reaping.delete(t)},e._schedule=function(){this._scheduled||(Nt(this.__run),this._scheduled=!0)},e._run=function(){this._schedule();var t=this._reaping,e=this._updating,r=this._start;do{for(var n=e.length,i=r;i<n;i++){this._start=i;var o=e[i];t.has(o)||0===o.status||o.actualize()}r=n}while(e.length>r);for(e.length=0,this._start=0;t.size>0;)t.forEach(_);this._scheduled=!1,this._pendCount=0},e.beginTransaction=function(t){var e=this._namespace;return this._namespace=t,this._pendCount++,e},e.endTransaction=function(t){this._namespace=t,1===this._pendCount?this._run():this._pendCount--},t}());m._r=[2],y._r=[2],g._r=[2];var It=kt;b._r=[2],w._r=[2],C._r=[2],k._r=[2],x._r=[2],O._r=[2],x.manual=O,S._r=[2],N._r=[2],Object.defineProperties(b,{cache:{get:function(){return It=1,S}},getRetry:{get:function(){return It=xt,N}},async:{get:function(){return It=2,S}},manual:{value:w},key:{value:x}}),j._r=[2],T._r=[2],z._r=[2];var Ut=Symbol("rdiRendered"),Wt=Symbol("rdiInst"),Rt=Symbol("rdiProp"),Lt=0,Ht=Symbol("rdiId"),Vt=function(t){t[Ht]=""+ ++Lt,this.dest=t};Vt._r=[2];var Ft=function(){function t(e,r,n,i,o,s){this.id="",this.rendered="",this._resolved=!1,this._listeners=void 0,this._state=n,this.instance=o||0,this.displayName=i||"",void 0===t.parentContext&&(t.parentContext=this);var a=this._cache=s||Object.create(null);if(void 0!==e)for(var l=0;l<e.length;l++){var u=e[l];if(u instanceof Array){var c=u[0];if("string"==typeof c)a[c]=u[1];else{void 0===c[Ht]&&(c[Ht]=""+ ++Lt);var d=u[1];a[c[Ht]]="function"!=typeof d||d instanceof Vt?d:new Vt(d)}}else{var h=u.constructor;void 0===h[Ht]&&(h[Ht]=""+ ++Lt),a[h[Ht]]=u}}}var e=t.prototype;return e.toString=function(){return this.displayName+(this.instance?"["+this.instance+"]":"")},e.toJSON=function(){return this._cache},e.value=function(t){var e=t[Ht];void 0===t[Ht]&&(e=t[Ht]=""+ ++Lt);var r=this._cache[e];if(void 0===r){r=this._cache[e]=this.invoke(t);var n=(t.displayName||t.name)+(this.instance>0?"["+this.instance+"]":"");r.displayName=this.displayName+"."+n,r[Wt]=this;var i=void 0===this._state?void 0:this._state[n];if(i&&"object"==typeof i)for(var o in i)r[o]=i[o]}else r instanceof Vt&&(r=this._cache[e]=this.value(r.dest));return r},e.destructor=function(){this._cache=void 0,this._listeners=void 0},e.invoke=function(t){var e=!1,r=t.deps;void 0!==t._r&&(e=2===t._r[0],r=r||t._r[1]);var n=this.resolve(r);if(e)switch(n.length){case 0:return t();case 1:return t(n[0]);case 2:return t(n[0],n[1]);case 3:return t(n[0],n[1],n[2]);case 4:return t(n[0],n[1],n[2],n[3]);case 5:return t(n[0],n[1],n[2],n[3],n[4]);case 6:return t(n[0],n[1],n[2],n[3],n[4],n[5]);default:return t.apply(void 0,n)}switch(n.length){case 0:return new t;case 1:return new t(n[0]);case 2:return new t(n[0],n[1]);case 3:return new t(n[0],n[1],n[2]);case 4:return new t(n[0],n[1],n[2],n[3]);case 5:return new t(n[0],n[1],n[2],n[3],n[4]);case 6:return new t(n[0],n[1],n[2],n[3],n[4],n[5]);default:return new(Function.prototype.bind.apply(t,[null].concat(n)))}},e.alias=function(t,e){var r=e;void 0===r&&void 0===(r=t[Ht])&&(r=t[Ht]=""+ ++Lt);var n=this._cache[r];return n instanceof Vt?n.dest:void 0===n?t:n},e.invokeWithProps=function(t,e,r){var n=t.deps||(void 0===t._r?void 0:t._r[1]);if(void 0===n)return t(e);var i=this.resolve(n),o=this._listeners;if(!0===r&&void 0!==o)for(var s=0;s<o.length;s++){var a=o[s];a[a.constructor[Rt]]=e}switch(this._resolved=!0,i.length){case 0:return t(e);case 1:return t(e,i[0]);case 2:return t(e,i[0],i[1]);case 3:return t(e,i[0],i[1],i[2]);case 4:return t(e,i[0],i[1],i[2],i[3]);case 5:return t(e,i[0],i[1],i[2],i[3],i[4]);case 6:return t(e,i[0],i[1],i[2],i[3],i[4],i[5]);case 7:return t(e,i[0],i[1],i[2],i[3],i[4],i[5],i[6]);default:return t.apply(void 0,[e].concat(i))}},e.copy=function(e,r,n){return new t(n,null,this._state,e,r,Object.create(this._cache))},e.resolve=function(t){var e=[];if(void 0===t)return e;for(var r=this._listeners,n=this._resolved,i=0,o=t.length;i<o;i++){var s=t[i];if("object"==typeof s){var a={};for(var l in s){var u=s[l],c=this.value(u);!1===n&&void 0!==u[Rt]&&(void 0===r&&(this._listeners=r=[]),r.push(c)),a[l]=c}e.push(a)}else{var d=this.value(s);!1===n&&void 0!==s[Rt]&&(void 0===r&&(this._listeners=r=[]),r.push(d)),e.push(d)}}return e},t}();P._r=[2],E._r=[2],D._r=[2],A._r=[2];var Bt={},Kt=[],$t=[];M._r=[2],I._r=[2];var Jt="function"==typeof Promise?Promise.resolve().then.bind(Promise.resolve()):setTimeout,qt=/acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i,Gt=[];U._r=[2],W._r=[2],R._r=[2],L._r=[2],H._r=[2],V._r=[2],F._r=[2],B._r=[2],K._r=[2],$._r=[2];var Qt=[],Xt=0,Yt=!1,Zt=!1;J._r=[2],q._r=[2],G._r=[2],Q._r=[2],X._r=[2],Y._r=[2],Z._r=[2];var te={};tt._r=[2],et._r=[2],rt._r=[2],nt._r=[2],it._r=[2],ot._r=[2],st._r=[2],at._r=[2],I(at.prototype,{setState:function(t,e){var r=this.state;this.prevState||(this.prevState=I({},r)),I(r,"function"==typeof t?t(r,this.props):t),e&&(this._renderCallbacks=this._renderCallbacks||[]).push(e),U(this)},forceUpdate:function(t){t&&(this._renderCallbacks=this._renderCallbacks||[]).push(t),it(this,2)},render:function(){}}),lt._r=[2];var ee,re;ut._r=[2],ct._r=[2,[Number,String]];var ne=function(){function t(){}return t.prototype.location=function(t,e){throw new Error("implement")},t}(),ie=(ee=b.key,re=function(t){function e(e,r){var n;return n=t.call(this)||this,n._ns="lom_app",n._location=e,n._history=r,n}!function(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e}(e,t);var r=e.prototype;return r._params=function(){return new URLSearchParams(this._location.search)},r.location=function(t,e){var r=this._params();return void 0===e?r.get(t):(r.set(t,e),this._history.pushState(null,this._ns,"?"+r.toString()),e)},e}(ne),function(t,e,r,n,i){var o={};Object.keys(n).forEach(function(t){o[t]=n[t]}),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=r.slice().reverse().reduce(function(r,n){return n(t,e,r)||r},o),i&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(i):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(t,e,o),o=null)}(re.prototype,"location",[ee],Object.getOwnPropertyDescriptor(re.prototype,"location"),re.prototype),re);ie._r=[0,[Location,History]],dt._r=[1];var oe=D(E(at,dt,m),M);bt.lom_h=oe;var se,ae=function(){function t(t,e){var r=this;void 0===t&&(t={}),this.destroy=function(){r._store.remove(r.id)},this.toggle=function(){r.completed=!r.completed,r._store.saveTodo(r.toJSON())},this._title=t.title||"",this.id=t.id||ut(),this.completed=t.completed||!1,this._store=e}return t.prototype.toJSON=function(){return{completed:this.completed,title:this._title,id:this.id}},e(t,[{key:"title",get:function(){return this._title},set:function(t){this._title=t,this._store.saveTodo(this.toJSON())}}]),t}();ae._r=[0,[ue]];var le,ue=(se=function(){function t(){}var r=t.prototype;return r.addTodo=function(t){var e=new ae({title:t},this),r=this.todos.slice(0);r.push(e),this.todos=r},r.saveTodo=function(t){var e=this;this.todos=this.todos.map(function(r,n){return r.id===t.id?new ae(t,e):r})},r.remove=function(t){this.todos=this.todos.filter(function(e){return e.id!==t})},r.toggleAll=function(){var t=this,e=this.activeTodoCount>0;this.todos=this.todos.map(function(r,n){return new ae({title:r.title,id:r.id,completed:e},t)})},r.clearCompleted=function(){for(var t=[],e=[],r=0;r<this.todos.length;r++){var n=this.todos[r];n.completed?e.push(n.id):t.push(n)}this.todos=t},e(t,[{key:"todos",get:function(){return[]},set:function(t){}},{key:"activeTodoCount",get:function(){return this.todos.reduce(function(t,e){return t+(e.completed?0:1)},0)}},{key:"completedCount",get:function(){return this.todos.length-this.activeTodoCount}}]),t}(),ht(se.prototype,"todos",[b],Object.getOwnPropertyDescriptor(se.prototype,"todos"),se.prototype),ht(se.prototype,"todos",[b],Object.getOwnPropertyDescriptor(se.prototype,"todos"),se.prototype),ht(se.prototype,"activeTodoCount",[b],Object.getOwnPropertyDescriptor(se.prototype,"activeTodoCount"),se.prototype),ht(se.prototype,"addTodo",[f],Object.getOwnPropertyDescriptor(se.prototype,"addTodo"),se.prototype),ht(se.prototype,"saveTodo",[f],Object.getOwnPropertyDescriptor(se.prototype,"saveTodo"),se.prototype),ht(se.prototype,"remove",[f],Object.getOwnPropertyDescriptor(se.prototype,"remove"),se.prototype),ht(se.prototype,"toggleAll",[f],Object.getOwnPropertyDescriptor(se.prototype,"toggleAll"),se.prototype),ht(se.prototype,"clearCompleted",[f],Object.getOwnPropertyDescriptor(se.prototype,"clearCompleted"),se.prototype),se),ce="all",de="complete",he="active",pe=(le=function(){function t(t,e){this._todoService=t,this._locationStore=e}return e(t,[{key:"filter",get:function(){return this._locationStore.location("todo_filter")||ce},set:function(t){return this._locationStore.location("todo_filter",t)}},{key:"filteredTodos",get:function(){var t=this._todoService.todos;switch(this.filter){case ce:return t;case de:return t.filter(function(t){return!!t.completed});case he:return t.filter(function(t){return!t.completed});default:throw new Error("Unknown filter value: "+this.filter)}}}]),t}(),function(t,e,r,n,i){var o={};Object.keys(n).forEach(function(t){o[t]=n[t]}),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=r.slice().reverse().reduce(function(r,n){return n(t,e,r)||r},o),i&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(i):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(t,e,o),o=null)}(le.prototype,"filteredTodos",[b],Object.getOwnPropertyDescriptor(le.prototype,"filteredTodos"),le.prototype),le);pe._r=[0,[ue,ne]];var fe,ve,_e=13,me=(fe=function(){function t(t){var e=this;!function(t,e,r,n){r&&Object.defineProperty(t,e,{enumerable:r.enumerable,configurable:r.configurable,writable:r.writable,value:r.initializer?r.initializer.call(n):void 0})}(this,"title",ve,this),this.onKeyDown=function(t){if(t.keyCode===_e&&e.title){t.preventDefault();var r=e.title.trim();r&&(e._todoService.addTodo(r),e.title="")}},this._todoService=t}return t.prototype.onInput=function(t){var e=t.target;this.title=e.value},t}(),ve=pt(fe.prototype,"title",[b],{enumerable:!0,initializer:function(){return""}}),pt(fe.prototype,"onInput",[f],Object.getOwnPropertyDescriptor(fe.prototype,"onInput"),fe.prototype),fe);me._r=[0,[ue]],ft._r=[1];var ye="all",ge="active",be="completed";vt._r=[1];var we,Ce,ke,xe=27,Oe=13,Se=new(we=function(){function t(){var t=this;_t(this,"editingId",Ce,this),_t(this,"editText",ke,this),this.beginEdit=function(e){t._todo=e,t.editText=e.title,t.editingId=e.id},this.setFocus=function(t){t&&setTimeout(function(){return t.focus()},0)},this.cancel=function(){t.editText="",t.editingId=null},this.submit=function(){t.editingId&&(t._todo.title=t.editText,t.editText="",t.editingId=null)},this.onKey=function(e){e.which===xe?t.cancel():e.which===Oe&&t.submit()}}return t.prototype.setEditText=function(t){this.editText=t.target.value},t}(),Ce=mt(we.prototype,"editingId",[b],{enumerable:!0,initializer:function(){return null}}),ke=mt(we.prototype,"editText",[b],{enumerable:!0,initializer:function(){return""}}),mt(we.prototype,"setEditText",[f],Object.getOwnPropertyDescriptor(we.prototype,"setEditText"),we.prototype),we);yt._r=[1],gt._r=[1];var Ne=new ue,je=new pe(Ne,new ie(location,history)),Te=new me(Ne);lt(lom_h(gt,{todoHeaderService:Te,todoService:Ne,todoFilterService:je}),document.getElementById("todoapp"))}();
//# sourceMappingURL=bundle.js.map
