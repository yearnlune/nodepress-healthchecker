'use strict';

const init = require('./init').init;

let checkList = [];

module.exports = async function (req, res) {
    let payload = {status: "UP"};
    let healthCheckTest = Boolean(process.env.HEALTH_CHECK_LOG) || false
    let isHealthy = true;
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
        console.error(e);
        sendUnHealthy(res, {status: "DOWN"});
    }
}

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

