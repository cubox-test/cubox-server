const passport = require('passport');
const bcrypt = require('bcrypt');
const axios = require('axios');

const User = require('../models/user');

exports.signup = async(req, res, next) => {
    const {email, name, password, unique_key} = req.body;
    console.log("email : " + email + ', password : '+ password + ", name : " + name + "\nunique_key : " + unique_key);
    try {
        const exId = await User.findOne({ where : { email }});

        if (exId) {
            console.log('아이디 중복 오류');
            return res.status(400).send('이미 회원인 상태입니다');
        } 

        const hash = await bcrypt.hash(password, 10); // 2^12번 해싱 라운드(salt round - 2번째 인자) => Cost
        await User.create({
            email,
            name,
            password: hash,
            unique_key
        });
        
        console.log('회원가입 완료');
        return res.status(201).send('회원가입 성공');
    } catch (err) {
        console.log('signup error');
        console.error(err);
        return next(err);
    }
};

// 아임포트 인증 => 사용자의 정보 추출(연령 제한, 아이디 하나 제한 기능, 실명 인증)
exports.certifications = async(req, res, next) => {
    const { imp_uid } = req.body; 
    const imp_key = "0292725665720764";
    const imp_secret = "831694a8db7ddfdd41b3b8f86c59533bf73dca6a520024514f21165bd7f8736d0fde80d10427d7ab";
    try {
        const getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post",
            headers: { "Content-Type": "application/json" },
            data: {
                imp_key: imp_key,
                imp_secret: imp_secret
            }
        });
        const { access_token } = getToken.data.response; // 인증 토큰
        console.log("token : ", access_token);
        console.log("imp_uid : ", imp_uid);
        // 정보 조회
        const getCertifications = await axios({
            url: `https://api.iamport.kr/certifications/${imp_uid}`,
            method: "get",
            headers: { "Authorization": access_token } // 토큰 header에 추가
        }); 
        const certificationInfo = getCertifications.data.response; // 인증 정보

        const { unique_key, unique_in_site, name, gender, birth } = certificationInfo;
        console.log('이름 : ' + name + ', 성별 : ' + gender + ', 생일일자 : ' + birth);
        console.log('Unique key : ' + unique_key + ', unique_in_site : ' + unique_in_site);

        exCellPhone = await User.fineOne({ where : { unique_key }})
        if (exCellPhone){
            console.log("핸드폰 중복 인증 불가");
            return res.status(400).send("핸드폰 중복 인증 불가");
        }
        console.log("핸드폰 인증 성공");
        return res.status(201).send({ unique_key : unique_key});

    } catch(err){
        console.log('certification error');
        console.error(err);
        return next(err);
    }
};

exports.login = async (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError) {
            console.error(authError);
            return next(authError);
        }
        if(!user){
            return res.status(400).send('아이디 혹은 비밀번호가 존재하지 않습니다');
        }
        return req.login(user, (loginError) => {
            if (loginError){
                console.error(loginError);
                return next(loginError);
            }
            console.log(`${user.name}님 로그인 성공`);
            return res.status(201).send(`${user.name}님 로그인 성공`);
        })
    })(req, res, next)
};

exports.logout = async (req, res) => {
    req.logout();
    req.session.destroy();
    console.log('로그아웃 성공');
    return res.status(200).send('로그아웃 성공');
};