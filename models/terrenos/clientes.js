var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ClientesSchema = new Schema({
    
    nombre: String,
    surname: String,
    direccion: String,
    telefonoCelular: String,
    telefonoReferenciaUno: String,
    telefonoReferenciaDos: String,
    urlMaps: String,
    latitud : Number,
    longitud : Number,

    nombreReferenciaUno : String,
    nombreReferenciaDos : String,
    RFC : String,
    fechaNacimiento : Date,
    email : String,
    sexo : String,
});


module.exports = mongoose.model('Clientes', ClientesSchema);