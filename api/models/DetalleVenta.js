/**
 * DetalleVenta.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    venta_id : { 
      type: 'integer',
      required: true
    },

    stock_id : { 
      type: 'integer',
      required: true
    },

    precio_venta : { type: 'float' }
  },

  beforeCreate: (detalle, cb) => {

    if(!detalle.venta_id) {
      Venta.create({
        fecha: new Date(),
        estado: "pendiente"
      }).then((venta) => {
        detalle.venta_id = venta.id
        cb()
      })
    }

  }

};

