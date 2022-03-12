const axios = require('axios');

const OAUTH_TOKEN = process.env["OAUTH"]
const CLIENT_ID = process.env["CLIENT_ID"]

const HELIX_USERS_URL = "https://api.twitch.tv/helix/users"
const HELIX_STREAMS_URL = "https://api.twitch.tv/helix/streams"

exports.getUserId = async (username) => {
    let data;
    try {
        data = await axios.get(`${HELIX_USERS_URL}?login=${username}`, {
            headers: {
                'Authorization': `Bearer ${OAUTH_TOKEN}`,
                'Client-Id': CLIENT_ID
            }
        })
    } catch (e) {
        return "user doesnt exist"
    }
    if (data.data.data.length > 0) return data.data.data[0].id
    else return "user doesnt exist"
}

exports.isLive = async (username) => {
    let uid = await this.getId(username)

    let response = await axios.get(`${HELIX_STREAMS_URL}?user_id=${uid}`, {
        headers: {
            'Authorization': `Bearer ${OAUTH_TOKEN}`,
            'Client-Id': CLIENT_ID
        }
    })
    return response.data.data.length != 0
}