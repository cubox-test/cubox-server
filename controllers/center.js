const { Job } = require('../models');
const { sequelize } = require('../models');

exports.companylist = async (req, res, next) => {
    try {
        const query = `select c.id, c.name, count(distinct w.userId) as worker, j.stateId, count(distinct j.id) as job\
                       from centers c\
                       left join workers w on c.id = w.centerId\
                       left join jobs j on c.id = j.centerid\
                       where supervisorId = '${req.query.userId}'\
                       group by 2, 4;`
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
                arr.push({centerId: result[i-1].id, centerName: centerName, numberOfWorker: result[i-1].worker, totalJobs: totalJobs,
                        assignedJobs: (totalJobs - waitingJobs), waitingJobs: waitingJobs});
                centerName = temp;
                totalJobs = 0;
                waitingJobs = 0;
            }
            if (i == result.length - 1) {
                arr.push({centerId: result[i].id, centerName: centerName, numberOfWorker: result[i].worker, totalJobs: totalJobs,
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

exports.workerinfo = async (req, res, next) => {
    try {
        const job = await Job.findAll({
            where : { centerId : req.query.centerId },
            attributes : ['workerId', ['name', 'jobName'] , ['id', 'jobId'], 'total', 'submitted'],
            raw: true
        });
        
        const result = [];
        for (let i = 0; i < job.length; i++){
            const achievement = parseFloat((job[i].submitted / job[i].total * 100).toFixed(2));
            result.push({workerId: job[i].workerId, jobName: job[i].jobName, jobId: job[i].jobId, achievement: achievement});
        }
        return res.status(200).send(JSON.stringify(result));
    } catch (err) {
        console.log("workerinfo error");
        next(err);
    }
};

exports.GetJobs = async (req, res, next) => {
    try {
        const job = await Job.findAll({
            where : { centerId : req.query.centerId },
            attributes : [['id', 'jobId'], ['name', 'jobName'], ['stateId', 'assignState'] , ['workerId', 'assignWorkerId']],
        });

        console.log("센터에 배정된 모든 job 정보");
        return res.status(200).send(job);
    } catch (err) {
        console.log("getjobs error");
        next(err);
    }
};

exports.assignment = async (req, res, next) => {
    try {
        const { jobId, workerId } = req.body;

        const isAssigned = await Job.findOne({
            where: { id: jobId },
            attributes: ['stateId']
        });

        if (isAssigned.stateId != 1) {
            console.log("이미 다른 worker에게 할당된 Job입니다.");
            return res.status(403).send({"message": "이미 다른 worker에게 할당된 Job입니다"});
        } 

        await Job.update({
            workerId : workerId,
            stateId : 2,
        }, {
            where : { id: jobId },
        });
        console.log("Worker에게 Job 할당 완료");
        return res.status(201).send({"message" : "Worker에게 Job 할당 완료"});
    } catch (err) {
        console.log("assignment error");
        next(err);
    }
};