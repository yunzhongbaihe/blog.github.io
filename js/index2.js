/**
 * @描述: 博客首页逻辑代码
 * @作者: wuxiaogang
 * @日期: 2018/7/26
 */
var IndexPageTwo = {
    init : function () {
        IndexPageTwo.blogDate = $('#blogDate');
        IndexPageTwo.date.init();
        IndexPageTwo.music.init();
        IndexPageTwo.album.init();
        IndexPageTwo.articles.init();
    },
    date : {
        init : function () {
            IndexPageTwo.blogDate.html(this.getDateData());
            this.runTime();
        },
        getDateData : function () {
            var nowDate = new Date();
            var year = nowDate.getFullYear();
            var month = nowDate.getMonth() + 1;
            var date = nowDate.getDate();
            // var hour = nowDate.getHours();
            // var min = nowDate.getMinutes();
            // var sec = nowDate.getSeconds();
            return year + '-' + this.addZero(month) + '-' + this.addZero(date);
        },
        runTime : function () {
            setInterval(function () {
                IndexPageTwo.blogDate.html(IndexPageTwo.date.getDateData());
            }, 1000);
        },
        addZero : function (num) {
            return num < 10 ? '0' + num : num;
        }
    },
    music : {
        init : function () {
            /* 获取QQ音乐 */
            this.getMusicList();
            this.bindEvent();
        },
        bindEvent : function () {
            var self = this;
            $('#blogMusicList').off('click').on('click', '.blog_play_btn', function () {
                // var songmid = $(this).attr('data-songmid');
                // var albumid = $(this).attr('data-albumid');
                var index = $(this).parents('.blog_music_item').index();
                $(this).parents('.blog_music_item').addClass('active')
                    .siblings().removeClass('active');
                self.getSingerInfo(index);
                self.playMusic(index);
                return false;
            });
        },
        getMusicList : function () {
            /* 最新音乐数据 */
            var url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg' +
                '?g_tk=5381&uin=0&format=json&inCharset=utf-8' +
                '&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&tpl=3&page=detail' +
                '&type=top&topid=27';
            $.ajax({
                url : url,
                type : "get",
                dataType : 'jsonp',
                jsonp : "jsonpCallback",
                scriptCharset : 'GBK',
                success : function (data) {
                    var list = data.songlist;
                    var result = [];
                    if(list && list.length){
                        list = list.slice(0, 10);
                        $.each(list, function (i, item) {
                            result.push({
                                albumid : item.data.albumid, // 获取对应的专辑图片
                                albumname : item.data.albumname, // 专辑名称
                                albumdesc : item.data.albumdesc, // 专辑描述
                                songname : item.data.songname, // 歌曲名称
                                songmid : item.data.songmid, // 播放歌曲ID
                                singerName : item.data.singer[0].name // 歌手
                            });
                        });
                        IndexPageTwo.music.renderListHtml(result);
                    }
                },
                error : function (e) {
                    console.log(e);
                }
            });
        },
        //=> 获取专辑图片
        getPhoto : function (albumId) {
            return "http://imgcache.qq.com/music/photo/album_300/" +
                (albumId % 100) + "/300_albumpic_" + albumId + "_0.jpg";
        },
        //=> 歌曲地址
        getSongSrc : function (songmid) {
            return 'http://ws.stream.qqmusic.qq.com/C100' + songmid + '.m4a?fromtag=0&guid=126548448';
        },
        renderListHtml : function (musicList) {
            this.musicList = musicList;
            var html = '';
            $.each(musicList, function (i, item) {
                html += '<li class="blog_music_item">' +
                    '<div class="textellipsis" title="' + item.songname + '">' + item.songname + '</div>' +
                    '<div class="textellipsis" title="' + item.singerName + '">' + item.singerName + '</div>' +
                    '<div class="blog_play_btn" ' +
                    'data-songmid="' + item.songmid + '" ' +
                    'data-albumid="' + item.albumid + '">点击播放</div>' +
                    '</li>';
            });
            $('#blogMusicList').empty().html(html);
            // this.getSingerInfo(0);
            // this.getLyric(musicList[0].songmid);
            // this.playMusic(0);
            // $('#blogMusicList').find('li:first-child').addClass('active');
        },
        getSingerInfo : function (index) {
            var item = this.musicList[index];
            var defaultImg = '';
            if(!this.getPhoto(item.albumid)){
                defaultImg = 'images/defaultLogo_150_150.png';
            }else{
                defaultImg = this.getPhoto(item.albumid);
            }
            var html = '<img src="' + defaultImg + '" width="150" alt="" ' +
                'onerror="IndexPageTwo.music.onerror(this);">' +
                '<div class="textellipsis"></div>' +
                '<div class="textellipsis">歌手姓名: ' + (item.singerName ? item.singerName : '暂无歌手') + '</div>' +
                '<div class="textellipsis">专辑名称: ' + (item.albumname ? item.albumname : '暂无专辑') + '</div>' +
                '<div class="textellipsis">专辑描述: ' + (item.albumdesc ? item.albumdesc : '暂无描述') + '</div>';
            $('#blogMusicSinger').empty().html(html);
        },
        playMusic : function (index) {
            var songmid = this.musicList[index].songmid;
            var filelink = this.getSongSrc(songmid);
            $('#blogMusicAudio').attr('src', filelink);
            document.getElementById('blogMusicAudio').play();
        },
        getLyric : function (songid) {
            var url = "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg" +
                "?pcachetime=1494070301711" +
                "&songmid=" + songid + "&g_tk=5381" +
                "&loginUin=0&hostUin=0&format=jsonp" +
                "&inCharset=utf8&outCharset=utf-8¬ice=0" +
                "&platform=yqq&needNewCode=0";
            $.ajax({
                url : url,
                type : "get",
                headers : {
                    "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
                    "Accept" : "*/*",
                    "Referer" : "https://y.qq.com/portal/player.html",
                    "Accept-Language" : "zh-CN,zh;q=0.8",
                    "Cookie" : "pgv_pvid=8455821612; ts_uid=1596880404; pgv_pvi=9708980224; yq_index=0; pgv_si=s3191448576; pgv_info=ssid=s8059271672; ts_refer=ADTAGmyqq; yq_playdata=s; ts_last=y.qq.com/portal/player.html; yqq_stat=0; yq_playschange=0; player_exist=1; qqmusic_fromtag=66; yplayer_open=1",
                    "Host" : "c.y.qq.com"
                },
                dataType : 'jsonp',
                jsonpCallback : "MusicJsonCallback",
                success : function (data) {
                    console.log(data);
                },
                error : function (e) {
                    console.log(e);
                }
            });
        },
        onerror : function (obj) {
            obj.src = 'images/defaultLogo_150_150.png';
        }
    },
    album : {
        init : function () {
            var lis = $('#blogAlbumList').find('li');
            var liWidth = lis.eq(0).outerWidth();
            var len = lis.length;
            $('#blogAlbumList').width(liWidth * len);
            //当页面加载状态改变的时候执行function
            document.onreadystatechange = function () {
                //当页面加载状态为完全结束时进入
                if(document.readyState === "complete"){
                    IndexPageTwo.album.slider(liWidth);
                }
            };
        },
        slider : function (liWidth) {
            var timer = null;
            var moveFlag = true;
            // 方向 默认 向左
            var direction = 'left';
            // 移动的距离
            var sliderNum = 0;
            // 获取应该剩余的距离
            var resDistance = liWidth * 3 - 20;
            // 获取相册的总宽度
            var totalAlbumWdith = $('#blogAlbumList').outerWidth();
            function move() {
                if(!moveFlag){
                    clearInterval(timer);
                    return false;
                }
                timer = setInterval(function () {
                    sliderNum += liWidth;
                    // 向左移动已经到头
                    if(totalAlbumWdith - sliderNum < resDistance + liWidth){
                        direction = 'right';
                        sliderNum = -sliderNum;
                    }else if(sliderNum === 0){
                        // 向右已经已经到头
                        direction = 'left';
                        sliderNum = 0;
                    }
                    var runNum = (direction === 'left') ? '-' + sliderNum : sliderNum;
                    $('#blogAlbumList').css({
                        transform : 'translateX(' + runNum + 'px)'
                    });
                }, 3000);
            }

            move();
            document.addEventListener('visibilitychange', function () {
                // 隐藏
                if(document.visibilityState === 'hidden'){
                    moveFlag = false;
                    move();
                }else if(document.visibilityState === 'visible'){
                    // 显示
                    moveFlag = true;
                    move();
                }
            });
        }
    },
    articles : {
        init : function () {
            this.bindEvent();
        },
        bindEvent : function () {
            $('#blogArticlesList').off('click').on('click', '.blog_articles_title', function () {
                $(this).addClass('active').siblings().removeClass('active');
                var randowNum = Math.random() * 1000;
                var iframeSrc = $(this).attr('data-iframe-src') + '?' + randowNum;
                IndexPageTwo.articles.showArticleDetail(iframeSrc);
                return false;
            });
        },
        showArticleDetail : function (src) {
            $('<div></div>').ndialog({
                nodeId : '#blogArticleDetailDlg',
                positionType : 'fixed',
                href : src, //=> 页面来源
                dTitle : '查看文章详情',
                width : 500,
                height : 400,
                isText : true,
                isDestory : true, //=> 是否销毁组件
                isShowBtn : false //=> 是否显示按钮组
            }).ndialog('open');
        }
    }
};
IndexPageTwo.init();