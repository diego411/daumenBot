const Database = require("@replit/database");
let db;

if (process.env.NODE_ENV !== 'production') db = new Database(process.env["DB_URL"])
else db = new Database();

const cachedKeys = ["channels", "debugchannels"]
let cachedValues = {};

exports.init = async () => {
    await initCache()
}

const initCache = async () => {
    for (key of cachedKeys) {
        let value = await db.get(key)
        cachedValues[key] = value
    }
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