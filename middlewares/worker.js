const { Worker } = require('../models');

exports.checkWorker = async (req, res, next) => {
    try {
        const exWorker = await Worker.findOne({
            where : {workerId: req.user.userId},
        });

        if (!exWorker){
            console.log('작업자가 아닙니다.');
            return res.status(403).send("작업자 권한이 없습니다.\n다시 확인바랍니다.");
        }
        next();
    } catch (err) {
        console.log('checkWorker error');
        next(err);
    }
};