const axios = require('axios');

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
        console.log(e)
        return null
    }
}