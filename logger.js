const winston = require('winston');
const httpConext = require('express-http-context')

winston.remove(winston.transports.Console);
winston.add(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => `[${info.level} ${info.timestamp}] ${info.message}`)
    )
}));

function addReqId(message) {
    var id = httpConext.get('reqId');
    if (typeof id == 'undefined') {
        return message;
    } else {
        return `${id} - ${message}`;
    }
}

var logger = {
    log: function (level, message) {
        winston.log(level, addReqId(message))
    },
    error: function(message) {
        winston.error(addReqId(message))
    },
    warn: function(message) {
        winston.warn(addReqId(message))
    },
    info: function(message) {
        winston.info(addReqId(message))
    },
}


module.exports = logger