var mongoose = require('mongoose');
const { map } = require('../tarea.routes');
var Schema = mongoose.Schema;

var estatus = {
    values: ['ACTIVO', 'INACTIVO'],
    message: '{VALUE} no es un estatus valido'
};

/**
 * Casa, Terreno, Bodega, Edificio
 * @type {module:mongoose.Schema<Document, Model<Document, any, any>, undefined, {}>}
 */
var TipoAvaluoSchema = new Schema({
    nombre:  {type: String, unique:true},
    estatus:  { type: String, enum: estatus, default: 'ACTIVO' },
    opciones: [{type: String}]
});


module.exports = mongoose.model('TipoAvaluo', TipoAvaluoSchema);

