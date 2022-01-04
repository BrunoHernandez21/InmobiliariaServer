var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var estatusTarea = {
    values: ['ACTIVA', 'BORRADA', 'OCULTA'],
    message: '{VALUE} no es un estatus valido'
};
var estadoTarea = {
    values: ['BORRADOR', 'SIN_ASIGNAR', 'ASIGNADO', 'TERMINADA', 'PROCESO', 'CANCELADA'],
    message: '{VALUE} no es un estatus valido'
};


var TareaSchema = new Schema({
    
    fecha : {  type: Date, default: Date.now },
    tipo: String,
    estatus:  { type: String, enum: estatusTarea, default: 'ACTIVA' },
    estado:  { type: String, enum: estadoTarea, default: 'BORRADOR' },

    tipoAvaluo: String, //Casa, Departamento, Bodega
    nombreCliente: String,
    fechaAvaluo: String,
    direccion: String,
    ubicacion: { latitud: Number, longitud: Number},
    fotos: [],
    fotosAdicionales: [],
    costo: Number,
    notas: [{type: String}],
    checklist: [{type: String}],
    owner: {}
});


module.exports = mongoose.model('Tarea', TareaSchema);
module.exports.estatusTarea = estatusTarea;
module.exports.estadoTarea = estadoTarea;
