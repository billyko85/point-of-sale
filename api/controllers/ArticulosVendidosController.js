const BULK_QUERY = (sort) => `
    select 
        min(s.id) id,
        s.articulo_id,
        a.codigo_proveedor,
        a.descripcion,
        a.marca,
        a.modelo,
        a.fabricante,
        a.categoria,
        a.precio,
        s.atributo_extra,
        a.proveedor_id,
        sum(case when dv.devolucion = 1 then -1 else 1 end) sell_count,
        (select count(*)
         from stock ss
         where ss.articulo_id = s.articulo_id
           and ss.disponible = 1
           and ss.sucursal_id = s.sucursal_id) stock_count
    from venta v
    join detalleventa dv on dv.venta_id = v.id
    join stock s on s.id = dv.stock_id
    join articulo a on a.id = s.articulo_id
    where v.estado = 'confirmado'
        and v.fecha >= $1
        and (s.proveedor_id = $2 or $2 is null)
        and v.sucursal_id = $3
    group by s.articulo_id,
        s.sucursal_id,
        a.codigo_proveedor,
        a.descripcion,
        a.marca,
        a.modelo,
        a.fabricante,
        a.categoria,
        a.precio,
        s.atributo_extra,
        a.proveedor_id
    order by ${sort}
    offset $4 rows fetch next $5 rows only`;

const COUNT_QUERY = `
    select count(distinct s.articulo_id + '-' + s.atributo_extra) total_count
    from venta v
    join detalleventa dv on dv.venta_id = v.id
    join stock s on s.id = dv.stock_id
    where v.estado = 'confirmado'
        and v.fecha >= $1
        and (s.proveedor_id = $2 or $2 is null)
        and v.sucursal_id = $3`;

module.exports = {

  get: async (req, res) => {
    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);
    const { sort } = req.query;
    const where = JSON.parse(req.query.where);
    const fecha = where.fecha || new Date();

    const rawTotalResult = await sails.sendNativeQuery(COUNT_QUERY, [fecha, where.proveedor_id, req.user.sucursal_id]);
    const rawResult = await sails.sendNativeQuery(BULK_QUERY(sort), [
      fecha,
      where.proveedor_id,
      req.user.sucursal_id,
      skip,
      limit,
    ]);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
    res.setHeader('X-Total-Count', rawTotalResult.recordset[0].total_count);
    res.json(rawResult.recordset);
  },
};
