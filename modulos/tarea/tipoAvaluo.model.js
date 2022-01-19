var mongoose = require('mongoose');
const { map } = require('./tarea.routes');
var Schema = mongoose.Schema;

var estatus = {
    values: ['ACTIVA', 'INACTIVA'],
    message: '{VALUE} no es un estatus valido'
};

/**
 * Casa, Terreno, Bodega, Edificio
 * @type {module:mongoose.Schema<Document, Model<Document, any, any>, undefined, {}>}
 */
var TipoAvaluoSchema = new Schema({
    nombre: String,
    estatus:  { type: String, enum: estatus, default: 'ACTIVA' }
});


module.exports = mongoose.model('TipoAvaluo', TipoAvaluoSchema);

