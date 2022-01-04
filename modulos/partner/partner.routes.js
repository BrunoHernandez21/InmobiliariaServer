var express = require('express');
var app = express();
var mdAutenticacion = require('../../middlewares/autenticacion');
var PartnerController= require ('../../controllers/administracion/partner.controller');

app.get('/partner-cfg', PartnerController.obtenerConfiguracionPartner);

app.get('/partner', [mdAutenticacion.verificaToken], PartnerController.obtenerPartnersSinPaginacion);

app.post('/partner', [mdAutenticacion.verificaToken], PartnerController.crearNuevoPartner);

app.post('/partners', [mdAutenticacion.verificaToken], PartnerController.obtenerPartners);

app.get('/partner/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], PartnerController.obtenerPorIdPartner) ;

app.delete('/partner/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], PartnerController.eliminarPartner);

app.put('/partner/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], PartnerController.actualizarPartner);

app.post('/sociosParaCombo', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], PartnerController.obtenerSociosParaCombo);


module.exports = app;