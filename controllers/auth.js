const passport = require('passport');
const bcrypt = require('bcrypt');
const axios = require('axios');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const today = new Date();

dotenv.config();

const User = require('../models/user');

exports.signup = async(req, res, next) => {
    const {email, password, name, nickName, unique_key, roleId, useragent, signed, foreigner, age} = req.body;
    console.log("email : " + email + ', password : '+ password + ", name : " + name + 
                "\nnickName : " + nickName + "unique_key : " + unique_key);
    try {
        const exId = await User.findOne({ where : { email }});
        const exNick = await User.findOne({ where : { nickName }});
/* 
        if (!validator.isEmail(email)){
            
        } */
        if (exId) {
            console.log('아이디 중복 오류');
            return res.status(400).send('이미 회원인 상태입니다');
        } else if (exNick) {
            console.log('중복된 닉네임이 있습니다');
            return res.status(400).send('중복된 닉네임이 있습니다');
        } 

        const hash = await bcrypt.hash(password, 10); // 2^12번 해싱 라운드(salt round - 2번째 인자) => Cost
        await User.create({
            email,
            password: hash,
            name,
            nickName,
            unique_key,
            roleId,
            useragent,
            signed,
            foreigner,
            age
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

        // console.log(certificationInfo);
        const { unique_key, unique_in_site, name, birthday, foreigner } = certificationInfo;
        /* console.log("==========버그 수정============")
        console.log(name);
        console.log(foreigner);
        console.log('이름 : ' + name + ', 외국인 : ' + foreigner + ', 나이 : ' + parseInt(today.getFullYear()) - parseInt(birthday.substr(0,4)));
        console.log('Unique key : ' + unique_key + ', unique_in_site : ' + unique_in_site); */

        const exJoin = await User.findOne({ where : { unique_key }});
        if (exJoin){
            console.log("핸드폰 중복 인증 불가");
            return res.status(400).send("핸드폰 중복 인증 불가");
        }
        console.log("핸드폰 인증 성공");
        return res.status(201).send({ unique_key : unique_key, name : name , foreigner : foreigner, age : parseInt(today.getFullYear()) - parseInt(birthday.substr(0,4)) + 1});

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
            console.log(`${user.nickName}님 로그인 성공`);
            return res.status(201).send(`${user.nickName}님 로그인 성공`);
        })
    })(req, res, next)
};

exports.logout = async (req, res) => {
    req.logout();
    req.session.destroy();
    console.log('로그아웃 성공');
    return res.status(200).send('로그아웃 성공');
};

exports.me = async (req, res, next) => {
    try{
        if (req.isAuthenticated()) {
            // console.log("auth/me : true");
            return res.status(200).send(true);
        }
        // console.log("auth/me : false");
        return res.status(400).send(false);
    } catch (err) {
        console.log("auth/me error");
        next(err);
    }
};

exports.mail = async (req, res, next) => {
    try{
        const user_email = req.body.email;
        console.log("확인할 이메일 주소 형식 " + user_email);

        const certificationNumber = Math.floor(Math.random() * 1000000) + 100000; // 난수 발생
        if (certificationNumber > 1000000) {
            certificationNumber = certificationNumber -100000;
        }

        console.log("인증 번호 : " + certificationNumber);

        // 메일 발송 함수
        // console.log("내가 이메일 보내는 주소 : ", process.env.MAIL_EMAIL);
        // console.log("내가 이메일 보내는 비밀번호: " , process.env.MAIL_PASSWORD);
        const transporter = nodemailer.createTransport({
                service: 'Naver',
                host: 'smtp.naver.com',
                port: 587,
                auth: {
                    user: process.env.MAIL_EMAIL,
                    pass: process.env.MAIL_PASSWORD
                },
                requireTLS: true
            });

        const info = await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: user_email,
            subject: '이메일 인증 요청 메일입니다.',
            text: String(certificationNumber),
        });
        
        console.log("인증 번호 요청 확인 메일 보냄" + certificationNumber);
        await res.status(200).send({certificationNumber});
    } catch (err) {
        console.log("mail last error");
        next(err);
    }
}