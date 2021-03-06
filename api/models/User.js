/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const bcrypt = require('bcrypt');

module.exports = {

  attributes: {
    email: {
      type: 'string',
      allowNull: true
    },
    username: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },
    sucursal_id: {
      type: 'number',
      required: true
    }
  },
  customToJSON: function() {
    return _.omit(this, ['password'])
  },
  beforeCreate: function(user, cb){
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(user.password, salt, function(err, hash){
        if(err) return cb(err);
        user.password = hash;
        return cb();
      });
    });
  },

  beforeUpdate: function(user, cb){
    if(user.password) {
      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(user.password, salt, function(err, hash){
          if(err) return cb(err);
          user.password = hash;
          return cb();
        });
      });
    }else {
      cb()
    }
  }

};

