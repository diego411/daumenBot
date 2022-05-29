const WLoggerController = require('../../controllers/wlogger')
const timeUtil = require('../../utils/time')

module.exports = {
    name: "randomweebdquote",
    arg_flags: ["raw_args", "sender_name"],
    code: async ({ raw_args, senderUsername }) => {
        const user_name = raw_args[0] || senderUsername

        const stats = await WLoggerController.statsForUser(user_name)
        if (!stats) return `Encountered problem with wlogger api`

        const randomQuote = stats.messages[Math.floor(Math.random() * stats.messages.length)]

        if (stats.message_count == 0) return `I have no weeb lines logged for this user NaM 👍`
        return `[#${randomQuote.channel}] (${timeUtil.relativeTime(randomQuote.post_timestamp * 1000)} ago) ${randomQuote.sender_login}: ${randomQuote.content}`
    },
    trigger: (command_name) => command_name === "randomweebdquote" || command_name === "rwq",
    cooldown: 10000,
    tagUser: false,
    banphraseCheckRequired: true
}