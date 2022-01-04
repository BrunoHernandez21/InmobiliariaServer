var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var ContratoTerrenoSchema = new Schema({
    numeroContrato: { type: String, unique: true }, 
    fechaContrato : Date,
    fechaDePrimerPago : Date,
    cliente :  {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    vendedor :  {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    complejo :  {  type: Schema.Types.ObjectId, ref: 'Complejos', required: true },
    numeroMensualidades : Number,
    comisionVendedor : Number,
    estatus : String,
    diaPago: Number,
    fechaApartado : Date,
    fechaFirma : Date,
    fechaEntrea : Date,
    observaciones : String,
    mensualidad : Number,
    categoria : String,
    enganche : String,
    montoApartado : Number,
    formaPago : String,
    comprobanteApartado: {
        nombre: String,
        url: String,
        estado: String,
        observacion: String,
    },
    contratoFirmado: {
        nombre: String,
        url: String,
        estado: String,
        observacion: String,
    },
    pagos : [{  type: Schema.Types.ObjectId, ref: 'Pagos', required: false },],
    casa : {  type: Schema.Types.ObjectId, ref: 'Casa', required: false },
    terreno : {  type: Schema.Types.ObjectId, ref: 'Predio', required: false },
    departamento : {  type: Schema.Types.ObjectId, ref: 'Departamentos', required: false },
    owner : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
});

ContratoTerrenoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = mongoose.model('ContratoTerreno', ContratoTerrenoSchema);