var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;
var ApiKey = require('../models/administracion/api-key');
const Authentication = require("../modulos/auth/authentication.model");

exports.pushNotificationHeader = function(req, res, next) {
    const messagingToken = req.get('messagingToken');

    req.messagingToken = messagingToken;
    //console.log(req);
    next();
}
/*
 * Checa si la sesion esta activa comprobando la validez del token jwt,
 * si este es incorrecto o expirado retorna un error para no continuar con la peticion.
 */

exports.verificaToken = function(req, res, next) {
    const token = req.get('authorization')?.split(' ')[1] || req.get('token') || '';
    //const pushNotificationToken = req.get('pushNotificationToken');
    //se utiliza body o get porque puede ser post o ser put la peticion
   //const token = req.body.token || req.get('token')||'';
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }
        
        req.usuario = decoded.usuario;//? porque hacer esto
        req.partner = decoded.partner;
        //req.pushNotificationToken = pushNotificationToken;
        //console.log(req);
        next();
    });
}


/* // De momento esto esta inutilizado


// apikey es una extructura de datos hija de mongoso que adquiere sus propiedades como 
// encontrar una coincidencia de esas propiedades en la base de datos
// seria preferible estandarizar los nombres para no repetir token
exports.verificaApiKey = function(req, res, next) {
    const token = req.get('API-KEY') || '';
    var origin = req.get('origin');
    var host = req.get('host');
    var host = origin?origin:host;
    ApiKey.findOne({host:host, apikey: token}, (err, info) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }
        if(info){
            req.partner = info.partner;
            next();
        }else{
            return res.status(401).json({
                ok: false,
                mensaje: 'No existe este token asociado a este host',
                errors: err
            });
        }
    });
}*/