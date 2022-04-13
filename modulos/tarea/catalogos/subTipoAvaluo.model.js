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
var SubTipoAvaluoSchema = new Schema({
    nombre: String,
    tipo : {  type: Schema.Types.ObjectId, ref: 'TipoAvaluo', required: true },
    estatus:  { type: String, enum: estatus, default: 'ACTIVO' }
});


module.exports = mongoose.model('SubTipoAvaluo', SubTipoAvaluoSchema);

