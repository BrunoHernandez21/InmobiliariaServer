var express = require('express');
var app = express();
var MenuController = require ('../menus/menu.controller');
const mdAutenticacion = require("../../../middlewares/autenticacion");

app.get('',MenuController.consultaByRol);

app.post('', MenuController.crear);

app.get('/list/:page/:pageSize', MenuController.consultaPaginado);
//listado por busqueda, se acepta uso de body en la petición
app.post('/list/:page/:pageSize', MenuController.consultaPaginado);


app.get('/:id',MenuController.consulta);
app.put('/:id',[mdAutenticacion.verificaToken], MenuController.crear);
app.delete('/:id',[mdAutenticacion.verificaToken], MenuController.crear);


module.exports = app;