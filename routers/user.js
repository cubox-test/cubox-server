const express = require('express');
const { checkPermission } = require('../middlewares/user');

const Controller = require('../controllers/user');
const router = express.Router();

router.route('/:nickName')
    .get(checkPermission, Controller.GetUserInfo) // 유저 정보 조회
    .patch(checkPermission, Controller.UpdateUserInfo)  // 유저 정보 변경
    .delete(checkPermission, Controller.DeleteUser); // 유저 삭제

module.exports = router; 