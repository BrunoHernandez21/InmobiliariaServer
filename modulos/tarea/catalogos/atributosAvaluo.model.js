var mongoose = require('mongoose');
const { map } = require('../tarea.routes');
var Schema = mongoose.Schema;

var estatus = {
    values: ['ACTIVA', 'INACTIVA'],
    message: '{VALUE} no es un estatus valido'
};

/**
 *
 * @type {module:mongoose.Schema<Document, Model<Document, any, any>, undefined, {}>}
 */
var AtributoAvaluoSchema = new Schema({
    nombre: String,
    tipoAvaluo: { type: TipoAvaluo},
    estatus:  { type: String, enum: estatus, default: 'ACTIVA' }
});


module.exports = mongoose.model('AtributoAvaluo', AtributoAvaluoSchema);

