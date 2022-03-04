const { Job, Project, User, Worker } = require('../models');
const { sequelize } = require('../models');

exports.main = async (req, res, next) => {
    try {
        const query = `select c.id, c.name, count(distinct w.userId) as worker, p.total as total, p.assigned as assigned, p.submitted as submitted\ 
                       from centers c\
                       left join workers w on c.id = w.centerId\
                       left join projects p on c.id = p.centerId\
                       where supervisorId = '${req.user.userId}'\
                       group by c.name, p.name;`
        const [result, metadata] = await sequelize.query(query);

        if(!result.length) {
            return res.status(403).send({"message": "정보가 조회되지 않습니다."});
        }
        let centerName = result[0].name;
        let totalProjects = 0;
        let assignedProjects = 0;
        let submittedProjects = 0;
        
        const arr = [];
        for (let i = 0; i<result.length; i++) {
            const name = result[i].name;
            const total = result[i].total;
            const assigned = result[i].assigned;
            const submitted = result[i].submitted;
            
            if (name == centerName) {
                totalProjects += total;
                assignedProjects += assigned;
                submittedProjects += submitted;
            } else {
                arr.push({centerId: result[i-1].id, centerName: centerName, numberOfWorker: result[i-1].worker, totalProjects: totalProjects,
                    assignedProjects: assignedProjects, submittedProjects: submittedProjects, waitingProjects: (totalProjects - assignedProjects)});
                centerName = name;
                totalProjects = 0;
                assignedProjects = 0;
                submittedProjects = 0;
            }
            if (i == result.length - 1) {
                arr.push({centerId: result[i].id, centerName: centerName, numberOfWorker: result[i].worker, totalProjects: totalProjects,
                    assignedProjects: assignedProjects, submittedProjects: submittedProjects, waitingProjects: (totalProjects - assignedProjects)});
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

exports.GetProjects = async (req, res, next) => {
    try {
        const project = await Project.findAll({
            where : { centerId : req.query.centerId },
            attributes : [['id', 'projectId'], ['name', 'projectName'], 'total', 'submitted'],
        });

        console.log("센터에 배정된 모든 Project 정보");
        return res.status(200).send(project);
    } catch (err) {
        console.log("getprojects error");
        next(err);
    }
};

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