const axios = require('axios')
const logger = require('../utils/logger')

const WED_BASE_URL = `${process.env["WED_URL"]}api/v1/`

exports.weebCheck = async (channel, message) => {
    let response
    try {
        response = await axios({
            method: 'get',
            url: `${WED_BASE_URL}hwis`,
            headers: { "Content-Type": "application/json" },
            data: { channel: channel, message: message }
        })
        return response.data
    } catch (e) {
        logger.logAxiosError(e)
        return null
    }
}

exports.addWhitelistTerm = async (term) => {
    try {
        await axios({
            method: 'post',
            url: `${WED_BASE_URL}whitelist`,
            headers: { "Content-Type": "application/json" },
            data: { term: term }
        })
    } catch (e) {
        logger.logAxiosError(e)
    }
}