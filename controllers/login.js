const User = require('../models/user');
const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
// const db = mongoose.connection;

// variable not affecting yet ********
var loggedIn = false;
// helpers

function addNewUser(req, res, next) {
    var userData = {
      //email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      //passwordConf: req.body.passwordConf,
   }
   //use schema.create to insert data into the db
   User.create(userData, function (err, user) {
     if (err) {
       return next(err)
     } else {
         console.log("added to session");
         req.session.userId = user._id;
         return res.redirect('/');
     }
   });
}

function userExists(req) {
    //console.log(User);
    return (User.auth(req.body.username, req.body.password));
}

module.exports = function (app) {

    app.get('/login', (req, res) => {
        if (!loggedIn) {
            res.render('login');
        }

    });

    app.post('/login', function (req, res, next) {
        // Email and Password are not empty
          if (req.body.username && req.body.password) {

            // Attempt Authentication
            User.authenticate(req.body.username, req.body.password, function(error, user){

              // Error or User not found in database (info did not match)
              if (error || !user) {
                var err = new Error("Incorrect Email or Password!");
                err.status = 401;
                return next(err);
              } else {
                  loggedIn = true;
                  // User Authenticated - Session / Cookie
                  req.session.userId = user._id;
                  return res.redirect('/');
              }
            });
          } else {
            var err = new Error ('Email and password are required.');
            err.status = 401;
            return next(err);
          }
    });

  app.get('/logout', function(req, res, next) {
      req.session.userId = null;
      if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
          if(err) {
            return next(err);
          } else {
            loggedIn = false;
            return res.redirect('/');
          }
        });
      }
    });

app.get('/signup', (req, res) => {
    if (!loggedIn) {
        res.render('signup');
    }
});

app.post('/signup', function (req, res, next) {
    if (
      req.body.username &&
      req.body.password ) {
          // Attempt Authentication
          User.authenticate(req.body.username, req.body.password, function(error, user){
                if (error || !user) {
                    addNewUser(req, res, next);
                    loggedIn = true;
                }
          });
     } else {
       var err = new Error('All fields required.');
       err.status = 400;
       return next(err);
     }
})


 }
