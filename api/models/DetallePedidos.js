/**
 * DetallePedidos.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    pedido_id : { type: 'integer' },

    cantidad : { type: 'integer' },

    cantidad_recibida : { type: 'integer' },

    articulo_id : { type: 'integer' },

    precio : { 
      type: 'float'
    }
  },

  updateQuantity: (detallePedidos, cantidad) => {
    detallePedidos.cantidad = cantidad;
    return detallePedidos.save();
  }

};

