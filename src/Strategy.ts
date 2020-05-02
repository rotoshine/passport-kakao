import { inherits } from 'util'
import OAuth2Strategy from 'passport-oauth2'

import { StrategyOptions, Profile } from './types/models'

const DEFAULT_CLIENT_SECRET = 'kakao'
const OAUTH_HOST = 'https://kauth.kakao.com'
const USER_PROFILE_URL = 'https://kapi.kakao.com/v2/user/me'

export const buildOptions = (options: StrategyOptions) => {
  options.authorizationURL = `${OAUTH_HOST}/oauth/authorize`
  options.tokenURL = `${OAUTH_HOST}/oauth/token`

  if (!options.clientSecret) {
    options.clientSecret = DEFAULT_CLIENT_SECRET
  }

  options.scopeSeparator = options.scopeSeparator || ','
  options.customHeaders = options.customHeaders || {}

  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] = options.userAgent || 'passport-kakao'
  }

  return options
}
/**
 * KaKaoStrategy 생성자 함수.<br/>
 * @param options.clientID 필수. kakao rest app key.
 * @param options.callbackURL 필수. 로그인 처리 후 호출할 URL
 * @param verify
 * @constructor
 */
function Strategy(options: StrategyOptions = {}, verify: any) {
  OAuth2Strategy.call(this, buildOptions(options), verify)
  this.name = 'kakao'
  this._userProfileURL = USER_PROFILE_URL
}

/**
 * `OAuth2Stragegy`를 상속 받는다.
 */
inherits(Strategy, OAuth2Strategy)

/**
 * kakao 사용자 정보를 얻는다.<br/>
 * 사용자 정보를 성공적으로 조회하면 아래의 object가 done 콜백함수 호출과 함꼐 넘어간다.
 *
 *   - `provider`         kakao 고정
 *   - `id`               kakao user id number
 *   - `username`         사용자의 kakao nickname
 *   - `_raw`             json string 원문
 *   _ `_json`            json 원 데이터
 *
 * @param {String} accessToken
 * @param {Function} done
 */
Strategy.prototype.userProfile = function (
  accessToken: string,
  done: (error: Error, profile?: Profile) => void
) {
  this._oauth2.get(
    this._userProfileURL,
    accessToken,
    (err: Error, body: string) => {
      if (err) {
        return done(err)
      }

      try {
        const json = JSON.parse(body)
        // 카카오톡이나 카카오스토리에 연동한 적이 없는 계정의 경우
        // properties가 비어있다고 한다. 없을 경우의 처리
        const properties = json.properties || {
          nickname: '미연동 계정',
        }
        const profile: Profile = {
          provider: 'kakao',
          id: json.id,
          username: properties.nickname,
          displayName: properties.nickname,
          _raw: body,
          _json: json,
        }
        return done(null, profile)
      } catch (e) {
        return done(e)
      }
    }
  )
}

export default Strategy
