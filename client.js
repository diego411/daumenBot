const logger = require("./logger")
const { ChatClient } = require("dank-twitch-irc")
const mySecret = process.env['OAUTH']
import { ChatClient, AlternateMessageModifier, SlowModeRateLimiter, IgnoreUnhandledPromiseRejectionsMixin } from "dank-twitch-irc" 

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
const cdMap = {
    "LOW": 10000,
    "MID": 5000,
    "HIGH": 2000,
    "VERYHIGH": 1000
}
let channelsConfig = [];

const init = (channelConfigs) => {
    client.connect()
    for (channelConfig of channelConfigs) {
        this.join(channelConfig)
        logger.log(`joined ${channelConfig.channel}`)
    }
}

const say = async (channel, msgText) => {
    const channelConfig = getChannelConfigForChannel(channel)
    if (!channelConfig) return
    if (!channelConfig.talkInOnline && await twitchapi.isLive(channel)) return;
    if (cd[channel].fire()) {
        try {
            await client.say(channel, vary(msgText))
        } catch (e) {
            logger.log(e)
        }
    }
}

const sayEverywhere = async (channels, msgText) => {
    channels.map(async (channel) => await say(channel, msgText))
}

const meEverywhere = async (channels, msgText) => {
    channels.map(async channel => await me(channel, msgText))
}

const me = async (channel, msgText) => {
    const channelConfig = getChannelConfigForChannel(channel)
    if (!channelConfig) return
    if (!channelConfig.talkInOnline && await twitchapi.isLive(channel)) return;
    if (cd[channel].fire()) {
        try {
            await client.me(channel, msgText)
            } catch  (e) {
                logger.log(e)
            }
        }
    }
    
const on = (event, func) => {
    client.on(event, func)
}

const join = (channelConfig) => {
    try {
        client.join(channelConfig.channel)

        channelsConfig = channelsConfig.filter(config => config.channel != channelConfig.channel)
        channelsConfig.push(channelConfig)

        cd[channelConfig.channel] = new cooldown(cdMap[channelConfig.spam])
    } catch (e) {
        logger.log(e)
    }
}

const part = (channel) => {
    client.part(channel)
    delete cd[channel]
    channelsConfig = channelsConfig.filter(config => channel != config.channel)
}

function vary(msgText) {
    i++;
    if (i % 2 == 0) return `${msgText} ⠀`;
    else return `${msgText}`;
}

function getChannelConfigForChannel(channelname) {
    for (channelConfig of channelsConfig) {
        if (channelConfig.channel.includes(channelname)) return channelConfig
    }
    return null
}

exports.init = init
exports.say = say
exports.sayEverywhere = sayEverywhere
exports.meEverywhere = meEverywhere
exports.me = me
exports.on = on
exports.join = join
exports.part = part