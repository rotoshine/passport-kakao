var passport = require("passport");
var express =  require("express");
var KakaoStrategy = require("../lib/passport-kakao.js").Strategy;

var appKey = "YOUR_APP_KEY";

// passport 에 Kakao Oauth 추가
passport.use( new KakaoStrategy({
        clientID: appKey,
        callbackURL: "http://localhost:3000/oauth"
    },
    function(accessToken, refreshToken, params, profile, done){
        // authorization 에 성공했을때의 액션
        console.log( "accessToken :" + accessToken );
        console.log( "사용자 profile: " + JSON.stringify(profile._json) );

        save(accessToken, refreshToken, profile);
        return done(null, profile._json);
    })
);
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// express 앱 설정
var app = express();
app.use(passport.initialize());
app.get("/login", passport.authenticate('kakao',{state: "myStateValue"}));
app.get("/oauth", passport.authenticate('kakao'), function(req, res){
    // 로그인 시작시 state 값을 받을 수 있음
    res.send("state :" + req.query.state);
});
app.listen(3000);

// 사용자 구현 부분
function save(){
    //save 로직 구현
}

