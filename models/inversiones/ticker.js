var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TickerSchema = new Schema({
    simbolo: { type: String },
    nombre: { type: String },

    precioEntrada: { type: Number },
    precioSalida: { type: Number },
    porcentaje: { type: Number },

    estatus: {type: String, default: 'ACTIVO'},

    active: {type: Boolean, default: true},
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    owner : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    producto : {  type: Schema.Types.ObjectId, ref: 'ProductoInversion', required: false },

});


module.exports = mongoose.model('Ticker', TickerSchema);