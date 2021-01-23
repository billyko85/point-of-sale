const clearNullValue = (value) => (value == null ? 'null' : `'${clearValue(value)}'`);
const clearValue = (str) => str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
  switch (char) {
    case '\0':
      return '\\0';
    case '\x08':
      return '\\b';
    case '\x09':
      return '\\t';
    case '\x1a':
      return '\\z';
    case '\n':
      return '\\n';
    case '\r':
      return '\\r';
    case '"':
    case "'":
    case '\\':
    case '%':
      return `\\${char}`; // prepends a backslash to backslash, percent and double/single quotes
    default:
      return char;
  }
});

module.exports = {

  createStocksFromArticulo: (cantidadRecibida, articulo, pedidoId, atributoExtra, sucursalId) => {
    const stocks = [];

    for (let i = 0; i < cantidadRecibida; i++) {
      stocks.push(`INSERT INTO stock (
        codigo_proveedor,
        marca,
        modelo,
        fabricante,
        descripcion,
        datos_extra,
        atributo_extra,
        precio_venta,
        proveedor_id,
        articulo_id,
        pedido_id,
        disponible,
        sucursal_id,
        createdAt,
        updatedAt
      ) values (
        ${clearNullValue(articulo.codigo_proveedor)},
        ${clearNullValue(articulo.marca)},
        ${clearNullValue(articulo.modelo)},
        ${clearNullValue(articulo.fabricante)},
        ${clearNullValue(articulo.descripcion)},
        ${clearNullValue(articulo.datos_extra)},
        ${clearNullValue(atributoExtra)},
        ${articulo.precio_venta},
        ${articulo.proveedor_id},
        ${articulo.id},
        ${pedidoId},
        1,
        ${sucursalId},
        SYSDATETIME(),
        SYSDATETIME()
      )`);
    }

    return stocks.join('; ');
  },

  createOrUpdateListadoStock: (cantidadRecibida, articulo, atributoExtra, sucursalId, listadoExists) => {
    if (!listadoExists) {
      return `INSERT INTO listadoStock (
            codigo_proveedor,
            marca,
            modelo,
            fabricante,
            descripcion,
            atributo_extra,
            precio_venta,
            proveedor_id,
            articulo_id,
            sucursal_id,
            disponibles,
            stock_recurrente,
            createdAt,
            updatedAt
          ) VALUES (
            ${clearNullValue(articulo.codigo_proveedor)},
            ${clearNullValue(articulo.marca)},
            ${clearNullValue(articulo.modelo)},
            ${clearNullValue(articulo.fabricante)},
            ${clearNullValue(articulo.descripcion)},
            ${clearNullValue(atributoExtra)},
            ${articulo.precio_venta},
            ${articulo.proveedor_id},
            ${articulo.id},
            ${sucursalId},
            ${cantidadRecibida},
            ${articulo.stock_recurrente ? 1 : 0},
            SYSDATETIME(),
            SYSDATETIME()
          )`;
    }

    return `UPDATE listadoStock
             SET disponibles = disponibles + ${cantidadRecibida},
                 stock_recurrente = ${articulo.stock_recurrente ? 1 : 0},
                 updatedAt = GETDATE()
             WHERE articulo_id = ${articulo.id}`;
  },

};
