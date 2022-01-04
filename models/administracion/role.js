var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoleSchema = new Schema({
    nombrePublico: { type: String, required: false },
    nombrePrivado: { type: String, required: false },
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner' },
});

module.exports = mongoose.model('Role', RoleSchema);