const logger = require("./logger")
const { ChatClient } = require("dank-twitch-irc")
const mySecret = process.env['OAUTH']

let client = new ChatClient({
    username: `daumenbot`,
    password: mySecret,
    maxChannelCountPerConnection: 10,
    connectionRateLimits: {
        parallelConnections: 20,
        releaseTime: 2000,
    },
});

let i = 0

const cooldown = require('cooldown');
const cd = new cooldown(2000)
//const pyramidcd = new cooldown(15000)

const init = (channels) => {
    client.connect()
    client.joinAll(channels)
    for (let j = 0; j < channels.length; j++) logger.log(`joined ${channels[j]}`)
}

const say = (channel, msgText) => {
    if (cd.fire()) client.say(channel, vary(msgText))
}

const me = (channel, msgText) => {
    if (cd.fire()) client.me(channel, vary(msgText))
}

const on = (event, func) => {
    client.on(event, func)
}

const join = (channel) => {
    client.join(channel)
}

const part = (channel) => {
    client.part(channel)
}

function vary(msgText) {
    i++;
    if (i % 2 == 0) return `${msgText} ⠀`;
    else return `${msgText}`;
}

exports.init = init
exports.say = say
exports.me = me
exports.on = on
exports.join = join
exports.part = part