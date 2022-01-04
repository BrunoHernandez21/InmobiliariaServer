var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var TarjetaSchema = new Schema({
    slug: { type: String, unique: true, required: [true, 'El Slug es necesario'] },
    name : { type: String, required: [true, 'El nombre es necesario']},
    surname: String,
    title: String,
    org: String,
    www: String,
    email: String,
    avatar: String,
    icono: String,
    icono192: String,
    logo: String,
   
    slogan: String,
    facebook: String,
    app: String,
    tel: String,
    cel: String,
    wa: String,

    urlMaps : String,
    lat : Number,
    long : Number,
    dir: String,

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
    labelorg : String,
    labelwa : String,

    textwa : String,

    themeicons: String,
    logowidth: String,
    callbutton: String,

    partner : { type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    empresa : { type: Schema.Types.ObjectId, ref: 'Empresa', required: false },
    grupo : { type: Schema.Types.ObjectId, ref: 'Grupo', required: false },
    user : { type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    owner : { type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    configuracion : { type: Schema.Types.ObjectId, ref: 'Configuracion', required: false },
    sale : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },

    links: [Schema.Types.Mixed],

    contador: {type: Number, default:0},
    copia: {type: Number, default:0},
    updated: { type: Date, default: new Date() },
    created: { type: Date, default: new Date() }

});

TarjetaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Tarjeta', TarjetaSchema);