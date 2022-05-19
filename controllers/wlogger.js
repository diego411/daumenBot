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