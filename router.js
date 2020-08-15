const Authenication=require('./controller/authentication');
const passportService=require('./services/passport');
const passport=require('passport');

const requireAuth=passport.authenticate('jwt',{session:false})

const requireSignin=passport.authenticate('local',{session:false})
module.exports=function(app){
    app.get('/',requireAuth,function(req,res){
   res.send({hi:'tjere'})
    });

    app.post('/signin',requireSignin,Authenication.signin)
    app.post('/signup',Authenication.signup);
}