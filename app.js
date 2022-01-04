/*
    Aqui se hace la inicializacion del servidor asi como la llamada y configuracion del mismo
    servidor corriendo en expres 4.16.2
*/ 
var express = require('express');
var bodyParser = require('body-parser');
////////////////////////////////////// Instacia express
var app = express();
///// configuracion de expres
// Iniciando CORS
app.use(function(req, res, next) {
    //TODO: Revisar cada uno de estos metodos
    res.header("x-token", "*");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Authorization, API-KEY, X-TOKEN, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// Formato de peticiones 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//////////////////////// Creacion de las rutas
//////////// Declaracion
var auth = require ('./modulos/auth/auth.routes');                              //✓
var tareasRoutes = require ('./modulos/tarea/tarea.routes');                    //✓
var menuRoutes = require ('./modulos/admin/menus/menu.routes');                 //X para que son
var usuariosRoutes = require ('./modulos/admin/usuarios/usuario.routes');       //X Para que tienes usuarion si tienes auth
//var uploadRoutes = require('./routes/upload-imagen/upload');                  //X
//var imagenesRoutes = require('./routes/upload-imagen/imagenes');              //X
//////////// Implementacion
app.use('/api/auth', auth);
app.use('/api/tarea', tareasRoutes);
app.use('/api/usuario', usuariosRoutes);
app.use('/api/common/navigation', menuRoutes);
//app.use('/api/', compruebaAccesoRuta);
//app.use('/api/upload', uploadRoutes);
//app.use('/api/img', imagenesRoutes);

// Exportacion de express y ya configurado
module.exports = app;