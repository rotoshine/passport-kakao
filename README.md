# passport-kakao

kakao oauth2 로그인과 passport 모듈 연결체.

## install

```sh
npm install passport-kakao
```

## how to use

- https://developers.kakao.com/ 에서 애플리케이션을 등록한다.
- 방금 추가한 애플리케이션의 제품 설정 - 카카오 로그인에 들어가서 활성화 설정을 ON으로 한 뒤 저장한다.
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

1. `./sample/server/app.ts` 의 `appKey` 를 https://developers.kakao.com 에서 발급받은 JS appKey 값으로 셋팅.
2. command line 에서 아래의 커맨드 실행
3. 브라우져를 열고 `localhost:3000/login` 을 입력 후 이후 과정을 진행한다.

```
cd ./sample/server
npm install
npm start
```

## 기타

passport-oauth 모듈과 passport-facebook 모듈을 참고함.
