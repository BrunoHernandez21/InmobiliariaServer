var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var PlanUsuarioTarjetaSchema = new Schema({
    usuario : {  type: Schema.Types.ObjectId, ref: 'Usuario',unique: true, required: [true, 'El Usuario es necesario'] },
    modoDePago: { type: String },
    medioPagoObservacion: { type: String },
    observaciones: { type: String },
    estado: { type: String },
    fechaInicio: { type: Date },
    fechaFin: { type: Date },
    plan : {  type: Schema.Types.ObjectId, ref: 'PlanTarjeta', required: true },
});

PlanUsuarioTarjetaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = mongoose.model('PlanUsuarioTarjeta', PlanUsuarioTarjetaSchema);
