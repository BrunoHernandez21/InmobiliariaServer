var express = require('express');
var app = express();
const fileUpload = require("express-fileupload");

app.use(fileUpload());

var mdAutenticacion = require('../../middlewares/autenticacion');
var ImagesController = require ('./upload.controller');

app.get('/:tipo/:filename', mdAutenticacion.verificaToken, ImagesController.getImage);
app.delete('/:id'  , ImagesController.getImage);
app.post('/:tipo', mdAutenticacion.verificaToken, ImagesController.subirArchivo);


module.exports = app;   