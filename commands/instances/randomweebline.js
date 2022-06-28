const wLoggerController = require('../../controllers/wlogger')
const twitchController = require('../../controllers/twitch')
const timeUtil = require('../../utils/time')
const formatUser = require('../../utils/formatter').formatUser

module.exports = {
    name: "randomweebline",
    arg_flags: ["raw_args", "sender_name", "channel_name"],
    code: async ({ raw_args, channelName }) => {
        let channel_name

        if (!raw_args[0])
            channel_name = channelName
        else channel_name = formatUser(raw_args[0])

        if (!channel_name || !(await twitchController.getUserId(channel_name)))
            return `Invalid channel provided`

        const stats = await wLoggerController.statsForChannel(channel_name)
        if (!stats) return `Encountered problem with wlogger api`

        if (!stats.exists)
            return `I never logged any messages in #${channel_name} NaM`

        const randomLine = stats.messages[Math.floor(Math.random() * stats.messages.length)]

        if (stats.message_count == 0) return `I have no weeb line logged in #${channel_name} NaM 👍`
        return `(${timeUtil.relativeTime(randomLine.post_timestamp * 1000)} ago) ${randomLine.sender_login}: ${randomLine.content}`
    },
    trigger: (command_name) => command_name === "randomweebline" || command_name === "rwl",
    cooldown: 10000,
    tagUser: false,
    banphraseCheckRequired: true
}
