var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var EncuestaSchema = new Schema({
    nivelTransformacion : Number,
    tecnologia :  Number,
    medioDistribucion :   Number,
    mercado :  Number,
    registroInfo :  Number,
    medioTomaDatos :  Number,
    fuenteEnergetica :  Number,
    gestionResiduos :  Number,
    condicionOperarios :  Number,
    tiposCapacitacion :  Number,
    plantaProd :  Number,
    escala :  Number,
    formaDeProduccion :  Number,
    gestionDePropiedad :  Number,
    total : Number,
    email :  String,

    lead : {  type: Schema.Types.ObjectId, ref: 'Lead', required: false },
 
});


module.exports = mongoose.model('Encuestas', EncuestaSchema);