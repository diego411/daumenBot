const logger = require('../logger')

const Cooldown = require('cooldown');
const per_user_cooldown = 5000

let cd = {};

exports.execute = async (command, client_callback) => {
    if (!cd[command.user]) cd[command.user] = new Cooldown(per_user_cooldown)
    if (!cd[command.user].fire()) return

    let output;
    try {
        output = await command.execute()
    } catch (e) {
        logger.log(`Execution of command: ${command.name} failed in [#${command.channel}]`)
        return
    }

    if (output) {
        const message = command.tagUser ? `@${command.user} ${output}` : output
        await client_callback(command.channel, message)
    }

    logger.log(`${command.user} executed command: ${command.name} in [#${command.channel}] with output: ${output}`)
}