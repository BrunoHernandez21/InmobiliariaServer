var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Checklist = new Schema({
    name: String,
    type: {type:String,default:"OTROS"},
    tiene: Boolean,
});


module.exports = Checklist;
