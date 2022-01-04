var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var CategoriaSchema = new Schema({
   
    nombre: String, //???
    //name: String,
    estatus: {type: Boolean,  default:1},
    partner : {type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    owner : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    slug: { type: String, unique: true, required: false },
    precioDesde: {type: Number, required: false},
    subCategoriasStatus: {type: Boolean, default:0},
});

// CategoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = mongoose.model('Categorias', CategoriaSchema);