var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var leadSchema = new Schema({
    nombre: { type: String, unique: false, required: [true, 'El nombre es necesario']},
    email: { type: String, unique: false, required: false },
    created: {type:Date, default: new Date()},
    updated: {type:Date},
    tel: { type: String, unique: false, required: false },
    referidoId : {  type: Schema.Types.ObjectId, unique: false, ref: 'Usuario', required: false },
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    configuraciones: {type:Schema.Types.Mixed, required: false}

});

module.exports = mongoose.model('Lead', leadSchema);
