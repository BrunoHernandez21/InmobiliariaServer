var express = require('express');
var app = express();

var mdAutenticacion = require('../../../middlewares/autenticacion');
var UsuariosControler= require ('./usuarios.controller');
//Cosas necesarias 
app.get('/:id', [mdAutenticacion.verificaToken], UsuariosControler.obtenerPorIdUsuario);
app.put('/:id', [mdAutenticacion.verificaToken], UsuariosControler.actualizarUsuario);
app.post('/usuario',UsuariosControler.crearUsuario);
app.delete('/:id', [mdAutenticacion.verificaToken], UsuariosControler.eliminarUsuario);
//Cosas que deberia eliminar
app.get('/', [mdAutenticacion.verificaToken], UsuariosControler.obtenerPorIdUsuario);
app.put('/', [mdAutenticacion.verificaToken], UsuariosControler.actualizarUsuario);
//Solo para admin
app.get('/lista', [mdAutenticacion.verificaToken], UsuariosControler.obtenerUsuarios);
app.get('/lista/:page', [mdAutenticacion.verificaToken], UsuariosControler.obtenerUsuarios);
app.get('/lista/:page/:pageSize', [mdAutenticacion.verificaToken], UsuariosControler.obtenerUsuarios);

module.exports = app;
