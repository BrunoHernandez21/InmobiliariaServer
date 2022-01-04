'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TemplateSchema = Schema({
    code: String,
    subject: String,
    name: String,
    from: String,
    to: String,
    toCC: String,
    toCCO: String,

    content: String,

    created:  { type: Date, default: Date.now },
    updated:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Template', TemplateSchema);