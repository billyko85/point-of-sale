/**
 * Stock.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const groupDistinct = (arr, field) => 
  arr.map(value => value[field])
     .filter((value, ix, self) => self.indexOf(value) === ix)
     .join(",")

const clearNullValue = value => value == null ? `null` : `'${clearValue(value)}'`
const clearValue = (str) => {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
      switch (char) {
          case "\0":
              return "\\0";
          case "\x08":
              return "\\b";
          case "\x09":
              return "\\t";
          case "\x1a":
              return "\\z";
          case "\n":
              return "\\n";
          case "\r":
              return "\\r";
          case "\"":
          case "'":
          case "\\":
          case "%":
              return "\\"+char; // prepends a backslash to backslash, percent,
                                // and double/single quotes
      }
  });
}

module.exports = {

  attributes: {

    codigo_proveedor : { type: 'string' },

    marca : { type: 'string', allowNull: true },

    modelo : { type: 'string', allowNull: true },

    fabricante : { type: 'string', allowNull: true },

    descripcion : { type: 'string', allowNull: true },

    datos_extra : { type: 'string', allowNull: true },

    atributo_extra : { type: 'string', allowNull: true },

    precio_venta : { type: 'float', required: true },

    disponible : { type: 'boolean', required: true },

    articulo_id : { type: 'integer', required: true },

    pedido_id : { type: 'integer', required: true },

    sucursal_id : { type: 'integer', required: true },

    proveedor_id : { type: 'integer', required: true }
  },

  createNFromArticulo: (cantidadRecibida, articulo, pedidoId, atributoExtra, sucursalId) => {
    
    const stocks = []
    for(let i=0;i<cantidadRecibida;i++)
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
      )`)
    
    return stocks.join("; ")

  }

};

