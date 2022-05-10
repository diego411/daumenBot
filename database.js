const db_client = require('redis').createClient()
db_client.on('error', (err) => console.log('Redis Client Error', err));

const NODE_ENV = process.env.NODE_ENV
const CONFIGS_KEY = NODE_ENV === "production"
    ? "channel_configs"
    : "debug_channel_configs"

exports.connect = async () => {
    await db_client.connect()
}

exports.get = async (key) => {
    let val
    try {
        val = JSON.parse(await db_client.get(key))
    } catch (e) {
        console.log(e)
        return null
    }
    return val
}

exports.getChannelNames = async () => {
    let channelConfigs = await this.getChannelConfigs()
    return channelConfigs.map(config => config.channel_name)
}

exports.getChannelConfigs = async () => {
    return await JSON.parse(await db_client.get(CONFIGS_KEY)) || []
}

exports.getConfig = async (channel_name) => {
    let channel_configs = JSON.parse(await db_client.get(CONFIGS_KEY))

    for (config of channel_configs) {
        if (config.channel_name == channel_name)
            return config
    }

    return null
}

exports.addConfig = async (config) => {
    let channel_configs = await db_client.get(CONFIGS_KEY)
    if (!channel_configs) {
        db_client.set(CONFIGS_KEY, JSON.stringify([config]))
        return
    }
    channel_configs = JSON.parse(channel_configs).filter(channel_config => channel_config.channel_name !== config.channel_name)
    db_client.set(CONFIGS_KEY, JSON.stringify([...channel_configs, config]))
}

exports.removeConfig = async (channel_name) => {
    let channel_configs = await db_client.get(CONFIGS_KEY)
    if (!channel_configs) return
    channel_configs = JSON.parse(channel_configs)
    db_client.set(CONFIGS_KEY, JSON.stringify(channel_configs.filter(config => config.channel_name !== channel_name)))
}