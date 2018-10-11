// movies.js

const MovieDb = require('moviedb-promise')
const moviedb = new MovieDb('1abc27d7de2de13edf0736cc90594c38')
const Review = require('../models/reviews')

module.exports = function (app) {
    app.get('/', (req, res) => {
      moviedb.miscNowPlayingMovies().then(response => {
        res.render('movies-index', { movies: response.results });
      }).catch(console.error)
    })

    app.get('/movies/:id', (req, res) => {
      moviedb.movieInfo({ id: req.params.id }).then(movie => {
        Review.find({ movieId: req.params.id }).then(reviews => {
          res.render('movies-show', { movie: movie, reviews: reviews });
        })
      }).catch(console.error)
    })
}
