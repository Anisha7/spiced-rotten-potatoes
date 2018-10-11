const Review = require('../models/reviews')

module.exports = function (app) {

  // NEW Comment
  app.get('/admin', (req, res) => {
    Review.find()
      .then(reviews => {
          res.render('admin', { reviews: reviews });
      })
      .catch(error => {
        console.log(error);
      });
  });

    app.delete('/admin/delete/:id', (req, res) => {
        console.log("in delete");
        console.log(req.params.id);
        Review.findByIdAndRemove(req.params.id).then(review => {
            res.status(200).send(review)
        }).catch((err) => {
            console.log(err.message);
            res.status(400).send(err)
        });
    });

}
