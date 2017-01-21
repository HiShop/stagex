var request = require('request');

var getToken = function(appid, secret, callback) {
  var url = 'https://api.weixin.qq.com/cgi-bin/token';
  url += '?grant_type=client_credential';
  url += '&appid=' + appid;
  url += '&secret=' + secret;

  return request.get({url, url}, function(err, response, body) {
    if (err) return callback(err);
    if (response.statusCode != 200) return callback(new Error(body));
    return callback(null, JSON.parse(body));
  });
};

var getUserInfo = function(token, openid, callback) {
  var url = 'https://api.weixin.qq.com/cgi-bin/user/info';
  url += '?access_token=' + token;
  url += '&openid=' + openid;
  url += '&lang=zh_CN';

  request.get(url, function(err, response, body) {
    if (err) return callback(err);
    return callback(null, JSON.parse(body));
  });
};

exports.getToken = getToken;
exports.getUserInfo = getUserInfo;
