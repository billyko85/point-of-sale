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
        sucursal_id: user.sucursal_id,
        id: user.id
      };

      return cb(null, userDetails, { message: 'Login Succesful' });
    });

  });
}));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'WF92UWJlcMNx9*tygAKQY1Nz2$f*%5CK#DMlrTKSo3zhNKi4&6OlMVz',
  passReqToCallback: true
}, function (req, jwtPayload, cb) {
  if(jwtPayload !== undefined) {
    req.user = jwtPayload
    return cb(null, req.user);
  }
  return cb("Not logged in")
}
));