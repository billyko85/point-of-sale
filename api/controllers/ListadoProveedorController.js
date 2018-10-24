module.exports = {

    get: (req, res) => {

        Proveedor.findOne(req.query.proveedor)
        .exec((err, proveedor) => {
            if(proveedor) {
                const query = proveedor.tablaListado.replace(/^select/i,"SELECT TOP 15");
                Proveedor.query(query, [], (err, rawResult) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
                    res.setHeader('X-Total-Count', rawResult.length);
                    res.send(rawResult);
                })
            }else {
                res.send(404);
            }
        })
    },

    updateArticulos: (req, res) => {
        Proveedor.findOne(req.body.proveedor)
        .exec((err, proveedor) => {
            if(proveedor) {

                const query = `
                    MERGE articulo d
                    USING (
                        ${proveedor.tablaListado}
                    ) as s 
                    ON (d.id_ref = s.id)  
                    WHEN MATCHED THEN   
                        UPDATE SET d.precio = s.precio
                    WHEN NOT MATCHED THEN  
                        INSERT (id_ref, marca, modelo, fabricante, descripcion, datos_extra, precio, proveedor_id)  
                        VALUES (s.id, s.marca, s.modelo, s.fabricante, s.descripcion, s.datos_extra, s.precio, ${proveedor.id});

                `

                Proveedor.query(query, [], (err) => {
                    if(err === null) {
                        res.send(200);
                    }else {
                        console.log(err);
                        res.send(500);
                    }
                })
            }else {
                res.send(404);
            }
        })

    }

}