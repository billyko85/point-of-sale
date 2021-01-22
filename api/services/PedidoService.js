const reduce = require('lodash/reduce');

module.exports = {

  getPedidoForArticulo: (articuloId, sucursalId) => Articulo.findOne(articuloId)
    .then((articulo) => Pedido.findOrCreate({
      proveedor_id: articulo.proveedor_id,
      sucursal_id: sucursalId,
      estado: { '!=': ['confirmado'] },
    }, {
      fecha: new Date(),
      proveedor_id: articulo.proveedor_id,
      sucursal_id: sucursalId,
      estado: 'pendiente',
    })),

  createPedidoForProveedor: (proveedorId, sucursalId) => Pedido.create({
    fecha: new Date(),
    proveedor_id: proveedorId,
    sucursal_id: sucursalId,
    estado: 'pendiente',
  }).fetch(),

  confirmPedido: async (pedidoId, recibidos) => {
    const [pedido, detalles] = await Promise.all([
      Pedido.findOne(pedidoId),
      DetallePedidos.find({ pedido_id: pedidoId }),
    ]);

    if (!detalles || detalles.length === 0) throw 'El pedido no contiene ningún artículo';
    if (!pedido) throw 'El pedido no existe';
    if (pedido.estado === 'confirmado') throw 'El pedido ya había sido confirmado';

    LogService.info(`Actualizando detalles del pedido ${pedidoId}`);

    let sql = 'SET xact_abort on; BEGIN TRANSACTION';

    Object.keys(detalles).forEach((i) => {
      const detalle = detalles[i];
      detalle.cantidad_recibida = recibidos[detalle.id] >= 0 ? recibidos[detalle.id] : detalle.cantidad;
    });

    sql = `${sql};
        ${detalles.map((d) => `UPDATE detallePedidos
                            SET cantidad_recibida = ${d.cantidad_recibida}
                            WHERE id = ${d.id}`).join('; ')};
        UPDATE pedido
        SET estado = 'confirmado'
        WHERE id = ${pedido.id}`;

    const articulos = await Articulo.find({ id: detalles.map((d) => d.articulo_id) });
    const listados = await ListadoStock.find({ articulo_id: detalles.map((d) => d.articulo_id) });

    const inserts = detalles.filter((d) => d.cantidad_recibida > 0).map((d) => {
      const aIx = articulos.findIndex((a) => a.id === d.articulo_id);
      const articulo = articulos[aIx];
      const listadoExists = listados.some((l) => l.articulo_id === d.articulo_id);

      const listadoStockSql = StockService.createOrUpdateListadoStock(
        d.cantidad_recibida, articulo, d.atributo_extra, pedido.sucursal_id, listadoExists,
      );
      const stockSql = !articulo.stock_recurrente ? StockService.createStocksFromArticulo(
        d.cantidad_recibida, articulo, pedido.id, d.atributo_extra, pedido.sucursal_id,
      ) : '';

      return `${listadoStockSql}; ${stockSql}`;
    }).join('; ');

    sql = `${sql}; ${inserts}; COMMIT;`;
    console.log(sql);

    const rawResult = await sails.sendNativeQuery(sql, []);

    if (!rawResult.err) return;

    LogService.error('Error en la query de confirmar pedido', err);
    throw 'Error desconocido al confirmar pedido';
  },

  bulkCreate: async (sucursalId, proveedor, stocks) => {
    const existe = await Pedido.findOne({
      sucursal_id: sucursalId,
      proveedor_id: proveedor.id,
      estado: { '!=': ['confirmado'] },
    });

    if (existe !== undefined) throw 'Ya existe un pedido pendiente para este proveedor';
    const pedido = await PedidoService.createPedidoForProveedor(proveedor.id, sucursalId);
    const articulos = await Articulo.find({ id: stocks.map((s) => s.articulo_id) });

    const detalles = reduce(stocks, (result, stock) => {
      const det = result[stock.articulo_id] = result[stock.articulo_id] || {
        pedido_id: pedido.id,
        precio_compra: DetallePedidos.calculatePrecioCompra(articulos.find((art) => art.id === stock.articulo_id), proveedor),
        atributo_extra: stock.atributo_extra,
        articulo_id: stock.articulo_id,
        cantidad: 0,
      };
      det.cantidad += 1;
      result[stock.articulo_id] = det;
      return result;
    }, {});

    await DetallePedidos.createEach(Object.values(detalles));

    return pedido;
  },

};
