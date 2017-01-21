var express = require('express');
var async = require('async');
var path = require('path');
var fs = require('fs');
var request = require('request');
var router = express.Router();
var M = require('../models');
var WXAPI = require('../common/wxapi');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/action/fullscreen', function(req, res, next) {
  req.app.locals.io.emit('fullscreen', {});
  res.json({result: 'ok'});
});

router.post('/action/loadimg', function(req, res, next) {
  req.app.locals.io.emit('loadimg', req.body);
  res.json({result: 'ok'});
});

router.post('/action/loadmusic', function(req, res, next) {
  req.app.locals.io.emit('loadmusic', {url: req.body.url});
  res.json({result: 'ok'});
});

router.post('/action/loadmovie', function(req, res, next) {
  req.app.locals.io.emit('loadmov', {url: req.body.url});
  res.json({result: 'ok'});
});

function shuffle(a) {
  var j, x, i;
  for (i = a.length; i; i--) {
	j = Math.floor(Math.random() * i);
	x = a[i - 1];
	a[i - 1] = a[j];
	a[j] = x;
  }
}

router.post('/action/startlot', function(req, res, next) {
  var scene = parseInt(req.body.scene);
  var lotid = parseInt(req.body.lotid);
  var query = {
	scenes: scene,
	name: {$exists: true}
	//    lotid: { $exists: false }
  };

  M.Audience.find(query, function(err, results) {
	var payload = req.body;
	payload.audiences = [];
	for (var i in results) {
      var aud = results[i];
      var c = {
        _id: aud._id,
        openid: aud.openid,
        name: aud.name,
        nick: aud.nick,
      };

      if (aud.lotid) {
        c.lotid = aud.lotid;
      }

      payload.audiences.push(c);
	}

    shuffle(payload.audiences);
	req.app.locals.io.emit('startlot', payload);
	res.json({result: 'ok'});
  });
});

router.post('/action/stoplot', function(req, res, next) {
  req.app.locals.io.emit('stoplot', req.body);
  res.json({result: 'ok'});
});

router.post('/action/startroll', function(req, res, next) {
  req.app.locals.io.emit('startroll', req.body);
  res.json({result: 'ok'});
});

router.post('/action/stoproll', function(req, res, next) {
  req.app.locals.io.emit('stoproll', req.body);
  res.json({result: 'ok'});
});

router.post('/action/win', function(req, res, next) {
  console.log(req.body);
  var query = {
	_id: req.body.id,
	lotid: { $exists: false }
  };

  var update = {
	$set: {
	  lotid: parseInt(req.body.lotid)
	}
  };

  M.Audience.findOneAndUpdate(query, update, {}, function(err, m) {
	if (err) return res.status(500).json(err);
	if (null == m) {
	  return res.status(400).json(new Error('不能重复中奖！'));
	}

	res.json({result: 'ok'});
  });
});

router.post('/action/ctlpause', function(req, res, next) {
  req.app.locals.io.emit('ctlpause', req.body);
  res.json({result: 'ok'});
});

router.post('/action/ctlplay', function(req, res, next) {
  req.app.locals.io.emit('ctlplay', req.body);
  res.json({result: 'ok'});
});

router.post('/action/ctlstop', function(req, res, next) {
  req.app.locals.io.emit('ctlstop', req.body);
  res.json({result: 'ok'});
});

router.post('/action/ctlbg', function(req, res, next) {
  req.app.locals.io.emit('ctlbg', req.body);
  res.json({result: 'ok'});
});

router.get('/syncwx', function(req, res, next) {
  var wxmp = req.app.locals.config.wxmp;

  var query = {avatar: null};
  M.Audience.find(query, function(err, results) {
	audicens = [];
	async.eachSeries(results, function(aud, callback) {
	  wxmp.getToken(function(err, token) {
		WXAPI.getUserInfo(token, aud.openid, function(err, info) {
		  if (err) return callback(err);
		  if (info.errcode) return callback();

		  var query = {_id: aud._id};
		  var update = {
			$set: {
			  nick: info.nickname,
			  avatar: info.headimgurl,
			  updated_at: Date.now()
			},
		  };

		  console.log(aud);
		  audicens.push(info.headimgurl);
		  var options = {'new': true};
		  M.Audience.findOneAndUpdate(query, update, options, callback);
		});
	  });
	}, function(err) {
	  res.json(audicens);
	});
  });
});

router.get('/saveavatars', function(req, res, next) {
  var avatarPath = path.resolve('./assets/avatars/');
  var query = {avatar: {$ne: null}};
  var avatars = [];
  M.Audience.find(query, function(err, results) {
	async.each(results, function(aud, callback) {
	  request(aud.avatar).on('response',  function (res) {
		var fileName = avatarPath + "/" + aud._id + ".jpg";
		console.log(fileName);
		res.pipe(fs.createWriteStream(fileName)).on('finish', function () {
		  avatars.push(aud.avatar);
		  return callback();
		});
	  });
	}, function(err) {
	  res.json(avatars);
	});
  });
});

module.exports = router;
