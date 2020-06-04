'use strict';

const healthCheckerInit = require('./init');
const HEALTH_CHECK_LOG = process.env.HEALTH_CHECK_LOG;

const INSTANCE = async function (req, res) {
    let payload = {status: "UP"};
    let isHealthy = true;
    let checkList = healthCheckerInit.checkList;
    let healthCheckTest = false;

    if (HEALTH_CHECK_LOG && HEALTH_CHECK_LOG.toLowerCase() === 'true') {
        healthCheckTest = true;
    }

    if (healthCheckTest) {
        console.log("HEALTH CHECK");
    }

    if (checkList.length > 0) {
        payload.detail = {};
    }

    try {
        for (const check of checkList) {
            payload.detail[check["category"]] = await onCheckHealth(check["checkHealthHandler"]);
            if (payload.detail[check["category"]].status === "DOWN") {
                payload.status = "DOWN";
                isHealthy = false;
            }
        }

        if (isHealthy) {
            sendHealthy(res, payload);
        } else {
            sendUnHealthy(res, payload);
        }
    } catch (e) {
        payload = {status: "DOWN"};
        console.error(e);
        sendUnHealthy(res, payload);
    } finally {
        if (healthCheckTest) {
            console.log('payload', payload);
        }
    }
}

INSTANCE.init = healthCheckerInit.init;


async function onCheckHealth(checkHealthHandler) {
    let status = {status: "DOWN"};

    await checkHealthHandler()
        .then(() => {
            status = {status: "UP"};
        })
        .catch();

    return status;
}

function sendHealthy(res, payload) {
    sendHealth(res, payload, 200);
}

function sendUnHealthy(res, payload) {
    sendHealth(res, payload, 503);
}

function sendHealth(res, payload, statusCode) {
    res.status(statusCode)
        .contentType('application/json')
        .send(JSON.stringify(payload));
}

module.exports = INSTANCE;
