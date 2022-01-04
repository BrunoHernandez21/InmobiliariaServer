var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MenuSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario']},
    rol: String,
    role: {  type: Schema.Types.ObjectId, ref: 'Role', required: false },
    partner: {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    menu: Schema.Types.Mixed
});

module.exports = mongoose.model('Menu1', MenuSchema);