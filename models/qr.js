var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QRSchema = new Schema({
    // 二维码ID
    _id: {type: String},
    
    // 二维码URL
    url: {type: String},
    
    // 二维码Ticket
    ticket: {type: String},
    
    // 场景ID
    scene: {type: Number},
    
    // 批次号
    lot: {type: String},
    
    // 微信OpenID
    openid: {type: String},

    // 创建时间
    created_at: {type: Date},

    // 最后发生交互时间
    expired_at: {type: Date},

    // 最后发生交互时间
    scaned_at: {type: Date}
});

QRSchema.index({_id: 1}, {unique: true});
QRSchema.index({scene: 1});
QRSchema.index({ticket: 1});
QRSchema.index({openid: 1});

mongoose.model('QR', QRSchema);
