const logger = require("./logger")
const { ChatClient } = require("dank-twitch-irc")
const mySecret = process.env['OAUTH']

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

const cooldown = require('cooldown');
const { channel } = require("tmi.js/lib/utils");

let cd = {};
//const cd = new cooldown(2000)
//const pyramidcd = new cooldown(15000)

const init = (channels) => {
    client.connect()
    client.joinAll(channels)
    for (let j = 0; j < channels.length; j++) {
        cd[channels[j]] = new cooldown(2000)
        logger.log(`joined ${channels[j]}`)
    }
}

const say = (channel, msgText) => {
    if (cd[channel].fire()) {
        try {
            client.say(channel, vary(msgText))
        } catch (e) {
            logger.log(e)
        }
    }
}

const sayEverywhere = (channels, msgText) => {
    channels.map(channel => say(channel, msgText))
}

const meEverywhere = (channels, msgText) => {
    channels.map(channel => me(channel, msgText))
}

const me = (channel, msgText) => {
    if (cd[channel].fire()) {
        try {
            client.me(channel, vary(msgText))
        } catch (e) {
            logger.log(e)
        }
    }
}

const on = (event, func) => {
    client.on(event, func)
}

const join = (channel) => {
    client.join(channel)
    cd[channel] = new cooldown(2000)
}

const part = (channel) => {
    client.part(channel)
    delete cd[channel]
}

function vary(msgText) {
    i++;
    if (i % 2 == 0) return `${msgText} ⠀`;
    else return `${msgText}`;
}

exports.init = init
exports.say = say
exports.sayEverywhere = sayEverywhere
exports.meEverywhere = meEverywhere
exports.me = me
exports.on = on
exports.join = join
exports.part = part