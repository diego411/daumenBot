const { ChatClient, IgnoreUnhandledPromiseRejectionsMixin, AlternateMessageModifier } = require("dank-twitch-irc");
const logger = require("./utils/logger");
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

client.use(new IgnoreUnhandledPromiseRejectionsMixin())
client.use(new AlternateMessageModifier(client));

exports.init = async (channel_names) => {
    client.connect()
    channel_names.map(async channel_name => {
        await this.join(channel_name)
    })
}

const sendMessage = async (channel, msgText, me) => {
    let saidMessage = false
    while (!saidMessage) {
        try {
            if (me) await client.me(channel, msgText)
            else await client.say(channel, msgText)
            saidMessage = true
        } catch (e) {
            console.log(e)
        }
    }
}

exports.say = async (channel, msgText) => {
    sendMessage(channel, msgText, me = false)
}

exports.sayEverywhere = async (channels, msgText) => {
    channels.map(async (channel) => await this.say(channel, msgText))
}

exports.meEverywhere = async (channels, msgText) => {
    channels.map(async channel => await this.me(channel, msgText))
}

exports.me = async (channel, msgText) => {
    sendMessage(channel, msgText, me = true)
}

exports.on = (event, func) => {
    client.on(event, func)
}

exports.join = async (channel_name) => {
    try {
        await client.join(channel_name)
        logger.log(`Joined [#${channel_name}]`)
    } catch (e) {
        console.log(e)
    }
}

exports.ping = async () => {
    return client.ping();
}

exports.part = (channel_name) => {
    client.part(channel_name)
}

exports.RESPONSE_TYPE = {
    SAY: this.say,
    SAY_EVERYWHERE: this.sayEverywhere,
    ME: this.me,
    ME_EVERYWHERE: this.meEverywhere
}