const User = require('../models/user');

exports.checkPermission = async(req, res, next) => {
    try{
        const exUser = await User.findOne({
            where : {nickName: req.params.nickName},
        });
        if (!exUser) return res.status(403).send("권한이 없습니다");
        next();
    } catch (err) {
        console.log("User permission error \n");
        next(err)
    }
};