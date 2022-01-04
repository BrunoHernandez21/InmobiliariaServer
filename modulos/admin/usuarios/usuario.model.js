var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    surname: { type: String, unique: true, required: true},

    name: { type: String, required: true },
    middlename: { type: String, required: true },
    lastname: { type: String, required: false },
    country : { type: String, required: false },
    geolocation: { latitud: Number, longitud: Number},
    rfc : { type: String, required: false },
    curp : { type: String, required: false },
    birthdate : { type: Date, required: false },
    email: { type: String, required: false },
    language: { type: String, required: false },
    phone: { type: String, required: false },
    celular: { type: String, required: false },

    about : { type: String, required: false },
    gender : { type: String, required: false },
    status: {type: Boolean,  default:true},
    title: String,
    company: String,

    address : { type: String, required: false },
    address_components: Schema.Types.Mixed,
    zonaHoraria: Number,

    urlMaps : { type: String, required: false },
    numeroCliente : { type: String, required: false },
    numeroVendedor: { type: String, required: false },
    personalReferences: [{phone: String, name: String}],



    // control fields
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    owner : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },


    created : { type: Date, required: false , default: Date.now },
    updated : { type: Date, required: false , default: Date.now }


});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);
