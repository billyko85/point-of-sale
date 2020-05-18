const reduce = require('lodash').reduce

module.exports = {

  confirmar: async (venta, stockIds, devoluciones, descuento, recargo, medioPago) => {

    LogService.info(`Venta: ${venta.id} - Buscando detalles y stocks...`)

    const values = await VentaService.findDetailsAndStocks(venta.id, Object.values(stockIds))

    detalles = values[0]
    stocks = values[1]

    if (detalles.length === 0) {
      throw "No se puede confirmar una venta vacía."
    }
    
    LogService.info(`Venta: ${venta.id} - encontrados ${detalles.length} detalles`)

    const detallesCompras = detalles.filter(d => !d.devolucion)
    validarCompras(detallesCompras, stocks, stockIds)

    const detallesDevoluciones = detalles.filter(d => d.devolucion)
    validarDevoluciones(detallesDevoluciones, devoluciones)

    let totalBruto = reduce(detallesCompras, (sum, d) => sum + d.precio_venta, 0)
    totalBruto = reduce(detallesDevoluciones, (sum, d) => sum + d.precio_venta, totalBruto)

    const totalNeto = Venta.calcularTotalNeto(venta.total_bruto, descuento.type, descuento.value, recargo)
    venta.medioPago = medioPago
    venta.descuento_tipo = descuento.type
    venta.descuento_valor = descuento.value
    venta.recargo = recargo
    venta.total_bruto = totalBruto
    venta.total_neto = totalNeto
    
    for (let i=0; i < detallesCompras.length; i++){
      detallesCompras[i].stock_id = stockIds[detallesCompras[i].id]
    }

    return updateDatabase(venta, detallesCompras, detallesDevoluciones, devoluciones, stockIds)

  },

  findDetailsAndStocks: (ventaId, stockIds) => Promise.all([
    DetalleVenta.find({ "venta_id": ventaId }),
    Stock.find({ id: stockIds })
  ])

}


const validarCompras = (detallesCompras, stocks, stockIds) => {
  for (let i = 0; i < detallesCompras.length; i++) {
    const detalle = detallesCompras[i]

    const stockId = parseInt(stockIds[detalle.id])
    if (!stockId) throw "Falta ingresar los ids de las posiciones"

    const sIx = stocks.findIndex(stock => stock.id === stockId)
    if (sIx < 0) throw `No existe el stock con Id ${stockId}`

    const stock = stocks[sIx]

    if (stock.codigo_proveedor !== detalle.codigo_proveedor) throw `El id ${stockId} no corresponde con el código ${detalle.codigo_proveedor}`
    if (!stock.disponible) throw `El stock id ${stockId} no está disponible para la venta`
    
  }
}

const validarDevoluciones = (detallesDevoluciones, devoluciones) => {
  for (let i=0; i < detallesDevoluciones.length; i++) {
    const detalle = detallesDevoluciones[i]
    const devolucion = devoluciones[detalle.id]
    if(!devolucion || !devolucion.type || !devolucion.detail) throw "Se debe ingresar un detalle a cada devolución"

  }
}

const updateDatabase = (venta, detallesCompras, detallesDevoluciones, devoluciones, stockIds) => {
  LogService.info(`Venta: ${venta.id} - actualizando datos en db`)

  const detallesFallas = Object.values(detallesDevoluciones).filter(d => devoluciones[d.id].type === "FALLA")
  const detallesDevOtros = Object.values(detallesDevoluciones).filter(d => devoluciones[d.id].type !== "FALLA")

  let sql = "SET xact_abort on; BEGIN TRANSACTION;"
  sql += detallesCompras.map(d => `UPDATE detalleVenta
                                SET stock_id = ${d.stock_id}
                                WHERE id = ${d.id}`)
    .join(" ;")

  const descType = venta.descuento_tipo ? `'${venta.descuento_tipo}'` : `null`

  sql = `${sql}; UPDATE venta
            SET estado = 'confirmado',
                descuento_tipo = ${descType},
                descuento_valor = ${venta.descuento_valor},
                mediopago_id = ${venta.medioPago},
                recargo = ${venta.recargo},
                total_bruto = ${venta.total_bruto},
                total_neto = ${venta.total_neto}
            WHERE id = ${venta.id}`

  sql = `${sql}; ${Object.values(stockIds).map(id => `UPDATE stock
                            SET disponible = 0
                            WHERE id = ${id}`)
    .join(" ;")}`

  sql = `${sql}; ${detallesDevOtros
    .map(d => `UPDATE stock
              SET disponible = 1
              WHERE id = ${d.stock_id}`)
    .join(" ;")}`

  const gtiaSql = detallesFallas.map(d =>
    `INSERT INTO garantia (
      sucursal_id,
      stock_id,
      proveedor_id,
      detalle,
      createdAt
    ) values (
      ${venta.sucursal_id},
      ${d.stock_id},
      ${d.proveedor_id},
      '${devoluciones[d.id].detail.replace(/['"]/g, "$&$&")}',
      getdate()
    );
    INSERT INTO estadogarantia (
      garantia_id,
      secuencia,
      fecha,
      estado,
      detalle,
      createdAt
    ) values (
      @@identity,
      0,
      getdate(),
      'Devuelto',
      '${devoluciones[d.id].detail.replace(/['"]/g, "$&$&")}',
      getdate()
    )`
  ).join(" ;")

  const devolSql = Object.values(detallesDevoluciones)
    .map(d => `UPDATE devolucion
               SET tipo_devolucion = '${devoluciones[d.id].type}',
                   detalle = '${devoluciones[d.id].detail.replace(/['"]/g, "$&$&")}'`)
    .join(" ;")
  
  sql = `${sql}; ${devolSql}; ${gtiaSql} COMMIT;`
  
  LogService.info(sql)

  return new Promise((resolve, reject) => sails.getDatastore().sendNativeQuery(sql, [], (err) => {
    if (!err) resolve()
    else {
      LogService.error("Error en la query de actualizar venta", err)
      reject("Error desconocido al actualizar la venta")
    }
  }))

}