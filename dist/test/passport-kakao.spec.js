"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
describe('passport-kakao', function () {
    it('passport-kakao 객체가 제대로 생성이 되어 있어야 한다.', function () {
        var Strategy = require('../lib/passport-kakao');
        expect(Strategy).not.toBeNull();
    });
});
