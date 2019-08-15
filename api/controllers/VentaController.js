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

            LogService.info(`Venta: ${venta.id} - encontrados ${detalles.length} detalles y ${stocks.length} stocks`)

            for(let i=0; i<detalles.length; i++) {
              const detalle = detalles[i]
              const stockId = req.body.stockIds[detalle.id]
              if(!stockId) throw "Falta ingresar los ids de las posiciones"

              const sIx = stocks.findIndex(stock => stock.id = stockId)
              if(sIx < 0) throw `No existe el stock con Id ${stockId}`

              const stock = stocks[sIx]
              console.log(stock, detalle);
              if(stock.codigo_proveedor != detalle.codigo_proveedor) throw `El id ${stockId} no corresponde con el código ${detalle.codigo_proveedor}`
              if(!stock.disponible) throw `El stock id ${stockId} no está disponible para la venta`

              detalle.stock_id = stockId
              totalBruto += detalle.precio_venta
            }

            LogService.info(`Venta: ${venta.id} - actualizando venta`)

            venta.estado = "confirmado";
            venta.descuento_tipo = req.body.descuento.type;
            venta.descuento_valor = req.body.descuento.value;
            venta.mediopago_id = req.body.medioPago;
            venta.recargo = req.body.recargo;
            venta.total_bruto = totalBruto;
            venta.total_neto = Venta.calcularTotalNeto(venta.total_bruto, venta.descuento_tipo, venta.descuento_valor, venta.recargo)

            LogService.info(`Venta: ${venta.id} - actualizando en db`)

            const promises = detalles.map(d => d.save())
            promises.push(venta.save())
            promises.concat(stocks.map(stock => {
              stock.disponible = false;
              return stock.save()
            }))

            return Promise.all(promises)
              
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

