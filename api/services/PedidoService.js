module.exports = {

    getPedidoForArticulo: articuloId => Articulo.findOne(articuloId)
                .then(articulo => PedidoService.findPedidoPendienteForProveedor(articulo.proveedor_id)),

    findPedidoPendienteForProveedor: (proveedorId) => Pedido.find({
        "proveedor_id": proveedorId,
        "estado": {"!": ["confirmado"]}
      })
    

}