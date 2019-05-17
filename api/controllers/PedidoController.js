/**
 * PedidoController
 *
 * @description :: Server-side logic for managing pedidoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  confirmar: function(req, res) {

    sails.log.info(`Confirmando pedido ${req.body.id}`)

    PedidoService.confirmPedido(req.body.id, req.body.recibidos)
      .then(() => {
        sails.log.info(`Pedido confirmado ${req.body.id}`)
        res.status(200).send()
      }).catch((error) => {
        sails.log.error(`Error confirmando pedido ${req.body.id}`, error)
        res.status(500).send(error)
      })
  }

};

