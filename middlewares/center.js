const { User, Center, Supervisor } = require('../models');

exports.checkUserId = async(req, res, next) => {
    try{
        const exUser = await User.findOne({
            where : {userId: req.query.userId},
        });
        if (!exUser){
            console.log(`존재하지 않는 사용자 <${req.query.userId}>입니다`);
            return res.status(403).send("존재하지 않는 사용자입니다.\n다시 확인바랍니다.");
        } else if (exUser.userId != req.user.userId) {
            console.log("현재 사용자는 권한이 없습니다");
            return res.status(403).send("현재 사용자는 권한이 없습니다");
        }
        next();
    } catch (err) {
        console.log("User permission error \n");
        next(err)
    }
};

exports.checkPermission = async(req, res, next) => {
    try{
        const exSupervisor = await Supervisor.findOne({
            where : {userId: req.user.userId},
        });
        const exCenter = await Center.findOne({
            where : {id : req.query.centerId },
        });

        if (!exSupervisor){
            console.log(`존재하지 않는 사용자 입니다`);
            return res.status(403).send("존재하지 않는 사용자입니다.\n다시 확인바랍니다.");
        } else if (!exCenter) {
            console.log('존재하지 않는 센터입니다');
            return res.status(403).send("존재하지 않는 센터입니다");
        } else if (exSupervisor.supervisorId != exCenter.supervisorId) {
            console.log("현재 사용자는 권한이 없습니다");
            return res.status(403).send("현재 사용자는 권한이 없습니다");
        }
        next();
    } catch (err) {
        console.log("checkpermission error \n");
        next(err)
    }
};