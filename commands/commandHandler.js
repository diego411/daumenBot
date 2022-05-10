const path = require('path')
const fs = require('fs')

const Command = require('./Command')
const responseController = require('../responsecontroller')

const argsBuilder = require('../utils/argsbuilder')

const PREFIX = '+'

let commands = []

exports.init = () => {
    const instances_dir = path.join(__dirname, 'instances')
    const files = fs.readdirSync(instances_dir)

    for (file of files) {
        try {
            const command = Command.construct_from(require(path.join(instances_dir, file)))
            if (command) commands.push(command)
        } catch (e) {
            console.log(e)
        }
    }

    return this
}

this.init()

exports.handle = async (msg) => {
    if (msg.displayName === "daumenbot") return;

    let [command_name, ..._] = msg.messageText.slice(PREFIX.length).split(/ +/g);

    commands.map(async command => {
        if (command.trigger(command_name)) {
            const args = argsBuilder.buildArgsForCommand(msg, command.arg_flags)
            command.injectArgs(args)
            responseController.sendResponseFor(await command.channels(msg), command)
            return
        }
    })
}

exports.isCommand = (msg) => {
    return msg.messageText.charAt(0) === PREFIX
}