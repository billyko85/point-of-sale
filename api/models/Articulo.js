/**
 * Articulo.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    codigo_proveedor: { type: 'string' },

    marca: {
      type: 'string',
      allowNull: true,
    },

    modelo: {
      type: 'string',
      allowNull: true,
    },

    fabricante: {
      type: 'string',
      allowNull: true,
    },

    categoria: {
      type: 'string',
      allowNull: true,
    },

    descripcion: { type: 'string' },

    stock_min: {
      type: 'number',
      allowNull: true,
    },

    datos_extra: {
      type: 'string',
      allowNull: true,
    },

    precio: {
      type: 'float',
      required: true,
    },

    precio_venta: {
      type: 'float',
      required: true,
    },

    actualiza_precio: {
      type: 'boolean',
      required: true,
    },

    stock_recurrente: {
      type: 'boolean',
      required: true,
    },

    proveedor_id: {
      type: 'number',
      required: true,
    },

    id_ref: {
      type: 'number',
    },
  },

  afterUpdate: (updatedRecord, cb) => {
    Stock.find({ articulo_id: updatedRecord.id })
      .then((stocks) => {
        if (stocks.length > 0) {
          const promises = [];
          for (let i = 0; i < stocks.length; i++) {
            const stock = stocks[i];
            stock.precio_venta = updatedRecord.precio_venta;
            promises.push(stock.save());
          }
          return Promise.all(promises);
        }
        cb();
      }).then((err) => {
        cb();
      });
  },

};
