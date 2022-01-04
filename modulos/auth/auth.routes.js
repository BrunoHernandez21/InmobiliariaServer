var express = require('express');
var app = express();
var mdAutenticacion = require('../../middlewares/autenticacion');   //gardians
var AuthController = require ('./auth.controller');                 //gardians

app.post('/login',                                                  AuthController.login);
app.post('/renuevatoken', [mdAutenticacion.verificaToken],          AuthController.renuevaToken);
app.get('/user', [mdAutenticacion.verificaToken],                   AuthController.getUserFromToken); //?
app.get('/verify-user', [mdAutenticacion.verificaToken],            AuthController.verifyUser);
app.get('/renuevatoken', [mdAutenticacion.verificaToken],           AuthController.renuevaToken);//TODO: eliminar
app.post('/Contrato', [mdAutenticacion.verificaToken],              AuthController.signByContrato);
app.post('/reset-password',                                         AuthController.resetPassword);
app.put('/update-password/:id', [mdAutenticacion.verificaToken],    AuthController.cambiarPassword);
app.post('/sign-up',                                                AuthController.crearUsuario);

module.exports = app;