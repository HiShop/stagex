var moment = require('moment');
var WX = require('./common/wxapi')

var config = {
  db: 'mongodb://stagexdbo:qwe123123@localhost/admin',
  wxmp: {
    //appid: 'wx6f38b684087b31c2',
    //secret: '24877222fb70307244e3290b76116652'
    appid: 'wx8c3087680a6cc450',
    secret: '1e4cba64acabd7407ec33503953181b4',
    advance: 300,
    getToken: function(callback) {
      if (this.token && this.expires && moment().isBefore(moment(this.expires)))
        return callback(null, this.token);

      WX.getToken(this.appid, this.secret, function(err, result) {
        if (err) return callback(err);
        this.mp.token = result.access_token;

        var safeTimeout = result.expires_in - this.mp.advance;
        this.mp.expires  = moment().add(safeTimeout, 's').toDate();
        return callback(null, this.mp.token);
      }.bind({mp: this}));
    }
  }
};

module.exports = config;
