const { Supervisor, Center } = require('../models');

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()){
        next();
    } else {
        res.status(403).send('로그인 필요');
        console.log('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 상태입니다');
        console.log('로그인 상태입니다');
    }
};
