const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');

const Controller = require('../controllers/auth');
const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user; // 전역적으로 사용
    next();
});

router.post('/signup', isNotLoggedIn, Controller.signup); // 회원가입
router.post('/certifications', Controller.certifications); // 휴대폰 인증 API endpoint
router.post('/login', isNotLoggedIn, Controller.login);
router.get('/logout', isLoggedIn, Controller.logout);

module.exports = router; 