var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;
var ApiKey = require('../models/administracion/api-key');

/////////////////// Traductor o estandarizador de datos///////////////// 

// solo checa si la secion esta activa
// comparando el token (llave o cadena de texto)
// con la cadena de texto en la base de datos
exports.verificaToken = function(req, res, next) {
    const token = req.get('authorization')?.split(' ')[1] || req.get('token') || '';

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