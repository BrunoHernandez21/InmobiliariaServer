var bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var Partner = require('../admin/partners/partner.model');
var SEED = require('../../config/config').SEED;
var Authentication = require('./authentication.model');
var Usuario = require('../admin/usuarios/usuario.model');

var MailController = require('../mail/mail.controller');
const SESSION_EXPIRES_AT = require('../../config/config').SESSION_EXPIRES_AT;
//determina el tiempo para que expire la session
const payloadJwt = {
    expiresIn: SESSION_EXPIRES_AT
    //expiresIn: 14400
}


// ==========================================
//  Funciones de usuario
// ==========================================

//  Inicio de secion
function login(req, res) {
    //verifica si tiene la forma necesaria para el login
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        console.log(errors);
        return res.status(400).json({
            ok:false,
            errors: errors.mapped()
        })
    }
    //comprobacion personal del login
    var body = req.body;
    let messagingToken = req.messagingToken;
    console.log('***');
    console.log(messagingToken);

    let authenticationUser = {email: body.email};
    // En el objeto mongose utiliza la funcion buscar a un {email:email} 
    // si lo encuentras selecciona {caracteristicas} 
    // y ejecuta
    Authentication.findOne(authenticationUser)
        .populate('user')
        .exec(async (err, auth) => {
        

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al ingresar ',
                    errors: err
                });
            }
            //No encontro el correo
            if (!auth) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Email no registrado',
                    errors: err
                });
            }
            //checa el estatus del usuario
            if (auth.estatus !== true) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario Inactivo, contacta a tu Administrador para que active tu cuenta',
                    errors: err
                });
            }
            //
            let authUp = {};
            authUp.messagingToken=req.messagingToken;
            authUp.lastSession = new Date();
            Authentication.findByIdAndUpdate(auth._id, authUp).exec((err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar id',
                        errors: err
                    });
                }

                let usuario = {
                    email: auth.email,
                    name: auth.user?.name,
                    surname: auth.user?.surname,
                    middlename: auth.user?.middlename,
                    lastname: auth.user?.lastname,
                    _id: auth.user._id,
                    role: auth.role,
                    roles: auth.roles,
                    img: auth.user.img
                };

                let payload = {
                    usuario
                };
                //comprueba si la contraseña es correcta
                if (!bcrypt.compareSync(body.password, auth.password)) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Credenciales incorrectas',
                        errors: err
                    });
                }
                // inicia secion con el usuario en payload
                var token = jwt.sign(payload, SEED, payloadJwt);
                //ok
                res.status(200).json({
                    ok: true,
                    user: usuario,
                    token: token
                });
            });

        });
};
/*
function updateInfo(req,res){
    var id = req.params.id;
    var body = req.body;
    //console.log(body);
    Authentication.findByIdAndUpdate(id, body, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar id',
                errors: err
            });
        }
        res.status(200).json({
                ok: true,
                body:body
        });
    });
}*/

async function creaUsuarioAsync(body){
    var usuario = new Usuario({...body});
    usuario.name = body.name || '';
    usuario.middlename = body.middlename || '';
    usuario.surname = usuario.surname || usuario.name;
    console.log(usuario);


    let userStored = await Usuario.findOne({email: usuario.email});
    if(!userStored){
        userStored = await usuario.save();
    }
    var authentication = new Authentication({...body});
    authentication.user = userStored._id;
    authentication.password = bcrypt.hashSync(body.password, 10);
    let authStored = await authentication.save().then(data=>{return {data} }).catch(error=>{return {error}});
    console.log(authStored);
    if(!authStored.error){
        var token = jwt.sign({usuario: userStored}, SEED, {expiresIn: 14400}); // 4 horas

        return {usuario, token, ok: true};
    }else{
        return {  ok: false, mensaje: 'Error al crear usuario' };
    }

}

// Crear un nuevo usuario
function crearUsuario(req, res) {
    //verifica si tiene la forma necesaria para el login
    
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()){
        console.log(errors);
        return res.status(400).json({
            ok:false,
            errors: errors.mapped()
        })
    }

    var body = req.body;

    creaUsuarioAsync(body).then( data => {
        return  res.status(200).json(data);
    });

}


//cambiar contraseña
function cambiarPassword(req, res) {
    var id = req.params.id;
    var body = req.body;
    Authentication.findOne({user: id}, (err, usuario) => {
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
                _id: usuarioGuardado.user,
                email: usuarioGuardado.email,
                role: usuarioGuardado.role
            };
            var tokenUser = jwt.sign({usuario: userx}, SEED, {expiresIn: 14400});
            
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

/**
 * Valida previamente en el middleware que el token es valido, si este es valido se envia
 * a traves del atributo usuario del request.
 * @param req
 * @param res
 */
function verifyUser(req, res) {
        if(!req.usuario){
            res.status(400).json({
                authenticated: false,
                error: "No se tiene informacion del token en el header"
            });
        }
        var tokenNew = jwt.sign({usuario: req.usuario}, SEED, payloadJwt);

        res.status(200).json({
            authenticated: true,
            token: tokenNew
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


async function  resetPasswordAsync(email){
    console.log(email);

    let auth = await Authentication.findOne({email}) .select('email nombre').populate("user");
    if(auth){
        let newPwd = Math.random().toString(36).substr(2, 8);
        let pwdEncrypted = bcrypt.hashSync(newPwd, 10);
        await Authentication.findByIdAndUpdate(auth?._id, {password: pwdEncrypted});

        let userSend = {name:auth.user?.name, email: email , password:newPwd};
        //console.log(userSend)
        let resCorreo = await MailController.enviarCorreoNuevoPassword(userSend);
        //console.log(resCorreo);
        if(resCorreo.estatus=='error'){
            return resCorreo;
        }
    }
    //console.log(auth);
}

function resetPassword(req, res) {
    var body = req.body;
    resetPasswordAsync(body.email).then( data =>{
        return res.status(200).json({
            status: 'ok',
            mensaje: 'Envio exitoso',
        });
    });

}



module.exports = {
    login,
    crearUsuario,
    verifyUser,
    getUserFromToken,
    resetPassword,
    cambiarPassword,
    //updateInfo
};