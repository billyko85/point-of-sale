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

    disponible : { type: 'boolean' },

    articulo_id: { type: 'integer' },

    proveedor_id : { type: 'integer' }
  },

  createFromArticulo: (articuloId, datosExtra) => {
    
    return Articulo.findOne(articuloId)
      .then((articulo) => {

        return Stock.create({
          codigo: null, // TODO
          marca: articulo.marca,
          modelo: articulo.modelo,
          fabricante: articulo.fabricante,
          descripcion: articulo.descripcion,
          datos_extra: datosExtra,
          precio_venta: articulo.precio_venta,
          proveedor_id: articulo.proveedor_id,
          articulo_id: articulo.id,
          disponible: true
        });

      })

  }

};

