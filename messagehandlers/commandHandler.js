const ChannelConfig = require('../ChannelConfig')
const Command = require('./Command')
const commandExecutor = require('./commandexecutor')
const logger = require('../logger')

const twitchapi = require('../twitchapi');

const PREFIX = '+'
let db;

exports.init = (database) => {
    db = database
}

exports.handle = async (msg, client) => {
    if (msg.displayName === "daumenbot") return;

    let [command_name, ...raw_args] = msg.messageText.slice(PREFIX.length).split(/ +/g);
    let code, args, user, name, adminRequired, tagUser, client_callback
    args = {}
    user = msg.senderUsername
    channel = msg.channelName
    adminRequired = false
    tagUser = true
    client_callback = client.say

    switch (command_name) {
        case "ping": {
            name = "ping"

            code = async () => {
                let dateNow = Date.now()
                await client.ping();
                let dateAfterPing = Date.now()
                return `Ping to tmi is approx. ${dateAfterPing - dateNow} ms`
            }

            break
        }
        case "join": {
            name = "join"
            adminRequired = true

            if (raw_args.length == 0) {
                code = () => 'Please specify a channel to join'
                break
            }

            channel_name = raw_args[0]

            if (!await twitchapi.getUserId(channel_name)) {
                code = () => 'Given channel probably does not exist or is banned'
                break
            }

            args = {
                user_id: msg.senderUserID,
                channel_name: raw_args[0],
                config: ChannelConfig.construct_from(raw_args)
            }

            if (!args.config) {
                code = () => `Given parameter could not be parsed`
                break
            }

            code = async ({ args: args }) => {
                db.addConfig(args.config)
                client.join(args.config)
                return `joined ${channel_name}`
            }

            break
        }
        case "part": {
            name = "part"
            adminRequired = true

            if (raw_args.length == 0) {
                code = () => 'Please specify a channel to part from'
                break
            }

            args = {
                user_id: msg.senderUserID,
                channel_name: raw_args[0]
            }

            code = async ({ args: args }) => {
                await db.removeConfig(args.channel_name)
                client.part(args.channel_name)
                return `left ${args.channel_name}`
            }

            break
        }
        case "quit": {
            client.say(msg.channelName, `quitting`).then(() => {
                process.exit(1);
            })
            break
        }
        case "get": {
            name = "get"
            adminRequired = true

            if (!raw_args[0]) {
                code = () => `No key specified`
                break
            }

            args = {
                user_id: msg.senderUserID,
                key: raw_args[0]
            }

            code = ({ args: args }) => {
                db.get(args.key).then(logger.log)
                return `Logged value for key: ${args.key} to console`
            }

            break
        }
        case "test": {
            name = "test"

            code = () => `FeelsDankMan`

            break
        }
        case "say": {
            name = "say"
            adminRequired = true
            tagUser = false

            if (raw_args.length === 0) {
                code = () => 'No message provided'
                break
            }

            args = {
                user_id: msg.senderUserID,
                message: raw_args.join(' ')
            }

            code = ({ args: args }) => args.message

            break
        }
        case "sayeverywhere": {
            name = "sayeverywhere"
            adminRequired = true
            tagUser = false
            client_callback = client.sayEverywhere

            if (raw_args.length === 0) {
                code = () => 'No message provided'
                break
            }

            args = {
                user_id: msg.senderUserID,
                message: raw_args.join(' ')
            }

            code = ({ args: args }) => args.message

            channel = await db.getChannelNames()

            break
        }
        case "channellist": {
            name = "channellist"

            code = async () => {
                const channel_names = await db.getChannelNames()
                return `channellist: ${JSON.stringify(channel_names)}`
            }

            break
        }
        case "uid": {
            name = "uid"

            args = {
                command_user: msg.senderUsername,
                given_user: raw_args[0]
            }

            code = async ({ args: args }) => {
                const id = args.given_user ? await twitchapi.getUserId(args.given_user) : await twitchapi.getUserId(args.command_user)
                return `${id ? id : "user does not exist or is banned"}`
            }

            break
        }
        case "islive": {
            name = "islive"

            args = {
                command_user: msg.senderUsername,
                given_user: raw_args[0]
            }

            code = async ({ args: args }) => {
                const channel_name = args.given_user ? args.given_user : args.command_user
                const isLive = await twitchapi.isLive(channel_name)
                return `channel is ${isLive ? `` : `not`} live`
            }

            break
        }
        case "isbanphrased": {
            name = "isbanphrased"

            if (raw_args.length == 0) {
                code = () => `Please specify a message for the banphrase check`
                break
            }

            args = {
                message: raw_args[0]
            }

            code = async ({ args: args }) => {
                return `That message is ${await twitchapi.isBannedPhrase(args.message) ? `` : `not`} banphrased`
            }

            break
        }
        default: return
    }

    const command = new Command(name, code, args, channel, user, adminRequired, tagUser)
    commandExecutor.execute(command, client_callback)
}

exports.isCommand = (msg) => {
    return msg.messageText.charAt(0) === PREFIX
}