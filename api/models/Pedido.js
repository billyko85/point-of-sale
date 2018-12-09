/**
 * Pedido.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    fecha : {
      type: 'date',
      required: true
    },

    proveedor_id : { 
      type: 'integer',
      required: true
    },

    estado : { 
      type: 'string',
      required: true
    }
    
  },
  
  afterValidate : (pedido, cb) => {

    PedidoService.findPedidoPendienteForProveedor(pedido.proveedor_id)
    .then((pedidos) => {
      if(pedidos.length === 0) cb()
      else cb("Ya hay un pedido pendiente para el proveedor");
    })

  }
};

