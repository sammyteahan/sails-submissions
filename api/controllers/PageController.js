/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  showHomePage: function(req, res) {

    /**
    * If not logged in, go home
    */
    if(!req.session.me) {
      return res.view('homepage');
    }

    /**
    * Otherwise go to dashboard
    */
    User.findOne(req.session.me, function (err, user) {
      if(err) {
        return res.negotiate(err);
      }
      if(!user) {
        sails.log.verbose('Session refers to a user who no longer exists');
        return res.view('homepage');
      }
      return res.view('dashboard', {
        me: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    });
  }
	
};

