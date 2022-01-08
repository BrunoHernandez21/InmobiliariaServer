/* Verificador de Roles de los Interesados */
var Role = require('../models/administracion/role');

exports.isAdmin = function(req, res, next) {
    var usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();//es lo aprueba la condicion
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto de administración',
            errors: { message: 'No es administrador' }
        });
    }
}

exports.isUser = function(req, res, next) {
    var usuario = req.usuario;
    if (usuario.role === 'USER_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto de administración',
            errors: { message: 'No es administrador' }
        });
    }
}

exports.isRoot = function(req, res, next) {
    var usuario = req.usuario;
    if (usuario.role === 'ROOT_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto de administración',
            errors: { message: 'No es administrador' }
        });
    }
}

exports.isAdmin = function(req, res, next) {
    var usuario = req.usuario;
    Role.find(usuario.role)
    if (usuario.role === 'ADMIN_ROLE') {
        next();//es lo aprueba la condicion
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto de administración',
            errors: { message: 'No es administrador' }
        });
    }
}