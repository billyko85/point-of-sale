/**
 * Devolucion.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    detalle_venta_id: { type: 'number' },

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

    descripcion: {
      type: 'string',
      allowNull: true
    }

  },

};

