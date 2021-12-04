const path = require('path');
const mongoose = require('mongoose');
const Schema = require('./Scheam');
const config = require('../config');
const connectString = config.syncGetConfig('mongoConnection');
let connectState = false;


let mongodb = {
    connect() {
        mongoose.connect(connectString, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
            if (err) {
                console.log('连接失败');
                connectState = false;
            } else {
                console.log('连接成功', connectString);
                connectState = true;
            }
        })
    },
    disconnect() {
        mongoose.disconnect(err => {
            console.log(err);
            connectState = false;
        })
    },
    connectState() {
        return connectState;
    },
    //添加用户
    insertUser(user) {
        return new Promise((resolve, reject) => {
            if (user.hasOwnProperty('username') && user.hasOwnProperty('password')) {
                const user = mongoose.model('user', Schema.userSchema);
                user.create(user, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve()
                    }
                });
            } else {
                reject('无效输入.')
            }
        })
    },
    validateLogin(userInfo) {
        const user = mongoose.model('users', Schema.userSchema);
        return new Promise((resolve, reject) => {
            user.find(userInfo, (err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            })
        })
    }
};

let before = function (fn, beforeFn) {
    return function () {
        if (beforeFn.apply(this, arguments)) {
            return fn.apply(this, arguments)
        } else {
            return Promise.reject('数据库未连接.')
        }
    }
}

Object.keys(mongodb).forEach(funcName => {
    if (funcName !== 'connectState' && funcName !== "disconnect" && funcName !== 'connect') {
        mongodb[funcName] = before(mongodb[funcName], mongodb.connectState)
    }
})

module.exports = mongodb
