
mongoimport --db dbName --collection collectionName --file fileName.json


./mongoexport -d quiniela -c equipos >equipos.json

./mongoimport -d quiniela -c equipos --file equipos.json 


Exportar a un solo archivo:
mongodump --db quiniela --out mongodump-quiniela.archive

Exportar todas las colecciones por archivo
mongodump --db quiniela --out dump

Importar bd
C:\Program Files\MongoDB\Server\4.0\bin>mongorestore.exe E:\projects\angular\quiniela-backend\resources\dump\


./mongorestore dump









