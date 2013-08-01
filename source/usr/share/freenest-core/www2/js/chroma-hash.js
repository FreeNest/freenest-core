/*
 * Chroma-Hash : A sexy, secure visualization of password field input
 * http://github.com/mattt/Chroma-Hash/
 *
 * Copyright (c) 2009 Mattt Thompson
 * Licensed under the MIT licenses.
 * 
 * Inspired by HashMask by Chris Dary
 * http://lab.arc90.com/2009/07/09/hashmask-another-more-secure-experiment-in-password-masking/
 */

(function($){
  $.fn.extend({
    chromaHash: function(options) {

      var defaults = {
          bars: 3,
          salt: "7be82b35cb0199120eea35a4507c9acf",
          minimum: 6
      };

      var options = $.extend(defaults, options);

      return this.each(function() {

        var o     = options;
        var obj   = $(this);

        if(o.bars < 1 || o.bars > 4) {
          console.log("[Warning] Chroma-Hash expects a number parameter between 1 and 4, given " + o.bars);
        }

        var colors = ["primary", "secondary", "tertiary", "quaternary"].slice(0, o.bars);

        var chromaHashesForElement = function(e) {
          id = $(e).attr('id');
          return $("label.chroma-hash").filter(function(l) {
                      return $(this).attr('for') == id;
                  });
        };

        var trigger = function(e) {
          var input = $(this);
          
          if(input.val() == "" ){
            chromaHashesForElement(this).animate({backgroundColor: "#ffffff", opacity: 0});
            return;
          }

          position   = input.position();
          height     = input.outerHeight();
          width      = input.outerWidth();

          chromaHashesForElement(this).each(function(i) {
            properties = {
                          position:   'absolute',
                          opacity:     1.0,
                          left:       position.left + width - 1,
                          top:        position.top + 7 + "px",
                          // FREENEST
                          // edited the height
                          // also added border-radius to the actual css file to get rounded effect
                          height:     height * 0.3 + "px", //- 2 + "px",
                          width:      8 + "px",
                          margin:     0 + "px",
                          marginLeft: -8 * (++i) + "px"
                        }
            if($.browser.safari){
              properties.marginTop = 3 + "px";
            }
            else{
              properties.marginTop = 1 + "px";
            }
            $(this).css(properties);
          });

          var id     = input.attr('id');
          var md5    = hex_md5('' + input.val() + ':' + o.salt);
          var colors = md5.match(/([\dABCDEF]{6})/ig);
          $(".chroma-hash").stop();

          if(input.val().length < o.minimum) {
            chromaHashesForElement(this).each(function(i) {
              var g = (parseInt(colors[i], 16) % 0xF).toString(16);
              $(this).animate({backgroundColor:"#" + g + g + g});
            });
          }
          else {
            chromaHashesForElement(this).each(function(i) {
              var color = parseInt(colors[i], 16);
              var red   = (color >> 16) & 255;
              var green = (color >> 8) & 255;
              var blue  = color & 255;
              var hex   = $.map([red, green, blue], function(c, i) {
                return ((c >> 4) * 0x10).toString(16);
              }).join('');

              $(this).animate({backgroundColor:"#" + hex});
            });
          }
        };

        obj.each(function(e) {
          for(c in colors) {
            $(this).after('<label for="' + $(this).attr('id') + '" class="' + colors[c] + ' chroma-hash"></label>');
          }
          chromaHashesForElement(this).css({backgroundColor: "#FFF", opacity: 0})

          $(this).bind('keyup', trigger).bind('blur', trigger);
        
        });


          /*
           * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
           * Digest Algorithm, as defined in RFC 1321.
           * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
           * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
           * Distributed under the BSD License
           * See http://pajhome.org.uk/crypt/md5 for more info.
          */
          var hexcase=0;var b64pad="";function hex_md5(A){return rstr2hex(rstr_md5(str2rstr_utf8(A)));}function b64_md5(A){return rstr2b64(rstr_md5(str2rstr_utf8(A)));}function any_md5(A,B){return rstr2any(rstr_md5(str2rstr_utf8(A)),B);}function hex_hmac_md5(A,B){return rstr2hex(rstr_hmac_md5(str2rstr_utf8(A),str2rstr_utf8(B)));}function b64_hmac_md5(A,B){return rstr2b64(rstr_hmac_md5(str2rstr_utf8(A),str2rstr_utf8(B)));}function any_hmac_md5(A,C,B){return rstr2any(rstr_hmac_md5(str2rstr_utf8(A),str2rstr_utf8(C)),B);}function rstr_md5(A){return binl2rstr(binl_md5(rstr2binl(A),A.length*8));}function rstr_hmac_md5(C,F){var E=rstr2binl(C);if(E.length>16){E=binl_md5(E,C.length*8);}var A=Array(16),D=Array(16);for(var B=0;B<16;B++){A[B]=E[B]^909522486;D[B]=E[B]^1549556828;}var G=binl_md5(A.concat(rstr2binl(F)),512+F.length*8);return binl2rstr(binl_md5(D.concat(G),512+128));}function rstr2hex(C){try{hexcase;}catch(F){hexcase=0;}var E=hexcase?"0123456789ABCDEF":"0123456789abcdef";var B="";var A;for(var D=0;D<C.length;D++){A=C.charCodeAt(D);B+=E.charAt((A>>>4)&15)+E.charAt(A&15);}return B;}function rstr2b64(C){try{b64pad;}catch(G){b64pad="";}var F="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var B="";var A=C.length;for(var E=0;E<A;E+=3){var H=(C.charCodeAt(E)<<16)|(E+1<A?C.charCodeAt(E+1)<<8:0)|(E+2<A?C.charCodeAt(E+2):0);for(var D=0;D<4;D++){if(E*8+D*6>C.length*8){B+=b64pad;}else{B+=F.charAt((H>>>6*(3-D))&63);}}}return B;}function rstr2any(K,C){var B=C.length;var J,F,A,L,E;var I=Array(Math.ceil(K.length/2));for(J=0;J<I.length;J++){I[J]=(K.charCodeAt(J*2)<<8)|K.charCodeAt(J*2+1);}var H=Math.ceil(K.length*8/(Math.log(C.length)/Math.log(2)));var G=Array(H);for(F=0;F<H;F++){E=Array();L=0;for(J=0;J<I.length;J++){L=(L<<16)+I[J];A=Math.floor(L/B);L-=A*B;if(E.length>0||A>0){E[E.length]=A;}}G[F]=L;I=E;}var D="";for(J=G.length-1;J>=0;J--){D+=C.charAt(G[J]);}return D;}function str2rstr_utf8(C){var B="";var D=-1;var A,E;while(++D<C.length){A=C.charCodeAt(D);E=D+1<C.length?C.charCodeAt(D+1):0;if(55296<=A&&A<=56319&&56320<=E&&E<=57343){A=65536+((A&1023)<<10)+(E&1023);D++;}if(A<=127){B+=String.fromCharCode(A);}else{if(A<=2047){B+=String.fromCharCode(192|((A>>>6)&31),128|(A&63));}else{if(A<=65535){B+=String.fromCharCode(224|((A>>>12)&15),128|((A>>>6)&63),128|(A&63));}else{if(A<=2097151){B+=String.fromCharCode(240|((A>>>18)&7),128|((A>>>12)&63),128|((A>>>6)&63),128|(A&63));}}}}}return B;}function str2rstr_utf16le(B){var A="";for(var C=0;C<B.length;C++){A+=String.fromCharCode(B.charCodeAt(C)&255,(B.charCodeAt(C)>>>8)&255);}return A;}function str2rstr_utf16be(B){var A="";for(var C=0;C<B.length;C++){A+=String.fromCharCode((B.charCodeAt(C)>>>8)&255,B.charCodeAt(C)&255);}return A;}function rstr2binl(B){var A=Array(B.length>>2);for(var C=0;C<A.length;C++){A[C]=0;}for(var C=0;C<B.length*8;C+=8){A[C>>5]|=(B.charCodeAt(C/8)&255)<<(C%32);}return A;}function binl2rstr(B){var A="";for(var C=0;C<B.length*32;C+=8){A+=String.fromCharCode((B[C>>5]>>>(C%32))&255);}return A;}function binl_md5(K,F){K[F>>5]|=128<<((F)%32);K[(((F+64)>>>9)<<4)+14]=F;var J=1732584193;var I=-271733879;var H=-1732584194;var G=271733878;for(var C=0;C<K.length;C+=16){var E=J;var D=I;var B=H;var A=G;J=md5_ff(J,I,H,G,K[C+0],7,-680876936);G=md5_ff(G,J,I,H,K[C+1],12,-389564586);H=md5_ff(H,G,J,I,K[C+2],17,606105819);I=md5_ff(I,H,G,J,K[C+3],22,-1044525330);J=md5_ff(J,I,H,G,K[C+4],7,-176418897);G=md5_ff(G,J,I,H,K[C+5],12,1200080426);H=md5_ff(H,G,J,I,K[C+6],17,-1473231341);I=md5_ff(I,H,G,J,K[C+7],22,-45705983);J=md5_ff(J,I,H,G,K[C+8],7,1770035416);G=md5_ff(G,J,I,H,K[C+9],12,-1958414417);H=md5_ff(H,G,J,I,K[C+10],17,-42063);I=md5_ff(I,H,G,J,K[C+11],22,-1990404162);J=md5_ff(J,I,H,G,K[C+12],7,1804603682);G=md5_ff(G,J,I,H,K[C+13],12,-40341101);H=md5_ff(H,G,J,I,K[C+14],17,-1502002290);I=md5_ff(I,H,G,J,K[C+15],22,1236535329);J=md5_gg(J,I,H,G,K[C+1],5,-165796510);G=md5_gg(G,J,I,H,K[C+6],9,-1069501632);H=md5_gg(H,G,J,I,K[C+11],14,643717713);I=md5_gg(I,H,G,J,K[C+0],20,-373897302);J=md5_gg(J,I,H,G,K[C+5],5,-701558691);G=md5_gg(G,J,I,H,K[C+10],9,38016083);H=md5_gg(H,G,J,I,K[C+15],14,-660478335);I=md5_gg(I,H,G,J,K[C+4],20,-405537848);J=md5_gg(J,I,H,G,K[C+9],5,568446438);G=md5_gg(G,J,I,H,K[C+14],9,-1019803690);H=md5_gg(H,G,J,I,K[C+3],14,-187363961);I=md5_gg(I,H,G,J,K[C+8],20,1163531501);J=md5_gg(J,I,H,G,K[C+13],5,-1444681467);G=md5_gg(G,J,I,H,K[C+2],9,-51403784);H=md5_gg(H,G,J,I,K[C+7],14,1735328473);I=md5_gg(I,H,G,J,K[C+12],20,-1926607734);J=md5_hh(J,I,H,G,K[C+5],4,-378558);G=md5_hh(G,J,I,H,K[C+8],11,-2022574463);H=md5_hh(H,G,J,I,K[C+11],16,1839030562);I=md5_hh(I,H,G,J,K[C+14],23,-35309556);J=md5_hh(J,I,H,G,K[C+1],4,-1530992060);G=md5_hh(G,J,I,H,K[C+4],11,1272893353);H=md5_hh(H,G,J,I,K[C+7],16,-155497632);I=md5_hh(I,H,G,J,K[C+10],23,-1094730640);J=md5_hh(J,I,H,G,K[C+13],4,681279174);G=md5_hh(G,J,I,H,K[C+0],11,-358537222);H=md5_hh(H,G,J,I,K[C+3],16,-722521979);I=md5_hh(I,H,G,J,K[C+6],23,76029189);J=md5_hh(J,I,H,G,K[C+9],4,-640364487);G=md5_hh(G,J,I,H,K[C+12],11,-421815835);H=md5_hh(H,G,J,I,K[C+15],16,530742520);I=md5_hh(I,H,G,J,K[C+2],23,-995338651);J=md5_ii(J,I,H,G,K[C+0],6,-198630844);G=md5_ii(G,J,I,H,K[C+7],10,1126891415);H=md5_ii(H,G,J,I,K[C+14],15,-1416354905);I=md5_ii(I,H,G,J,K[C+5],21,-57434055);J=md5_ii(J,I,H,G,K[C+12],6,1700485571);G=md5_ii(G,J,I,H,K[C+3],10,-1894986606);H=md5_ii(H,G,J,I,K[C+10],15,-1051523);I=md5_ii(I,H,G,J,K[C+1],21,-2054922799);J=md5_ii(J,I,H,G,K[C+8],6,1873313359);G=md5_ii(G,J,I,H,K[C+15],10,-30611744);H=md5_ii(H,G,J,I,K[C+6],15,-1560198380);I=md5_ii(I,H,G,J,K[C+13],21,1309151649);J=md5_ii(J,I,H,G,K[C+4],6,-145523070);G=md5_ii(G,J,I,H,K[C+11],10,-1120210379);H=md5_ii(H,G,J,I,K[C+2],15,718787259);I=md5_ii(I,H,G,J,K[C+9],21,-343485551);J=safe_add(J,E);I=safe_add(I,D);H=safe_add(H,B);G=safe_add(G,A);}return Array(J,I,H,G);}function md5_cmn(F,C,B,A,E,D){return safe_add(bit_rol(safe_add(safe_add(C,F),safe_add(A,D)),E),B);}function md5_ff(C,B,G,F,A,E,D){return md5_cmn((B&G)|((~B)&F),C,B,A,E,D);}function md5_gg(C,B,G,F,A,E,D){return md5_cmn((B&F)|(G&(~F)),C,B,A,E,D);}function md5_hh(C,B,G,F,A,E,D){return md5_cmn(B^G^F,C,B,A,E,D);}function md5_ii(C,B,G,F,A,E,D){return md5_cmn(G^(B|(~F)),C,B,A,E,D);}function safe_add(A,D){var C=(A&65535)+(D&65535);var B=(A>>16)+(D>>16)+(C>>16);return(B<<16)|(C&65535);}function bit_rol(A,B){return(A<<B)|(A>>>(32-B));}
        });
      }
    });
})(jQuery);

/*
 * jQuery Color Animations
 * Copyright 2007 John Resig
 * Released under the MIT and GPL licenses.
 */

// FREENEST
// Grabbed a new version (jquery color) from https://github.com/jquery/jquery-color and compressed using YUI
(function(o,c){var j="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color outlineColor".split(" "),g=/^([\-+])=\s*(\d+\.?\d*)/,f=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,parse:function(p){return[p[1],p[2],p[3],p[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,parse:function(p){return[2.55*p[1],2.55*p[2],2.55*p[3],p[4]]}},{re:/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,parse:function(p){return[parseInt(p[1],16),parseInt(p[2],16),parseInt(p[3],16)]}},{re:/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,parse:function(p){return[parseInt(p[1]+p[1],16),parseInt(p[2]+p[2],16),parseInt(p[3]+p[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(p){return[p[1],p[2]/100,p[3]/100,p[4]]}}],d=o.Color=function(q,r,p,s){return new o.Color.fn.parse(q,r,p,s)},i={rgba:{cache:"_rgba",props:{red:{idx:0,type:"byte",empty:true},green:{idx:1,type:"byte",empty:true},blue:{idx:2,type:"byte",empty:true},alpha:{idx:3,type:"percent",def:1}}},hsla:{cache:"_hsla",props:{hue:{idx:0,type:"degrees",empty:true},saturation:{idx:1,type:"percent",empty:true},lightness:{idx:2,type:"percent",empty:true}}}},n={"byte":{floor:true,min:0,max:255},percent:{min:0,max:1},degrees:{mod:360,floor:true}},l=i.rgba.props,m=d.support={},a,k=o.each;i.hsla.props.alpha=l.alpha;function h(r,t,q){var p=n[t.type]||{},s=t.empty||q;if(s&&r==null){return null}if(t.def&&r==null){return t.def}if(p.floor){r=~~r}else{r=parseFloat(r)}if(r==null||isNaN(r)){return t.def}if(p.mod){r=r%p.mod;return r<0?p.mod+r:r}return p.min>r?p.min:p.max<r?p.max:r}function e(p){var r=d(),q=r._rgba=[];p=p.toLowerCase();k(f,function(x,y){var w=y.re.exec(p),v=w&&y.parse(w),u,t=y.space||"rgba",s=i[t].cache;if(v){u=r[t](v);r[s]=u[s];q=r._rgba=u._rgba;return false}});if(q.length!==0){if(Math.max.apply(Math,q)===0){o.extend(q,a.transparent)}return r}if(p=a[p]){return p}}d.fn=d.prototype={constructor:d,parse:function(w,u,p,v){if(w===c){this._rgba=[null,null,null,null];return this}if(w instanceof o||w.nodeType){w=w instanceof o?w.css(u):o(w).css(u);u=c}var t=this,r=o.type(w),q=this._rgba=[],s;if(u!==c){w=[w,u,p,v];r="array"}if(r==="string"){return this.parse(e(w)||a._default)}if(r==="array"){k(l,function(x,y){q[y.idx]=h(w[y.idx],y)});return this}if(r==="object"){if(w instanceof d){k(i,function(x,y){if(w[y.cache]){t[y.cache]=w[y.cache].slice()}})}else{k(i,function(x,y){k(y.props,function(A,B){var z=y.cache;if(!t[z]&&y.to){if(w[A]==null||A==="alpha"){return}t[z]=y.to(t._rgba)}t[z][B.idx]=h(w[A],B,true)})})}return this}},is:function(r){var q=d(r),s=true,p=this;k(i,function(t,v){var u=q[v.cache],w;if(u){w=p[v.cache]||v.to&&v.to(p._rgba)||[];k(v.props,function(x,y){if(u[y.idx]!=null){s=(u[y.idx]===w[y.idx]);return s}})}return s});return s},_space:function(){var p=[],q=this;k(i,function(r,s){if(q[s.cache]){p.push(r)}});return p.pop()},transition:function(q,v){var r=d(q),s=r._space(),t=i[s],u=this[t.cache]||t.to(this._rgba),p=u.slice();r=r[t.cache];k(t.props,function(z,B){var y=B.idx,x=u[y],w=r[y],A=n[B.type]||{};if(w===null){return}if(x===null){p[y]=w}else{if(A.mod){if(w-x>A.mod/2){x+=A.mod}else{if(x-w>A.mod/2){x-=A.mod}}}p[B.idx]=h((w-x)*v+x,B)}});return this[s](p)},blend:function(s){if(this._rgba[3]===1){return this}var r=this._rgba.slice(),q=r.pop(),p=d(s)._rgba;return d(o.map(r,function(t,u){return(1-q)*p[u]+q*t}))},toRgbaString:function(){var q="rgba(",p=o.map(this._rgba,function(r,s){return r==null?(s>2?1:0):r});if(p[3]===1){p.pop();q="rgb("}return q+p.join(",")+")"},toHslaString:function(){var q="hsla(",p=o.map(this.hsla(),function(r,s){if(r==null){r=s>2?1:0}if(s&&s<3){r=Math.round(r*100)+"%"}return r});if(p[3]===1){p.pop();q="hsl("}return q+p.join(",")+")"},toHexString:function(p){var q=this._rgba.slice(),r=q.pop();if(p){q.push(~~(r*255))}return"#"+o.map(q,function(s,t){s=(s||0).toString(16);return s.length===1?"0"+s:s}).join("")},toString:function(){return this._rgba[3]===0?"transparent":this.toRgbaString()}};d.fn.parse.prototype=d.fn;function b(t,s,r){r=(r+1)%1;if(r*6<1){return t+(s-t)*6*r}if(r*2<1){return s}if(r*3<2){return t+(s-t)*((2/3)-r)*6}return t}i.hsla.to=function(t){if(t[0]==null||t[1]==null||t[2]==null){return[null,null,null,t[3]]}var p=t[0]/255,w=t[1]/255,x=t[2]/255,z=t[3],y=Math.max(p,w,x),u=Math.min(p,w,x),A=y-u,B=y+u,q=B*0.5,v,C;if(u===y){v=0}else{if(p===y){v=(60*(w-x)/A)+360}else{if(w===y){v=(60*(x-p)/A)+120}else{v=(60*(p-w)/A)+240}}}if(q===0||q===1){C=q}else{if(q<=0.5){C=A/B}else{C=A/(2-B)}}return[Math.round(v)%360,C,q,z==null?1:z]};i.hsla.from=function(v){if(v[0]==null||v[1]==null||v[2]==null){return[null,null,null,v[3]]}var y=v[0]/360,C=v[1],x=v[2],B=v[3],u=x<=0.5?x*(1+C):x+C-x*C,w=2*x-u,t,z,A;return[Math.round(b(w,u,y+(1/3))*255),Math.round(b(w,u,y)*255),Math.round(b(w,u,y-(1/3))*255),B]};k(i,function(q,s){var r=s.props,p=s.cache,u=s.to,t=s.from;d.fn[q]=function(z){if(u&&!this[p]){this[p]=u(this._rgba)}if(z===c){return this[p].slice()}var y=o.type(z),v=(y==="array"||y==="object")?z:arguments,x=this[p].slice(),w;k(r,function(A,C){var B=v[y==="object"?A:C.idx];if(B==null){B=x[C.idx]}x[C.idx]=h(B,C)});if(t){w=d(t(x));w[p]=x;return w}else{return d(x)}};k(r,function(v,w){if(d.fn[v]){return}d.fn[v]=function(A){var C=o.type(A),z=(v==="alpha"?(this._hsla?"hsla":"rgba"):q),y=this[z](),B=y[w.idx],x;if(C==="undefined"){return B}if(C==="function"){A=A.call(this,B);C=o.type(A)}if(A==null&&w.empty){return this}if(C==="string"){x=g.exec(A);if(x){A=B+parseFloat(x[2])*(x[1]==="+"?1:-1)}}y[w.idx]=A;return this[z](y)}})});k(j,function(p,q){o.cssHooks[q]={set:function(u,v){var s,r,t;if(o.type(v)!=="string"||(s=e(v))){v=d(s||v);if(!m.rgba&&v._rgba[3]!==1){t=q==="backgroundColor"?u.parentNode:u;do{r=o.curCSS(t,"backgroundColor")}while((r===""||r==="transparent")&&(t=t.parentNode)&&t.style);v=v.blend(r&&r!=="transparent"?r:"_default")}v=v.toRgbaString()}try{u.style[q]=v}catch(v){}}};o.fx.step[q]=function(r){if(!r.colorInit){r.start=d(r.elem,q);r.end=d(r.end);r.colorInit=true}o.cssHooks[q].set(r.elem,r.start.transition(r.end,r.pos))}});o(function(){var q=document.createElement("div"),p=q.style;p.cssText="background-color:rgba(1,1,1,.5)";m.rgba=p.backgroundColor.indexOf("rgba")>-1});a=o.Color.names={aqua:"#00ffff",azure:"#f0ffff",beige:"#f5f5dc",black:"#000000",blue:"#0000ff",brown:"#a52a2a",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgrey:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkviolet:"#9400d3",fuchsia:"#ff00ff",gold:"#ffd700",green:"#008000",indigo:"#4b0082",khaki:"#f0e68c",lightblue:"#add8e6",lightcyan:"#e0ffff",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightyellow:"#ffffe0",lime:"#00ff00",magenta:"#ff00ff",maroon:"#800000",navy:"#000080",olive:"#808000",orange:"#ffa500",pink:"#ffc0cb",purple:"#800080",violet:"#800080",red:"#ff0000",silver:"#c0c0c0",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}})(jQuery);

