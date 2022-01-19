'use strict'


var Tarea = require('./tarea.model');
const {response} = require("express");


function crear(req, res){
    var body = req.body;

    var tarea = new Tarea({...body});
    tarea.save((err, tareaGuardada) => {
        if (err) {
            return res.status(400).json({
                status: false,
                mensaje: 'Error al crear la tarea',
                errors: err
            });
        }
        res.status(201).json({
            status: true,
            tarea: tareaGuardada
        });
    });
}


function consulta(req, res){
    let id =  req.params.id;

    Tarea.findById(id).exec((err, data)=>{
        if(err){
            res.status(400).json({
                status: false,
                id: id,
                error: "no existe"
            });
        }
        res.status(201).json({
            status: true,
            tarea: data,
            error: err
        });
    })
}

function catalogoEstados(req, res){
    res.status(201).json(
        Tarea.estadoTarea.values
    );
}
/**
 * Consulta las tareas por paginas, por default pageSize=10, page=1
 * @param req
 * @param res
 */
function consultaPaginado(req, res){
    let id =  req.params.id;
    var pageNumber = req.params.page || 0;
    pageNumber = Number(pageNumber);

    var numeroPorPagina = req.params.pageSize || 10;
    numeroPorPagina = Number(numeroPorPagina);

    var desde = (pageNumber-1)*numeroPorPagina;
    desde = Number(desde);

    let findTerms = {};
    //findTerms['user']=req.user._id;
    //findTerms['owner']=req.user._id;



    if(req.body){
        findTerms ['$and'] = [ ];
        var body = req.body;
        console.log(body);
        if(body.nombreCliente)
            findTerms ['$and'].push({'nombreCliente': new RegExp(body.nombreCliente, 'i')});
        if(body.estatus)
            findTerms ['$and'].push({'estatus': body.estatus});
    }
    if(findTerms['$and'].length===0){
      delete  findTerms['$and'] ;
    }
        // = {...req.body}
    console.log(findTerms);

    Tarea.find(findTerms)
        .skip(desde)
        .limit(numeroPorPagina)
        .exec((err, data)=>{
        if(err){
            res.status(400).json({
                status: false,
                id: id,
                error: "no existe"
            });
        }
            Tarea.countDocuments(findTerms, (err, conteo) => {
                var paginas = Math.trunc(conteo/numeroPorPagina);
                if(conteo%numeroPorPagina!==0){
                    paginas++;
                }

                res.status(200).json({
                    ok: true,
                    busqueda: body,
                    paginacion: {pagina:pageNumber, size: data.length, pageSize: numeroPorPagina, total: conteo, pages: paginas },
                    tareas: data,

                });
            })


    })
}

function actualizarTarea(req, res){
    var id = req.params.id;
    var body = req.body;

    Tarea.findByIdAndUpdate(id, body, {new:true}, (err, partner) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar partner',
                errors: err
            });
        }
        if (!partner) {
            res.status(400).json({
                ok: false,
                mensaje: 'El partner con id ' + id + ' no existe',
                errors: { message: 'No existe un partner con ese ID' }
            });
        }else{
            res.status(200).json({
                ok: true,
                partner: partner
            });
        }
    });


}

module.exports={
    crear,
    consulta,
    consultaPaginado,
    catalogoEstados,
    actualizarTarea
};