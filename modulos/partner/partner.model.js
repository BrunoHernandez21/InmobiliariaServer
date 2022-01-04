var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var PartnerSchema = new Schema({
    
    nombre: { type: String,  required: [true, 'El nombre es necesario']},
    host: { type: String, unique: true, required: [true, 'El host es necesario'] },
    img: String,
    theme: String,
    background: String,
    colorTheme: String,

    owner: {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    relatedPartner: {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
});

PartnerSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = mongoose.model('Partner', PartnerSchema);