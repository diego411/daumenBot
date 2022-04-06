const Database = require("@replit/database");
let db;

const twitchapi = require('./twitchapi')

if (process.env.NODE_ENV !== 'production') db = new Database(process.env["DB_URL"])
else db = new Database();

const cachedKeys = ["channels", "debugchannels"]
let cachedValues = {};

exports.init = async () => {
    await initCache()
    return this
}

const initCache = async () => {
    for (key of cachedKeys) {
        let value = await db.get(key)
        cachedValues[key] = value
    }
}

exports.get = async (key) => {
    let val
    try {
        val = await db.get(key)
    } catch (e) {
        console.log(e)
        return null
    }
    return val
}

exports.getChannelNames = () => {
    let channelConfigs = this.getChannelConfigs()
    return channelConfigs.map(config => config.channel)
}

exports.getChannelConfigs = () => {
    return process.env.NODE_ENV === "production"
        ? cachedValues['channels']
        : cachedValues['debugchannels']
}

exports.getWeebMap = async () => {
    return await db.get('weebMap')
}

exports.getWeebTermFor = async (letter) => {
    const weebMap = await db.get('weebMap')
    return weebMap[letter]
}

exports.addWeebTerm = async (term) => {
    const weebMap = await db.get('weebMap')
    const firstChar = term.charAt(0).toLowerCase()
    if (weebMap[firstChar] != null) {
        weebMap[firstChar] = weebMap[firstChar].filter(weebTerm => weebTerm !== term)
        weebMap[firstChar].push(term)
        db.set('weebMap', weebMap)
    }
}

exports.addWeebLog = async (userID, userName, msg) => {
    if (await twitchapi.isBannedPhrase(msg)) msg = "[BANPHRASED]"
    const userMap = await db.get('userdata')
    let userData = userMap[userID]
    if (userData) {
        userData.weebLogs.push(msg)
    } else {
        userData = {
            id: userID,
            userName: userName,
            weebLogs: [msg]
        }
    }
    userMap[userID] = userData
    await db.set('userdata', userMap)
}

exports.getRandomWeebLine = async (userName) => {
    const userID = await twitchapi.getUserId(userName)
    const userMap = await db.get('userdata')

    if (!userMap[userID]) return
    return userMap[userID].weebLogs[Math.floor(Math.random() * userMap[userID].weebLogs.length)]
}

exports.getWeebMsgCount = async (userName) => {
    const userID = await twitchapi.getUserId(userName)
    const userMap = await db.get('userdata')
    return userMap[userID] ? userMap[userID].weebLogs.length : 0
}

exports.removeWeebTerm = async (term) => {
    const weebMap = await db.get('weebMap')
    const firstChar = term.charAt(0)
    if (weebMap[firstChar]) weebMap[firstChar] = weebMap[firstChar].filter(weebTerm => weebTerm !== term)
    db.set('weebMap', weebMap)
}

exports.addConfig = async (config) => {
    if (process.env.NODE_ENV !== "production") {
        await db.get('debugchannels').then(channels => db.set('debugchannels', [...channels, config]))
    } else {
        await db.get('channels').then(channels => db.set('channels', [...channels, config]))
    }
}

exports.removeConfig = async (channelName) => {
    if (process.env.NODE_ENV !== "production") {
        db.get('debugchannels').then((channels) => {
            db.set('debugchannels', channels.filter(channel => channel.channel !== channelName))
        })
    } else {
        db.get('channels').then((channels) => {
            db.set('channels', channels.filter(channel => channel.channel !== channelName))
        })
    }
}