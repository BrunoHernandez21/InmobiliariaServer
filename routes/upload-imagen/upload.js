var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var mdAutenticacion = require('../../middlewares/autenticacion');
var Contrato = require('../../models/contrato-servicios/contrato');
var app = express();
var Imagen = require('../../models/upload-imagen/imagen');
var Usuario = require('../../modulos/auth/authentication.model');
var Empresa = require('../../models/administracion/empresa');
var Tarjeta = require('../../models/tarjetas/tarjeta');
var Partner = require('../../modulos/admin/partners/partner.model');
var Producto = require('../../models/renton/producto');
var DownloadControler= require ('../../controllers/administracion/usuarios');
// default options
var mongoose = require('mongoose');
var uuid = require('uuid-v4');

app.use(fileUpload());
var Contrato_Inversion = require('../../models/inversiones/contrato_inversion');

app.put('/:tipo/:id', [mdAutenticacion.verificaToken], (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de colección
    var tiposValidos = ['tarjeta-avatar', 'tarjeta-logo', 'tarjeta-icono', 'tarjeta-boton', 'empresas', 'usuarios','quinielas','PDF','partners','productos','contratoExcel', 'convenios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: { message: 'Tipo de colección no es válida' }
        });
    }


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];
    // Sólo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'pdf', 'svg', 'xlsx'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    // 12312312312-123.png
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;


    // Mover el archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {
        
        if (err) {
            console.log('ERROR SUBIDA :>> ', err);
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }


        if (tipo === 'contratoExcel'){
            res.status(200).json({
                ok: true,
                mensaje: 'Archivo movido',
                extensionArchivo: extensionArchivo
            }); 
        }else {
    
            subirPorTipo(tipo, id, nombreArchivo, res);
        }


    })



});
app.post('/:tipo/:id', [mdAutenticacion.verificaToken], subirArchivo);
app.post('/:tipo', [mdAutenticacion.verificaToken], subirArchivo);

function subirArchivo(req, res) {

    var tipo = req.params.tipo;
    var id = req.params.id;
    if(id===undefined)
        id = uuid();
    // tipos de colección
    var tiposValidos = ['tarjeta-avatar',
        'tarjeta-icono', 'tarjeta-boton', 'tarjeta-logo', 'empresas', 'usuarios',
        'quinielas','PDF','partners','productos','contratoExcel', 'convenios', 'contratos'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: { message: 'Tipo de colección no es válida' }
        });
    }


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo


    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Sólo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'pdf','xlsx','svg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida '+ extensionArchivo,
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    // 12312312312-123.png
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;


    // Mover el archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        if (tipo === 'contratoExcel'){
            res.status(200).json({
                ok: true,
                mensaje: 'Archivo movido',
                extensionArchivo: extensionArchivo
            });
        }else {

            subirPorTipo(tipo, id, nombreArchivo, res).then(data => {
               /*
                //console.log('>>>subirPorTipo');
                if(data.status==='error'){
                    conso
                    //res.status(400).json({error:data.error});
                }else{
                    //res.status(200).json({imagen: data.imagen});

                }*/
            });
        }

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido',
        //     extensionArchivo: extensionArchivo
        // });

    })



}

async function subirPorTipo(tipo, id, nombreArchivo, res) {


    if (tipo === 'contratoExcel') {

        Contrato.findById(id, (err, contrato) => {

            if (!contrato) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Contrato no existe',
                    errors: { message: 'Contrato no existe' }
                });
            }


            var pathViejo = '../uploads/contratos/' + contrato.pdf;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            contrato.pdf = nombreArchivo;
            contrato.save((err, contratoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Contrato Actualizado',
                    contrato: contratoActualizado
                });
            

            })


        });

    }
    else if (tipo === 'PDF') {

        Contrato.findById(id, (err, contrato) => {

            if (!contrato) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Contrato no existe',
                    errors: { message: 'Contrato no existe' }
                });
            
            }


            var pathViejo = '../uploads/contratos/' + contrato.pdf;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            contrato.pdf = nombreArchivo;
            contrato.save((err, contratoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Contrato Actualizado',
                    contrato: contratoActualizado
                });

            })


        });

    }
    else if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }


            var pathViejo = '../uploads/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;
            usuario.avatar = "";
            delete usuario.avatar;
            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });

            })


        });

    }
    else if (tipo === 'empresas') {

        Empresa.findById(id, (err, empresa) => {

            if (!empresa) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Empresa no existe',
                    errors: { message: 'Empresa no existe' }
                });
            }

            var pathViejo = './uploads/empresas/' + empresa.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {

                fs.unlink(pathViejo, (err) => {
                    if (err) throw err;
                    console.log(pathViejo + ' was deleted');
                });

            }

            empresa.img = nombreArchivo;

            empresa.save((err, empresaActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de equipo actualizada',
                    empresa: empresaActualizado
                });

            })

        });
    }
    else if (tipo === 'tarjeta-avatar' || tipo === 'tarjeta-logo'  || tipo === 'tarjeta-icono') {


        Tarjeta.findById( id, (err, tarjeta) => {
            if (!tarjeta) {
                return res.status(400).json({
                    status: 'error',
                    mensaje: 'La tarjeta no existe',
                    errors: {message: 'tarjeta no existe'}
                });
            }
            let images  = [];
            if(tarjeta.avatar) images.push({"avatar": tarjeta.avatar});
            if(tarjeta.logo) images.push({"logo": tarjeta.logo});
            if(tarjeta.icono) images.push({"avatar": tarjeta.icono});

            let filter = {$or: images};
            Tarjeta.find(filter, (err, tarjetas) => {

                if (err ||  !tarjetas.length === 0 ) {
                    return res.status(400).json({
                        status: 'error',
                        mensaje: 'La tarjeta no existe',
                        errors: {message: 'tarjeta no existe'},
                        trace: err
                    });
                }
                else {
                    var pathViejo;
                    var seBorrara = false;

                    if (tipo === 'tarjeta-avatar') {
                        pathViejo = `./uploads/${tipo}/${tarjeta.avatar}`;
                        seBorrara = tarjeta.avatar ? true : false;
                        tarjeta.avatar = nombreArchivo;
                    } else if (tipo === 'tarjeta-logo') { //tarjetas-logo
                        pathViejo = `./uploads/${tipo}/${tarjeta.logo}`;
                        seBorrara = tarjeta.logo ? true : false;
                        tarjeta.logo = nombreArchivo;
                    } else if (tipo === 'tarjeta-icono') {
                        pathViejo = `./uploads/${tipo}/${tarjeta.icono}`;
                        seBorrara = tarjeta.icono ? true : false;
                        tarjeta.icono = nombreArchivo;
                    }
                    //si la imagen se usa en mas de una tarjeta no se borra
                    seBorrara = tarjetas.length===1;
                    // Si existe, elimina la imagen anterior
                    if (seBorrara && fs.existsSync(pathViejo)) {
                        fs.unlink(pathViejo, (error) => {
                            if (error) {
                                console.log('No se pudo desasociar la imagen ' + pathViejo + ' error: ' + error);
                                /*return res.status(500).json({
                                    ok: false,
                                    mensaje: err,
                                });*/
                            } else {
                                console.log(pathViejo + ' was deleted');
                            }

                            tarjeta.save((err, tarjetaActualizado) => {

                                return res.status(200).json({
                                    status: 'ok',
                                    mensaje: 'Imagen actualizada',
                                    tarjeta: tarjetaActualizado
                                });

                            })
                        });

                    } else {
                        tarjeta.save((err, tarjetaActualizado) => {

                            return res.status(200).json({
                                ok: true,
                                mensaje: 'Imagen actualizada',
                                tarjeta: tarjetaActualizado,
                            });
                        })
                    }
                }
            });



        });
    }
    else if (tipo === 'partners') {

        Partner.findById(id, (err, partner) => {

            if (!partner) {
                return res.status(400).json({
                    status: 'error',
                    mensaje: 'Partner no existe',
                    errors: { message: 'Partner no existe' }
                });
            }

            var pathViejo = './uploads/partners/' + partner.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {

                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        console.log(pathViejo + ' wasn\'t deleted');

                    }
                    console.log(pathViejo + ' was deleted');
                });

            }

            partner.img = nombreArchivo;

            partner.save((err, partnerActualizada) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de partner actualizada',
                    partner: partnerActualizada
                });

            })

        });
    }
    else if (tipo === 'productos') {
        console.log('producto id:');
        console.log(id);

        let producto = await Producto.findById(id);
        console.log(producto);
        let total = producto.images.length || 0;
        let imagenNew = new Imagen();
        imagenNew.default = (total===0);
        imagenNew.orden = total+1;
        imagenNew.url = nombreArchivo;
        imagenNew.type = tipo;
        imagenNew.producto = id;
        imagenNew = await imagenNew.save();
        console.log(imagenNew);
        

        if (!producto) {
            return {
                status : 'ok',
                mensaje: 'Producto no existe',
                errors: { message: 'Producto no existe' }
            };
        }
        let imagesArray = await Imagen.find({producto:id});
        
        //let imagesArray = producto.images || [];
        

        //imagesArray.push(imagenNew);

        let productoUp = await Producto.findByIdAndUpdate(id, {images: imagesArray});

        res.status(200).json({producto: productoUp,
            status: 'ok'});
        return {
            producto: productoUp,
            status: 'ok'
        }
        
    }
    else if(tipo === 'convenios'){
        //let usuario = await Usuario.findById(id);
        let idUser = mongoose.Types.ObjectId(id);
        let contrato = await Contrato_Inversion.findOne({cliente:idUser}, {doctos:1});
        console.log(contrato);

        if(!contrato.doctos)
            contrato.doctos = [];
        let hoy = new Date(Date.now());
        contrato.doctos.push({filename:nombreArchivo, 'type':'convenio', date:hoy});
        console.log(contrato);

        let contratoUpdated = await Contrato_Inversion.findByIdAndUpdate(contrato._id, {doctos:contrato.doctos});

        return {
            contrato: contrato,
            status: 'ok'
        }
    }
    else if(tipo === 'tarjeta-boton'){
        return res.status(200).json({
            ok: true,
            mensaje: 'Imagen actualizada',
            imagen: nombreArchivo,
            tipo: tipo
        });
    }

}
//app.get('/descargarArchivo/:file', [mdAutenticacion.verificaToken], DownloadControler.downloadUserActivity);

app.get('/descargarArchivo/:file', (req, res, next) => {
    
    var file = req.params.file;
    console.log('descargando '+ file);
    var path_file = './uploads/PDF/' + file;
    fs.exists(path_file, function(exists){
        if(exists){

            //res.sendFile(path.resolve(path_file));
            /*let filename;
             if( repository.activity && repository.activity.title)
             filename = repository.activity.title;*/
            res.download(path_file); //, filename + '_' +  repository.title + '_' + repository.author + '.' + repository.extension);
        }else{
            res.status(404).send({message: 'El recurso solicitado no existe en el servidor'});
        }
    });
});


app.post('/eliminarArchivo', [mdAutenticacion.verificaToken], (req, res, next) => {
   
    var body = req.body;
    console.log(body);
    
    var path_file = './uploads/PDF/' + body.pdf;
    console.log(path_file);
    fs.exists(path_file, function(exists){
        if(exists){
            fs.unlink(path_file, function(err) {
                if (err) throw err;
                console.log('file deleted');
            });
            Contrato.findById(body._id, (err, contrato) => {
                
        
                contrato.pdf = undefined,
                
                contrato.save((err, contratoGuardado) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar torneo',
                            errors: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        contrato: contratoGuardado
                    });
                });
            });
        }else{
            res.status(404).send({message: 'El recurso solicitado no existe en el servidor'});
        }
    });
});


module.exports = app;
