var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ConsultaSchema = new Schema({
    
    llave : String,
    valor: Schema.Types.Mixed
});


module.exports = mongoose.model('Consulta', ConsultaSchema);