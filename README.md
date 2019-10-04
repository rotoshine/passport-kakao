# passport-kakao

kakao oauth2 로그인과 passport 모듈 연결체.

## install

```sh
npm install passport-kakao
```

## how to use

- https://developers.kakao.com/ 에서 애플리케이션을 등록한다.
- 방금 추가한 애플리케이션의 설정 - 사용자 관리에 들어가서 사용을 ON으로 한 뒤 저장한다.
- 설정 - 일반에서, 플랫폼 추가를 누른 후 웹 플랫폼을 추가한다.
- 웹 플랫폼 설정의 사이트 도메인에 자신의 사이트 도메인을 추가한다. (ex : http://localhost:3000)
- 프로그램 상에서는 아래와 같이 사용한다.

> clientSecret을 활성화 한 경우 해당 파라메터를 같이 넘겨줘야한다.

```javascript
const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy

passport.use(new KakaoStrategy({
    clientID : clientID,
    clientSecret: clientSecret, // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
    callbackURL : callbackURL
  },
  (accessToken, refreshToken, profile, done) => {
    // 사용자의 정보는 profile에 들어있다.
    User.findOrCreate(..., (err, user) => {
      if (err) { return done(err) }
      return done(null, user)
    })
  }
))
```

> 기본 callbackPath는 `/oauth` 이고 https://developers.kakao.com 에서 수정할 수 있다. 하지만 callbackURL은 `사이트 도메인/oauth` 로 설정하는 것을 권장함. (ex : http://myhomepage.com:3000/oauth )

##

## profile property

profile에는 아래의 property들이 설정되어 넘겨진다.

| key      | value  | 비고                                       |
| -------- | ------ | ------------------------------------------ |
| provider | String | kakao 고정                                 |
| id       | Number | 사용자의 kakao id                          |
| \_raw    | String | 사용자 정보 조회로 얻어진 json string      |
| \_json   | Object | 사용자 정보 조회로 얻어진 json 원본 데이터 |

## simple sample

### 설치 & 실행

1. `./sample/sample.js` 의 `appKey` 를 https://developers.kakao.com 에서 발급받은 JS appKey 값으로 셋팅.
2. command line 에서 아래의 커맨드 실행
3. 브라우져를 열고 `127.0.0.1:3000/login` 을 입력 후 이후 과정을 진행한다.

```
cd ./sample
npm install
node app
```

## mean.io 와 쉽게 연동하기

수정해야하는 파일들은 아래와 같다.

| file path                        | 설명                           |
| -------------------------------- | ------------------------------ |
| server/config/env/development.js | 개발환경 설정파일              |
| server/config/env/production.js  | 운영환경 설정파일              |
| server/config/models/user.js     | 사용자 모델                    |
| server/config/passport.js        | passport script                |
| server/routes/users.js           | 사용자 로그인 관련 routes file |
| public/auth/views/index.html     | 로그인 화면                    |

(1) **mean.io app을 생성** 한다. (ex : mean init kakaoTest)

(2) 해당 모듈을 연동할 mean.io app에 설치한다.(npm install passport-kakao --save)

(3) **server/config/env/development.js** 와 **production.js** 에 kakao 관련 설정을 아래와 같이 추가한다.

```javascript
'use strict'

module.exports = {
  db: 'mongodb',
  app: {
    name: 'passport-kakao',
  },
  // 그외 설정들....,
  kakao: {
    clientID: 'kakao app rest api key',
    callbackURL: 'http://localhost:3000/oauth',
  },
}
```

(4) **server/config/models/users.js** 의 사용자 스키마 정의에 **kakao: {}** 를 추가한다.

(5) **server/config/passport.js** 파일에 아래 구문을 추가한다.

```javascript
// 최상단 require되는 구문에 추가
var KakaoStrategy = require('passport-kakao').Strategy

passport.use(
  new KakaoStrategy(
    {
      clientID: config.kakao.clientID,
      callbackURL: config.kakao.callbackURL,
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne(
        {
          'kakao.id': profile.id,
        },
        function(err, user) {
          if (err) {
            return done(err)
          }
          if (!user) {
            user = new User({
              name: profile.username,
              username: profile.id,
              roles: ['authenticated'],
              provider: 'kakao',
              kakao: profile._json,
            })

            user.save(function(err) {
              if (err) {
                console.log(err)
              }
              return done(err, user)
            })
          } else {
            return done(err, user)
          }
        }
      )
    }
  )
)
```

(6) **server/routes/users.js** 에 아래와 같은 구문을 추가한다.

```javascript
app.get(
  '/auth/kakao',
  passport.authenticate('kakao', {
    failureRedirect: '#!/login',
  }),
  users.signin
)

app.get(
  '/oauth',
  passport.authenticate('kakao', {
    failureRedirect: '#!/login',
  }),
  users.authCallback
)
```

(7) **public/auth/views/index.html** 에 kakao login을 연결한다.

```html
<!-- 아래는 예시 -->
<div>
  <div class="row">
    <div class="col-md-offset-1 col-md-5">
      <a href="/auth/facebook">
        <img src="/public/auth/assets/img/icons/facebook.png" />
      </a>
      <a href="/auth/twitter">
        <img src="/public/auth/assets/img/icons/twitter.png" />
      </a>

      <!-- kakao login -->
      <a href="/auth/kakao">
        <img
          src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
        />
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
