var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var GrupoSchema = new Schema({
    
    nombre: { type: String, required: [true, 'El nombre es necesario']},
    empresa: {  type: Schema.Types.ObjectId, ref: 'Empresa'},
    appGrupo: String,
    wwwGrupo: String,
    telGrupo: String,
    celGrupo: String,
    waGrupo: String,
    owner : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    partner: {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    configuracion: {  type: Schema.Types.ObjectId, ref: 'Configuracion', required: false },
    users: [{ type: Schema.Types.ObjectId, ref: 'Usuario', required: false}],
    copia: {type: Number, default:0},
});


module.exports = mongoose.model('Grupo', GrupoSchema);