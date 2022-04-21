var express = require('express');
var mdAutenticacion = require('../../../middlewares/autenticacion');
var app = express();
var UsuariosControler= require ('./usuarios.controller');


app.get('/lista', [mdAutenticacion.verificaToken], UsuariosControler.obtenerUsuarios);
app.get('/lista/:page', [mdAutenticacion.verificaToken], UsuariosControler.obtenerUsuarios);
app.get('/lista/:page/:pageSize', [mdAutenticacion.verificaToken], UsuariosControler.obtenerUsuarios);


app.get('/:id', [mdAutenticacion.verificaToken], UsuariosControler.obtenerPorIdUsuario);
app.get('/', [mdAutenticacion.verificaToken], UsuariosControler.obtenerPorIdUsuario);


//app.post('//', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], UsuariosControler.obtenerUsuariosConPaginacion);//5 en 5


//app.get('/ClientesExport', [mdAutenticacion.verificaToken], UsuariosControler.obtenerClientesExport);// sin paginacion

//app.get('/usuarioSolicitudes', UsuariosControler.obtenerUsuariosSolicitudes);
app.put('/', [mdAutenticacion.verificaToken], UsuariosControler.actualizarUsuario);

app.put('/:id', [mdAutenticacion.verificaToken], UsuariosControler.actualizarUsuario);

// ==========================================
// Crear un nuevo usuario
// ==========================================
app.post('/usuario',UsuariosControler.crearUsuario);
// app.post('/lead',UsuariosControler.crearLead);

// ============================================
//   Borrar un usuario por el id
// ============================================
app.delete('/usuario/:id', [mdAutenticacion.verificaToken], UsuariosControler.eliminarUsuario);

//app.get('/dashboard', [mdAutenticacion.verificaToken], UsuariosControler.obtenerClientesParaDashboardPorPartner);


module.exports = app;
