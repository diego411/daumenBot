const logger = require("./logger")
const { ChatClient, IgnoreUnhandledPromiseRejectionsMixin } = require("dank-twitch-irc")
const mySecret = process.env['OAUTH']

const twitchapi = require('./twitchapi')

let client = new ChatClient({
    username: `daumenbot`,
    password: `oauth:${mySecret}`,
    maxChannelCountPerConnection: 10,
    connectionRateLimits: {
        parallelConnections: 20,
        releaseTime: 2000,
    },
});

let i = 0

client.use(new IgnoreUnhandledPromiseRejectionsMixin())
const cooldown = require('cooldown');

let cd = {};
let channelsConfig = [];

exports.init = (channelConfigs) => {
    client.connect()
    for (channelConfig of channelConfigs) {
        this.join(channelConfig)
        logger.log(`joined ${channelConfig.channel_name}`)
    }
}

exports.say = async (channel, msgText) => {
    const channelConfig = getChannelConfigForChannel(channel)
    if (!channelConfig) return
    if (!channelConfig.talkInOnline && await twitchapi.isLive(channel)) return;
    if (!cd[channel].fire()) return

    let saidMessage = false
    while (!saidMessage) {
        try {
            await client.say(channel, vary(msgText))
            saidMessage = true
        } catch (e) {
            console.log(e)
        }
    }
}

exports.sayEverywhere = async (channels, msgText) => {
    channels.map(async (channel) => await this.say(channel, msgText))
}

exports.meEverywhere = async (channels, msgText) => {
    channels.map(async channel => await this.me(channel, msgText))
}

exports.me = async (channel, msgText) => {
    const channelConfig = getChannelConfigForChannel(channel)
    if (!channelConfig) return
    if (!channelConfig.talkInOnline && await twitchapi.isLive(channel)) return;
    if (cd[channel].fire()) {
        try {
            await client.me(channel, msgText)
        } catch (e) {
            console.log(e)
        }
    }
}

exports.on = (event, func) => {
    client.on(event, func)
}

exports.join = (channelConfig) => {
    try {
        client.join(channelConfig.channel_name)

        channelsConfig = channelsConfig.filter(config => config.channel_name != channelConfig.channel_name)
        channelsConfig.push(channelConfig)

        cd[channelConfig.channel_name] = new cooldown(channelConfig.spam)
    } catch (e) {
        console.log(e)
    }
}

exports.ping = async () => {
    return client.ping();
}

exports.part = (channel) => {
    client.part(channel)
    delete cd[channel]
    channelsConfig = channelsConfig.filter(config => channel != config.channel)
}

function vary(msgText) {
    i++;
    if (i % 2 == 0) return `${msgText} ⠀`;
    else return `${msgText}`;
}

function getChannelConfigForChannel(channel_name) {
    for (channelConfig of channelsConfig) {
        if (channelConfig.channel_name.includes(channel_name)) return channelConfig
    }
    return null
}