const RESPONSE_TYPE = require('../client').RESPONSE_TYPE

module.exports = class Event {

    constructor(
        name,
        code = () => null,
        arg_flags = ['sender_name'],
        trigger = () => false,
        response_callback = RESPONSE_TYPE.SAY
    ) {
        this.name = name
        this.code = code
        this.arg_flags = arg_flags
        this.trigger = trigger
        this.response_callback = response_callback
        this.args
    }

    static construct_from(params) {
        if (!params.name) return null
        return new this(params.name, params.code, params.arg_flags, params.trigger, params.response_callback)
    }

    injectArgs(args) {
        this.args = args
    }

    output() {
        return this.code(this.args)
    }
}