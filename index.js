'use strict'


var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;




//inicias la conencciopn con la base de datos
mongoose.connect("mongodb://localhost:27017/servicios", {  useFindAndModify: false, useNewUrlParser: true, useCreateIndex: true  }, (err, res) => {
    if (err) throw err;//en caso de error manda el error y deten todo
    //inicias el servidor
    app.listen(port, () => {
        //TODO: retirar
        console.log('Express server puerto %s: \x1b[32m%s\x1b[0m', port,'online');
    });
});