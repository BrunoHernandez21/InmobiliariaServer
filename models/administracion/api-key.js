var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ApiKeySchema = new Schema({
    host: String,
    apikey: String,
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner' },  

});


module.exports = mongoose.model('ApiKey', ApiKeySchema);

