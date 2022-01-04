var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommissionSchema = new Schema({
    
    montoMinimo: { type: Number },
    montoMaximo: { type: Number },
    commission: { type: Number },
    active: {type: Boolean, default: 1},
    partner : {  type: Schema.Types.ObjectId, ref: 'Partner', required: false },
    created: {type: Date, default: new Date()},
    updated: {type: Date},
    trimestre: { type: Number },
});


module.exports = mongoose.model('Commission', CommissionSchema);