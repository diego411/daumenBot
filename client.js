const { ChatClient } = require("dank-twitch-irc");
let client = new ChatClient({
    username: `daumenbot`,
    password: `oauth:jvecqvn83vdoh7kq7i9ipyxh35yum9`,
    maxChannelCountPerConnection: 10,
    connectionRateLimits: {
        parallelConnections: 20,
        releaseTime: 2000,
    },
});
let i = 0
const fs = require('fs');
const channelsFile = './db/channels.txt';
const channelOptions = fs.readFileSync(channelsFile).toString().split('"').filter(i => i != null).join('').split(' ')

const cooldown = require('cooldown')
const cd = new cooldown(2000)
//const pyramidcd = new cooldown(15000)

const init = () => {
    client.connect();
    client.joinAll(channelOptions)
}

const say = (channel, msgText) => {
    if (cd.fire()) client.say(channel, vary(msgText))
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
exports.on = on
exports.join = join
exports.part = part