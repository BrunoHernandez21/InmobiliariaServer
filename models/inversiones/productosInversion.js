var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProductoInversionSchema = new Schema({
    

    nombre: { type: String, required: [true, 'El nombre es necesario']},
    plazo: { type: String },
    montoMinimo: { type: Number },
    tipoMoneda: { type: String },
    plazoRetiro: { type: String },
    capitalAsegurado: { type: String },
    perfilCliente: { type: String },
    retiros: { type: Boolean },
    tasaVariable: { type: Boolean },
    tasaFija: { type: Boolean },
    active: {type: Boolean, default: 1},
    divisor: { type: String },
    colorInicial: { type: String },
    colorFinal: { type: String },
    icono: { type: String },
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    owner : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },

});


module.exports = mongoose.model('ProductoInversion', ProductoInversionSchema);