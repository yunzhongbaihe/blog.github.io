var ShareWorker = {
    qq: function(config){
        var p = {
            url: config.url || window.location.href,
            title: config.title || '', // 分享标题
            desc: config.desc || '', // 分享理由---对话模式文字，可以不用指定
            summary: config.summary || '', // 分享描述---标题下方的文字
            pics: config.pics || 'https://www.jfh.com/icon/logo.png', // 分享图片
            flash: config.flash || '', // 视频地址
            // commonClient: typeof config.commonClient !== 'undefined' ? config.commonClient : true, // 客户端嵌入标志
            site: config.site || 'QQ分享', // 分享来源
            sharesource: 'qq',
        };
        var s = [];
        for(var i in p){
            s.push(i + '=' + encodeURIComponent(p[i] || ''));
        }
        // 使用http://connect.qq.com/widget/shareqq/iframe_index.html
        // iframe_index.html是弹出层效果
        // index.html是新打开页面效果
        var openUrl = "https://connect.qq.com/widget/shareqq/index.html?" + s.join('&');
        window.open(openUrl);
    },
    weibo: function(config){
        var p = {
            url: config.url || window.location.href,
            title: config.title || '',
            pic: config.pic || 'https://www.jfh.com/icon/logo.png',
            sharesource: 'weibo',
        };
        var s = [];
        for(var i in p){
            s.push(i + '=' + encodeURIComponent(p[i] || ''));
        }
        var openUrl = 'https://service.weibo.com/share/share.php?' + s.join('&');
        window.open(openUrl);
    },
    qzone: function(config){
        var p = {
            url: config.url || window.location.href,
            title: config.title || '',
            pics: config.pics || 'https://www.jfh.com/icon/logo.png',
            sharesource: 'qzone',
            summary: config.summary || '',
        };
        var s = [];
        for(var i in p){
            s.push(i + '=' + encodeURIComponent(p[i] || ''));
        }
        var openUrl = 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?' + s.join('&');
        window.open(openUrl);
    },
};