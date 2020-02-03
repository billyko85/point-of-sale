/**
 * THIS FILE WAS ADDED AUTOMATICALLY by the Sails 1.0 app migration tool.
 */

module.exports.datastores = {

  // In previous versions, datastores (then called 'connections') would only be loaded
  // if a model was actually using them.  Starting with Sails 1.0, _all_ configured
  // datastores will be loaded, regardless of use.  So we'll only include datastores in
  // this file that were actually being used.  Your original `connections` config is
  // still available as `config/connections-old.js.txt`.

  default: {
    adapter: 'sails-mssql-server',
    user: 'posApi',
    password: 'P0intOfSale',
    host: 'localhost', // azure database
    database: 'chapadany_prueba1',
    defaultSchema: "pointofsale",
    pool: {
      min: 10,
      max: 100,
      idleTimeout: 60000
    }
  }

};
