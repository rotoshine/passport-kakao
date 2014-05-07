# passport-kakao
kakao oauth2 로그인과 passport 모듈 연결체.

## install
```sh
npm install passport-kakao
```

## how to use

1. https://developers.kakao.com/ 에서 애플리케이션을 등록한다.
2. 내 애플리케이션 - 설정 - 일반에서, 플랫폼 추가를 누른 후 웹 플랫폼을 추가한다.
3. 웹 플랫폼 설정의 사이트 도메인에 자신의 사이트 도메인을 추가한다. (ex : http://localhost:3000)
4. 프로그램 상에서는 아래와 같이 사용한다.

```javascript
var passport = require('passport'),
    KakaoStrategy = require('passport-kakao').Strategy;

passport.use(new KakaoStrategy({    
    clientID : clientID,
    callbackURL : callbackURL
  },
  function(accessToken, refreshToken, profile, done){
    // 사용자의 정보는 profile에 들어있다.
    User.findOrCreate(..., function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));
```
> 현재 kakao에서 별도의 callbackURL 설정은 없고 사이트 도메인 등록만 있는데, 등록된 사이트 도메인/oauth 로만 호출을 허용하므로 callbackURL은 사이트 도메인/oauth 로 설정하는 것을 권장함. (ex : http://localhost:3000/oauth )


## profile property
profile에는 아래의 property들이 설정되어 넘겨진다.

| key   | value | 비고 |
| ----- |-------| ---- |
| provider | String | kakao 고정 |
| id | Number | 사용자의 kakao id |
| _row | String | 사용자 정보 조회로 얻어진 json string |
| _json | Object | 사용자 정보 조회로 얻어진 json 원본 데이터 |

## mean.io 와 쉽게 연동하기

수정해야하는 파일들은 아래와 같다.

| file path | 설명 |
| ----------|-----|
| server/config/env/development.js | 개발환경 설정파일 |
| server/config/env/production.js | 운영환경 설정파일 |
| server/config/models/user.js | 사용자 모델 |
| server/config/passport.js | passport script |
| server/routes/users.js | 사용자 로그인 관련 routes file |
| public/auth/views/index.html | 로그인 화면 |

(1) **mean.io app을 생성** 한다. (ex : mean init kakaoTest)

(2) 해당 모듈을 연동할 mean.io app에 설치한다.(npm install passport-kakao --save)

(3) **server/config/env/development.js** 와 **production.js** 에 kakao 관련 설정을 아래와 같이 추가한다.

```javascript
'use strict';

module.exports = {
    db: 'mongodb',
    app: {
        name: 'passport-kakao'
    },
    // 그외 설정들....,
    kakao: {
        clientID : 'kakao app rest api key',
        callbackURL: 'http://localhost:3000/oauth'
    }
};
```

(4) **server/config/models/users.js** 의 사용자 스키마 정의에 **kakao: {}** 를 추가한다.

(5) **server/config/passport.js** 파일에 아래 구문을 추가한다.

```javascript
// 최상단 require되는 구문에 추가
var KakaoStrategy = require('passport-kakao').Strategy;

passport.use(new KakaoStrategy({
        clientID: config.kakao.clientID,
        callbackURL: config.kakao.callbackURL
    }, function(accessToken, refreshToken, profile, done){
        User.findOne({
            'kakao.id' : profile.id
        }, function(err, user){
            if(err){
                return done(err);
            }
            if(!user){
                user = new User({
                    name: profile.username,
                    username: profile.id,
                    roles : ['authenticated'],
                    provider: 'kakao',
                    kakao: profile._json
                });

                user.save(function(err){
                    if(err){
                        console.log(err);
                    }
                    return done(err, user);
                });
            }else{
                return done(err, user);
            }
        });
    }
));
```

(6) **server/routes/users.js** 에 아래와 같은 구문을 추가한다.
```javascript
app.get('/auth/kakao', passport.authenticate('kakao',{
    failureRedirect: '#!/login'
}), users.signin);

app.get('/oauth', passport.authenticate('kakao', {
    failureRedirect: '#!/login'
}), users.authCallback);
```

(7) **public/auth/views/index.html** 에 kakao login을 연결한다.
```html
<!-- 아래는 예시 -->
<div>
    <div class="row">
        <div class="col-md-offset-1 col-md-5">
            <a href="/auth/facebook">
                <img src="/public/auth/assets/img/icons/facebook.png"/>
            </a>
            <a href="/auth/twitter">
                <img src="/public/auth/assets/img/icons/twitter.png"/>
            </a>

            <!-- kakao login -->
            <a href="/auth/kakao">
                카카오 로그인
            </a>
        </div>
    </div>
    <div class="col-md-6">
        <div ui-view></div>
    </div>

</div>
```

(8) grunt로 mean.io app 실행 후, 실제 로그인 연동 테스트를 해본다.

## 기타
passport-oauth 모듈과 passport-facebook 모듈을 참고함.


