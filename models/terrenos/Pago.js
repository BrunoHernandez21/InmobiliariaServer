var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var estatusPagos = {
    values: ['PENDIENTE','PAGADO', 'MORA', 'BORRADO'],
    message: '{VALUE} no es un estatus valido'
};

var tipoOperacion = {
    values: ['INGRESO','EGRESO'],
    message: '{VALUE} no es una operación valida'
};

var tiposPagoValidos = {
    values: ['MENSUAL','ENGANCHE', 'ESPECIAL'],
    message: '{VALUE} no es un tipo permitido'
};

var mediosPagoValidos = {
    values: ['EFECTIVO','TRANSFERENCIA', 'OTRO', 'CUENTA1', 'CUENTA2', 'CUENTA3', 'DEPOSITO_CUENTA'],
    message: '{VALUE} no es un tipo permitido'
};

var PagoSchema = new Schema({
    fechaProgramada : Date,
    fecha : Date, //fecha de pago
    complejo : {  type: Schema.Types.ObjectId, ref: 'Complejos', required: false },
    descripcion : String,
    importe : Number,
    observaciones : String,
    estatus: { type: String, required: true, enum: estatusPagos },
    contrato : {  type: Schema.Types.ObjectId, ref: 'ContratoTerreno', required: false },
    diasRetraso : Number,
    penalidad : Number,
    importePenalidad : Number,
    tipoPago : { type: String, enum: tiposPagoValidos },
    operacion:  { type: String, enum: tipoOperacion, default: 'INGRESO' },
    modoDePago : { type: String, enum: mediosPagoValidos },
    medioPago: String,
    tipoPagoObservacion: String,
    medioPagoObservacion: String,
    engancheMensualidad : String,
    pagado : Boolean,
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    owner : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
});


module.exports = mongoose.model('Pagos', PagoSchema);