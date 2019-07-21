'use strict';

/**
 * Module dependencies
 */
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil'),
  _ = sails.lodash;
var async = require('sails/node_modules/async');

var parseReqParam = (req, param) => {
  var reqParam = req.param(param) || req.options[param];
  if (!reqParam) {return undefined;}

  // If `reqParam` is a string, attempt to split it.
  // (e.g. `field1,field2`)
  if (typeof reqParam === "string") {
    reqParam = reqParam.split(',')
  }
  return reqParam;
}

/**
 * Find Records
 *
 *  get   /:modelIdentity
 *   *    /:modelIdentity/find
 *
 * An API call to find and return model instances from the data adapter
 * using the specified criteria.  If an id was specified, just the instance
 * with that unique id will be returned.
 *
 * Optional:
 * @param {Object} where       - the find criteria (passed directly to the ORM)
 * @param {Integer} limit      - the maximum number of records to send back (useful for pagination)
 * @param {Integer} skip       - the number of records to skip (useful for pagination)
 * @param {String} sort        - the order of returned records, e.g. `name ASC` or `age DESC`
 * @param {String} callback - default jsonp callback param (i.e. the name of the js function returned)
 */

module.exports = function findRecords(req, res) {

  // Look up the model
  var Model = actionUtil.parseModel(req);


  // If an `id` param was specified, use the findOne blueprint action
  // to grab the particular instance with its primary key === the value
  // of the `id` param.   (mainly here for compatibility for 0.9, where
  // there was no separate `findOne` action)
  if (actionUtil.parsePk(req)) {
    return require('sails/lib/hooks/blueprints/actions/findOne')(req, res);
  }

  var queryCount = Model.count().where(actionUtil.parseCriteria(req));

  var options = {}
  var count = parseReqParam(req, "count")
  var max = parseReqParam(req, "max")
  if(count) options.count = count
  if(max) options.max = max

  // Lookup for records that match the specified criteria
  var queryData = Model.find({},options)
    .where(actionUtil.parseCriteria(req))
    .limit(actionUtil.parseLimit(req))
    .skip(actionUtil.parseSkip(req))
    .sort(actionUtil.parseSort(req));
  
  var groupBy = parseReqParam(req, "groupBy")
  if(groupBy) queryData = queryData.groupBy(groupBy);

  queryData = actionUtil.populateRequest(queryData, req);


  // Expose header to the client
  res.set('Access-Control-Expose-Headers', 'X-Total-Count');

  async.parallel({
    count: getTotalCount,
    data: getData
  }, function (err, results) {
    res.set('X-Total-Count', results.count);
    res.ok(results.data);
  });

  //////////////////

  function getTotalCount(cb) {
    queryCount.exec(function (err, count) {
      cb(null, count);
    });
  }

  function getData(cb) {
    queryData.exec(function found(err, matchingRecords) {
      if (err) return res.serverError(err);
      // Only `.watch()` for new instances of the model if
      // `autoWatch` is enabled.
      if (req._sails.hooks.pubsub && req.isSocket) {
        Model.subscribe(req, matchingRecords);
        if (req.options.autoWatch) {
          Model.watch(req);
        }
        // Also subscribe to instances of all associated models
        _.each(matchingRecords, function (record) {
          actionUtil.subscribeDeep(req, record);
        });
      }

      cb(null, matchingRecords);
    });
  }
};