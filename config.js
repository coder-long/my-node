const fs = require('fs');
const {json} = require("express");

let configFile = fs.readFileSync('./config.json', {encoding: 'utf-8'});
let configObj = JSON.parse(configFile)

const config = {
    syncGetConfig: function (props) {
        if (configObj.hasOwnProperty(props)) {
            return configObj[props]
        } else {
            return `尚不存在该配置项:${props}`
        }
    },
    getConfig: function (props) {
        if (configObj.hasOwnProperty(props)) {
            return new Promise((resolve, reject) => {
                resolve(configObj[props])
            })
        } else {
            return `尚不存在该配置项:${props}`
        }
    }
}

module.exports = config
