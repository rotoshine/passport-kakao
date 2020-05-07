import { StrategyOptions } from './types/models';
export declare const buildOptions: (options: StrategyOptions) => StrategyOptions;
/**
 * KaKaoStrategy 생성자 함수.<br/>
 * @param options.clientID 필수. kakao rest app key.
 * @param options.callbackURL 필수. 로그인 처리 후 호출할 URL
 * @param verify
 * @constructor
 */
declare function Strategy(options: StrategyOptions, verify: any): void;
export default Strategy;
