const axios = require('axios');

const WLOGGER_BASE_URL = `${process.env["WLOGGER_URL"]}api/v1/`

exports.statsForUser = async (user_name) => {
    let response
    try {
        response = await axios({
            method: 'get',
            url: `${WLOGGER_BASE_URL}users/${user_name}`,
            headers: { "Content-Type": "application/json" }
        })
        return response.data
    } catch (e) {
        console.log(e)
        return null
    }
}

exports.statsForChannel = async (channel_name) => {
    let response
    try {
        response = await axios({
            method: 'get',
            url: `${WLOGGER_BASE_URL}channels/${channel_name}`,
            headers: { "Content-Type": "application/json" }
        })
        return response.data
    } catch (e) {
        console.log(e)
        return null
    }
}

exports.joinChannel = async (channel_name) => {
    let response
    try {
        response = await axios({
            method: 'post',
            url: `${WLOGGER_BASE_URL}channels`,
            headers: { "Content-Type": "application/json" },
            data: { channel_name: channel_name, actively_logged: true }
        })
    } catch (e) {
        console.log(e)
    }
}