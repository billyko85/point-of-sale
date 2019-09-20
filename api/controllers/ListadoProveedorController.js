module.exports = {

    get: (req, res) => {
        
        const where = JSON.parse(req.query.where)

        Proveedor.findOne(where.proveedor_id)
        .exec((err, proveedor) => {
            if(proveedor) {
                const query = proveedor.tablaListado.trim().replace(/^select *(distinct)?/i, (str, distinct) => `SELECT ${distinct || ""} TOP 15`);
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
        req.setTimeout(600 * 1000) // Increase the request timeout to 5 minutes
        LogService.info(`Obteniendo listado de proveedor ${req.body.proveedor}`)
        Proveedor.findOne(req.body.proveedor)
        .exec((err, proveedor) => {
            if(proveedor) {

                LogService.info(`Actualizando precios del proveedor ${req.body.proveedor}`)
                const porcSellPrice = PriceService.calculateSellPrice(1, proveedor.porc_descuento, proveedor.porc_ganancia)
                
                const query = `
                    MERGE articulo d
                    USING (
                        ${proveedor.tablaListado}
                    ) as s 
                    ON (d.id_ref = s.id and d.proveedor_id = ${proveedor.id})  
                    WHEN MATCHED THEN   
                        UPDATE SET 
                            d.codigo_proveedor = s.codigo_proveedor,
                            d.marca = s.marca,
                            d.modelo = s.modelo,
                            d.fabricante = s.fabricante,
                            d.categoria = s.categoria,
                            d.descripcion = s.descripcion,
                            d.precio = s.precio,
                            d.precio_venta = CASE WHEN d.actualiza_precio = 1 THEN round(s.precio * ${porcSellPrice}, 2) ELSE d.precio_venta END
                    WHEN NOT MATCHED THEN  
                        INSERT (id_ref, codigo_proveedor, marca, modelo, fabricante, categoria, descripcion, datos_extra, precio, precio_venta, actualiza_precio, proveedor_id)  
                        VALUES (s.id, s.codigo_proveedor, s.marca, s.modelo, s.fabricante, s.categoria, s.descripcion, s.datos_extra, s.precio, round(s.precio * ${porcSellPrice}, 2), 1, ${proveedor.id});

                `

                Proveedor.query(query, [], (err) => {
                    if(err === null) {

                        LogService.info(`Actualizando precios de stock del proveedor ${req.body.proveedor}`)
                        const query = `
                            UPDATE stock
                            SET precio_venta = (SELECT a.precio_venta from articulo a where a.id = stock.articulo_id)
                            WHERE proveedor_id = ${proveedor.id};
                        `
                        Proveedor.query(query, [], (err) => {
                            if(err) {
                                LogService.error(`Error actualizando precios de stock del proveedor ${req.body.proveedor}`, err)
                                res.status(500).send(`Error actualizando info del proveedor`);
                            }else {
                                LogService.info(`Actualización finalizada de proveedor ${req.body.proveedor}`)
                                res.status(200).send();
                            }
                        });

                    }else {
                        LogService.error(`Error actualizando precios del proveedor ${req.body.proveedor}`, err)
                        res.status(500).send(`Error actualizando info del proveedor`);
                    }
                })
            }else {
                LogService.error(`Proveedor no encontrado ${req.body.proveedor}`)
                res.status(404).send(`Proveedor no encontrado`);
            }
        })

    }

}