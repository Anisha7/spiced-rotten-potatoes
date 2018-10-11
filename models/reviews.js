const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/rotten-potatoes', {useNewUrlParser: true});


const Review = mongoose.model('Review', {
  title: String,
  description: String,
  movieTitle: String,
  movieRating: String,
  movieId        : { type: String, required: true }
});

module.exports = Review
