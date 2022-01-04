var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');


var ContratoInversionSchema = new Schema({
    numeroContrato: { type: String, required: [false, 'El Numero de Contrato es necesario'] },
    fechaContrato : Date,
    cliente :  {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },

    producto: {  type: Schema.Types.ObjectId, ref: 'ProductoInversion', required: false },

    productoName: String,
    fechaInicial: Date,
    fechaFinal: Date,
    plazo: String,
    monto: Number,
    montoUsdt: Number,

    tasaAnual: Number,
    tasaMensual: Number,
    observaciones: String,
    ownerName: String,
    owner : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    vendedor : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    estadosCuenta: [{type:Schema.Types.Mixed, required: false}],
    unidades: [{type:Schema.Types.Mixed, required: false}],

    saldos: [{type:Schema.Types.Mixed, required: false}],
    doctos: [{type:Schema.Types.Mixed, required: false}]

});

ContratoInversionSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = mongoose.model('ContratoInversion', ContratoInversionSchema);