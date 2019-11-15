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
    password: 'hRYmd^2FXzK8oF!1Vp8Lu',
    host: 'chapadany.database.windows.net', // azure database
    database: 'chapadany_prueba1',
    defaultSchema: "pointofsale",
    options: {
      encrypt: true   // use this for Azure databases
    }
  }

};
