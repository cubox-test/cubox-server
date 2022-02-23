const express = require('express');
const { checkPermission } = require('../middlewares/user');

const Controller = require('../controllers/user');
const router = express.Router();

router.get('/:nickName', Controller.GetUserInfo); // 유저 정보 조회
/* router.patch('/:nickName', Controller.PatchUserInfo); */
router.delete('/:nickName', checkPermission, Controller.DeleteUser); // 유저 삭제

module.exports = router; 