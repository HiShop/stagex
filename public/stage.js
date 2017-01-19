var createCM = function(c) {
  var cm = new CommentManager(c);
  cm.init();
  return cm;
};

var safeColors = [
  0x000000,
  0x000033,
  0x000066,
  0x000099,
  0x0000CC,
  0x0000FF,
  0x003300,
  0x003333,
  0x003366,
  0x003399,
  0x0033CC,
  0x0033FF,
  0x006600,
  0x006633,
  0x006666,
  0x006699,
  0x0066CC,
  0x0066FF,
  0x009900,
  0x009933,
  0x009966,
  0x009999,
  0x0099CC,
  0x0099FF,
  0x00CC00,
  0x00CC33,
  0x00CC66,
  0x00CC99,
  0x00CCCC,
  0x00CCFF,
  0x00FF00,
  0x00FF33,
  0x00FF66,
  0x00FF99,
  0x00FFCC,
  0x00FFFF,
  0x330000,
  0x330033,
  0x330066,
  0x330099,
  0x3300CC,
  0x3300FF,
  0x333300,
  0x333333,
  0x333366,
  0x333399,
  0x3333CC,
  0x3333FF,
  0x336600,
  0x336633,
  0x336666,
  0x336699,
  0x3366CC,
  0x3366FF,
  0x339900,
  0x339933,
  0x339966,
  0x339999,
  0x3399CC,
  0x3399FF,
  0x33CC00,
  0x33CC33,
  0x33CC66,
  0x33CC99,
  0x33CCCC,
  0x33CCFF,
  0x33FF00,
  0x33FF33,
  0x33FF66,
  0x33FF99,
  0x33FFCC,
  0x33FFFF,
  0x660000,
  0x660033,
  0x660066,
  0x660099,
  0x6600CC,
  0x6600FF,
  0x663300,
  0x663333,
  0x663366,
  0x663399,
  0x6633CC,
  0x6633FF,
  0x666600,
  0x666633,
  0x666666,
  0x666699,
  0x6666CC,
  0x6666FF,
  0x669900,
  0x669933,
  0x669966,
  0x669999,
  0x6699CC,
  0x6699FF,
  0x66CC00,
  0x66CC33,
  0x66CC66,
  0x66CC99,
  0x66CCCC,
  0x66CCFF,
  0x66FF00,
  0x66FF33,
  0x66FF66,
  0x66FF99,
  0x66FFCC,
  0x66FFFF,
  0x990000,
  0x990033,
  0x990066,
  0x990099,
  0x9900CC,
  0x9900FF,
  0x993300,
  0x993333,
  0x993366,
  0x993399,
  0x9933CC,
  0x9933FF,
  0x996600,
  0x996633,
  0x996666,
  0x996699,
  0x9966CC,
  0x9966FF,
  0x999900,
  0x999933,
  0x999966,
  0x999999,
  0x9999CC,
  0x9999FF,
  0x99CC00,
  0x99CC33,
  0x99CC66,
  0x99CC99,
  0x99CCCC,
  0x99CCFF,
  0x99FF00,
  0x99FF33,
  0x99FF66,
  0x99FF99,
  0x99FFCC,
  0x99FFFF,
  0xCC0000,
  0xCC0033,
  0xCC0066,
  0xCC0099,
  0xCC00CC,
  0xCC00FF,
  0xCC3300,
  0xCC3333,
  0xCC3366,
  0xCC3399,
  0xCC33CC,
  0xCC33FF,
  0xCC6600,
  0xCC6633,
  0xCC6666,
  0xCC6699,
  0xCC66CC,
  0xCC66FF,
  0xCC9900,
  0xCC9933,
  0xCC9966,
  0xCC9999,
  0xCC99CC,
  0xCC99FF,
  0xCCCC00,
  0xCCCC33,
  0xCCCC66,
  0xCCCC99,
  0xCCCCCC,
  0xCCCCFF,
  0xCCFF00,
  0xCCFF33,
  0xCCFF66,
  0xCCFF99,
  0xCCFFCC,
  0xCCFFFF,
  0xFF0000,
  0xFF0033,
  0xFF0066,
  0xFF0099,
  0xFF00CC,
  0xFF00FF,
  0xFF3300,
  0xFF3333,
  0xFF3366,
  0xFF3399,
  0xFF33CC,
  0xFF33FF,
  0xFF6600,
  0xFF6633,
  0xFF6666,
  0xFF6699,
  0xFF66CC,
  0xFF66FF,
  0xFF9900,
  0xFF9933,
  0xFF9966,
  0xFF9999,
  0xFF99CC,
  0xFF99FF,
  0xFFCC00,
  0xFFCC33,
  0xFFCC66,
  0xFFCC99,
  0xFFCCCC,
  0xFFCCFF,
  0xFFFF00,
  0xFFFF33,
  0xFFFF66,
  0xFFFF99,
  0xFFFFCC,
  0xFFFFFF
];


var launchFullScreen = function (element) {
  CM.setBounds();
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
};

var loadImage = function(url) {
  var img = $('#image')[0];
  img.src = url;

  $('#layer_lot')[0].hidden = true;
  var player = $('#vplayer')[0];
  player.pause();
  player.src = ''; 
  player.load(); 
  player.hidden = true;
  img.hidden = false;
};

var stopPlay = function() {
  vp = $('#vplayer').get(0);
  vp.pause();
  vp.src = ''; 
  vp.load();

  ap = $('#aplayer').get(0);
  ap.pause();
};

var loadMovie = function(url) {
  stopPlay();
  
  var img = $('#image')[0];
  img.hidden = true;
  $('#layer_lot')[0].hidden = true;
  
  vp = $('#vplayer').get(0);
  vp.src = url; 
  vp.load(); 
  vp.hidden = false;
  vp.play();
};

var loadMusic = function(url) {
  stopPlay();

  var player = $('#aplayer')[0];
  player.src = url;
  player.play();
};

var appendWinnerLocal = function(ri) {
  var aud = window.LOT.audiences[ri];
  window.LOT.winners.push(ri);
  $('#winners ul').append('<li><img src="' + aud.avatar + '"><h3>' + aud.nick + '</h3>');
};

var appendWinner = function(ri) {
  var aud = window.LOT.audiences[ri];

  var payload = {
    id: aud._id,
    scene: window.LOT.scene,
    lotid: window.LOT.lotid
  };

  $.post("/admin/action/win", payload, function(data) {
    window.LOT.winners.push(ri);
    $('#winners ul').append('<li><img src="' + aud.avatar + '"><h3>' + aud.nick + '</h3>');
  });
};

var roll = function() {
  if (window.LOT.frozen) {
    appendWinner(window.LOT.ri);
    return;
  }

  window.LOT.ri += 1;
  if (window.LOT.ri >= window.LOT.audiences.length) {
    window.LOT.ri = 0;
  }

  while(window.LOT.winners.includes(window.LOT.ri)) {
    window.LOT.ri += 1;
  }

  if (window.LOT.ri >= window.LOT.audiences.length) {
    window.LOT.ri = 0;
    return setTimeout(roll, window.LOT.speed);
  }

  var aud = window.LOT.audiences[window.LOT.ri];
  $('#roll_avatar')[0].src = aud.avatar;
  $('#roll_nick').text(aud.nick);
  
  setTimeout(roll, window.LOT.speed);
};

function preloadImages(cache, array, onload, callback) {
  var list = cache;
  for (var i = 0; i < array.length; i++) {
	var img = new Image();
	img.onload = function() {
	  var index = list.indexOf(this);
	  if (index !== -1) {
        onload(img.src);
		list.splice(index, 1);
	  }

      if (list.length == 0) {
        setTimeout(callback, 1000);
      }
	}

	list.push(img);
	img.src = array[i];
  }
}


var loadLottery = function(e) {
  stopPlay();
  $('#winners ul').empty();
  $('#image')[0].hidden = true;
  $('#vplayer')[0].hidden = true;
  $('#layer_lot')[0].hidden = false;

  window.LOT = e;
  window.LOT.ri = 0;
  window.LOT.speed = 20;
  window.LOT.avatars = [];
  window.LOT.winners = [];

  var list = [];
  for (var i in e.audiences) {
    list.push(e.audiences[i].avatar);
  }

  $('#lot_title').text(window.LOT.title);
  preloadImages(window.LOT.avatars, list, function(src) {
    $('#roll_avatar')[0].src = src;
  },
  function() {
    for (var i in e.audiences) {
      if (e.audiences[i].lotid) {
        appendWinnerLocal(parseInt(i));
      }
    }
    //setTimeout(roll, window.LOT.speed);
  });
};

$(function() {
  window.CM = createCM(document.getElementById('stage'));
  CM.start();

  var image = $('#image')[0];
  image.hidden = true;
  $('#layer_lot')[0].hidden = true;

  var curtain = $("#curtain").get(0);
  wrapper.addEventListener("dblclick", function(e) {
	launchFullScreen(curtain);
  });
});

var socket = io(); //开启流

socket.on('biu', function(text) {
  var ci = Math.floor((Math.random() * safeColors.length));
  if (ci > 0) ci -= 1;

  var cmt = {
	mode: 1,
	size: 50,
	dur: 1000 * 30,
	color: safeColors[ci],
	text: text,
  };

  CM.send(cmt);
});

socket.on('fullscreen', function(e) {
  launchFullScreen(document.getElementById('curtain'));
});

socket.on('loadimg', function(e) {
  loadImage(e.url);
});

socket.on('loadmusic', function(e) {
  loadMusic(e.url);
});

socket.on('loadmov', function(e) {
  loadMovie(e.url);
});

socket.on('startlot', function(e) {
  loadLottery(e);
});

socket.on('startroll', function(e) {
  if (window.LOT.winners.length < window.LOT.count) {
    window.LOT.frozen = false;
    setTimeout(roll, window.LOT.speed);
  }
});

socket.on('stoproll', function(e) {
  window.LOT.frozen = true;
});