/**
 * DetalleVenta.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    venta_id: { 
      type: 'integer',
    },

    stock_id: { 
      type: 'integer'
    },

    codigo_proveedor: {
      type: 'string'
    },

    marca: {
      type: 'string'
    },

    modelo: {
      type: 'string'
    },

    fabricante: {
      type: 'string'
    },

    descripcion: {
      type: 'string'
    },

    atributo_extra: {
      type: 'string'
    },

    precio_venta: { 
      type: 'float' 
    },

    proveedor_id : { 
      type: 'integer'
    }
  },

  beforeCreate: (values, cb) => {

    Promise.all([
      Venta.findOne(values.venta_id),
      Stock.findOne(values.stock_id)
    ]).then(dbValues => {
      const venta = dbValues[0]
      const stock = dbValues[1]

      if(!venta || venta.estado === "confirmado") {
        cb("La venta no existe o ya se encuentra confirmada.")
        return
      }

      values.stock_id = null
      values.codigo_proveedor = stock.codigo_proveedor
      values.marca = stock.marca
      values.modelo = stock.modelo
      values.fabricante = stock.fabricante
      values.descripcion = stock.descripcion
      values.atributo_extra = stock.atributo_extra
      values.precio_venta = stock.precio_venta
      values.proveedor_id = stock.proveedor_id

      cb()

    }).catch(e => {
      LogService.error("Error validando el detalle de venta", e)
      cb("Ha ocurrido un error inesperado.")
    })

  }

};

