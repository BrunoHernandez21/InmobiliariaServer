var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var Partner = require('../../models/administracion/partner');
// Load the MySQL pool connection
//const poolMysql = require('../../data/mariadb_config');
//var MailController = require('../../controllers/mail/mail.controller'); luego me encargo de esto

var SEED = require('../../config/config').SEED;
var Credential = require('./credential.model');


const SESSION_EXPIRES_AT = require('../../config/config').SESSION_EXPIRES_AT;

const payloadJwt = {
    expiresIn: SESSION_EXPIRES_AT
    //expiresIn: 14400
}


// ==========================================
//  Funciones de usuario
// ==========================================

//  Inicio de secion
function login(req, res) {
    var body = req.body;
    let filterUser = {email: body.email};
    Credential.findOne(filterUser) 
        .select('email img password name surname role roles partner estatus partner')
        .exec(async (err, usuarioDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al ingresar ',
                    errors: err
                });
            }

            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas, email no registrado',
                    errors: err
                });
            }

            if (usuarioDB.estatus !== true) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario Inactivo, contacta a tu Administrador para que active tu cuenta',
                    errors: err
                });
            }
            let user = {
                email: usuarioDB.email,
                name: usuarioDB.name,
                surname: usuarioDB.surname,
                _id: usuarioDB._id,
                role: usuarioDB.role,
                roles: usuarioDB.roles,
                img: usuarioDB.img
            };

            let payload = {
                usuario: user,
            };

            if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas',
                    errors: err
                });
            }

            var token = jwt.sign(payload, SEED, payloadJwt);


            res.status(200).json({
                ok: true,
                usuario: user,
                token: token
                //menu: data
            });


        });
};
//inicio de seccion por ID token
function renuevaToken(req, res) {
    //const token = req.get('authorization') || '';
    const token = req.body.accessToken || 'XXX';


    jwt.verify(token, SEED, (err, decoded) => {
        console.log(decoded);
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        var tokenNew = jwt.sign({usuario: decoded.usuario}, SEED, payloadJwt);

        res.status(200).json({
            authenticated: true,
            token: tokenNew
            //usuario: decoded.usuario,
            //partner: decoded.partner
        });
    });

};

// Crear un nuevo usuario
function crearUsuario(req, res) {
    var body = req.body;
    var usuario = new Credential({...body});

    if (body.password !== null && body.password !== undefined && body.password !== '') {
        usuario.password = bcrypt.hashSync(body.password, 10);
    } else {
        usuario.password = bcrypt.hashSync('123456', 10);
    }

    usuario.save(async (err, usuarioGuardado) => {
        if (err) {
            console.log('err :>> ', err);
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        
        var token = jwt.sign({usuario: usuario}, SEED, {expiresIn: 14400}); // 4 horas
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            token: token
        });
    });
}


//cambiar contraseña
function cambiarPassword(req, res) {
    var id = req.params.id;
    var body = req.body;

    if(!(req.usuario.role==='ROOT_USER' || req.usuario.role==='ADMIN_USER')){
        id = req.usuario._id;
    }

    Credential.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con id ' + id + ' no existe',
                errors: {message: 'No existe un usuario con ese id'}
            });
        }
        usuario.password = bcrypt.hashSync(body.password, 10);


        usuario.save( (err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            let userx = {
                _id: usuarioGuardado._id,
                name: usuarioGuardado.name,
                surname: usuarioGuardado.surname,
                email: usuarioGuardado.email,
                img: usuarioGuardado.img,
                role: usuarioGuardado.role
            };
            var tokenUser = jwt.sign({usuario: userx}, SEED, {expiresIn: 14400});
            console.log(tokenUser);

            res.status(200).json({
                ok: true,
                usuario: userx,
                token: tokenUser
            });

        });

    });

}




function getUserFromToken(req, res) {
    res.status(200).json(req.usuario);
};

function verifyUser(req, res) {

    const token = req.get('authorization')?.split(' ')[1] || '';


    jwt.verify(token, SEED, (err, decoded) => {
        console.log(decoded);
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        var tokenNew = jwt.sign({usuario: decoded.usuario}, SEED, payloadJwt);

        res.status(200).json({
            authenticated: true,
            token: tokenNew
            //usuario: decoded.usuario,
            //partner: decoded.partner
        });
    });

};


// ==========================================
//  Verifica Partner
// ==========================================
async function verificaPartner(host, id) {

    let partner = await Partner.findOne({$or: [{host: host}, {_id: id}]})
        .select('_id nombre host relatedPartner')
        .populate({
            path: 'relatedPartner',
            select: 'nombre host img theme background colorTheme'
        })
    ;

    if (!partner) {
        return {
            estatus: 'error',
            mensaje: 'No existe el partner',
            host: host
        };
    }
    partner = partner.relatedPartner ? partner.relatedPartner : partner;

    return {
        partner
    };
}



function signByContrato(req, res) {
    var body = req.body;
    console.log(body);
    Contrato.findOne({numeroContrato: body.numeroContrato})
        //.populate({
        //path: 'empresa',
        //  select: '_id orgEmpresa'
        //})

        .exec((err, ContratoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar Contrato',
                    errors: err
                });
            }

            if (!ContratoDB) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas - numero de Contrato',
                    errors: err
                });
            }

            if (!bcrypt.compareSync(body.password, ContratoDB.password)) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas - password',
                    errors: err
                });
            }

            // Crear un token!!!
            ContratoDB.password = ':)';


            var token = jwt.sign({contrato: ContratoDB}, SEED, payloadJwt); // 4 horas


            res.status(200).json({
                ok: true,
                contrato: ContratoDB,
                token: token,
                //_id: usuarioDB._id,
                //menu: obtenerMenu(usuarioDB.role),
                payload: payload
            });
        })
};

function resetPassword(req, res) {
    var body = req.body;


    Credential.findOne({email: body.email})
        .select('email nombre')
        .exec((err, userBBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }

            if (userBBD) {
                let newPwd = Math.random().toString(36).substr(2, 8);
                console.log(newPwd);
                let pwdEncrypted = bcrypt.hashSync(newPwd, 10);


                Credential.findByIdAndUpdate(userBBD?._id, {password: pwdEncrypted}, {},
                    (err, nuser) => {
                        userBBD.password = newPwd;
                        //MailController.enviarCorreoNuevoPassword
                        (userBBD).then(data => {
                            res.status(201).json({
                                message: 'Se ha enviado un correo con tu nuevo password',

                                status: 'ok'
                            }/*, err => {
                                res.status(500).json({
                                    message: 'Ocurrió un error al enviar el correo',
                                    error: err,
                                    status: 'ok'
                                });
                            }*/);
                        });
                    });
            } else {


                res.status(400).json({
                    message: 'Se ha enviado un correo con tu nuevo password',
                    status: 'error'
                });
            }
        });
}



module.exports = {
    login,
    crearUsuario,
    verifyUser,
    getUserFromToken,
    renuevaToken,
    signByContrato,
    resetPassword,
    cambiarPassword
};