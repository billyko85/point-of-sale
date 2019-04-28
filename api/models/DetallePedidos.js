/**
 * DetallePedidos.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    pedido_id : { 
      type: 'integer'
    },

    precio_compra: { 
      type: 'float',
      required: true
    },

    atributo_extra: { type: 'string' },

    articulo_id : { 
      type: 'integer',
      required: true
    },

    cantidad : { 
      type: 'integer',
      required: true
    },

    cantidad_recibida : { type: 'integer' }
    
  },

  updateQuantity: (detallePedidos, cantidad) => {
    detallePedidos.cantidad = cantidad;
    return detallePedidos.save();
  },

  createMany: (detalle, amount) => {

    const promises = [];
    for(let i=0; i<amount; i++) {
      const promise = DetallePedidos.create(detalle)
      promises.push(promise);
    }

    return Promise.all(promises)
  }

};

