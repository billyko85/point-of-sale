module.exports = {

    get: (req, res) => {

        Proveedor.findOne(req.query.proveedor)
            .exec((err, proveedor) => {
                if(proveedor) {
                    Proveedor.query(`SELECT TOP 15 * FROM ${proveedor.tablaListado}`, [], (err, rawResult) => {
                        res.setHeader('Content-Type', 'application/json');
                        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
                        res.setHeader('X-Total-Count', rawResult.length);
                        res.send(rawResult);
                    })
                }else {
                    res.send(404);
                }
            })
    }

}