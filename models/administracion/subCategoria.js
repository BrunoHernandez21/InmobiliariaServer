var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubCategoriaSchema = new Schema({
   
    nombre: {type: String, required: [true, 'El nombre es necesario'] },
    estatus: {type: Boolean,  default:1},
    owner : {  type: Schema.Types.ObjectId, ref: 'Usuario' },
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner' },
    categoria : {  type: Schema.Types.ObjectId, ref: 'Categorias' },
});

module.exports = mongoose.model('SubCategorias', SubCategoriaSchema);