var mongoose = require('mongoose');
const Foto  = require('./subtipes/foto.model');
var Schema = mongoose.Schema; 

var estatusTarea = {
    values: ['ACTIVA', 'BORRADA', 'OCULTA'],
    message: '{VALUE} no es un estatus valido'
};
var estadoTarea = {
    values: [,'CANCELADA','BORRADOR', 'SIN_ASIGNAR', 'PROCESO','TERMINADA',  'APROBANDO'],
    message: '{VALUE} no es un estatus valido'
};


var TareaSchema = new Schema({
    nombreCliente: {type:String},
    estado:  { type: String, enum: estadoTarea, default: 'BORRADOR' },
    fecha : {  type: Date, default: Date.now },
    estatus:  { type: String, enum: estatusTarea, default: 'ACTIVA' },
    tipo: {type:String},
    cel: {type:Number},
    tel:{type:Number},

    fotos:[Foto],
    fotosAdicionales: [Foto],
    notas: [{type:String}],
    firma:{ type: String},

    direccion: String,
    geolocation:{ latitud: Number, longitud: Number},
    descuento:{ type: String},
    duracion:{ type: String},
    hora:{ type: String},
    fechaAvaluo: {type: Date, default:Date.now()},
    metodoPago:{ type: String},

    tipoAvaluo: String, //Casa, Departamento, Bodega
    
    costo: Number,
    total:{ type: String},
    objetos: [{type:String}],
    sugerencias: [{type:String}],
    owner : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    usuario : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
});


module.exports = mongoose.model('Tarea', TareaSchema);
module.exports.estatusTarea = estatusTarea;
module.exports.estadoTarea = estadoTarea;
