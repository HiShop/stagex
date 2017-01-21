var loadImage = function() {
  var payload = {
    url: $(this).data().url,
    index: $(this).data().index,
    count: $(this).data().count
  };

  $.post("/admin/action/loadimg", payload, function(data) {
    console.log(data);
  });
};

var loadMusic  = function() {
  var url = $(this).data().url;
  $.post("/admin/action/loadmusic", {url: url}, function(data) {
    console.log(data);
  });
};

var loadMovie  = function() {
  var url = $(this).data().url;
  $.post("/admin/action/loadmovie", {url: url}, function(data) {
    console.log(data);
  });
};

var startLottery = function(btn, scene, lotid, title, count) {
  btn.prop('disabled',true).css('opacity',0.3);
  var payload = {
    lotid: lotid,
    scene: scene,
    title: title,
    count: count
  };

  $.post("/admin/action/startlot", payload, function(data) {
    btn.text("点击关闭");
    btn.prop('disabled',false).css('opacity',1.0);
  }).fail(function(e) {
    alert(e.status + "\n" + e.statusText);
    btn.text("操作失败！");
  });
};

var stopLottery = function(btn, scene, lotid) {
  btn.prop('disabled',true).css('opacity',0.3);
  $.post("/admin/action/stoplot", {lotid: lotid, scene: scene}, function(data) {
    btn.text("抽奖完成！");
  }).fail(function(e) {
    alert(e.status + "\n" + e.statusText);
    btn.text("操作失败！");
  });
};

var startRoll = function(btn, scene, lotid) {
  btn.prop('disabled',true).css('opacity',0.3);
  $.post("/admin/action/startroll", {lotid: lotid, scene: scene}, function(data) {
    btn.text("点击抽奖");
    btn.prop('disabled',false).css('opacity',1.0);
  }).fail(function(e) {
    alert(e.status + "\n" + e.statusText);
    btn.text("操作失败！");
  });
};

var stopRoll = function(btn, scene, lotid) {
  btn.prop('disabled',true).css('opacity',0.3);
  $.post("/admin/action/stoproll", {lotid: lotid, scene: scene}, function(data) {
    btn.text("点击滚动");
    btn.prop('disabled',false).css('opacity',1.0);
  }).fail(function(e) {
    alert(e.status + "\n" + e.statusText);
    btn.text("操作失败！");
  });

};

var onAction = function() {
  var fn = $(this).data().fn;
  var scene = $(this).data().scene;
  var lotid = $(this).data().lotid;
  var title = $(this).data().title;
  var count = $(this).data().count;
  var text = $(this).text();

  if (fn == "mc") {
    text == "点击启动" && startLottery($(this), scene, lotid, title, count);
    text == "点击关闭" && stopLottery($(this), scene, lotid);
  } else if (fn == "roll") {
    text == "点击滚动" && startRoll($(this), scene, lotid);
    text == "点击抽奖" && stopRoll($(this), scene, lotid);
  }
};

var onPause = function() {
  $.post("/admin/action/ctlpause", function(data) {
    console.log(data);
  });
};

var onPlay = function() {
  $.post("/admin/action/ctlplay", function(data) {
    console.log(data);
  });
};

var onStop = function() {
  $.post("/admin/action/ctlstop", function(data) {
    console.log(data);
  });
};

var onBG = function() {
  var url = $(this).data().url;
  $.post("/admin/action/ctlbg", {url: url, index: 0, length: 1}, function(data) {
    console.log(data);
  });
};

$(function() {
  console.log('HiShop.云舞台控制面板加载');
  $(".action_image").on("click", loadImage);
  $(".action_music").on("click", loadMusic);
  $(".action_movie").on("click", loadMovie);
  $(".action_button").on("click", onAction);
  $("#btn_pause").on("click", onPause);
  $("#btn_play").on("click", onPlay);
  $("#btn_stop").on("click", onStop);
  $("#btn_bg").on("click", onBG);
});
