var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ImiEncuestaSchema = new Schema({
    empresa: { type: String, required: [true, 'El nombre de empresa es necesario'] }, 
    fechaCreacion : Date,
    
    consecutivo : Number,
    nivelTransformacion: Number,
    tecnologia: Number,
    medioDistribucion: Number,
    mercado: Number,
    registroInfo: Number,
    medioTomaDatos: Number,
    fuenteEnergetica: Number,
    gestionResiduos: Number,
    condicionOperarios: Number,
    tiposCapacitacion: Number,
    plantaProd: Number,
    escala: Number,
    formaDeProduccion: Number,
    gestionDePropiedad: Number,

    owner : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },

});

module.exports = mongoose.model('ContratoInversion', ImiEncuestaSchema);