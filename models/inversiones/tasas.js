var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TasasSchema = new Schema({
    
    tipoTasa: { type: String },
    montoMinimo: { type: Number },
    montoMaximo: { type: Number },
    tasa: { type: Number },
    tasaVariableInicial: { type: Number },
    tasaVariableFinal: { type: Number },
    active: {type: Boolean, default: 1},
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    owner : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    productoInversion : {  type: Schema.Types.ObjectId, ref: 'ProductoInversion', required: false },

});


module.exports = mongoose.model('Tasas', TasasSchema);