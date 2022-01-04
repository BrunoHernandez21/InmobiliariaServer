'use strict'

var DocumentoUsuario = require('../../models/generales/documentoUsuario');

// ==========================================
// Crear Documento Usuario
// ==========================================
function crearDocumentoUsuario(req, res){
    var body = req.body;

    var documentoUsuario = new DocumentoUsuario({
        usuario : body.usuario,
        nombre : body.nombre,
        tipo : body.tipo,
        url : body.url,
        estado : body.estado,
        numero : body.numero,
        vencimiento : body.vencimiento,
        observacion : body.observacion,
    });

    documentoUsuario.save((err, documentoUsuarioGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el documento',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            documentoUsuario: documentoUsuarioGuardada
        });
    });
}

// ==========================================
// Crear varios Documentos  Usuario
// ==========================================
async function crearDocumentosEnMasaUsuario(req, res){
    var body = req.body;

    var documentos = body.documentos;

    for (let i = 0; i < documentos.length; i++) {
        if (documentos[i]._id !== null && documentos[i]._id !== undefined && documentos[i]._id !== '') {
            var documentoUsuarioAct = documentos[i];
            await DocumentoUsuario.findByIdAndUpdate(documentos[i]._id, documentoUsuarioAct, {new:true})
            
        } else {
            var documentoUsuario = new DocumentoUsuario({
                usuario : documentos[i].usuario,
                nombre : documentos[i].nombre,
                tipo : documentos[i].tipo,
                url : documentos[i].url,
                estado : documentos[i].estado,
                numero : documentos[i].numero,
                vencimiento : documentos[i].vencimiento,
                observacion : documentos[i].observacion,
            });
            await documentoUsuario.save();
        }
        
    }

    res.status(201).json({
        ok: true,
        message: 'Documentos creados correctamente'
    });
}

// ==========================================
// Obtener la Documento Usuario por ID
// ==========================================

function obtenerPorIdDocumentoUsuario(req, res){
    var id = req.params.id;
    console.log(id);
    DocumentoUsuario.findById(id)
    .populate ({path: 'usuario'})
    .exec(
        (err, documentoUsuario) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando documentoUsuario',
                    errors: err
                });
            }
            if (!documentoUsuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El documentoUsuario con id ' + id + ' no existe',
                    errors: { message: 'No existe el documentoUsuario con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                documentoUsuario: documentoUsuario
            });
        },
        error =>{
            console.log(error);
        });
}

// ==========================================
// Eliminar Documento Usuario
// ==========================================
function eliminarDocumentoUsuario(req, res){

    var id = req.params.id;

    DocumentoUsuario.findByIdAndRemove(id, (err, documentoUsuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar el documento',
                errors: err
            });
        }

        if (!documentoUsuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un documento con ese id',
                errors: { message: 'No existe un documento con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            documentoUsuario: documentoUsuarioBorrado
        });

    });
}

// ==========================================
// Actualizar Documento Usuario
// ==========================================
function actualizarDocumentoUsuario(req, res){
    var id = req.params.id;
    var body = req.body;

    DocumentoUsuario.findByIdAndUpdate(id, body, {new:true}, (err, documentoUsuarioGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar documento',
                errors: err
            });
        }
        if (!documentoUsuarioGuardado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El documento con id ' + id + ' no se guardo',

            });
        }else{
			res.status(200).json({
				ok: true,
				documentoUsuario: documentoUsuarioGuardado
			});
		}
	});
}

// ==========================================
// Obtener todos los Documentos Usuario 
// ==========================================
function obtenerDocumentosUsuarioPaginados(req, res){
    console.log('............................... Documentos Usuario .............................................');
    var body = req.body;
    var desde;
    var id = req.params.id;
    console.log('body: ');
    console.log(body);

    var pageNumber = body.pageNumber || 0;
    pageNumber = Number(pageNumber);

    console.log('pageNumber: ');
    console.log(pageNumber);

    var numeroPorPagina = body.size || 0;
    numeroPorPagina = Number(numeroPorPagina);

    console.log('numeroPorPagina: ');
    console.log(numeroPorPagina);

    let filter = {};

    filter['usuario'] = id;
   
    desde = pageNumber*numeroPorPagina;
    desde = Number(desde);
    console.log(desde);
    console.log(filter);

    DocumentoUsuario.find(filter)
    .skip(desde)
    .limit(numeroPorPagina)
    .populate ({ path: 'usuario' })
    .exec(
        (err, documentoUsuario) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando los documentos',
                    errors: err
                });
            }
            DocumentoUsuario.countDocuments(filter, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    documentoUsuario: documentoUsuario,
                    total: conteo
                });
            })
        },
        error =>{
            console.log(error);
        });
}


// ==========================================
// Obtener todos los Documentos Usuario 
// ==========================================
function obtenerDocumentosUsuarioSinPaginar(req, res){
    console.log('............................... Documentos Usuario Sin Paginar .............................................');
    var body = req.body;
    console.log('body: ');
    console.log(body);
    var id = req.params.id;
    let filter = {};
    filter['usuario'] = id;

    console.log('filter: ');
    console.log(filter);

    DocumentoUsuario.find(filter)
    .populate ({ path: 'usuario' })
    .exec(
        (err, documentoUsuario) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando los documentos',
                    errors: err
                });
            }
            DocumentoUsuario.countDocuments(filter, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    documentoUsuario: documentoUsuario,
                    total: conteo
                });
            })
        },
        error =>{
            console.log(error);
        });
}


module.exports={
    crearDocumentoUsuario,
    obtenerPorIdDocumentoUsuario,
    eliminarDocumentoUsuario,
    actualizarDocumentoUsuario,
    obtenerDocumentosUsuarioSinPaginar,
    obtenerDocumentosUsuarioPaginados,
    crearDocumentosEnMasaUsuario,
};