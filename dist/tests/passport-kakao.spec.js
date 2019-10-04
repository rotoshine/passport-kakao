"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Strategy_1 = __importStar(require("../src/Strategy"));
describe('passport-kakao', function () {
    it('passport-kakao 객체가 제대로 생성이 되어 있어야 한다.', function () {
        chai_1.expect(Strategy_1.default).to.not.equals(null);
    });
    it('Strategy option의 clientSecret 값이 없을 경우 default 값이 설정되어야 한다.', function () {
        var options = Strategy_1.buildOptions({});
        chai_1.expect(options).to.not.equals(null);
        chai_1.expect(options.clientSecret).to.be.equals('kakao');
        chai_1.expect(options.scopeSeparator).to.be.equals(',');
        chai_1.expect(options.customHeaders['User-Agent']).to.be.equals('passport-kakao');
    });
    it('Strategy option의 User-Agent값이 있을 경우 customHeaders의 User-Agent가 해당 값으로 설정되어야 한다.', function () {
        var options = Strategy_1.buildOptions({
            customHeaders: {
                'User-Agent': 'HELLO ROTO',
            },
        });
        chai_1.expect(options.customHeaders['User-Agent']).to.be.equals('HELLO ROTO');
    });
});
