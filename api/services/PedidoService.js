module.exports = {

  getPedidoForArticulo: (articuloId, sucursalId) => Articulo.findOne(articuloId)
    .then(articulo => PedidoService.findPedidoPendienteForProveedor(articulo.proveedor_id, sucursalId))
    .then(resp => {
      if (resp.pedidos.length === 0) return PedidoService.createPedidoForProveedor(resp.proveedorId, resp.sucursalId)
      return resp.pedidos[0]
    }),

  findPedidoPendienteForProveedor: (proveedorId, sucursalId) => Pedido.find({
    "proveedor_id": proveedorId,
    "sucursal_id": sucursalId,
    "estado": { "!": ["confirmado"] }
  }).then(pedidos => ({ pedidos, proveedorId, sucursalId })),

  createPedidoForProveedor: (proveedorId, sucursalId) => Pedido.create({
    fecha: new Date(),
    proveedor_id: proveedorId,
    sucursal_id: sucursalId,
    estado: "pendiente"
  }),

  confirmPedido: (pedidoId, recibidos) => {
    return Promise.all([
      Pedido.findOne(pedidoId),
      DetallePedidos.find({ pedido_id: pedidoId})
    ]).then((values) => {
      
      const pedido = values[0]
      const detalles = values[1]

      if (!detalles || detalles.length === 0) throw "El pedido no contiene ningún artículo"
      if (!pedido) throw "El pedido no existe"
      if (pedido.estado === "confirmado") throw "El pedido ya había sido confirmado"

      const updatePromises = []

      LogService.info(`Actualizando detalles del pedido ${pedidoId}`)
      for(let i in detalles) {
        const detalle = detalles[i]
        detalle.cantidad_recibida = recibidos[detalle.id] >= 0 ? recibidos[detalle.id] : detalle.cantidad
        LogService.info(`Detalle ${detalle.id} recibidos: ${detalle.cantidad_recibida}`)
        updatePromises.push(detalle.save())
        
        for(let j=0; j<detalle.cantidad_recibida; j++) 
          updatePromises.push(Stock.createFromArticulo(detalle.articulo_id, pedido.id, detalle.atributo_extra, pedido.sucursal_id))
      }

      pedido.estado = "confirmado";
      updatePromises.push(pedido.save());

      return Promise.all(updatePromises)

    })
  }

}