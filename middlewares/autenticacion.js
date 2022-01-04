var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;
var ApiKey = require('../models/administracion/api-key');
var Role = require('../models/administracion/role');

// ==========================================
//  Verificar token
// ==========================================
exports.verificaToken = function(req, res, next) {

    //var token = req.query.token;
    const token = req.get('authorization')?.split(' ')[1] || req.get('token') || '';
    //token = token.replace('Bearer ')



    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;
        req.partner = decoded.partner;
        next();
    });

}


exports.verificaApiKey = function(req, res, next) {

    const token = req.get('API-KEY') || '';
    var origin = req.get('origin');
    var host = req.get('host');

    var host = origin?origin:host;

    console.log('host  : ' + host + ' apikey  : ' + token);

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

}

// ==========================================
//  Verificar ADMIN
// ==========================================
exports.verificaADMIN_ROLE = function(req, res, next) {
    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto de administración',
            errors: { message: 'No es administrador' }
        });

    }


}


