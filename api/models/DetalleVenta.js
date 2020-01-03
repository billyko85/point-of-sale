/**
 * DetalleVenta.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const flaverr = require('flaverr');
 
module.exports = {

  attributes: {

    venta_id: { 
      type: 'number',
      allowNull: true
    },

    stock_id: { 
      type: 'number'
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
      type: 'number'
    }
  },

  beforeCreate: (values, cb) => {

    Venta.findOne(values.venta_id)
    .then(venta => {
      if(!venta || venta.estado === "confirmado") {
        cb({code: 404, message: 'La venta no existe o ya se encuentra confirmada.' });
        return
      }

      if(values.stock_id) {
        return Stock.findOne(values.stock_id)
        .then(stock => {
          if(!stock) {
            cb({ code: 404, message:'El id no existe' });
            return;
          }
          if(!stock.disponible) {
            cb({ code: 404, message:'El artículo a agregar no está disponible' });
            return;
          }

          values.codigo_proveedor = stock.codigo_proveedor
          values.marca = stock.marca
          values.modelo = stock.modelo
          values.fabricante = stock.fabricante
          values.descripcion = stock.descripcion
          values.atributo_extra = stock.atributo_extra
          values.precio_venta = stock.precio_venta
          values.proveedor_id = stock.proveedor_id
          cb()
        })
      }

      values.stock_id = null
      cb()
      return
    }).catch(e => {
      LogService.error("Error validando el detalle de venta", e)
      cb({ code: 500, message:'Ha ocurrido un error inesperado' });
    })

  }

};

