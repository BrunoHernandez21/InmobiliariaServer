var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PlanTarjetaSchema = new Schema({
    
    nombre: { type: String, required: [true, 'El nombre es necesario']},
    active: {type: Boolean, default: 1},
    maxTarjetas: { type: Number },
    price: { type: Number },
    description: [{ type: String }],
    icono: { type: String },
    renovacionPlan: { type: String }, // Por ej por mes, por semana, por año, por tres años, etc.
    owner : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
});


module.exports = mongoose.model('PlanTarjeta', PlanTarjetaSchema);

