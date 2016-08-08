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

      /**
       * @todo this isn't a spa yet, so don't treat
       * it like one; return a flash message, but
       * stay on the same page
       * @todo when it is a spa, this should just
       * send res.ok();
       */
      return res.json({
        id: newSubmission.id
      });
    });
  },

  /**
  * @todo filter submission list by user and
  * return appropriate subset
  */
  get: function(req, res) {
    Submission.find().exec(function (err, submissions) {
      res.send(submissions);
    });
  }

};
