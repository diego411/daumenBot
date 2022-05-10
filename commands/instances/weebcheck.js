const WedController = require('../../controllers/wed')

module.exports = {
    name: "weebcheck",
    arg_flags: ["raw_args", "sender"],
    code: async ({ raw_args }) => {
        if (raw_args.length == 0) return `No channel or message provided`
        if (raw_args.length == 1) return `No message provided`

        const channel_name = raw_args[0]
        const message = raw_args.splice(1).join(" ")

        const stats = await WedController.weebCheck(channel_name, message)
        if (!stats) return `Encountered problem with wed api`

        return `The provided message is ${stats.is_weeb ? `` : `not`} weeb. (Confidence: ${Number(stats.confidence * 100).toFixed(2)}%)`
    },
    trigger: (command_name) => command_name === "weebcheck" || command_name === "wc",
    cooldown: 2000
}