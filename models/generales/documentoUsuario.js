var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var estatusValidos = {
    values: ['APROBADO','PENDIENTE','RECHAZADO'],
    message: '{VALUE} no es valido este estatus'
};


var documentoUsuarioSchema= new Schema({
    usuario : {  type: Schema.Types.ObjectId, ref: 'Usuario'},
    nombre: String,
    tipo: String,
    url: String,
    estatus: Boolean,
    estado: { type: String, required: true, enum: estatusValidos },

    numero: { type: Number, required: false },
    vencimiento: { type: String, required: false },
    observacion: { type: String, required: false } 
});

module.exports = mongoose.model('DocumentoUsuario', documentoUsuarioSchema);
