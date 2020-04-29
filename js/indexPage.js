const INDEXPAGE = {
	init: function(){
		// this.date.init();
		$(function(){
			$('#fullPage').fullpage({
				sectionsColor: ['#1bbc9b', '#4BBFC3', '#7BAABE', '#f90'],
				navigation: true
			});
		});
	},
	date: {
		init: function(){
			this.getDate();
			setInterval(this.getDate, 1000);
		},
		getDate: function(){
			var currentDate = new Date();
			var date = currentDate.toLocaleDateString().replace(/\//g, '-');
			var time = currentDate.toLocaleTimeString();
			$('#pageTopDate').text(date + ' ' + time);
		}
	}
};
INDEXPAGE.init();