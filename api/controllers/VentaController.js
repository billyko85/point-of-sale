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



  confirmar: async (req, res) => {
    LogService.info(`Confirmando venta ${req.body.id}`, req.body)

    const venta = await Venta.findOne(req.body.id)
    if(!venta || venta.estado === "confirmado") {
      LogService.error(`La venta ${req.body.id} no existe o ya fue confirmada`)
      res.send(404);
      return;
    }

    VentaService.confirmar(venta, req.body.stockIds, req.body.devoluciones, req.body.descuento, req.body.recargo, req.body.medioPago)
      .then(() => {
        LogService.info(`Venta: ${req.body.id} confirmada`)
        res.send(200);
      }).catch(e => {
        LogService.error(`Error al confirmar la venta ${venta.id}`, e)
        res.status(500).send(e);
      })  
    
  }

};

