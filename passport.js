const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TaiKhoan = require('./models/Taikhoan')

passport.serializeUser(function(user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: "507699291037-93hfg46mb6gs9p38d27sjo0gmppcd8s9.apps.googleusercontent.com",
    clientSecret: "5rW52hjlhILRlgKhDTMdG2c2",
    callbackURL: "http://doancuoikiw.herokuapp.com/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    /*
     use the profile info (mainly profile id) to check if the user is registerd in ur db
     If yes select the user and pass him to the done callback
     If not create the user and then select him and pass to callback
    */
   if(profile._json.hd == 'student.tdtu.edu.vn') {
     TaiKhoan.findOne({email: profile.emails[0].value}, function(err, data) {
      if(!data) {
        let gg = new TaiKhoan({
          ten: profile.displayName,
          email: profile.emails[0].value,
          role: 'sinh vien'
        })
        gg.save()
      }
      //console.log(data)
      return done(null, data)
     })
   }else {
     err = 'Chỉ được đăng nhập bằng email sinh viên'
     return done(err)
   }
  }
));