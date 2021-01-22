/**
 * DetallePedidos.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    pedido_id: {
      type: 'number',
    },

    precio_compra: {
      type: 'float',
      required: true,
    },

    atributo_extra: { type: 'string' },

    articulo_id: {
      type: 'number',
      required: true,
    },

    cantidad: {
      type: 'number',
      required: true,
    },

    cantidad_recibida: { type: 'number' },

  },

  updateQuantity: (detallePedidos, cantidad) => {
    detallePedidos.cantidad = cantidad;
    return detallePedidos.save();
  },

  calculatePrecioCompra: (articulo, proveedor) => (articulo.precio * (1 - proveedor.porc_descuento / 100)).toFixed(2),

};
