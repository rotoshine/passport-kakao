/**
 * Module dependencies.
 */
var util = require('util'),
    OAuth2Strategy = require('passport-oauth2');

var host = 'https://kauth.kakao.com';

/**
 * `Strategy` constructor.
 *
 * The GitHub authentication strategy authenticates requests by delegating to
 * GitHub using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your GitHub application's Client ID
 *   - `clientSecret`  your GitHub application's Client Secret
 *   - `callbackURL`   URL to which GitHub will redirect the user after granting authorization
 *   - `scope`         array of permission scopes to request.  valid scopes include:
 *                     'user', 'public_repo', 'repo', 'gist', or none.
 *                     (see http://developer.github.com/v3/oauth/#scopes for more info)
 *   — `userAgent`     All API requests MUST include a valid User Agent string.
 *                     e.g: domain name of your application.
 *                     (see http://developer.github.com/v3/#user-agent-required for more info)
 *
 * Examples:
 *
 *     passport.use(new GitHubStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/github/callback',
 *         userAgent: 'myapp.com'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL = host + '/oauth/authorize';
    options.tokenURL = host + '/oauth/token';
    options.scopeSeparator = options.scopeSeparator || ',';
    options.customHeaders = options.customHeaders || {};

    // 실제로 clientSecret이 쓰이진 않으나 OAuth2Strategy에선 필수 파라메터라서
    // 더미값 넣음
    options.clientSecret = 'kakao';
    if (!options.customHeaders['User-Agent']) {
        options.customHeaders['User-Agent'] = options.userAgent || 'passport-kakao';
    }

    OAuth2Strategy.call(this, options, verify);
    this.name = 'kakao';
    this._userProfileURL = 'https://kapi.kakao.com/v1/user/me';

    // client secret이 파라메터에 있으면 엑세스 토큰 조회시 에러..
    delete this._oauth2._clientSecret;
    console.log(this);
}

/**
 * Inherit from `OAuth2Stragegy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from GitHub.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `github`
 *   - `id`               the user's GitHub ID
 *   - `username`         the user's GitHub username
 *   - `displayName`      the user's full name
 *   - `profileUrl`       the URL of the profile for the user on GitHub
 *   - `emails`           the user's email addresses
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
    this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
        if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }

        try {
            var json = JSON.parse(body);

            var profile = { provider: 'kakao' };
            profile.id = json.id;
            profile.username = json.properties.nickname;

            profile._raw = body;
            profile._json = json;

            done(null, profile);
        } catch(e) {
            done(e);
        }
    });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
