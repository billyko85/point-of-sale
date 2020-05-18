/**
 * Garantia.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    sucursal_id: { type: 'number' },

    stock_id: { type: 'number' },

    proveedor_id: { type: 'number' },

    detalle: { type: 'string' },

    garantia_reconocida: {
      type: 'boolean',
      allowNull: true
    }

  },

};

