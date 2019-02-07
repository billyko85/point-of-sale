/**
 * Articulo.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    marca : { type: 'string' },

    modelo : { type: 'string' },

    fabricante : { type: 'string' },

    categoria : { type: 'string' },

    descripcion : { type: 'string' },

    stock_min : { type: 'integer' },

    datos_extra : { type: 'string' },

    precio : { 
      type: 'float',
      required: true,
      notNull: true
    },

    precio_venta : { 
      type: 'float',
      required: true,
      notNull: true
    },

    actualiza_precio : { 
      type: 'boolean',
      required: true,
      notNull: true
    },

    proveedor_id : { 
      type: 'integer',
      required: true,
      notNull: true 
    },

    id_ref: { 
      type: 'integer', 
      index: true 
    }
  },

  afterUpdate: (updatedRecord, cb) => {
    Stock.find({"articulo_id": updatedRecord.id})
      .then((stocks) => {
        if(stocks.length > 0) {
          const promises = [];
          for(let i=0; i<stocks.length; i++) {
            const stock = stocks[i];
            stock.precio_venta = updatedRecord.precio_venta;
            promises.push(stock.save())
          }
          return Promise.all(promises);
        }else {
          cb();
        }
      }).then((err) => {
        cb();
      })

  }

};

