/**
 * Stock.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    codigo_proveedor: { type: 'string' },

    marca: { type: 'string', allowNull: true },

    modelo: { type: 'string', allowNull: true },

    fabricante: { type: 'string', allowNull: true },

    descripcion: { type: 'string', allowNull: true },

    datos_extra: { type: 'string', allowNull: true },

    atributo_extra: { type: 'string', allowNull: true },

    precio_venta: { type: 'float', required: true },

    disponible: { type: 'boolean', required: true },

    articulo_id: { type: 'number', required: true },

    pedido_id: { type: 'number', required: true },

    sucursal_id: { type: 'number', required: true },

    proveedor_id: { type: 'number', required: true },
  },

};
