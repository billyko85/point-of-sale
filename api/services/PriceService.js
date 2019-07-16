module.exports = {

    calculateSellPriceForProvider: (proveedorId, price) => Proveedor.findOne(proveedorId)
        .then(proveedor => this.calculateSellPrice(price, proveedor.porc_descuento, proveedor.porc_ganancia))
        .catch(reason => {
            LogService.error(`Error al buscar el proveedor ${proveedorId}`, reason);
        }),
    
    calculateSellPrice: (price, discount, margin) => price * (1 - discount / 100) * (1 + margin / 100)

}