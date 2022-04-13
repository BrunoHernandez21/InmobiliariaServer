var express = require('express');
var app = express();
var TipoController = require ('./tipos.controller');
var SubTipoController = require ('./subtipos.controller');

const mdAutenticacion = require("../../../middlewares/autenticacion");

//[mdAutenticacion.verificaToken]
//TIPOS
//Crear
app.post('/type', [],TipoController.crear);
//Consulta
app.get('/type/:id', [],TipoController.consulta)
app.get('/typenamed/:nombre', [],TipoController.consulta)


//Actualizar
app.put('/type/:id', [],TipoController.actualizar)
//eliminar
app.delete('/type/:id', [], TipoController.deleteInstance);

app.get('/types', TipoController.consultaActivos);

//SUBTIPOS
//Crear
app.post('/subtype/:id', [],SubTipoController.crear);
//Consulta
app.get('/subtype/:id', [],SubTipoController.consulta)
//Actualizar
app.put('/subtype/:id', [],SubTipoController.actualizarSubtipo)
//eliminar
app.delete('/subtype/:id', [], SubTipoController.deleteSubtipo);

app.get('/subtypes/:id', SubTipoController.consultaActivos);


module.exports = app;