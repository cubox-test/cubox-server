const passport = require('passport');
const local = require('./localStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id); // user.id => deserializeUser 매개변수로 작용
    }); // serialize => 사용자 객체를 세션 아이디로 저장, 로그인 시에만 실행

    passport.deserializeUser((id, done) => {
        User.findOne({ where : { id } })
            .then(user => done(null, user))
            .catch(err => done(err));
    }); // 매 요청 시
    local();
};