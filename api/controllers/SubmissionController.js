/**
 * SubmissionController
 *
 * @description :: Server-side logic for managing submissions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  add: function(req, res) {
    Submission.create({
      name: req.param('name'),
      owner: req.session.me
    }, function submissionCreated(err, newSubmission) {
      if(err) {
        console.log(err);
        return res.negotiate(err);
      }

      return res.json({
        id: newSubmission.id
      });
    });
  },

  get: function(req, res) {
    Submission.find().exec(function (err, submissions) {
      res.send(submissions);
    });  
  }
	
};

