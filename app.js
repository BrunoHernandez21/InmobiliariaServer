/*  Aqui se hace la inicializacion del servidor asi como la llamada y configuracion del mismo
    servidor corriendo en expres 4.16.2    
*/ 
var express = require('express');
var bodyParser = require('body-parser');
// Instacia express
var app = express();
//  Configuracion de expres
//      Iniciando CORS
app.use(function(req, res, next) {
    //TODO: Revisar cada uno de estos metodos
    res.header("x-token", "*");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Authorization, API-KEY, X-TOKEN, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

//      Formato de peticiones 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//      Creacion de las rutas
//          Declaracion
var auth = require ('./modulos/auth/auth.routes');                              //✓ Solo para logiar
var tareasRoutes = require ('./modulos/tarea/tarea.routes');                    //✓ Las tareas
var catalogosRoutes = require ('./modulos/tarea/catalogos/catalogos.routes');                    //✓ Las tareas

var uploadRoutes = require ('./modulos/archivos/upload.routes');
//          implementacion
app.use('/api/auth', auth);
app.use('/api/tarea', tareasRoutes);
app.use('/api/tareas', catalogosRoutes);

app.use('/api/archives', uploadRoutes);

module.exports = app;