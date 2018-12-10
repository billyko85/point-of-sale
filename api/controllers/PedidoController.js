/**
 * PedidoController
 *
 * @description :: Server-side logic for managing pedidoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	


  /**
   * `PedidoController.fecha()`
   */
  fecha: function (req, res) {
    return res.json({
      todo: 'fecha() is not implemented yet!'
    });
  },


  /**
   * `PedidoController.proveedor_id()`
   */
  proveedor_id: function (req, res) {
    return res.json({
      todo: 'proveedor_id() is not implemented yet!'
    });
  },


  /**
   * `PedidoController.estado()`
   */
  estado: function (req, res) {
    return res.json({
      todo: 'estado() is not implemented yet!'
    });
  },

  confirmar: function(req, res) {
    Pedido.findOne(req.body.id)
      .exec((err, pedido) => {

        if(pedido){
          let promises = [];
          const recibidos = req.body.recibidos;

          for(let id in recibidos) {
            const promise = DetallePedidos.findOne(id)
              .then((detalle) => {
                if(detalle) {
                  detalle.recibido = recibidos[id]
                  if(recibidos[id]) {
                    return Promise.all([
                      detalle.save(),
                      Stock.createFromArticulo(detalle.articulo_id, detalle.datos_extra, pedido.sucursal_id)
                    ]);
                  }else {
                    return detalle.save();
                  }
                }
              })
            
            promises.push(promise);
          }
          
          pedido.estado = "confirmado";
          promises.push(pedido.save());

          Promise.all(promises).then(() => {
            res.send(200);
          }).catch(e => {console.log(e)});
    
        }else {
          res.send(404);
        }
      })
    
  }

};

