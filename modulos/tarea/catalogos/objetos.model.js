var mongoose = require('mongoose');
const { map } = require('../tarea.routes');
var Schema = mongoose.Schema;

var estatus = {
    values: ['ACTIVO', 'INACTIVO'],
    message: '{VALUE} no es un estatus valido'
};

/**
 * S	SALA
 * C	COMEDOR
 * K	COCINA
 * T	TERRAZA
 * R	RECAMARA
 * RC	RECAMARA CON CLOSET
 * @type {module:mongoose.Schema<Document, Model<Document, any, any>, undefined, {}>}
 */
var ObjetoAvaluoSchema = new Schema({
    clave:  {type: String, unique:true},
    nombre:  {type: String},
    estatus:  { type: String, enum: estatus, default: 'ACTIVO' }
});


module.exports = mongoose.model('Objeto', ObjetoAvaluoSchema);

