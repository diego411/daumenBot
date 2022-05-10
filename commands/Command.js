const RESPONSE_TYPE = require('../client').RESPONSE_TYPE

module.exports = class Command {

    constructor(
        name,
        code = () => null,
        arg_flags = ['sender_name'],
        trigger = (command_name) => command_name === this.name,
        cooldown = 10000,
        response_callback = RESPONSE_TYPE.SAY,
        channels = (msg) => msg.channelName,
        adminRequired = false,
        tagUser = true
    ) {
        this.name = name
        this.code = code
        this.arg_flags = arg_flags
        this.trigger = trigger
        this.cooldown = cooldown
        this.response_callback = response_callback
        this.channels = channels
        this.adminRequired = adminRequired
        this.tagUser = tagUser
    }

    static construct_from(params) {
        if (!params.name) return null
        return new this(params.name, params.code, params.arg_flags, params.trigger, params.cooldown, params.response_callback, params.channels, params.adminRequired, params.tagUser)
    }

    injectArgs(args) {
        this.args = args
    }

    execute() {
        if (this.adminRequired && !isAdmin(this.args['senderUserID'])) return null
        return this.code(this.args)
    }
}

const isAdmin = (id) => {
    return (id === '124776535' || id === '150819483' || id === '275711366' || id === '151035078')
}