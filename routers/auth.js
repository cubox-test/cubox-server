const express = require('express');
const { isLoggedIn, isNotLoggedIn, checkPermission } = require('../middlewares');

const Controller = require('../controllers/auth');
const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user; // 전역적으로 사용
    next();
});

router.post('/signup', isNotLoggedIn, Controller.signup); // 회원가입
router.post('/certifications', Controller.certifications); // 휴대폰 인증 API endpoint
router.post('/login', isNotLoggedIn, Controller.login); // 로그인
router.get('/logout', isLoggedIn, Controller.logout); // 로그아웃
router.get('/me', Controller.me); // 로그인 상태 확인
router.post('/mail', isNotLoggedIn, Controller.mail); // 메일 형식 확인

module.exports = router; 