/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {

   /**
   * @param email {string}
   *
   * Check provided password against users in the DB
   * and create a sessions if we find a match
   */
   login: function(req, res) {
     User.findOne({
       email: req.param('email')
     }, function foundUser(err, user) {
       if(err) return res.negotiate(err);
       if(!user) return res.notFound();

       /**
       * @desc check password hash
       */
       require('machinepack-passwords').checkPassword({
         passwordAttempt: req.param('password'),
         encryptedPassword: user.encryptedPassword
       }).exec({
         error: function(err) {
           return res.negotiate(err);
         },
         incorrect: function() {
           return res.notFound();
         },

         /**
         * @desc store user id in our session,
         * and return ok
         */
         success: function() {
           req.session.me = user.id;

           // .ok() method would work for a client side app
           // res.ok();
           res.redirect('/');
         }
       });
     });
   },

   /**
   * @param name {string}
   * @param email {string}
   * @param password {string}
   */
   signup: function(req, res) {
     
     var Passwords = require('machinepack-passwords');

     /**
     * Encrypt a string using the BCrypt algorithm.
     */
     Passwords.encryptPassword({
       password: req.param('password'),
     }).exec({
       error: function (err){
         return res.negotiate(err);
       },

       /**
       * Create a new user
       */
       success: function (encryptedPassword) {
         User.create({
           name: req.param('name'),
           email: req.param('email'),
           encryptedPassword: encryptedPassword
         }, function userCreated(err, newUser) {
           if(err) {
             console.log('error: ', err);

             // If there is a uniqueness error, handle manually
             if(err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0]
               && err.invalidAttributes.email[0].rule === 'unique') {
               return res.emailAddressInUse();
             }

             return res.negotiate(err);
           }

           return res.json({
             id: newUser.id
           });
         });
       }
     });
   },

   /**
   * @desc clear session data
   *
   * @todo findOne is throwing an error (sometimes) 
   * saying it needs criteria (no req.session.me?)
   */
   logout: function(req, res) {
     User.findOne(req.session.me, function foundUser(err, user) {
       if(err) return res.negotiate(err);
       if(!user) {
         sails.log.verbose('Session refers to a user who no longer exists.');
         res.backToHomePage();
       }

       req.session.me = null;

       /**
       * Either send a 200 ok for ajax, or return to home page
       */
       return res.redirect('/');
     });
   }
  
 };
