/**
 * @描述: 博客首页逻辑代码
 * @作者: wuxiaogang
 * @日期: 2018/7/26
 */

var IndexPage = {
	init : function(){
		IndexPage.blogDate = $('#blogDate');
		IndexPage.date.init();
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
	}
};
IndexPage.init();