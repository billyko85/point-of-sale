module.exports = {

    getPedidoForArticulo: (articuloId, sucursalId) => Articulo.findOne(articuloId)
                .then(articulo => PedidoService.findPedidoPendienteForProveedor(articulo.proveedor_id, sucursalId))
                .then(resp => {
                    if(resp.pedidos.length === 0) return PedidoService.createPedidoForProveedor(resp.proveedorId, resp.sucursalId)
                    return resp.pedidos[0]
                }),

    findPedidoPendienteForProveedor: (proveedorId, sucursalId) => Pedido.find({
        "proveedor_id": proveedorId,
        "sucursal_id": sucursalId,
        "estado": {"!": ["confirmado"]}
    }).then(pedidos => ({ pedidos, proveedorId, sucursalId })),

    createPedidoForProveedor: (proveedorId, sucursalId) => Pedido.create({
        fecha: new Date(),
        proveedor_id: proveedorId,
        sucursal_id: sucursalId,
        estado: "pendiente"
    })
    

}