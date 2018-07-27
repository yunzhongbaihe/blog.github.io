/**
 * @描述: 博客首页逻辑代码
 * @作者: wuxiaogang
 * @日期: 2018/7/26
 */
function ajax(params){
    params = params || {};
    params.data = params.data || {};
    var json = params.jsonp ? jsonp(params) : json(params);

    // jsonp请求
    function jsonp(params){
        //创建script标签并加入到页面中
        var callbackName = params.jsonp;
        var head = document.getElementsByTagName('head')[0];
        // 设置传递给后台的回调参数名
        params.data['callback'] = callbackName;
        var data = formatParams(params.data);
        var script = document.createElement('script');
        head.appendChild(script);
        //创建jsonp回调函数
        window[callbackName] = function(json){
            head.removeChild(script);
            clearTimeout(script.timer);
            window[callbackName] = null;
            params.success && params.success(json);
        };
        //发送请求
        script.src = params.url + '?' + data;
        //为了得知此次请求是否成功，设置超时处理
        if(params.time){
            script.timer = setTimeout(function(){
                window[callbackName] = null;
                head.removeChild(script);
                params.error && params.error({
                    message : '超时'
                });
            }, time);
        }
    }

    //格式化参数
    function formatParams(data){
        var arr = [];
        for(var name in data){
            arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
        }
        // 添加一个随机数，防止缓存
        arr.push('v=' + random());
        return arr.join('&');
    }

    // 获取随机数
    function random(){
        return Math.floor(Math.random() * 10000 + 500);
    }
}

var IndexPage = {
    init : function(){
        IndexPage.blogDate = $('#blogDate');
        IndexPage.date.init();
        IndexPage.music.init();
    },
    date : {
        init : function(){
            IndexPage.blogDate.html(this.getDateData());
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
                IndexPage.blogDate.html(IndexPage.date.getDateData());
            }, 1000);
        },
        addZero : function(num){
            return num < 10 ? '0' + num : num;
        }
    },
    music : {
        init : function(){
            this.src = 'http://tingapi.ting.baidu.com/v1/restserver/ting';
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
            ajax({
                url : this.src,
                jsonp : 'jsonpCallback',
                data : {
                    method : 'baidu.ting.billboard.billList',
                    type : 1,
                    offset : 0,
                    size : 10
                },
                success : function(res){
                    console.log(res);
                },
                error : function(error){
                }  // 请求失败的回调函数
            });
            // $.ajax({
            //     url : this.src,
            //     type : 'get',
            //     cache : false,
            //     data : {
            //         method : 'baidu.ting.billboard.billList',
            //         type : 1,
            //         offset : 0,
            //         size : 10
            //     },
            //     dataType : 'jsonp',
            //     success : function(data){
            //         var list = data.song_list;
            //         var result = [];
            //         if(list && list.length){
            //             $.each(list, function(i, item){
            //                 result.push({
            //                     songid : item.song_id,
            //                     title : item.title,
            //                     tinguid : item.ting_uid,
            //                     author : item.author
            //                 });
            //             });
            //             IndexPage.music.renderListHtml(result);
            //         }
            //     },
            //     error : function(e){
            //         console.log(e);
            //     }
            // });
        },
        renderListHtml : function(musicList){
            var html = '';
            $.each(musicList, function(i, item){
                html += '<li class="blog_music_item">' +
                    '<div class="textellipsis" title="' + item.title + '">' + item.title + '</div>' +
                    '<div class="textellipsis" title="' + item.author + '">' + item.author + '</div>' +
                    '<div class="blog_play_btn" ' +
                    'data-songid="' + item.songid + '" ' +
                    'data-tinguid="' + item.tinguid + '">查看</div>' +
                    '</li>';
            });
            $('#blogMusicList').empty().html(html);
            this.getSingerInfo(musicList[0].tinguid);
            this.getLyric(musicList[0].songid);
            this.playMusic(musicList[0].songid);
            $('#blogMusicList').find('li:first-child').addClass('active');
        },
        getSingerInfo : function(tinguid){
            $.ajax({
                url : this.src,
                type : 'get',
                data : {
                    method : 'baidu.ting.artist.getInfo',
                    tinguid : tinguid
                },
                dataType : 'jsonp',
                success : function(data){
                    var defaultImg = '';
                    if(!data.avatar_s1000){
                        defaultImg = 'images/defaultLogo_150_150.png';
                    }else{
                        defaultImg = data.avatar_s1000;
                    }
                    var html = '<img src="' + defaultImg + '" width="150" alt="">' +
                        '<div>国家: ' + data.country + '</div>' +
                        '<div>公司: ' + (data.company ? data.company : '暂无') + '</div>' +
                        '<div class="textellipsis">名称: ' + data.name + '</div>' +
                        '<div class="textellipsis blog_singer_intro" data-title="' + data.name + '百科">百科: ' + data.intro + '<input type="hidden" value="' + data.intro + '"></div>';
                    $('#blogMusicSinger').empty().html(html);
                },
                error : function(e){
                    console.error(e);
                }
            });
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
            $.ajax({
                url : this.src,
                type : 'get',
                cache : false,
                data : {
                    method : 'baidu.ting.song.lry',
                    songid : songid
                },
                dataType : 'jsonp',
                success : function(data){
                    var result = data.lrcContent.replace(/\[/g, '').replace('ti', '')
                        .replace('ar', '').replace('al', '').replace('by', '')
                        .replace('offset', '')
                        .replace(/\d+/g, '').replace(/:/g, '').replace(/\./g, '').replace(/]/g, '')
                        .split('\n');
                    var html = '<li>' + data.title + '</li>';
                    $.each(result, function(i, item){
                        if(item !== "\r" && item){
                            html += '<li>' + item + '</li>';
                        }
                    });
                    $('#blogMusicPlay').empty().html(html).scrollTop(0);
                },
                error : function(e){
                    console.error(e);
                }
            });
        }
    }
};
IndexPage.init();
/*
 * 主地址: http://tingapi.ting.baidu.com/v1/restserver/ting
 * 获取列表
 * 	例子: method=baidu.ting.billboard.billList&type=1&size=10&offset=0
 *	参数: type = 1-新歌榜,2-热歌榜,11-摇滚榜,12-爵士,16-流行,21-欧美金曲榜,
 *		 22-经典老歌榜,23-情歌对唱榜,24-影视金曲榜,25-网络歌曲榜
 * 搜索
 * 	例子: method=baidu.ting.search.catalogSug&query=海阔天空
 * 播放
 * 	例子: method=baidu.ting.song.play&songid=877578
 * 	例子: method=baidu.ting.song.playAAC&songid=877578
 * 	参数: songid = 877578 //歌曲id
 * 歌词
 * 	例子: method=baidu.ting.song.lry&songid=877578
 * 	参数: songid = 877578 //歌曲id
 * 获取歌手信息
 * 	例子: method=baidu.ting.artist.getInfo&tinguid=877578
 * 	参数: tinguid = 877578 //歌手ting id
 * 获取歌手歌曲列表
 * 	例子: method=baidu.ting.artist.getSongList&tinguid=877578
 * 		 &limits=6&use_cluster=1&order=2
 * 	参数: tinguid = 877578//歌手ting id
 * 		 limits = 6//返回条目数量
 * */