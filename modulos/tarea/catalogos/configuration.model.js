var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var ConfigurationSchema = new Schema({
    name: {type:String},
    type: {type:String},
    value: {typ:String},
    options: [{type:String}],
    owner : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false }
});


module.exports = mongoose.model('Configuration', ConfigurationSchema);

