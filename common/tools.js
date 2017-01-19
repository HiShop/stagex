var bcrypt = require('bcrypt');
var crypto = require('crypto');
var moment = require('moment');
var xml2js = require('xml2js');
var utf8 = require('utf8');

moment.locale('zh-cn'); // 使用中文

exports.parseDate = function (str) {
  if (!/^(\d){8}$/.test(str)) {
    throw new TypeError('无效的日期格式！');
  }

  var y = str.substr(0,4),
    m = str.substr(4,2) - 1,
    d = str.substr(6,2);
  return new Date(y, m, d, 0, 0, 0);
};

Date.prototype.toFyyyyMMddHHmmss = function() {
  var yyyy = this.getFullYear().toString(),
    MM = (this.getMonth()+1).toString(),
    dd  = this.getDate().toString();

  var HH = this.getHours().toString(),
    mm = this.getMinutes().toString(),
    ss = this.getSeconds().toString();

  var d = [
    yyyy,
    MM[1]?MM:"0"+MM[0],
    dd[1]?dd:"0"+dd[0]
  ];

  var t = [
    HH[1]?HH:"0"+HH[0],
    mm[1]?mm:"0"+mm[0],
    ss[1]?ss:"0"+ss[0]
  ];

  return d.join('-') + ' ' + t.join(':');
};

Date.prototype.toFyyyyMMdd = function() {
  var yyyy = this.getFullYear().toString(),
    MM = (this.getMonth()+1).toString(),
    dd  = this.getDate().toString();

  var d = [
    yyyy,
    MM[1]?MM:"0"+MM[0],
    dd[1]?dd:"0"+dd[0]
  ];

  return d.join('');
};




exports.createXmlFromJson = function(json, rootName) {
  var builder = new xml2js.Builder({rootName: rootName});
  return builder.buildObject(json);
};

exports.parseJsonFromXml = function(xml, fn){
  var parser = new xml2js.Parser({ trim:true, explicitArray:false, explicitRoot:false });
  parser.parseString(xml, fn||function(err, result){});
};

exports.pipe = function(stream, fn){
  var buffers = [];
  stream.on('data', function (trunk) {
    buffers.push(trunk);
  });
  stream.on('end', function () {
    fn(null, Buffer.concat(buffers));
  });
  stream.once('error', fn);
};

exports.getDaysBetween = function(from, to) {
  var oneDay = 24*60*60*1000;
  return Math.round(Math.abs(
    (from.getTime() - to.getTime())/(oneDay)
  ));
};

exports.randomString = function(len) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < len; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

var makeQuery = function(dict, sort) {
  keys = Object.keys(dict);

  if (sort) {
    keys = keys.sort();
  }

  queryStr = '';
  for (var i in keys) {
    var k = keys[i];

    if (queryStr != '') {
      queryStr += '&';
    }

    queryStr += (k +'=' + dict[k].toString());
  }

  return queryStr;
};

exports.makeQuery = makeQuery;

exports.signQuery = function (dict, secret, keyField, algorithm) {
  var queryStr = makeQuery(dict, true);
  queryStr += "&" + keyField + "=" + secret;

  var shasum = crypto.createHash(algorithm || 'md5');
  shasum.update(utf8.encode(queryStr));
  var digest = shasum.digest('hex');
  return digest;
};

exports.verifySign = function (query, signKey, secret) {
  keys = Object.keys(query).sort();

  queryStr = '';
  for (var i in keys) {
    var k = keys[i];
    if (k == signKey) continue;

    if (queryStr != '') {
      queryStr += '&';
    }

    queryStr += (k +'=' + query[k]);
  }

  var shasum = crypto.createHash('sha1');
  shasum.update(queryStr);
  shasum.update('&' + signKey + "=" + secret);
  var digest = shasum.digest('hex');

  return (digest == query['sign'].toLowerCase());
};

// 格式化时间
exports.formatDate = function (date, friendly) {
  date = moment(date);

  if (friendly) {
    return date.fromNow();
  } else {
    return date.format('YYYY-MM-DD HH:mm');
  }

};

exports.validateId = function (str) {
  return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};

exports.bhash = function (str, callback) {
  bcrypt.hash(str, 10, callback);
};

exports.bcompare = function (str, hash, callback) {
  bcrypt.compare(str, hash, callback);
};

var hmac = function(data, algrithm) {
  if (algrithm === undefined) { algrithm = 'sha1'; }

  var hmac = crypto.createHmac(algrithm, crypto.randomBytes(256));
  hmac.update(data);
  hash = hmac.digest('base64');
  return hash;
};

exports.hmac_sha1 = function(data) {
  return hmac(data, 'sha1');
};

exports.hmac_sha256 = function(data) {
  return hmac(data, 'sha256');
};
