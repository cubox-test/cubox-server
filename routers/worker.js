const express = require('express');

const { } = require('../middlewares/worker');

const Controller = require('../controllers/worker');
const router = express.Router();

router.get('/', Controller.main); // 작업자 메인 페이지

module.exports = router; 