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
    
    sails.log.info("Creando detalle del pedido.")

    let pedidoId = req.body.pedido_id

    if(!pedidoId) {
      sails.log.info("Buscando o creando pedido.")
      const pedido = await PedidoService.getPedidoForArticulo(req.body.articulo_id, req.body.sucursal_id)
      pedidoId = pedido.id

    }

    sails.log.info("findOrCreate detallePedidos")
    DetallePedidos.findOrCreate({
      pedido_id: pedidoId,
      articulo_id: req.body.articulo_id,
      atributo_extra: req.body.atributo_extra,
    }, {
      pedido_id: pedidoId,
      articulo_id: req.body.articulo_id,
      precio_compra: req.body.precio_compra,
      atributo_extra: req.body.atributo_extra,
      cantidad: 0
    }).then((detalle) => {
      sails.log.info("Agregando "+ req.body.cantidad +" unidades al detalle del pedido")
      detalle.cantidad += parseInt(req.body.cantidad)
      return detalle.save()
    }).then(() => {
      sails.log.info("Detalle de pedido creado")
      res.send(200)
    })

  }

};

