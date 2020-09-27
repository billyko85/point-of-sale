/**
 * PedidoController
 *
 * @description :: Server-side logic for managing pedidoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const PedidoService = require("../services/PedidoService");

module.exports = {

  confirmar: function(req, res) {

    LogService.info(`Confirmando pedido ${req.body.id}`)

    PedidoService.confirmPedido(req.body.id, req.body.recibidos)
      .then(() => {
        LogService.info(`Pedido confirmado ${req.body.id}`)
        res.status(200).send()
      }).catch((error) => {
        LogService.error(`Error confirmando pedido ${req.body.id}`, error)
        res.status(500).send(error)
      })
  },

  bulkCreate: async function(req, res) {
    const sucursalId = req.body.sucursalId
    const proveedorId = req.body.proveedorId
    const days = req.body.days
    
    const dateToFind = new Date()
    dateToFind.setDate(dateToFind.getDate() - days)

    const proveedor = await Proveedor.findOne({id: proveedorId})
    const stocks = await (Venta.find({
      estado: "confirmado",
      fecha: {">=": `${dateToFind.getFullYear()}-${dateToFind.getMonth()}-${dateToFind.getDate()}`}
    }).then(ventas => DetalleVenta.find({venta_id: ventas.map(v => v.id)}))
      .then(detalles => Stock.find({
        id: detalles.map(d => d.stock_id),
        proveedor_id: proveedorId,
        disponible: false
      }))
    )

    const pedido = await PedidoService.bulkCreate(sucursalId, proveedor, stocks).catch(err => {
      LogService.error(`Error al crear un pedido a partir de ventas`, err)
      res.status(500).send({message: err})
    })

    res.status(200).send(pedido)
  }

};

