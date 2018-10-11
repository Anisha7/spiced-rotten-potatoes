// javascript/scripts.js

 // listen for a form submit event
// prevent the default form behavior
// serialize the form data into an object
// use axios to initialize a post request and send in the form data
// wait for the success response from the server
// remove the information from the form
// display the data as a new comment on the page
// handle any errors

// listen for a form submit event

window.onload = function() {
    if (document.getElementById("newComment") != null) {
        document.getElementById("newComment").addEventListener("submit", e => {
            // prevent the default form behavior
            e.preventDefault();
            console.log('adding a comment');
            // serialize the form data into an object
            let comment = {};
            const inputs = document.getElementsByClassName('form-control');
            console.log(inputs);
            for (var i = 0; i < inputs.length; i++) {
              comment[inputs[i].name] = inputs[i].value;
            }
            console.log(comment);

            //use axios to initialize a post request and send in the form data

              axios.post(`/reviews/comments`, comment)
              .then(function (response) {
                // wait for the success response from the server
                console.log(response);
                // remove the information from the form
                document.getElementById("newComment").reset();
                // display the data as a new comment on the page
                $(document.getElementById('comments')).prepend(
                  `
                   <div class="card">
                     <div class="card-block">
                       <h4 class="card-title">${response.data.comment.title}</h4>
                       <p class="card-text">${response.data.comment.content}</p>
                       <p>
                            <button class="btn btn-link delete-comment" id="delete-comment" data-comment-id=${response.data.comment._id}>Delete</button>
                       </p>
                     </div>
                   </div>
                  ` )

                  if (document.getElementById('delete-comment') != null) {
                      document.getElementById('delete-comment').addEventListener('click', (e) => {
                        console.log("click!")
                        let commentId = e.target.getAttribute('data-comment-id')
                        console.log(comment);
                        axios.delete(`/reviews/comments/${commentId}`)
                          .then(response => {
                            console.log(response)
                            elementToErase = e.target.parentNode.parentNode;
                            elementToErase.parentNode.removeChild(elementToErase);
                          })
                          .catch(error => {
                            console.log(error)
                            alert('There was an error deleting this comment.')
                          });
                      })
                  }
          }).catch(function (error) {
                    console.log(error);
                    // handle any errors
                    alert('There was a problem saving your comment. Please try again.')
                  });

        });
    }

    if (document.getElementById('delete-comment') != null) {
        document.getElementById('delete-comment').addEventListener('click', (e) => {
          console.log("click!")
          let commentId = e.target.getAttribute('data-comment-id');


          axios.delete(`/reviews/comments/${commentId}`)
            .then(response => {

              elementToErase = e.target.parentNode.parentNode;
              elementToErase.parentNode.removeChild(elementToErase);
            })
            .catch(error => {
              console.log(error)
              alert('There was an error deleting this comment.')
            });
        })
    }

    if (document.getElementsByClassName('deleteReview') != null) {
        for (var i = 0; i < document.getElementsByClassName('deleteReview').length; i++) {
            document.getElementsByClassName('deleteReview')[i].addEventListener('click', (e) => {
                let passedReviewId = e.target.getAttribute('data-review-id');
                axios.delete(`/admin/delete/${passedReviewId}`)
                    .then(response => {
                        elementToErase = e.target.parentNode.parentNode;
                        elementToErase.parentNode.removeChild(elementToErase);
                    })
                    .catch(error => {
                        console.log(error)
                    });
            })
        }
    }

}
