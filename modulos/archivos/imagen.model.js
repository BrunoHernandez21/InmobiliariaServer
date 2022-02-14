var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ImageSchema = new Schema({
    default: Boolean,
    orden: Number,
    url: String,
    type: String,
    producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: false},
});


module.exports = mongoose.model('Image', ImageSchema);