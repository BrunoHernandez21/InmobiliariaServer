var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DepartamentosSchema = new Schema({
    torre : String,
    departamento : String,
    amenidades : String,
    modificaciones : String,
    estatus: {type: Boolean, default: 1},
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    estado: String,
    complejo : {  type: Schema.Types.ObjectId, ref: 'Complejos' },   
});


module.exports = mongoose.model('Departamentos', DepartamentosSchema);