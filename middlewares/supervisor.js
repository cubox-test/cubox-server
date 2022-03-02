const { Center, Supervisor, Project } = require('../models');

exports.checkSupervisor = async (req, res, next) => {
    try {
        const exSupervisor = await Supervisor.findOne({
            where : {userId: req.user.userId},
        });

        if (!exSupervisor){
            console.log('관리자가 아닙니다.');
            return res.status(403).send("관리자 권한이 없습니다.\n다시 확인바랍니다.");
        }
        next();
    } catch (err) {
        console.log('checkSupervisor error');
        next(err);
    }
};

exports.checkCenter = async (req, res, next) => {
    try{
        const exCenter = await Center.findOne({
            where : {id : req.query.centerId },
        });
        const exSupervisor = await Supervisor.findOne({
            where : {userId: req.user.userId},
        });
        
        if (!exCenter) {
            console.log('존재하지 않는 센터입니다');
            return res.status(403).send("존재하지 않는 센터입니다");
        } else if (exSupervisor.supervisorId != exCenter.supervisorId) {
            console.log("현재 관리자는 해당 센터에 접근할 권한이 없습니다");
            return res.status(403).send("현재 관리자는 해당 센터에 접근할 권한이 없습니다");
        }
        next();
    } catch (err) {
        console.log("checkCenter error \n");
        next(err)
    }
};

exports.checkProject = async (req, res, next) => {
    try{
        const exProject = await Project.findOne({
            where : {id : req.query.projectId },
        });
        
        if (!exProject) {
            console.log('존재하지 않는 프로젝트입니다');
            return res.status(403).send("존재하지 않는 프로젝트입니다");
        }
        next();
    } catch (err) {
        console.log("checkProject error \n");
        next(err)
    }
}