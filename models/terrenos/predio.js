var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PredioSchema = new Schema({
    
    lote : String,
    manzana : String,
    ancho : String,
    largo : String,
    estatus: {type: Boolean, default: 1},
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    category : {  type: Schema.Types.ObjectId, ref: 'Categorias', required: false },
    complejo : {  type: Schema.Types.ObjectId, ref: 'Complejos' },
    estado: String,
    coordenadas : [{type:Schema.Types.Mixed, required: false}],
    area : Number,
    precio : Number,
    refNorte : String,
    refSur : String,
    refOriente : String,
    refPoniente : String,
    lngNorte : String,
    colindaNorte : String,
    lngSur : String,
    colindaSur : String,
    lngEste : String,
    colindaEste : String,
    lngOeste : String,
    colindaOeste : String,
    comprobPosesion: String,
    fechaPosesion: Date,
});


module.exports = mongoose.model('Predio', PredioSchema);