var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')
const mongdb = require('../mododb/index')

let userList = [];

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


router.post('/login', (req, res) => {
    mongdb.validateLogin(req.body.userInfo).then(result => {
        let signkey = 'mes_qdhd_mobile';
        const token = 'Bearer' + jwt.sign({
                username: username
            },
            signkey,
            {
                expiresIn: 3600 * 24 * 3,//3天
            }
        );
        console.log('token', token);
        res.json(token);
    }, err => {
        res.json(err)
    })
})
//秘钥


/*
*
*
* //秘钥
var signkey = 'mes_qdhd_mobile';
//生成token
const setToken = function (username) {
    return new Promise((resolve, reject) => {
        const token = jwt.sign({
            username: username
        }, signkey, { expiresIn:  60 * 60 * 24 * 3 });
        // let info = jwt.verify(token.split(' ')[1], signkey)
        // console.log(info);
        console.log('token',token);
        resolve(token);
    })
}
//验证token
const verToken = function (token) {
    return new Promise((resolve, reject) => {
        var info = jwt.verify(token, signkey ,(error, decoded) => {
            if (error) {
              console.log(error.message)
              return
            }
            console.log(decoded)
          });
        resolve(info);
    })
}
*
* */

module.exports = router;
