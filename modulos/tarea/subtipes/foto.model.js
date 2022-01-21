var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Foto = new Schema({
    url: String,
    descripcion: String,
    type: String,
    size: Number
});

module.exports = Foto;
