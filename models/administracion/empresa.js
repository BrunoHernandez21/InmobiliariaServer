var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var EmpresaSchema = new Schema({
    
    org: { type: String, required: [true, 'El nombre es necesario']},
    dir: { type: String, required: [true, 'La direccion es necesaria'] },
    facebook: String,
    app: String,
    www: String,
    tel: String,
    cel: String,
    wa: String,
    img: String,
    vendor : String,
    urlMaps : String,
    lat : Number,
    long : Number,
    owner : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    partner: {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    configuracion: {  type: Schema.Types.ObjectId, ref: 'Configuracion', required: false },
});


module.exports = mongoose.model('Empresa', EmpresaSchema);