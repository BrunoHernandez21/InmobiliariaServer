var fs = require('fs');
const uuid = require("uuid-v4");
var mongoose = require('mongoose');
var tiposValidos = ['avatar',
    'icono', 'tarjeta-boton', 'logo', 'empresas', 'usuarios',
    'quinielas', 'pdf', 'partners', 'productos', 'contratoExcel', 'convenios-sky', 'contratos'];


function getImage(req, res) {

    var tipo = req.params.tipo;
    //var img = req.params.img;
    var filename = req.params.filename;

    console.log(path);
    //var path = `./uploads/${ tipo }/${ img }`;
    var path = `./uploads/${tipo}/${filename}`;
    console.log(path);
    fs.stat(path, (existe, stat) => {
        console.log(stat);
        if (!stat) {
            path = './assets/no-img.jpg';
        }
        res.download(path);
    });
};

function deleteImage(req, res) {

    var tipo = req.params.tipo;
    var filename = req.params.filename;

    console.log(path);
    //var path = `./uploads/${ tipo }/${ img }`;
    var path = `./uploads/${tipo}/${filename}`;
    fs.delete(path)


}

function subirArchivo(req, res) {

    var tipo = req.params.tipo;
    var id = req.params.id;
    if (id === undefined)
        id = uuid();
    // tipos de colección
     if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: {message: 'Tipo de colección no es válida'}
        });
    }


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se recibio archivo',
            errors: {message: 'Debe de seleccionar un archivo'}
        });

    }

    // Obtener nombre del archivo


    var archivo = req.files.file;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Sólo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'pdf', 'xlsx', 'svg', 'docx', 'doc'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida ' + extensionArchivo,
            errors: {message: 'Las extensiones válidas son ' + extensionesValidas.join(', ')}
        });
    }

    // Nombre de archivo personalizado
    // 12312312312-123.png
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    var dir = `./uploads/${tipo}`;
    // Mover el archivo del temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    fs.stat(dir, (noexiste, stat) => {

        if (!stat) {
            fs.mkdirSync(dir, {recursive:true});
        }
        archivo.mv(path, err => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al mover archivo',
                    errors: err
                });

            }


            return res.status(200).json({
                ok: true,
                mensaje: 'Archivo recibido',
                filename: path,
                extensionArchivo: extensionArchivo
            });


        });

    });


}


module.exports = {
    getImage,
    deleteImage,
    subirArchivo
}