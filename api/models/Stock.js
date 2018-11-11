/**
 * Stock.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    codigo : { type: 'string' },

    marca : { type: 'string' },

    modelo : { type: 'string' },

    fabricante : { type: 'string' },

    descripcion : { type: 'string' },

    datos_extra : { type: 'string' },

    precio_venta : { type: 'float' },

    proveedor_id : { type: 'integer' }
  },

  createFromArticulo: (articuloId, cantidad) => {
    
    return Articulo.findOne(articuloId)
      .then((articulo) => {

        const promises = [];
        for(let i=0; i<cantidad; i++)
          promises.push(
            Stock.create({
              codigo: null, // TODO
              marca: articulo.marca,
              modelo: articulo.modelo,
              fabricante: articulo.fabricante,
              descripcion: articulo.descripcion,
              datos_exra: articulo.datos_extra,
              precio_venta: articulo.precio, // TODO
              proveedor_id: articulo.proveedor_id
            })
          );
        
        return Promise.all(promises);
      })

  }

};

