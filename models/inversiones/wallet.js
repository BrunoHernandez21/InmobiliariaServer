var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var walletSchema = new Schema({
    usuario : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    wallet: { type: String, unique: false, required: [true, 'La wallet es necesaria']},
    created: {type:Date, default: new Date()},
    updated: {type:Date, default: new Date()},
    tel: { type: String, unique: false, required: false },
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },

});

module.exports = mongoose.model('Wallet', walletSchema);
