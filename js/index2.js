/**
 * @描述: 博客首页逻辑代码
 * @作者: wuxiaogang
 * @日期: 2018/7/26
 */
var IndexPageTwo = {
    init : function(){
        IndexPageTwo.blogDate = $('#blogDate');
        IndexPageTwo.date.init();
        IndexPageTwo.music.init();
    },
    date : {
        init : function(){
            IndexPageTwo.blogDate.html(this.getDateData());
            this.runTime();
        },
        getDateData : function(){
            var nowDate = new Date();
            var year = nowDate.getFullYear();
            var month = nowDate.getMonth() + 1;
            var date = nowDate.getDate();
            var hour = nowDate.getHours();
            var min = nowDate.getMinutes();
            var sec = nowDate.getSeconds();
            return year + '-' + this.addZero(month) + '-' + this.addZero(date) + ' ' +
                this.addZero(hour) + ':' + this.addZero(min) + ':' + this.addZero(sec);
        },
        runTime : function(){
            setInterval(function(){
                IndexPageTwo.blogDate.html(IndexPageTwo.date.getDateData());
            }, 1000);
        },
        addZero : function(num){
            return num < 10 ? '0' + num : num;
        }
    },
    music : {
        init : function(){
            /* 获取QQ音乐 */
            this.getMusicList();
            this.bindEvent();
        },
        bindEvent : function(){
            var self = this;
            $('#blogMusicList').off('click').on('click', '.blog_play_btn', function(){
                var songid = $(this).attr('data-songid');
                var tinguid = $(this).attr('data-tinguid');
                $(this).parents('.blog_music_item').addClass('active')
                    .siblings().removeClass('active');
                self.getSingerInfo(tinguid);
                self.getLyric(songid);
                self.playMusic(songid);
                return false;
            });

            $('#blogMusicSinger').off('click').on('click', '.blog_singer_intro', function(){
                var imageSrc = $(this).siblings('img').attr('src');
                var intor = '<img src="' + imageSrc + '" width="150px" style="float:left;"/>' + $.trim($(this).find('input').val());
                $('<div></div>').ndialog({
                    dTitle : '查看歌手百科信息',
                    width : 400,
                    height : 300,
                    isDestory : true,
                    data : intor,
                    isShowBtn : false,
                    isText : true
                }).ndialog('open');
                return false;
            });
        },
        getMusicList : function(){
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
                success : function(data){
                    var list = data.songlist;
                    var result = [];
                    if(list && list.length){
                        list = list.slice(0, 10);
                        $.each(list, function(i, item){
                            result.push({
                                albumid : item.data.albumid, // 获取对应的专辑图片
                                albumname : item.data.albumname, // 专辑名称
                                albumdesc : item.data.albumdesc, // 专辑描述
                                songname : item.data.songname, // 歌曲名称
                                songmid : item.data.songmid, // 播放歌曲ID
                                songid : item.data.songid,
                                singerName : item.data.singer[0].name // 歌手
                            });
                        });
                        IndexPageTwo.music.renderListHtml(result);
                    }
                    console.log(data);
                },
                error : function(e){
                    console.log(e);
                }
            });
        },
        //=> 获取专辑图片
        getPhoto : function(albumId){
            return "http://imgcache.qq.com/music/photo/album_300/" +
                (albumId % 100) + "/300_albumpic_" + albumId + "_0.jpg";
        },
        //=> 歌曲地址
        getSongSrc : function(songmid){
            return 'http://ws.stream.qqmusic.qq.com/C100' + songmid + '.m4a?fromtag=0&guid=126548448';
        },
        renderListHtml : function(musicList){
            this.musicList = musicList;
            var html = '';
            $.each(musicList, function(i, item){
                html += '<li class="blog_music_item">' +
                    '<div class="textellipsis" title="' + item.songname + '">' + item.songname + '</div>' +
                    '<div class="textellipsis" title="' + item.singerName + '">' + item.singerName + '</div>' +
                    '<div class="blog_play_btn" ' +
                    'data-songmid="' + item.songmid + '" ' +
                    'data-songid="' + item.songid + '"' +
                    'data-albumid="' + item.albumid + '">查看</div>' +
                    '</li>';
            });
            $('#blogMusicList').empty().html(html);
            this.getSingerInfo(0);
            this.getLyric(musicList[0].songid);
            // this.playMusic(musicList[0].songid);
            $('#blogMusicList').find('li:first-child').addClass('active');
        },
        getSingerInfo : function(index){
            var item = this.musicList[index];
            var defaultImg = '';
            if(!this.getPhoto(item.albumid)){
                defaultImg = 'images/defaultLogo_150_150.png';
            }else{
                defaultImg = this.getPhoto(item.albumid);
            }
            var html = '<img src="' + defaultImg + '" width="150" alt="">' +
                '<div class="textellipsis"></div>' +
                '<div class="textellipsis">歌手姓名: ' + item.singerName + '</div>' +
                '<div class="textellipsis">专辑名称: ' + item.albumname + '</div>' +
                '<div class="textellipsis">专辑描述: ' + (item.albumdesc ? item.albumdesc : '暂无') + '</div>';
            $('#blogMusicSinger').empty().html(html);
        },
        playMusic : function(songid){
            $.ajax({
                url : this.src,
                type : 'get',
                cache : false,
                data : {
                    method : 'baidu.ting.song.play',
                    songid : songid
                },
                dataType : 'jsonp',
                success : function(data){
                    var filelink = data.bitrate.file_link;
                    $('#blogMusicAudio').attr('src', filelink);
                    document.getElementById('blogMusicAudio').play();
                },
                error : function(e){
                    console.error(e);
                }
            });
        },
        getLyric : function(songid){
            var url = "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg" +
                "?pcachetime=1494070301711" +
                "&songmid=" + songid + "&g_tk=5381" +
                "&loginUin=0&hostUin=0&format=jsonp" +
                "&inCharset=utf8&outCharset=utf-8¬ice=0" +
                "&platform=yqq&needNewCode=0";
            $.ajax({
                url : url,
                type : "get",
                dataType : 'json',
                // jsonp : "MusicJsonCallback",
                success : function(data){

                    console.log(data);
                },
                error : function(e){
                    console.log(e);
                }
            });
            // $.ajax({
            //     url : this.src,
            //     type : 'get',
            //     cache : false,
            //     data : {
            //         method : 'baidu.ting.song.lry',
            //         songid : songid
            //     },
            //     dataType : 'jsonp',
            //     success : function(data){
            //         var result = data.lrcContent.replace(/\[/g, '').replace('ti', '')
            //             .replace('ar', '').replace('al', '').replace('by', '')
            //             .replace('offset', '')
            //             .replace(/\d+/g, '').replace(/:/g, '').replace(/\./g, '').replace(/]/g, '')
            //             .split('\n');
            //         var html = '<li>' + data.title + '</li>';
            //         $.each(result, function(i, item){
            //             if(item !== "\r" && item){
            //                 html += '<li>' + item + '</li>';
            //             }
            //         });
            //         $('#blogMusicPlay').empty().html(html).scrollTop(0);
            //     },
            //     error : function(e){
            //         console.error(e);
            //     }
            // });
        }
    }
};
IndexPageTwo.init();