var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ComisionVendedorSchema = new Schema({
    pago: { type: Number },
    comision: { type: Number },
    fechaPago: { type: Date },
    contrato: { type: Schema.Types.ObjectId, ref: 'ContratoInversion', required: true },
    vendedor : { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    trimestre: { type: Number, required: true },
    created: {type: Date, default: new Date()},
});


module.exports = mongoose.model('ComisionVendedor', ComisionVendedorSchema);