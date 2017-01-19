var express = require('express');
var fs = require('fs');
var path = require('path');
var M = require('../models');

var router = express.Router();

router.get('/', function(req, res, next) {
  var programFiles = path.resolve('./data/programs.json');
  fs.readFile(programFiles , 'utf8', function (err, data) {
    if (err) throw err;
    res.render('index', {
      programs: JSON.parse(data)
    });
  });
});

router.get('/player', function(req, res, next) {
  res.render('player', { title: 'Express' });
});

router.get('/qr/:lot?', function(req, res, next) {
  M.QR.find({lot: req.params.lot}, function(err, qrs) {
    res.render('qrlot', {
      lot: req.params.lot,
      qrs: qrs
    });
  });
});

module.exports = router;