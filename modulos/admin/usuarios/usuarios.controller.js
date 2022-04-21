'use strict'
var Usuario = require('./usuario.model');
var Partner = require('../partners/partner.model');
var mongoose = require('mongoose');



// ==========================================
// Obtener todos los usuarios
// ==========================================
function obtenerUsuarios(req, res)
{
    var host = req.get('origin');
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Partner.findOne({host: host}, "_id host nombre www img")
    .exec(
    (err, partner) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Partner No Encontrado',
                errors: err
            });
        }
            if(partner){
                Usuario.find({partner:partner._id })
                .skip(desde)
                .populate('empresa')
                
                .limit(5)
                .exec(
                    (err, usuarios) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error cargando usuario',
                                errors: err
                            });
                        }
                        Usuario.countDocuments({}, (err, conteo) => {
                            res.status(200).json({
                                ok: true,
                                usuarios: usuarios,
                                total: conteo
                            });
                        })
                    });
            }else{
                res.status(200).json({
                    ok: true,
                    usuarios: [],
                    total: 0,
                });
            }
        },
        error =>{
            console.log('Error al consultar configuracion de partner ' +error);
        });
}
// ==========================================
// Actualizar usuario
// ==========================================
function actualizarUsuario(req, res){
    var id = req.params.id;
    if(!id){
        id = req.usuario._id;
    }

    var body = req.body;

    console.log('============================================ ACTUALIZAR USUARIO =============================================');
    console.log('body :>> ', body);

    Usuario.findByIdAndUpdate(id, body, {new:true, upsert: true }, async(err, usuarioGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar cliente',
                errors: err
            });
        }
        if (!usuarioGuardado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El cliente con id ' + id + ' no se guardo',

            });
        }else{


			res.status(200).json({
				ok: true,
				usuario: usuarioGuardado
			});
		}
	});
}
// ==========================================
// Crear un nuevo usuario
// ==========================================
function crearUsuario(req, res){
    console.log('==========================================  CREAR USUARIO ====================================================');
    var body = req.body;

    var usuario = new Usuario({...body
    });
    console.log('usuario :>> ', usuario);


    usuario.save(async(err, usuarioGuardado) => {

        if (err) {
            console.log('err :>> ', err);
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }


        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });
    });
}



// ============================================
//   Borrar un usuario por el id
// ============================================
async function eliminarUsuario(req, res){
    var id = req.params.id;
    console.log('================================= Eliminar Usuario ========================================');
    const usuarioABorrar = await Usuario.findById(id);
    const UIDFirebase = usuarioABorrar.uidFirebase;
    Usuario.findByIdAndRemove(id, async(err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        if (UIDFirebase !== null && UIDFirebase !== undefined && UIDFirebase !== '') {
            try {
                await fireApp.auth().deleteUser(UIDFirebase);
            } catch (error) {
                
            }
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
}

// Usuarios por Id 
// ==========================================
function obtenerPorIdUsuario(req, res){
    var id = req.params.id;
    if(!id && req.usuario.role!='ROLE_USER'){
        console.log(req.usuario);
        id = req.usuario._id;
    }
    Usuario.findById(id)
    //.select('email img nombre role  surname password cel ciudad fechaNacimiento  sexo rfc observaciones comisionVendedor')
    .exec(
        (err, usuario) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando direccion Origen',
                    errors: err
                });
            }
            if (!usuario) {
                res.status(200).json(req.usuario
                );
                /*return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario con id ' + id + ' no existe',
                    errors: { message: 'No existe un usuario con ese ID' }
                });*/
            }else{
                res.status(200).json(usuario);
            }

        },
        error =>{
            console.log(error);
        });
}


module.exports={
    obtenerUsuarios,
    actualizarUsuario,
    crearUsuario,
    eliminarUsuario,
    obtenerPorIdUsuario
};
