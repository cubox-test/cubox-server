const bcrypt = require('bcrypt');

const User = require('../models/user');
const Role = require('../models/role');

exports.GetUserInfo = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where : { nickName : req.params.nickName },
            attributes : ['email', 'name', 'nickName', 'foreigner', 'age'],
            include : [{
                model: Role,
                attributes : ['name']
            }],
        });
        
        console.log(user);
        console.log("유저 정보 조회");
        return res.status(200).send(user);

    } catch (err) {
        console.log("GetUserInfo error");
        next(err);
    }
};

exports.UpdateUserInfo = async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        
        const user = await User.update({
            password: hash,
            nickName: req.body.nickName,
        }, {where: {nickName: req.params.nickName}})
        
        console.log("사용자 정보 변경");
        return res.status(201).send({"message": "사용자 정보 변경"});

    } catch (err) {
        console.log("UpdateUserInfo error");
        next(err);
    }
}

exports.DeleteUser = async (req, res, next) => {
    try {
        const user = await User.destroy({
            where: { nickName: req.params.nickName },
        });
        console.log(`${req.params.nickName}님 회원 정보 삭제`);
        return res.status(201).send({"message" : `${req.params.nickName}님 회원 정보 삭제`});
    } catch (err) {
        console.log("DeleteUser error \n");
        next(err);
    }
};