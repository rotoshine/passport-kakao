import { expect } from 'chai'
import KakaoStrategy, { buildOptions } from '../src/Strategy'

describe('passport-kakao', () => {
  it('passport-kakao 객체가 제대로 생성이 되어 있어야 한다.', () => {
    expect(KakaoStrategy).to.not.equals(null)
  })
  it('Strategy option의 clientSecret 값이 없을 경우 default 값이 설정되어야 한다.', () => {
    const options = buildOptions({})

    expect(options).to.not.equals(null)
    expect(options.authorizationURL).to.be.equal('https://kauth.kakao.com/oauth/authorize')
    expect(options.tokenURL).to.be.equal('https://kauth.kakao.com/oauth/token')
    expect(options.clientSecret).to.be.equal('kakao')
    expect(options.scopeSeparator).to.be.equal(',')
    expect(options.customHeaders['User-Agent']).to.be.equal('passport-kakao')
  })
  it('Strategy option의 User-Agent값이 있을 경우 customHeaders의 User-Agent가 해당 값으로 설정되어야 한다.', () => {
    const options = buildOptions({
      customHeaders: {
        'User-Agent': 'HELLO ROTO',
      },
    })
    expect(options.customHeaders['User-Agent']).to.be.equals('HELLO ROTO')
  })
})
