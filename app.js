var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let cors = require('cors');
const expressJwt = require('express-jwt')
const mongodb = require('./mododb');
mongodb.connect();


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);


//验证token是否过期并规定哪些路由不用验证
app.use(expressJwt({
    secret: 'mes_qdhd_mobile',
    algorithms: ['HS256'],
}).unless({
    path: ['/', '/user/login']//除了这个地址，其他的URL都需要验证
}))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token...');
    }
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


/*
*
*
*
* const jwt = require('jsonwebtoken');

var user = require('./user.js');

// 解析token获取用户信息
app.use(function(req, res, next) {
  var token = req.headers['authorization'];if(token == undefined){
        return next();
    }else{
     user.verToken(token).then((data)=> {
            req.data = data;
            return next();
        }).catch((error)=>{
      　　　　console.log(error);
            return next();
        })
    }
});

//验证token是否过期并规定哪些路由不用验证
app.use(expressJwt({
  secret: 'mes_qdhd_mobile'
}).unless({
  path: ['/', '/user/login']//除了这个地址，其他的URL都需要验证
}));
* */
module.exports = app;
