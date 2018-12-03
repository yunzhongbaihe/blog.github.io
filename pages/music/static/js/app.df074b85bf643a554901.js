webpackJsonp([1],{NHnr:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=n("7+uW"),a={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"bottom-nav"},[e("router-link",{staticClass:"home",class:{active:"/main/home"===this.$route.path},attrs:{to:"/main/home"}}),this._v(" "),e("router-link",{staticClass:"search",class:{active:"/main/search"===this.$route.path},attrs:{to:"/main/search"}})],1)},staticRenderFns:[]},i={name:"App",components:{BottomNav:n("VU/8")({name:"BottomNav"},a,!1,null,null,null).exports}},r={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("router-view"),this._v(" "),e("BottomNav"),this._v(" "),e("audio",{attrs:{id:"audioBox",preload:"auto"}},[this._v("您的浏览器不支持Audio标签")])],1)},staticRenderFns:[]},o=n("VU/8")(i,r,!1,null,null,null).exports,l=n("/ocq"),c={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"main-page"},[e("router-view")],1)},staticRenderFns:[]},u=n("VU/8")({name:"Main"},c,!1,null,null,null).exports,d={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"song-classify"},[n("ul",t._l(t.list,function(e){return n("li",{key:e.type,class:{active:Number(t.songType)===e.type}},[n("a",{attrs:{href:"javascript:void(0);"},on:{click:function(n){t.sendTypeToHome(e.type)}}},[t._v(t._s(e.text))])])}))])},staticRenderFns:[]},p={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"song-list"},[n("ul",t._l(t.songList,function(e){return n("li",{key:e.song_id},[n("router-link",{attrs:{to:{path:"/main/play",query:{songId:e.song_id}}}},[t._v(t._s(e.title.replace(/[（）《》]/gi,""))+"\n        "+t._s(e.author)+"\n      ")])],1)}))])},staticRenderFns:[]},h={name:"Home",data:function(){return{songType:1,songId:"",songTingId:"",songList:[]}},mounted:function(){$("html, body, #app").css({width:"auto",height:"auto",overflow:"scroll"}),this.getSongList()},methods:{Server:function(t,e,n){var s=this;$.ajax({url:this.HOME,type:"get",data:t,cache:!1,async:!1,dataType:"jsonp",success:function(t){s[n]=t[e]}})},getSongList:function(){this.Server({method:"baidu.ting.billboard.billList",type:this.songType,size:20,offset:0},"song_list","songList")},showFromSongClassify:function(t){this.songType=t,this.getSongList()}},components:{SongClassify:n("VU/8")({props:["songType"],name:"SongClassify",data:function(){return{list:[{type:1,text:"最新歌曲"},{type:2,text:"热门歌曲"},{type:11,text:"摇滚音乐"},{type:12,text:"爵士音乐"},{type:16,text:"流行音乐"},{type:21,text:"欧美金曲"},{type:22,text:"经典老歌"},{type:23,text:"情歌对唱"},{type:24,text:"影视金曲"},{type:25,text:"网络歌曲"}]}},methods:{sendTypeToHome:function(t){this.$emit("listenSongClassify",t)}}},d,!1,null,null,null).exports,SongList:n("VU/8")({props:["songList"],name:"SongList"},p,!1,null,null,null).exports}},m={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"home-page"},[e("SongClassify",{attrs:{"song-type":this.songType},on:{listenSongClassify:this.showFromSongClassify}}),this._v(" "),e("SongList",{attrs:{"song-list":this.songList}})],1)},staticRenderFns:[]},g=n("VU/8")(h,m,!1,null,null,null).exports,y={render:function(){var t=this.$createElement;return(this._self._c||t)("div",{staticClass:"song-search"},[this._v("search")])},staticRenderFns:[]},f=n("VU/8")({name:"Search"},y,!1,null,null,null).exports,v={name:"SongPlay",data:function(){return{title:"歌曲播放",lrcContent:"",lrcList:[],autoTimer:null,translatey:0}},mounted:function(){this.getLrc(),$("html, body, #app").css({width:"100%",height:"100%",overflow:"hidden"})},methods:{getLrc:function(){var t=this;$.ajax({url:this.HOME,type:"get",data:{method:"baidu.ting.song.lry",songid:this.$route.query.songId},cache:!1,async:!1,dataType:"jsonp",success:function(e){t.title=e.title,t.lrcContent=e.lrcContent,t.getSongPlaySrc(),t.handlerLrc(),t.playing()}})},handlerLrc:function(){var t=this;this.lrcContent.replace(/[\r\n\s&nbsp;]/gim,"").replace(/\[(\d+):(\d+)\.\d+]([^\[]+)?/gim,function(){for(var e=arguments.length,n=Array(e),s=0;s<e;s++)n[s]=arguments[s];var a=n[1],i=n[2],r=n[3];r&&t.lrcList.push({minutes:a,seconds:i,text:r})})},playing:function(){var t=this;clearInterval(t.autoTimer),this.autoTimer=setInterval(function(){var e=$("#audioBox")[0].duration,n=$("#audioBox")[0].currentTime;t.lyricSpondence(e,n),n>=e&&(clearInterval(t.autoTimer),$("#lrcList").find("li").removeClass("active"),$("#lrcList").css("transform","translateY(0)"))},1e3)},getSongPlaySrc:function(){$.ajax({url:this.HOME,type:"get",data:{method:"baidu.ting.song.play",songid:this.$route.query.songId},cache:!1,async:!1,dataType:"jsonp",success:function(t){$("#audioBox").attr("src",t.bitrate.file_link),document.getElementById("audioBox").oncanplay=function(){document.getElementById("audioBox").play()}}})},lyricSpondence:function(t,e){var n=Math.floor(e/60),s=Math.ceil(e-60*n);n<10&&(n="0"+n),s<10&&(s="0"+s);var a=$("#lrcList").find("li").filter('[data-minutes="'+n+'"]').filter('[data-seconds="'+s+'"]');a.length&&(a.addClass("active").siblings().removeClass("active"),a.index()>=8&&(this.translatey-=.6))}}},_={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"song-play"},[n("div",{staticClass:"top"},[n("router-link",{staticClass:"el-icon-arrow-left",attrs:{to:"/main/home"}}),t._v(" "),n("span",[t._v(t._s(t.title))])],1),t._v(" "),n("div",{staticClass:"lrc-list-wrap"},[n("ul",{staticClass:"lrc-list",style:{transform:"translateY("+t.translatey+"rem)"},attrs:{id:"lrcList"}},t._l(t.lrcList,function(e){return n("li",{attrs:{"data-minutes":e.minutes,"data-seconds":e.seconds}},[t._v(t._s(e.text)+"\n      ")])}))])])},staticRenderFns:[]},x=n("VU/8")(v,_,!1,null,null,null).exports;s.default.use(l.a);var C=new l.a({routes:[{path:"/",redirect:"/main"},{path:"/",name:"main",component:u,children:[{path:"/main",redirect:"/main/home"},{path:"/main/home",name:"home",component:g,meta:{keepAlive:!0}},{path:"/main/search",name:"search",component:f,meta:{keepAlive:!1}}]},{path:"/play",redirect:"/main/play"},{path:"/main/play",name:"songPlay",component:x}]}),L=n("zL8q"),S=n.n(L);n("tvR6");s.default.prototype.HOME="http://tingapi.ting.baidu.com/v1/restserver/ting",s.default.use(S.a),s.default.config.productionTip=!1,new s.default({el:"#app",router:C,components:{App:o},template:"<App/>"})},tvR6:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.df074b85bf643a554901.js.map