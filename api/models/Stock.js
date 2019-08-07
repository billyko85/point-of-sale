/**
 * Stock.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const groupDistinct = (arr, field) => 
  arr.map(value => value[field])
     .filter((value, ix, self) => self.indexOf(value) === ix)
     .join(",")


module.exports = {

  attributes: {

    codigo_proveedor : { type: 'string' },

    marca : { type: 'string' },

    modelo : { type: 'string' },

    fabricante : { type: 'string' },

    descripcion : { type: 'string' },

    datos_extra : { type: 'string' },

    atributo_extra : { type: 'string' },

    precio_venta : { type: 'float', required: true },

    disponible : { type: 'boolean', required: true },

    articulo_id : { type: 'integer', required: true },

    pedido_id : { type: 'integer', required: true },

    sucursal_id : { type: 'integer', required: true },

    proveedor_id : { type: 'integer', required: true }
  },

  createNFromArticulo: (cantidadRecibida, articuloId, pedidoId, atributoExtra, sucursalId) => {
    
    return Articulo.findOne(articuloId)
      .then(articulo => {
        const promises = []
        for(let i=0;i<cantidadRecibida;i++)
          promises.push(Stock.create({
            codigo_proveedor: articulo.codigo_proveedor,
            marca: articulo.marca,
            modelo: articulo.modelo,
            fabricante: articulo.fabricante,
            descripcion: articulo.descripcion,
            datos_extra: articulo.datos_extra,
            atributo_extra: atributoExtra,
            precio_venta: articulo.precio_venta,
            proveedor_id: articulo.proveedor_id,
            articulo_id: articulo.id,
            pedido_id: pedidoId,
            disponible: true,
            sucursal_id: sucursalId
          }))
        
        Promise.all(promises)
      });

  }

};

