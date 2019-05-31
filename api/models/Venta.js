/**
 * Venta.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    fecha : { type: 'string' },

    cliente_id : { type: 'integer' },

    estado : { type: 'string', required: true},

    descuento_tipo : { type: 'string' },

    descuento_valor : { type: 'float' },

    mediopago_id : { type: 'integer' },

    recargo : { type: 'float' }

  },

  afterDestroy: (destroyedRecords, cb) => {
    Promise.all(
      destroyedRecords.map(destroyedRecord => DetalleVenta.destroy({venta_id: destroyedRecord.id}))
    ).then(() => cb())
  }

};

