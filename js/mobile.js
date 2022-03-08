~function () {
  var computed = function () {
    var winW = document.documentElement.clientWidth;
    if (winW > 640 && parseInt(document.documentElement.style.fontSize) >= 0) {
      window.location.reload(true);
      return false;
    }
    var value = winW < 640 ? winW / 640 * 100 : null;
    document.documentElement.style.fontSize = value + "px";
  };
  computed();
  window.addEventListener("resize", computed);
}();