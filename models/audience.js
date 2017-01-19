var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AudienceSchema = new Schema({
    // 微信OpenID
    openid: {type: String},
  
    // 昵称
    nick: {type: String},
  
    // 名称
    name: {type: String},

    // 头像
    avatar: {type: String},

    // 加入的场景ID
    scenes: [Number],

    // 赢得的抽奖
    lotid: { type: Number },

    loc: {
      type: { type: String },
      coordinates: [Number],
    },

    // 累计访问量
    visits: {type: Number, default: 0},

    // 创建时间
    created_at: {type: Date, default: Date.now},

    // 最后发生交互时间
    updated_at: {type: Date}
});

AudienceSchema.index({openid: 1}, {unique: true});
AudienceSchema.index({created_at: 1});

mongoose.model('Audience', AudienceSchema);
