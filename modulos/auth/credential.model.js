var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
//esquema pata mongoose
var Schema = mongoose.Schema;


var rolesValidos = {
    values: ['ADMIN_ROLE','ROOT_ROLE','USER_ROLE', 'USER_SALE','USER_SALE_CONTRACT',
             'ROLE_SALE_PROMOTOR','ROLE_PROMOTOR', 'ROLE_COACH', 'ROLE_GERENCIA'],
    message: '{VALUE} no es un rol permitido'
};


var credentialSchema = new Schema({
    // default fields
    email: { type: String, unique: true,required: true},
    password: { type: String, required: true},
    role: { type: String, required: true, default: 'USER_ROLE' },
    roles: [String],
    verify:  { type: Boolean, required: true, default:false},
    estatus: { type: Boolean, required: true, default:true},
    //info fields
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    surname: { type: String, required: false},
    middlename: { type: String, required: false },
    country : { type: String, required: false },
    geolocation: { latitud: Number, longitud: Number},
    rfc : { type: String, required: false },
    curp : { type: String, required: false },
    birthdate : { type: Date, required: false },
    language: { type: String, required: false },
    phone: { type: String, required: false },
    celular: { type: String, required: false },
    about : { type: String, required: false },
    gender : { type: String, required: false },
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

credentialSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Credential', credentialSchema);
