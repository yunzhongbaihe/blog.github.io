var Ndialog = (function(win, doc, $){
    var Ndialog = function(el, options){
        this.init(el, options);
    };
    Ndialog.prototype.init = function(el, options){
        this.el = !options.href ?
            ((!$(el).attr('id') || !$(el).attr('class')) ? options.nodeId : el) : options.nodeId;
        this.body = $(doc.body);
        this.html = '';
        this.opts = options;
        this.buidUI();
    };
    Ndialog.prototype.handler = function(){
        var opts = this.opts;
        if(typeof opts.onOpen === 'function'){
            opts.onOpen();
        }
    };
    Ndialog.prototype.buidUI = function(){
        var self = this;
        var opts = self.opts;
        /*
         * 如果 opts.href 没有值, 说明当前页面已经存在相应内容,
         * 如果 opts.href 有值, 说明是通过远程链接获取页面内容
         */
        var ndialogHeader = $('<div class="ndialog_header">' +
            '<span class="text_ellipsis ndialog_title">' + opts.dTitle + '</span>' +
            '<span class="ndialog_close"></span>' +
            '</div>');
        var ndialogBody = $('<div class="ndialog_body"></div>');
        var ndialogFooter = $('<div class="ndialog_footer">' +
            '<button type="button" class="ndialog_enter_btn">确定</button>' +
            '<button type="button" class="ndialog_cancel_btn">取消</button>' +
            '</div>');
        var ndialogLoading = $('<div class="ndialog_loading">正在加载, 请稍后...</div>');
        if(!document.getElementById('maskDisplay')){
            var maskDisplay = $('<div id="maskDisplay" class="mask_display"></div>');
        }
        var ndialogWrap = null;
        if(!opts.href){
            self.html = opts.data;
            if(!$(self.el).attr('id') || !$(self.el).attr('class')){
                ndialogWrap = $('<div id="' + opts.nodeId.substring(1) + '" ' +
                    'class="ndialog_wrap"></div>');
                self.body.append(ndialogWrap);
            }else{
                self.html = $(self.el).html();
                $(self.el).empty();
                $(self.el).attr('class', 'ndialog_wrap');
            }
        }else{
            self.html = self.ajaxGetBody();
            ndialogWrap = $('<div id="' + opts.nodeId.substring(1) + '" ' +
                'class="ndialog_wrap"></div>');
            self.body.append(ndialogWrap);
        }
        var width = opts.width > 800 ? 800 : opts.width;
        var height = opts.height > 600 ? 600 : opts.height;
        var num = 92;
        if(!opts.isShowBtn){
            num = 42;
        }
        ndialogBody.height(height - num).empty().html(self.html);
        if(opts.isText){
            ndialogBody.css({
                lineHeight : '24px',
                letterSpacing : '2px',
                fontSize : '14px',
                fontWeight : 'bold'
            });
        }
        $(self.el).css({
            position : opts.positionType,
            marginLeft : -(width / 2) + 'px',
            marginTop : -(height / 2) + 'px',
            width : width + 'px',
            height : height + 'px'
        });
        var _height = this.height = height - 40 - 2;
        ndialogLoading.height(_height).css({lineHeight : _height + 'px'});
        self.body.append(maskDisplay);
        $(self.el).append(ndialogHeader);
        $(self.el).append(ndialogBody);
        if(opts.isShowBtn){
            $(self.el).append(ndialogFooter);
        }
        $(self.el).append(ndialogLoading);
        self.bindEvent();
    };
    Ndialog.prototype.bindEvent = function(){
        var self = this;
        var $el = $(self.el);
        var opts = self.opts;
        $el.on('click', '.ndialog_close', function(e){
            e.preventDefault();
            self.close();
            return false;
        }).on('click', '.ndialog_enter_btn', function(e){
            e.preventDefault();
            if(typeof opts.onEnter === 'function'){
                $el.find('.ndialog_loading').html('正在操作中, 请稍等...')
                    .show().animate({height : self.height}, 300);
                if(opts.onEnter()){
                    self.close();
                }
            }
            return false;
        }).on('click', '.ndialog_cancel_btn', function(e){
            e.preventDefault();
            self.close();
            if(typeof opts.onCancel === 'function'){
                opts.onCancel();
            }
            return false;
        });
    };
    Ndialog.prototype.ajaxGetBody = function(){
        var html = '';
        var opts = this.opts;
        $.ajax({
            url : opts.href,
            type : 'GET',
            data : opts.queryParams,
            cache : false,
            async : false,
            dataType : 'html',
            success : function(data){
                html = data;
            },
            error : function(e){
                console.error(e);
            }
        });
        return html;
    };
    Ndialog.prototype.open = function(){
        var $el = $(this.el);
        var timer = null;
        var ndialogLoading = $el.find('.ndialog_loading');
        this.handler();
        $el.show();
        $('#maskDisplay').show();
        ndialogLoading.height(this.height).html('正在加载, 请稍后...').show();
        timer = setTimeout(function(){
            ndialogLoading.animate({height : '0'}, 300, function(){
                ndialogLoading.hide();
            });
            clearTimeout(timer);
            timer = null;
        }, 500);
        $el.find('.ndialog_body').scrollTop(0);
    };
    Ndialog.prototype.close = function(){
        if(this.opts.isDestory){
            $(this.el).remove();
        }else{
            $(this.el).hide();
        }
        $('#maskDisplay').hide();
    };
    Ndialog.prototype.off = function(){
        $(this.el).off();
    };

    var defaults = {
        positionType : 'absolute', //=> 定位方式
        queryParams : null,
        width : 300,
        height : 160,
        data : '',
        isDestory : false, //=> 是否销毁组件
        isShowBtn : true, //=> 是否显示按钮组
        isText : false, //=> 是否是纯文本内容
        nodeId : '#body_ndialog',
        href : '', //=> 页面来源
        dTitle : '提示',
        dInfo : '',
        onOpen : null,
        //=> 点击 "确定" 按钮执行的函数
        onEnter : null,
        //=> 点击 "取消" 按钮执行的函数
        onCancel : null
    };


    var init = function(el, option){
        var $el = $(el);
        var _ndialog = $el.data('ndialog');
        var options = $.extend({}, defaults, typeof option === 'object' && option);
        if(!_ndialog){
            _ndialog = new Ndialog(el, options);
            $el.data('ndialog', _ndialog);
        }
        if(typeof option === 'string'){
            _ndialog[option]();
        }
        return _ndialog;
    };

    $.fn.extend({
        ndialog : function(options){
            return this.each(function(){
                init(this, options);
            });
        }
    });

    return {
        init : init
    }

})(window, document, jQuery);
