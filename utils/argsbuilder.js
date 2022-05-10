const argsMap = {
    sender: {
        name: "senderUsername",
        id: "senderUserID"
    },
    channel: {
        name: "channelName",
        id: "channelID"
    },
    message: {
        text: "messageText",
        id: "messageID"
    },
    is: {
        action: "isAction",
        mod: "isMod",
    }
}

exports.buildArgsForCommand = (msg, argFlags) => {
    const raw_args = msg.messageText.slice(1).split(/ +/g)
    return buildArgs(msg, argFlags, raw_args)
}

exports.buildArgsForEvent = (msg, argFlags) => {
    const raw_args = msg.messageText.split(/ +/g)
    return buildArgs(msg, argFlags, raw_args)
}

const buildArgs = (msg, argFlags, raw_args) => {
    let args = {}
    argFlags.map(flag => {
        if (flag === "raw_args") {
            args["raw_args"] = raw_args
            return
        }

        const segments = flag.split('_').reverse()
        const n = segments.length

        if (n == 0) return

        let arg = argsMap[segments.pop()]
        for (let i = 1; i < n; i++) {
            arg = arg[segments.pop()]
        }

        if (typeof arg === 'string') args[arg] = msg[arg]
        else {

            for (const prop in arg) {
                args[arg[prop]] = msg[arg[prop]]
            }
        }
    })
    return args
}