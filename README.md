node --version
Version Node
v11.12.0

npm --version
6.7.0



# Backend-Server

Este es el código necesario para establecer el backend conectado a MongoDB usando Mongoose.

Para ejecutarlo, es necesario reconstruir los módulos de node usando el comando

```
npm install
```

## Dentro de Google-Signin-demo
Existe un pequeño ejercicio para probar la autenticación de Google en un Front-End básico pero funcional.

Para instalar librerias comenzar con
npm install

Para iniciar el proyecto
npm start

si se quiere tener visible
npm start --host 0.0.0.0



Consideraciones de  los endpoints


Cada nombre de entidad debe de representar lo que se esta trabajando( nombre mnemónico).
Los defaults de paginaciones son pagina:1, numero de registros por página: 10,
```
GET /productoInversion/combo     <--- catalogo para combo {catalogo: [{id:xxx, nombre:yyy}, {}]}
```
Consulta de todos los productos, como no se indica el filtro este regresará por defaults una paginación
```
GET /productoInversion     <--- plural {productos: []}
```
POST /productoInversion     <--- plural body o payload {filtro:{ atributo:'like xxx'}, paginacion:{page: 1, rows:10} }
por default la pagina inicial es 1, el registro máximo por página es de 10
```
{productos:[{...},{...}], paginacion:{page: 1, rows:10, pages:5, total:55}}´
```
POST /productoInversion     <--- plural body o payload {id: xxx, atributo:like xxx, page: 1, rows:10, }
POST /productoInversion?page=1&rows=10     <--- plural body o payload {id: xxx, atributo:like xxx }
```
    resultados: {productos: [], filtro: {nombre:'plato'}, paginacion:{} }
```

```
GET /productoInversion/:id  <--- Trae el producto con el identificador :id
GET /productoInversion/combo           <--- consulta todos los productos como combo
GET /productoInversion/combo?q=palabra <--- consulta los productos como combo a partir de un valor buscado "palabra"
GET /productoInversion/combo?q=palabra&page=1&rows=10 <--- consulta los productos como combo a partir de un valor buscado "palabra"

POST /producto      <---crear un producto
POST /productos     <---consulta los productos con los filtros y paginaciones
PUT /producto      <---actualizaciones un producto
DELETE /producto/:id  <--- Te borra el producto con el identificador :id
```