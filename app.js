// ip 주소 얻는 방법 - cmd 창 => ipconfig => IPV4 주소값
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config(); // process.env => .env 파일을 읽음

const { sequelize } = require('./models');
const passportConfig = require('./passport');
const authRouter = require('./routers/auth');
const userRouter = require('./routers/user');
const { isLoggedIn } = require('./middlewares');

const app = express();
passportConfig(); // 패스포트 설정
app.set('port', process.env.PORT || 8001); // 전역적으로 port 번호 생성

sequelize.sync({ force: false })
        .then(() => {
            console.log('데이터베이스 연결 성공');
        })
        .catch((err) => {
            console.log(err);
        });
app.use(morgan('dev')); // 추가적인 로그
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET)); // 암호화된 서명 처리를 위한 임의의 문자 COOKIE_SECRET 사용
app.use(session({
    resave: false, // 수정 사항 시 세션 다시 설정 여부
    saveUninitialized: false, // 세션에 저장할 사항 없더라도 처음부터 생성할 것인지
    secret: process.env.COOKIE_SECRET, // cookieParser와 같은 이름 사용 권장
    cookie: {
        httpOnly: true, // 클라이언트 세션 확인 x
        secure: false, // http 환경 아니더라도 사용 가능
    },
}));
app.use(passport.initialize()); // req.session 객체에 passport 정보 저장
app.use(passport.session()); // express-session에서 객체 생성

app.use('/api/auth', authRouter);
app.use('/api/user', isLoggedIn, userRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    console.log('error call : ', res.locals.message);
    res.send('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});