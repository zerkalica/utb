!function(){"use strict";function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function t(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}function n(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}function o(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var r="undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},i="$NO_OP",l="a runtime error occured! Use Inferno in development environment to find the error.",a=!("undefined"==typeof window||!window.document),u=Array.isArray;function c(e){var t=typeof e;return"string"===t||"number"===t}function s(e){return y(e)||m(e)}function f(e){return m(e)||!1===e||v(e)||y(e)}function d(e){return"function"==typeof e}function p(e){return"string"==typeof e}function h(e){return"number"==typeof e}function m(e){return null===e}function v(e){return!0===e}function y(e){return void 0===e}function g(e){return void 0!==e}function b(e){return"object"==typeof e}function k(e){throw e||(e=l),new Error("Inferno Error: "+e)}function w(e,t){var n={};if(e)for(var o in e)n[o]=e[o];if(t)for(var r in t)n[r]=t[r];return n}var C="$";function x(e,t,n,o,r,i,l,a){return{childFlags:e,children:t,className:n,dom:null,flags:o,key:void 0===r?null:r,parentVNode:null,props:void 0===i?null:i,ref:void 0===l?null:l,type:a}}function $(e,t,n,o,r,i,l,a){var u=void 0===r?1:r,c=x(u,o,n,e,l,i,a,t),s=E.createVNode;return"function"==typeof s&&s(c),0===u&&D(c,c.children),c}function _(e,t,n,o,r){(2&e)>0&&(e=g(t.prototype)&&d(t.prototype.render)?4:8);var i=t.defaultProps;if(!s(i))for(var l in n||(n={}),i)y(n[l])&&(n[l]=i[l]);if((8&e)>0){var a=t.defaultHooks;if(!s(a))if(r)for(var u in a)y(r[u])&&(r[u]=a[u]);else r=a}var c=x(1,null,null,e,o,n,r,t),f=E.createVNode;return d(f)&&f(c),c}function S(e,t){return x(1,s(e)?"":e,null,16,t,null,null,null)}function P(e){var t=e.props;return t&&(481&e.flags&&(g(t.children)&&s(e.children)&&D(e,t.children),g(t.className)&&(e.className=t.className||null,t.className=void 0)),g(t.key)&&(e.key=t.key,t.key=void 0),g(t.ref)&&(e.ref=t.ref,t.ref=void 0)),e}function N(e){var t,n=e.flags;if(14&n){var o,r=e.props;if(!m(r))for(var i in o={},r)o[i]=r[i];t=_(n,e.type,o,e.key,e.ref)}else if(481&n){var l=e.children;t=$(n,e.type,e.className,l,0,e.props,e.key,e.ref)}else 16&n?t=S(e.children,e.key):1024&n&&(t=e);return t}function T(){return S("",null)}function U(e,t,n,o){for(var r=e.length;n<r;n++){var i=e[n];if(!f(i)){var l=o+C+n;if(u(i))U(i,t,0,l);else{if(c(i))i=S(i,l);else{var a=i.key,s=p(a)&&a[0]===C;m(i.dom)&&!s||(i=N(i)),m(a)||s?i.key=l:i.key=o+a}t.push(i)}}}}function I(e){return"svg"===e?32:"input"===e?64:"select"===e?256:"textarea"===e?128:1}function D(e,t){var n,o=1;if(f(t))n=t;else if(p(t))o=2,n=S(t);else if(h(t))o=2,n=S(t+"");else if(u(t)){var r=t.length;if(0===r)n=null,o=1;else{(Object.isFrozen(t)||!0===t.$)&&(t=t.slice()),o=8;for(var i=0;i<r;i++){var l=t[i];if(f(l)||u(l)){U(t,n=n||t.slice(0,i),i,"");break}if(c(l))(n=n||t.slice(0,i)).push(S(l,C+i));else{var a=l.key,s=m(l.dom),d=m(a),v=!d&&a[0]===C;!s||d||v?(n=n||t.slice(0,i),s&&!v||(l=N(l)),(d||v)&&(l.key=C+i),n.push(l)):n&&n.push(l)}}(n=n||t).$=!0}}else n=t,m(t.dom)||(n=N(t)),o=2;return e.children=n,e.childFlags=o,e}var E={afterMount:null,afterRender:null,afterUpdate:null,beforeRender:null,beforeUnmount:null,createVNode:null,roots:[]};function O(e,t){return d(t)?{data:e,event:t}:null}var V="http://www.w3.org/1999/xlink",M="http://www.w3.org/XML/1998/namespace",L="http://www.w3.org/2000/svg",A={"xlink:actuate":V,"xlink:arcrole":V,"xlink:href":V,"xlink:role":V,"xlink:show":V,"xlink:title":V,"xlink:type":V,"xml:base":M,"xml:lang":M,"xml:space":M},F={},R=[];function W(e,t){e.appendChild(t)}function j(e,t,n){s(n)?W(e,t):e.insertBefore(t,n)}function B(e,t){return!0===t?document.createElementNS(L,e):document.createElement(e)}function K(e,t,n){e.replaceChild(t,n)}function z(e,t){e.removeChild(t)}function H(e){for(var t;void 0!==(t=e.shift());)t()}var X={},q={};function G(e,t,n){var o=X[e],r=n.$EV;t?(o||(q[e]=Z(e),X[e]=0),r||(r=n.$EV={}),r[e]||X[e]++,r[e]=t):r&&r[e]&&(X[e]--,1===o&&(document.removeEventListener(Q(e),q[e]),q[e]=null),r[e]=t)}function J(e,t,n,o,r){for(var i=t;!m(i);){if(n&&i.disabled)return;var l=i.$EV;if(l){var a=l[o];if(a&&(r.dom=i,a.event?a.event(a.data,e):a(e),e.cancelBubble))return}i=i.parentNode}}function Q(e){return e.substr(2).toLowerCase()}function Y(){this.cancelBubble=!0,this.stopImmediatePropagation()}function Z(e){var t=function(t){var n=t.type,o="click"===n||"dblclick"===n;if(o&&0!==t.button)return t.preventDefault(),t.stopPropagation(),!1;t.stopPropagation=Y;var r={dom:document};try{Object.defineProperty(t,"currentTarget",{configurable:!0,get:function(){return r.dom}})}catch(e){}J(t,t.target,o,e,r)};return document.addEventListener(Q(e),t),t}function ee(e,t){var n=document.createElement("i");return n.innerHTML=t,n.innerHTML===e.innerHTML}function te(e,t){return Boolean(t&&t.dangerouslySetInnerHTML&&t.dangerouslySetInnerHTML.__html&&ee(e,t.dangerouslySetInnerHTML.__html))}function ne(e,t,n){if(e[t]){var o=e[t];o.event?o.event(o.data,n):o(n)}else{var r=t.toLowerCase();e[r]&&e[r](n)}}function oe(e,t){var n=function(n){n.stopPropagation();var o=this.$V;if(o){var r=o.props||F,i=o.dom;if(p(e))ne(r,e,n);else for(var l=0;l<e.length;l++)ne(r,e[l],n);if(d(t)){var a=this.$V,u=a.props||F;t(u,i,!1,a)}}};return Object.defineProperty(n,"wrapped",{configurable:!1,enumerable:!1,value:!0,writable:!1}),n}function re(e){return"checkbox"===e||"radio"===e}var ie=oe("onInput",ce),le=oe(["onClick","onChange"],ce);function ae(e){e.stopPropagation()}function ue(e,t){re(t.type)?(e.onchange=le,e.onclick=ae):e.oninput=ie}function ce(e,t){var n=e.type,o=e.value,r=e.checked,i=e.multiple,l=e.defaultValue,a=!s(o);n&&n!==t.type&&t.setAttribute("type",n),s(i)||i===t.multiple||(t.multiple=i),s(l)||a||(t.defaultValue=l+""),re(n)?(a&&(t.value=o),s(r)||(t.checked=r)):a&&t.value!==o?(t.defaultValue=o,t.value=o):s(r)||(t.checked=r)}function se(e,t){if("optgroup"===e.type){var n=e.children,o=e.childFlags;if(12&o)for(var r=0,i=n.length;r<i;r++)fe(n[r],t);else 2===o&&fe(n,t)}else fe(e,t)}function fe(e,t){var n=e.props||F,o=e.dom;o.value=n.value,u(t)&&-1!==t.indexOf(n.value)||n.value===t?o.selected=!0:s(t)&&s(n.selected)||(o.selected=n.selected||!1)}ae.wrapped=!0;var de=oe("onChange",he);function pe(e){e.onchange=de}function he(e,t,n,o){var r=Boolean(e.multiple);s(e.multiple)||r===t.multiple||(t.multiple=r);var i=o.childFlags;if(0==(1&i)){var l=o.children,a=e.value;if(n&&s(a)&&(a=e.defaultValue),12&i)for(var u=0,c=l.length;u<c;u++)se(l[u],a);else 2===i&&se(l,a)}}var me=oe("onInput",ge),ve=oe("onChange");function ye(e,t){e.oninput=me,t.onChange&&(e.onchange=ve)}function ge(e,t,n){var o=e.value,r=t.value;if(s(o)){if(n){var i=e.defaultValue;s(i)||i===r||(t.defaultValue=i,t.value=i)}}else r!==o&&(t.defaultValue=o,t.value=o)}function be(e,t,n,o,r,i){64&e?ce(o,n):256&e?he(o,n,r,t):128&e&&ge(o,n,r),i&&(n.$V=t)}function ke(e,t,n){64&e?ue(t,n):256&e?pe(t):128&e&&ye(t,n)}function we(e){return e.type&&re(e.type)?!s(e.checked):!s(e.value)}function Ce(e,t){xe(e),m(t)||(z(t,e.dom),e.dom=null)}function xe(e){var t=e.flags;if(481&t){var n=e.ref,o=e.props;d(n)&&n(null);var r=e.children,i=e.childFlags;if(12&i?$e(r):2===i&&xe(r),!m(o))for(var l in o)switch(l){case"onClick":case"onDblClick":case"onFocusIn":case"onFocusOut":case"onKeyDown":case"onKeyPress":case"onKeyUp":case"onMouseDown":case"onMouseMove":case"onMouseUp":case"onSubmit":case"onTouchEnd":case"onTouchMove":case"onTouchStart":G(l,null,e.dom)}}else if(14&t){var a=e.children,u=e.ref;4&t?(d(E.beforeUnmount)&&E.beforeUnmount(e),d(a.componentWillUnmount)&&a.componentWillUnmount(),d(u)&&u(null),a.$UN=!0,xe(a.$LI)):(!s(u)&&d(u.onComponentWillUnmount)&&u.onComponentWillUnmount(e.dom,e.props||F),xe(a))}else if(1024&t){var c=e.children;!m(c)&&b(c)&&Ce(c,e.type)}}function $e(e){for(var t=0,n=e.length;t<n;t++)xe(e[t])}function _e(e,t){$e(t),e.textContent=""}function Se(e,t){return function(n){e(t.data,n)}}function Pe(e,t,n,o){var r=e.toLowerCase();if(d(n)||s(n)){var i=o[r];i&&i.wrapped||(o[r]=n)}else{var l=n.event;l&&d(l)&&(o[r]=Se(l,n))}}function Ne(e,t){switch(e){case"animationIterationCount":case"borderImageOutset":case"borderImageSlice":case"borderImageWidth":case"boxFlex":case"boxFlexGroup":case"boxOrdinalGroup":case"columnCount":case"fillOpacity":case"flex":case"flexGrow":case"flexNegative":case"flexOrder":case"flexPositive":case"flexShrink":case"floodOpacity":case"fontWeight":case"gridColumn":case"gridRow":case"lineClamp":case"lineHeight":case"opacity":case"order":case"orphans":case"stopOpacity":case"strokeDasharray":case"strokeDashoffset":case"strokeMiterlimit":case"strokeOpacity":case"strokeWidth":case"tabSize":case"widows":case"zIndex":case"zoom":return t;default:return t+"px"}}function Te(e,t,n){var o,r,i=n.style;if(p(t))i.cssText=t;else if(s(e)||p(e))for(o in t)r=t[o],i[o]=h(r)?Ne(o,r):r;else{for(o in t)(r=t[o])!==e[o]&&(i[o]=h(r)?Ne(o,r):r);for(o in e)s(t[o])&&(i[o]="")}}function Ue(e,t,n,o,r,i,l){switch(e){case"onClick":case"onDblClick":case"onFocusIn":case"onFocusOut":case"onKeyDown":case"onKeyPress":case"onKeyUp":case"onMouseDown":case"onMouseMove":case"onMouseUp":case"onSubmit":case"onTouchEnd":case"onTouchMove":case"onTouchStart":G(e,n,o);break;case"children":case"childrenType":case"className":case"defaultValue":case"key":case"multiple":case"ref":return;case"allowfullscreen":case"autoFocus":case"autoplay":case"capture":case"checked":case"controls":case"default":case"disabled":case"hidden":case"indeterminate":case"loop":case"muted":case"novalidate":case"open":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"selected":o[e="autoFocus"===e?e.toLowerCase():e]=!!n;break;case"defaultChecked":case"value":case"volume":if(i&&"value"===e)return;var a=s(n)?"":n;o[e]!==a&&(o[e]=a);break;case"dangerouslySetInnerHTML":var u=t&&t.__html||"",c=n&&n.__html||"";u!==c&&(s(c)||ee(o,c)||(m(l)||(12&l.childFlags?$e(l.children):2===l.childFlags&&xe(l.children),l.children=null,l.childFlags=1),o.innerHTML=c));break;default:"o"===e[0]&&"n"===e[1]?Pe(e,t,n,o):s(n)?o.removeAttribute(e):"style"===e?Te(t,n,o):r&&A[e]?o.setAttributeNS(A[e],e,n):o.setAttribute(e,n)}}function Ie(e,t,n,o,r){var i=!1,l=(448&t)>0;for(var a in l&&(i=we(n))&&ke(t,o,n),n)Ue(a,null,n[a],o,r,i,null);l&&be(t,e,o,n,!0,i)}function De(e,t,n,o){var r=new t(n,o);if(e.children=r,r.$V=e,r.$BS=!1,r.context=o,r.props===F&&(r.props=n),r.$UN=!1,d(r.componentWillMount)){if(r.$BR=!0,r.componentWillMount(),r.$PSS){var i=r.state,l=r.$PS;if(m(i))r.state=l;else for(var a in l)i[a]=l[a];r.$PSS=!1,r.$PS=null}r.$BR=!1}d(E.beforeRender)&&E.beforeRender(r);var u,c=Ee(r.render(n,r.state,o),e);return d(r.getChildContext)&&(u=r.getChildContext()),s(u)?r.$CX=o:r.$CX=w(o,u),d(E.afterRender)&&E.afterRender(r),r.$LI=c,r}function Ee(e,t){return f(e)?e=T():c(e)?e=S(e,null):(e.dom&&(e=N(e)),14&e.flags&&(e.parentVNode=t)),e}function Oe(e,t,n,o,r){var i=e.flags;return 481&i?Me(e,t,n,o,r):14&i?Ae(e,t,n,o,r,(4&i)>0):512&i||16&i?Ve(e,t):1024&i?(Oe(e.children,e.type,n,o,!1),e.dom=Ve(T(),t)):void 0}function Ve(e,t){var n=e.dom=document.createTextNode(e.children);return m(t)||W(t,n),n}function Me(e,t,n,o,r){var i=e.flags,l=e.children,a=e.props,u=e.className,c=e.ref,f=e.childFlags;r=r||(32&i)>0;var p=B(e.type,r);if(e.dom=p,s(u)||""===u||(r?p.setAttribute("class",u):p.className=u),m(t)||W(t,p),0==(1&f)){var h=!0===r&&"foreignObject"!==e.type;2===f?Oe(l,p,n,o,h):12&f&&Le(l,p,n,o,h)}return m(a)||Ie(e,i,a,p,r),d(c)&&Be(p,c,n),p}function Le(e,t,n,o,r){for(var i=0,l=e.length;i<l;i++){var a=e[i];m(a.dom)||(e[i]=a=N(a)),Oe(a,t,n,o,r)}}function Ae(e,t,n,o,r,i){var l,a=e.type,u=e.props||F,c=e.ref;if(i){var s=De(e,a,u,o);e.dom=l=Oe(s.$LI,null,n,s.$CX,r),Re(e,c,s,n),s.$UPD=!1}else{var f=Ee(a(u,o),e);e.children=f,e.dom=l=Oe(f,null,n,o,r),je(u,c,l,n)}return m(t)||W(t,l),l}function Fe(e,t,n,o,r){return function(){e.$UPD=!0,t&&n(o),r&&e.componentDidMount(),e.$UPD=!1}}function Re(e,t,n,o){d(t)&&t(n);var r=d(n.componentDidMount),i=E.afterMount,l=d(i);(r||l)&&o.push(Fe(n,l,i,e,r))}function We(e,t,n){return function(){return e.onComponentDidMount(t,n)}}function je(e,t,n,o){s(t)||(d(t.onComponentWillMount)&&t.onComponentWillMount(e),d(t.onComponentDidMount)&&o.push(We(t,n,e)))}function Be(e,t,n){n.push(function(){return t(e)})}function Ke(e,t,n,o,r,i){var l=e.type,a=e.ref,u=e.props||F;if(i){var c=De(e,l,u,o),s=c.$LI;Xe(s,t,n,c.$CX,r),e.dom=s.dom,Re(e,a,c,n),c.$UPD=!1}else{var f=Ee(l(u,o),e);Xe(f,t,n,o,r),e.children=f,e.dom=f.dom,je(u,a,t,n)}}function ze(e,t,n,o,r){var i=e.children,l=e.props,a=e.className,u=e.flags,c=e.ref;if(r=r||(32&u)>0,1!==t.nodeType||t.tagName.toLowerCase()!==e.type){var f=Me(e,null,n,o,r);e.dom=f,K(t.parentNode,f,t)}else{e.dom=t;var p=t.firstChild,h=e.childFlags;if(0==(1&h)){for(var v=null;p;)v=p.nextSibling,8===p.nodeType&&("!"===p.data?t.replaceChild(document.createTextNode(""),p):t.removeChild(p)),p=v;if(p=t.firstChild,2===h)m(p)?Oe(i,t,n,o,r):(v=p.nextSibling,Xe(i,p,n,o,r),p=v);else if(12&h)for(var y=0,g=i.length;y<g;y++){var b=i[y];m(p)?Oe(b,t,n,o,r):(v=p.nextSibling,Xe(b,p,n,o,r),p=v)}for(;p;)v=p.nextSibling,t.removeChild(p),p=v}else m(t.firstChild)||te(t,l)||(t.textContent="",448&u&&(t.defaultValue=""));m(l)||Ie(e,u,l,t,r),s(a)?""!==t.className&&t.removeAttribute("class"):r?t.setAttribute("class",a):t.className=a,d(c)&&Be(t,c,n)}}function He(e,t){if(3!==t.nodeType){var n=Ve(e,null);e.dom=n,K(t.parentNode,n,t)}else{var o=e.children;t.nodeValue!==o&&(t.nodeValue=o),e.dom=t}}function Xe(e,t,n,o,r){var i=e.flags;14&i?Ke(e,t,n,o,r,(4&i)>0):481&i?ze(e,t,n,o,r):16&i?He(e,t):512&i?e.dom=t:k()}function qe(e,t,n){var o=t.firstChild;if(!m(o))for(f(e)||Xe(e,o,R,F,!1),o=t.firstChild;o=o.nextSibling;)t.removeChild(o);R.length>0&&H(R),t.$V||E.roots.push(t),t.$V=e,d(n)&&n()}function Ge(e,t,n,o,r,i){xe(e),K(n,Oe(t,null,o,r,i),e.dom)}function Je(e,t,n,o,r,i){if(e!==t){var l=0|t.flags;e.flags!==l||2048&l?Ge(e,t,n,o,r,i):481&l?Ye(e,t,n,o,r,i):14&l?tt(e,t,n,o,r,i,(4&l)>0):16&l?nt(e,t,n):512&l?t.dom=e.dom:Qe(e,t,o,r)}}function Qe(e,t,n,o){var r=e.type,i=t.type,l=t.children;if(Ze(e.childFlags,t.childFlags,e.children,l,r,n,o,!1),t.dom=e.dom,r!==i&&!f(l)){var a=l.dom;r.removeChild(a),i.appendChild(a)}}function Ye(e,t,n,o,r,i){var l=t.type;if(e.type!==l)Ge(e,t,n,o,r,i);else{var a,u=e.dom,c=t.flags,f=e.props,p=t.props,h=!1,m=!1;if(t.dom=u,i=i||(32&c)>0,f!==p){var v=f||F;if((a=p||F)!==F)for(var y in(h=(448&c)>0)&&(m=we(a)),a){var g=v[y],b=a[y];g!==b&&Ue(y,g,b,u,i,m,e)}if(v!==F)for(var k in v)a.hasOwnProperty(k)||s(v[k])||Ue(k,v[k],null,u,i,m,e)}var w=e.children,C=t.children,x=t.ref,$=e.className,_=t.className;w!==C&&Ze(e.childFlags,t.childFlags,w,C,u,o,r,i&&"foreignObject"!==l),h&&be(c,t,u,a,!1,m),$!==_&&(s(_)?u.removeAttribute("class"):i?u.setAttribute("class",_):u.className=_),d(x)&&e.ref!==x&&Be(u,x,o)}}function Ze(e,t,n,o,r,i,l,a){switch(e){case 2:switch(t){case 2:Je(n,o,r,i,l,a);break;case 1:Ce(n,r);break;default:Ce(n,r),Le(o,r,i,l,a)}break;case 1:switch(t){case 2:Oe(o,r,i,l,a);break;case 1:break;default:Le(o,r,i,l,a)}break;default:if(12&t){var u=n.length,c=o.length;0===u?c>0&&Le(o,r,i,l,a):0===c?_e(r,n):8===t&&8===e?rt(n,o,r,i,l,a,u,c):ot(n,o,r,i,l,a,u,c)}else 1===t?_e(r,n):(_e(r,n),Oe(o,r,i,l,a))}}function et(e,t,n,o,r,l,a,u,c,f){var p=e.state,h=e.props;n.children=e;var m,v=e.$LI;if(!e.$UN){if(h!==o||o===F){if(!f&&d(e.componentWillReceiveProps)){if(e.$BR=!0,e.componentWillReceiveProps(o,a),e.$UN)return;e.$BR=!1}e.$PSS&&(t=w(t,e.$PS),e.$PSS=!1,e.$PS=null)}var y=d(e.shouldComponentUpdate);if(c||!y||y&&e.shouldComponentUpdate(o,t,a)){d(e.componentWillUpdate)&&(e.$BS=!0,e.componentWillUpdate(o,t,a),e.$BS=!1),e.props=o,e.state=t,e.context=a,d(E.beforeRender)&&E.beforeRender(e),m=e.render(o,t,a),d(E.afterRender)&&E.afterRender(e);var g,b=m!==i;if(d(e.getChildContext)&&(g=e.getChildContext()),g=s(g)?a:w(a,g),e.$CX=g,b)Je(v,e.$LI=Ee(m,n),r,l,g,u),d(e.componentDidUpdate)&&e.componentDidUpdate(h,p),d(E.afterUpdate)&&E.afterUpdate(n)}else e.props=o,e.state=t,e.context=a;n.dom=e.$LI.dom}}function tt(e,t,n,o,r,l,a){var u=t.type,c=e.key,f=t.key;if(e.type!==u||c!==f)Ge(e,t,n,o,r,l);else{var p=t.props||F;if(a){var h=e.children;h.$UPD=!0,et(h,h.state,t,p,n,o,r,l,!1,!1),h.$V=t,h.$UPD=!1}else{var m=!0,v=e.props,y=t.ref,g=!s(y),b=e.children;if(t.dom=e.dom,t.children=b,g&&d(y.onComponentShouldUpdate)&&(m=y.onComponentShouldUpdate(v,p)),!1!==m){g&&d(y.onComponentWillUpdate)&&y.onComponentWillUpdate(v,p);var k=u(p,r);k!==i&&(Je(b,k=Ee(k,t),n,o,r,l),t.children=k,t.dom=k.dom,g&&d(y.onComponentDidUpdate)&&y.onComponentDidUpdate(v,p))}else 14&b.flags&&(b.parentVNode=t)}}}function nt(e,t,n){var o,r=t.children;m(n.firstChild)?(n.textContent=r,o=n.firstChild):(o=e.dom,r!==e.children&&(o.nodeValue=r)),t.dom=o}function ot(e,t,n,o,r,i,l,a){for(var u=l>a?a:l,c=0;c<u;c++){var s=t[c];s.dom&&(s=t[c]=N(s)),Je(e[c],s,n,o,r,i)}if(l<a)for(c=u;c<a;c++){var f=t[c];f.dom&&(f=t[c]=N(f)),Oe(f,n,o,r,i)}else if(l>a)for(c=u;c<l;c++)Ce(e[c],n)}function rt(e,t,n,o,r,i,l,a){var u,c,s,f,d,p,h,v=l-1,y=a-1,b=0,k=0,w=e[b],C=t[k],x=e[v],$=t[y];C.dom&&(t[k]=C=N(C)),$.dom&&(t[y]=$=N($));e:{for(;w.key===C.key;){if(Je(w,C,n,o,r,i),k++,++b>v||k>y)break e;w=e[b],(C=t[k]).dom&&(t[k]=C=N(C))}for(;x.key===$.key;){if(Je(x,$,n,o,r,i),y--,b>--v||k>y)break e;x=e[v],($=t[y]).dom&&(t[y]=$=N($))}}if(b>v){if(k<=y)for(d=(p=y+1)<a?t[p].dom:null;k<=y;)(h=t[k]).dom&&(t[k]=h=N(h)),k++,j(n,Oe(h,null,o,r,i),d)}else if(k>y)for(;b<=v;)Ce(e[b++],n);else{var _=v-b+1,S=y-k+1,P=new Array(S);for(u=0;u<S;u++)P[u]=-1;var T=!1,U=0,I=0;if(S<=4||_*S<=16){for(u=b;u<=v;u++)if(s=e[u],I<S)for(c=k;c<=y;c++)if(f=t[c],s.key===f.key){P[c-k]=u,U>c?T=!0:U=c,f.dom&&(t[c]=f=N(f)),Je(s,f,n,o,r,i),I++,e[u]=null;break}}else{var D={};for(u=k;u<=y;u++)D[t[u].key]=u;for(u=b;u<=v;u++)s=e[u],I<S&&g(c=D[s.key])&&(f=t[c],P[c-k]=u,U>c?T=!0:U=c,f.dom&&(t[c]=f=N(f)),Je(s,f,n,o,r,i),I++,e[u]=null)}if(_===l&&0===I)_e(n,e),Le(t,n,o,r,i);else{for(u=_-I;u>0;)m(s=e[b++])||(Ce(s,n),u--);if(T){var E=it(P);for(c=E.length-1,u=S-1;u>=0;u--)-1===P[u]?((h=t[U=u+k]).dom&&(t[U]=h=N(h)),p=U+1,j(n,Oe(h,null,o,r,i),p<a?t[p].dom:null)):c<0||u!==E[c]?(p=(U=u+k)+1,j(n,(h=t[U]).dom,p<a?t[p].dom:null)):c--}else if(I!==S)for(u=S-1;u>=0;u--)-1===P[u]&&((h=t[U=u+k]).dom&&(t[U]=h=N(h)),p=U+1,j(n,Oe(h,null,o,r,i),p<a?t[p].dom:null))}}}function it(e){var t,n,o,r,i,l=e.slice(),a=[0],u=e.length;for(t=0;t<u;t++){var c=e[t];if(-1!==c){if(e[n=a[a.length-1]]<c){l[t]=n,a.push(t);continue}for(o=0,r=a.length-1;o<r;)e[a[i=(o+r)/2|0]]<c?o=i+1:r=i;c<e[a[o]]&&(o>0&&(l[t]=a[o-1]),a[o]=t)}}for(r=a[(o=a.length)-1];o-- >0;)a[o]=r,r=l[r];return a}var lt=E.roots;a&&document.body;function at(e,t,n){if(e!==i){var o,r,l=lt.length;for(r=0;r<l;r++)if(lt[r]===t){o=t.$V;break}return y(o)?f(e)||(e.dom&&(e=N(e)),m(t.firstChild)?(Oe(e,t,R,F,!1),t.$V=e,lt.push(t)):qe(e,t),o=e):s(e)?(Ce(o,t),lt.splice(r,1)):(e.dom&&(e=N(e)),Je(o,e,t,R,F,!1),o=t.$V=e),R.length>0&&H(R),d(n)&&n(),o&&14&o.flags?o.children:void 0}}function ut(e){return function(t,n){e||(e=t),at(n,e)}}function ct(e,t){return $(1024,t,null,e,0,null,f(e)?null:e.key,null)}var st="undefined"==typeof Promise?null:Promise.resolve(),ft="undefined"==typeof requestAnimationFrame?setTimeout:requestAnimationFrame;function dt(e){return st?st.then(e):ft(e)}function pt(e,t,n){d(t)&&(t=t(e.state,e.props,e.context));var o=e.$PS;if(s(o))e.$PS=t;else for(var r in t)o[r]=t[r];if(e.$PSS||e.$BR)e.$PSS=!0,e.$BR&&d(n)&&R.push(n.bind(e));else if(e.$UPD){var i=e.$QU;m(i)&&(i=e.$QU=[],dt(ht(e,i))),d(n)&&i.push(n)}else e.$PSS=!0,e.$UPD=!0,mt(e,!1,n),e.$UPD=!1}function ht(e,t){return function(){e.$QU=null,e.$UPD=!0,mt(e,!1,function(){for(var n=0,o=t.length;n<o;n++)t[n].call(e)}),e.$UPD=!1}}function mt(e,t,n){if(!e.$UN){if(t||!e.$BR){e.$PSS=!1;var o=e.$PS,r=w(e.state,o),i=e.props,l=e.context;e.$PS=null;var a=e.$V,u=e.$LI;if(et(e,r,a,i,u.dom&&u.dom.parentNode,R,l,(32&a.flags)>0,t,!0),e.$UN)return;if(0==(1024&e.$LI.flags))for(var c=e.$LI.dom;!m(a=a.parentVNode);)(14&a.flags)>0&&(a.dom=c);R.length>0&&H(R)}else e.state=e.$PS,e.$PS=null;d(n)&&n.call(e)}}var vt=function(e,t){this.state=null,this.$BR=!1,this.$BS=!0,this.$PSS=!1,this.$PS=null,this.$LI=null,this.$V=null,this.$UN=!1,this.$CX=null,this.$UPD=!0,this.$QU=null,this.props=e||F,this.context=t||F};vt.prototype.forceUpdate=function(e){this.$UN||mt(this,!0,e)},vt.prototype.setState=function(e,t){this.$UN||this.$BS||pt(this,e,t)},vt.prototype.render=function(e,t,n){},vt.defaultProps=null;"undefined"==typeof window||window.document;var yt=Array.isArray;function gt(e){var t=typeof e;return"string"===t||"number"===t}function bt(e){return kt(e)||!1===e||wt(e)||Ct(e)}function kt(e){return null===e}function wt(e){return!0===e}function Ct(e){return void 0===e}function xt(e){return void 0!==e}function $t(e,t){var n={};if(e)for(var o in e)n[o]=e[o];if(t)for(var r in t)n[r]=t[r];return n}function _t(e,t){for(var n,o=[],r=arguments.length-2;r-- >0;)o[r]=arguments[r+2];3===arguments.length?(t||(t={}),t.children=o[0]):o.length>0&&(t||(t={}),t.children=o);var i=e.flags,l=e.className,a=e.key,u=e.ref;if(t&&(xt(t.className)&&(l=t.className),xt(t.ref)&&(u=t.ref),xt(t.key)&&(a=t.key)),14&i){var c=(n=_(i,e.type,e.props||t?$t(e.props,t):F,a,u)).props,s=c.children;if(s)if(yt(s)){var f=s.length;if(f>0){for(var d=[],p=0;p<f;p++){var h=s[p];gt(h)?d.push(h):!bt(h)&&h.flags&&d.push(N(h))}c.children=d}}else s.flags&&(c.children=N(s));n.children=null}else 481&i?(t||(t={children:e.children}),n=$(i,e.type,l,null,1,$t(e.props,t),a,u)):16&i&&(n=S(e.children));return P(n)}var St="a runtime error occured! Use Inferno in development environment to find the error.";"undefined"==typeof window||window.document;function Pt(e){return"function"==typeof e}function Nt(e){return void 0!==e}function Tt(e){return"object"==typeof e}function Ut(e){throw e||(e=St),new Error("Inferno Error: "+e)}var It={componentDidMount:1,componentDidUnmount:1,componentDidUpdate:1,componentWillMount:1,componentWillUnmount:1,componentWillUpdate:1,constructor:1,render:1,shouldComponentUpdate:1};function Dt(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}function Et(e){for(var t in e){var n=e[t];"function"!=typeof n||n.__bound||It[t]||((e[t]=n.bind(e)).__bound=!0)}}function Ot(e,t){void 0===t&&(t={});for(var n=0,o=e.length;n<o;n++){var r=e[n];for(var i in r.mixins&&Ot(r.mixins,t),r)r.hasOwnProperty(i)&&"function"==typeof r[i]&&(t[i]||(t[i]=[])).push(r[i])}return t}function Vt(e,t){return function(){for(var n,o=arguments,r=this,i=0,l=e.length;i<l;i++){var a=e[i].apply(r,o);t?n=t(n,a):Nt(a)&&(n=a)}return n}}function Mt(e,t){if(Nt(t))for(var n in Tt(t)||Ut("Expected Mixin to return value to be an object or null."),e||(e={}),t)t.hasOwnProperty(n)&&(e.hasOwnProperty(n)&&Ut("Mixins return duplicate key "+n+" in their return values"),e[n]=t[n]);return e}function Lt(e,t,n){var o=Nt(t[e])?n.concat(t[e]):n;t[e]="getDefaultProps"===e||"getInitialState"===e||"getChildContext"===e?Vt(o,Mt):Vt(o)}function At(e,t){for(var n in t)if(t.hasOwnProperty(n)){var o=t[n],r=void 0;r="getDefaultProps"===n?e:e.prototype,Pt(o[0])?Lt(n,r,o):r[n]=o}}function Ft(e){var t=function(e){function t(t,n){e.call(this,t,n),Et(this),this.getInitialState&&(this.state=this.getInitialState())}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.replaceState=function(e,t){this.setState(e,t)},t.prototype.isMounted=function(){return null!==this.$LI&&!this.$UN},t}(vt);return t.displayName=e.name||e.displayName||"Component",t.propTypes=e.propTypes,t.mixins=e.mixins&&Ot(e.mixins),t.getDefaultProps=e.getDefaultProps,Dt(t.prototype,e),e.statics&&Dt(t,e.statics),e.mixins&&At(t,Ot(e.mixins)),t.getDefaultProps&&(t.defaultProps=t.getDefaultProps()),t}"undefined"==typeof window||window.document;function Rt(e){return zt(e)||Bt(e)}function Wt(e){return Bt(e)||!1===e||Kt(e)||zt(e)}function jt(e){return"string"==typeof e}function Bt(e){return null===e}function Kt(e){return!0===e}function zt(e){return void 0===e}function Ht(e){return"object"==typeof e}var Xt={onComponentDidMount:1,onComponentDidUpdate:1,onComponentShouldUpdate:1,onComponentWillMount:1,onComponentWillUnmount:1,onComponentWillUpdate:1};function qt(e,t){for(var n=[],o=arguments.length-2;o-- >0;)n[o]=arguments[o+2];if(Wt(e)||Ht(e))throw new Error("Inferno Error: createElement() name parameter cannot be undefined, null, false or true, It must be a string, class or function.");var r,i=n,l=null,a=null,u=null,c=0;if(n&&(1===n.length?i=n[0]:0===n.length&&(i=void 0)),!jt(e)){if(c=2,zt(i)||(t||(t={}),t.children=i,i=null),!Rt(t))for(var s in r={},t)void 0!==Xt[s]?(l||(l={}),l[s]=t[s]):"key"===s?a=t.key:"ref"===s?l=t.ref:r[s]=t[s];return _(c,e,r,a,l)}if(c=I(e),!Rt(t))for(var f in r={},t)"className"===f||"class"===f?u=t[f]:"key"===f?a=t.key:"children"===f&&zt(i)?i=t.children:"ref"===f?l=t.ref:r[f]=t[f];return $(c,e,u,i,0,r,a,l)}var Gt="$NO_OP",Jt=!("undefined"==typeof window||!window.document),Qt=Array.isArray;function Yt(e){return rn(e)||nn(e)}function Zt(e){return nn(e)||!1===e||on(e)||rn(e)}function en(e){return"function"==typeof e}function tn(e){return"string"==typeof e}function nn(e){return null===e}function on(e){return!0===e}function rn(e){return void 0===e}function ln(e){return"object"==typeof e}function an(e){return!1!==(ln(e)&&!1===nn(e))&&(495&e.flags)>0}function un(){}un.isRequired=un;var cn=function(){return un},sn={any:cn,array:un,arrayOf:cn,bool:un,checkPropTypes:function(){return null},element:cn,func:un,instanceOf:cn,node:cn,number:un,object:un,objectOf:cn,oneOf:cn,oneOfType:cn,shape:cn,string:un,symbol:un},fn={},dn=/[\-\:]([a-z])/g,pn=function(e){return e[1].toUpperCase()};function hn(e){return at(null,e),!0}function mn(e,t){for(var n=arguments,o=1,r=void 0;o<arguments.length;o++)if(r=n[o])for(var i in r)r.hasOwnProperty(i)&&(e[i]=r[i]);return e}function vn(e,t){for(var n=0,o=e.length;n<o;n++){var r=e[n];Qt(r)?vn(r,t):t.push(r)}return t}["accent-height","alignment-baseline","arabic-form","baseline-shift","cap-height","clip-path","clip-rule","color-interpolation","color-interpolation-filters","color-profile","color-rendering","dominant-baseline","enable-background","fill-opacity","fill-rule","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-constiant","font-weight","glyph-name","glyph-orientation-horizontal","glyph-orientation-vertical","horiz-adv-x","horiz-origin-x","image-rendering","letter-spacing","lighting-color","marker-end","marker-mid","marker-start","overline-position","overline-thickness","paint-order","panose-1","pointer-events","rendering-intent","shape-rendering","stop-color","stop-opacity","strikethrough-position","strikethrough-thickness","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width","text-anchor","text-decoration","text-rendering","underline-position","underline-thickness","unicode-bidi","unicode-range","units-per-em","v-alphabetic","v-hanging","v-ideographic","v-mathematical","vector-effect","vert-adv-y","vert-origin-x","vert-origin-y","word-spacing","writing-mode","x-height","xlink:actuate","xlink:arcrole","xlink:href","xlink:role","xlink:show","xlink:title","xlink:type","xml:base","xmlns:xlink","xml:lang","xml:space"].forEach(function(e){var t=e.replace(dn,pn);fn[t]=e});var yn=[],gn={map:function(e,t,n){return Yt(e)?e:(e=gn.toArray(e),n&&n!==e&&(t=t.bind(n)),e.map(t))},forEach:function(e,t,n){if(!Yt(e)){e=gn.toArray(e),n&&n!==e&&(t=t.bind(n));for(var o=0,r=e.length;o<r;o++){t(Zt(e[o])?null:e[o],o,e)}}},count:function(e){return(e=gn.toArray(e)).length},only:function(e){if(1!==(e=gn.toArray(e)).length)throw new Error("Children.only() expects only one child.");return e[0]},toArray:function(e){if(Yt(e))return[];if(Qt(e)){var t=[];return vn(e,t),t}return yn.concat(e)}};vt.prototype.isReactComponent={};var bn=null;E.beforeRender=function(e){bn=e},E.afterRender=function(){bn=null};var kn="15.4.2";function wn(e){for(var t in e){"onDoubleClick"===t&&(e.onDblClick=e[t],e[t]=void 0),"htmlFor"===t&&(e.for=e[t],e[t]=void 0);var n=fn[t];n&&n!==t&&(e[n]=e[t],e[t]=void 0)}}function Cn(e,t){if(("input"===e||"textarea"===e)&&"radio"!==t.type&&t.onChange){var n,o=t.type;t[n="checkbox"===o?"onclick":"file"===o?"onchange":"oninput"]||(t[n]=t.onChange,t.onChange=void 0)}}function xn(e){var t,n=[];do{(t=e.next()).value&&n.push(t.value)}while(!t.done);return n}"undefined"==typeof Event||Event.prototype.persist||(Event.prototype.persist=function(){});var $n="undefined"==typeof window?global:window,_n=void 0!==$n.Symbol,Sn=_n?$n.Symbol.iterator:"",Pn=E.createVNode;function Nn(e,t){for(var n in e)if(!(n in t))return!0;for(var o in t)if(e[o]!==t[o])return!0;return!1}E.createVNode=function(e){var t=e.children,n=e.ref,o=e.props;Yt(o)&&(o=e.props={}),_n&&!nn(t)&&"object"==typeof t&&en(t[Sn])&&(e.children=xn(t[Sn]())),"string"!=typeof n||nn(bn)||(bn.refs||(bn.refs={}),e.ref=function(e){this.refs[n]=e}.bind(bn)),e.className&&(o.className=e.className),!Yt(t)&&Yt(o.children)&&(o.children=t),14&e.flags&&tn(e.type)&&(e.flags=I(e.type),o&&P(e));var r=e.flags;return 448&r&&Cn(e.type,o),481&r&&wn(o),Pn&&Pn(e),(481&r)>0};var Tn=function(e){function t(){e.apply(this,arguments)}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.shouldComponentUpdate=function(e,t){return Nn(this.props,e)||Nn(this.state,t)},t}(vt),Un=function(e){function t(){e.apply(this,arguments)}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.getChildContext=function(){return this.props.context},t.prototype.render=function(e){return e.children},t}(vt);function In(e,t,n,o){at(_(4,Un,{children:t,context:e.context}),n);var r=t.children;return o&&o.call(r),r}var Dn="a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr circle clipPath defs ellipse g image line linearGradient mask path pattern polygon polyline radialGradient rect stop svg text tspan".split(" ");function En(e){return qt.bind(null,e)}for(var On={},Vn=Dn.length;Vn--;)On[Dn[Vn]]=En(Dn[Vn]);function Mn(e){return e&&e.nodeType?e:!e||e.$UN?null:e.$LI?e.$LI.dom:null}if(Jt&&void 0===window.React){var Ln={Children:gn,Component:vt,DOM:On,EMPTY_OBJ:F,NO_OP:Gt,PropTypes:sn,PureComponent:Tn,__spread:mn,cloneElement:_t,cloneVNode:_t,createClass:Ft,createComponentVNode:_,createElement:qt,createFactory:En,createPortal:ct,createRenderer:ut,createTextVNode:S,createVNode:$,directClone:N,findDOMNode:Mn,getFlagsForElementVnode:I,getNumberStyleValue:Ne,hydrate:qe,isValidElement:an,linkEvent:O,normalizeProps:P,options:E,render:at,unmountComponentAtNode:hn,unstable_renderSubtreeIntoContainer:In,version:kn};window.React=Ln,window.ReactDOM=Ln}function An(){for(var e="",t=0;t<32;t++){var n=16*Math.random()|0;8!==t&&12!==t&&16!==t&&20!==t||(e+="-"),e+=(12===t?4:16===t?3&n|8:n).toString(16)}return e}function Fn(e,t){return 1===e?t:t+"s"}var Rn=function(e){function t(t,n){var o;return(o=e.call(this)||this)._ns="app",o._location=t,o._history=n,o}n(t,e);var o=t.prototype;return o._params=function(){return new URLSearchParams(this._location.search)},o.location=function(e,t){var n=this._params();return void 0===t?n.get(e):(n.set(e,t),this._history.pushState(null,this._ns,"?"+n.toString()),t)},t}(function(){function e(){}return e.prototype.location=function(e,t){throw new Error("implement")},e}());function Wn(){var e=document.getElementById("todoapp");if(!e)throw new Error("todoapp id not found in document");return e}var jn=13,Bn=27,Kn={ALL:"all",COMPLETE:"complete",ACTIVE:"active"},zn=function(){function e(e){void 0===e&&(e=new Rn(location,history)),this._locationStore=e}return e.prototype.filtered=function(e){switch(this.filter){case Kn.ALL:return e;case Kn.COMPLETE:return e.filter(function(e){return!!e.completed});case Kn.ACTIVE:return e.filter(function(e){return!e.completed});default:throw new Error("Unknown filter value: "+String(this.filter))}},t(e,[{key:"filter",get:function(){return this._locationStore.location("todo_filter")||Kn.ALL},set:function(e){return this._locationStore.location("todo_filter",e)}}]),e}(),Hn=function(){function e(e,t){var n=this;void 0===e&&(e={}),this.destroy=function(){n._store.remove(n.id)},this.toggle=function(){n.completed=!n.completed,n._store.saveTodo(n.toJSON())},this._title=e.title||"",this.id=e.id||An(),this.completed=e.completed||!1,this._store=t}return e.prototype.toJSON=function(){return{completed:this.completed,title:this._title,id:this.id}},t(e,[{key:"title",get:function(){return this._title},set:function(e){this._title=e,this._store.saveTodo(this.toJSON())}}]),e}(),Xn=function(){function e(){var e=this;this.todos=[],this._todoFilter=new zn,this.addTodo=function(t){var n=new Hn({title:t},e),o=e.todos.slice(0);o.push(n),e.todos=o,e.notify()},this.toggleAll=function(){var t=e.activeTodoCount>0;e.todos=e.todos.map(function(n,o){return new Hn({title:n.title,id:n.id,completed:t},e)}),e.notify()},this.clearCompleted=function(){for(var t=[],n=[],o=0;o<e.todos.length;o++){var r=e.todos[o];r.completed?n.push(r.id):t.push(r)}e.todos=t,e.notify()}}var n=e.prototype;return n.saveTodo=function(e){var t=this;this.todos=this.todos.map(function(n,o){return n.id===e.id?new Hn(e,t):n}),this.notify()},n.remove=function(e){this.todos=this.todos.filter(function(t){return t.id!==e}),this.notify()},t(e,[{key:"activeTodoCount",get:function(){return this.todos.reduce(function(e,t){return e+(t.completed?0:1)},0)}},{key:"completedCount",get:function(){return this.todos.length-this.activeTodoCount}},{key:"filter",get:function(){return this._todoFilter.filter}},{key:"filteredTodos",get:function(){return this._todoFilter.filtered(this.todos)}}]),e}();function qn(e){var t=e.onInput,n=e.title,o=e.onKeyDown;return lom_h("header",{id:"header"},lom_h("h1",null,"todos"),lom_h("input",{id:"new-todo",placeholder:"What needs to be done?",onInput:t,value:n,onKeyDown:o,autoFocus:!0}))}var Gn=function(e){function t(){for(var t,n,r=arguments.length,i=new Array(r),l=0;l<r;l++)i[l]=arguments[l];return t=n=e.call.apply(e,[this].concat(i))||this,n.state={title:""},n.onInput=function(e){var t=e.target;n.setState({title:t.value})},n.onKeyDown=function(e){var t=n.state.title;if(e.keyCode===jn&&t){e.preventDefault();var o=t.trim();o&&(n.props.addTodo(o),n.setState({title:""}))}},t||o(n)}return n(t,e),t.prototype.render=function(){return qn({onInput:this.onInput,title:this.state.title,onKeyDown:this.onKeyDown})},t}(vt);function Jn(e){var t=e.todo,n=e.editingId,o=e.toggle,r=e.destroy,i=e.beginEdit,l=e.setFocus,a=e.editText,u=e.setEditText,c=e.submit,s=e.onKey,f=n===t.id;return lom_h("li",{className:(t.completed?"completed ":" ")+(f?"editing":"")},lom_h("div",{className:"view"},lom_h("input",{className:"toggle",type:"checkbox",checked:t.completed||0,onClick:o}),lom_h("label",{onDoubleClick:i,onDblClick:i},t.title),lom_h("button",{className:"destroy",onClick:r})),f?lom_h("input",{ref:l,className:"edit",value:n&&a||t.title,onBlur:c,onInput:u,onKeyDown:s}):null)}var Qn=function(e){function t(){for(var t,n,r=arguments.length,i=new Array(r),l=0;l<r;l++)i[l]=arguments[l];return t=n=e.call.apply(e,[this].concat(i))||this,n.state={editingId:null,editText:""},n.beginEdit=function(){n.setState({editText:n.props.todo.title,editingId:n.props.todo.id})},n.setFocus=function(e){e&&setTimeout(function(){return e.focus()},0)},n.setEditText=function(e){n.setState({editText:e.target.value})},n.cancel=function(){n.setState({editingId:null})},n.submit=function(){if(n.state.editingId){var e=n.state.editText;n.setState({editingId:null}),n.props.todo.title=e}},n.onKey=function(e){e.which===Bn?(e.preventDefault(),n.cancel()):e.which===jn&&(e.preventDefault(),n.submit())},t||o(n)}return n(t,e),t.prototype.render=function(){var e=this.props.todo,t=this.state;return Jn({editingId:t.editingId,beginEdit:this.beginEdit,editText:t.editText,submit:this.submit,setEditText:this.setEditText,setFocus:this.setFocus,onKey:this.onKey,todo:e,destroy:e.destroy,toggle:e.toggle})},t}(vt),Yn="all",Zn="active",eo="completed";function to(e){var t=e.filter,n=e.activeTodoCount,o=e.completedCount,r=e.clearCompleted;return n||o?lom_h("footer",{id:"footer"},lom_h("span",{id:"todo-activeTodoCount"},lom_h("strong",null,n)," ",Fn(n,"item")," left"),lom_h("ul",{id:"filters"},lom_h("li",null,lom_h("a",{href:"./?todo_filter=all",className:{selected:t===Yn}},"All"))," ",lom_h("li",null,lom_h("a",{href:"./?todo_filter=active",className:{selected:t===Zn}},"Active"))," ",lom_h("li",null,lom_h("a",{href:"./?todo_filter=completed",className:{selected:t===eo}},"Completed"))),o>0?lom_h("button",{id:"clear-completed",onClick:r},"Clear completed"):null):null}function no(e){var t=e.toggleAll,n=e.activeTodoCount,o=e.filteredTodos,r=e.TodoItemView;return lom_h("section",{id:"main"},lom_h("input",{id:"toggle-all",type:"checkbox",onChange:t,checked:0===n}),lom_h("ul",{id:"todo-list"},o.map(function(e){return lom_h(r,{key:e.id,todo:e})})))}var oo=function(e){function t(t,n){var o;return o=e.call(this,t,n)||this,t.todoRepository.notify=function(){return o.forceUpdate()},o}return n(t,e),t.prototype.render=function(){var e=this.props.todoRepository;return lom_h("div",null,lom_h(Gn,{addTodo:e.addTodo}),e.todos.length?lom_h(no,{toggleAll:e.toggleAll,activeTodoCount:e.activeTodoCount,filteredTodos:e.filteredTodos,TodoItemView:Qn}):null,lom_h(to,{activeTodoCount:e.activeTodoCount,completedCount:e.completedCount,filter:e.filter,clearCompleted:e.clearCompleted}))},t}(vt),ro=new Xn;r.lom_h=qt,at(lom_h(oo,{todoRepository:ro}),Wn())}();
//# sourceMappingURL=bundle.js.map
