const User = require('../models/user');

exports.checkPermission = async(req, res, next) => {
    try{
        const exUser = await User.findOne({
            where : {nickName: req.params.nickName},
        });
        if (!exUser){
            console.log(`존재하지 않는 닉네임 <${req.params.nickName}> 조회를 원하고 있음`);
            return res.status(403).send("존재하지 않는 닉네임을 검색하고 있습니다");
        } else if (exUser.nickName != req.user.nickName) {
            console.log("입력 원하는 유저 닉네임 : " + exUser.nickName, "\n현재 로그인 중인 유저 닉네임 : " + req.user.nickName);
            return res.status(403).send("현재 사용자는 권한이 없습니다");
        }
        next();
    } catch (err) {
        console.log("User permission error \n");
        next(err)
    }
};