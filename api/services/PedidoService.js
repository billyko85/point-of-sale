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

      LogService.info(`Actualizando detalles del pedido ${pedidoId}`)

      let sql = "SET xact_abort on; BEGIN TRANSACTION"
      
      for(let i in detalles) {
        const detalle = detalles[i]
        detalle.cantidad_recibida = recibidos[detalle.id] >= 0 ? recibidos[detalle.id] : detalle.cantidad
        //LogService.info(`Detalle ${detalle.id} recibidos: ${detalle.cantidad_recibida}`)
        //updatePromises.push(Stock.createNFromArticulo(detalle.cantidad_recibida, detalle.articulo_id, pedido.id, detalle.atributo_extra, pedido.sucursal_id))
      }

      sql = `${sql};
        ${detalles.map(d => `UPDATE detallePedidos
                            SET cantidad_recibida = ${d.cantidad_recibida}
                            WHERE id = ${d.id}`).join("; ")};
        UPDATE pedido
        SET estado = 'confirmado'
        WHERE id = ${pedido.id}`
        
      return Articulo.find({id: detalles.map(d => d.articulo_id)})
        .then(articulos => {
          const inserts = detalles.map(d => {
            const aIx = articulos.findIndex(a => a.id === d.articulo_id)
            const articulo = articulos[aIx]
            return Stock.createNFromArticulo(d.cantidad_recibida, articulo, pedido.id, d.atributo_extra, pedido.sucursal_id)
          }).join("; ")

          sql = `${sql}; ${inserts}; COMMIT;`
          console.log(sql)

          return new Promise((resolve, reject) => Pedido.query(sql, [], (err) => {
            if(err === null) resolve()
            else {
              LogService.error("Error en la query de confirmar pedido", err)
              reject("Error desconocido al confirmar pedido")
            }
          }))

        })

    })
  }

}