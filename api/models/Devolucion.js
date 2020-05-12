/**
 * Devolucion.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    venta_inicial_id: { type: 'number' },

    venta_devolucion_id: { type: 'number' },

    precio: { type: 'float' },

    fecha_venta: {
      type: 'ref',
      columnType: 'datetime'
    },

    fecha_cambio: {
      type: 'ref',
      columnType: 'datetime'
    },

    detalle: {
      type: 'string',
      allowNull: true
    },

    tipo_devolucion: {
      type: 'string',
      allowNull: true
    }

  },

};

