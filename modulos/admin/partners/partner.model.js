var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

/**
 * Un partner es un socio definido por una url de acceso unica.
 * @type {module:mongoose.Schema<Document, Model<Document, any, any>, undefined, {}>}
 */
var PartnerSchema = new Schema({
    
    nombre: { type: String,  required: [true, 'El nombre es necesario']},
    img: String,
    theme: String,
    background: String,
    colorTheme: String,

    conekta:{
            publicApiKey: String,
            privateApiKey: String
            },

    owner: {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    relatedPartner: {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
});

PartnerSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = mongoose.model('Partner', PartnerSchema);