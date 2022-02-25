const { Supervisor, Center, Worker } = require("../models");
const { sequelize } = require('../models');

exports.companylist = async (req, res, next) => {
    try {

        const rep = await Supervisor.findOne({
            where : { userId : req.query.userId },
            attributes: ['supervisorId'],
            raw: true,
        });

        const query = `select c.name, count(distinct w.userId) as worker, j.stateId, count(distinct j.id) as job\
                      from centers c\
                      left join workers w on c.id = w.centerId\
                      left join jobs j on c.id = j.centerid\
                      where supervisorId = ${rep.supervisorId}\
                      group by 1, 3;`
        const [result, metadata] = await sequelize.query(query);
        

        if(!result.length) {
            return res.status(403).send({"message": "정보가 조회되지 않습니다."});
        }
        let centerName = result[0].name;
        let totalJobs = 0;
        let waitingJobs = 0;
        
        const arr = [];
        for (let i = 0; i<result.length; i++) {
            const temp = result[i].name;
            const stateId = result[i].stateId;
            
            if (temp == centerName) {
                if ( stateId == 1 ) {
                    waitingJobs = result[i].job;
                }
                totalJobs += result[i].job;
            } else {
                arr.push({centerName: centerName, numberOfWorker: result[i].worker, totalJobs: totalJobs,
                        assignedJobs: (totalJobs - waitingJobs), waitingJobs: waitingJobs});
                centerName = temp;
                totalJobs = 0;
                waitingJobs = 0;
            }
            if (i == result.length - 1) {
                arr.push({centerName: centerName, numberOfWorker: result[i].worker, totalJobs: totalJobs,
                    assignedJobs: (totalJobs - waitingJobs), waitingJobs: waitingJobs});
            }
        }

        console.log("center list 반환 성공");
        return res.status(200).send(JSON.stringify(arr));
    } catch (err) {
        console.log("companylist error");
        next(err);
    }
};