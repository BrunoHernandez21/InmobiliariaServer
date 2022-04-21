var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ApiKeySchema = new Schema({
    origen: { type: String, unique: true, required: [true, 'El host es necesario'] },
    apikey: String,
    type: String,
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner' }
});


module.exports = mongoose.model('ApiKey', ApiKeySchema);

