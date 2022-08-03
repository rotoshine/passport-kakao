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
  _json: {
    id: number
    connected_at: string
    properties: {
      nickname: string
      profile_image: string
      thumbnail_image: string
    }
    kakao_account: {
      profile_needs_agreement: boolean
      profile: {
        nickname: string
        thumbnail_image_url: string
        profile_image_url: string
        is_default_image: boolean
      }
      has_email: boolean
      email_needs_agreement: boolean
      is_email_valid: boolean
      is_email_verified: boolean
      email: string
      has_age_range: boolean
      age_range_needs_agreement: boolean
      has_birthday: boolean
      birthday_needs_agreement: boolean
      has_gender: boolean
      gender_needs_agreement: boolean
    }
  }
}
