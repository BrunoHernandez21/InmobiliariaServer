'use strict'
var Tarea = require('./tarea.model');

var Configuration = require('./catalogos/configuration.model');

const mongoose = require("mongoose");


function crear(req, res){
    var tarea = new Tarea({...req.body});
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

function deleteTarea(req, res){
    let id =  req.params.id;

    Tarea.deleteOne({'_id':  mongoose.Types.ObjectId(id) }).exec((err, data)=>{
        if(err){
            res.status(400).json({
                status: false,
                id: id,
                error: "no existe"
            });
        }
        res.status(201).json({
            status: true,
            data: data,
        });
    })
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

function catalogoTipos(req, res){
        Configuration.findOne({name:'types'}).exec((err, data)=> {
        if (err) {
            res.status(400).json({
                status: false,
                error: err
            });
            return;
        }
        res.status(201).json({types: data.options} );
    });
}



function catalogoEstados(req, res){
    res.status(201).json(
        Tarea.estadoTarea.values
    );
}
/**
 * Consulta las tareas por paginas, por default pageSize=10, page=1, {nombreCliente, fechaAvaluo, estatus}
 * @param req Request de la peticion
 * @param res Respuesta de la peticion
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
    findTerms ['$and'] = [ ];
    //findTerms['user']=req.user._id;
    //findTerms['owner']=req.user._id;
    var body = req.body;
   
  

    if(req.usuario?.role==='ROOT_USER' || req.usuario?.role==='ADMIN_USER'){
        if(body.usuario )
            findTerms ['$and'].push({'usuario':  body.usuario });
    }else{ //eres un usuario normal
        if( req.usuario?._id)
            findTerms ['$and'].push({'usuario':  mongoose.Types.ObjectId(req.usuario?._id) });
    }
    if(req.body){


        if(body.nombreCliente)
            findTerms ['$and'].push({'nombreCliente': new RegExp(body.nombreCliente, 'i')});
        if(body.estado)
            findTerms ['$and'].push({'estado': {$in :body.estado}});
        if(body.estatus)
            findTerms ['$and'].push({'estatus': {$in :body.estatus}});
        if(body.fechaAvaluo)
            findTerms ['$and'].push({'fechaAvaluo': body.fechaAvaluo});
        if(body.direccion)
            findTerms ['$and'].push({'direccion': new RegExp(body.direccion, 'i')});
    }
    if(findTerms['$and'].length===0){
      delete  findTerms['$and'] ;
    }
        // = {...req.body}

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
            return;
        }
            Tarea.countDocuments(findTerms, (err, conteo) => {
                var paginas = Math.trunc(conteo/numeroPorPagina);
                if(conteo%numeroPorPagina!==0){
                    paginas++;
                }

                res.status(200).json({
                    ok: true,
                    busqueda: body,
                    terms: findTerms,
                    paginacion: {pagina:pageNumber, size: data?.length, pageSize: numeroPorPagina, total: conteo, pages: paginas },
                    tareas: data,

                });
            })


    })
}

/**
 * Consulta las tareas por paginas, por default pageSize=10, page=1, {nombreCliente, fechaAvaluo, estatus}
 * @param req Request de la peticion
 * @param res Respuesta de la peticion
 */
 function consultaActivos(req, res){
    let id =  req.params.id;
    let findTerms = {};

    findTerms ['$and'] = [ ];
    if( req.usuario?._id)
            findTerms ['$and'].push({'usuario':  mongoose.Types.ObjectId(req.usuario?._id) });
    findTerms ['$and'].push({'estatus':"ACTIVA"});
    findTerms ['$and'].push({'estado': {$in :["PROCESO"]}});

    Tarea.find(findTerms).exec((err, data)=>{
        if(err){
            res.status(400).json({
                status: false,
                id: id,
                error: "no existe"
            });
            return;
        }
        Tarea.countDocuments(findTerms, (err, conteo) => {
            res.status(200).json({
                ok: true,
                terms: findTerms,
                tareas: data,
            });
        })
    })
}

function actualizarTarea(req, res){
    var id = req.params.id;
    var body = req.body;

    Tarea.findByIdAndUpdate(id, body, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar partner',
                errors: err
            });
        }
        res.status(200).json({
                ok: true,
                body:body

        });
        
    });


}

module.exports={
    crear,
    consulta,
    consultaPaginado,
    catalogoEstados,
    consultaActivos,
    actualizarTarea,
    deleteTarea,
    catalogoTipos
};
