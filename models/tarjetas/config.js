var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ConfigSchema = new Schema({

    nombre: String,
    bgcolor: String,
    color: String,
    bgcolorfoot: String,
    bgcolorbutton: String,
    namecolor: String,
    titlecolor: String,
    labelcolor: String,
    mbuttoncolor: String,
    labelbordercolor: String,
    labeliconcolor: String,
    surnamecolor: String,
    slogancolor: String,
    marcoavatarcolor: String,

    labeldir: String,
    labelemail: String,
    labeltel: String,
    labelcel: String,
    labelwa: String,
    textwa: String,
    themeicons: String,
    logowidth: String,
    callbutton: String,


    grupo: {  type: Schema.Types.ObjectId, ref: 'Grupo', required: false },
    empresa: {  type: Schema.Types.ObjectId, ref: 'Empresa', required: false },
    owner : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    copia: {type: Number, default:0},
});


module.exports = mongoose.model('Configuracion', ConfigSchema);

