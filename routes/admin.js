var express = require('express');
var router = express.Router();
var M = require('../models');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/action/fullscreen', function(req, res, next) {
  req.app.locals.io.emit('fullscreen', {});
  res.json({result: 'ok'});
});

router.post('/action/loadimg', function(req, res, next) {
  req.app.locals.io.emit('loadimg', {url: req.body.url});
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

router.post('/action/startlot', function(req, res, next) {
  var scene = parseInt(req.body.scene);
  var lotid = parseInt(req.body.lotid);
  var query = {
    scenes: scene,
//    lotid: { $exists: false }
  };

  M.Audience.find(query, function(err, m) {
    var payload = req.body;
    payload.audiences = m;
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

module.exports = router;
