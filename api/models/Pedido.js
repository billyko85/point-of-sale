/**
 * Pedido.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    fecha : {
      type: 'ref',
      columnType: 'datetime',
      required: true
    },

    proveedor_id : { 
      type: 'integer',
      required: true
    },

    estado : { 
      type: 'string',
      required: true
    },

    sucursal_id: {
      type: 'integer', 
      required: true 
    },
    
  },
  
  /*beforeCreate : (pedido, cb) => {

    PedidoService.findPedidoPendienteForProveedor(pedido.proveedor_id, pedido.sucursal_id)
    .then((resp) => {
      if(resp.pedidos.length === 0 || resp.pedidos.find((elm) => elm.id === pedido.id)) cb()
      else {
        cb("Ya hay un pedido pendiente para el proveedor en esa sucursal")
      }
    })

  },*/

  afterDestroy: (destroyedRecords, cb) => {
    Promise.all(
      destroyedRecords.map(destroyedRecord => DetallePedidos.destroy({pedido_id: destroyedRecord.id}))
    ).then(() => cb())
  }

};

