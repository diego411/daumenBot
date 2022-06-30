const axios = require('axios')
const logger = require('../utils/logger')

const OAUTH_TOKEN = process.env["OAUTH"]
const CLIENT_ID = process.env["CLIENT_ID"]

const HELIX_USERS_URL = "https://api.twitch.tv/helix/users"
const HELIX_STREAMS_URL = "https://api.twitch.tv/helix/streams"

const BANPHRASE_API_URL = "https://forsen.tv/api/v1/banphrases/test"
const PB2_BANPHRASE_API_URL = "https://paj.pajbot.com/api/channel/22484632/moderation/check_message?message=";

const getUserData = async (username) => {
    let response;
    try {
        response = await axios.get(`${HELIX_USERS_URL}?login=${username}`, {
            headers: {
                'Authorization': `Bearer ${OAUTH_TOKEN}`,
                'Client-Id': CLIENT_ID
            }
        })
        if (response.data.data.length > 0) return response.data.data[0]
    } catch (e) {
        logger.logAxiosError(e)
        return null
    }
    return null
}

exports.getUserId = async (username) => {
    const user_data = await getUserData(username)
    if (user_data) return user_data.id
    return null
}

exports.getProfilePicture = async (username) => {
    const user_data = await getUserData(username)
    if (user_data) return user_data.profile_image_url
    return null
}

exports.isLive = async (username) => {
    const uid = await this.getUserId(username)

    const response = await axios.get(`${HELIX_STREAMS_URL}?user_id=${uid}`, {
        headers: {
            'Authorization': `Bearer ${OAUTH_TOKEN}`,
            'Client-Id': CLIENT_ID
        }
    })
    return response.data.data.length != 0
}

exports.isBannedPhrase = async (phrase) => {
    let response, pb2response
    try {
        response = await axios.post(BANPHRASE_API_URL, { message: phrase }, { headers: { "Content-Type": "application/json" } })
        pb2response = await axios.get(PB2_BANPHRASE_API_URL + encodeURIComponent(phrase));
        return response.data.banned || pb2response.data.banned;
    } catch (e) {
        logger.logAxiosError(e)
        return null
    }
}
