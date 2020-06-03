'use strict';

const INSTANCE = {};

INSTANCE.checkList = [];

INSTANCE.init = function (list) {
    INSTANCE.checkList = list;
}

module.exports = INSTANCE;
