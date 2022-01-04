'use strict'


var Menu = require('./menu.model');
const {response} = require("express");


function crear(req, res){
    var body = req.body;

    var menu = new Menu({...body});
    menu.save((err, menuGuardada) => {
        if (err) {
            return res.status(400).json({
                status: false,
                mensaje: 'Error al crear la menu',
                errors: err
            });
        }
        res.status(201).json({
            status: true,
            menu: menuGuardada
        });
    });
}

function consultaByRol(req, res){
    let name = 'adminNavigation';
    Menu.findOne({id: name}).exec((err, data)=>{
        if(err){
            res.status(400).json({
                status: false,
                name: name,
                error: "no existe"
            });
        }
        res.status(201).json({default: data.items});
    })
}

function consulta(req, res){
    let id =  req.params.id;

    Menu.findById(id).exec((err, data)=>{
        if(err){
            res.status(400).json({
                status: false,
                id: id,
                error: "no existe"
            });
        }
        res.status(201).json({
            status: true,
            menu: data,
            error: err
        });
    })
}


/**
 * Consulta las menus por paginas, por default pageSize=10, page=1
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

    Menu.find(findTerms)
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
            Menu.countDocuments(findTerms, (err, conteo) => {
                var paginas = Math.trunc(conteo/numeroPorPagina);
                if(conteo%numeroPorPagina!==0){
                    paginas++;
                }

                res.status(200).json({
                    ok: true,
                    busqueda: body,
                    paginacion: {pagina:pageNumber, size: data.length, pageSize: numeroPorPagina, total: conteo, pages: paginas },
                    menus: data,

                });
            })


    })
}

module.exports={
    consultaByRol,
    crear,
    consulta,
    consultaPaginado
};