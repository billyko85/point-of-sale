module.exports = {
    info: (msg) => sails.log.info(`${(new Date()).toISOString()} - ${msg}`),
    error: (msg, err) => sails.log.error(`${(new Date()).toISOString()} - ${msg}`, err),
    debug: (msg) => sails.log.debug(`${(new Date()).toISOString()} - ${msg}`)
}