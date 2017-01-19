var mongoose = require('mongoose');
var config = require('../config');

var options = {
  db: {
    native_parser: true
  },
  server: {
    poolSize: 50,
    socketOptions: {
      noDelay: true,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 15000
    }
  }
};

mongoose.connect(config.db, options, function (err) {
  if (err) {
    console.error('Mongoose 连接到服务器 %s 时发生错误: \n%s', config.db, err.message);
    return process.exit(1);
  }
  
  console.info('连接至MongoDB成功！');
});

require('./audience');
require('./qr');

exports.Audience = mongoose.model('Audience');
exports.QR = mongoose.model('QR');
