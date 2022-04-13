'use strict'
var Subtipo = require('./subTipoAvaluo.model');

const mongoose = require("mongoose");


function crear(req, res){
    var subtipo = new Subtipo({...req.body});
    subtipo['tipo'] = req.params.id;
    subtipo.save((err, tipoGuardado) => {
        if (err) {
            return res.status(400).json({
                status: false,
                mensaje: 'Error al crear el tipo',
                errors: err
            });
        }
        res.status(201).json({
            status: true,
            tipo: tipoGuardado
        });
    });
}

function deleteSubtipo(req, res){
    let id =  req.params.id;

    Subtipo.deleteOne({'_id':  mongoose.Types.ObjectId(id) }).exec((err, data)=>{
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

    Subtipo.findById(id).exec((err, data)=>{
        if(err){
            res.status(400).json({
                status: false,
                id: id,
                error: "no existe"
            });
        }
        res.status(201).json({
            status: true,
            tipo: data,
            error: err
        });
    })
}



/**
 * Consulta las tipos por paginas, por default pageSize=10, page=1, {nombreCliente, fechaAvaluo, estatus}
 * @param req Request de la peticion
 * @param res Respuesta de la peticion
 */
 function consultaActivos(req, res){
    let id =  req.params.id;
    let findTerms = {};

    findTerms ['$and'] = [ ];
    findTerms ['$and'].push({'estatus':"ACTIVO"});

    Subtipo.find(findTerms,"nombre").exec((err, data)=>{
        if(err){
            res.status(400).json({
                status: false,
                id: id,
                error: "no existe"
            });
            return;
        }
        Subtipo.countDocuments(findTerms, (err, conteo) => {
            res.status(200).json({
                estatus: true,
                terms: findTerms,
                tipos: data,
            });
        })
    })
}

function actualizarSubtipo(req, res){
    var id = req.params.id;
    var body = req.body;

    Subtipo.findByIdAndUpdate(id, body, (err) => {
        if (err) {
            return res.status(500).json({
                estatus: false,
                mensaje: 'Error al buscar partner',
                errors: err
            });
        }
        res.status(200).json({
                estatus: true,
                body:body

        });
        
    });


}

module.exports={
    crear,
    consulta,
    consultaActivos,
    actualizarSubtipo,
    deleteSubtipo
};