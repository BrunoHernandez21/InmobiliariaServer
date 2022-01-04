var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProductoSchema = new Schema({
    
    name: { type: String, required: [true, 'El nombre es necesario']},
    handle: { type: String },
    description: { type: String },
    categories: [{  type: Schema.Types.ObjectId, ref: 'Categorias', required: false }],
    subCategories: [{  type: Schema.Types.ObjectId, ref: 'SubCategorias', required: false }],
    tags: [{ type: String }],
    images: [{ type: Schema.Types.ObjectId, ref: 'Image', required: false}],
    priceTaxExcl: { type: Number },
    priceTaxIncl: { type: Number },
    taxRate: { type: Number },
    comparedPrice: { type: Number },
    quantity: { type: Number },
    sku:  { type: String },
    serie:  { type: String },
    seriemotor:  { type: String },
    modelo:  { type: String },
    marca:  { type: String },

    cotizaHoras: { type: Boolean },
    cotizaDias: { type: Boolean },


    width:  { type: String },
    height:  { type: String },
    depth:  { type: String },
    weight:  { type: String },
    extraShippingFee: { type: Number },
    active: {type: Boolean, default: 1},
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    owner : {  type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    specs:  { type: String },
    attributes:  { type: String },

});


module.exports = mongoose.model('Producto', ProductoSchema);