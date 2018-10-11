
const port = process.env.PORT || 5000;
const session = require('express-session');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/rotten-potatoes');
const MongoStore = require('connect-mongo')(session);
const db = mongoose.connection;

// INITIALIZE BODY-PARSER AND ADD IT TO APP
const bodyParser = require('body-parser');

const express = require('express')
//import express from 'express'
const methodOverride = require('method-override')

// for comment model
const Review = require('./models/reviews')
const Comment = require('./models/comment')
const User = require('./models/user')
const comments = require('./controllers/comments.js');
const reviews = require('./controllers/reviews.js');
const movies = require('./controllers/movies.js');
const admin = require('./controllers/admin.js');
const login = require('./controllers/login.js');
// initializing handlebars
var exphbs = require('express-handlebars');
const app = express()


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// serve all client-side assets in its public folder
app.use(express.static('public'));





app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// initialized
// override with POST having ?_method=DELETE or ?_method=PUT
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// Make user ID available in handlebar templates
app.use(function(req, res, next) {
  res.locals.currentUser = req.session.userId;
  console.log(req.session);
  console.log(res.locals.currentUser);
  next();
});

app.use(methodOverride('_method'))
comments(app)
reviews(app)
movies(app)
admin(app)
login(app)
//const Review = require('./models/reviews')


module.exports = app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})
