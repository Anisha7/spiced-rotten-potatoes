const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
    }
    //userId: { type: Schema.Types.ObjectId, ref: 'user' }
})


//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

//authenticate input against database
// not working REWRITE
// UserSchema.statics.authenticate = function (username, password, callback) {
//     //console.log("authenticating");
//     //console.log(User.find({username:username}));
//   User.find({ username: username })
//     .exec(function (err, user) {
//       if (err) {
//         return callback(err)
//       } else if (!user) {
//         var err = new Error('User not found.');
//         err.status = 401;
//         return callback(err);
//       }
//       bcrypt.compare(password, user.password, function (err, result) {
//         if (result === true) {
//           return callback(null, user);
//         } else {
//           return callback();
//         }
//       })
//     });
// }

// Authentication - Login
UserSchema.statics.authenticate = function(username, password, callback) {
  User.findOne({ username: username })
    .exec(function(error, user) {
      if (error) {
        return  callback(error);
      } else if (!user) {
        var err = new Error('User not found!');
        err.status = 401;
        return callback(err);
      }

      // Compare using bcrypt
      bcrypt.compare(password, user.password, function(error, result){
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      });
    });
};

// the function that tries to check username/password entered to the database
UserSchema.statics.auth = function(username, password) {
    let user = User.find({username: username});
    console.log(user);
    if (user === null) {
        return false;
    }
    console.log("auth user password: ")
    console.log(user.password);
    console.log(user.username);
    // ***** set this equal to password values
    let userPassword = "";
    if (bcrypt.compare(password, user.password)) {
        return true;
    }
    return "wrong password";
}

const User = mongoose.model('User', UserSchema);
module.exports = User;
