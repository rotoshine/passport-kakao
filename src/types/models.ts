export interface StrategyOptions {
  authorizationURL?: string
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
