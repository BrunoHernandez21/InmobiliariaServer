'use strict'

// modelos
//const ExcelJS = require('exceljs');
var Template = require('./template');
var CONFIG_MAIL = require('../../config/config').configMail;
const fs = require('fs');
const nodemailer = require('nodemailer');
var Usuario = require('../auth/authentication.model');



function generarLinkMaps(lat, lng){
    let code = '<a href="https://www.google.com/maps/place/' + lat + ',' + lng + '">VER EN GOOGLE MAPS</a>';
    return code;
}

function generarImgMaps(lat, lng){
    let code = '<img src="https://maps.googleapis.com/maps/api/staticmap?center='+lat+','+lng+'&markers=color:red%7Clabel:C%7C'+lat+','+lng+'&zoom=16&size=600x400&key=AIzaSyDyJPphaC4_NbvJEJlSVsgKKbMN8iInCdo"/>';
    return code;
}



async function enviarCorreoNuevoPassword(usuario)
{
    let filtro = {code: 'EMAIL_SEND_PASSWORD'};
    let template = await Template.findOne(filtro);


    if(!template){
        return {estatus: 'error', message: 'No existen templates'}

    }
    let arr = [];
    console.log(template);
    let transporter = nodemailer.createTransport(CONFIG_MAIL);


    let body = template.content
        .replace("%name%", usuario.name)
        .replace("%password%", usuario.password)
        .replace("%email%", usuario.email)

    let subject = template.subject

    let mailOptions = {
        from: template.from,
        to:    usuario.email,
        cc: template.toCC,
        subject: subject,
        html: body
    };

    let res = await transporter.sendMail(mailOptions);

    return {estatus: 'ok', message: 'Correo enviado' , res  }

}

async function enviaCredencialesAcceso(usuarios)
{
    let findTerms = {passwordTmp: {$nin:[null]}}
    let filtro = {code: 'EMAIL_SEND_PASSWORD'};
    let template = await Template.findOne(filtro);


    if(!template){
        return {estatus: 'error', message: 'No existen templates'}

    }
    let arr = [];
    console.log(template);
    let transporter = nodemailer.createTransport(CONFIG_MAIL);

    for(let i=0; i<usuarios.length; i++ ){
        console.log('>'+usuarios[i]);


            let body = template.content
                .replace("%name%", usuarios[i].nombre)
                .replace("%password%", usuarios[i].passwordTmp)
                .replace("%email%", usuarios[i].email)

            let subject = template.subject

            let mailOptions = {
                from: template.from,
                to:    usuarios[i].email,
                cc: template.toCC,
                subject: subject,
                html: body
            };

            let usuario = await Usuario.findByIdAndUpdate({_id: usuarios[i]._id},  { passwordTmp: null} );

            let res = await transporter.sendMail(mailOptions);

            arr.push(res);

    }

    return {estatus: 'ok', message: 'Correo enviado', arr:arr   }

}

module.exports={

    enviaCredencialesAcceso,
    enviarCorreoNuevoPassword
};