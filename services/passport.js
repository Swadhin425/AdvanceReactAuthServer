
const User=require('../models/user');
const config=require('../config');
const passport = require('passport');
const  JwtStrategy=require('passport-jwt').Strategy;
const ExtractJwt=require('passport-jwt').ExtractJwt;
const LocalStrategy=require('passport-local');


//create local strategy
const localOptions={usernameField:'email'}
const localLogin=new LocalStrategy(localOptions,function(email,password,done){
  User.findOne({email:email},function(err,user){
      if(err)   {return done(err);}
      if(!user) {return done(null,false);}

      //compare password

      user.comparePassword(password,function(err,isMatched){
        if(err)   {return done(err);}
        if(!isMatched) {return done(null,false);}

        return done(null,user);
      })
  })
})


//set up options for JWT Strategy
const jwtOptions={
    jwtFromRequest:ExtractJwt.fromHeader('authorization'),
    secretOrKey:config.secret
}




//create JWT Strategy
const jwtLogin=new JwtStrategy(jwtOptions,function(payload,done){
User.findById(payload.sub,function(err,user){
    if(err) {return done(err,false) }
    if(user){
        done(null,user);

    }else {
        done(null,false)
    }
})
    //
})



//Tell passport to use this strategy

passport.use(jwtLogin);
passport.use(localLogin);