var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Checklist = new Schema({
    nombre: String,
    type: {type:String,default:"OTROS"},
    tiene: Boolean,
});


module.exports = Checklist;
