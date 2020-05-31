~function(){
	var computed = function(){
		var winW = document.documentElement.clientWidth;
		var value = winW < 640 ? winW / 640 * 100 : null;
		document.documentElement.style.fontSize = value + 'px';
	};
	computed();
	window.addEventListener('resize', computed);
}();