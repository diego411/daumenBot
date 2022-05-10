const logger = require('./utils/logger')
const twitchapi = require('./twitchapi')
const Cooldown = require('cooldown');
const Command = require('./commands/Command');
const Event = require('./events/Event')

let user_cd = {}
let channel_cd = {}

let db = require('./database')

exports.sendResponseFor = async (channel, responseReq) => {
    if (responseReq instanceof Command) executeCommandAndSendResponse(channel, responseReq)
    else if (responseReq instanceof Event) sendResponseForEvent(channel, responseReq)
}

const channel_cd_fire = async (channel) => {
    const config = await db.getConfig(channel)
    if (!config) return false

    if (!channel_cd[channel]) {
        channel_cd[channel] = new Cooldown(config.spam)
    }
    if (!config.talkInOnline && await twitchapi.isLive(channel)) return false
    return channel_cd[channel].fire()
}

const executeCommandAndSendResponse = async (channel, command) => {
    const user = command.args.senderUsername
    if (!user_cd[user]) {
        user_cd[user] = {}
        user_cd[user][command.name] = new Cooldown(command.cooldown)
    }
    if (!user_cd[user][command.name]) user_cd[user][command.name] = new Cooldown(command.cooldown)
    if (!user_cd[user][command.name].fire()) return

    if (!channel_cd_fire(channel)) return

    let output;
    try {
        output = await command.execute()
    } catch (e) {
        logger.log(`Execution of command: ${command.name} failed in [#${command.channel}]`)
        return
    }

    if (output) {
        const message = command.tagUser ? `@${user} ${output}` : output
        await command.response_callback(channel, message)
    }

    logger.log(`${user} executed command: ${command.name} in [#${channel}] with output: ${output}`)
}

const sendResponseForEvent = async (channel, event) => {
    if (!channel_cd_fire(channel)) return

    let output

    try {
        output = await event.output()
    } catch (e) {
        logger.log(`Getting output for event: ${event.name} failed`)
        console.log(e)
    }
    if (output) {
        await event.response_callback(channel, output)
        logger.log(`Responded to event ${event.name} in [#${channel}] with output: ${output}`)
        return
    }

    logger.log(`Event ${event.name} produced no output in [#${channel}]`)
}