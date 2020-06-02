let healthChecker = require('./healthCheck');

module.exports = function (list) {
    healthChecker.checkList = list;
}
