'use strict'

// modelos
const ExcelJS = require('exceljs');
var Template = require('../../models/template/template');
var CotizacionMaquinaria = require('../../models/renton/cotizacion_maquinaria');
var CONFIG_MAIL = require('../../config/config').configMail;
const fs = require('fs');
const nodemailer = require('nodemailer');
var Usuario = require('../../modulos/auth/authentication.model');



function enviaMailCotizaMaquinaria(req, res){
    let idCotiza = req.params.idCotiza;

    console.log(idCotiza);

    enviarCorreoCotizaPorId(idCotiza).then(data=>{
        return res.status(400).json({
            estatus: 'ok',
            data: data.message
        
        });
    });
}


async function enviarCorreoEncuesta(encuesta, host){
    let filtro = {code: 'EMAIL_SEND_ENCUESTA_IMI'};
    let template = await Template.findOne(filtro);

    console.log('enviando correo a:' + encuesta.email);
    if(!template){
        return {estatus: 'error', message: 'No existen templates'}

    }else{
        let transporter = nodemailer.createTransport(CONFIG_MAIL);

        let body = template.content
            
            .replace("%name%", '')
            .replace("%url%", host + '/encuesta/' + encuesta._id)
            
        let subject = template.subject
            .replace('%name%', '');

        let mailOptions = {
            from: template.from, // sender address
            to:   encuesta.email,
            cc: template.toCC, // list of receivers
            subject: subject, // Subject line
            html: body// html body

        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                //return console.log(error);
                res.status(500).send({error: error});
            }
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            //res.status(200).send({mail:'ok'});
            return {estatus: 'ok', message: 'Correo enviado'}
        });
    }


}

// ==========================================
// Enviar correo de finalizacion estados de cuenta
// ==========================================
async function enviarCorreoEstadosDeCuenta(contratos){
    let filtro = {code: 'EMAIL_SEND_ESTADOSDECUENTA_SKAYDRUS'};
    let template = await Template.findOne(filtro);

    if(!template){
        return {estatus: 'error', message: 'No existen templates'}

    }else{
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Estados De Cuenta" , {properties:{defaultColWidth:20}}); 
        const datosEst = [
            'Numero de contrato', 'Numero de cliente', 'Nombre de cliente','Estado de cuenta'
        ];
        worksheet.addRow(datosEst).eachCell((cell) => {cell.font = {bold: true};});
        const items = contratos;
        for(let i=0; i<items.length; i++){
            var datos = [
                items[i].numeroDeContrato,
                items[i].numeroDeCliente,
                items[i].nombreCliente,
                items[i].estadoDeCuenta
            ];
            worksheet.addRow(datos);
        };

        const excl = await workbook.xlsx.writeFile('./uploads/inversiones/estadosDeCuenta.xlsx');
        
        let transporter = nodemailer.createTransport(CONFIG_MAIL);

        let body = template.content
            
        let subject = template.subject

        let mailOptions = {
            from: template.from,
            to:   template.email,
            cc: template.toCC, 
            subject: subject, 
            html: body,
            attachments: [{'filename': 'estadosDeCuenta.xlsx', path: './uploads/inversiones/estadosDeCuenta.xlsx' }]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('error :>> ', error);;
            }

            try {
                fs.unlinkSync('./uploads/inversiones/estadosDeCuenta.xlsx')
                console.log('File removed')
            } catch(err) {
                console.error('Something wrong happened removing the file', err)
            }

            return {estatus: 'ok', message: 'Correo enviado'}
        });
    }
}

// ===============================================
// Enviar correo con link de estado de cuenta(pdf)
// ===============================================
async function enviarCorreoUrlEstadoDeCuenta(req, res){
    var data = req.body;
    let filtro = {code: 'EMAIL_SEND_URL_ESTADODECUENTA_SKAYDRUS'};
    let template = await Template.findOne(filtro);

    if(!template){
        return {estatus: 'error', message: 'No existen templates'}

    }else{
        let transporter = nodemailer.createTransport(CONFIG_MAIL);

        let body = template.content
            .replace("%name%", data.nombreCliente)
            .replace("%url%", data.url)
            .replace("%numeroContrato%", data.numeroContrato)
            .replace("%periodo%", data.periodo)
            
        let subject = template.subject

        let mailOptions = {
            from: template.from,
            to:   data.email,
            cc: template.toCC, 
            subject: subject, 
            html: body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al enviar el estado de cuenta',
                    errors: error
                });
            }  
            if (!info) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al enviar el estado de cuenta',
                    errors: error
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'El estado de cuenta se envio correctamente'
            });
        });
    }
}

// type: '[Contacto] Set Files'

async function enviarCorreoCotizaPorId(idCotiza){
    const cotiza = await CotizacionMaquinaria.findById(idCotiza);
    var CotizaFiles;
    if (cotiza.files === '' || 
        cotiza.files === undefined || 
        cotiza.files === null || 
        cotiza.files === [] || 
        cotiza.files === {} || 
        JSON.stringify(cotiza.files) === '{}')
        {
        CotizaFiles = 'nofiles';
    }else{
        CotizaFiles = cotiza.files;
    }
    console.log('***>' + cotiza);
    let filtro = {code: 'EMAIL_SEND_COTIZA_MAQUINA'};
    let template = await Template.findOne(filtro);

    if(!template){
        return {estatus: 'error', message: 'No existen templates'}

    }else{
        // Crear el arschivo excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Productos" , {properties:{defaultColWidth:20}}); 
        const datosNombre = [
            'Nombre', 
            cotiza.nombre
        ];
        const datosRazonSocial = [
            'Razón Social', 
            cotiza.razonSocial
        ];
        const datosRut = [
            'RUT', 
            cotiza.rut
        ];
        const datosLugarAtencion = [
            'Lugar', 
            (cotiza.lugarAtencion + ". Latitud: " + cotiza.lat + ", Longitud: " + cotiza.lng)
        ];
        const datosTel = [
            'Teléfono', 
            cotiza.tel
        ];
        worksheet.addRow(datosNombre);
        worksheet.addRow(datosRazonSocial);
        worksheet.addRow(datosRut);
        worksheet.addRow(datosLugarAtencion);
        worksheet.addRow(datosTel);
        worksheet.addRow('');
        worksheet.addRow('');
        worksheet.addRow('');
        const datosProd = [
            'Producto', 'Cantidad', 'Horas','Fecha Inicia', 'Fecha Final','Dias',
        ];
        worksheet.addRow(datosProd).eachCell((cell) => {cell.font = {bold: true};});
        const items = cotiza.products;
        for(let i=0; i<items.length; i++){
            var datos = [
                items[i].producto.name,
                items[i].cantidad,
                items[i].hours,
                items[i].fechaInicial,
                items[i].fechaFinal,
                items[i].days
            ];
            worksheet.addRow(datos);
        };
        worksheet.getCell('A1').font = {bold: true};
        worksheet.getCell('A2').font = {bold: true};
        worksheet.getCell('A3').font = {bold: true};
        worksheet.getCell('A4').font = {bold: true};
        worksheet.getCell('A5').font = {bold: true};

        const data = await workbook.xlsx.writeFile('./uploads/cotizacionRenton/'+cotiza._id+'.xlsx');

        let transporter = nodemailer.createTransport(CONFIG_MAIL);

        let body = template.content
            .replace("%email%", cotiza.email)
            .replace("%name%", cotiza.nombre)
            .replace("%razonSocial%", cotiza.razonSocial)
            .replace("%rut%", cotiza.rut)
            .replace("%tel%", cotiza.tel)
            .replace("%lugarAtencion%", (cotiza.lugarAtencion + ". Latitud: " + cotiza.lat + ", Longitud: " + cotiza.lng))
            .replace("%linkMaps%", generarLinkMaps(cotiza.lat, cotiza.lng))
            .replace("%imgMaps%", generarImgMaps(cotiza.lat, cotiza.lng))
            .replace("%products%", armaTablaProductos (cotiza.products))
            .replace("%files%", (armaListaArchivos(CotizaFiles, cotiza._id)))

        let subject = template.subject
            .replace('%name%', cotiza.nombre);

        let mailOptions = {
            from: template.from, // sender address
            to:   cotiza.email ,
            cc: template.toCC, // list of receivers
            subject: subject, // Subject line
            html: body,// html body
            attachments: [{'filename': 'productos.xlsx', path: './uploads/cotizacionRenton/'+cotiza._id+'.xlsx' }]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('error :>> ', error);;
            }
            return {estatus: 'ok', message: 'Correo enviado'}
        });
    }


}



async function enviarCorreoWallet(data){
        let filtro = {code: 'EMAIL_SEND_WALLET'};
        let template = await Template.findOne(filtro);
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });

        if(!template){
            return {estatus: 'error', message: 'No existen templates'}

        }else{
            let transporter = nodemailer.createTransport(CONFIG_MAIL);

            let body = template.content
                .replace("%name%", data.nombre)
                .replace("%wallet%", data.wallet);


            let subject = template.subject

            let mailOptions = {
                from: template.from,
                to:   data.email,
                cc: template.toCC,
                subject: subject,
                html: body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('error :>> ', error);;
                }
                return {estatus: 'ok', message: 'Correo enviado'}
            });
        }
}

async function enviarCorreoLead(data){
    let filtro = {code: 'EMAIL_SEND_LEAD'};
    let template = await Template.findOne(filtro);
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    if(!template){
        return {estatus: 'error', message: 'No existen templates'}

    }else{
        let transporter = nodemailer.createTransport(CONFIG_MAIL);

        let body = template.content
            .replace("%name%", data.nombre)
            .replace("%producto%", data.configuraciones.producto)
            .replace("%plazo%", data.configuraciones.plazo)
            .replace("%inversion%", formatter.format(data.configuraciones.inversion))
            .replace("%tabla%", armaTablaLead(data.configuraciones.tabla))
            
        let subject = template.subject

        let mailOptions = {
            from: template.from,
            to:   data.email,
            cc: template.toCC, 
            subject: subject, 
            html: body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('error :>> ', error);;
            }
            return {estatus: 'ok', message: 'Correo enviado'}
        });
    }
}

function armaTablaLead(items){
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    let code = '<table>';
    code += '<tr>';
        code += '    <th>Mes</td>';
        code += '    <th>Anterior</td>';
        code += '    <th>Ganancia Fija</td>';
        code += '    <th>Ganancia Variable</td>';
        code += '    <th>Total</td>';
        code += '</tr>';

    for(let i=0; i<items.length; i++){
        code += '<tr>';
        code += '    <td>'+ items[i].mes + '</td>';
        code += '    <td>'+ formatter.format(items[i].inicia) + '</td>';
        code += '    <td>'+ formatter.format(items[i].gananciaFija) + '</td>';
        code += '    <td>'+ formatter.format(items[i].gananciaVariable) + '</td>';
        code += '    <td>'+ formatter.format(items[i].fin) + '</td>';

        code += '</tr>';
    }
    code += '</table>';
    return code;
}

function armaTablaProductos(items){
    let code = '<table>';
    code += '<tr>';
        code += '    <th>Nombre</td>';
        code += '    <th>Cantidad</td>';
        code += '    <th>Horas</td>';
        code += '    <th>Fecha Inicial</td>';
        code += '    <th>Fecha Final</td>';
        code += '    <th>Dias</td>';
        code += '</tr>';

    for(let i=0; i<items.length; i++){
        code += '<tr>';
        code += '    <td>'+ items[i].producto.name + '</td>';
        code += '    <td>'+ items[i].cantidad + '</td>';
        code += '    <td>'+ (items[i].hours|'N/E') + '</td>';
        code += '    <td>'+ items[i].fechaInicial.toLocaleDateString("es-PE") + '</td>';
        code += '    <td>'+ items[i].fechaFinal.toLocaleDateString("es-PE") + '</td>';
        code += '    <td>'+ items[i].days + '</td>';

        code += '</tr>';
    }
    code += '</table>';
    return code;
}

function generarLinkMaps(lat, lng){
    let code = '<a href="https://www.google.com/maps/place/' + lat + ',' + lng + '">VER EN GOOGLE MAPS</a>';
    return code;
}

function generarImgMaps(lat, lng){
    let code = '<img src="https://maps.googleapis.com/maps/api/staticmap?center='+lat+','+lng+'&markers=color:red%7Clabel:C%7C'+lat+','+lng+'&zoom=16&size=600x400&key=AIzaSyDyJPphaC4_NbvJEJlSVsgKKbMN8iInCdo"/>';
    return code;
}


function armaListaArchivos(files, idCotiza){
    if(files !== 'nofiles'){
        console.log('Hay files');
        let code = '<ul>';
        code += '<li> <a href=' + files.riesgoEmpresa + ' >1.- Reporte actualizado de la Central de Riesgo de la empresa solicitante. </a> </li>';
        code += '<li> <a href=' + files.riesgoRepLegal + ' >2.- Reporte actualizado de la Central de Riesgo del representante legal de la empresa.</a> </li>';
        code += '<li> <a href=' + files.letrasCambio + ' >3.- Emisión de letras de cambio. debidamente firmado por el representante legal de la empresa contratante, en su calidad de Gerente, asimismo, debidamente firmada como Aval solidario en la letra de cambio.</a> </li>';
        code += '<li> <a href=' + files.rut + ' >4.- Ficha RUC de la empresa contratante. </a>';
        code += '<li> <a href=' + files.dni + ' >5.- DNI del representante legal de la empresa contratante. </a> </li>';
        code += '<li> <a href=' + files.vigenciaPoder + ' >6.- Vigencia de Poder del representante legal de la empresa contratante. </a> </li>';
        code += '</ul>';
        code += '<br/>';
        code += '<br/>';
        code += '<p>Puede acceder a su cotización en el siguiente enlace. <a href="https://cotiza.renton.pe/cotizacion/'+idCotiza+'">Cotización </a></p>';
        // code += '<p>Puede acceder a su cotización en el siguiente enlace. <a href="http://localhost:4200/cotizacion/'+idCotiza+'">Cotización </a></p>';

        return code;
    } else{
        console.log('No hay files');
        let code = '<ul>';
        code += '<li> <p>No se adjunto ningún archivo.</p> </li>';
        code += '</ul>';
        code += '<br/>';
        code += '<br/>';
        code += '<p>Puede acceder a su cotización en el siguiente enlace. <a href="https://cotiza.renton.pe/cotizacion/'+idCotiza+'">Cotización </a></p>';
        // code += '<p>Puede acceder a su cotización en el siguiente enlace. <a href="http://localhost:4200/cotizacion/'+idCotiza+'">Cotización </a></p>';

        return code;
    }
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
        .replace("%name%", usuario.nombre)
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

    return {estatus: 'ok', message: 'Correo enviado'   }

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
    enviaMailCotizaMaquinaria,
    enviarCorreoCotizaPorId,
    enviarCorreoEncuesta,
    enviarCorreoEstadosDeCuenta,
    enviarCorreoUrlEstadoDeCuenta,
    enviarCorreoLead,
    enviarCorreoWallet,
    enviaCredencialesAcceso,
    enviarCorreoNuevoPassword
};