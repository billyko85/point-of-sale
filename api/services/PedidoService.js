module.exports = {

    getPedidoForArticulo: (articuloId, sucursalId) => Articulo.findOne(articuloId)
                .then(articulo => PedidoService.findPedidoPendienteForProveedor(articulo.proveedor_id, sucursalId)),

    findPedidoPendienteForProveedor: (proveedorId, sucursalId) => Pedido.find({
        "proveedor_id": proveedorId,
        "sucursal_id": sucursalId,
        "estado": {"!": ["confirmado"]}
      })
    

}