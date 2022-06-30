const wedController = require('../../controllers/wed')
const twitchController = require('../../controllers/twitch')
const formatUser = require('../../utils/formatter').formatUser

module.exports = {
    name: "weebcheck",
    arg_flags: ["raw_args", "sender"],
    code: async ({ raw_args }) => {
        if (/^\pfp:/.test(raw_args[0])) {
            const user_name = formatUser(raw_args[0].split(':')[1])
            if (!user_name) return `Invalid user name provided`

            const pfp = await twitchController.getProfilePicture(user_name)
            if (!pfp) return `Invalid user name provided`

            const stats = await wedController.weebCheckImageLink(pfp)
            if (!stats) return `Encountered problem with wed api`

            return `${user_name}'s profile picture is ${stats.is_weeb ? `` : `not`} weeb. (Confidence: ${Number(stats.confidence * 100).toFixed(2)}%)`
        }

        if (raw_args.length == 0) return `No channel or message provided`
        if (raw_args.length == 1) return `No message provided`

        const channel_name = raw_args[0]
        const message = raw_args.splice(1).join(" ")

        const stats = await wedController.weebCheck(channel_name, message)
        if (!stats) return `Encountered problem with wed api`

        return `The provided message is ${stats.is_weeb ? `` : `not`} weeb. (Confidence: ${Number(stats.confidence * 100).toFixed(2)}%)`
    },
    trigger: (command_name) => command_name === "weebcheck" || command_name === "wc",
    cooldown: 15000
}