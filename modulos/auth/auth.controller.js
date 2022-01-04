var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var Contrato = require('../../models/contrato-servicios/contrato');
var Menu = require('../../models/administracion/menu');
var Partner = require('../../models/administracion/partner');
var mongoose = require('mongoose');
// Load the MySQL pool connection
//const poolMysql = require('../../data/mariadb_config');
var MailController = require('../../controllers/mail/mail.controller');

var SEED = require('../../config/config').SEED;

//var app = express();
var Credential = require('./credential.model');
const SESSION_EXPIRES_AT = require('../../config/config').SESSION_EXPIRES_AT;

const payloadJwt = {
    expiresIn: SESSION_EXPIRES_AT
    //expiresIn: 14400
}

const FULL_MENU = [
        {
            "id": "Dashboard",
            "title": "Dashboard",
            "type": "group",
            "icon": "pages",
            "children": [
                {
                    "id": "Dashboard",
                    "title": "Dashboard",
                    "type": "item",
                    "icon": "bar_chart",
                    "url": "/pages"
                }
            ]
        },
        {
            "id": "Administración",
            "title": "Administración",
            "type": "group",
            "icon": "pages",
            "children": [
                {
                    "id": "Partners",
                    "title": "Partners ",
                    "type": "item",
                    "icon": "business_center",
                    "url": "/administracion/partner"
                },
                {
                    "id": "Usuarios",
                    "title": "Usuarios",
                    "type": "item",
                    "icon": "people",
                    "url": "/administracion/usuarios"
                },
                {
                    "id": "Empresas",
                    "title": "Empresas",
                    "type": "item",
                    "icon": "category",
                    "url": "/administracion/empresas"
                },
                {
                    "id": "Grupos",
                    "title": "Grupos",
                    "type": "item",
                    "icon": "category",
                    "url": "/administracion/grupos"
                },
                {
                    "id": "Categorias",
                    "title": "Categorias",
                    "type": "item",
                    "icon": "category",
                    "url": "/administracion/categoria"
                },
                {
                    "id": "Roles",
                    "title": "Roles",
                    "type": "item",
                    "icon": "category",
                    "url": "/administracion/roles"
                },
                {
                    "id": "Menus",
                    "title": "Menus",
                    "type": "item",
                    "icon": "category",
                    "url": "/administracion/menus"
                }
            ]
        },
        {
            "id": "Contratos",
            "title": "Contratos",
            "type": "group",
            "icon": "pages",
            "children": [
                {
                    "id": "Contrato",
                    "title": "Contratos",
                    "type": "item",
                    "icon": "card_membership",
                    "url": "/contrato"
                }
            ]
        },
        {
            "id": "Constructora",
            "title": "Constructora",
            "type": "group",
            "icon": "pages",
            "children": [
                {
                    "id": "Complejos",
                    "title": "Fraccionamientos",
                    "type": "item",
                    "icon": "business",
                    "url": "/contratos/complejos"
                },
                {
                    "id": "Contratos",
                    "title": "Contratos",
                    "type": "item",
                    "icon": "card_membership",
                    "url": "/contratos"
                },
                {
                    "id": "Egresos",
                    "title": "Egresos",
                    "type": "item",
                    "icon": "assignment_returned",
                    "url": "/contratos/egresos"
                },
                {
                    "id": "Ingresos",
                    "title": "Ingresos",
                    "type": "item",
                    "icon": "assignment_turned_in",
                    "url": "/contratos/ingresos"
                },
                {
                    "id": "Terrenos",
                    "title": "Terrenos",
                    "type": "item",
                    "icon": "terrain",
                    "url": "/contratos/terrenos"
                },
                {
                    "id": "Departamentos",
                    "title": "Departamentos",
                    "type": "item",
                    "icon": "hotel",
                    "url": "/contratos/departamentos"
                },
                {
                    "id": "Casas",
                    "title": "Casas",
                    "type": "item",
                    "icon": "home",
                    "url": "/contratos/casas"
                }
            ]
        },
        {
            "id": "Terrenos",
            "title": "Terrenos",
            "type": "group",
            "icon": "pages",
            "children": [
                {
                    "id": "ComplejosTerrenos",
                    "title": "Fraccionamientos",
                    "type": "item",
                    "icon": "business",
                    "url": "/terrenos/complejos"
                },
                {
                    "id": "ContratosTerrenos",
                    "title": "Contratos",
                    "type": "item",
                    "icon": "card_membership",
                    "url": "/terrenos/contratos"
                },
                {
                    "id": "EgresosTerrenos",
                    "title": "Egresos",
                    "type": "item",
                    "icon": "assignment_returned",
                    "url": "/terrenos/egresos"
                },
                {
                    "id": "IngresosTerrenos",
                    "title": "Ingresos",
                    "type": "item",
                    "icon": "assignment_turned_in",
                    "url": "/terrenos/ingresos"
                },
                {
                    "id": "TerrenosTerrenos",
                    "title": "Terrenos",
                    "type": "item",
                    "icon": "terrain",
                    "url": "/terrenos/terrenos"
                },
                {
                    "id": "DepartamentosTerrenos",
                    "title": "Departamentos",
                    "type": "item",
                    "icon": "hotel",
                    "url": "/terrenos/departamentos"
                },
                {
                    "id": "CasasTerrenos",
                    "title": "Casas",
                    "type": "item",
                    "icon": "home",
                    "url": "/terrenos/casas"
                }
            ]
        },
        {
            "id": "Productos",
            "title": "Productos",
            "type": "group",
            "icon": "pages",
            "children": [
                {
                    "id": "Productos",
                    "title": "Productos",
                    "type": "item",
                    "icon": "shopping_basket",
                    "url": "/productos"
                }
            ]
        },
        {
            "id": "Tarjetas",
            "title": "Tarjetas",
            "type": "group",
            "icon": "pages",
            "children": [
                {
                    "id": "Tarjetas",
                    "title": "Tarjetas",
                    "type": "item",
                    "icon": "credit_card",
                    "url": "/tarjetas"
                },
                {
                    "id": "PlanesTarjetas",
                    "title": "Planes - Tarjetas",
                    "type": "item",
                    "icon": "dvr",
                    "url": "/tarjetas/planes"
                },
                {
                    "id": "PlanesUsuariosTarjetas",
                    "title": "Planes - Usuarios",
                    "type": "item",
                    "icon": "people",
                    "url": "/tarjetas/planesUsuarios"
                },
                {
                    "id": "Configuraciones",
                    "title": "Configuraciones",
                    "type": "item",
                    "icon": "settings",
                    "url": "/configuraciones"
                }
            ]
        },
        {
            "id": "Productos",
            "title": "Productos - Inversiones",
            "type": "group",
            "icon": "pages",
            "children": [
                {
                    "id": "Productos",
                    "title": "Productos",
                    "type": "item",
                    "icon": "money",
                    "url": "/inversiones/productos"
                },
                {
                    "id": "Contratos-Inversion",
                    "title": "Contratos - Inversion",
                    "type": "item",
                    "icon": "money",
                    "url": "/inversiones/contratos"
                },
                {
                    "id": "Leads-Inversion",
                    "title": "Leads - Inversion",
                    "type": "item",
                    "icon": "money",
                    "url": "/inversiones/leads"
                },
                {
                    "id": "InteresVariable-Inversion",
                    "title": "Interes Variable - Inversion",
                    "type": "item",
                    "icon": "money",
                    "url": "/inversiones/interesVariable/interes"
                },
                {
                    "id": "Comisión-Inversion",
                    "title": "Comisión - Inversion",
                    "type": "item",
                    "icon": "money",
                    "url": "/inversiones/comisiones"
                },
                {
                    "id": "Comisión-Vendedores-Inversion",
                    "title": "Comisiónes Vendedores - Inversion",
                    "type": "item",
                    "icon": "money",
                    "url": "/inversiones/comisionesVendedores"
                },
                {
                    "id": "EstadosDeCuenta-Inversion",
                    "title": "Estados De Cuenta - Inversion",
                    "type": "item",
                    "icon": "money",
                    "url": "/inversiones/estadosDeCuenta"
                }
            ]
        }
    ]
;

//var mdAutenticacion = require('../../middlewares/autenticacion');
const menu = require('../../models/administracion/menu');


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

// ==========================================
//  Autenticación normal
// ==========================================
function login(req, res) {
    console.log('.............................................login........................................................');
    var body = req.body;
    console.log(body.email)
    let filterUser = {email: body.email};

    var host = req.get('origin');
    var partnerId = '';


    Credential.findOne(filterUser) // Credential.findOne({ email: body.email, estatus: true})

        .select('email img password name surname role roles partner estatus partner')

        .exec(async (err, usuarioDB) => {
            console.log(usuarioDB);
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
            console.log('Estatus----------------------------------------------------');
            console.log(usuarioDB.estatus);

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
                        MailController.enviarCorreoNuevoPassword
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

async function obtenerMenu(role, partner) {
    console.log('role: ' + role + ' partner:' + partner)
    let filter = {};

    filter['rol'] = role;
    if (role === 'USER_ROOT') {
        filter['partner'] = {$in: [null]};
    } else {
        filter['partner'] = partner;
    }
    console.log('filter: ' + JSON.stringify(filter));

    let menu = await Menu.findOne(filter);


    if (!menu) {

        let menuNew = new Menu();
        menuNew.nombre = 'Menu';
        menuNew.rol = role;
        menuNew.partner = partner;
        menuNew.menu = FULL_MENU;
        let menu = await menuNew.save();

        return menu;
    } else {
        return menu.menu;
    }

}

// ==========================================
// Crear un nuevo usuario
// ==========================================
function crearUsuario(req, res) {
    console.log('==========================================  CREAR USUARIO ====================================================');
    var body = req.body;
    console.log('body :>> ', body);


    var usuario = new Credential({...body});

    console.log('usuario :>> ', usuario);
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