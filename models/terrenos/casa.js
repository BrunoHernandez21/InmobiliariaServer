var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CasaSchema = new Schema({ 
    lote : String,
    manzana : String,
    estatus: {type: Boolean, default: 1},
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    estado: String,
    complejo : {  type: Schema.Types.ObjectId, ref: 'Complejos' },  
});

module.exports = mongoose.model('Casa', CasaSchema);