var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PagosSchema = new Schema({
    fecha : Date,
    descripcion : String,
    importe : Number,
    modoDePago : String,
    observaciones : String,
});


module.exports = mongoose.model('Ingresos', PagosSchema);