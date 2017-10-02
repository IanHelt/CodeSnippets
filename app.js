const express = require('express');
const exphbs = require('express-handlebars');
const flash = require('express-flash-messages');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user');
const routes = require('./router');
const app = express();

app.engine('handlebars', exphbs({ defaultLayout:'index' }));
app.set('view engine', 'handlebars');
app.use('/static', express.static('public'));

passport.use('local-login', new LocalStrategy(
  {passReqToCallback: true},
  function(req, username, password, done) {
    User.authenticate(username, password, function(err, user) {
      if (err) {
        return done(err)
      }
      if (user) {
        return done(null, user)
      } else {
        return done(null, false, {
          message: "There is no user with that username and password."
        })
      }
    })
  }));

passport.use('local-signup', new LocalStrategy(
  {passReqToCallback: true},
  function(req, username, password, done) {
    User.signup(username, password, function(err, user) {
      if (err) {
        return done(err)
      }
      if (user) {
        return done(null, user)
      } else {
        return done(null, false, {
          message: "Account created"
        });
      }
    });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(bodyParser.urlencoded({
  extended:false
}));
app.use(session({
  secret: 'chimp',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

routes(app);
var database = process.env.MONGODB_URI || 'mongodb://localhost:27017/snippetdb';
mongoose.connect(database);

app.listen(process.env.PORT || 3000);

module.exports = app;
