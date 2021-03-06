'use strict'
const winston = require('winston');
const fs = require('fs');
const logrotate = require('winston-logrotate');

const app = require('../app.js');

const logDir = app.logdir;

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const tsFormat = () => (new Date()).toLocaleTimeString();

// var rotateTransport = new winston.transports.Rotate({
//         file: logDir+'/log.log', // this path needs to be absolute
//         colorize: false,
//         timestamp: true,
//         json: false,
//         size: '100m',
//         keep: 5,
//         compress: true
// });

var logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'debug'
    }),
    new winston.transports.Rotate({
        file: logDir+'/log.log', // this path needs to be absolute
        colorize: false,
        timestamp: true,
        json: false,
        size: '100m',
        keep: 3,
        compress: true
    })
  ]
});


//     new (winston.transports.File)({
//       filename: `${logDir}/log.log`,
//       timestamp: tsFormat,
//       level: 'info'
//     })

// logger.add(rotateTransport)

logger.log('info','Logging initialized!');

exports.log = function(level,msg){
  logger.log(level,msg)
}