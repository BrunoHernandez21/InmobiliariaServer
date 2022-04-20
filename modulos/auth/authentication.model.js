var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
//esquema pata mongoose
var Schema = mongoose.Schema;


var rolesValidos = {
    values: ['ADMIN_ROLE','ROOT_ROLE','USER_ROLE', 'USER_SALE_CONTRACT',
             'ROLE_SALE_PROMOTOR','ROLE_PROMOTOR', 'ROLE_COACH', 'ROLE_GERENCIA'],
    message: '{VALUE} no es un rol permitido'
};


var authenticationSchema = new Schema({
    // default fields
    email: { type: String, unique: true,required: true},
    password: { type: String, required: true},
    role: { type: String, required: true, default: 'USER_ROLE' },
    roles: [String],
    verify:  { type: Boolean, required: true, default:false},
    estatus: { type: Boolean, required: true, default:true},

    pushNotificationToken: String,
    user : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },

    // control fields
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    owner : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
}, {
     timestamps: true
});

authenticationSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Authentication', authenticationSchema);
