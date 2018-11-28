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

        if(venta){
          let promises = [];

          const promise = DetalleVenta.find({"venta_id": venta.id})
          .then((detalles) => {

            const detallePromises = [];
            for(ix in detalles) {
              const detalle = detalles[ix]
              detalle.disponible = false
              detallePromises.push(detalle.save());
            }
            
            return Promise.all(detallePromises);
          })
          
          promises.push(promise);
          
          venta.estado = "confirmado";
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

