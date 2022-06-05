const axios = require('axios')
const logger = require('../utils/logger')

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
        logger.logAxiosError(e)
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
        logger.logAxiosError(e)
        return null
    }
}

exports.joinChannel = async (channel_name) => {
    try {
        await axios({
            method: 'post',
            url: `${WLOGGER_BASE_URL}channels`,
            headers: { "Content-Type": "application/json" },
            data: { channel_name: channel_name, actively_logged: true }
        })
    } catch (e) {
        logger.logAxiosError(e)
    }
}

opt_user = async (user_name, b) => {
    let response
    try {
        response = await axios({
            method: 'get',
            url: `${WLOGGER_BASE_URL}users/${user_name}`,
            headers: { "Content-Type": "application/json" }
        })
        try {
            if (response.data.exists) {
                await axios({
                    method: 'patch',
                    url: `${WLOGGER_BASE_URL}users/${user_name}`,
                    headers: { "Content-Type": "application/json" },
                    data: { opt_out: b }
                })
            } else {
                await axios({
                    method: 'post',
                    url: `${WLOGGER_BASE_URL}users`,
                    headers: { "Content-Type": "application/json" },
                    data: { user_login: user_name, opted_out: b }
                })
            }
        } catch (e) {
            logger.logAxiosError(e)
            return false
        }
    } catch (e) {
        logger.logAxiosError(e)
        return false
    }
    return true
}

exports.optOutUser = async (user_name) => {
    return await opt_user(user_name, true)
}

exports.optInUser = async (user_name) => {
    return await opt_user(user_name, false)
}