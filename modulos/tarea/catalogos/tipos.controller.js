'use strict'
var Tipo = require('./tipoAvaluo.model');

const mongoose = require("mongoose");


function crear(req, res){
    var tipo = new Tipo({...req.body});
    tipo.save((err, tipoGuardado) => {
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

function deleteInstance(req, res){
    let id =  req.params.id;

    Tipo.deleteOne({'_id':  mongoose.Types.ObjectId(id) }).exec((err, data)=>{
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
    let nombre =  req.params.nombre;
    let filter = [];
    if(id)
        filter['_id'] = mongoose.Types.ObjectId(id) ;
    if(nombre)
        filter['nombre'] = nombre;

    console.log(filter);
//{$or:[{_id: id}, {nombre: id}]}
    Tipo.findOne(filter).exec((err, data)=>{
        if(err){
            res.status(400).json({
                status: false,
                id: id,
                error: "no existe"
            });
            return;
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

    Tipo.find(findTerms,"nombre").exec((err, data)=>{
        if(err){
            res.status(400).json({
                status: false,
                id: id,
                error: "no existe"
            });
            return;
        }
        Tipo.countDocuments(findTerms, (err, conteo) => {
            res.status(200).json({
                ok: true,
                terms: findTerms,
                tipos: data,
            });
        })
    })
}

function actualizar(req, res){
    var id = req.params.id;
    var body = req.body;

    Tipo.findByIdAndUpdate(id, body, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar por id '+ id,
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
    consultaActivos,
    actualizar,
    deleteInstance
};