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
          let promises = [];

          const promise = DetalleVenta.find({"venta_id": venta.id})
          .then(detalles => Promise.all(
            detalles.map(detalle => Stock.findOne(detalle.stock_id))
          )).then(stocks => Promise.all(
            stocks.map(stock => {
              stock.disponible = false;
              return stock.save()
            })
          ))
          
          promises.push(promise);
          
          venta.estado = "confirmado";
          venta.descuento_tipo = req.body.descuento.type;
          venta.descuento_valor = req.body.descuento.value;
          venta.mediopago_id = req.body.medioPago;
          venta.recargo = req.body.recargo;
          promises.push(venta.save());

          Promise.all(promises).then(() => {
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

