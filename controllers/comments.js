// comments.js
const Comment = require('../models/comment')

let requiresLogin = function(req, res, next) {
    console.log(req.session.userId)
  if (req.session && req.session.userId) {
    return next();
  } else {
    var err = new Error('You must be logged in to view this page.');
    err.status = 401;
    return next(err);
    //return next();
  }
}

module.exports = function (app) {

    // CREATE Comment
    app.post('/reviews/comments', requiresLogin, (req, res) => {
        console.log(req.body)
      Comment.create(req.body).then(comment => {
        res.status(200).send({ comment: comment });
      }).catch((err) => {
          console.log("error with posting comment")
        res.status(400).send({ err: err })
      })
    })

    app.delete('/reviews/comments/:id', requiresLogin, function (req, res) {
      console.log("DELETE comment")
      Comment.findByIdAndRemove(req.params.id).then(comment => {
        res.status(200).send(comment);
      }).catch((err) => {
        console.log(err.message);
        res.status(400).send(err)
      })
    })

}
