var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;


var rolesValidos = {
    values: ['ADMIN_ROLE','ROOT_ROLE','USER_ROLE', 'USER_SALE','USER_SALE_CONTRACT',
             'ROLE_SALE_PROMOTOR','ROLE_PROMOTOR', 'ROLE_COACH', 'ROLE_GERENCIA'],
    message: '{VALUE} no es un rol permitido'
};


var credentialSchema = new Schema({
    password: { type: String, required: [false, 'La contraseña es necesaria'] },
    img: { type: String, required: false },
    name: { type: String, required: false },
    surname: { type: String, required: false },
    email: { type: String, unique: true, required: [false, 'El correo es necesario'] },
    role: { type: String, required: true, default: 'USER_ROLE' },
    roles: [String],
    verify:  { type: Boolean, required: true, default:true },
    estatus: { type: Boolean, required: true, default:true }
});

credentialSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Credential', credentialSchema);
