const Database = require("@replit/database");
let db;

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