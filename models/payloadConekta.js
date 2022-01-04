var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PayloadConektaSchema = new Schema({
    
    body : Schema.Types.Mixed,
    fecha : {  type: Date, default: Date.now },  
    type: String,
    ip: String,
    hostname: String

});


module.exports = mongoose.model('PayloadConekta', PayloadConektaSchema);




