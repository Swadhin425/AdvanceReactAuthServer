const User = require("../models/user");
const jwt=require('jwt-simple');
const config=require('../config')

function tokenForUser(user){

  const timestamp=new Date().getTime();
  return jwt.encode({sub:user._id ,iat:timestamp},config.secret)
}

exports.signup = function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  //see if a user with given email exists

  if(!email || !password){
    return res.status(422).send({ error: "You must provide email and password" });
  }

  //see if a user with the given email exist
  User.findOne({ email: email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    //if a user with email  does exist throw error
    if (existingUser) {
      return res.status(422).send({ error: "Email is in use" });
    }
    //if a user with email does not exist,create and save record
    const user = new User({
      email: email,
      password: password,
    });
    user.save((err) => {
      if (err) {
        return next(err);
      }
         //Respond to request indicating user got craeted
      return res.json({token:tokenForUser(user)});
    });
  });
};

exports.signin=function(req,res,next){
  res.send({token:tokenForUser(req.user)})
}
