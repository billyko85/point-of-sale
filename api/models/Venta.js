/**
 * Venta.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const isArray = require("lodash/isArray")

module.exports = {

  attributes: {

    fecha : {
      type: 'ref',
      columnType: 'datetime',
    },

    cliente_id : {
      type: 'number',
      allowNull: true
    },

    estado : { type: 'string', required: true},

    descuento_tipo : {
      type: 'string',
      allowNull: true
    },

    descuento_valor : {
      type: 'float',
      allowNull: true
    },

    mediopago_id : {
      type: 'number',
      allowNull: true
    },

    user_id : { type: 'number' },

    sucursal_id : { type: 'number' },

    recargo : { type: 'float' },

    total_bruto : { type: 'float' },

    total_neto : { type: 'float' }

  },

  afterDestroy: (destroyedRecords, cb) => {
    Promise.all(
      destroyedRecords.map(destroyedRecord => DetalleVenta.destroy({venta_id: destroyedRecord.id}))
    ).then(() => cb())
  },

  calcularTotalNeto: (totalBruto, descuentoTipo, descuentoValor, recargo) => {
    let newTotal = totalBruto
    if(descuentoTipo === "%")
        newTotal = newTotal * (1 - descuentoValor / 100)
    else if(descuentoTipo === "$")
        newTotal = newTotal - descuentoValor
    
    newTotal += recargo * newTotal / 100
    
    return newTotal
  }

};

