const path = require('path')
const fs = require('fs')

const Event = require('./Event')
const responseController = require('../responsecontroller')

const argsBuilder = require('../utils/argsbuilder')

let events = []

exports.init = async () => {
    const instances_dir = path.join(__dirname, 'instances')
    const files = fs.readdirSync(instances_dir)

    for (file of files) {
        try {
            const event = Event.construct_from(require(path.join(instances_dir, file)))
            if (event) events.push(event)
        } catch (e) {
            console.log(e)
        }
    }
}

this.init()

exports.handle = async (msg) => {
    if (msg.senderUsername === 'daumenbot') return;

    events.map(event => {
        if (event.trigger(msg)) {
            const args = argsBuilder.buildArgsForEvent(msg, event.arg_flags)
            event.injectArgs(args)
            responseController.sendResponseFor(msg.channelName, event)
            return
        }
    })
}