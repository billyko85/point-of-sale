/**
 * VentasAgregadas.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    fecha : { 
      type: 'ref',
      columnType: 'datetime',
    },

    medioPago : {
      type: 'string',
      allowNull: true
    },

    total : { type: 'float' }
  }
};

