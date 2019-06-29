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
    },

    stock_id : { 
      type: 'integer',
      required: true
    },

    precio_venta : { type: 'float' }
  },

  beforeCreate: (values, cb) => {

    Promise.all([
      Venta.findOne(values.venta_id),
      Stock.findOne(values.stock_id),
      DetalleVenta.find({ stock_id: values.stock_id })
    ]).then(values => {
      const venta = values[0]
      const stock = values[1]
      const detalles = values[2]

      if(!venta || venta.estado === "confirmado") {
        cb("La venta no existe o ya se encuentra confirmada.")
        return
      }
      if(!stock || !stock.disponible) {
        cb("El artículo ya no está disponible para la venta.")
        return
      }
      if(detalles.length !== 0) {
        cb("El artículo ya fue agregado a otra venta.")
        return
      }
      
      cb()

    }).catch(e => {
      LogService.error("Error validando el detalle de venta", e)
      cb("Ha ocurrido un error inesperado.")
    })

  }

};

