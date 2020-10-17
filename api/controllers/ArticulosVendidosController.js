const BULK_QUERY = sort => `
    select 
        min(s.id) id,
        s.articulo_id,
        a.codigo_proveedor,
        a.marca,
        a.modelo,
        a.fabricante,
        a.categoria,
        a.precio,
        s.atributo_extra,
        a.proveedor_id,
        sum(case when dv.devolucion = 1 then -1 else 1 end) sell_count,
        (select count(*) from stock ss where ss.articulo_id = s.articulo_id and ss.disponible = 1) stock_count
    from venta v
    join detalleventa dv on dv.venta_id = v.id
    join stock s on s.id = dv.stock_id
    join articulo a on a.id = s.articulo_id
    where v.estado = 'confirmado'
        and v.fecha >= $1
        and (s.proveedor_id = $2 or null is null)
        and v.sucursal_id = $3
    group by s.articulo_id,
        a.codigo_proveedor,
        a.marca,
        a.modelo,
        a.fabricante,
        a.categoria,
        a.precio,
        s.atributo_extra,
        a.proveedor_id
    order by ${sort}
    offset $4 rows fetch next $5 rows only`

const COUNT_QUERY = `
    select count(distinct s.articulo_id + '-' + s.atributo_extra) total_count
    from venta v
    join detalleventa dv on dv.venta_id = v.id
    join stock s on s.id = dv.stock_id
    where v.estado = 'confirmado'
        and v.fecha >= $1
        and (s.proveedor_id = $2 or null is null)
        and v.sucursal_id = $3`

module.exports = {

    get: async (req, res) => {
        
        var skip = parseInt(req.query.skip)
        var limit = parseInt(req.query.limit)
        var sort = req.query.sort
        var where = JSON.parse(req.query.where)
        var fecha = where.fecha || new Date()
        
        var rawTotalResult = await sails.sendNativeQuery(COUNT_QUERY, [fecha, where.proveedor_id, req.user.sucursal_id])
        var rawResult = await sails.sendNativeQuery(BULK_QUERY(sort), [
            fecha, 
            where.proveedor_id, 
            req.user.sucursal_id,
            skip,
            limit
        ]);       
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('X-Total-Count', rawTotalResult.recordset[0]['total_count']);
        res.json(rawResult.recordset)

    }
}