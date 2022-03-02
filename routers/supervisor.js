const express = require('express');

const { checkCenter, checkProject } = require('../middlewares/supervisor');

const Controller = require('../controllers/supervisor');
const router = express.Router();

router.get('/', Controller.companylist); // 관리자 메인 페이지
router.get('/project', checkCenter, Controller.GetProjects); // 해당 센터에 배정된 프로젝트 정보
router.get('/job', checkCenter, checkProject, Controller.GetJobs); // 해당 프로젝트에 배정된 Job 정보
router.get('/workers', checkCenter, checkProject, Controller.workerinfo); // 센터에 배정된 워커 정보
router.post('/assignment', checkCenter, checkProject, Controller.assignment); // Job 배정하기

module.exports = router; 