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
    
    LogService.info("Creando detalle del pedido.")

    let pedidoId = req.body.pedido_id
    let pedidoPromise = null;

    if(!pedidoId) {
      pedidoPromise = PedidoService.getPedidoForArticulo(req.body.articulo_id, req.body.sucursal_id)
    }else {
      pedidoPromise = Pedido.findOne(pedidoId)
    }

    LogService.debug("Buscando pedido")
    pedidoPromise.then((pedido) => {
      LogService.debug("Pedido encontrado, buscando articulo, proveedor y detalle")
      return Promise.all([
        Articulo.findOne(req.body.articulo_id),
        Proveedor.findOne(pedido.proveedor_id),
        DetallePedidos.findOrCreate({
          pedido_id: pedido.id,
          articulo_id: req.body.articulo_id,
          atributo_extra: req.body.atributo_extra,
        }, {
          pedido_id: pedido.id,
          articulo_id: req.body.articulo_id,
          precio_compra: 0,
          atributo_extra: req.body.atributo_extra,
          cantidad: 0
        })
      ])
    }).then(values => {

      const articulo = values[0]
      const proveedor = values[1]
      const detalle = values[2]

      LogService.debug("Agregando "+ req.body.cantidad +" unidades al detalle del pedido")
      detalle.cantidad += parseInt(req.body.cantidad)
      detalle.precio_compra = (articulo.precio * (1 - proveedor.porc_descuento / 100)).toFixed(2)
      return DetallePedidos.update({id:detalle.id})
        .set({
          cantidad: detalle.cantidad,
          precio_compra: detalle.precio_compra
        }).then(() => detalle)
    }).then(detalle => {
      LogService.info("Detalle de pedido creado")
      res.send(detalle)
    }).catch(reason => {
      LogService.error("Error creando un detalle de pedido", reason)
      res.send(500)
    })

  }

};

