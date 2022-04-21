'use strict'

var Partner = require('../../models/administracion/partner');
var mongoose = require('mongoose');


// ==========================================
// Crear Partner
// ==========================================
function crearNuevoPartner(req, res){

    var body = req.body;

    var partner = new Partner({...body});

    partner.save((err, partnerGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear partner',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            partner: partnerGuardado
        });
    });
}
// ==========================================
// Obtener todos las Partners Sin paginacion
// ==========================================
function obtenerPartnersSinPaginacion(req, res){
    let user = req.usuario;
    let filter = {};
    if(user?.role!=='USER_ROOT'){
        filter['_id']=user.partner;
    }
    Partner.find({})
        .select('_id nombre host img theme background colorTheme direccion facebook app www tel publicApiKey owner')
        .exec(
            (err, partner) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Partner',
                        errors: err
                    });
                }
                Partner.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        partner: partner,
                        total: conteo
                    });
                })
            },
            error =>{
                console.log(error);
            });
}
// ==========================================
// Obtener todos las Partners
// ==========================================
function obtenerPartners(req, res){
    console.log('----------------------------------------Partners-----------------------------------------------------------');
    var body = req.body;
    var desde;
    console.log(body);
    let user = req.usuario;

    var pageNumber = body.pageNumber || 0;
    pageNumber = Number(pageNumber);

    var numeroPorPagina = body.size || 0;
    numeroPorPagina = Number(numeroPorPagina);


    let filter = {};
    if (body.busqueda){
        filter ['$or'] =
            [
                {'nombre': new RegExp(body.busqueda, 'i')},
                {'host': new RegExp(body.busqueda, 'i')},
            ];
    }
    if(user.role !== 'ROOT_USER'){
        filter ['partner'] =mongoose.Types.ObjectId(user.partner);

    }


    desde = pageNumber*numeroPorPagina;
    desde = Number(desde);
    console.log(desde);
    Partner.find(filter)
        .select('_id nombre host img theme background colorTheme direccion facebook app www tel publicApiKey owner')
        .skip(desde)
        .limit(numeroPorPagina)
        .exec(
            (err, partner) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Partner',
                        errors: err
                    });
                }
                Partner.countDocuments(filter, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        partner: partner,
                        total: conteo
                    });
                })
            },
            error =>{
                console.log(error);
            });
}
// ==========================================
// Obtener la empresa por ID
// ==========================================

function obtenerPorIdPartner(req, res){
    var id = req.params.id;
    console.log(id);
    Partner.findById(id)
        .exec(
            (err, partner) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Partner',
                        errors: err
                    });
                }
                if (!partner) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El partner con id ' + id + ' no existe',
                        errors: { message: 'No existe el partner con ese ID' }
                    });
                }
                res.status(200).json({
                    ok: true,
                    partner: partner
                });
            },
            error =>{
                console.log(error);
            });
}

// ==========================================
// Obtener todos las empresas para Comboc
// ==========================================
function obtenerSociosParaCombo(req, res){
    var body = req.body;
    var partner = req.partner;

    console.log('--obtenerSociosParaCombo---');
    console.log(body);
    var role = body.role;

    console.log(role);




    Partner.find({})
        .select('_id nombre host img theme background colorTheme direccion facebook app www tel publicApiKey owner')
        .exec(
            (err, partners) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Taxi',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    partners: partners,
                });

            },
            error =>{
                console.log(error);
            });


}

// ==========================================
// Eliminar Partner
// ==========================================
function eliminarPartner(req, res){

    var id = req.params.id;

    Partner.findByIdAndRemove(id, (err, partnerBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar direccion',
                errors: err
            });
        }
        if (!partnerBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un partner con ese id',
                errors: { message: 'No existe un partner con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            partner: partnerBorrado
        });

    });
}
// ==========================================
// Actualizar Partner
// ==========================================
function actualizarPartner(req, res){
    var id = req.params.id;
    var body = req.body;

    Partner.findByIdAndUpdate(id, body, {new:true}, (err, partner) => {
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
// ==========================================
// Obtener configuracion de Partner
// ==========================================
function obtenerConfiguracionPartner(req, res){

    var host = req.get('origin');
    console.log('host del config : '+host);

    Partner.findOne({host: host})
        .select('nombre img theme background colorTheme')
        .populate({ path: 'relatedPartner',
            select: 'nombre host img theme background colorTheme' })
        .exec(
            (err, partner) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando configuracion de partner',
                        errors: err
                    });
                }
                console.log(partner);
                if(partner){
                    res.status(200).json({
                        ok: true,
                        host: host,
                        exists: true,
                        partner: partner.relatedPartner?partner.relatedPartner:partner
                    });
                }else{
                    var partner = new Partner({
                        _id: null,
                        host: host,
                        img: 'default.png',
                        nombre: host,
                        colorTheme: 'theme-default'
                    });
                    res.status(200).json({
                        ok: true,
                        exists: false,
                        host: host,
                        partner: partner
                    });
                }

            },
            error =>{
                console.log('Error al consultar configuracion de partner ' +error);
            });
}

module.exports={
    crearNuevoPartner,
    obtenerPartners,
    obtenerSociosParaCombo,
    obtenerPorIdPartner,
    eliminarPartner,
    actualizarPartner,
    obtenerConfiguracionPartner,
    obtenerPartnersSinPaginacion
};