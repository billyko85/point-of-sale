/**
 * DetalleVenta.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    venta_id: { 
      type: 'number',
      allowNull: true
    },

    stock_id: { 
      type: 'number',
      allowNull: true
    },

    codigo_proveedor: {
      type: 'string',
      allowNull: true
    },

    marca: {
      type: 'string',
      allowNull: true
    },

    modelo: {
      type: 'string',
      allowNull: true
    },

    fabricante: {
      type: 'string',
      allowNull: true
    },

    descripcion: {
      type: 'string',
      allowNull: true
    },

    atributo_extra: {
      type: 'string',
      allowNull: true
    },

    precio_venta: { 
      type: 'float',
      allowNull: true
    },

    proveedor_id : { 
      type: 'number',
      allowNull: true
    },
    
    devolucion : { type: 'boolean' },
    
    devolucion_id : {
      type: 'number',
      allowNull: true
    },

  },

  beforeCreate: async (values, cb) => {

    const venta = await Venta.findOne(values.venta_id)
    
    if(!venta || venta.estado === "confirmado") {
      cb({code: 404, message: 'La venta no existe o ya se encuentra confirmada.' });
      return
    }

    if(values.stock_id) {
      const otroDetalle = await DetalleVenta.find({ stock_id: values.stock_id, venta_id: values.venta_id })
      
      if(otroDetalle.length > 0) {
        cb({ code: 403, message: 'Ese artículo ya había sido agregado a la venta'})
        return;
      }
      const stock = await Stock.findOne(values.stock_id)

      if(!stock) {
        cb({ code: 404, message:'El id no existe' });
        return;
      }
      
      const devolucion = !stock.disponible

      values.codigo_proveedor = stock.codigo_proveedor
      values.marca = stock.marca
      values.modelo = stock.modelo
      values.fabricante = stock.fabricante
      values.descripcion = stock.descripcion
      values.atributo_extra = stock.atributo_extra
      values.precio_venta = stock.precio_venta
      values.proveedor_id = stock.proveedor_id
      values.devolucion = devolucion

      if(values.devolucion) {

        const detallesDeVentas = await DetalleVenta.find({
          stock_id: values.stock_id,
          devolucion: false
        })
      
        if(detallesDeVentas.length === 0) {
          cb({code: 404, message: 'No se encontró la venta original del artículo a devolver.' })
          return
        }
        const detVenta = detallesDeVentas.pop()
        const devId = await crearDevolucion(detVenta, venta)

        values.precio_venta = detVenta.precio_venta * -1
        values.devolucion_id = devId
      }
      
      cb()

    } else {
      values.stock_id = null
      cb()
    }

  },

  afterDestroy: async (destroyedRecord, cb) => {
    
    if(destroyedRecord.devolucion) {
      await Devolucion.destroy({ id: destroyedRecord.devolucion_id })
    }
    
    cb()
  },

};

const crearDevolucion = async (detalleOrig, ventaCambio) => {

  const ventaOrig = await Venta.findOne(detalleOrig.venta_id)
  
  const dev = await Devolucion.create({
    venta_inicial_id: detalleOrig.venta_id,
    venta_devolucion_id: ventaCambio.id,
    precio: detalleOrig.precio_venta,
    fecha_venta: ventaOrig.fecha,
    fecha_cambio: ventaCambio.fecha,
  }).fetch()

  return dev.id

}
