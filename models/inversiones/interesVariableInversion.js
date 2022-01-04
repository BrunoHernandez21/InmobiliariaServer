var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var InteresVariableSchema = new Schema({
    created: {type: Date, default: new Date()},
    updated: {type: Date},
    active: {type: Boolean, default: 1},
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    year : {  type: Number, required: false },
    profits: [],
});


module.exports = mongoose.model('InteresVariable', InteresVariableSchema);