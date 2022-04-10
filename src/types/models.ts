export interface StrategyOptions {
  authorizationURL?: string
  prompt?: string
  state?: string
  nonce?: string
  tokenURL?: string
  clientSecret?: string
  scopeSeparator?: string
  customHeaders?: {
    'User-Agent'?: string
  }
  userAgent?: string
}

export interface Profile {
  provider: 'kakao'
  id?: string | number
  username?: string
  displayName?: string
  _raw: string
  _json: string
}
