/**
 * Venta.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    fecha : { type: 'date' },

    cliente_id : { type: 'integer' },

    estado : { type: 'string', required: true},

    descuento_tipo : { type: 'string' },

    descuento_valor : { type: 'float' },

    mediopago_id : { type: 'integer' },

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

