/**
 * DetallePedidosController
 *
 * @description :: Server-side logic for managing detallepedidos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	


  /**
   * `DetallePedidosController.pedido_id()`
   */
  pedido_id: function (req, res) {
    return res.json({
      todo: 'pedido_id() is not implemented yet!'
    });
  },


  /**
   * `DetallePedidosController.cantidad()`
   */
  cantidad: function (req, res) {
    return res.json({
      todo: 'cantidad() is not implemented yet!'
    });
  },


  /**
   * `DetallePedidosController.articulo_id()`
   */
  articulo_id: function (req, res) {
    return res.json({
      todo: 'articulo_id() is not implemented yet!'
    });
  },

  /**
   * `DetallePedidosController.precio()`
   */
  precio: function (req, res) {
    return res.json({
      todo: 'precio() is not implemented yet!'
    });
  },

  create: async (req, res) => {
    
    let pedidoId = req.body.pedido_id

    if(!pedidoId) {
      const pedido = await PedidoService.getPedidoForArticulo(req.body.articulo_id, req.body.sucursal_id)
      pedidoId = pedido.id
    }
    
    await DetallePedidos.createMany({
      pedido_id: pedidoId,
      articulo_id: req.body.articulo_id,
      precio_compra: req.body.precio_compra,
      datos_extra: req.body.datos_extra
    }, req.body.cantidad)
    
    res.send(200)

  }

};

