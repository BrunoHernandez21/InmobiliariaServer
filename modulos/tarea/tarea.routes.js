var express = require('express');
var app = express();
var TareaController = require ('../tarea/tarea.controller');
const mdAutenticacion = require("../../middlewares/autenticacion");

////////////Tareas basicas
//Crear
app.post('/', [mdAutenticacion.verificaToken],TareaController.crear);                                                               //✓
//Actualizar
app.put('/:id',[mdAutenticacion.verificaToken],TareaController.actualizarTarea)                     //✓
//eliminar
app.delete('/:id',[mdAutenticacion.verificaToken], TareaController.deleteTarea);                    //✓
/////Frecuentes 
//consultar
app.get('/list/activos', [mdAutenticacion.verificaToken], TareaController.consultaActivos);         //✓
app.get('/:id',TareaController.consulta);                                                           //✓
app.get('/list/:page/:pageSize',[mdAutenticacion.verificaToken], TareaController.consultaPaginado); //✓


//listado de tareas
app.get('/list/:page',[mdAutenticacion.verificaToken], TareaController.consultaPaginado);           //✓

//app.post('/list/:page/:pageSize',[mdAutenticacion.verificaToken], TareaController.consultaPaginado);        //✓
app.get('/ctg/estados', TareaController.catalogoEstados);                   //✓

//app.get('/list-user/:page/:pageSize',[mdAutenticacion.verificaToken], TareaController.consultaPaginado);         //✓


//Opciones de administrador
//app.put('/:id',[mdAutenticacion.verificaToken], TareaController.crear);     //✓



module.exports = app;