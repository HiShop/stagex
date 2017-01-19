var express = require('express');
var request = require('request');
var moment = require('moment');
var async = require('async');
var xmlbuilder = require('xmlbuilder');
var XML = require('xml');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId
var Tools = require('../common/tools');
var M = require('../models');

var biu = function(io, text) {
  io.emit('biu', text);
};

router.get('/push', function(req, res, next) {
  if (req.query.echostr) {
    res.send(req.query.echostr);
  } else {
    res.send('');
  }
});

var createPassivePlaintext = function(from, to, content) {
  var msg = XML({ xml: [
    { ToUserName: { _cdata: to } },
    { FromUserName: { _cdata: from } },
    { CreateTime: moment.now() },
    { MsgType: { _cdata: 'text' } },
    { Content: { _cdata: content } }
  ]});

  return msg;
};

var createPassiveTeletext = function(from, to, title, desc, pic, url) {
  var msg = XML({ xml: [
    { ToUserName: { _cdata: to } },
    { FromUserName: { _cdata: from } },
    { CreateTime: moment.now() },
    { MsgType: { _cdata: 'news' } },
    { ArticleCount: 1 },
    { Articles: [
      {
        item: [
          { Title: { _cdata: title } },
          { Description: { _cdata: desc } },
          { PicUrl: { _cdata: pic } },
          { Url: { _cdata: url } }
        ]
      }
    ]}
  ]});

  return msg;
};

var onScan = function(wxmp, from, to, scene, ticket, callback) {
  console.log('扫码：' + scene + ', ' + ticket);

  var updateAudience = function(ticket, openid, callback) {
    getToken(wxmp, function(err, token) {
      var url = 'https://api.weixin.qq.com/cgi-bin/user/info';
      url += '?access_token=' + token;
      url += '&openid=' + openid;
      url += '&lang=zh_CN';

      request.get({
        url, url
      }, function(err, response, body) {
        if (err) return callback(err);
        var u = JSON.parse(body);

        var query = { openid: openid };
        var update = {
          $set: {
            openid: openid,
            nick: u.nickname,
            avatar: u.headimgurl,
            updated_at: Date.now()
          },
          $inc: { visits : 1 },
          $setOnInsert: { created_at: Date.now() }
        };

        var options = {upsert: true, 'new': true};

        M.Audience.findOneAndUpdate(query, update, options, function(err, m) {
          if (m.scenes.includes(scene)) {
            return callback(new Error('您之前已经获取了入场券，还是把这个券送给喜欢的TA吧，共同分享这份喜悦！'));
          }
          return callback(err, ticket, openid)
        });
      });
    });
  };

  var useTicket = function(ticket, openid, callback) {
    var query = {
      ticket: ticket,
      openid: { $exists: false }
    };

    var update = {
      $set: {
        openid: openid,
        scaned_at: Date.now()
      }
    };

    M.QR.findOneAndUpdate(query, update, {}, function(err, m) {
      if (err) return callback(err);
      if (null == m) {
        return callback(new Error('该入场券二维码无效或已经被使用！'));
      }

      var query = { openid: openid };

      var update = {
        $push: { scenes: scene }
      };

      M.Audience.findOneAndUpdate(query, update, {}, function(err, m) {
        if (err) return callback(err);
        return callback(null, openid);
      });
    });
  };

  var task = async.compose(useTicket, updateAudience);

  return task(ticket, from, function(err, result) {
    if (err) {
      var msg = createPassiveTeletext(to, from, err.message);
      return callback(null, msg);
    };

    var title = '恭喜您受邀参加HiShop.2017年度盛典';
    var desc = '点击办理登机手续，参与年会互动及幸运抽大奖活动！';
    var pic = 'http://m2017.hishop.com.cn/images/wx-welcome.jpg?v=1.2';
    var url = 'http://m2017.hishop.com.cn/wx/checkin/' + from;
    var msg = createPassiveTeletext(to, from, title, desc, pic, url);
    return callback(null, msg);
  });
};

router.post('/push', function(req, res, next) {
  console.log('-------------- 公众号调用 --------------');
  console.log(JSON.stringify(req.query, null, 2));
  Tools.pipe(req, function(pipeErr, raw){
    var xmlStr = raw.toString('utf8');
    Tools.parseJsonFromXml(xmlStr, function(parseErr, msg) {
      console.log('-------------- 调用数据域 --------------');
      console.log(JSON.stringify(msg, null, 2));
      console.log('');

      var wxmp = req.app.locals.config.wxmp;
      if (msg.MsgType == 'text') {
        if (msg.Content != '【收到不支持的消息类型，暂无法显示】') {
          biu(req.app.locals.io, msg.Content);
        }
      } else if (msg.MsgType == 'voice') {
        if (msg.Recognition != "") {
          biu(req.app.locals.io, msg.Recognition);
        }
      } else if (msg.MsgType == 'event') {
        if (msg.Event == 'subscribe') {
          var ticket = msg.Ticket;
          var from  = msg.FromUserName;
          var to = msg.ToUserName;
          var scene = parseInt(msg.EventKey.substr(msg.EventKey.lastIndexOf('_') + 1));
          return onScan(wxmp, from, to, scene, ticket, function(err, result) {
            return res.send(result);
          });
        } else if (msg.Event == 'SCAN') {
          var ticket = msg.Ticket;
          var from  = msg.FromUserName;
          var to = msg.ToUserName;
          var scene = parseInt(msg.EventKey);
          return onScan(wxmp, from, to, scene, ticket, function(err, result) {
            return res.send(result);
          });
        }
      }
      res.send('');
    });
  });
});

var getToken = function(config, callback) {
  if ('token' in config && moment().isBefore(moment(config.expires)))
    return callback(null, config.token);

  var url = 'https://api.weixin.qq.com/cgi-bin/token';
  url += '?grant_type=client_credential';
  url += '&appid=' + config.appid;
  url += '&secret=' + config.secret;

  return request.get({
    url, url
  }, function(err, response, body) {
    if (err) return callback(err);
    if (response.statusCode != 200) return callback(new Error(body));

    var r = JSON.parse(body);
    config.token = r.access_token;
    config.expires  = moment().add(r.expires_in - 60 * 10, 's').toDate();

    return callback(null, config.token);
  });
};

var createQR = function(token, scene, expires, callback) {
  var url = 'https://api.weixin.qq.com/cgi-bin/qrcode/create';
  url += '?access_token=' + token;

  var options = {
    url: url,
    method: 'POST',
    json: true,
    body: {
      "expire_seconds": expires,
      "action_name": "QR_SCENE",
      "action_info": {
        "scene": {"scene_id": scene}
      }
    }
  };

  console.log(JSON.stringify(options, null, 2));
  request.post(options, function(err, response, body) {
    console.log(body);
    return callback(null, body);
  });
};

var createScenesQR = function(wxmp, scene, expires, lot, callback) {
  getToken(wxmp, function(err, token) {
    createQR(token, scene, expires, function(err, result) {
      var m = new M.QR();
      m._id = result.url.substr(result.url.lastIndexOf('/') + 1);
      m.url = result.url;
      m.ticket = result.ticket;
      m.scene = scene;
      m.lot = lot;

      var now = Date.now();
      m.created_at = now;
      m.expired_at = moment(now).add(expires, 's').toDate();

      return m.save(callback);
    });
  });
};

router.post('/newqr', function(req, res, next) {
  var scene = parseInt(req.body.scene);
  var count = parseInt(req.body.count);
  var lot = req.body.lot;

  async.times(count, function(n, next) {
    var wxmp = req.app.locals.config.wxmp;
    var sevenDays = 604800;
    createScenesQR(wxmp, scene, sevenDays, lot, function(err, qr) {
      return next(err, qr);
    });
  }, function(err, qrs) {
    if (err) return res.status(500).send(err);
    res.send(JSON.stringify({result: qrs}, null, 2));
  });
});

router.all('/checkin/:openid?', function(req, res, next) {
  var openid = req.params.openid;
  var prizes = [
    '无',
    '一等奖',
    '二等奖',
    '三等奖',
    '幸运奖',
    '特等奖'
  ];


  if (req.method == 'POST') {
    var surename = req.body.surename.trim();

    if (surename.length > 0 && surename.length < 8) {
      var query = {openid: openid};
      var update = {$set: {name: surename}};
      var options = {'new': true};

      return M.Audience.findOneAndUpdate(query, update, options, function(err, m) {
        if (err) return res.status(500).send(err);
        if (m == null) return res.status(403).send('请不要做恶意尝试！');
        res.render('checkin', {
          title: '欢迎Hi客前来登机',
          openid: openid,
          prizes: prizes,
          aud: m
        });
      });

    }
  }

  M.Audience.findOne({openid: openid}, function(err, m) {
    if (err) return res.status(500).send(err);
    if (m == null) return res.status(403).send('请不要做恶意尝试！');
    res.render('checkin', {
      title: '欢迎Hi客前来登机',
      openid: openid,
      prizes: prizes,
      aud: m
    });
  });
});

module.exports = router;
