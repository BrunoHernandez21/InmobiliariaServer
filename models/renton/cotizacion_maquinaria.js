var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CotizacionMaquinariaSchema = new Schema({

    cel: String,
    email: String,
    files: {
        riesgoEmpresa: String,
        riesgoRepLegal: String,
        letrasCambio: String,
        rut: String,
        dni: String,
        vigenciaPoder: String
    },
    products: [{
        cantidad: Number,
        days:  Number,
        fechaFinal: Date,
        fechaInicial: Date,
        hours: Number,
        producto: Schema.Types.Mixed
        }
        ],

    lugarAtencion: String,
    nombre: String,
    razonSocial: String,
    rut: String,
    tel: String,
    lat: Number,
    lng: Number,
    refer: String,
    requiereCredito: Boolean,
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    owner : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },

});

module.exports = mongoose.model('CotizacionMaquinaria', CotizacionMaquinariaSchema);