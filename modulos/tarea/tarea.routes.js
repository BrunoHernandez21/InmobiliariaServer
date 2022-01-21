var express = require('express');
var app = express();
var TareaController = require ('../tarea/tarea.controller');
const mdAutenticacion = require("../../middlewares/autenticacion");

//Crear
app.post('', TareaController.crear);
//consultar
app.get('/list/activos', [mdAutenticacion.verificaToken], TareaController.consultaActivos);         //✓
app.get('/:id',TareaController.consulta);                                   //✓
//Actualizar
app.put('/:id',[mdAutenticacion.verificaToken],TareaController.actualizarTarea)
//listado de tareas
app.get('/list/:page',[mdAutenticacion.verificaToken], TareaController.consultaPaginado);         //✓
app.get('/list/:page/:pageSize',[mdAutenticacion.verificaToken], TareaController.consultaPaginado);         //✓
app.post('/list/:page/:pageSize',[mdAutenticacion.verificaToken], TareaController.consultaPaginado);        //✓
app.get('/ctg/estados', TareaController.catalogoEstados);                   //✓

//app.get('/list-user/:page/:pageSize',[mdAutenticacion.verificaToken], TareaController.consultaPaginado);         //✓


//Opciones de administrador
//app.put('/:id',[mdAutenticacion.verificaToken], TareaController.crear);     //✓
app.delete('/:id',[mdAutenticacion.verificaToken], TareaController.crear);  //✓


module.exports = app;