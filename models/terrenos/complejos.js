var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ComplejosSchema = new Schema({

    categoria : String,
    nombre: String,
    ubicacion: String,
    numeroPredios : Number,
    observaciones : String,
    urlMaps : String,
    comisionComplejo : Number,
    fechaDeApertura : Date,
    latitud : Number,
    longitud : Number,
    zoom: Number,
    center: {type:Schema.Types.Mixed, required: false},
    coordenadas : [{type:Schema.Types.Mixed, required: false}],
    area : Number,
    active :  {type: Boolean, default:0},
    estado: String,
    owner : { type: Schema.Types.ObjectId || String, ref: 'Usuario', required: false },
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    category : {  type: Schema.Types.ObjectId, ref: 'Categorias', required: false },
    creador : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
   
});


module.exports = mongoose.model('Complejos', ComplejosSchema);