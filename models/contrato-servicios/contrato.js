var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var estatusValidos = {
    values: ['PAGADO','PENDIENTE_DE_PAGO','VENCIDO'],
    message: '{VALUE} no es un estatus permitido'
};

var ContratoSchema = new Schema({
    numeroContrato: { type: String, required: [true, 'El Numero de Contrato es necesario'] },
    password: { type: String, required: [false, 'La contraseña es necesaria'] },
    fechaInicio: { type: Date, required: [true, 'La Fecha de Inicio es necesaria'] },
    fechaFin: { type: Date, required: [true, 'La Fecha de Fin es necesaria'] },
    importe : Number,
    descuento : Number,
    estatus: [{name: String}],
    ciudad: String,
    zonaHoraria: Number,
    longitud: Number,
    latitud: Number,
    pdf : String,
    nombreSolicitante: String,
    apellidoSolicitante: String,
    fechaNacimientoSolicitante: String,
    telefono : String,
    tipoContrato : String,
    servicioUno : Date,
    servicioDos : Date,
    servicioTres : Date,
    servicioUnocheck : Boolean,
    servicioDoscheck : Boolean,
    servicioTrescheck : Boolean,
    urlMaps : String,
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    owner : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
});

ContratoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = mongoose.model('Contrato', ContratoSchema);