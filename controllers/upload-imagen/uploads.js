
'use strict'
// modulos
var fs = require('fs');
// servicio jwt

function downloadUserActivity(req, res){
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
}


module.exports = {
    downloadUserActivity,
};