/**
 * Estadogarantia.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    garantia_id: { type: 'number' },

    secuencia: { type: 'number' },

    fecha: { 
      type: 'ref',
      columnType: 'datetime',
    },

    estado: { type: 'string' },

    detalle: {
      type: 'string',
      allowNull: true
    }

  },
  
  beforeCreate: async (values, cb) => {

    const estados = await Estadogarantia.find({ garantia_id: values.garantia_id })
    const secuencia = reduce(estados, (max, e) => e.secuencia > max ? e.secuencia + 1 : max, 0)
    
    values.secuencia = secuencia + 1
    values.fecha = new Date()

    cb()

  }

};

