const User = require('../models/user');

exports.GetUserInfo = async (req, res, next) => {
    try {
        const user = await User.findOne({
            attributes : ['email', 'name', 'nickName'],
            where : { nickName : req.params.nickName },
        });
        if (user) {
            console.log("유저 정보 조회");
            return res.status(200).send(user);
        }
        console.log("해당 유저 정보 없음");
        return res.status(403).send("해당 유저 정보 없음");
    } catch (err) {
        console.log("GetUserInfo error");
        next(err);
    }
};

exports.DeleteUser = async (req, res, next) => {
    try {
        const user = await User.destroy({
            where: { nickName: req.params.nickName },
        });
        console.log(`${req.params.nickName}님 회원 정보 삭제`);
        return res.status(201).send(`${req.params.nickName}님 회원 정보 삭제`);
    } catch (err) {
        console.log("DeleteUser error \n");
        next(err);
    }
};