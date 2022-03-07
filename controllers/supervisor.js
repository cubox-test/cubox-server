const { Job, Project, User, Worker } = require('../models');
const { sequelize } = require('../models');

exports.main = async (req, res, next) => {
    try {
        const centerQuery = `SELECT c.id as centerId, c.name as centerName,\
                                count(distinct if(p.stateId=1, p.id, null)) as createdProjects,\ 
                                count(distinct if(p.stateId=2, p.id, null)) as processingProjects,\
                                count(distinct if(p.stateId=3, p.id, null)) as finishedProjects, c.stateId as centerStatus\
                             FROM centers c\
                             LEFT JOIN workers w ON c.id = w.centerId\
                             LEFT JOIN projects p ON c.id = p.centerId\
                             WHERE supervisorId = '${req.user.userId}'\
                             GROUP BY 1,2;`
        
        const [center] = await sequelize.query(centerQuery);

        const info = [];
        for (const temp_center of center){
            let result = [];
            const projectQuery = `SELECT p.id as projectId, p.name as projectName, count(distinct j.id) as totalJobs,\
                                    count(distinct if(j.stateId=1, j.id, null)) as createdJobs,\
                                    count(distinct if(j.stateId=2, j.id, null)) as proessingJobs,\
                                    count(distinct if(j.stateId=3, j.id, null)) as finishedJobs\
                                  FROM projects p\
                                  LEFT JOIN jobs j ON p.id = j.projectId\
                                  WHERE centerId = '${temp_center.centerId}'\
                                  GROUP BY 1, 2;`
            const [project] = await sequelize.query(projectQuery);

            for (const temp_project of project){
                result.push(temp_project);
            }
            info.push({'center' : temp_center, 'project' : result});
        }

        console.log("center list 반환 성공");
        return res.status(200).send(info);
    } catch (err) {
        console.log("companylist error");
        next(err);
    }
};



/* exports.GetProjects = async (req, res, next) => {
    try {
        const project = await Project.findAll({
            where : { centerId : req.query.centerId },
            attributes : [['id', 'projectId'], ['name', 'projectName']],
            include : [{
                model: Job,
                attributes: [[sequelize.fn('COUNT', 'id'), 'total']],
            }],
            group: ['projectId', 'projectName']
        });

        console.log("센터에 배정된 모든 Project 정보");
        return res.status(200).send(project);
    } catch (err) {
        console.log("getprojects error");
        next(err);
    }
}; */

// 통과
exports.GetJobs = async (req, res, next) => {
    try {
        const job = await Job.findAll({
            where: {projectId : req.query.projectId},
            attributes: [['id', 'jobId'], ['name', 'jobName'], 'total', 'submitted', 'stateId', 'workerId'],
            raw : true,
        });
        
        for (let i = 0; i < job.length; i++) {
            const exnickName = await User.findOne({
                where: {userId : job[i].workerId},
                attributes: ['nickName'],
                raw : true,
            });
            if(exnickName){
                job[i].workernickName = exnickName.nickName;
                job[i].achievement = parseFloat((job[i].submitted / job[i].total * 100).toFixed(2));
            } else {
                job[i].workernickName = 'No_assigned';
                job[i].achievement = 0;
            }
            delete job[i].workerId;
        };

        console.log("특정 Project 내 Job list 반환");
        return res.status(200).send(job);
    } catch (err) {
        console.log("getjobs error");
        next(err);
    }
};

// 통과
exports.workerinfo = async (req, res, next) => {
    try {
        const workerlist = await Worker.findAll({
            where: {centerId : req.query.centerId},
            attributes: ['workerId'],
            include: [{
                model: User,
                attributes: [['nickName', 'workerNickName']],
            }]
        });

        console.log("Worker list 반환");
        return res.status(200).send(workerlist);
    } catch (err) {
        console.log("workerinfo error");
        next(err);
    }
};

// 통과
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