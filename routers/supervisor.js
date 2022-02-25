const express = require('express');

const Controller = require('../controllers/supervisor');
const { checkPermission } = require('../middlewares/supervisor');
const router = express.Router();

router.get('/companylist', checkPermission, Controller.companylist);
module.exports = router; 