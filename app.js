const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const multer = require('multer');
const storage = multer.diskStorage({
    // 配置上传目录
    destination: (req, file, cb) => {
        cb(null, 'public/upload')
    },
    // 修改上传的文件名
    filename: (req, file, cb) => {
        // 根据时间戳生成文件名
        const fileName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        file.restName = fileName;
        req.body = file;
        cb(null, fileName);
    }
});

const upload = multer({ storage });

const jwt = require('jsonwebtoken');
// 专门用于验证token的第三方中间件 express-jwt
// const expressJWT = require('express-jwt');
require('./config/mongoose.js')();

const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.engine('html', require('ejs').__express)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 配置expressJWT
/* app.use(expressJWT({
    // 设置解析口令
    secret: 'react',
    // 设置加密方式：SHA256 在 express-jwt 里面叫做 HS256
    algorithms: ['HS256']
}).unless({
    // 设置不需要验证token的路径标识符
    path: ['/', '/manager/login', '/favicon.ico']
})); */

// token 拦截并验证
app.use('/manager', (req, res, next) => {
    if (req.url === '/login') return next();

    const _token = req.headers.authorization;
    const tokenError = { status: 1, meta: { msg: '无效 token' } };


    if (!_token) return res.json(tokenError);


    const token = _token.split(' ')[1];
    jwt.verify(token, 'react', (err, data) => {
        if (err) return res.json(tokenError);
        next();
    });
});

app.use('/manager', indexRouter(upload));

app.use(function (req, res) {
    res.render('index');
});

module.exports = app;
