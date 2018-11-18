/**
 * DetallePedidos.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    pedido_id : { type: 'integer' },

    precio_compra: { type: 'float' },

    datos_extra: { type: 'string' },

    articulo_id : { type: 'integer' },

    recibido : { type: 'boolean' },

    precio : { 
      type: 'float'
    }
  },

  updateQuantity: (detallePedidos, cantidad) => {
    detallePedidos.cantidad = cantidad;
    return detallePedidos.save();
  }

};

