var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PayloadSchema = new Schema({
    
    body : Schema.Types.Mixed,
    fecha : {  type: Date, default: Date.now },  
    type: String,
    ip: String,
    hostname: String

});


module.exports = mongoose.model('Payload', PayloadSchema);



