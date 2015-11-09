/**
 * SweepController
 *
 * @description :: Server-side logic for managing sweeps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  add: function(req, res) {
    Sweep.create({
      name: req.param('name'),
      owner: req.session.me
    }, function sweepCreated(err, newSweep) {
      if (err) {
        console.log(err);
        return res.negotiate(err);
      }

      return res.json({
        id: newSweep.id
      });
    });
  },

  get: function(req, res) {
    Sweep.find().exec(function (err, sweeps) {
      res.send(sweeps);
    });
  }
	
};

