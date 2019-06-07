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
    Venta.findOne(req.body.id)
      .exec((err, venta) => {

        if(venta && venta.estado !== "confirmado"){

          DetalleVenta.find({"venta_id": venta.id})
          .then(detalles => {

            venta.estado = "confirmado";
            venta.descuento_tipo = req.body.descuento.type;
            venta.descuento_valor = req.body.descuento.value;
            venta.mediopago_id = req.body.medioPago;
            venta.recargo = req.body.recargo;
            venta.total_bruto = detalles.reduce((sum, detalle) => sum + detalle.precio_venta, 0)
            venta.total_neto = Venta.calcularTotalNeto(venta.total_bruto, venta.descuento_tipo, venta.descuento_valor, venta.recargo)

            return Promise.all([
              Promise.all(detalles.map(detalle => Stock.findOne(detalle.stock_id))),
              venta.save()
            ])
          }).then(stocks => Promise.all(
            stocks[0].map(stock => {
              stock.disponible = false;
              return stock.save()
            })
          )).then(() => {
            res.send(200);
          }).catch(e => {
            console.log(e);
            res.send(500);
          });
    
        }else {
          res.send(404);
        }
      })
    
  }

};

