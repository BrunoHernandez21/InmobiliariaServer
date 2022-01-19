var express = require('express');
var app = express();
var TareaController = require ('../tarea/tarea.controller');
const mdAutenticacion = require("../../middlewares/autenticacion");


app.post('', TareaController.crear);
app.get('/:id',TareaController.consulta);                                   //✓
//listado de tareas
app.get('/list/:page/:pageSize', TareaController.consultaPaginado);         //✓
app.post('/list/:page/:pageSize', TareaController.consultaPaginado);        //✓
app.get('/ctg/estados', TareaController.catalogoEstados);                   //✓


//Opciones de administrador
app.put('/:id',[mdAutenticacion.verificaToken], TareaController.crear);     //✓
app.delete('/:id',[mdAutenticacion.verificaToken], TareaController.crear);  //✓


module.exports = app;