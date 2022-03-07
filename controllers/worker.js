const { } = require('../models');
const { sequelize } = require('../models');

// 통과
exports.main = async (req, res, next) => {
    try {
        const query = `select id as jobId, name as jobName, total, submitted, (total - submitted) as waiting,\
                       cast(submitted / total * 100 as DECIMAL(10,2)) as achievement\
                       from jobs\
                       where workerId = '${req.user.userId}';`
        const [result, metadata] = await sequelize.query(query);

        const job = result.map((result) => {
            result.achievement = parseFloat(result.achievement);
            return result;
        })

        let allOfTotal = 0;
        let allOfSubmitted = 0;
        let allOfWaiting = 0;
        for (let i=0; i < job.length; i++){
            allOfTotal += job[i].total;
            allOfSubmitted += job[i].submitted;
            allOfWaiting += job[i].waiting;
        }

        const total = [{"allOfTotal" : allOfTotal, "allOfSubmitted": allOfSubmitted, "allOfWaiting" : allOfWaiting,
                        "allOfAchievement" : parseFloat((allOfSubmitted / allOfTotal * 100).toFixed(2))}];
        
        console.log("Worker Main Page");
        return res.status(200).send(Object.assign({total : total, jobInfo : result}));

    } catch (err) {
        console.log("Worker main page error");
        next(err);
    }
};