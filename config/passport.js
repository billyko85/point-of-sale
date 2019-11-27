const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const bcrypt = require('bcrypt');

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  User.findOne({ id }, function (err, user) {
    cb(err, user);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, function (username, password, cb) {

  User.findOne({ username: username }, function (err, user) {

    if (err) return cb(err);
    if (!user) return cb(null, false, { message: 'Username not found' });

    bcrypt.compare(password, user.password, function (err, res) {

      if (!res) return cb(null, false, { message: 'Invalid Password' });
      let userDetails = {
        email: user.email,
        username: user.username,
        id: user.id
      };

      return cb(null, userDetails, { message: 'Login Succesful' });
    });

  });
}));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
}, function (jwtPayload, cb) {
  return User.findOne({ id: jwtPayload.id })
    .then(user => {
      return cb(null, user);
    })
    .catch(err => {
      return cb(err);
    });
}
));