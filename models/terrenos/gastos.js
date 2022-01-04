var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var GastosSchema = new Schema({
    fecha : Date,
    descripcion : String,
    importe : Number,
    modoDePago : String,
    observaciones : String,
});


module.exports = mongoose.model('Gastos', GastosSchema);