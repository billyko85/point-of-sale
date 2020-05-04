/**
 * VentaController
 *
 * @description :: Server-side logic for managing ventas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	


  /**
   * `VentaController.fecha()`
   */
  fecha: function (req, res) {
    return res.json({
      todo: 'fecha() is not implemented yet!'
    });
  },


  /**
   * `VentaController.cliente_id()`
   */
  cliente_id: function (req, res) {
    return res.json({
      todo: 'cliente_id() is not implemented yet!'
    });
  },


  /**
   * `VentaController.estado()`
   */
  estado: function (req, res) {
    return res.json({
      todo: 'estado() is not implemented yet!'
    });
  },



  confirmar: function(req, res) {
    LogService.info(`Confirmando venta ${req.body.id}`)
    Venta.findOne(req.body.id)
      .exec((err, venta) => {

        if(venta && venta.estado !== "confirmado"){
          let totalBruto = 0

          LogService.info(`Venta: ${venta.id} - Buscando detalles y stocks...`)
          
          Promise.all([
            DetalleVenta.find({"venta_id": venta.id}),
            Stock.find({id: Object.values(req.body.stockIds)})
          ]).then(values => {

            detalles = values[0]
            stocks = values[1]

            if(detalles.length === 0) {
              throw "No se puede confirmar una venta vacía."
            }

            LogService.info(`Venta: ${venta.id} - encontrados ${detalles.length} detalles y ${stocks.length} stocks`)

            for(let i=0; i<detalles.length; i++) {
              const detalle = detalles[i]
              const stockId = parseInt(req.body.stockIds[detalle.id])
              if(!stockId) throw "Falta ingresar los ids de las posiciones"

              const sIx = stocks.findIndex(stock => stock.id === stockId)
              if(sIx < 0) throw `No existe el stock con Id ${stockId}`

              const stock = stocks[sIx]

              if(stock.codigo_proveedor !== detalle.codigo_proveedor) throw `El id ${stockId} no corresponde con el código ${detalle.codigo_proveedor}`
              if(!stock.disponible) throw `El stock id ${stockId} no está disponible para la venta`

              detalle.stock_id = stockId
              totalBruto += detalle.precio_venta
            }

            const totalNeto = Venta.calcularTotalNeto(venta.total_bruto, req.body.descuento.type, req.body.descuento.value, req.body.recargo)

            LogService.info(`Venta: ${venta.id} - actualizando datos en db`)

            let sql = "SET xact_abort on; BEGIN TRANSACTION;"
            sql += detalles.map(d => `UPDATE detalleVenta
                                      SET stock_id = ${d.stock_id}
                                      WHERE id = ${d.id}`)
                           .join(" ;")

            const descType = req.body.descuento.type ? `'${req.body.descuento.type}'` : `null`

            sql = `${sql}; UPDATE venta
                    SET estado = 'confirmado',
                        descuento_tipo = ${descType},
                        descuento_valor = ${req.body.descuento.value},
                        mediopago_id = ${req.body.medioPago},
                        recargo = ${req.body.recargo},
                        total_bruto = ${totalBruto},
                        total_neto = ${totalNeto}
                    WHERE id = ${venta.id}`
            
            sql = `${sql};${stocks.map(s => `UPDATE stock
                                    SET disponible = 0
                                    WHERE id = ${s.id}`)
                          .join(" ;")}`
            
            sql = `${sql}; COMMIT;`
            LogService.info(sql)

            return new Promise((resolve, reject) => sails.getDatastore().sendNativeQuery(sql, [], (err) => {
              if(!err) resolve()
              else {
                LogService.error("Error en la query de actualizar venta", err)
                reject("Error desconocido al actualizar la venta")
              }
            }))
              
          }).then(() => {
            LogService.info(`Venta: ${venta.id} confirmada`)

            res.send(200);
          }).catch(e => {
            LogService.error(`Error al confirmar la venta ${venta.id}`, e)
            res.status(500).send(e);
          });
    
        }else {
          LogService.error(`La venta ${req.body.id} ya fue confirmada`)

          res.send(404);
        }
      })
    
  }

};

